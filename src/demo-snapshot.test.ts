import { describe, expect, it, vi } from "vitest";
import {
  __testing,
  formatDemoSnapshot,
  logDemoSnapshotIfFirst,
  type ClassifiedPosition,
  type MitigationDecision,
} from "./demo-snapshot.js";

describe("demo-snapshot", () => {
  const sampleClassified: ClassifiedPosition[] = [
    { protocol: "Kamino", market: "SOL-USDC", ltv: 0.45, healthFactor: 2.2, riskLevel: "SAFE" },
    { protocol: "Marginfi", market: "main", ltv: 0.78, healthFactor: 1.15, riskLevel: "WARNING" },
    { protocol: "Solend", market: "main", ltv: 0.92, healthFactor: 1.02, riskLevel: "CRITICAL" },
  ];
  const sampleDecisions: MitigationDecision[] = [
    { protocol: "Kamino", market: "SOL-USDC", action: "none" },
    { protocol: "Marginfi", market: "main", action: "monitor", amountDescription: "close to threshold" },
    { protocol: "Solend", market: "main", action: "simulate_repay", amountDescription: "50 USDC" },
  ];

  it("formatDemoSnapshot includes Kamino, Marginfi, Solend and LTV, HF, risk, action", () => {
    const out = formatDemoSnapshot(sampleClassified, sampleDecisions);
    expect(out).toContain("DEMO SNAPSHOT (first iteration)");
    expect(out).toContain("Kamino");
    expect(out).toContain("Marginfi");
    expect(out).toContain("Solend");
    expect(out).toContain("LTV:");
    expect(out).toContain("Health Factor:");
    expect(out).toContain("Risk level:");
    expect(out).toContain("Simulated mitigation action:");
    expect(out).toContain("45.00%");
    expect(out).toContain("2.20");
    expect(out).toContain("SAFE");
    expect(out).toContain("WARNING");
    expect(out).toContain("CRITICAL");
    expect(out).toMatch(/simulate_repay: \d+(\.\d+)? USDC/);
  });

  it("logDemoSnapshotIfFirst logs once then no-ops", () => {
    __testing.resetFirstIterationDone();
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const single: ClassifiedPosition[] = [{ protocol: "Kamino", market: "m", ltv: 0, healthFactor: 1, riskLevel: "SAFE" }];
    const decs: MitigationDecision[] = [{ protocol: "Kamino", market: "m", action: "none" }];
    logDemoSnapshotIfFirst(single, decs);
    logDemoSnapshotIfFirst(single, decs);
    expect(logSpy).toHaveBeenCalledTimes(1);
    logSpy.mockRestore();
  });
});
