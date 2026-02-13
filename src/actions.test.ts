import { describe, expect, it } from "vitest";
import { decideMitigations } from "./actions.js";
import type { ClassifiedPosition } from "./demo-snapshot.js";

function classified(
  protocol: string,
  market: string,
  ltv: number,
  healthFactor: number,
  riskLevel: string,
  collateralValue?: number,
  borrowValue?: number,
): ClassifiedPosition {
  const pos: ClassifiedPosition = {
    protocol,
    market,
    ltv,
    healthFactor,
    riskLevel,
  };
  if (collateralValue != null) {
    pos.collateralValue = collateralValue;
  }
  if (borrowValue != null) {
    pos.borrowValue = borrowValue;
  }
  return pos;
}

describe("actions", () => {
  it("decideMitigations returns none for SAFE positions", () => {
    const classified_ = [
      classified("Kamino", "SOL-USDC", 0.45, 2.22, "SAFE", 1000, 450),
    ];
    const decisions = decideMitigations(classified_);
    expect(decisions).toHaveLength(1);
    expect(decisions[0]).toEqual({
      protocol: "Kamino",
      market: "SOL-USDC",
      action: "none",
    });
  });

  it("decideMitigations returns monitor for WARNING positions", () => {
    const classified_ = [
      classified("Marginfi", "main", 0.78, 1.28, "WARNING", 500, 390),
    ];
    const decisions = decideMitigations(classified_);
    expect(decisions).toHaveLength(1);
    expect(decisions[0]).toEqual({
      protocol: "Marginfi",
      market: "main",
      action: "monitor",
      amountDescription: "close to threshold",
    });
  });

  it("decideMitigations returns simulate_repay with exact amount for CRITICAL when collateral/borrow available", () => {
    // Solend mock: collateral 300, borrow 275 → repay 275 - 300/1.5 = 75
    const classified_ = [
      classified("Solend", "main", 0.917, 1.09, "CRITICAL", 300, 275),
    ];
    const decisions = decideMitigations(classified_);
    expect(decisions).toHaveLength(1);
    expect(decisions[0]?.action).toBe("simulate_repay");
    expect(decisions[0]?.amountDescription).toBe("75.00 USDC");
  });

  it("decideMitigations uses heuristic when collateral/borrow missing (fallback)", () => {
    const classified_ = [
      classified("Solend", "main", 0.917, 1.09, "CRITICAL"),
    ];
    const decisions = decideMitigations(classified_);
    expect(decisions).toHaveLength(1);
    expect(decisions[0]?.action).toBe("simulate_repay");
    // Heuristic: excessLTV * 500 ≈ 125 (position-size-agnostic)
    expect(decisions[0]?.amountDescription).toMatch(/^\d+\.\d+ USDC$/);
    const amt = decisions[0]?.amountDescription;
    expect(Number.parseFloat(amt ?? "0")).toBeGreaterThanOrEqual(120);
    expect(Number.parseFloat(amt ?? "0")).toBeLessThanOrEqual(130);
  });

  it("decideMitigations enforces minimum $10 repay", () => {
    // Small position: collateral 50, borrow 45 → repay 45 - 50/1.5 = 11.67, min 10
    const classified_ = [
      classified("Test", "m", 0.9, 1.11, "CRITICAL", 50, 45),
    ];
    const decisions = decideMitigations(classified_);
    expect(decisions[0]?.amountDescription).toBe("11.67 USDC");

    // Very small: collateral 20, borrow 19 → repay 19 - 20/1.5 = 5.67, clamped to 10
    const classified2 = [
      classified("Test", "m", 0.95, 1.05, "CRITICAL", 20, 19),
    ];
    const decisions2 = decideMitigations(classified2);
    expect(decisions2[0]?.amountDescription).toBe("10.00 USDC");
  });
});
