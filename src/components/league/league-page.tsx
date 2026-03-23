'use client'

import { useState, useEffect } from 'react'
import { loadDemoState, loadMatchups } from '@/lib/data/demo'
import { loadPoliticians } from '@/lib/data/politicians'
import { loadTrades } from '@/lib/data/trades'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { StandingsTable } from './standings-table'
import { ScheduleGrid } from './schedule-grid'
import { ActivityFeed } from './activity-feed'
import type { DemoState, WeekSchedule, WeekResult } from '@/types/demo'
import type { Politician } from '@/types/politician'
import type { Trade } from '@/types/trade'

export function LeaguePage() {
  const [demoState, setDemoState] = useState<DemoState | null>(null)
  const [politicians, setPoliticians] = useState<Politician[]>([])
  const [trades, setTrades] = useState<Trade[]>([])
  const [schedules, setSchedules] = useState<WeekSchedule[]>([])

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
    })
  }, [])

  if (!demoState) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-5 w-40" />
        </div>
        <Skeleton className="h-8 w-72" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }

  const userLeague = demoState.leagues.find((l) => l.id === demoState.activeLeagueId)

  if (!userLeague) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-muted-foreground">No league data found.</p>
      </div>
    )
  }

  const leagueSchedules: WeekSchedule[] = schedules.filter((s) =>
    s.matchups.some((m) => m.leagueId === userLeague.id)
  )

  const leagueWeekResults: WeekResult[] = demoState.weekResults.filter((wr) =>
    userLeague.teams.some((t) => t.id === wr.teamId)
  )

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold">{userLeague.name}</h1>
        <p className="text-muted-foreground mt-1">
          {userLeague.teams.length} teams &mdash; Week {userLeague.currentWeek}
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="standings">
        <TabsList>
          <TabsTrigger value="standings">Standings</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="standings" className="mt-4">
          <StandingsTable teams={userLeague.teams} userTeamId={demoState.userTeamId} />
        </TabsContent>

        <TabsContent value="schedule" className="mt-4">
          <ScheduleGrid
            schedules={leagueSchedules}
            teams={userLeague.teams}
            currentWeek={userLeague.currentWeek}
          />
        </TabsContent>

        <TabsContent value="activity" className="mt-4">
          <ActivityFeed
            league={userLeague}
            weekResults={leagueWeekResults}
            schedules={leagueSchedules}
            politicians={politicians}
            trades={trades}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
