export interface League {
  id: string
  name: string
  teams: Team[]
  schedule: WeekSchedule[]
  currentWeek: number          // 1-6
}

export interface Team {
  id: string
  leagueId: string
  name: string
  owner: string                // Display name
  isUserTeam: boolean
  roster: Roster
  record: { wins: number; losses: number; ties: number }
  pointsFor: number
  pointsAgainst: number
  streak: string               // e.g. "W2", "L1", "T1"
}

export interface Roster {
  active: string[]             // bioguideIds (8 slots)
  bench: string[]              // bioguideIds (4 slots)
  salaryCap: number            // Total cap (e.g. 50000)
  salaryUsed: number           // Sum of active + bench salaries
}

export interface WeekSchedule {
  week: number
  matchups: Matchup[]
}

export interface Matchup {
  week: number
  leagueId: string
  homeTeamId: string
  awayTeamId: string
  homeScore: number
  awayScore: number
  completed: boolean
}

export interface WeekResult {
  week: number
  teamId: string
  points: number
  politicianPoints: { bioguideId: string; points: number }[]
  mvpBioguideId: string
}

export interface DemoState {
  activeLeagueId: string
  userTeamId: string
  leagues: League[]
  weekResults: WeekResult[]
}
