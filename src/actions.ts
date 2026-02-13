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
  const { collateralValue, borrowValue } = position;

  if (
    collateralValue != null &&
    borrowValue != null &&
    collateralValue > 0 &&
    borrowValue > 0
  ) {
    const targetBorrow = collateralValue / TARGET_HEALTH_FACTOR;
    let repay = borrowValue - targetBorrow;
    repay = Math.max(0, Math.min(repay, borrowValue));
    return Math.max(repay, 10); // Min $10 for demo readability
  }

  // Fallback: LTV-based heuristic when USD values unavailable
  const currentLTV = position.ltv;
  const targetLTV = 1 / TARGET_HEALTH_FACTOR;
  if (currentLTV <= targetLTV) {
    return 0;
  }
  const excessLTV = currentLTV - targetLTV;
  const estimatedRepay = excessLTV * 500;
  return Math.max(estimatedRepay, 10);
}
