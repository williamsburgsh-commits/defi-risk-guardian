/**
 * Perception: Fetch lending positions from Kamino, Marginfi, and Solend.
 * For hackathon demo: returns mock data when DEFI_GUARDIAN_USE_MOCK=1.
 * Real implementation would query on-chain program accounts via Solana RPC.
 */

import "dotenv/config";
import { Connection, PublicKey } from "@solana/web3.js";

export interface Position {
  protocol: string;
  market: string;
  deposits: Array<{ mint: string; amount: number }>;
  borrows: Array<{ mint: string; amount: number }>;
  collateralValue: number; // USD
  borrowValue: number; // USD
  [k: string]: unknown;
}

const RPC_URL = process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com";
const USE_MOCK = process.env.DEFI_GUARDIAN_USE_MOCK === "1";

/**
 * Fetch positions from all three protocols.
 */
export async function perceive(): Promise<Position[]> {
  if (USE_MOCK) {
    return getMockPositions();
  }

  const wallet = process.env.DEFI_GUARDIAN_WALLET;
  if (!wallet) {
    console.warn("⚠️  DEFI_GUARDIAN_WALLET not set, returning empty positions");
    return [];
  }

  try {
    const connection = new Connection(RPC_URL, "confirmed");
    const walletPubkey = new PublicKey(wallet);

    // Fetch from all three protocols in parallel
    const [kaminoPos, marginfiPos, solendPos] = await Promise.all([
      fetchKaminoPositions(connection, walletPubkey),
      fetchMarginfiPositions(connection, walletPubkey),
      fetchSolendPositions(connection, walletPubkey),
    ]);

    return [...kaminoPos, ...marginfiPos, ...solendPos];
  } catch (error) {
    console.error("❌ Perception error:", error);
    return [];
  }
}

/**
 * Fetch Kamino lending positions.
 * Real implementation would query Kamino program accounts.
 */
async function fetchKaminoPositions(
  connection: Connection,
  wallet: PublicKey,
): Promise<Position[]> {
  // TODO: Implement real Kamino integration
  // - Query Kamino program (KLend4CRYVnkelWRXk4Zm94R)
  // - Parse lending obligations for the wallet
  // - Calculate USD values from oracle prices
  console.log("📊 Fetching Kamino positions...");
  return [];
}

/**
 * Fetch Marginfi lending positions.
 * Real implementation would query Marginfi program accounts.
 */
async function fetchMarginfiPositions(
  connection: Connection,
  wallet: PublicKey,
): Promise<Position[]> {
  // TODO: Implement real Marginfi integration
  // - Query Marginfi program (MFv2hWf31Z9kbCa1snEPYctwafyhdvnV7FZnsebVacA)
  // - Parse lending obligations
  // - Use Marginfi API for LTV/health if available
  console.log("📊 Fetching Marginfi positions...");
  return [];
}

/**
 * Fetch Solend lending positions.
 * Real implementation would query Solend program accounts.
 */
async function fetchSolendPositions(
  connection: Connection,
  wallet: PublicKey,
): Promise<Position[]> {
  // TODO: Implement real Solend integration
  // - Query Solend program (So1endDq2YkqhipRh3WViPa8hdiSpxWy6z3Z6tMCpAo)
  // - Parse SPL token obligations
  // - Calculate LTV from deposit/borrow balances
  console.log("📊 Fetching Solend positions...");
  return [];
}

/**
 * Mock positions for hackathon demo (when real wallet not configured).
 */
function getMockPositions(): Position[] {
  console.log("🎭 Using mock positions for demo");

  return [
    {
      protocol: "Kamino",
      market: "SOL-USDC",
      deposits: [{ mint: "So11111111111111111111111111111111111111112", amount: 10 }],
      borrows: [{ mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", amount: 450 }],
      collateralValue: 1000,
      borrowValue: 450,
    },
    {
      protocol: "Marginfi",
      market: "main",
      deposits: [{ mint: "So11111111111111111111111111111111111111112", amount: 5 }],
      borrows: [{ mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", amount: 390 }],
      collateralValue: 500,
      borrowValue: 390,
    },
    {
      protocol: "Solend",
      market: "main",
      deposits: [{ mint: "So11111111111111111111111111111111111111112", amount: 3 }],
      borrows: [{ mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", amount: 275 }],
      collateralValue: 300,
      borrowValue: 275,
    },
  ];
}
