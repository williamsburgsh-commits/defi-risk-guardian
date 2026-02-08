/**
 * Simulator: Build simulated Solana transactions for mitigations.
 * Transactions are structured but NOT sent to the blockchain.
 */

import { Transaction, PublicKey, SystemProgram } from "@solana/web3.js";
import type { ClassifiedPosition } from "./demo-snapshot.js";
import type { MitigationDecision } from "./demo-snapshot.js";

export interface RiskState {
  classified: ClassifiedPosition[];
  decisions: MitigationDecision[];
}

export interface SimulatedTransaction {
  protocol: string;
  market: string;
  action: string;
  transaction: Transaction;
  description: string;
}

/**
 * Simulate mitigation actions by building (but not sending) Solana transactions.
 */
export function simulateAction(riskState: RiskState): SimulatedTransaction[] {
  const simulated: SimulatedTransaction[] = [];

  for (let i = 0; i < riskState.decisions.length; i++) {
    const decision = riskState.decisions[i];
    const position = riskState.classified[i];

    if (decision.action === "none" || decision.action === "monitor") {
      // No transaction needed for safe/warning
      logSimulation(position, decision);
      continue;
    }

    // Build simulated transaction for CRITICAL positions
    const tx = buildSimulatedRepayTx(decision, position);
    simulated.push(tx);

    // Log the simulation
    logSimulation(position, decision, tx);
  }

  return simulated;
}

/**
 * Build a simulated repay transaction.
 * In production, this would interact with the respective protocol's program.
 */
function buildSimulatedRepayTx(
  decision: MitigationDecision,
  position: ClassifiedPosition,
): SimulatedTransaction {
  const tx = new Transaction();

  // For demo: add a placeholder instruction
  // Real implementation would add protocol-specific repay instruction
  // Example: Kamino.repayObligation(), Marginfi.repayLiquidity(), etc.

  const dummyPubkey = new PublicKey("11111111111111111111111111111111");
  tx.add(
    SystemProgram.transfer({
      fromPubkey: dummyPubkey,
      toPubkey: dummyPubkey,
      lamports: 0, // Placeholder
    }),
  );

  const description = `Repay ${decision.amountDescription || "debt"} on ${decision.protocol} ${decision.market}`;

  return {
    protocol: decision.protocol,
    market: decision.market,
    action: decision.action,
    transaction: tx,
    description,
  };
}

/**
 * Log simulation details in a structured format.
 */
function logSimulation(
  position: ClassifiedPosition,
  decision: MitigationDecision,
  tx?: SimulatedTransaction,
): void {
  const ltv = (position.ltv * 100).toFixed(2);
  const hf = position.healthFactor.toFixed(2);

  let actionText = decision.action;
  if (decision.amountDescription) {
    actionText += ` [Amount: ${decision.amountDescription}]`;
  }

  if (tx) {
    actionText += " (no on-chain execution)";
  }

  console.log(
    `[SIMULATION] Protocol: ${position.protocol.padEnd(10)} ` +
      `Market: ${position.market.padEnd(12)} ` +
      `LTV: ${ltv.padStart(6)}%  ` +
      `HF: ${hf.padStart(6)}  ` +
      `Risk: ${position.riskLevel.padEnd(8)}  ` +
      `Action: ${actionText}`,
  );
}
