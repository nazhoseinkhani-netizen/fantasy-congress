import type { League, DemoState, WeekResult, WeekSchedule } from '@/types'

let cachedLeagues: League[] | null = null
let cachedMatchups: { schedules: WeekSchedule[]; weekResults: WeekResult[] } | null = null

export async function loadLeagues(): Promise<League[]> {
  if (cachedLeagues) return cachedLeagues
  const res = await fetch('/data/leagues.json')
  if (!res.ok) throw new Error(`Failed to load leagues: ${res.status}`)
  cachedLeagues = (await res.json()) as League[]
  return cachedLeagues
}

export async function loadMatchups(): Promise<{ schedules: WeekSchedule[]; weekResults: WeekResult[] }> {
  if (cachedMatchups) return cachedMatchups
  const res = await fetch('/data/matchups.json')
  if (!res.ok) throw new Error(`Failed to load matchups: ${res.status}`)
  cachedMatchups = await res.json()
  return cachedMatchups!
}

export async function loadDemoState(): Promise<DemoState> {
  const leagues = await loadLeagues()
  const { weekResults } = await loadMatchups()
  const userLeague = leagues.find((l) => l.teams.some((t) => t.isUserTeam))
  const userTeam = userLeague?.teams.find((t) => t.isUserTeam)
  return {
    activeLeagueId: userLeague?.id ?? leagues[0].id,
    userTeamId: userTeam?.id ?? '',
    leagues,
    weekResults,
  }
}

export function clearDemoCache(): void {
  cachedLeagues = null
  cachedMatchups = null
}
