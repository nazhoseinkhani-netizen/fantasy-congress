/**
 * scripts/generate-demo.ts
 *
 * Generates demo league data for Fantasy Congress:
 * - 3 leagues with 8 teams each (24 teams total)
 * - Rosters built via simulated snake draft from scored politicians
 * - 6 weeks of matchup results derived from politician weekly points
 * - User pre-assigned to a competitive mid-tier team (~3-3 record)
 *
 * Outputs:
 *   public/data/leagues.json   — League[] with teams, rosters, records
 *   public/data/matchups.json  — { schedules: WeekSchedule[], weekResults: WeekResult[] }
 *
 * Run via: npx tsx scripts/generate-demo.ts
 */

import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

// ------ Types (mirrored from src/types for script use) ------

interface Politician {
  bioguideId: string
  name: string
  salaryCap: number
  salaryTier: string
  seasonPoints: number
  weeklyPoints: number[]
}

interface Roster {
  active: string[]
  bench: string[]
  salaryCap: number
  salaryUsed: number
}

interface Team {
  id: string
  leagueId: string
  name: string
  owner: string
  isUserTeam: boolean
  roster: Roster
  record: { wins: number; losses: number; ties: number }
  pointsFor: number
  pointsAgainst: number
  streak: string
}

interface WeekSchedule {
  week: number
  matchups: Matchup[]
}

interface Matchup {
  week: number
  leagueId: string
  homeTeamId: string
  awayTeamId: string
  homeScore: number
  awayScore: number
  completed: boolean
}

interface WeekResult {
  week: number
  teamId: string
  points: number
  politicianPoints: { bioguideId: string; points: number }[]
  mvpBioguideId: string
}

interface League {
  id: string
  name: string
  teams: Team[]
  schedule: WeekSchedule[]
  currentWeek: number
}

// ------ Config ------

const NUM_WEEKS = 6
const SALARY_CAP = 50_000

// Dynamic roster sizing based on available politicians
// With 16 real politicians, we can't fill 3 leagues × 8 teams × 12 slots = 288
// Scale down to fit: politicians are shared across leagues (each league drafts independently)
function computeLeagueSize(totalPoliticians: number) {
  // Each league needs TEAMS × (ACTIVE + BENCH) unique politicians
  // Try 8 teams first, then scale down
  for (const teams of [8, 4, 2]) {
    for (const active of [8, 6, 4, 3, 2]) {
      const bench = Math.max(1, Math.floor(active / 2))
      const needed = teams * (active + bench)
      if (needed <= totalPoliticians) {
        return { teams, active, bench }
      }
    }
  }
  return { teams: 2, active: 2, bench: 1 } // minimum viable
}

let TEAMS_PER_LEAGUE = 8
let ACTIVE_SLOTS = 8
let BENCH_SLOTS = 4
let TOTAL_PICKS = ACTIVE_SLOTS + BENCH_SLOTS

const LEAGUES_CONFIG = [
  { id: 'league-beltway', name: 'The Beltway Bandits' },
  { id: 'league-capitol', name: 'Capitol Casuals' },
  { id: 'league-swamp', name: 'Swamp Lords Supreme' },
]

// 24 creative fantasy-politics team names (8 per league)
const TEAM_NAMES_BY_LEAGUE: string[][] = [
  // League 1 — The Beltway Bandits
  [
    'The Filibusters',
    'Capitol Gains',
    'The Lobbyists',
    'Pork Barrel Rollers',
    'The Gerrymanders',
    'Bribe Squad',
    'The Earmarks',
    'Insider Traders',
  ],
  // League 2 — Capitol Casuals
  [
    'The Whip Crackers',
    'Budget Hawks',
    'The Swing States',
    'Dark Money Mavens',
    'The Caucus',
    'K Street Kings',
    'The Debt Ceilings',
    'PAC Attack',
  ],
  // League 3 — Swamp Lords Supreme
  [
    'The Sequestors',
    'Lame Ducks',
    'The Vetoes',
    'Committee Chairs',
    'Super PACs',
    'The Riders',
    'Floor Crossers',
    'The Cloture Club',
  ],
]

