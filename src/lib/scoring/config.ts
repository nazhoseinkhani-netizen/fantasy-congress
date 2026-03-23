import { readFileSync } from 'fs'
import { join } from 'path'
import type { ScoringConfig, InsiderRiskConfig, SeasonWeek } from '@/types/scoring'

export const DEFAULT_SCORING_CONFIG: ScoringConfig = {
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

export const DEFAULT_INSIDER_RISK_CONFIG: InsiderRiskConfig = {
  weights: {
    donorOverlap: 0.20,
    suspiciousTiming: 0.30,
    committeeConflict: 0.25,
    stockActCompliance: 0.15,
    tradeVolume: 0.10,
  },
  tierThresholds: {
    cleanRecord: 15,
    minorConcerns: 35,
    raisedEyebrows: 60,
    seriouslySuspicious: 85,
  },
}

/** Season week boundaries — dynamically computed at build time by compute-season.ts. */
/** Trades are bucketed into weeks by comparing trade.tradeDate against these date ranges. */
/** A trade falls into the week where startDate <= tradeDate <= endDate. */
/** Trades outside all week ranges are excluded from weeklyPoints but still count toward seasonPoints. */

// Dynamic season weeks — computed at build time by compute-season.ts (scripts/compute-season.ts)
// which reads _raw-trades.json and writes public/data/season-weeks.json.
// Falls back to hardcoded defaults if season-weeks.json doesn't exist yet (first run).
function loadSeasonWeeks(): SeasonWeek[] {
  try {
    const raw = readFileSync(join(process.cwd(), 'public', 'data', 'season-weeks.json'), 'utf8')
    return JSON.parse(raw) as SeasonWeek[]
  } catch {
    // Fallback for first build or if season-weeks.json doesn't exist yet
    return [
      { week: 1, startDate: '2025-10-01', endDate: '2025-10-14' },
      { week: 2, startDate: '2025-10-15', endDate: '2025-10-28' },
      { week: 3, startDate: '2025-10-29', endDate: '2025-11-11' },
      { week: 4, startDate: '2025-11-12', endDate: '2025-11-25' },
      { week: 5, startDate: '2025-11-26', endDate: '2025-12-09' },
      { week: 6, startDate: '2025-12-10', endDate: '2025-12-23' },
    ]
  }
}

export const SEASON_WEEKS: SeasonWeek[] = loadSeasonWeeks()
