# DeFi Risk Guardian - Hackathon Setup Complete

## ✅ Registration Status

- **Agent Name**: defi-risk-guardian
- **Agent ID**: 948
- **Project ID**: 464
- **Status**: Draft (ready for updates and final submission)
- **GitHub Repo**: https://github.com/williamsburgsh-commits/Defi-Sentinel

## 🎟️ Claim Code (For Human Operator)

**Claim Code**: `c2a23107-8614-4443-855b-fc9f3632b9cb`

**Claim URL**: https://colosseum.com/agent-hackathon/claim/c2a23107-8614-4443-855b-fc9f3632b9cb

**Verification Code**: `bow-437F`

### Next Steps for Human:
1. Visit the claim URL above
2. Sign in with X (Twitter)
3. Provide your Solana wallet address for prize payouts

OR use tweet verification:
```bash
curl https://agents.colosseum.com/api/claim/c2a23107-8614-4443-855b-fc9f3632b9cb/info
```

---

## 🚀 Quick Start

### Run Single Iteration (Demo)
```bash
node --import tsx scripts/run-defi-guardian.ts
```

### Run Continuous Monitoring Loop
```bash
node --import tsx scripts/run-defi-guardian-loop.ts
```

### Update Project (Before Final Submission)
```bash
node --import tsx scripts/hackathon-update-project.ts
```

### Submit Project (FINAL - Locks Project!)
```bash
node --import tsx scripts/hackathon-submit.ts
```

---

## 📊 Demo Output

The agent produces a clean DEMO SNAPSHOT on first iteration:

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

[SIMULATION] Protocol: Kamino     Market: SOL-USDC     LTV:  45.00%  HF:   2.22  Risk: SAFE      Action: none
[SIMULATION] Protocol: Marginfi   Market: main         LTV:  78.00%  HF:   1.28  Risk: WARNING   Action: monitor [Amount: close to threshold]
[SIMULATION] Protocol: Solend     Market: main         LTV:  91.67%  HF:   1.09  Risk: CRITICAL  Action: simulate_repay [Amount: 125.00 USDC] (no on-chain execution)
```

---

## ⚙️ Configuration

Current `.env` settings:
```bash
# Colosseum Hackathon
COLOSSEUM_API_KEY=<your-key-here>

# Solana RPC
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com

# DeFi Risk Guardian
DEFI_GUARDIAN_WALLET=  # Add your wallet address for real data
DEFI_GUARDIAN_WARNING_LTV=0.75
DEFI_GUARDIAN_CRITICAL_LTV=0.90
DEFI_GUARDIAN_MIN_HEALTH_FACTOR=1.10
DEFI_GUARDIAN_LOOP_INTERVAL_MS=60000
DEFI_GUARDIAN_USE_MOCK=1  # Set to 0 when wallet configured
```

### To Use Real Wallet Data:
1. Add your Solana wallet address to `DEFI_GUARDIAN_WALLET`
2. Set `DEFI_GUARDIAN_USE_MOCK=0`
3. Optional: Get Helius API key and update `SOLANA_RPC_URL`
4. Run the agent

---

## 📦 What's Implemented

### ✅ Phase 1: Hackathon Registration
- [x] Agent registered with Colosseum
- [x] API key saved to `.env`
- [x] Claim code provided for human operator
- [x] Project created in draft status

### ✅ Phase 2: Solana Integration
- [x] Dependencies added (@solana/web3.js, bs58)
- [x] Real perception implementation with mock fallback
- [x] Real policy (LTV & health factor calculation)
- [x] Real actions (mitigation decision logic)
- [x] Real simulator (Solana transaction builder)

### ✅ Phase 3: Demo & Testing
- [x] Continuous monitoring loop script
- [x] DEMO SNAPSHOT on first iteration
- [x] Clean simulation logs
- [x] Tested with mock data

### 📋 Phase 4: Before Submission
- [ ] Add real wallet data (optional)
- [ ] Record demo video (optional)
- [ ] Update project description if needed
- [ ] Final submission (locks project)

---

## 🎯 Next Steps

### For the Human Operator:
1. **Claim your agent**: Visit the claim URL and link your X + Solana wallet
2. **Optional**: Add your wallet address to `.env` for real DeFi data
3. **Optional**: Get Helius API key for better RPC performance
4. **When ready**: Run final submission script

### For Continued Development:
- Implement real Kamino/Marginfi/Solend protocol integrations
- Add AgentWallet for optional on-chain alerts
- Create demo video showing agent in action
- Engage in hackathon forum

---

## 🏆 Submission Checklist

Before final submission, ensure:
- ✅ GitHub repo is public
- ✅ README.md is clear and complete
- ✅ Agent runs and produces demo output
- ✅ Code is clean and documented
- ✅ Claim code is linked to human X + wallet
- ⏳ Optional: Demo video uploaded
- ⏳ Optional: Real wallet data tested

**Remember**: Submission LOCKS the project - you cannot edit after!

---

## 📞 Support

- Hackathon Forum: https://colosseum.com/agent-hackathon
- Agent Status: `curl -H "Authorization: Bearer $COLOSSEUM_API_KEY" https://agents.colosseum.com/api/agents/status`
- Project Details: Saved in `.hackathon-project.json`
- Claim Details: Saved in `.hackathon-claim.json`
