import { describe, it, expect } from 'vitest'
import { scoreTrade, scorePolitician } from '../engine'
import type { Trade } from '@/types/trade'

// --- Fixtures ---

const baseTrade: Trade = {
  id: 'trade-1',
  bioguideId: 'A000001',
  politicianName: 'Jane Doe',
  party: 'D',
  chamber: 'senate',
  ticker: 'AAPL',
  company: 'Apple Inc.',
  sector: 'Technology',
  tradeType: 'buy',
  disclosureDate: '2025-10-20',
  tradeDate: '2025-10-05',
  amountRange: '$1k-$15k',
  returnVsSP500: 5,
  absoluteReturn: 8,
  sp500Return: 3,
  daysToDisclose: 15,
  fantasyPoints: 0,
  scoreBreakdown: {
    basePoints: 0,
    excessReturnPoints: 0,
    amountMultiplier: 1,
    bonuses: [],
    penalties: [],
    positionMultiplier: 1,
    totalBeforeMultiplier: 0,
    total: 0,
  },
}

const baseContext = {
  isCommitteeChair: false,
  isLeadership: false,
  committeeHearings: [],
  donorCompanies: [],
  isCrossPartyTrade: false,
  tradeCountInPeriod: 1,
  otherTradesSameTicker: [],
}

describe('scoreTrade()', () => {
  it('outperforms S&P by 5% with $1k-$15k range: base=10, excessReturn=10, amountMult=1 => total=20', () => {
    const result = scoreTrade(baseTrade, baseContext)
    expect(result.tradeId).toBe('trade-1')
    expect(result.basePoints).toBe(10)
    expect(result.excessReturnPoints).toBe(10) // 5 * 2
    expect(result.amountMultiplier).toBe(1)
    expect(result.bonuses).toHaveLength(0)
    expect(result.penalties).toHaveLength(0)
    expect(result.positionMultiplier).toBe(1)
    expect(result.totalBeforeMultiplier).toBe(20) // (10+10)*1
    expect(result.total).toBe(20)
  })

  it('underperforms S&P by 3% with $100k-$250k range: base=-5, excessReturn=-6, amountMult=2.5 => total=-27.5', () => {
    const trade = { ...baseTrade, id: 'trade-2', returnVsSP500: -3, absoluteReturn: -1, amountRange: '$100k-$250k' as const }
    const result = scoreTrade(trade, baseContext)
    expect(result.basePoints).toBe(-5)
    expect(result.excessReturnPoints).toBe(-6) // -3 * 2
    expect(result.amountMultiplier).toBe(2.5)
    expect(result.totalBeforeMultiplier).toBeCloseTo(-27.5) // (-5 + -6) * 2.5
    expect(result.total).toBeCloseTo(-27.5)
  })

  it('committee chair multiplier (1.5x) applied to total', () => {
    const context = { ...baseContext, isCommitteeChair: true }
    const result = scoreTrade(baseTrade, context)
    expect(result.positionMultiplier).toBe(1.5)
    expect(result.total).toBeCloseTo(30) // 20 * 1.5
  })

  it('leadership multiplier (1.3x) applied to total', () => {
    const context = { ...baseContext, isLeadership: true }
    const result = scoreTrade(baseTrade, context)
    expect(result.positionMultiplier).toBe(1.3)
    expect(result.total).toBeCloseTo(26) // 20 * 1.3
  })

  it('committee chair AND leadership multipliers compound: 1.5 * 1.3 = 1.95x', () => {
    const context = { ...baseContext, isCommitteeChair: true, isLeadership: true }
    const result = scoreTrade(baseTrade, context)
    expect(result.positionMultiplier).toBeCloseTo(1.95) // 1.5 * 1.3
    expect(result.total).toBeCloseTo(39) // 20 * 1.95
  })

  it('amount multiplier scales: $1M+ uses 4x', () => {
    const trade = { ...baseTrade, id: 'trade-5', amountRange: '$1M+' as const }
    const result = scoreTrade(trade, baseContext)
    expect(result.amountMultiplier).toBe(4)
    expect(result.totalBeforeMultiplier).toBeCloseTo(80) // (10+10)*4
  })

  it('amount multiplier scales: $500k-$1M uses 3.5x', () => {
    const trade = { ...baseTrade, id: 'trade-6', amountRange: '$500k-$1M' as const }
    const result = scoreTrade(trade, baseContext)
    expect(result.amountMultiplier).toBe(3.5)
  })
})

describe('scorePolitician()', () => {
  const trade1: Trade = {
    ...baseTrade,
    id: 'trade-p1',
    returnVsSP500: 5,
    absoluteReturn: 8,
    amountRange: '$1k-$15k',
    tradeDate: '2025-10-05',
  }
  const trade2: Trade = {
    ...baseTrade,
    id: 'trade-p2',
    returnVsSP500: -2,
    absoluteReturn: -1,
    amountRange: '$1k-$15k',
    tradeDate: '2025-10-20',
  }

  it('aggregates trade scores into season total', () => {
    const result = scorePolitician([trade1, trade2], {
      isCommitteeChair: false,
      isLeadership: false,
      tradeContexts: {},
    })
    // trade1: base=10, excessReturn=10, amountMult=1 => 20
    // trade2: base=-5, excessReturn=-4, amountMult=1 => -9
    expect(result.seasonPoints).toBeCloseTo(11) // 20 + (-9)
    expect(result.tradeCount).toBe(2)
  })

  it('computes win rate correctly', () => {
    const result = scorePolitician([trade1, trade2], {
      isCommitteeChair: false,
      isLeadership: false,
      tradeContexts: {},
    })
    expect(result.winRate).toBeCloseTo(0.5) // 1 of 2 trades beat S&P
  })

  it('computes avg return correctly', () => {
    const result = scorePolitician([trade1, trade2], {
      isCommitteeChair: false,
      isLeadership: false,
      tradeContexts: {},
    })
    expect(result.avgReturn).toBeCloseTo(3.5) // (8 + (-1)) / 2
  })

  it('computes weekly points by bucketing trades into season weeks', () => {
    const result = scorePolitician([trade1, trade2], {
      isCommitteeChair: false,
      isLeadership: false,
      tradeContexts: {},
    })
    // trade1 date 2025-10-05 => Week 1 (Oct 1-14)
    // trade2 date 2025-10-20 => Week 2 (Oct 15-28)
    expect(result.weeklyPoints).toHaveLength(6)
    expect(result.weeklyPoints[0]).toBeCloseTo(20) // week 1
    expect(result.weeklyPoints[1]).toBeCloseTo(-9) // week 2
    expect(result.weeklyPoints[2]).toBe(0) // week 3, no trades
  })

  it('handles empty trade list', () => {
    const result = scorePolitician([], {
      isCommitteeChair: false,
      isLeadership: false,
      tradeContexts: {},
    })
    expect(result.seasonPoints).toBe(0)
    expect(result.tradeCount).toBe(0)
    expect(result.winRate).toBe(0)
    expect(result.avgReturn).toBe(0)
    expect(result.weeklyPoints).toEqual([0, 0, 0, 0, 0, 0])
  })
})
