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

describe("R5 oferta especial", () => {
  test("monto de 198 (no mayor que 200) no recibe oferta", () => {
    // (70 + 15 + 25) x 2 = 220 -> 198 tras R4
    const r = GymCalculator.calculate(
      "PREMIUM",
      ["GROUP_CLASSES", "PERSONAL_TRAINING"],
      2
    );
    assert.equal(r.specialDiscount, 0);
    assert.equal(r.total, 198);
  });

  test("monto mayor que 200 y hasta 400 resta 20 (306 -> 286)", () => {
    const r = GymCalculator.calculate(
      "STANDARD",
      ["GROUP_CLASSES", "PERSONAL_TRAINING"],
      4
    );
    assert.equal(r.specialDiscount, 20);
    assert.equal(r.total, 286);
  });

  test("monto de 396 (no mayor que 400) resta solo 20", () => {
    // 440 -> 396 tras R4 -> 376
    const r = GymCalculator.calculate(
      "PREMIUM",
      ["GROUP_CLASSES", "PERSONAL_TRAINING"],
      4
    );
    assert.equal(r.specialDiscount, 20);
    assert.equal(r.total, 376);
  });

  test("monto mayor que 400 resta solo 50, no 70", () => {
    // 460 -> 414 tras R4 -> 364 -> x1.15 = 418.6 -> 419
    const r = GymCalculator.calculate(
      "PREMIUM",
      ["GROUP_CLASSES", "SPA"],
      4
    );
    assert.equal(r.specialDiscount, 50);
    assert.equal(r.total, 419);
  });
});

describe("R9: Tabla oficial de pruebas completa", () => {
  const officialTable = [
    { plan: "BASIC", extras: [], members: 1, expected: 30 },
    { plan: "STANDARD", extras: ["PERSONAL_TRAINING"], members: 1, expected: 70 },
    { plan: "BASIC", extras: ["GROUP_CLASSES"], members: 2, expected: 81 },
    { plan: "BASIC", extras: ["GROUP_CLASSES"], members: 3, expected: 122 },
    { plan: "STANDARD", extras: ["GROUP_CLASSES", "PERSONAL_TRAINING"], members: 4, expected: 286 },
    { plan: "PREMIUM", extras: ["GROUP_CLASSES", "SPA"], members: 2, expected: 215 },
    { plan: "PREMIUM", extras: ["SPA", "SPECIALIZED_PROGRAM"], members: 3, expected: 412 },
    { plan: "PREMIUM", extras: ["SPA", "SPECIALIZED_PROGRAM", "PERSONAL_TRAINING"], members: 4, expected: 626 },
    { plan: "BASIC", extras: ["SPA"], members: 1, expected: -1 },
    { plan: "GOLD", extras: [], members: 1, expected: -1 },
    { plan: "BASIC", extras: [], members: 0, expected: -1 },
  ];

  for (const row of officialTable) {
    test(`Plan: ${row.plan}, Extras: [${row.extras.join(", ")}], Members: ${row.members} -> Result: ${row.expected}`, () => {
      const result = GymCalculator.calculate(row.plan, row.extras, row.members);
      const actual = result.valid ? result.total : -1;
      assert.equal(actual, row.expected);
    });
  }
});