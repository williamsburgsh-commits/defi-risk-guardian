#!/usr/bin/env node
/**
 * Run the DeFi Risk Guardian agent in a continuous loop.
 * Monitors Solana lending positions every N seconds.
 */

import { runLoopIteration } from "../src/agents/defi-risk-guardian/agent.js";

const INTERVAL_MS =
  Number.parseInt(process.env.DEFI_GUARDIAN_LOOP_INTERVAL_MS || "60000", 10);

console.log("🦞 DeFi Risk Guardian - Continuous Monitoring");
console.log(`Loop interval: ${INTERVAL_MS}ms (${INTERVAL_MS / 1000}s)\n`);

let iterationCount = 0;

async function loop(): Promise<void> {
  while (true) {
    iterationCount++;
    console.log(`\n${"=".repeat(60)}`);
    console.log(`Iteration #${iterationCount} - ${new Date().toISOString()}`);
    console.log("=".repeat(60));

    try {
      await runLoopIteration();
    } catch (error) {
      console.error("❌ Loop iteration error:", error);
      // Continue monitoring despite errors
    }

    console.log(`\n⏱️  Next check in ${INTERVAL_MS / 1000}s...`);
    await new Promise((resolve) => setTimeout(resolve, INTERVAL_MS));
  }
}

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("\n\n🛑 Shutting down DeFi Risk Guardian...");
  console.log(`Total iterations: ${iterationCount}`);
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\n\n🛑 Shutting down DeFi Risk Guardian...");
  console.log(`Total iterations: ${iterationCount}`);
  process.exit(0);
});

loop().catch((error) => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});
