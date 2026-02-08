#!/usr/bin/env node
/**
 * Register the DeFi Risk Guardian agent with the Colosseum Agent Hackathon.
 * Saves API key to .env and logs claim code for human operator.
 */

import * as fs from "node:fs";
import * as path from "node:path";

const API_BASE = "https://agents.colosseum.com/api";
const AGENT_NAME = "defi-risk-guardian";

interface RegistrationResponse {
  agent: {
    id: number;
    hackathonId: number;
    name: string;
    status: string;
    createdAt: string;
  };
  apiKey: string;
  claimCode: string;
  verificationCode: string;
  claimUrl: string;
  skillUrl: string;
  heartbeatUrl: string;
}

async function register(): Promise<void> {
  console.log(`Registering agent: ${AGENT_NAME}...`);

  const response = await fetch(`${API_BASE}/agents`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: AGENT_NAME }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Registration failed: ${response.status} ${error}`);
  }

  const data = (await response.json()) as RegistrationResponse;

  console.log("\n✅ Registration successful!");
  console.log(`Agent ID: ${data.agent.id}`);
  console.log(`Status: ${data.agent.status}`);

  // Save API key to .env
  const envPath = path.join(process.cwd(), ".env");
  let envContent = "";

  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, "utf-8");
  }

  // Add or update COLOSSEUM_API_KEY
  if (envContent.includes("COLOSSEUM_API_KEY=")) {
    envContent = envContent.replace(
      /COLOSSEUM_API_KEY=.*/,
      `COLOSSEUM_API_KEY=${data.apiKey}`,
    );
  } else {
    envContent += `\n\n# Colosseum Hackathon\nCOLOSSEUM_API_KEY=${data.apiKey}\n`;
  }

  fs.writeFileSync(envPath, envContent);
  console.log(`\n✅ API key saved to .env`);

  // Display claim info
  console.log("\n" + "=".repeat(60));
  console.log("🎟️  CLAIM CODE FOR HUMAN OPERATOR");
  console.log("=".repeat(60));
  console.log(`\nClaim Code: ${data.claimCode}`);
  console.log(`Claim URL: ${data.claimUrl}`);
  console.log(`Verification Code: ${data.verificationCode}`);
  console.log("\n📋 Next steps for human:");
  console.log("1. Visit the claim URL above");
  console.log("2. Sign in with X (Twitter)");
  console.log("3. Provide your Solana wallet address for prize payouts");
  console.log("\nOR use tweet verification:");
  console.log(`   curl ${API_BASE}/claim/${data.claimCode}/info`);
  console.log("=".repeat(60));

  // Save claim info to a file
  const claimInfo = {
    claimCode: data.claimCode,
    claimUrl: data.claimUrl,
    verificationCode: data.verificationCode,
    agentId: data.agent.id,
    agentName: data.agent.name,
  };

  const claimPath = path.join(process.cwd(), ".hackathon-claim.json");
  fs.writeFileSync(claimPath, JSON.stringify(claimInfo, null, 2));
  console.log(`\n✅ Claim info saved to .hackathon-claim.json`);
}

register().catch((error) => {
  console.error("❌ Registration error:", error.message);
  process.exit(1);
});
