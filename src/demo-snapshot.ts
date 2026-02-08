/**
 * DEMO SNAPSHOT — logs a single, screenshot-friendly snapshot of all protocols
 * (Kamino, Marginfi, Solend) with LTV, Health Factor, Risk level, and simulated
 * mitigation action. Intended for first iteration only.
 */

export interface ClassifiedPosition {
  protocol: string;
  market: string;
  ltv: number;
  healthFactor: number;
  riskLevel: string;
}

export interface MitigationDecision {
  protocol: string;
  market: string;
  action: string;
  amountDescription?: string;
}

const PROTOCOL_ORDER = ["Kamino", "Marginfi", "Solend"] as const;

function line(width: number, char: string): string {
  return char.repeat(width);
}

function formatPositionBlock(
  protocol: string,
  positions: ClassifiedPosition[],
  decisions: MitigationDecision[],
): string[] {
  const lines: string[] = [];
  if (positions.length === 0) {
    lines.push(`  ${protocol}`);
    lines.push(`    (no positions)`);
    return lines;
  }
  for (const pos of positions) {
    const dec = decisions.find(
      (d) => d.protocol === pos.protocol && d.market === pos.market,
    );
    const actionText =
      dec?.action === "none" || !dec
        ? "None"
        : dec.amountDescription
          ? `${dec.action}: ${dec.amountDescription}`
          : dec.action;
    lines.push(`  ${protocol}  |  ${pos.market}`);
    lines.push(`    LTV: ${(pos.ltv * 100).toFixed(2)}%   Health Factor: ${pos.healthFactor.toFixed(2)}`);
    lines.push(`    Risk level: ${pos.riskLevel}`);
    lines.push(`    Simulated mitigation action: ${actionText}`);
    lines.push("");
  }
  return lines;
}

/**
 * Builds and returns the DEMO SNAPSHOT text (for testing or custom logging).
 */
export function formatDemoSnapshot(
  classified: ClassifiedPosition[],
  decisions: MitigationDecision[],
): string {
  const width = 52;
  const border = line(width, "═");
  const lines: string[] = [
    "",
    border,
    "  DEMO SNAPSHOT (first iteration)",
    border,
    "",
  ];
  for (const protocol of PROTOCOL_ORDER) {
    const positions = classified.filter(
      (p) => p.protocol.toLowerCase() === protocol.toLowerCase(),
    );
    lines.push(...formatPositionBlock(protocol, positions, decisions));
  }
  lines.push(border);
  lines.push("");
  return lines.join("\n");
}

/**
 * Logs the DEMO SNAPSHOT to console: Kamino, Marginfi, Solend with
 * LTV, Health Factor, Risk level, and Simulated mitigation action.
 * Call once on the first loop iteration.
 */
export function logDemoSnapshot(
  classified: ClassifiedPosition[],
  decisions: MitigationDecision[],
): void {
  // eslint-disable-next-line no-console
  console.log(formatDemoSnapshot(classified, decisions));
}

/** Tracks whether the first iteration has run; used by the agent loop. */
let firstIterationDone = false;

/**
 * Call at the start of each loop iteration. On the first iteration only,
 * logs the DEMO SNAPSHOT (Kamino, Marginfi, Solend — LTV, HF, risk, simulated
 * action) then marks first iteration done. No-op on subsequent iterations.
 */
export function logDemoSnapshotIfFirst(
  classified: ClassifiedPosition[],
  decisions: MitigationDecision[],
): void {
  if (firstIterationDone) return;
  logDemoSnapshot(classified, decisions);
  firstIterationDone = true;
}

export const __testing = {
  resetFirstIterationDone(): void {
    firstIterationDone = false;
  },
};
