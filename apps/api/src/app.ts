import { createHmac, randomInt, timingSafeEqual } from "node:crypto";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { scoreAnswer, selectPublishedQuestions } from "../../../packages/engine/src/challenge.ts";
import type { ApiStore, OtpDelivery, UserRecord } from "./contracts.ts";

type ApiOptions = {
  store: ApiStore;
  otpDelivery: OtpDelivery;
  jwtSecret: string;
  otpSecret: string;
  challengeQuestionCount?: number;
  challengeTimeZone?: string;
  now?: () => Date;
  makeOtp?: () => string;
};

class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

class FixedWindowLimiter {
  private windows = new Map<string, { start: number; count: number; durationMs: number }>();
  private now: () => number;

  constructor(now: () => number) {
    this.now = now;
  }

  take(key: string, limit: number, durationMs: number): boolean {
    const currentTime = this.now();
    const window = this.windows.get(key);
    if (!window || currentTime - window.start >= durationMs) {
      if (!window && this.windows.size >= 20_000) {
        for (const [windowKey, item] of this.windows) {
          if (currentTime - item.start >= item.durationMs) this.windows.delete(windowKey);
        }
        if (this.windows.size >= 20_000) return false;
      }
      this.windows.set(key, { start: currentTime, count: 1, durationMs });
      return true;
    }
    if (window.count >= limit) return false;
    window.count += 1;
    return true;
  }
}

function encode(value: object): string {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

function signToken(user: UserRecord, secret: string, now: Date): string {
  const header = encode({ alg: "HS256", typ: "JWT" });
  const payload = encode({ sub: user.id, role: user.role, exp: Math.floor(now.getTime() / 1000) + 60 * 60 * 24 * 14 });
  const content = `${header}.${payload}`;
  const signature = createHmac("sha256", secret).update(content).digest("base64url");
  return `${content}.${signature}`;
}

function verifyToken(token: string, secret: string, now: Date): string | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const content = `${parts[0]}.${parts[1]}`;
  const expected = createHmac("sha256", secret).update(content).digest();
  let actual: Buffer;
  try {
    actual = Buffer.from(parts[2], "base64url");
  } catch {
    return null;
  }
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;
  try {
    const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString()) as { sub?: unknown; exp?: unknown };
    if (typeof payload.sub !== "string" || typeof payload.exp !== "number") return null;
    if (payload.exp <= Math.floor(now.getTime() / 1000)) return null;
    return payload.sub;
  } catch {
    return null;
  }
}

function hashOtp(code: string, secret: string): string {
  return createHmac("sha256", secret).update(code).digest("hex");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function readJson(request: IncomingMessage): Promise<Record<string, unknown>> {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buffer.length;
    if (size > 16_384) throw new HttpError(413, "Request body is too large");
    chunks.push(buffer);
  }
  if (size === 0) return {};
  try {
    const body: unknown = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!isRecord(body)) throw new Error("Expected a JSON object");
    return body;
  } catch {
    throw new HttpError(400, "Invalid JSON body");
  }
}

function send(response: ServerResponse, status: number, value: unknown): void {
  response.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(value));
}

function safeUser(user: UserRecord): object {
  return { id: user.id, role: user.role, status: user.status };
}

