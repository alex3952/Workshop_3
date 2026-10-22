const { test } = require("node:test");
const assert = require("node:assert/strict");
const GymCalculator = require("../src/GymCalculator");

test("BASIC sin extras para un miembro cuesta 30", () => {
  const result = GymCalculator.calculate("BASIC", [], 1);

  assert.equal(result, 30);
});

test("STANDARD con PERSONAL_TRAINING cuesta 70", () => {
  const result = GymCalculator.calculate(
    "STANDARD",
    ["PERSONAL_TRAINING"],
    1
  );

  assert.equal(result, 70);
});

test("BASIC con SPA es inválido", () => {
  const result = GymCalculator.calculate("BASIC", ["SPA"], 1);

  assert.equal(result, -1);
});