/**
 * Actions: Decide mitigation strategies based on classified risk.
 */

import type { ClassifiedPosition, MitigationDecision } from "./demo-snapshot.js";

const TARGET_HEALTH_FACTOR = 1.5; // Target HF after mitigation

/**
 * Decide mitigation actions for each classified position.
 */
export function decideMitigations(
  classified: ClassifiedPosition[],
): MitigationDecision[] {
  return classified.map((pos) => decideMitigation(pos));
}

/**
 * Decide mitigation for a single position based on risk level.
 */
function decideMitigation(position: ClassifiedPosition): MitigationDecision {
  const base = {
    protocol: position.protocol,
    market: position.market,
  };

  // SAFE: No action needed
  if (position.riskLevel === "SAFE") {
    return {
      ...base,
      action: "none",
    };
  }

  // WARNING: Monitor closely
  if (position.riskLevel === "WARNING") {
    return {
      ...base,
      action: "monitor",
      amountDescription: "close to threshold",
    };
  }

  // CRITICAL: Simulate repay to bring health factor to safe level
  const repayAmount = calculateRepayAmount(position);

  return {
    ...base,
    action: "simulate_repay",
    amountDescription: `${repayAmount.toFixed(2)} USDC`,
  };
}

/**
 * Calculate the amount to repay to bring health factor to target.
 *
 * Current: HF = collateral / borrow
 * Target: TARGET_HF = collateral / (borrow - repayAmount)
 * Solve for repayAmount: repayAmount = borrow - (collateral / TARGET_HF)
 */
function calculateRepayAmount(position: ClassifiedPosition): number {
  // For demo purposes, calculate from LTV
  // Real implementation would need collateral and borrow values
  // Approximation: repay enough to bring LTV down to ~50%

  // If we know collateral and borrow:
  // Current borrow implied from LTV: borrow = ltv * collateral
  // Target borrow for TARGET_HF: targetBorrow = collateral / TARGET_HF
  // Repay amount: borrow - targetBorrow

  // For demo, use a simple estimate based on LTV
  const currentLTV = position.ltv;
  const targetLTV = 1 / TARGET_HEALTH_FACTOR; // ~0.67 for HF=1.5

  if (currentLTV <= targetLTV) {
    return 0;
  }

  // Rough estimate: repay proportional to excess LTV
  // This assumes average position size of $300-500
  const excessLTV = currentLTV - targetLTV;
  const estimatedRepay = excessLTV * 500; // Rough heuristic

  return Math.max(estimatedRepay, 10); // Min $10 repay
}
