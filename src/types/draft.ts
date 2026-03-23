export type DraftPhase = 'lobby' | 'countdown' | 'drafting' | 'user-turn' | 'complete'
export type AIArchetype = 'value-hunter' | 'corruption-chaser' | 'party-loyalist' | 'balanced'

export const DRAFT_CONFIG = {
  TEAM_COUNT: 4,
  ROUNDS: 4,           // 3 active + 1 bench = 4 picks per team
  TOTAL_PICKS: 16,     // 4 teams * 4 rounds
  ACTIVE_SLOTS: 3,
  BENCH_SLOTS: 1,
  SALARY_CAP: 50_000,
  USER_PICK_TIMER_SECONDS: 60,
  COUNTDOWN_SECONDS: 10,
  AI_DELAY_MIN_MS: 2000,
  AI_DELAY_MAX_MS: 5000,
  AI_MISTAKE_RATE: 0.15,  // 15% chance AI picks #2 or #3 instead of best
} as const

export interface DraftTeam {
  index: number
  name: string
  owner: string
  archetype: AIArchetype | 'human'
  roster: string[]         // bioguideIds, grows during draft
  salaryUsed: number
  isUser: boolean
}

export interface DraftPick {
  pickNumber: number       // 0-based global pick index
  round: number            // 0-based round number
  teamIndex: number        // which team made this pick
  bioguideId: string
  salaryCap: number        // salary of the picked politician
  timestamp: number
}

export interface DraftGrade {
  teamIndex: number
  letter: string           // A+, A, A-, B+, B, B-, C+, C, C-, D, F
  score: number            // 0-100 composite score
  writeup: string          // 2-3 sentence ESPN-style commentary
  topPick: string          // bioguideId of highest-value pick
  salaryEfficiency: number // points per $1000 spent
}

export interface SleeperPick {
  pickNumber: number
  bioguideId: string
  teamIndex: number
  reason: string           // e.g. "High trade volume at bench price"
}
