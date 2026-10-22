const { test } = require("node:test");
const assert = require("node:assert/strict");
const GymCalculator = require("../src/GymCalculator");

// R1. Planes
test("R1: cada plan de la tabla devuelve su precio", () => {
  assert.equal(GymCalculator.getPlanPrice("BASIC"), 30);
  assert.equal(GymCalculator.getPlanPrice("STANDARD"), 45);
  assert.equal(GymCalculator.getPlanPrice("PREMIUM"), 70);
});

test("R1: un plan que no está en la tabla es inválido", () => {
  assert.equal(GymCalculator.getPlanPrice("GOLD"), null);
  assert.equal(GymCalculator.getPlanPrice("basic"), null);
  assert.equal(GymCalculator.getPlanPrice("toString"), null);
  assert.equal(GymCalculator.calculate("GOLD", [], 1).total, -1);
});

// R2. Extras
test("R2: sin extras el precio de extras es 0", () => {
  assert.equal(GymCalculator.getExtrasPrice("BASIC", []), 0);
});

test("R2: se suman los extras elegidos", () => {
  assert.equal(
    GymCalculator.getExtrasPrice("STANDARD", ["GROUP_CLASSES", "PERSONAL_TRAINING"]),
    40
  );
  assert.equal(
    GymCalculator.getExtrasPrice("PREMIUM", ["SPA", "SPECIALIZED_PROGRAM"]),
    70
  );
});

test("R2: un extra desconocido es inválido", () => {
  assert.equal(GymCalculator.getExtrasPrice("BASIC", ["SAUNA"]), null);
  assert.equal(GymCalculator.calculate("BASIC", ["SAUNA"], 1).total, -1);
});

test("R2: un extra premium sin plan PREMIUM es inválido", () => {
  assert.equal(GymCalculator.getExtrasPrice("BASIC", ["SPA"]), null);
  assert.equal(GymCalculator.getExtrasPrice("STANDARD", ["SPECIALIZED_PROGRAM"]), null);
  assert.equal(GymCalculator.calculate("BASIC", ["SPA"], 1).total, -1);
});

test("R2: un extra repetido es inválido (supuesto del equipo)", () => {
  assert.equal(GymCalculator.getExtrasPrice("BASIC", ["GROUP_CLASSES", "GROUP_CLASSES"]), null);
});

test("R2: detecta si hay al menos un extra premium", () => {
  assert.equal(GymCalculator.hasPremiumExtra(["GROUP_CLASSES", "SPA"]), true);
  assert.equal(GymCalculator.hasPremiumExtra(["GROUP_CLASSES"]), false);
  assert.equal(GymCalculator.hasPremiumExtra([]), false);
});

// R3. Subtotal
test("R3: subtotal = (plan + extras) x miembros", () => {
  assert.equal(GymCalculator.calculateSubtotal("BASIC", [], 1), 30);
  assert.equal(GymCalculator.calculateSubtotal("BASIC", ["GROUP_CLASSES"], 3), 135);
  assert.equal(
    GymCalculator.calculateSubtotal("PREMIUM", ["SPA", "SPECIALIZED_PROGRAM", "PERSONAL_TRAINING"], 4),
    660
  );
});

test("R3: el número de miembros debe ser un entero de al menos 1", () => {
  assert.equal(GymCalculator.calculateSubtotal("BASIC", [], 0), null);
  assert.equal(GymCalculator.calculateSubtotal("BASIC", [], -2), null);
  assert.equal(GymCalculator.calculateSubtotal("BASIC", [], 1.5), null);
  assert.equal(GymCalculator.calculate("BASIC", [], 0).total, -1);
});

// R7. Resultado y redondeo
test("R7: redondea half up a entero", () => {
  assert.equal(GymCalculator.roundHalfUp(121.5), 122);
  assert.equal(GymCalculator.roundHalfUp(121.49), 121);
  assert.equal(GymCalculator.roundHalfUp(215.05), 215);
  assert.equal(GymCalculator.roundHalfUp(625.6), 626);
});

test("R7: el redondeo tolera errores de coma flotante", () => {
  assert.equal(GymCalculator.roundHalfUp(80.99999999999999), 81);
  assert.equal(GymCalculator.roundHalfUp(2.4999999999999996), 3);
});

test("R7: el redondeo se aplica solo al final", () => {
  // BASIC + GROUP_CLASSES, 3 miembros: 135 -> 121.5 -> 122
  assert.equal(GymCalculator.calculate("BASIC", ["GROUP_CLASSES"], 3).total, 122);
});

test("R7: una selección inválida devuelve -1", () => {
  assert.equal(GymCalculator.calculate("BASIC", ["SPA"], 1).valid, false);
  assert.equal(GymCalculator.calculate("BASIC", ["SPA"], 1).total, -1);
  assert.equal(GymCalculator.calculate("GOLD", [], 1).total, -1);
  assert.equal(GymCalculator.calculate("BASIC", [], 0).total, -1);
});
