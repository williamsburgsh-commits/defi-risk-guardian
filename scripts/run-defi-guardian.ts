#!/usr/bin/env node
/**
 * Run the DeFi Risk Guardian agent for one iteration.
 * Shows the DEMO SNAPSHOT on first run.
 */

import { runLoopIteration } from "../src/agents/defi-risk-guardian/agent.js";

console.log("Starting DeFi Risk Guardian agent...\n");

async function main() {
  try {
    await runLoopIteration();
    console.log("\nAgent iteration complete.");
  } catch (error) {
    console.error("Error running agent:", error);
    process.exit(1);
  }
}

main();
