import type { InsiderRiskConfig } from '@/types/scoring'
import type { InsiderRiskTier, InsiderRiskBreakdown } from '@/types/politician'
import { DEFAULT_INSIDER_RISK_CONFIG } from './config'

export interface InsiderRiskInput {
  donorOverlap: number       // 0-100: % of traded companies that are also donors
  suspiciousTiming: number   // 0-100: % of trades within 7 days of committee hearing
  committeeConflict: number  // 0-100: % of trades in sectors their committee oversees
  stockActCompliance: number // 0-100: risk signal — 0=low risk (on time), 100=high risk (always late)
  tradeVolume: number        // 0-100: normalized trade count (more trades = higher)
}

/**
 * Maps a 0-100 risk score to a named insider risk tier.
 *
 * Thresholds (from DEFAULT_INSIDER_RISK_CONFIG):
 *   score < 15  => 'clean-record'
 *   score < 35  => 'minor-concerns'
 *   score < 60  => 'raised-eyebrows'
 *   score < 85  => 'seriously-suspicious'
 *   score >= 85 => 'peak-swamp'
 */
export function getInsiderRiskTier(
  score: number,
  config: InsiderRiskConfig = DEFAULT_INSIDER_RISK_CONFIG
): InsiderRiskTier {
  if (score < config.tierThresholds.cleanRecord) return 'clean-record'
  if (score < config.tierThresholds.minorConcerns) return 'minor-concerns'
  if (score < config.tierThresholds.raisedEyebrows) return 'raised-eyebrows'
  if (score < config.tierThresholds.seriouslySuspicious) return 'seriously-suspicious'
  return 'peak-swamp'
}

/**
 * Computes a weighted 0-100 Insider Trading Risk Score from 5 components.
 *
 * Formula: score = sum of (input[component] * config.weights[component]) for each component
 * Score is clamped to [0, 100].
 *
 * Returns the score, named tier, and per-component breakdown (raw input values).
 */
export function computeInsiderRiskScore(
  input: InsiderRiskInput,
  config: InsiderRiskConfig = DEFAULT_INSIDER_RISK_CONFIG
): { score: number; tier: InsiderRiskTier; breakdown: InsiderRiskBreakdown } {
  const rawScore =
    input.donorOverlap * config.weights.donorOverlap +
    input.suspiciousTiming * config.weights.suspiciousTiming +
    input.committeeConflict * config.weights.committeeConflict +
    input.stockActCompliance * config.weights.stockActCompliance +
    input.tradeVolume * config.weights.tradeVolume

  const score = Math.min(100, Math.max(0, rawScore))
  const tier = getInsiderRiskTier(score, config)

  const breakdown: InsiderRiskBreakdown = {
    donorOverlap: input.donorOverlap,
    suspiciousTiming: input.suspiciousTiming,
    committeeConflict: input.committeeConflict,
    stockActCompliance: input.stockActCompliance,
    tradeVolume: input.tradeVolume,
  }

  return { score, tier, breakdown }
}