// Owner display names for each team (8 per league)
const OWNERS_BY_LEAGUE: string[][] = [
  [
    'You',
    'DrainTheSwamp99',
    'PelicanBriefFan',
    'K-StreetKing',
    'HillaryHater2024',
    'LobbyistLarry',
    'CloakAndDagger',
    'FilibustaMove',
  ],
  [
    'BudgetHawkEagle',
    'SwingStateSteve',
    'DarkMoneyDave',
    'CaucusCrafter',
    'DebtCeilingDan',
    'PACAttackPat',
    'WashingtonWhip',
    'HouseClubMember',
  ],
  [
    'SequesterSam',
    'LameDuckLenny',
    'VetoVictor',
    'CommChairChris',
    'SuperPACSteve',
    'RiderRandy',
    'FloorCrosserFrank',
    'ClotureClubb',
  ],
]

// ------ Load politicians ------

function loadPoliticians(): Politician[] {
  const raw = readFileSync(join('public', 'data', 'politicians.json'), 'utf-8')
  return JSON.parse(raw) as Politician[]
}

// ------ Snake draft simulation ------

/**
 * Simulate a snake draft for a single league.
 * Returns 8 teams, each with 12 drafted politicians (8 active + 4 bench).
 * Politicians are drawn from `pool` — shared pool allowed across leagues.
 */
function simulateSnakeDraft(
  pool: Politician[],
  leagueId: string,
  leagueIndex: number
): Team[] {
  const teamNames = TEAM_NAMES_BY_LEAGUE[leagueIndex].slice(0, TEAMS_PER_LEAGUE)
  const owners = OWNERS_BY_LEAGUE[leagueIndex].slice(0, TEAMS_PER_LEAGUE)

  // Sort pool by seasonPoints descending — best players drafted first.
  // NOTE: pool has fewer politicians than total picks needed (8 teams × 12 = 96 > pool size).
  // When the shared available pool is exhausted, we fall back to allowing a politician to appear
  // on multiple teams in the same league (same player can be drafted by different managers),
  // which mirrors the "same politician allowed across leagues" decision and is acceptable
  // for a demo prototype.
  const sortedPool = [...pool].sort((a, b) => b.seasonPoints - a.seasonPoints)
  const available = [...sortedPool]

  // Initialize teams
  const teams: Array<{
    id: string
    leagueId: string
    name: string
    owner: string
    picks: Politician[]
    salaryRemaining: number
  }> = teamNames.map((name, i) => ({
    id: `${leagueId}-team-${i + 1}`,
    leagueId,
    name,
    owner: owners[i],
    picks: [],
    salaryRemaining: SALARY_CAP,
  }))

  // Snake draft: 12 rounds
  for (let round = 0; round < TOTAL_PICKS; round++) {
    // Even rounds: 0-7, odd rounds: 7-0
    const order =
      round % 2 === 0
        ? teams.map((_, i) => i)
        : teams.map((_, i) => i).reverse()

    for (const teamIdx of order) {
      const team = teams[teamIdx]
      // Find the best available player that fits the remaining salary cap.
      // For bench rounds (picks 9-12), use a lower reserve per remaining pick (200 instead
      // of 644) so the exhausted cheap-player pool doesn't block bench slots.
      const picksRemaining = TOTAL_PICKS - team.picks.length - 1
      const reservePerPick = team.picks.length >= ACTIVE_SLOTS ? 200 : 644
      const salaryReserve = picksRemaining * reservePerPick

      // If available pool is exhausted, refill it (excluding this team's own picks) so that
      // a politician can appear on multiple teams in the same league when pool < 96 total picks.
      if (available.length === 0) {
        const myPickIds = new Set(team.picks.map((p) => p.bioguideId))
        available.push(...sortedPool.filter((p) => !myPickIds.has(p.bioguideId)))
      }

      const pick = available.find(
        (p) =>
          p.salaryCap <= team.salaryRemaining &&
          // Ensure we can fill remaining picks — reserve minimum salary for remaining rounds
          p.salaryCap <= team.salaryRemaining - salaryReserve
      )

      if (pick) {
        team.picks.push(pick)
        team.salaryRemaining -= pick.salaryCap
        available.splice(available.indexOf(pick), 1)
      } else {
        // Fallback: take the cheapest available.
        // For the last pick, bypass salary check — a team must never have fewer than TOTAL_PICKS.
        const cheapest = available[available.length - 1]
        const isLastPick = team.picks.length === TOTAL_PICKS - 1
        if (cheapest && (isLastPick || cheapest.salaryCap <= team.salaryRemaining)) {
          team.picks.push(cheapest)
          team.salaryRemaining -= cheapest.salaryCap
          available.splice(available.indexOf(cheapest), 1)
        }
      }
    }
  }

  // Validate all teams have a full roster before proceeding
  for (const team of teams) {
    if (team.picks.length < TOTAL_PICKS) {
      console.error(`FATAL: ${team.name} only has ${team.picks.length}/${TOTAL_PICKS} picks`)
      process.exit(1)
    }
  }

  // Convert to Team objects
  return teams.map((team) => {
    const activePoliticians = team.picks.slice(0, ACTIVE_SLOTS)
    const benchPoliticians = team.picks.slice(ACTIVE_SLOTS)
    const salaryUsed = SALARY_CAP - team.salaryRemaining

    return {
      id: team.id,
      leagueId: team.leagueId,
      name: team.name,
      owner: team.owner,
      isUserTeam: false, // set later
      roster: {
        active: activePoliticians.map((p) => p.bioguideId),
        bench: benchPoliticians.map((p) => p.bioguideId),
        salaryCap: SALARY_CAP,
        salaryUsed,
      },
      record: { wins: 0, losses: 0, ties: 0 },
      pointsFor: 0,
      pointsAgainst: 0,
      streak: 'W0',
    }
  })
}

