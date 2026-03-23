import { describe, it, expect } from 'vitest'
import { computeInsiderRiskScore, getInsiderRiskTier } from '../insider-risk'
import type { InsiderRiskInput } from '../insider-risk'

// NOTE: stockActCompliance in InsiderRiskInput is treated as a risk signal (0=low risk, 100=high risk).
// The caller is responsible for inverting raw compliance percentages before passing them in.
// Per spec: 0.15*20 (not 0.15*80) in the 69.5 example.

describe('getInsiderRiskTier()', () => {
  it('score 14 => clean-record (below 15 threshold)', () => {
    expect(getInsiderRiskTier(14)).toBe('clean-record')
  })

  it('score 15 => minor-concerns (at 15 threshold)', () => {
    expect(getInsiderRiskTier(15)).toBe('minor-concerns')
  })

  it('score 34 => minor-concerns (below 35 threshold)', () => {
    expect(getInsiderRiskTier(34)).toBe('minor-concerns')
  })

  it('score 35 => raised-eyebrows (at 35 threshold)', () => {
    expect(getInsiderRiskTier(35)).toBe('raised-eyebrows')
  })

  it('score 59 => raised-eyebrows (below 60 threshold)', () => {
    expect(getInsiderRiskTier(59)).toBe('raised-eyebrows')
  })

  it('score 60 => seriously-suspicious (at 60 threshold)', () => {
    expect(getInsiderRiskTier(60)).toBe('seriously-suspicious')
  })

  it('score 84 => seriously-suspicious (below 85 threshold)', () => {
    expect(getInsiderRiskTier(84)).toBe('seriously-suspicious')
  })

  it('score 85 => peak-swamp (at 85 threshold)', () => {
    expect(getInsiderRiskTier(85)).toBe('peak-swamp')
  })

  it('score 100 => peak-swamp (maximum)', () => {
    expect(getInsiderRiskTier(100)).toBe('peak-swamp')
  })

  it('score 0 => clean-record (minimum)', () => {
    expect(getInsiderRiskTier(0)).toBe('clean-record')
  })
})

describe('computeInsiderRiskScore()', () => {
  it('all components at 0 => score 0, tier clean-record', () => {
    const input: InsiderRiskInput = {
      donorOverlap: 0,
      suspiciousTiming: 0,
      committeeConflict: 0,
      stockActCompliance: 0,
      tradeVolume: 0,
    }
    const result = computeInsiderRiskScore(input)
    expect(result.score).toBeCloseTo(0)
    expect(result.tier).toBe('clean-record')
  })

  it('all components at 100 => score 100, tier peak-swamp', () => {
    const input: InsiderRiskInput = {
      donorOverlap: 100,
      suspiciousTiming: 100,
      committeeConflict: 100,
      stockActCompliance: 100,
      tradeVolume: 100,
    }
    const result = computeInsiderRiskScore(input)
    expect(result.score).toBeCloseTo(100)
    expect(result.tier).toBe('peak-swamp')
  })

  it('all components at 50 => weighted sum = 50.0, tier raised-eyebrows', () => {
    // 0.20*50 + 0.30*50 + 0.25*50 + 0.15*50 + 0.10*50 = 10+15+12.5+7.5+5 = 50
    const input: InsiderRiskInput = {
      donorOverlap: 50,
      suspiciousTiming: 50,
      committeeConflict: 50,
      stockActCompliance: 50,
      tradeVolume: 50,
    }
    const result = computeInsiderRiskScore(input)
    expect(result.score).toBeCloseTo(50)
    expect(result.tier).toBe('raised-eyebrows') // 35 <= 50 < 60
  })

  it('mixed components => score 69.5, tier seriously-suspicious', () => {
    // Per plan spec:
    // 0.2*80 + 0.3*90 + 0.25*70 + 0.15*20 + 0.1*60 = 16+27+17.5+3+6 = 69.5
    const input: InsiderRiskInput = {
      donorOverlap: 80,
      suspiciousTiming: 90,
      committeeConflict: 70,
      stockActCompliance: 20,
      tradeVolume: 60,
    }
    const result = computeInsiderRiskScore(input)
    expect(result.score).toBeCloseTo(69.5)
    expect(result.tier).toBe('seriously-suspicious') // 60 <= 69.5 < 85
  })

  it('returns breakdown with individual component raw scores', () => {
    const input: InsiderRiskInput = {
      donorOverlap: 80,
      suspiciousTiming: 90,
      committeeConflict: 70,
      stockActCompliance: 20,
      tradeVolume: 60,
    }
    const result = computeInsiderRiskScore(input)
    expect(result.breakdown.donorOverlap).toBe(80)
    expect(result.breakdown.suspiciousTiming).toBe(90)
    expect(result.breakdown.committeeConflict).toBe(70)
    expect(result.breakdown.stockActCompliance).toBe(20)
    expect(result.breakdown.tradeVolume).toBe(60)
  })

  it('score is clamped to minimum 0', () => {
    const input: InsiderRiskInput = {
      donorOverlap: -100,
      suspiciousTiming: -100,
      committeeConflict: -100,
      stockActCompliance: -100,
      tradeVolume: -100,
    }
    const result = computeInsiderRiskScore(input)
    expect(result.score).toBe(0)
  })

  it('score is clamped to maximum 100', () => {
    const input: InsiderRiskInput = {
      donorOverlap: 200,
      suspiciousTiming: 200,
      committeeConflict: 200,
      stockActCompliance: 200,
      tradeVolume: 200,
    }
    const result = computeInsiderRiskScore(input)
    expect(result.score).toBe(100)
  })

  it('tier returned by computeInsiderRiskScore matches getInsiderRiskTier', () => {
    const input: InsiderRiskInput = {
      donorOverlap: 0,
      suspiciousTiming: 0,
      committeeConflict: 0,
      stockActCompliance: 0,
      tradeVolume: 0,
    }
    const result = computeInsiderRiskScore(input)
    expect(result.tier).toBe(getInsiderRiskTier(result.score))
  })
})
