import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import test from "node:test";
import { PrismaClient } from "@prisma/client";
import { PrismaStore } from "../src/prisma-store.ts";
import { createApiServer } from "../src/app.ts";

const databaseUrl = process.env.TEST_DATABASE_URL;
const integrationTest = databaseUrl ? test : test.skip;
const jwtSecret = "integration-jwt-secret-that-is-at-least-thirty-two-characters";
const otpSecret = "integration-otp-secret-that-is-at-least-thirty-two-characters";

integrationTest("PostgreSQL enforces subscription access and one challenge per Lagos day", async (context) => {
  process.env.DATABASE_URL = databaseUrl;
  const prisma = new PrismaClient({ datasourceUrl: databaseUrl });
  const store = new PrismaStore(prisma);
  const suffix = `${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`;
  const msisdn = `+23480${String(Date.now()).slice(-8)}`;
  let userId: string | undefined;

  try {
    await prisma.$connect();
    const user = await store.findOrCreateUser(msisdn);
    userId = user.id;
    const category = await prisma.category.create({ data: { name: `INTEGRATION-${suffix}` } });
    const plan = await prisma.plan.upsert({
      where: { code: "DAILY" },
      create: { code: "DAILY", name: "Daily", priceMinor: 10_000, interval: "DAY", intervalValue: 1 },
      update: { active: true },
    });
    const questionData = Array.from({ length: 10 }, (_, index) => ({
      categoryId: category.id,
      text: `Integration question ${suffix}-${index}`,
      optionA: "A",
      optionB: "B",
      correctAnswer: "A",
      difficulty: index % 6 + 1,
      status: "PUBLISHED" as const,
    }));
    await prisma.question.createMany({ data: questionData });
    const subscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        planId: plan.id,
        status: "PENDING",
        channel: "WEB",
        provider: "integration-test",
        startsAt: new Date("2020-01-01T00:00:00.000Z"),
        endsAt: new Date("2030-01-01T00:00:00.000Z"),
      },
    });

    const nowValue = { current: new Date("2026-10-01T22:59:59.000Z") };
    const now = () => nowValue.current;
    assert.equal(await store.hasActiveSubscription(user.id, now()), false);
    await prisma.subscription.update({ where: { id: subscription.id }, data: { status: "ACTIVE" } });
    assert.equal(await store.hasActiveSubscription(user.id, now()), true);
    assert.equal(await store.hasActiveSubscription(user.id, new Date("2031-01-01T00:00:00.000Z")), false);
    const previousDay = await store.createChallenge(user.id, "2026-10-01", await store.listPublishedQuestions());
    const difficultyFour = await prisma.question.findMany({ where: { difficulty: 4, status: "PUBLISHED" }, take: 10 });
    assert.ok(difficultyFour.length > 0);
    for (const [index, question] of difficultyFour.entries()) {
      await prisma.questionAttempt.create({
        data: {
          userId: user.id,
          challengeId: previousDay.id,
          questionId: question.id,
          selectedAnswer: question.correctAnswer,
          correct: true,
          responseTimeMs: 1000,
          pointsAwarded: 100,
          answeredAt: new Date(now().getTime() + index),
        },
      });
    }
    const initialAttempts = await store.listRecentAttempts(user.id, 50);
    assert.equal(initialAttempts.length, difficultyFour.length);
    assert.ok(initialAttempts.every((attempt) => attempt.correct));
    assert.ok(initialAttempts.every((attempt) => attempt.difficulty === 4));

    const server = createApiServer({
      store,
      otpDelivery: { async send() {} },
      jwtSecret,
      otpSecret,
      challengeTimeZone: "Africa/Lagos",
      challengeQuestionCount: 10,
      now,
    });
    await new Promise<void>((resolve) => server.listen(0, resolve));
    context.after(() => new Promise<void>((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve());
    }));
    const address = server.address();
    assert.ok(address && typeof address !== "string");
    const otpCode = "654321";
    await prisma.otpRequest.create({
      data: {
        msisdn,
        codeHash: createHmac("sha256", otpSecret).update(otpCode).digest("hex"),
        expiresAt: new Date(now().getTime() + 5 * 60_000),
      },
    });
    const authResponse = await fetch(`http://127.0.0.1:${address.port}/api/v1/auth/verify-otp`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ msisdn, code: otpCode }),
    });
    assert.equal(authResponse.status, 200);
    const { token } = await authResponse.json() as { token: string };
    const headers = { authorization: `Bearer ${token}`, "content-type": "application/json" };

    const previousLagosDay = await fetch(`http://127.0.0.1:${address.port}/api/v1/challenges/today`, { headers });
    assert.equal((await previousLagosDay.json() as { challenge: { id: string; date: string } }).challenge.id, previousDay.id);
    nowValue.current = new Date("2026-10-01T23:00:00.000Z");

    await prisma.subscription.update({ where: { id: subscription.id }, data: { status: "PENDING" } });
    const denied = await fetch(`http://127.0.0.1:${address.port}/api/v1/challenges/start`, {
      method: "POST", headers, body: "{}",
    });
    assert.equal(denied.status, 403);
    await prisma.subscription.update({ where: { id: subscription.id }, data: { status: "ACTIVE" } });

    const startUrl = `http://127.0.0.1:${address.port}/api/v1/challenges/start`;
    const start = await fetch(startUrl, { method: "POST", headers, body: "{}" });
    assert.equal(start.status, 201);
    const firstChallenge = (await start.json() as { challenge: { id: string; date: string } }).challenge;
    assert.equal(firstChallenge.date, "2026-10-02");
    const selectedQuestions = await prisma.challengeQuestion.findMany({
      where: { challengeId: firstChallenge.id },
      include: { question: { select: { difficulty: true } } },
      orderBy: { order: "asc" },
    });
    assert.equal(selectedQuestions.length, 10);
    assert.equal(selectedQuestions[0].question.difficulty, 5);

    const duplicateStart = await fetch(startUrl, { method: "POST", headers, body: "{}" });
    assert.equal(duplicateStart.status, 200);
    assert.equal((await duplicateStart.json() as { challenge: { id: string } }).challenge.id, firstChallenge.id);
    await assert.rejects(
      store.createChallenge(user.id, "2026-10-02", await store.listPublishedQuestions()),
      /Unique constraint/,
    );

    nowValue.current = new Date("2026-10-02T22:59:59.000Z");
    const today = await fetch(`http://127.0.0.1:${address.port}/api/v1/challenges/today`, { headers });
    assert.equal((await today.json() as { challenge: { id: string; date: string } }).challenge.id, firstChallenge.id);
    nowValue.current = new Date("2026-10-02T23:00:00.000Z");
    const nextDayStart = await fetch(startUrl, { method: "POST", headers, body: "{}" });
    assert.equal(nextDayStart.status, 201);
    const nextDayChallenge = (await nextDayStart.json() as { challenge: { id: string; date: string } }).challenge;
    assert.equal(nextDayChallenge.date, "2026-10-03");
    assert.notEqual(nextDayChallenge.id, firstChallenge.id);
  } finally {
    if (userId) {
      const userChallenges = await prisma.challenge.findMany({ where: { userId }, select: { id: true } });
      const challengeIds = userChallenges.map(({ id }) => id);
      await prisma.questionAttempt.deleteMany({ where: { userId } });
      await prisma.challengeQuestion.deleteMany({ where: { challengeId: { in: challengeIds } } });
      await prisma.challenge.deleteMany({ where: { userId } });
      await prisma.subscription.deleteMany({ where: { userId } });
      await prisma.otpRequest.deleteMany({ where: { msisdn } });
      await prisma.user.deleteMany({ where: { id: userId } });
    }
    await prisma.question.deleteMany({ where: { text: { startsWith: `Integration question ${suffix}-` } } });
    await prisma.category.deleteMany({ where: { name: { startsWith: `INTEGRATION-${suffix}` } } });
    await prisma.$disconnect();
  }
});