// ------ Round-robin schedule generation ------

/**
 * Generate a round-robin schedule for 8 teams over 6 weeks.
 * Each team plays once per week.
 * Returns array of { week, pairings: [teamA, teamB][] }
 */
function generateRoundRobinSchedule(
  teamIds: string[]
): Array<{ week: number; pairs: [string, string][] }> {
  const n = teamIds.length
  const ids = [...teamIds]
  const scheduleWeeks: Array<{ week: number; pairs: [string, string][] }> = []

  // Berger round-robin algorithm for even number of teams
  // Fix first team, rotate the rest
  for (let week = 0; week < NUM_WEEKS; week++) {
    const pairs: [string, string][] = []
    const rotated = [ids[0], ...ids.slice(1).map((_, i) => ids[1 + ((i + week) % (n - 1))])]

    for (let i = 0; i < n / 2; i++) {
      pairs.push([rotated[i], rotated[n - 1 - i]])
    }
    scheduleWeeks.push({ week: week + 1, pairs })
  }

  return scheduleWeeks
}

// ------ Score computation ------

/**
 * Compute score for a team in a given week.
 * Sum of weeklyPoints[week-1] for all active roster politicians.
 */
function computeTeamWeekScore(
  team: Team,
  week: number,
  politicianMap: Map<string, Politician>
): { total: number; breakdown: { bioguideId: string; points: number }[] } {
  const breakdown: { bioguideId: string; points: number }[] = []
  let total = 0

  for (const bioguideId of team.roster.active) {
    const politician = politicianMap.get(bioguideId)
    if (!politician) continue
    const points = politician.weeklyPoints[week - 1] ?? 0
    breakdown.push({ bioguideId, points })
    total += points
  }

  return { total: Math.round(total * 100) / 100, breakdown }
}

// ------ Streak computation ------

function computeStreak(results: ('W' | 'L' | 'T')[]): string {
  if (results.length === 0) return 'W0'
  const last = results[results.length - 1]
  let count = 0
  for (let i = results.length - 1; i >= 0; i--) {
    if (results[i] === last) count++
    else break
  }
  return `${last}${count}`
}

// ------ Main generation ------

