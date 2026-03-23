export interface ScoringConfig {
  basePointsOutperform: number
  basePointsUnderperform: number
  excessReturnMultiplier: number
  amountMultipliers: {
    '$1k-$15k': number
    '$15k-$50k': number
    '$50k-$100k': number
    '$100k-$250k': number
    '$250k-$500k': number
    '$500k-$1M': number
    '$1M+': number
  }
  bonuses: {
    insiderTiming: number     // +15: traded within 7 days of committee hearing on related sector
    donorDarling: number      // +10: politician received campaign donations from traded company
    bigMover: number          // +20: trade return exceeded 30% absolute
    bipartisanBet: number     // +25: politician traded against their party's legislative position
    activityBonus: number     // +5 per trade in scoring period
  }
  penalties: {
    paperHands: number        // -15: sold within 14 days of buying same ticker
    lateDisclosure: number    // -10: disclosed more than 45 days after trade (STOCK Act violation)
    washSale: number          // -5: bought and sold same ticker within 30 days
  }
  multipliers: {
    committeeChair: number    // 1.5x
    leadership: number        // 1.3x
  }
}

export type BonusType = 'insiderTiming' | 'donorDarling' | 'bigMover' | 'bipartisanBet' | 'activityBonus'
export type PenaltyType = 'paperHands' | 'lateDisclosure' | 'washSale'

export interface TradeScore {
  tradeId: string
  basePoints: number
  excessReturnPoints: number
  amountMultiplier: number
  bonuses: { type: BonusType; points: number }[]
  penalties: { type: PenaltyType; points: number }[]
  positionMultiplier: number
  totalBeforeMultiplier: number
  total: number
}

export interface PoliticianScore {
  bioguideId: string
  seasonPoints: number
  weeklyPoints: number[]
  tradeScores: TradeScore[]
  tradeCount: number
  winRate: number
  avgReturn: number
}

export interface InsiderRiskConfig {
  weights: {
    donorOverlap: number       // e.g. 0.20
    suspiciousTiming: number    // e.g. 0.30
    committeeConflict: number   // e.g. 0.25
    stockActCompliance: number  // e.g. 0.15
    tradeVolume: number         // e.g. 0.10
  }
  tierThresholds: {
    cleanRecord: number         // 0-14
    minorConcerns: number       // 15-34
    raisedEyebrows: number      // 35-59
    seriouslySuspicious: number // 60-84
    // 85-100 is Peak Swamp (implicit)
  }
}

/** Defines a scoring week boundary for bucketing trades into weekly points. */
export interface SeasonWeek {
  week: number            // 1-6
  startDate: string       // ISO 8601 date (inclusive)
  endDate: string         // ISO 8601 date (inclusive)
}