export function createApiServer(options: ApiOptions) {
  if (options.jwtSecret.length < 32 || options.otpSecret.length < 32) {
    throw new Error("JWT_SECRET and OTP_SECRET must each be at least 32 characters");
  }

  const now = options.now ?? (() => new Date());
  const limiter = new FixedWindowLimiter(() => now().getTime());
  const questionCount = options.challengeQuestionCount ?? 10;
  if (!Number.isInteger(questionCount) || questionCount < 1) {
    throw new Error("challengeQuestionCount must be a positive integer");
  }
  const challengeTimeZone = options.challengeTimeZone ?? "UTC";
  const localDate = () => {
    const dateParts = new Intl.DateTimeFormat("en-CA", {
      timeZone: challengeTimeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(now());
    const parts = Object.fromEntries(dateParts.map(({ type, value }) => [type, value]));
    return `${parts.year}-${parts.month}-${parts.day}`;
  };

  return createServer(async (request, response) => {
    response.setHeader("x-content-type-options", "nosniff");
    response.setHeader("x-frame-options", "DENY");
    response.setHeader("referrer-policy", "no-referrer");
    response.setHeader("cache-control", "no-store");

    const clientIp = request.socket.remoteAddress ?? "unknown";
    if (!limiter.take(`api:${clientIp}`, 120, 60_000)) {
      send(response, 429, { error: "Too many requests" });
      return;
    }

    try {
      const url = new URL(request.url ?? "/", "http://localhost");
      const path = url.pathname.replace(/\/$/, "") || "/";
      const method = request.method ?? "GET";

      if (method === "POST" && path === "/api/v1/auth/request-otp") {
        const body = await readJson(request);
        const msisdn = body.msisdn;
        if (typeof msisdn !== "string" || !/^\+[1-9]\d{7,14}$/.test(msisdn)) {
          throw new HttpError(400, "msisdn must be a valid E.164 phone number");
        }
        if (!limiter.take(`otp:phone:${msisdn}`, 3, 15 * 60_000) ||
          !limiter.take(`otp:ip:${clientIp}`, 10, 15 * 60_000)) {
          throw new HttpError(429, "Too many OTP requests");
        }
        const code = options.makeOtp?.() ?? randomInt(0, 1_000_000).toString().padStart(6, "0");
        await options.store.createOtp(msisdn, hashOtp(code, options.otpSecret), new Date(now().getTime() + 5 * 60_000));
        await options.otpDelivery.send(msisdn, code);
        send(response, 202, { message: "If the number is eligible, a verification code has been sent" });
        return;
      }

      if (method === "POST" && path === "/api/v1/auth/verify-otp") {
        const body = await readJson(request);
        const msisdn = body.msisdn;
        const code = body.code;
        if (typeof msisdn !== "string" || !/^\+[1-9]\d{7,14}$/.test(msisdn) ||
          typeof code !== "string" || !/^\d{6}$/.test(code)) {
          throw new HttpError(400, "A valid msisdn and six-digit code are required");
        }
        const otp = await options.store.findLatestOtp(msisdn);
        if (!otp || otp.consumedAt || otp.expiresAt <= now() || otp.attempts >= 5) {
          throw new HttpError(401, "Invalid or expired verification code");
        }
        if (!await options.store.incrementOtpAttempts(otp.id)) {
          throw new HttpError(401, "Invalid or expired verification code");
        }
        const actual = Buffer.from(hashOtp(code, options.otpSecret), "hex");
        const expected = Buffer.from(otp.codeHash, "hex");
        if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
          throw new HttpError(401, "Invalid or expired verification code");
        }
        if (!await options.store.consumeOtp(otp.id)) {
          throw new HttpError(401, "Invalid or expired verification code");
        }
        const user = await options.store.findOrCreateUser(msisdn);
        if (user.status !== "ACTIVE") throw new HttpError(403, "Account is not active");
        send(response, 200, { token: signToken(user, options.jwtSecret, now()), user: safeUser(user) });
        return;
      }

      const authorization = request.headers.authorization;
      const token = authorization?.startsWith("Bearer ") ? authorization.slice(7) : "";
      const userId = verifyToken(token, options.jwtSecret, now());
      if (!userId) throw new HttpError(401, "Authentication required");
      const user = await options.store.findUser(userId);
      if (!user || user.status !== "ACTIVE") throw new HttpError(401, "Authentication required");

      if (method === "GET" && path === "/api/v1/me") {
        send(response, 200, { user: safeUser(user) });
        return;
      }

      if (method === "GET" && path === "/api/v1/challenges/today") {
        const challenge = await options.store.findDailyChallenge(userId, localDate());
        send(response, 200, challenge
          ? { challenge: publicChallenge(challenge) }
          : { challenge: null, availableQuestions: questionCount });
        return;
      }

      if (method === "POST" && path === "/api/v1/challenges/start") {
        const today = localDate();
        const existing = await options.store.findDailyChallenge(userId, today);
        if (existing) {
          send(response, 200, { challenge: publicChallenge(existing) });
          return;
        }
        const published = await options.store.listPublishedQuestions();
        const selected = selectPublishedQuestions(published, questionCount);
        if (selected.length < questionCount) throw new HttpError(503, "Not enough published questions to start a challenge");
        const challenge = await options.store.createChallenge(userId, today, selected);
        send(response, 201, { challenge: publicChallenge(challenge) });
        return;
      }

      const nextMatch = path.match(/^\/api\/v1\/challenges\/([^/]+)\/next$/);
      if (method === "GET" && nextMatch) {
        const challenge = await options.store.findChallenge(userId, nextMatch[1]);
        if (!challenge) throw new HttpError(404, "Challenge not found");
        if (challenge.status !== "IN_PROGRESS") throw new HttpError(409, "Challenge is not in progress");
        const answered = new Set(challenge.attempts.map((attempt) => attempt.questionId));
        const next = challenge.questions.find((item) => !answered.has(item.questionId));
        if (!next) {
          send(response, 200, { question: null, complete: true });
          return;
        }
        if (!next.servedAt) await options.store.markQuestionServed(challenge.id, next.questionId, now());
        const refreshed = next.servedAt
          ? next
          : (await options.store.findChallenge(userId, challenge.id))?.questions.find((item) => item.questionId === next.questionId) ?? next;
        send(response, 200, {
          question: {
            id: refreshed.question.id,
            text: refreshed.question.text,
            type: refreshed.question.type,
            options: [refreshed.question.optionA, refreshed.question.optionB, refreshed.question.optionC, refreshed.question.optionD].filter((value) => value !== null),
            difficulty: refreshed.question.difficulty,
            timeLimitSec: refreshed.question.timeLimitSec,
            order: refreshed.order,
          },
          complete: false,
        });
        return;
      }

      const answerMatch = path.match(/^\/api\/v1\/challenges\/([^/]+)\/answer$/);
      if (method === "POST" && answerMatch) {
        const body = await readJson(request);
        if (typeof body.questionId !== "string" ||
          (body.selectedAnswer !== null && typeof body.selectedAnswer !== "string") ||
          (typeof body.selectedAnswer === "string" && body.selectedAnswer.length > 300)) {
          throw new HttpError(400, "questionId and a valid selectedAnswer are required");
        }
        const challenge = await options.store.findChallenge(userId, answerMatch[1]);
        if (!challenge) throw new HttpError(404, "Challenge not found");
        if (challenge.status !== "IN_PROGRESS") throw new HttpError(409, "Challenge is not in progress");
        const item = challenge.questions.find((question) => question.questionId === body.questionId);
        if (!item) throw new HttpError(404, "Question is not part of this challenge");
        if (challenge.attempts.some((attempt) => attempt.questionId === item.questionId)) {
          throw new HttpError(409, "Question has already been answered");
        }
        const firstUnanswered = challenge.questions.find((question) =>
          !challenge.attempts.some((attempt) => attempt.questionId === question.questionId));
        if (firstUnanswered?.questionId !== item.questionId || !item.servedAt) {
          throw new HttpError(409, "Fetch the next question before answering");
        }
        const elapsedMs = Math.max(0, now().getTime() - item.servedAt.getTime());
        const inTimeAnswer = elapsedMs <= item.question.timeLimitSec * 1000 ? body.selectedAnswer as string | null : null;
        const score = scoreAnswer({
          expectedAnswer: item.question.correctAnswer,
          selectedAnswer: inTimeAnswer,
          difficulty: item.question.difficulty,
          configuredPoints: item.question.points,
          elapsedMs,
          timeLimitSec: item.question.timeLimitSec,
        });
        const totals = await options.store.saveAnswer({
          challengeId: challenge.id,
          userId,
          questionId: item.questionId,
          selectedAnswer: body.selectedAnswer as string | null,
          correct: score.correct,
          responseTimeMs: score.responseTimeMs,
          pointsAwarded: score.pointsAwarded,
        });
        send(response, 200, {
          correct: score.correct,
          pointsAwarded: score.pointsAwarded,
          responseTimeMs: score.responseTimeMs,
          totalScore: totals.totalScore,
          correctAnswers: totals.correctAnswers,
          explanation: item.question.explanation,
        });
        return;
      }

      const completeMatch = path.match(/^\/api\/v1\/challenges\/([^/]+)\/complete$/);
      if (method === "POST" && completeMatch) {
        const challenge = await options.store.findChallenge(userId, completeMatch[1]);
        if (!challenge) throw new HttpError(404, "Challenge not found");
        if (challenge.status === "COMPLETED") {
          send(response, 200, { challenge: publicChallenge(challenge) });
          return;
        }
        if (challenge.status !== "IN_PROGRESS" || challenge.attempts.length !== challenge.totalQuestions) {
          throw new HttpError(409, "Answer every question before completing the challenge");
        }
        await options.store.completeChallenge(challenge.id, now());
        const completed = await options.store.findChallenge(userId, challenge.id);
        send(response, 200, { challenge: completed ? publicChallenge(completed) : null });
        return;
      }

      throw new HttpError(404, "Route not found");
    } catch (error) {
      if (response.headersSent) return;
      const status = error instanceof HttpError ? error.status : 500;
      const message = error instanceof HttpError ? error.message : "Internal server error";
      send(response, status, { error: message });
    }
  });
}

function publicChallenge(challenge: {
  id: string;
  localDate: string;
  status: string;
  totalQuestions: number;
  correctAnswers: number;
  totalScore: number;
}) {
  return {
    id: challenge.id,
    date: challenge.localDate,
    status: challenge.status,
    totalQuestions: challenge.totalQuestions,
    correctAnswers: challenge.correctAnswers,
    totalScore: challenge.totalScore,
  };
}