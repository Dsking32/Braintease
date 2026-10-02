import type { Prisma, PrismaClient } from "@prisma/client";
import { basePointsForDifficulty } from "../../../packages/engine/src/challenge.ts";
import type {
  ApiStore,
  ChallengeRecord,
  OtpRecord,
  QuestionRecord,
  StoredAnswer,
  UserRecord,
} from "./contracts.ts";

const challengeRelations = {
  questions: {
    include: { question: true },
    orderBy: { order: "asc" as const },
  },
  attempts: { select: { questionId: true } },
} satisfies Prisma.ChallengeInclude;

export class PrismaStore implements ApiStore {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async createOtp(msisdn: string, codeHash: string, expiresAt: Date): Promise<void> {
    await this.prisma.otpRequest.create({ data: { msisdn, codeHash, expiresAt } });
  }

  async findLatestOtp(msisdn: string): Promise<OtpRecord | null> {
    return this.prisma.otpRequest.findFirst({
      where: { msisdn, consumedAt: null },
      orderBy: { createdAt: "desc" },
      select: { id: true, codeHash: true, expiresAt: true, attempts: true, consumedAt: true },
    });
  }

  async incrementOtpAttempts(id: string): Promise<boolean> {
    const result = await this.prisma.otpRequest.updateMany({
      where: { id, consumedAt: null, attempts: { lt: 5 } },
      data: { attempts: { increment: 1 } },
    });
    return result.count === 1;
  }

  async consumeOtp(id: string): Promise<boolean> {
    const result = await this.prisma.otpRequest.updateMany({
      where: { id, consumedAt: null },
      data: { consumedAt: new Date() },
    });
    return result.count === 1;
  }

  async findOrCreateUser(msisdn: string): Promise<UserRecord> {
    return this.prisma.user.upsert({
      where: { msisdn },
      create: { msisdn },
      update: {},
      select: { id: true, msisdn: true, role: true, status: true },
    });
  }

  async findUser(id: string): Promise<UserRecord | null> {
    return this.prisma.user.findUnique({
      where: { id },
      select: { id: true, msisdn: true, role: true, status: true },
    });
  }

  async hasActiveSubscription(userId: string, at: Date): Promise<boolean> {
    const subscription = await this.prisma.subscription.findFirst({
      where: {
        userId,
        status: "ACTIVE",
        startsAt: { lte: at },
        endsAt: { gt: at },
        plan: { is: { active: true } },
      },
      select: { id: true },
    });
    return subscription !== null;
  }

  async listRecentAttempts(userId: string, limit: number): Promise<{ correct: boolean; difficulty: number }[]> {
    const attempts = await this.prisma.questionAttempt.findMany({
      where: { userId },
      select: { correct: true, question: { select: { difficulty: true } } },
      orderBy: { answeredAt: "desc" },
      take: limit,
    });
    return attempts.map((attempt) => ({ correct: attempt.correct, difficulty: attempt.question.difficulty }));
  }

  async listPublishedQuestions(): Promise<QuestionRecord[]> {
    return this.prisma.question.findMany({ where: { status: "PUBLISHED" } });
  }

  async findDailyChallenge(userId: string, localDate: string): Promise<ChallengeRecord | null> {
    return this.prisma.challenge.findUnique({
      where: { userId_localDate: { userId, localDate } },
      include: challengeRelations,
    });
  }

  async createChallenge(userId: string, localDate: string, questions: QuestionRecord[]): Promise<ChallengeRecord> {
    const created = await this.prisma.challenge.create({
      data: {
        userId,
        localDate,
        totalQuestions: questions.length,
        questions: {
          create: questions.map((question, order) => ({
            questionId: question.id,
            order,
            pointsAvailable: question.points ?? basePointsForDifficulty(question.difficulty),
          })),
        },
      },
      select: { id: true },
    });
    const challenge = await this.findChallenge(userId, created.id);
    if (!challenge) throw new Error("Created challenge could not be loaded");
    return challenge;
  }

  async findChallenge(userId: string, challengeId: string): Promise<ChallengeRecord | null> {
    return this.prisma.challenge.findFirst({
      where: { id: challengeId, userId },
      include: challengeRelations,
    });
  }

  async markQuestionServed(challengeId: string, questionId: string, servedAt: Date): Promise<void> {
    await this.prisma.challengeQuestion.updateMany({
      where: { challengeId, questionId, servedAt: null },
      data: { servedAt },
    });
  }

  async saveAnswer(answer: StoredAnswer): Promise<{ correctAnswers: number; totalScore: number }> {
    return this.prisma.$transaction(async (transaction) => {
      await transaction.questionAttempt.create({ data: answer });
      const challenge = await transaction.challenge.update({
        where: { id: answer.challengeId },
        data: {
          correctAnswers: { increment: answer.correct ? 1 : 0 },
          totalScore: { increment: answer.pointsAwarded },
        },
        select: { correctAnswers: true, totalScore: true },
      });
      return challenge;
    });
  }

  async completeChallenge(challengeId: string, completedAt: Date): Promise<void> {
    await this.prisma.challenge.update({
      where: { id: challengeId },
      data: { status: "COMPLETED", completedAt },
    });
  }

  async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
}