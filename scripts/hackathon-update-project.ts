#!/usr/bin/env node
/**
 * Update the DeFi Risk Guardian project submission.
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
    repoLink: GITHUB_REPO,
    // Optional: update description or other fields
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
    projectInfo.repoLink = data.project.repoLink;
    fs.writeFileSync(projectPath, JSON.stringify(projectInfo, null, 2));
  }
}

updateProject().catch((error) => {
  console.error("❌ Update error:", error.message);
  process.exit(1);
});
