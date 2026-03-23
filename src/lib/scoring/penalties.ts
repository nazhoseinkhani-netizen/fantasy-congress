import type { Trade, TradeType } from '@/types/trade'
import type { ScoringConfig, PenaltyType } from '@/types/scoring'

export interface PenaltyContext {
  otherTradesSameTicker?: { tradeType: TradeType; tradeDate: string }[]
}

/**
 * Detects all applicable penalties for a trade and returns them as an array.
 * Each penalty is independently evaluated.
 */
export function detectPenalties(
  trade: Trade,
  context: PenaltyContext,
  config: ScoringConfig
): { type: PenaltyType; points: number }[] {
  const penalties: { type: PenaltyType; points: number }[] = []
  const otherTrades = context.otherTradesSameTicker ?? []
  const tradeDate = new Date(trade.tradeDate)

  // paperHands: same ticker sold within 14 days of buying (this is a sell, look for a recent buy)
  if (trade.tradeType === 'sell') {
    for (const other of otherTrades) {
      if (other.tradeType !== 'buy') continue
      const otherDate = new Date(other.tradeDate)
      const daysDiff = (tradeDate.getTime() - otherDate.getTime()) / (1000 * 60 * 60 * 24)
      // Buy was 0-14 days before this sell
      if (daysDiff >= 0 && daysDiff <= 14) {
        penalties.push({ type: 'paperHands', points: config.penalties.paperHands })
        break
      }
    }
  }

  // lateDisclosure: disclosed more than 45 days after trade
  if (trade.daysToDisclose > 45) {
    penalties.push({ type: 'lateDisclosure', points: config.penalties.lateDisclosure })
  }

  // washSale: bought and sold same ticker within 30 days (any direction)
  let hasWashSale = false
  for (const other of otherTrades) {
    // Skip if already penalized for paperHands on the same other trade
    const otherDate = new Date(other.tradeDate)
    const daysDiff = Math.abs(tradeDate.getTime() - otherDate.getTime()) / (1000 * 60 * 60 * 24)
    // Must be an opposite trade type within 30 days
    if (other.tradeType !== trade.tradeType && daysDiff <= 30) {
      hasWashSale = true
      break
    }
  }
  if (hasWashSale) {
    penalties.push({ type: 'washSale', points: config.penalties.washSale })
  }

  return penalties
}
