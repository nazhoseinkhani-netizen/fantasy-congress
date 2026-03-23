import type { Trade } from '@/types/trade'
import type { ScoringConfig, TradeScore, PoliticianScore, BonusType, PenaltyType } from '@/types/scoring'
import { DEFAULT_SCORING_CONFIG, SEASON_WEEKS } from './config'
import { detectBonuses, type BonusContext } from './bonuses'
import { detectPenalties, type PenaltyContext } from './penalties'

export type TradeContext = BonusContext & PenaltyContext & {
  isCommitteeChair: boolean
  isLeadership: boolean
}

export interface PoliticianContext {
  isCommitteeChair: boolean
  isLeadership: boolean
  /** Per-trade context keyed by trade id. Falls back to empty context if not found. */
  tradeContexts: Record<string, Partial<BonusContext & PenaltyContext>>
}

/**
 * Scores a single trade and returns a detailed TradeScore breakdown.
 *
 * Formula:
 *   basePoints = outperform ? config.basePointsOutperform : config.basePointsUnderperform
 *   excessReturnPoints = trade.returnVsSP500 * config.excessReturnMultiplier
 *   bonusSum = sum of all detected bonus points
 *   penaltySum = sum of all detected penalty points
 *   totalBeforeMultiplier = (basePoints + excessReturnPoints + bonusSum + penaltySum) * amountMultiplier
 *   positionMultiplier = (isChair ? 1.5 : 1) * (isLeadership ? 1.3 : 1)
 *   total = totalBeforeMultiplier * positionMultiplier
 */
export function scoreTrade(
  trade: Trade,
  context: TradeContext,
  config: ScoringConfig = DEFAULT_SCORING_CONFIG
): TradeScore {
  // Base points
  const basePoints = trade.returnVsSP500 > 0
    ? config.basePointsOutperform
    : config.basePointsUnderperform

  // Excess return points
  const excessReturnPoints = trade.returnVsSP500 * config.excessReturnMultiplier

  // Amount multiplier
  const amountMultiplier = config.amountMultipliers[trade.amountRange]

  // Bonuses
  const bonuses: { type: BonusType; points: number }[] = detectBonuses(trade, context, config)
  const bonusSum = bonuses.reduce((sum, b) => sum + b.points, 0)

  // Penalties
  const penalties: { type: PenaltyType; points: number }[] = detectPenalties(trade, context, config)
  const penaltySum = penalties.reduce((sum, p) => sum + p.points, 0)

  // Total before position multiplier
  const totalBeforeMultiplier = (basePoints + excessReturnPoints + bonusSum + penaltySum) * amountMultiplier

  // Position multiplier (compounding)
  const chairMult = context.isCommitteeChair ? config.multipliers.committeeChair : 1
  const leaderMult = context.isLeadership ? config.multipliers.leadership : 1
  const positionMultiplier = chairMult * leaderMult

  const total = totalBeforeMultiplier * positionMultiplier

  return {
    tradeId: trade.id,
    basePoints,
    excessReturnPoints,
    amountMultiplier,
    bonuses,
    penalties,
    positionMultiplier,
    totalBeforeMultiplier,
    total,
  }
}

/**
 * Scores all trades for a politician and produces aggregate season statistics.
 *
 * - weeklyPoints: 6-element array (index 0 = week 1), bucketed by tradeDate against SEASON_WEEKS
 * - winRate: fraction of trades where returnVsSP500 > 0
 * - avgReturn: mean of absoluteReturn across all trades
 */
export function scorePolitician(
  trades: Trade[],
  context: PoliticianContext,
  config: ScoringConfig = DEFAULT_SCORING_CONFIG
): PoliticianScore {
  const bioguideId = trades[0]?.bioguideId ?? ''

  // Score each trade individually
  const tradeScores: TradeScore[] = trades.map(trade => {
    const perTradeCtx = context.tradeContexts[trade.id] ?? {}
    const tradeContext: TradeContext = {
      isCommitteeChair: context.isCommitteeChair,
      isLeadership: context.isLeadership,
      committeeHearings: perTradeCtx.committeeHearings ?? [],
      donorCompanies: perTradeCtx.donorCompanies ?? [],
      isCrossPartyTrade: perTradeCtx.isCrossPartyTrade ?? false,
      tradeCountInPeriod: perTradeCtx.tradeCountInPeriod ?? 0,
      otherTradesSameTicker: perTradeCtx.otherTradesSameTicker ?? [],
    }
    return scoreTrade(trade, tradeContext, config)
  })

  // Season total
  const seasonPoints = tradeScores.reduce((sum, s) => sum + s.total, 0)

  // Weekly breakdown — 6-element array initialized to 0
  const weeklyPoints = new Array<number>(6).fill(0)
  trades.forEach((trade, idx) => {
    const score = tradeScores[idx]
    const weekIdx = SEASON_WEEKS.findIndex(w =>
      trade.tradeDate >= w.startDate && trade.tradeDate <= w.endDate
    )
    if (weekIdx !== -1) {
      weeklyPoints[weekIdx] += score.total
    }
    // Trades outside all season weeks still count toward seasonPoints (already added above)
  })

  // Win rate
  const winCount = trades.filter(t => t.returnVsSP500 > 0).length
  const winRate = trades.length > 0 ? winCount / trades.length : 0

  // Average return
  const avgReturn = trades.length > 0
    ? trades.reduce((sum, t) => sum + t.absoluteReturn, 0) / trades.length
    : 0

  return {
    bioguideId,
    seasonPoints,
    weeklyPoints,
    tradeScores,
    tradeCount: trades.length,
    winRate,
    avgReturn,
  }
}
