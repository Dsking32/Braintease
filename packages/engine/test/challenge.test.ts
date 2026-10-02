import assert from "node:assert/strict";
import test from "node:test";
import {
  scoreAnswer,
  selectAdaptiveQuestions,
  selectPublishedQuestions,
  targetDifficultyFromAttempts,
} from "../src/challenge.ts";

test("challenge selection excludes unpublished questions and caps the result", () => {
  const questions = [
    { id: "a", status: "PUBLISHED", difficulty: 1, points: null },
    { id: "b", status: "DRAFT", difficulty: 2, points: null },
    { id: "c", status: "PUBLISHED", difficulty: 3, points: 90 },
  ];

  const selected = selectPublishedQuestions(questions, 1, () => 0);

  assert.equal(selected.length, 1);
  assert.equal(selected[0].status, "PUBLISHED");
  assert.equal(selectPublishedQuestions(questions, 10).length, 2);
});

test("scoring applies configured base points and server-measured speed bonus", () => {
  assert.deepEqual(scoreAnswer({
    expectedAnswer: "B",
    selectedAnswer: "b",
    difficulty: 1,
    configuredPoints: null,
    elapsedMs: 2_000,
    timeLimitSec: 30,
  }), { correct: true, pointsAwarded: 60, responseTimeMs: 2_000 });

  assert.deepEqual(scoreAnswer({
    expectedAnswer: "B",
    selectedAnswer: "A",
    difficulty: 1,
    configuredPoints: null,
    elapsedMs: 1_000,
    timeLimitSec: 30,
  }), { correct: false, pointsAwarded: 0, responseTimeMs: 1_000 });
});

test("adaptive target rises or falls from recent accuracy and respects difficulty bounds", () => {
  const strong = Array.from({ length: 10 }, () => ({ difficulty: 3, correct: true }));
  const weak = Array.from({ length: 10 }, (_, index) => ({ difficulty: 3, correct: index < 6 }));

  assert.equal(targetDifficultyFromAttempts([]), 3);
  assert.equal(targetDifficultyFromAttempts(strong), 4);
  assert.equal(targetDifficultyFromAttempts(weak), 2);
  assert.equal(targetDifficultyFromAttempts(Array.from({ length: 10 }, () => ({ difficulty: 1, correct: false }))), 1);
  assert.equal(targetDifficultyFromAttempts(Array.from({ length: 10 }, () => ({ difficulty: 6, correct: true }))), 6);
});

test("adaptive selection prioritizes target difficulty and randomizes peers", () => {
  const questions = [
    { id: "a", status: "PUBLISHED", difficulty: 2, points: null },
    { id: "b", status: "PUBLISHED", difficulty: 3, points: null },
    { id: "c", status: "PUBLISHED", difficulty: 3, points: null },
    { id: "d", status: "PUBLISHED", difficulty: 4, points: null },
  ];
  const peers = questions.filter((question) => question.difficulty === 3);

  assert.equal(selectAdaptiveQuestions(questions, 1, 2)[0].difficulty, 2);
  assert.notEqual(
    selectAdaptiveQuestions(peers, 1, 3, () => 0)[0].id,
    selectAdaptiveQuestions(peers, 1, 3, () => 0.999)[0].id,
  );
});