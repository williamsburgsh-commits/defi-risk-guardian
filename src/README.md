# DeFi Risk Guardian

**An autonomous agent that monitors your Solana lending positions across Kamino, Marginfi, and Solend—and simulates mitigations before you get liquidated.**

---

## Why this matters

Liquidations wipe out collateral when LTV or health factor crosses protocol thresholds. This agent continuously watches your positions, evaluates risk (LTV, health factor), and **simulates** repay/rebalance actions so you see what would happen—without sending any transaction until you choose to.

---

## How autonomy works

- **Loop:** The agent runs a fixed-interval loop: fetch positions → classify risk (SAFE / WARNING / CRITICAL) → decide mitigations → simulate actions → log. No human in the loop.
- **No frontend, no manual triggers:** You configure wallet and RPC once; the agent runs headless. All logic is code (AI-written); humans only configure and run.

---

## Supported protocols

| Protocol | Notes |
|----------|--------|
| **Kamino** | Lending positions via API + RPC fallback |
| **Marginfi** | RPC + optional API for LTV/health |
| **Solend** | RPC + SPL obligation parsing |

---

## Safety guarantees

- **Read-only by default:** Position fetching and risk math only; no signing, no sending.
- **Simulation-only mitigations:** CRITICAL positions produce a *simulated* repay/rebalance (amount, protocol, market logged). Nothing is executed on-chain unless you explicitly enable and configure an on-chain alert path (e.g. AgentWallet).

---

## How to run

1. Copy `.env.example` to `.env` and set at least:
   - `SOLANA_RPC_URL` (and optionally `DEFI_GUARDIAN_WALLET` for your positions).
2. From repo root:
   ```bash
   pnpm openclaw
   ```
   Or run the agent loop script if you have one (e.g. `bun scripts/run-defi-guardian-loop.ts`).
3. Watch stdout: first iteration prints a **DEMO SNAPSHOT**; every iteration logs `[SIMULATION]` lines (protocol, market, LTV, HF, risk, action).

---

## Sample demo logs

First-iteration **DEMO SNAPSHOT** (screenshot-friendly):

```
════════════════════════════════════════════
  DEMO SNAPSHOT (first iteration)
════════════════════════════════════════════

  Kamino  |  SOL-USDC
    LTV: 45.00%   Health Factor: 2.20
    Risk level: SAFE
    Simulated mitigation action: None

  Marginfi  |  main
    LTV: 78.00%   Health Factor: 1.15
    Risk level: WARNING
    Simulated mitigation action: monitor: close to threshold

  Solend  |  main
    LTV: 92.00%   Health Factor: 1.02
    Risk level: CRITICAL
    Simulated mitigation action: simulate_repay: 50 USDC

════════════════════════════════════════════
```

Per-position simulation lines:

```
[SIMULATION] Protocol: Kamino   Market: SOL-USDC   LTV: 0.45   HF: 2.20   Risk: SAFE   Action: None
[SIMULATION] Protocol: Marginfi Market: main       LTV: 0.78   HF: 1.15   Risk: WARNING Action: monitor
[SIMULATION] Protocol: Solend   Market: main       LTV: 0.92   HF: 1.02   Risk: CRITICAL Action: simulate_repay [Amount: 50 USDC] (no on-chain execution)
```
