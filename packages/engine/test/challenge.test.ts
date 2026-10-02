import assert from "node:assert/strict";
import test from "node:test";
import { scoreAnswer, selectPublishedQuestions } from "../src/challenge.ts";

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