import type { EngineQuestion } from "../../../packages/engine/src/challenge.ts";

export type OtpRecord = {
  id: string;
  codeHash: string;
  expiresAt: Date;
  attempts: number;
  consumedAt: Date | null;
};

export type UserRecord = {
  id: string;
  msisdn: string;
  role: string;
  status: string;
};

export type QuestionRecord = EngineQuestion & {
  type: string;
  text: string;
  optionA: string | null;
  optionB: string | null;
  optionC: string | null;
  optionD: string | null;
  correctAnswer: string;
  explanation: string | null;
  timeLimitSec: number;
};

export type ChallengeQuestionRecord = {
  questionId: string;
  order: number;
  pointsAvailable: number;
  servedAt: Date | null;
  question: QuestionRecord;
};

export type ChallengeRecord = {
  id: string;
  userId: string;
  localDate: string;
  status: string;
  totalQuestions: number;
  correctAnswers: number;
  totalScore: number;
  questions: ChallengeQuestionRecord[];
  attempts: { questionId: string }[];
};

export type StoredAnswer = {
  challengeId: string;
  userId: string;
  questionId: string;
  selectedAnswer: string | null;
  correct: boolean;
  responseTimeMs: number;
  pointsAwarded: number;
};

export interface ApiStore {
  createOtp(msisdn: string, codeHash: string, expiresAt: Date): Promise<void>;
  findLatestOtp(msisdn: string): Promise<OtpRecord | null>;
  incrementOtpAttempts(id: string): Promise<boolean>;
  consumeOtp(id: string): Promise<boolean>;
  findOrCreateUser(msisdn: string): Promise<UserRecord>;
  findUser(id: string): Promise<UserRecord | null>;
  listPublishedQuestions(): Promise<QuestionRecord[]>;
  findDailyChallenge(userId: string, localDate: string): Promise<ChallengeRecord | null>;
  createChallenge(userId: string, localDate: string, questions: QuestionRecord[]): Promise<ChallengeRecord>;
  findChallenge(userId: string, challengeId: string): Promise<ChallengeRecord | null>;
  markQuestionServed(challengeId: string, questionId: string, servedAt: Date): Promise<void>;
  saveAnswer(answer: StoredAnswer): Promise<{ correctAnswers: number; totalScore: number }>;
  completeChallenge(challengeId: string, completedAt: Date): Promise<void>;
}

export interface OtpDelivery {
  send(msisdn: string, code: string): Promise<void>;
}