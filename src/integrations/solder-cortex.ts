/**
 * Solder Cortex Integration for DeFi Risk Guardian
 * 
 * Enhances risk assessment with conviction scoring.
 * Wallets with high conviction (active in DeFi + prediction markets) 
 * are less likely to abandon positions under stress.
 * 
 * Demo: http://76.13.193.103/
 * GitHub: https://github.com/metalmcclaw/solder-cortex
 */

const CORTEX_API = process.env.CORTEX_API_URL || 'http://76.13.193.103/api';

export interface ConvictionScore {
  wallet: string;
  score: number;
  defiActivity: number;
  predictionMarketActivity: number;
  crossDomainCorrelation: number;
}

export interface RiskAssessment {
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  conviction: ConvictionScore | null;
  reason: string;
}

/**
 * Fetch conviction score for a wallet
 */
export async function getWalletConviction(wallet: string): Promise<ConvictionScore | null> {
  try {
    const response = await fetch(`${CORTEX_API}/conviction/${wallet}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Solder Cortex API error:', error);
    return null;
  }
}

/**
 * Assess liquidation risk using conviction data
 * High conviction wallets are more likely to manage positions actively
 */
export async function assessLiquidationRisk(
  wallet: string,
  healthFactor: number
): Promise<RiskAssessment> {
  const conviction = await getWalletConviction(wallet);
  
  if (!conviction) {
    return {
      riskLevel: healthFactor < 1.1 ? 'HIGH' : 'MEDIUM',
      conviction: null,
      reason: 'Could not fetch conviction - using health factor only'
    };
  }
  
  // High conviction wallets actively manage positions
  if (conviction.score >= 0.8 && healthFactor > 1.05) {
    return {
      riskLevel: 'LOW',
      conviction,
      reason: `High conviction (${conviction.score.toFixed(2)}) - likely to manage position`
    };
  }
  
  if (conviction.score < 0.3 && healthFactor < 1.2) {
    return {
      riskLevel: 'HIGH',
      conviction,
      reason: `Low conviction (${conviction.score.toFixed(2)}) - may abandon position`
    };
  }
  
  return {
    riskLevel: 'MEDIUM',
    conviction,
    reason: `Moderate conviction (${conviction.score.toFixed(2)})`
  };
}

export { CORTEX_API };
