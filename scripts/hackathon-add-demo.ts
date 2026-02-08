#!/usr/bin/env node
/**
 * Update project with demo video link
 */

import "dotenv/config";
import * as fs from "node:fs";
import * as path from "node:path";

const API_BASE = "https://agents.colosseum.com/api";

async function addDemoLink(videoUrl: string): Promise<void> {
  // Load API key
  const envPath = path.join(process.cwd(), ".env");
  const envContent = fs.readFileSync(envPath, "utf-8");
  const match = envContent.match(/COLOSSEUM_API_KEY=(.+)/);
  if (!match) {
    throw new Error("COLOSSEUM_API_KEY not found in .env");
  }
  const apiKey = match[1].trim();

  console.log("📹 Adding demo video link to project...\n");

  const response = await fetch(`${API_BASE}/my-project`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      demoLink: videoUrl,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to update project: ${response.status} ${error}`);
  }

  const data = await response.json();
  console.log("✅ Project updated successfully!");
  console.log(`\nDemo link: ${data.project.demoLink}`);
  console.log(`View project: https://colosseum.com/agent-hackathon/project/${data.project.slug}`);
}

// Get video URL from command line
const videoUrl = process.argv[2];
if (!videoUrl) {
  console.error("Usage: node --import tsx scripts/hackathon-add-demo.ts <video-url>");
  console.error("\nExample:");
  console.error('  node --import tsx scripts/hackathon-add-demo.ts "https://youtu.be/xxxxx"');
  process.exit(1);
}

addDemoLink(videoUrl).catch((error) => {
  console.error("❌ Error:", error.message);
  process.exit(1);
});
