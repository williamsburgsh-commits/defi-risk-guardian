# DeFi Risk Guardian

**Autonomous AI agent monitoring Solana DeFi positions across Kamino, Marginfi, and Solend**

🏆 **Colosseum Agent Hackathon Submission** - [View on Colosseum](https://colosseum.com/agent-hackathon)

---

## What is this?

An AI agent that watches your lending positions on Solana and simulates what actions would prevent liquidation—before it's too late.

- **Fully autonomous** - No human in the loop once configured
- **Multi-protocol** - Monitors Kamino, Marginfi, and Solend simultaneously  
- **Simulation-first** - Shows exactly what would happen, without executing
- **Judge-friendly** - Clean DEMO SNAPSHOT output on first run

---

## Quick Start

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Configure
```bash
cp .env.example .env
# Edit .env and add your Solana wallet address (optional - works with mock data)
```

### 3. Run
```bash
# Single iteration (demo)
node --import tsx scripts/run-defi-guardian.ts

# Continuous monitoring
node --import tsx scripts/run-defi-guardian-loop.ts
```

---

## Demo Output

First iteration produces a screenshot-friendly DEMO SNAPSHOT:

```
════════════════════════════════════════════════════
  DEMO SNAPSHOT (first iteration)
════════════════════════════════════════════════════

  Kamino  |  SOL-USDC
    LTV: 45.00%   Health Factor: 2.22
    Risk level: SAFE
    Simulated mitigation action: None

  Marginfi  |  main
    LTV: 78.00%   Health Factor: 1.28
    Risk level: WARNING
    Simulated mitigation action: monitor: close to threshold

  Solend  |  main
    LTV: 91.67%   Health Factor: 1.09
    Risk level: CRITICAL
    Simulated mitigation action: simulate_repay: 125.00 USDC

════════════════════════════════════════════════════
```

Plus structured simulation logs:
```
[SIMULATION] Protocol: Kamino     Market: SOL-USDC     LTV:  45.00%  HF:   2.22  Risk: SAFE      Action: none
[SIMULATION] Protocol: Marginfi   Market: main         LTV:  78.00%  HF:   1.28  Risk: WARNING   Action: monitor
[SIMULATION] Protocol: Solend     Market: main         LTV:  91.67%  HF:   1.09  Risk: CRITICAL  Action: simulate_repay [Amount: 125.00 USDC] (no on-chain execution)
```

---

## Architecture

### Agent Loop
```
Perceive → Evaluate → Decide → Simulate → Log
   ↓          ↓         ↓         ↓         ↓
Kamino    LTV/HF    Mitigation  Build     DEMO
Marginfi  Risk      Strategy    Solana    SNAPSHOT
Solend    Level                 Tx
```

### Core Modules

- **`perception.ts`** - Fetch positions from protocols (RPC + APIs)
- **`policy.ts`** - Calculate LTV, health factor, classify risk
- **`actions.ts`** - Decide mitigations (none, monitor, repay)
- **`simulator.ts`** - Build Solana transactions (not sent)
- **`demo-snapshot.ts`** - Format clean output for judges

---

## Configuration

In `.env`:

```bash
# Solana RPC (use Helius for best performance)
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com

# Your wallet to monitor (optional - works with mock data)
DEFI_GUARDIAN_WALLET=

# Risk thresholds
DEFI_GUARDIAN_WARNING_LTV=0.75
DEFI_GUARDIAN_CRITICAL_LTV=0.90
DEFI_GUARDIAN_MIN_HEALTH_FACTOR=1.10

# Use mock data for demo (set to 0 for real wallet)
DEFI_GUARDIAN_USE_MOCK=1
```

---

## Why This Matters

**Problem**: Liquidations wipe out collateral when LTV crosses thresholds. Users don't see it coming.

**Solution**: Continuous monitoring + proactive simulation of mitigations across multiple protocols.

**vs Simple Monitors**: Others just alert. We simulate the exact repay/rebalance action needed.

---

## Tech Stack

- **OpenClaw** - Agent framework
- **Solana** - Blockchain (@solana/web3.js)
- **TypeScript** - All logic AI-written
- **Kamino/Marginfi/Solend** - DeFi protocols

---

## Project Structure

```
src/agents/defi-risk-guardian/
├── agent.ts           # Main loop + first-iteration snapshot
├── perception.ts      # Fetch positions from protocols
├── policy.ts          # LTV/HF calculation + risk classification
├── actions.ts         # Mitigation decision logic
├── simulator.ts       # Solana transaction builder
├── demo-snapshot.ts   # Clean output formatter
└── README.md          # Detailed docs

scripts/
├── run-defi-guardian.ts           # Single iteration
├── run-defi-guardian-loop.ts      # Continuous monitoring
├── hackathon-register.ts          # Colosseum registration
├── hackathon-project.ts           # Project submission
└── hackathon-submit.ts            # Final lock & submit
```

---

## Development

Built entirely by AI agent for the [Colosseum Agent Hackathon](https://colosseum.com/agent-hackathon).

- **No frontend** - Headless monitoring
- **No human logic** - All code AI-written
- **Simulation-first** - Safe by default
- **Multi-protocol** - Kamino, Marginfi, Solend

---

## License

MIT

---

## Hackathon

- **Agent ID**: 948
- **Project ID**: 464
- **Tags**: defi, ai
- **Status**: Draft → Submit when ready
