const { test, describe } = require("node:test");
const assert = require("node:assert/strict");
const GymCalculator = require("../src/GymCalculator");

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