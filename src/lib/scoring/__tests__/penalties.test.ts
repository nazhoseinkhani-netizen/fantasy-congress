import { describe, it, expect } from 'vitest'
import { detectPenalties } from '../penalties'
import type { Trade } from '@/types/trade'

const baseTrade: Trade = {
  id: 'trade-1',
  bioguideId: 'A000001',
  politicianName: 'Jane Doe',
  party: 'D',
  chamber: 'senate',
  ticker: 'AAPL',
  company: 'Apple Inc.',
  sector: 'Technology',
  tradeType: 'sell',
  disclosureDate: '2025-10-20',
  tradeDate: '2025-10-10',
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

const baseConfig = {
  basePointsOutperform: 10,
  basePointsUnderperform: -5,
  excessReturnMultiplier: 2,
  amountMultipliers: {
    '$1k-$15k': 1,
    '$15k-$50k': 1.5,
    '$50k-$100k': 2,
    '$100k-$250k': 2.5,
    '$250k-$500k': 3,
    '$500k-$1M': 3.5,
    '$1M+': 4,
  },
  bonuses: {
    insiderTiming: 15,
    donorDarling: 10,
    bigMover: 20,
    bipartisanBet: 25,
    activityBonus: 5,
  },
  penalties: {
    paperHands: -15,
    lateDisclosure: -10,
    washSale: -5,
  },
  multipliers: {
    committeeChair: 1.5,
    leadership: 1.3,
  },
}

describe('detectPenalties()', () => {
  it('returns empty array when no penalties apply', () => {
    const result = detectPenalties(baseTrade, {
      otherTradesSameTicker: [],
    }, baseConfig)
    expect(result).toHaveLength(0)
  })

  it('paperHands: detected when same ticker bought within 14 days before this sell => -15', () => {
    const result = detectPenalties(baseTrade, {
      otherTradesSameTicker: [
        { tradeType: 'buy', tradeDate: '2025-10-03' }, // 7 days before sell on Oct 10
      ],
    }, baseConfig)
    const penalty = result.find(p => p.type === 'paperHands')
    expect(penalty).toBeDefined()
    expect(penalty?.points).toBe(-15)
  })

  it('paperHands: NOT detected when buy was more than 14 days before sell', () => {
    const result = detectPenalties(baseTrade, {
      otherTradesSameTicker: [
        { tradeType: 'buy', tradeDate: '2025-09-20' }, // 20 days before sell
      ],
    }, baseConfig)
    const penalty = result.find(p => p.type === 'paperHands')
    expect(penalty).toBeUndefined()
  })

  it('lateDisclosure: detected when daysToDisclose > 45 => -10', () => {
    const trade = { ...baseTrade, daysToDisclose: 50 }
    const result = detectPenalties(trade, {
      otherTradesSameTicker: [],
    }, baseConfig)
    const penalty = result.find(p => p.type === 'lateDisclosure')
    expect(penalty).toBeDefined()
    expect(penalty?.points).toBe(-10)
  })

  it('lateDisclosure: NOT detected when daysToDisclose <= 45', () => {
    const trade = { ...baseTrade, daysToDisclose: 45 }
    const result = detectPenalties(trade, {
      otherTradesSameTicker: [],
    }, baseConfig)
    const penalty = result.find(p => p.type === 'lateDisclosure')
    expect(penalty).toBeUndefined()
  })

  it('washSale: detected when same ticker bought and sold within 30 days => -5', () => {
    // baseTrade is a sell on Oct 10, there's a buy on Sep 25 (15 days before) = within 30 days
    const result = detectPenalties(baseTrade, {
      otherTradesSameTicker: [
        { tradeType: 'buy', tradeDate: '2025-09-25' }, // 15 days before sell
      ],
    }, baseConfig)
    const penalty = result.find(p => p.type === 'washSale')
    expect(penalty).toBeDefined()
    expect(penalty?.points).toBe(-5)
  })

  it('multiple penalties can apply simultaneously', () => {
    const trade = { ...baseTrade, daysToDisclose: 60 }
    const result = detectPenalties(trade, {
      otherTradesSameTicker: [
        { tradeType: 'buy', tradeDate: '2025-10-03' }, // 7 days before -> paperHands
      ],
    }, baseConfig)
    // paperHands + lateDisclosure
    expect(result.length).toBeGreaterThanOrEqual(2)
  })
})
