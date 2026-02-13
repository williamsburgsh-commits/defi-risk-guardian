import { describe, expect, it } from "vitest";
import { evaluate } from "./policy.js";
import type { Position } from "./perception.js";

function pos(
  protocol: string,
  market: string,
  collateralValue: number,
  borrowValue: number,
): Position {
  return {
    protocol,
    market,
    deposits: [],
    borrows: [],
    collateralValue,
    borrowValue,
  };
}

describe("policy", () => {
  it("evaluate computes LTV, healthFactor, riskLevel, and passes collateral/borrow", () => {
    const positions = [
      pos("Kamino", "SOL-USDC", 1000, 450),
      pos("Marginfi", "main", 500, 390),
      pos("Solend", "main", 300, 275),
    ];
    const result = evaluate(positions);

    expect(result).toHaveLength(3);

    // Kamino: LTV 0.45, HF 2.22 → SAFE
    expect(result[0]).toMatchObject({
      protocol: "Kamino",
      market: "SOL-USDC",
      ltv: 0.45,
      healthFactor: 2.2222222222222223,
      riskLevel: "SAFE",
      collateralValue: 1000,
      borrowValue: 450,
    });

    // Marginfi: LTV 0.78, HF 1.28 → WARNING
    expect(result[1]).toMatchObject({
      protocol: "Marginfi",
      market: "main",
      ltv: 0.78,
      healthFactor: 1.2820512820512822,
      riskLevel: "WARNING",
      collateralValue: 500,
      borrowValue: 390,
    });

    // Solend: LTV 0.917, HF 1.09 → CRITICAL
    expect(result[2]).toMatchObject({
      protocol: "Solend",
      market: "main",
      riskLevel: "CRITICAL",
      collateralValue: 300,
      borrowValue: 275,
    });
    expect(result[2]?.ltv).toBeCloseTo(0.9167, 2);
    expect(result[2]?.healthFactor).toBeCloseTo(1.09, 2);
  });

  it("classifies CRITICAL by LTV when above 0.9", () => {
    const positions = [pos("Test", "m", 100, 95)]; // LTV 0.95
    const result = evaluate(positions);
    expect(result[0]?.riskLevel).toBe("CRITICAL");
  });

  it("classifies CRITICAL by health factor when below 1.10", () => {
    const positions = [pos("Test", "m", 100, 95)]; // HF 1.05
    const result = evaluate(positions);
    expect(result[0]?.riskLevel).toBe("CRITICAL");
  });

  it("classifies WARNING when LTV between 0.75 and 0.9 and HF above 1.10", () => {
    const positions = [pos("Test", "m", 100, 80)]; // LTV 0.8, HF 1.25
    const result = evaluate(positions);
    expect(result[0]?.riskLevel).toBe("WARNING");
  });

  it("classifies SAFE when LTV below 0.75", () => {
    const positions = [pos("Test", "m", 100, 50)]; // LTV 0.5, HF 2
    const result = evaluate(positions);
    expect(result[0]?.riskLevel).toBe("SAFE");
  });

  it("handles zero borrow as SAFE with infinite health factor", () => {
    const positions = [pos("Test", "m", 100, 0)];
    const result = evaluate(positions);
    expect(result[0]?.ltv).toBe(0);
    expect(result[0]?.healthFactor).toBe(Number.POSITIVE_INFINITY);
    expect(result[0]?.riskLevel).toBe("SAFE");
  });

  it("handles zero collateral as SAFE with zero LTV", () => {
    const positions = [pos("Test", "m", 0, 0)];
    const result = evaluate(positions);
    expect(result[0]?.ltv).toBe(0);
    expect(result[0]?.healthFactor).toBe(Number.POSITIVE_INFINITY);
    expect(result[0]?.riskLevel).toBe("SAFE");
  });
});
