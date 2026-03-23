import type { Trade } from '@/types/trade'
import type { ScoringConfig, BonusType } from '@/types/scoring'

export interface BonusContext {
  committeeHearings?: { date: string; sector: string }[]
  donorCompanies?: string[]
  isCrossPartyTrade?: boolean
  tradeCountInPeriod?: number
}

/**
 * Detects all applicable bonuses for a trade and returns them as an array.
 * Each bonus is independently evaluated.
 */
export function detectBonuses(
  trade: Trade,
  context: BonusContext,
  config: ScoringConfig
): { type: BonusType; points: number }[] {
  const bonuses: { type: BonusType; points: number }[] = []

  // insiderTiming: trade date is within 7 days BEFORE a committee hearing on related sector
  const hearings = context.committeeHearings ?? []
  const tradeDate = new Date(trade.tradeDate)
  for (const hearing of hearings) {
    if (hearing.sector !== trade.sector) continue
    const hearingDate = new Date(hearing.date)
    const daysDiff = (hearingDate.getTime() - tradeDate.getTime()) / (1000 * 60 * 60 * 24)
    // Trade must be 0-7 days before hearing (positive diff means hearing is after trade)
    if (daysDiff >= 0 && daysDiff <= 7) {
      bonuses.push({ type: 'insiderTiming', points: config.bonuses.insiderTiming })
      break // Only one insiderTiming bonus per trade
    }
  }

  // donorDarling: politician received donations from traded company
  const donorCompanies = context.donorCompanies ?? []
  if (donorCompanies.includes(trade.company)) {
    bonuses.push({ type: 'donorDarling', points: config.bonuses.donorDarling })
  }

  // bigMover: absolute return exceeded 30%
  if (trade.absoluteReturn > 30) {
    bonuses.push({ type: 'bigMover', points: config.bonuses.bigMover })
  }

  // bipartisanBet: trade was cross-party
  if (context.isCrossPartyTrade === true) {
    bonuses.push({ type: 'bipartisanBet', points: config.bonuses.bipartisanBet })
  }

  return bonuses
}
