/**
 * Policy: Evaluate positions and classify risk based on LTV and health factor.
 */

import type { ClassifiedPosition } from "./demo-snapshot.js";
import type { Position } from "./perception.js";

const WARNING_LTV = Number.parseFloat(process.env.DEFI_GUARDIAN_WARNING_LTV || "0.75");
const CRITICAL_LTV = Number.parseFloat(process.env.DEFI_GUARDIAN_CRITICAL_LTV || "0.90");
const MIN_HEALTH_FACTOR = Number.parseFloat(
  process.env.DEFI_GUARDIAN_MIN_HEALTH_FACTOR || "1.10",
);

export type RiskLevel = "SAFE" | "WARNING" | "CRITICAL";

/**
 * Evaluate positions and compute LTV, health factor, and risk level.
 */
export function evaluate(positions: Position[]): ClassifiedPosition[] {
  return positions.map((pos) => {
    const ltv = calculateLTV(pos);
    const healthFactor = calculateHealthFactor(pos);
    const riskLevel = classifyRisk(ltv, healthFactor);

    return {
      protocol: pos.protocol,
      market: pos.market,
      ltv,
      healthFactor,
      riskLevel,
      collateralValue: pos.collateralValue,
      borrowValue: pos.borrowValue,
    };
  });
}

/**
 * Calculate Loan-to-Value ratio.
 * LTV = (total borrow value) / (total collateral value)
 */
function calculateLTV(position: Position): number {
  if (position.collateralValue === 0) {
    return 0;
  }

  return position.borrowValue / position.collateralValue;
}

/**
 * Calculate health factor.
 * Health Factor = (collateral value) / (borrow value)
 * Higher is better. < 1.0 means position can be liquidated.
 */
function calculateHealthFactor(position: Position): number {
  if (position.borrowValue === 0) {
    return Number.POSITIVE_INFINITY;
  }

  return position.collateralValue / position.borrowValue;
}

/**
 * Classify risk level based on LTV and health factor thresholds.
 */
function classifyRisk(ltv: number, healthFactor: number): RiskLevel {
  // CRITICAL: LTV above critical threshold OR health factor below minimum
  if (ltv >= CRITICAL_LTV || healthFactor <= MIN_HEALTH_FACTOR) {
    return "CRITICAL";
  }

  // WARNING: LTV above warning threshold
  if (ltv >= WARNING_LTV) {
    return "WARNING";
  }

  // SAFE: everything else
  return "SAFE";
}
