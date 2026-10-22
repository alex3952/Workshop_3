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

  // R1: devuelve el precio del plan, o null si el plan no existe
  static getPlanPrice(plan) {
    return Object.hasOwn(this.PLANS, plan) ? this.PLANS[plan] : null;
  }

  // R2: devuelve la suma de los extras, o null si la selección es inválida
  // (extra desconocido, extra repetido o extra premium sin plan PREMIUM)
  static getExtrasPrice(plan, extras) {
    if (!Array.isArray(extras)) {
      return null;
    }

    if (new Set(extras).size !== extras.length) {
      return null;
    }

    let total = 0;

    for (const extra of extras) {
      if (!Object.hasOwn(this.EXTRAS, extra)) {
        return null;
      }

      if (this.EXTRAS[extra].premium && plan !== "PREMIUM") {
        return null;
      }

      total += this.EXTRAS[extra].price;
    }

    return total;
  }

  // R2: indica si hay al menos un extra premium (lo usa R6)
  static hasPremiumExtra(extras) {
    return extras.some(
      (extra) => Object.hasOwn(this.EXTRAS, extra) && this.EXTRAS[extra].premium
    );
  }

  // R3: subtotal = (plan + extras) x miembros, o null si algo es inválido
  static calculateSubtotal(plan, extras, members) {
    const planPrice = this.getPlanPrice(plan);
    const extrasPrice = this.getExtrasPrice(plan, extras);

    if (planPrice === null || extrasPrice === null) {
      return null;
    }

    if (!Number.isInteger(members) || members < 1) {
      return null;
    }

    return (planPrice + extrasPrice) * members;
  }

  // R7: redondeo mitad hacia arriba a entero. Primero se pasa a centavos
  // para corregir errores de coma flotante (ej. 121.49999999999999 -> 122)
  static roundHalfUp(amount) {
    const cents = Math.round(amount * 100);
    return Math.floor((cents + 50) / 100);
  }

  static calculate(plan, extras, members) {
    // R1, R2 y R3: validar la selección y calcular el subtotal
    const subtotal = this.calculateSubtotal(plan, extras, members);

    if (subtotal === null) {
      return { valid: false, total: -1 }; // R7: selección inválida
    }

    // R4: descuento grupal del 10 %
    const groupDiscount =
      members >= 2 ? subtotal * 0.10 : 0;

    const afterGroupDiscount = subtotal - groupDiscount;

    // R5: oferta especial, solo una
    let specialDiscount = 0;

    if (afterGroupDiscount > 400) {
      specialDiscount = 50;
    } else if (afterGroupDiscount > 200) {
      specialDiscount = 20;
    }

    const afterSpecialDiscount =
      afterGroupDiscount - specialDiscount;

    // R6: recargo del 15 % si hay extras premium
    const premiumSurcharge = this.hasPremiumExtra(extras)
      ? afterSpecialDiscount * 0.15
      : 0;

    const amount =
      afterSpecialDiscount + premiumSurcharge;

    // R7: redondear solo al final
    const total = this.roundHalfUp(amount);

    return {
      valid: true,
      subtotal,
      groupDiscount,
      specialDiscount,
      premiumSurcharge,
      total,
    };
  }
}

module.exports = GymCalculator;