function generateDemoData() {
  console.log('Loading politicians...')
  const politicians = loadPoliticians()
  console.log(`Loaded ${politicians.length} politicians`)

  // Dynamically size leagues based on available politicians
  const sizing = computeLeagueSize(politicians.length)
  TEAMS_PER_LEAGUE = sizing.teams
  ACTIVE_SLOTS = sizing.active
  BENCH_SLOTS = sizing.bench
  TOTAL_PICKS = ACTIVE_SLOTS + BENCH_SLOTS
  console.log(`League sizing: ${TEAMS_PER_LEAGUE} teams × ${ACTIVE_SLOTS}+${BENCH_SLOTS} roster (${politicians.length} politicians available)`)

  const politicianMap = new Map(politicians.map((p) => [p.bioguideId, p]))

  // Draft the same pool for all leagues (real fantasy sports allows same player in different leagues)
  console.log('\nSimulating snake drafts...')
  const allLeagues: League[] = []
  const allWeekResults: WeekResult[] = []
  const allSchedules: WeekSchedule[] = []

  for (let leagueIndex = 0; leagueIndex < LEAGUES_CONFIG.length; leagueIndex++) {
    const config = LEAGUES_CONFIG[leagueIndex]
    console.log(`  Drafting ${config.name}...`)

    const teams = simulateSnakeDraft(politicians, config.id, leagueIndex)
    const teamIds = teams.map((t) => t.id)

    // Generate schedule
    const roundRobin = generateRoundRobinSchedule(teamIds)
    const leagueSchedule: WeekSchedule[] = []

    // Track results for record computation
    const teamResults: Record<string, ('W' | 'L' | 'T')[]> = {}
    teamIds.forEach((id) => (teamResults[id] = []))

    for (const { week, pairs } of roundRobin) {
      const matchups: Matchup[] = []

      for (const [homeId, awayId] of pairs) {
        const homeTeam = teams.find((t) => t.id === homeId)!
        const awayTeam = teams.find((t) => t.id === awayId)!

        const { total: homeScore } = computeTeamWeekScore(homeTeam, week, politicianMap)
        const { total: awayScore } = computeTeamWeekScore(awayTeam, week, politicianMap)

        matchups.push({
          week,
          leagueId: config.id,
          homeTeamId: homeId,
          awayTeamId: awayId,
          homeScore,
          awayScore,
          completed: true,
        })

        // Update records
        homeTeam.pointsFor += homeScore
        awayTeam.pointsFor += awayScore
        homeTeam.pointsAgainst += awayScore
        awayTeam.pointsAgainst += homeScore

        if (homeScore > awayScore) {
          homeTeam.record.wins++
          awayTeam.record.losses++
          teamResults[homeId].push('W')
          teamResults[awayId].push('L')
        } else if (awayScore > homeScore) {
          awayTeam.record.wins++
          homeTeam.record.losses++
          teamResults[awayId].push('W')
          teamResults[homeId].push('L')
        } else {
          homeTeam.record.ties++
          awayTeam.record.ties++
          teamResults[homeId].push('T')
          teamResults[awayId].push('T')
        }
      }

      leagueSchedule.push({ week, matchups })
      allSchedules.push({ week, matchups })
    }

    // Compute streaks and generate WeekResults
    for (const team of teams) {
      team.streak = computeStreak(teamResults[team.id])
      team.pointsFor = Math.round(team.pointsFor * 100) / 100
      team.pointsAgainst = Math.round(team.pointsAgainst * 100) / 100
    }

    // Generate WeekResult entries for each team in each week
    for (const { week } of roundRobin) {
      for (const team of teams) {
        const { total, breakdown } = computeTeamWeekScore(team, week, politicianMap)
        const mvp = breakdown.reduce(
          (best, curr) => (curr.points > (best?.points ?? -1) ? curr : best),
          breakdown[0]
        )

        allWeekResults.push({
          week,
          teamId: team.id,
          points: total,
          politicianPoints: breakdown,
          mvpBioguideId: mvp?.bioguideId ?? '',
        })
      }
    }

    allLeagues.push({
      id: config.id,
      name: config.name,
      teams,
      schedule: leagueSchedule,
      currentWeek: NUM_WEEKS,
    })
  }

  // ------ Assign user team in League 1 ------
  // Find the team in League 1 with a record closest to 3-3
  const league1 = allLeagues[0]
  let userTeam = league1.teams[0]
  let bestScore = Infinity

  for (const team of league1.teams) {
    const { wins, losses } = team.record
    const winsFromTarget = Math.abs(wins - 3)
    const lossesFromTarget = Math.abs(losses - 3)
    const score = winsFromTarget + lossesFromTarget
    if (score < bestScore) {
      bestScore = score
      userTeam = team
    }
  }

  // Update owner name and flag
  userTeam.isUserTeam = true
  userTeam.owner = 'You'
  // Give user a compelling team name if it doesn't already have one
  userTeam.name = userTeam.name // keep the drafted name

  console.log(
    `\nUser assigned to: "${userTeam.name}" (${userTeam.record.wins}-${userTeam.record.losses}-${userTeam.record.ties})`
  )

  // Print team records for debugging
  console.log('\nLeague 1 standings:')
  const sortedTeams = [...league1.teams].sort(
    (a, b) => b.record.wins - a.record.wins || b.pointsFor - a.pointsFor
  )
  for (const team of sortedTeams) {
    const { wins, losses, ties } = team.record
    const flag = team.isUserTeam ? ' <- USER' : ''
    console.log(
      `  ${team.name.padEnd(28)} ${wins}-${losses}-${ties}  ${Math.round(team.pointsFor)}pts${flag}`
    )
  }

  // ------ Write output files ------
  const leaguesPath = join('public', 'data', 'leagues.json')
  const matchupsPath = join('public', 'data', 'matchups.json')

  // Deduplicate schedules — each matchup is recorded per-league, produce flat schedule per league
  const uniqueSchedules: WeekSchedule[] = []
  for (let week = 1; week <= NUM_WEEKS; week++) {
    const matchupsForWeek = allLeagues.flatMap(
      (l) => l.schedule.find((s) => s.week === week)?.matchups ?? []
    )
    uniqueSchedules.push({ week, matchups: matchupsForWeek })
  }

  writeFileSync(leaguesPath, JSON.stringify(allLeagues, null, 2))
  console.log(`\nWrote ${leaguesPath} (${allLeagues.length} leagues)`)

  writeFileSync(
    matchupsPath,
    JSON.stringify({ schedules: uniqueSchedules, weekResults: allWeekResults }, null, 2)
  )
  console.log(`Wrote ${matchupsPath} (${uniqueSchedules.length} weeks, ${allWeekResults.length} WeekResult entries)`)

  // ------ Verification summary ------
  const league1Check = allLeagues[0]
  const userTeamCheck = league1Check.teams.find((t) => t.isUserTeam)!
  console.log('\nVerification:')
  console.log(`  Leagues: ${allLeagues.length} (expected 3)`)
  console.log(`  Teams per league: ${allLeagues.map((l) => l.teams.length).join(', ')} (expected ${TEAMS_PER_LEAGUE} each)`)
  console.log(`  User team: ${userTeamCheck.name} — record ${userTeamCheck.record.wins}-${userTeamCheck.record.losses}-${userTeamCheck.record.ties}`)
  console.log(`  Schedule weeks: ${uniqueSchedules.length} (expected 6)`)
  console.log(`  WeekResults: ${allWeekResults.length} (expected ${NUM_WEEKS * TEAMS_PER_LEAGUE * LEAGUES_CONFIG.length})`)

  // Validate salary cap compliance
  let capViolations = 0
  for (const league of allLeagues) {
    for (const team of league.teams) {
      if (team.roster.salaryUsed > SALARY_CAP) {
        capViolations++
        console.warn(`  WARNING: ${team.name} over salary cap: ${team.roster.salaryUsed} > ${SALARY_CAP}`)
      }
    }
  }
  if (capViolations === 0) console.log('  Salary cap: All teams within cap')
}

generateDemoData()
