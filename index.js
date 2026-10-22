const readline = require("node:readline/promises");
const { stdin, stdout } = require("node:process");
const GymCalculator = require("./src/GymCalculator");

async function main() {
  const rl = readline.createInterface({ input: stdin, output: stdout });

  try {
    console.log("\n=== GYM MEMBERSHIP QUOTER ===");
    console.log("Plans: BASIC (30), STANDARD (45), PREMIUM (70)");

    console.log("\nExtras:");
    console.log("GROUP_CLASSES (15)");
    console.log("PERSONAL_TRAINING (25)");
    console.log("SPA (30, premium only)");
    console.log("SPECIALIZED_PROGRAM (40, premium only)");

    const plan = (
      await rl.question("\nChoose a plan: ")
    ).trim().toUpperCase();

    const extrasInput = (
      await rl.question("Choose extras separated by commas, or press Enter for none: ")
    ).trim().toUpperCase();

    const extras = extrasInput
      ? extrasInput.split(",").map((item) => item.trim())
      : [];

    const membersInput = (
      await rl.question("Number of members: ")
    ).trim();

    const members = /^\d+$/.test(membersInput)
      ? Number(membersInput)
      : NaN;

    const quote = GymCalculator.calculate(plan, extras, members);

    if (!quote.valid) {
      console.log("\nInvalid selection. Total: -1");
      return;
    }

    console.log("\n=== MONTHLY QUOTE ===");
    console.log(`Subtotal:    $${quote.subtotal.toFixed(2)}`);
    console.log(`Group discount:   -$${quote.groupDiscount.toFixed(2)}`);
    console.log(`Special discount: -$${quote.specialDiscount.toFixed(2)}`);
    console.log(`Premium surcharge: $${quote.premiumSurcharge.toFixed(2)}`);
    console.log(`Total:             $${quote.total}`);

    const confirmation = (
      await rl.question("\nConfirm quote? (y/n): ")
    ).trim().toLowerCase();

    if (confirmation !== "y") {
      console.log("Quote cancelled. Total: -1");
      return;
    }

    console.log(`Quote confirmed. Monthly total: $${quote.total}`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    console.log("Total: -1");
  } finally {
    rl.close();
  }
}

main();