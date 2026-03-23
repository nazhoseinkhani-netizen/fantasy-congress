export type Party = 'D' | 'R' | 'I'
export type Chamber = 'senate' | 'house'

export type InsiderRiskTier =
  | 'clean-record'          // 0-14
  | 'minor-concerns'        // 15-34
  | 'raised-eyebrows'       // 35-59
  | 'seriously-suspicious'  // 60-84
  | 'peak-swamp'            // 85-100

export interface InsiderRiskBreakdown {
  donorOverlap: number       // 0-100 component
  suspiciousTiming: number   // 0-100 component
  committeeConflict: number  // 0-100 component
  stockActCompliance: number // 0-100 component (inverted: lower = worse)
  tradeVolume: number        // 0-100 component
}

export interface Politician {
  bioguideId: string
  name: string
  firstName: string
  lastName: string
  party: Party
  chamber: Chamber
  state: string
  district?: string           // House members only
  committees: string[]
  photoUrl: string            // Pre-validated working URL or data URI
  isCommitteeChair: boolean
  isLeadership: boolean
  seasonPoints: number
  weeklyPoints: number[]      // Points per week (6 weeks)
  tradeCount: number
  winRate: number             // 0-1 (fraction of trades that beat S&P)
  avgReturn: number           // Average % return across trades
  insiderRiskScore: number    // 0-100 composite
  insiderRiskTier: InsiderRiskTier
  insiderRiskBreakdown: InsiderRiskBreakdown
  salaryCap: number           // Fantasy salary cost
  salaryTier: SalaryTier
}

export type SalaryTier = 'elite' | 'starter' | 'mid-tier' | 'bench' | 'sleeper' | 'unranked'
