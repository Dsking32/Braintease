import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scoreAnswer, adaptDifficulty, advanceStreak, challengeXp, localDate } from '../src/index.ts';

const base = { difficulty: 4, timeLimitSec: 30, servedAtMs: 0, correct: true };
test('fast correct answer gets +20%', () => assert.equal(scoreAnswer({ ...base, answeredAtMs: 5000 }).points, 150));
test('normal speed gets base', () => assert.equal(scoreAnswer({ ...base, answeredAtMs: 20000 }).points, 125));
test('wrong answer scores 0', () => assert.equal(scoreAnswer({ ...base, correct: false, answeredAtMs: 5000 }).points, 0));
test('timed out scores 0', () => assert.equal(scoreAnswer({ ...base, answeredAtMs: 40000 }).timedOut, true));
test('impossibly fast is flagged', () => { const r = scoreAnswer({ ...base, answeredAtMs: 100 }); assert.ok(r.flagged); assert.equal(r.points, 0); });
test('difficulty adapts and clamps', () => {
  assert.equal(adaptDifficulty(3, 0.9), 4); assert.equal(adaptDifficulty(3, 0.7), 3);
  assert.equal(adaptDifficulty(3, 0.5), 2); assert.equal(adaptDifficulty(6, 1), 6); assert.equal(adaptDifficulty(1, 0), 1);
});
test('streak increments, resets, and is idempotent', () => {
  let s = advanceStreak({ current: 0, longest: 0, lastDate: null }, '2026-10-01');
  s = advanceStreak(s, '2026-10-02'); assert.equal(s.current, 2);
  assert.deepEqual(advanceStreak(s, '2026-10-02'), s);
  assert.equal(advanceStreak(s, '2026-10-05').current, 1); assert.equal(advanceStreak(s, '2026-10-05').longest, 2);
});
test('xp: perfect + 7-day milestone', () => assert.equal(challengeXp(10, 10, 7), 250));
test('Lagos date rolls at local midnight', () => assert.equal(localDate(new Date('2026-10-01T23:30:00Z')), '2026-10-02'));
