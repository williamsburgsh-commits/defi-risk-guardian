#!/usr/bin/env node
/**
 * Submit the DeFi Risk Guardian project for judging.
 * WARNING: This locks the project - it cannot be edited after submission!
 */

import * as fs from "node:fs";
import * as path from "node:path";
import * as readline from "node:readline";

const API_BASE = "https://agents.colosseum.com/api";

async function confirm(question: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === "y" || answer.toLowerCase() === "yes");
    });
  });
}

async function submitProject(): Promise<void> {
  // Load API key
  const envPath = path.join(process.cwd(), ".env");
  const envContent = fs.readFileSync(envPath, "utf-8");
  const apiKeyMatch = envContent.match(/COLOSSEUM_API_KEY=(.+)/);

  if (!apiKeyMatch) {
    throw new Error("COLOSSEUM_API_KEY not found in .env");
  }

  const apiKey = apiKeyMatch[1].trim();

  // Load project info
  const projectPath = path.join(process.cwd(), ".hackathon-project.json");
  if (!fs.existsSync(projectPath)) {
    throw new Error(".hackathon-project.json not found. Create project first.");
  }

  const projectInfo = JSON.parse(fs.readFileSync(projectPath, "utf-8"));

  console.log("⚠️  FINAL SUBMISSION WARNING");
  console.log("=".repeat(60));
  console.log(`Project: ${projectInfo.name}`);
  console.log(`Status: ${projectInfo.status}`);
  console.log(`Repo: ${projectInfo.repoLink}`);
  console.log("\n🔒 After submission:");
  console.log("   • Project is LOCKED and cannot be edited");
  console.log("   • Judges will review your code and demo");
  console.log("   • Make sure your repo is public and complete");
  console.log("=".repeat(60));

  const confirmed = await confirm("\nAre you ready to submit? (y/N): ");

  if (!confirmed) {
    console.log("\n❌ Submission cancelled.");
    return;
  }

  console.log("\nSubmitting project...");

  const response = await fetch(`${API_BASE}/my-project/submit`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Submission failed: ${response.status} ${error}`);
  }

  const data = await response.json();

  console.log("\n✅ Project submitted successfully!");
  console.log(`Status: ${data.project?.status || "submitted"}`);
  console.log("\n🎉 Your project is now being reviewed by judges!");
  console.log("   View on leaderboard: https://colosseum.com/agent-hackathon");

  // Update local project info
  projectInfo.status = "submitted";
  fs.writeFileSync(projectPath, JSON.stringify(projectInfo, null, 2));
}

submitProject().catch((error) => {
  console.error("❌ Submission error:", error.message);
  process.exit(1);
});
