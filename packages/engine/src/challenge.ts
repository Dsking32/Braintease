export type EngineQuestion = {
  id: string;
  status: string;
  difficulty: number;
  points: number | null;
};

export type ScoreResult = {
  correct: boolean;
  pointsAwarded: number;
  responseTimeMs: number;
};

const defaultPointsByDifficulty: Record<number, number> = {
  1: 50,
  2: 75,
  3: 100,
  4: 125,
  5: 150,
  6: 200,
};

export function basePointsForDifficulty(difficulty: number): number {
  return defaultPointsByDifficulty[difficulty] ?? 0;
}

export function selectPublishedQuestions<T extends EngineQuestion>(
  questions: T[],
  count: number,
  random: () => number = Math.random,
): T[] {
  const eligible = questions.filter((question) => question.status === "PUBLISHED");
  for (let index = eligible.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [eligible[index], eligible[swapIndex]] = [eligible[swapIndex], eligible[index]];
  }
  return eligible.slice(0, Math.max(0, count));
}

export function scoreAnswer(input: {
  expectedAnswer: string;
  selectedAnswer: string | null;
  difficulty: number;
  configuredPoints: number | null;
  elapsedMs: number;
  timeLimitSec: number;
  pointsByDifficulty?: Record<number, number>;
}): ScoreResult {
  const responseTimeMs = Math.max(0, Math.floor(input.elapsedMs));
  const correct = input.selectedAnswer?.trim().toLocaleLowerCase() ===
    input.expectedAnswer.trim().toLocaleLowerCase();

  if (!correct) return { correct, pointsAwarded: 0, responseTimeMs };

  const base = input.configuredPoints ??
    input.pointsByDifficulty?.[input.difficulty] ?? basePointsForDifficulty(input.difficulty);
  const timeLimitMs = Math.max(0, input.timeLimitSec * 1000);
  const speedMultiplier = responseTimeMs <= timeLimitMs * 0.25
    ? 1.2
    : responseTimeMs <= timeLimitMs * 0.5
      ? 1.1
      : 1;

  return {
    correct,
    pointsAwarded: Math.round(base * speedMultiplier),
    responseTimeMs,
  };
}