'use client'

import { useEffect, useState, useMemo } from 'react'
import { useGameStore } from '@/store/game-store'
import { loadDemoState, loadMatchups } from '@/lib/data/demo'
import { loadPoliticians } from '@/lib/data/politicians'
import { loadTrades } from '@/lib/data/trades'
import type { DemoState, WeekSchedule } from '@/types'
import type { Politician } from '@/types/politician'
import type { Trade } from '@/types/trade'
import { KpiRow } from './kpi-row'
import { WeekSelector } from './week-selector'
import { MatchupScoreboard } from './matchup-scoreboard'
import { TradeFeedSidebar } from './trade-feed-sidebar'
import { StandingsCompact } from './standings-compact'

function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Week selector skeleton */}
      <div className="h-9 w-80 bg-muted rounded-lg" />

      {/* KPI row skeleton */}
      <div className="flex gap-4 flex-wrap">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex-1 min-w-[120px] h-20 bg-muted rounded-xl" />
        ))}
      </div>

      {/* Main content skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        <div className="h-96 bg-muted rounded-xl" />
        <div className="space-y-4">
          <div className="h-64 bg-muted rounded-xl" />
          <div className="h-64 bg-muted rounded-xl" />
        </div>
      </div>
    </div>
  )
}

export function DashboardPage() {
  const [demoState, setDemoState] = useState<DemoState | null>(null)
  const [politicians, setPoliticians] = useState<Politician[]>([])
  const [trades, setTrades] = useState<Trade[]>([])
  const [schedules, setSchedules] = useState<WeekSchedule[]>([])

  const selectedWeek = useGameStore((s) => s.selectedWeek)
  const setActiveLeagueId = useGameStore((s) => s.setActiveLeagueId)

  useEffect(() => {
    Promise.all([
      loadDemoState(),
      loadPoliticians(),
      loadTrades(),
      loadMatchups(),
    ]).then(([demo, pols, trd, { schedules: sched }]) => {
      setDemoState(demo)
      setPoliticians(pols)
      setTrades(trd)
      setSchedules(sched)
      setActiveLeagueId(demo.activeLeagueId)
    })
  }, [setActiveLeagueId])

  const derived = useMemo(() => {
    if (!demoState) return null

    const userLeague = demoState.leagues.find((l) => l.id === demoState.activeLeagueId)
    if (!userLeague) return null

    const userTeam = userLeague.teams.find((t) => t.id === demoState.userTeamId)
    if (!userTeam) return null

    // Filter schedules to this league
    const leagueSchedules = schedules.filter((s) =>
      s.matchups.some((m) => m.leagueId === userLeague.id)
    )

    const currentWeekSchedule = leagueSchedules.find((s) => s.week === selectedWeek)
    const userMatchup = currentWeekSchedule?.matchups.find(
      (m) => m.homeTeamId === userTeam.id || m.awayTeamId === userTeam.id
    )

    const opponentTeamId = userMatchup
      ? userMatchup.homeTeamId === userTeam.id
        ? userMatchup.awayTeamId
        : userMatchup.homeTeamId
      : undefined

    const opponentTeam = opponentTeamId
      ? userLeague.teams.find((t) => t.id === opponentTeamId)
      : undefined

    const userWeekResult = demoState.weekResults.find(
      (wr) => wr.teamId === userTeam.id && wr.week === selectedWeek
    )

    const opponentWeekResult = opponentTeamId
      ? demoState.weekResults.find((wr) => wr.teamId === opponentTeamId && wr.week === selectedWeek)
      : undefined

    // Rank by pointsFor
    const sortedByPoints = [...userLeague.teams].sort((a, b) => b.pointsFor - a.pointsFor)
    const leagueRank = sortedByPoints.findIndex((t) => t.id === userTeam.id) + 1

    // Next opponent
    const nextWeekSchedule = leagueSchedules.find((s) => s.week === selectedWeek + 1)
    const nextUserMatchup = nextWeekSchedule?.matchups.find(
      (m) => m.homeTeamId === userTeam.id || m.awayTeamId === userTeam.id
    )
    const nextOpponentId = nextUserMatchup
      ? nextUserMatchup.homeTeamId === userTeam.id
        ? nextUserMatchup.awayTeamId
        : nextUserMatchup.homeTeamId
      : undefined
    const nextOpponent = nextOpponentId
      ? (userLeague.teams.find((t) => t.id === nextOpponentId)?.name ?? 'TBD')
      : 'TBD'

    const politicianMap = new Map<string, Politician>(
      politicians.map((p) => [p.bioguideId, p])
    )

    return {
      userLeague,
      userTeam,
      opponentTeam,
      userMatchup,
      userWeekResult,
      opponentWeekResult,
      leagueRank,
      nextOpponent,
      politicianMap,
    }
  }, [demoState, schedules, selectedWeek, politicians])

  if (!demoState || !derived) {
    return (
      <div className="container mx-auto px-4 py-8">
        <DashboardSkeleton />
      </div>
    )
  }

  const {
    userLeague,
    userTeam,
    opponentTeam,
    userMatchup,
    userWeekResult,
    opponentWeekResult,
    leagueRank,
    nextOpponent,
    politicianMap,
  } = derived

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Week selector */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <WeekSelector totalWeeks={6} />
      </div>

      {/* KPI row */}
      <KpiRow
        userTeam={userTeam}
        weekResult={userWeekResult}
        leagueRank={leagueRank}
        totalTeams={userLeague.teams.length}
        nextOpponent={nextOpponent}
      />

      {/* Main grid: content + sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        {/* Main area */}
        <div className="space-y-6">
          <MatchupScoreboard
            matchup={userMatchup}
            userTeam={userTeam}
            opponentTeam={opponentTeam}
            userWeekResult={userWeekResult}
            opponentWeekResult={opponentWeekResult}
            politicians={politicianMap}
            trades={trades}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <TradeFeedSidebar trades={trades} politicians={politicians} />
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              League Standings
            </h3>
            <StandingsCompact
              teams={userLeague.teams}
              userTeamId={demoState.userTeamId}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
