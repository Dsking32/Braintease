// Pure, server-side game rules. All tunables are injected (admin-configurable via SystemSetting).
export interface ScoringConfig {
  basePoints: Record<number, number>;
  speedTiers: { maxRatio: number; bonus: number }[];
  graceMs: number;
  minHumanMs: number;
}
export const DEFAULT_SCORING: ScoringConfig = {
  basePoints: { 1: 50, 2: 75, 3: 100, 4: 125, 5: 150, 6: 200 },
  speedTiers: [{ maxRatio: 0.25, bonus: 0.2 }, { maxRatio: 0.5, bonus: 0.1 }],
  graceMs: 1500,
  minHumanMs: 400,
};
export interface ScoreInput { difficulty: number; points?: number | null; timeLimitSec: number; servedAtMs: number; answeredAtMs: number; correct: boolean }
export interface ScoreResult { points: number; responseTimeMs: number; timedOut: boolean; flagged: boolean }

/** Elapsed time comes from server timestamps only; client-reported time is never used. */
export function scoreAnswer(i: ScoreInput, cfg = DEFAULT_SCORING): ScoreResult {
  const responseTimeMs = Math.max(0, i.answeredAtMs - i.servedAtMs);
  const limitMs = i.timeLimitSec * 1000;
  const timedOut = responseTimeMs > limitMs + cfg.graceMs;
  const flagged = responseTimeMs < cfg.minHumanMs;
  if (!i.correct || timedOut || flagged) return { points: 0, responseTimeMs, timedOut, flagged };
  const base = i.points ?? cfg.basePoints[i.difficulty] ?? 0;
  const tier = cfg.speedTiers.find(t => responseTimeMs / limitMs <= t.maxRatio);
  return { points: Math.round(base * (1 + (tier?.bonus ?? 0))), responseTimeMs, timedOut, flagged };
}

export interface DifficultyConfig { upAbove: number; downBelow: number; min: number; max: number }
export const DEFAULT_DIFFICULTY: DifficultyConfig = { upAbove: 0.85, downBelow: 0.65, min: 1, max: 6 };
export function adaptDifficulty(current: number, accuracy: number, c = DEFAULT_DIFFICULTY): number {
  const next = accuracy > c.upAbove ? current + 1 : accuracy < c.downBelow ? current - 1 : current;
  return Math.min(c.max, Math.max(c.min, next));
}

/** Calendar date (YYYY-MM-DD) in the product timezone. */
export function localDate(d: Date, tz = 'Africa/Lagos'): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: tz }).format(d);
}
const dayNum = (s: string) => Math.floor(Date.parse(s + 'T00:00:00Z') / 86400000);

export interface StreakState { current: number; longest: number; lastDate: string | null }
/** Call when a user completes their daily challenge. Idempotent within the same day. */
export function advanceStreak(s: StreakState, today: string): StreakState {
  if (s.lastDate === today) return s;
  const consecutive = s.lastDate !== null && dayNum(today) - dayNum(s.lastDate) === 1;
  const current = consecutive ? s.current + 1 : 1;
  return { current, longest: Math.max(s.longest, current), lastDate: today };
}

export interface XpConfig { completed: number; perfect: number; streakMilestones: Record<number, number> }
export const DEFAULT_XP: XpConfig = { completed: 100, perfect: 50, streakMilestones: { 7: 100, 30: 250, 100: 500 } };
export function challengeXp(correct: number, total: number, streak: number, c = DEFAULT_XP): number {
  return c.completed + (correct === total ? c.perfect : 0) + (c.streakMilestones[streak] ?? 0);
}
