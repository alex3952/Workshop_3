class GymCalculator {
  static PLANS = {
    BASIC: 30,
    STANDARD: 45,
    PREMIUM: 70,
  };

  static EXTRAS = {
    GROUP_CLASSES: { price: 15, premium: false },
    PERSONAL_TRAINING: { price: 25, premium: false },
    SPA: { price: 30, premium: true },
    SPECIALIZED_PROGRAM: { price: 40, premium: true },
  };

  static calculate(plan, extras, members) {
    if (!this.PLANS[plan] ||
        !Array.isArray(extras) ||
        !Number.isInteger(members) ||
        members < 1) {
      return -1;
    }

    let extrasPrice = 0;
    let hasPremium = false;

    for (const extra of extras) {
      const item = this.EXTRAS[extra];

      if (!item || (item.premium && plan !== "PREMIUM")) {
        return -1;
      }

      extrasPrice += item.price;
      if (item.premium) hasPremium = true;
    }

    const subtotal = (this.PLANS[plan] + extrasPrice) * members;

    let total = subtotal;

    // R4. Descuento grupal
    if (members >= 2) {
      total -= total * 0.10;
    }

    return Math.floor(total + 0.5);
  }
}

module.exports = GymCalculator;