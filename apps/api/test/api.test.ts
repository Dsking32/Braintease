import assert from "node:assert/strict";
import test from "node:test";
import { createApiServer } from "../src/app.ts";
import type {
  ApiStore,
  ChallengeRecord,
  OtpRecord,
  QuestionRecord,
  StoredAnswer,
  UserRecord,
} from "../src/contracts.ts";

const jwtSecret = "test-jwt-secret-that-is-at-least-thirty-two-characters";
const otpSecret = "test-otp-secret-that-is-at-least-thirty-two-characters";

class MemoryStore implements ApiStore {
  otp: OtpRecord | null = null;
  challenge: ChallengeRecord | null = null;
  answer: StoredAnswer | null = null;
  user: UserRecord = { id: "user-1", msisdn: "+2348012345678", role: "PLAYER", status: "ACTIVE" };
  question: QuestionRecord = {
    id: "question-1",
    status: "PUBLISHED",
    type: "MULTIPLE_CHOICE",
    text: "What is 2 + 2?",
    optionA: "3",
    optionB: "4",
    optionC: null,
    optionD: null,
    correctAnswer: "4",
    explanation: "Two plus two is four.",
    difficulty: 1,
    points: null,
    timeLimitSec: 30,
  };

  async createOtp(msisdn: string, codeHash: string, expiresAt: Date) {
    this.otp = { id: "otp-1", codeHash, expiresAt, attempts: 0, consumedAt: null };
    this.user.msisdn = msisdn;
  }

  async findLatestOtp() { return this.otp; }
  async incrementOtpAttempts() {
    if (!this.otp || this.otp.attempts >= 5) return false;
    this.otp.attempts += 1;
    return true;
  }
  async consumeOtp() {
    if (!this.otp || this.otp.consumedAt) return false;
    this.otp.consumedAt = new Date();
    return true;
  }
  async findOrCreateUser() { return this.user; }
  async findUser(id: string) { return id === this.user.id ? this.user : null; }
  async listPublishedQuestions() { return [this.question]; }

  async findDailyChallenge(userId: string, localDate: string) {
    return this.challenge?.userId === userId && this.challenge.localDate === localDate ? this.challenge : null;
  }

  async createChallenge(userId: string, localDate: string, questions: QuestionRecord[]) {
    this.challenge = {
      id: "challenge-1",
      userId,
      localDate,
      status: "IN_PROGRESS",
      totalQuestions: questions.length,
      correctAnswers: 0,
      totalScore: 0,
      questions: questions.map((question, order) => ({
        questionId: question.id,
        order,
        pointsAvailable: question.points ?? 0,
        servedAt: null,
        question,
      })),
      attempts: [],
    };
    return this.challenge;
  }

  async findChallenge(userId: string, challengeId: string) {
    return this.challenge?.userId === userId && this.challenge.id === challengeId ? this.challenge : null;
  }

  async markQuestionServed(challengeId: string, questionId: string, servedAt: Date) {
    const item = this.challenge?.questions.find((question) =>
      this.challenge?.id === challengeId && question.questionId === questionId);
    if (item && !item.servedAt) item.servedAt = servedAt;
  }

  async saveAnswer(answer: StoredAnswer) {
    this.answer = answer;
    if (!this.challenge) throw new Error("No challenge");
    this.challenge.attempts.push({ questionId: answer.questionId });
    this.challenge.correctAnswers += answer.correct ? 1 : 0;
    this.challenge.totalScore += answer.pointsAwarded;
    return { correctAnswers: this.challenge.correctAnswers, totalScore: this.challenge.totalScore };
  }

  async completeChallenge() {
    if (this.challenge) this.challenge.status = "COMPLETED";
  }
}

test("OTP auth gates the daily challenge and scores answers on the server", async (context) => {
  const store = new MemoryStore();
  const delivered: string[] = [];
  const server = createApiServer({
    store,
    otpDelivery: { async send(_msisdn, code) { delivered.push(code); } },
    jwtSecret,
    otpSecret,
    challengeQuestionCount: 1,
    makeOtp: () => "123456",
    now: () => new Date("2026-10-02T12:00:00.000Z"),
  });
  await new Promise<void>((resolve) => server.listen(0, resolve));
  context.after(() => new Promise<void>((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
  }));
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  const baseUrl = `http://127.0.0.1:${address.port}`;
  const requestOtp = await fetch(`${baseUrl}/api/v1/auth/request-otp`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ msisdn: "+2348012345678" }),
  });
  assert.equal(requestOtp.status, 202);
  assert.deepEqual(delivered, ["123456"]);

  const verifyOtp = await fetch(`${baseUrl}/api/v1/auth/verify-otp`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ msisdn: "+2348012345678", code: "123456" }),
  });
  assert.equal(verifyOtp.status, 200);
  const auth = await verifyOtp.json() as { token: string };
  const headers = { authorization: `Bearer ${auth.token}`, "content-type": "application/json" };

  const started = await fetch(`${baseUrl}/api/v1/challenges/start`, { method: "POST", headers, body: "{}" });
  assert.equal(started.status, 201);
  const challenge = (await started.json() as { challenge: { id: string } }).challenge;
  const next = await fetch(`${baseUrl}/api/v1/challenges/${challenge.id}/next`, { headers });
  assert.equal(next.status, 200);
  const question = (await next.json() as { question: Record<string, unknown> }).question;
  assert.equal(question.id, "question-1");
  assert.equal("correctAnswer" in question, false);

  const answer = await fetch(`${baseUrl}/api/v1/challenges/${challenge.id}/answer`, {
    method: "POST",
    headers,
    body: JSON.stringify({ questionId: "question-1", selectedAnswer: "4", pointsAwarded: 99_999 }),
  });
  assert.equal(answer.status, 200);
  const result = await answer.json() as { correct: boolean; pointsAwarded: number };
  assert.equal(result.correct, true);
  assert.equal(result.pointsAwarded, 60);
  assert.equal(store.answer?.pointsAwarded, 60);

  const completed = await fetch(`${baseUrl}/api/v1/challenges/${challenge.id}/complete`, {
    method: "POST",
    headers,
    body: "{}",
  });
  assert.equal(completed.status, 200);
  assert.equal(store.challenge?.status, "COMPLETED");
});

test("OTP requests are rate limited per phone number", async (context) => {
  const store = new MemoryStore();
  const server = createApiServer({
    store,
    otpDelivery: { async send() {} },
    jwtSecret,
    otpSecret,
    makeOtp: () => "123456",
  });
  await new Promise<void>((resolve) => server.listen(0, resolve));
  context.after(() => new Promise<void>((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
  }));
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  const url = `http://127.0.0.1:${address.port}/api/v1/auth/request-otp`;
  const statuses: number[] = [];
  for (let index = 0; index < 4; index += 1) {
    const response = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ msisdn: "+2348012345678" }),
    });
    statuses.push(response.status);
  }
  assert.deepEqual(statuses, [202, 202, 202, 429]);
});