
const { test, describe } = require("node:test");
const assert = require("node:assert/strict");
const GymCalculator = require("../src/GymCalculator");

test("BASIC sin extras para un miembro cuesta 30", () => {
  const result = GymCalculator.calculate("BASIC", [], 1);

  assert.equal(result.total, 30);
});

test("STANDARD con PERSONAL_TRAINING cuesta 70", () => {
  const result = GymCalculator.calculate(
    "STANDARD",
    ["PERSONAL_TRAINING"],
    1
  );

  assert.equal(result.total, 70);
});

test("BASIC con SPA es inválido", () => {
  const result = GymCalculator.calculate("BASIC", ["SPA"], 1);

  assert.equal(result.valid, false);
  assert.equal(result.total, -1);
});

describe("R4 descuento grupal", () => {
  test("con 1 miembro no hay descuento", () => {
    assert.equal(
      GymCalculator.calculate("STANDARD", [], 1).total,
      45
    );
  });

  test("con 2 miembros se aplica 10% (90 -> 81)", () => {
    assert.equal(
      GymCalculator.calculate("BASIC", ["GROUP_CLASSES"], 2).total,
      81
    );
  });

  test("con 3 miembros se aplica 10% y se redondea half up (121.5 -> 122)", () => {
    assert.equal(
      GymCalculator.calculate("BASIC", ["GROUP_CLASSES"], 3).total,
      122
    );
  });
});
