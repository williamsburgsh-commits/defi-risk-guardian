/**
 * DeFi Risk Guardian agent: fully autonomous; all logic AI-written; humans only
 * configure/run; no frontend; all mitigation actions simulated (or optional
 * on-chain alerts when SIMULATION_MODE is false).
 *
 * On the first loop iteration only, logs a DEMO SNAPSHOT (Kamino, Marginfi,
 * Solend — LTV, Health Factor, risk level, simulated mitigation action).
 */

import { decideMitigations } from "./actions.js";
import {
  logDemoSnapshotIfFirst,
  type ClassifiedPosition,
  type MitigationDecision,
} from "./demo-snapshot.js";
import { perceive } from "./perception.js";
import { evaluate } from "./policy.js";
import { simulateAction, type RiskState } from "./simulator.js";

/**
 * Run one agent loop iteration. On the first iteration only, logs the
 * DEMO SNAPSHOT (Kamino, Marginfi, Solend — LTV, HF, risk, simulated action).
 */
export async function runLoopIteration(): Promise<void> {
  const positions = await perceive();
  const classified = evaluate(positions);
  const decisions = decideMitigations(classified);

  logDemoSnapshotIfFirst(classified, decisions);

  const riskState: RiskState = { classified, decisions };
  simulateAction(riskState);
}
