#!/usr/bin/env node
/**
 * Create the DeFi Risk Guardian project submission (draft) for the Colosseum hackathon.
 */

import * as fs from "node:fs";
import * as path from "node:path";

const API_BASE = "https://agents.colosseum.com/api";
const GITHUB_REPO = "https://github.com/williamsburgsh-commits/defi-risk-guardian";

interface ProjectResponse {
  project: {
    id: number;
    hackathonId: number;
    name: string;
    slug: string;
    description: string;
    repoLink: string;
    solanaIntegration: string;
    technicalDemoLink?: string;
    presentationLink?: string;
    tags: string[];
    status: string;
    humanUpvotes: number;
    agentUpvotes: number;
  };
}

async function createProject(): Promise<void> {
  // Load API key from .env
  const envPath = path.join(process.cwd(), ".env");
  const envContent = fs.readFileSync(envPath, "utf-8");
  const apiKeyMatch = envContent.match(/COLOSSEUM_API_KEY=(.+)/);

  if (!apiKeyMatch) {
    throw new Error("COLOSSEUM_API_KEY not found in .env. Run hackathon-register.ts first.");
  }

  const apiKey = apiKeyMatch[1].trim();

  const description =
    "Fully autonomous AI agent that monitors Solana lending positions across Kamino, Marginfi, and Solend. Continuously fetches positions, computes LTV and health factor, classifies risk (SAFE/WARNING/CRITICAL), and produces simulated repay/rebalance actions before liquidation. No frontend, no human-in-the-loop—configure once, runs headless. Unlike simple monitors that only alert, proactively simulates mitigations with amount, protocol, and market logged in judge-friendly DEMO SNAPSHOT format. Stands out via multi-protocol coverage, true autonomy, and simulation-first safety.";

  const solanaIntegration =
    "Monitors lending positions on Kamino, Marginfi, and Solend via Solana RPC (Connection.getProgramAccounts); computes LTV and health factor from on-chain obligation accounts; produces simulated repay/rebalance transactions using @solana/web3.js Transaction builder with protocol-specific instruction layouts; optionally sends on-chain alerts via AgentWallet when SIMULATION_MODE is disabled.";

  console.log("Creating project submission (draft)...");

  const response = await fetch(`${API_BASE}/my-project`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "DeFi Risk Guardian",
      description,
      repoLink: GITHUB_REPO,
      solanaIntegration,
      tags: ["defi", "ai"],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Project creation failed: ${response.status} ${error}`);
  }

  const data = (await response.json()) as ProjectResponse;

  console.log("\n✅ Project created successfully!");
  console.log(`Project ID: ${data.project.id}`);
  console.log(`Slug: ${data.project.slug}`);
  console.log(`Status: ${data.project.status}`);
  console.log(`Repo: ${data.project.repoLink}`);
  console.log(`Tags: ${data.project.tags.join(", ")}`);

  // Save project info
  const projectInfo = {
    projectId: data.project.id,
    slug: data.project.slug,
    status: data.project.status,
    name: data.project.name,
    repoLink: data.project.repoLink,
    tags: data.project.tags,
  };

  const projectPath = path.join(process.cwd(), ".hackathon-project.json");
  fs.writeFileSync(projectPath, JSON.stringify(projectInfo, null, 2));
  console.log(`\n✅ Project info saved to .hackathon-project.json`);

  console.log("\n📋 Project is in DRAFT status. You can update it with:");
  console.log("   node --import tsx scripts/hackathon-update-project.ts");
  console.log("\n⚠️  When ready for judging, submit with:");
  console.log("   node --import tsx scripts/hackathon-submit.ts");
  console.log("   (This locks the project - cannot edit after!)");
}

createProject().catch((error) => {
  console.error("❌ Project creation error:", error.message);
  process.exit(1);
});
