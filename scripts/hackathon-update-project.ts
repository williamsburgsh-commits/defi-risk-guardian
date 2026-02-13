#!/usr/bin/env node
/**
 * Update the DeFi Risk Guardian project submission.
 * Includes the six new required fields for v1.7.0.
 */

import * as fs from "node:fs";
import * as path from "node:path";

const API_BASE = "https://agents.colosseum.com/api";
const GITHUB_REPO = "https://github.com/williamsburgsh-commits/defi-risk-guardian";

interface UpdateProjectResponse {
  project: {
    id: number;
    name: string;
    description: string;
    repoLink: string;
    solanaIntegration: string;
    tags: string[];
    status: string;
  };
}

const PROBLEM_STATEMENT = `DeFi moves fast. Too fast for humans.

Liquidity can be pulled in minutes. Governance parameters can change without notice. Collateral ratios can deteriorate before anyone refreshes their dashboard. Most users only realize something is wrong after the damage is done.

Today, risk monitoring in DeFi is mostly passive: dashboards, alerts, and Twitter threads after exploits. But alerts don't execute transactions. Dashboards don't protect capital.

We need systems that don't just observe risk, they act on it. DeFi Risk Guardian shifts DeFi risk management from reactive monitoring to autonomous intervention.`;

const TECHNICAL_APPROACH = `DeFi Risk Guardian is an autonomous on-chain risk agent built for high-performance environments like Solana.

Core components: real-time state monitoring via RPC/WebSocket for protocol parameters, liquidity, oracles; deterministic rule engine for risk evaluation; position-size-aware repay calculation (exact formula from collateral/borrow to reach target health factor); automated transaction execution for defensive actions; modular strategy layer per protocol (e.g., Drift collateral monitored every 400ms, partial closes before liquidation); human override and transparency logs.

Sub-second monitoring and execution is only viable on high-performance chains. On slower chains, latency and transaction costs make autonomous risk mitigation unreliable. The design relies on Solana's millisecond finality and low-latency execution.`;

const TARGET_AUDIENCE = `Active DeFi users managing mid-to-large positions, DAOs with treasury assets across protocols, yield aggregators and market makers, and risk-aware funds operating on Solana. In short, anyone exposed to smart contract, liquidity, or governance risk who cannot monitor the chain 24/7.`;

const BUSINESS_MODEL = `DeFi Risk Guardian operates on a pure pay-as-you-go model. No subscriptions, no recurring fees.

When the agent executes a protective action, such as exiting a position, reducing exposure, or triggering a defensive rebalance, the user pays a small fee in USDC or CASH via Phantom. Payments are settled on-chain at execution. If nothing happens, nothing is charged.

At roughly 10 USDC per protective execution, a user with 2–3 interventions per month pays around $20–30 versus thousands in prevented losses. This keeps incentives aligned: users pay only when capital is actively protected. For DAOs and advanced users, execution thresholds and fee parameters can be customized by risk profile and capital size.

DeFi Risk Guardian is automated protection that activates only when needed.`;

const COMPETITIVE_LANDSCAPE = `Most solutions fall into three categories: analytics dashboards (observe only), alert systems (notify only), and insurance protocols (compensate after loss).

DeFi Risk Guardian is different because it executes before loss materializes.

Instead of "Something bad happened," we aim for "Something was about to happen. It didn't."

Autonomous agents are still early in DeFi. The competition is less about existing products and more about execution quality and reliability.`;

const FUTURE_VISION = `The long-term goal isn't just one agent, it's a network of machine-native actors operating across DeFi: risk agents, liquidation protection agents, treasury management agents, and governance watchdog agents.

Humans shouldn't manually guard capital in a system that runs 24/7. DeFi Risk Guardian is the first layer: autonomous defense infrastructure for on-chain capital.

The next concrete step after this hackathon is cross-protocol intelligence and expanding protocol integrations. Over time, that evolves into cross-chain monitoring, agent-to-agent coordination, and fully programmable risk policies.

DeFi shouldn't rely on people refreshing dashboards. It should rely on systems designed to act.`;

const DESCRIPTION = `Autonomous AI agent that monitors Solana lending positions across Kamino, Marginfi, and Solend. Continuously fetches positions, computes LTV and health factor, classifies risk (SAFE/WARNING/CRITICAL), and produces simulated repay/rebalance actions with position-size-aware repay amounts computed from collateral/borrow. No frontend, no human-in-the-loop. Configure once, runs headless. Unlike simple monitors that only alert, proactively simulates mitigations with amount, protocol, and market logged in judge-friendly DEMO SNAPSHOT format. Multi-protocol coverage, true autonomy, simulation-first safety.`;

const SOLANA_INTEGRATION = `Monitors lending positions on Kamino, Marginfi, and Solend via Solana RPC (Connection.getProgramAccounts). Computes LTV and health factor from on-chain obligation accounts. Produces simulated repay/rebalance transactions using @solana/web3.js Transaction builder with protocol-specific instruction layouts. Optionally sends on-chain alerts via AgentWallet when SIMULATION_MODE is disabled. Sub-second monitoring and execution leverages Solana's millisecond finality and low transaction costs.`;

async function updateProject(): Promise<void> {
  // Load API key
  const envPath = path.join(process.cwd(), ".env");
  const envContent = fs.readFileSync(envPath, "utf-8");
  const apiKeyMatch = envContent.match(/COLOSSEUM_API_KEY=(.+)/);

  if (!apiKeyMatch) {
    throw new Error("COLOSSEUM_API_KEY not found in .env");
  }

  const apiKey = apiKeyMatch[1].trim();

  console.log("Updating project submission...");

  const updates = {
    name: "DeFi Risk Guardian",
    description: DESCRIPTION,
    repoLink: GITHUB_REPO,
    solanaIntegration: SOLANA_INTEGRATION,
    tags: ["defi", "ai", "security"],
    problemStatement: PROBLEM_STATEMENT,
    technicalApproach: TECHNICAL_APPROACH,
    targetAudience: TARGET_AUDIENCE,
    businessModel: BUSINESS_MODEL,
    competitiveLandscape: COMPETITIVE_LANDSCAPE,
    futureVision: FUTURE_VISION,
  };

  const response = await fetch(`${API_BASE}/my-project`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Project update failed: ${response.status} ${error}`);
  }

  const data = (await response.json()) as UpdateProjectResponse;

  console.log("\n✅ Project updated successfully!");
  console.log(`Project ID: ${data.project.id}`);
  console.log(`Repo: ${data.project.repoLink}`);
  console.log(`Status: ${data.project.status}`);

  // Update local project info
  const projectPath = path.join(process.cwd(), ".hackathon-project.json");
  if (fs.existsSync(projectPath)) {
    const projectInfo = JSON.parse(fs.readFileSync(projectPath, "utf-8"));
    projectInfo.name = data.project.name;
    projectInfo.repoLink = data.project.repoLink;
    projectInfo.status = data.project.status;
    fs.writeFileSync(projectPath, JSON.stringify(projectInfo, null, 2));
  }
}

updateProject().catch((error) => {
  console.error("❌ Update error:", error.message);
  process.exit(1);
});
