import { describe, it, expect } from 'vitest'
import { detectBonuses } from '../bonuses'
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

describe('detectBonuses()', () => {
  it('returns empty array when no bonuses apply', () => {
    const result = detectBonuses(baseTrade, {
      committeeHearings: [],
      donorCompanies: [],
      isCrossPartyTrade: false,
      tradeCountInPeriod: 1,
    }, baseConfig)
    expect(result).toHaveLength(0)
  })

  it('insiderTiming: detected when trade date is within 7 days before a committee hearing on same sector => +15', () => {
    const result = detectBonuses(baseTrade, {
      committeeHearings: [{ date: '2025-10-10', sector: 'Technology' }], // 5 days after trade
      donorCompanies: [],
      isCrossPartyTrade: false,
      tradeCountInPeriod: 1,
    }, baseConfig)
    const bonus = result.find(b => b.type === 'insiderTiming')
    expect(bonus).toBeDefined()
    expect(bonus?.points).toBe(15)
  })

  it('insiderTiming: NOT detected when hearing is more than 7 days after trade', () => {
    const result = detectBonuses(baseTrade, {
      committeeHearings: [{ date: '2025-10-15', sector: 'Technology' }], // 10 days after trade
      donorCompanies: [],
      isCrossPartyTrade: false,
      tradeCountInPeriod: 1,
    }, baseConfig)
    const bonus = result.find(b => b.type === 'insiderTiming')
    expect(bonus).toBeUndefined()
  })

  it('donorDarling: detected when politician received donations from traded company => +10', () => {
    const result = detectBonuses(baseTrade, {
      committeeHearings: [],
      donorCompanies: ['Apple Inc.'],
      isCrossPartyTrade: false,
      tradeCountInPeriod: 1,
    }, baseConfig)
    const bonus = result.find(b => b.type === 'donorDarling')
    expect(bonus).toBeDefined()
    expect(bonus?.points).toBe(10)
  })

  it('bigMover: detected when absoluteReturn > 30% => +20', () => {
    const trade = { ...baseTrade, absoluteReturn: 35 }
    const result = detectBonuses(trade, {
      committeeHearings: [],
      donorCompanies: [],
      isCrossPartyTrade: false,
      tradeCountInPeriod: 1,
    }, baseConfig)
    const bonus = result.find(b => b.type === 'bigMover')
    expect(bonus).toBeDefined()
    expect(bonus?.points).toBe(20)
  })

  it('bigMover: NOT detected when absoluteReturn <= 30%', () => {
    const trade = { ...baseTrade, absoluteReturn: 30 }
    const result = detectBonuses(trade, {
      committeeHearings: [],
      donorCompanies: [],
      isCrossPartyTrade: false,
      tradeCountInPeriod: 1,
    }, baseConfig)
    const bonus = result.find(b => b.type === 'bigMover')
    expect(bonus).toBeUndefined()
  })

  it('bipartisanBet: detected when flagged as cross-party trade => +25', () => {
    const result = detectBonuses(baseTrade, {
      committeeHearings: [],
      donorCompanies: [],
      isCrossPartyTrade: true,
      tradeCountInPeriod: 1,
    }, baseConfig)
    const bonus = result.find(b => b.type === 'bipartisanBet')
    expect(bonus).toBeDefined()
    expect(bonus?.points).toBe(25)
  })

  it('activityBonus: NOT included in per-trade detectBonuses (applied at politician level)', () => {
    // activityBonus is computed by scorePolitician(), not detectBonuses()
    const result = detectBonuses(baseTrade, {
      committeeHearings: [],
      donorCompanies: [],
      isCrossPartyTrade: false,
      tradeCountInPeriod: 3,
    }, baseConfig)
    const bonus = result.find(b => b.type === 'activityBonus')
    expect(bonus).toBeUndefined()
  })

  it('multiple bonuses detected simultaneously', () => {
    const trade = { ...baseTrade, absoluteReturn: 40 }
    const result = detectBonuses(trade, {
      committeeHearings: [{ date: '2025-10-10', sector: 'Technology' }],
      donorCompanies: ['Apple Inc.'],
      isCrossPartyTrade: true,
      tradeCountInPeriod: 2,
    }, baseConfig)
    expect(result.length).toBeGreaterThanOrEqual(4) // insiderTiming, donorDarling, bigMover, bipartisanBet
  })
})
