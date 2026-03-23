'use client'

import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import type { WeekSchedule, Team, Matchup } from '@/types/demo'

interface ScheduleGridProps {
  schedules: WeekSchedule[]
  teams: Team[]
  currentWeek: number
}

function MatchupRow({ matchup, teamMap }: { matchup: Matchup; teamMap: Map<string, Team> }) {
  const homeTeam = teamMap.get(matchup.homeTeamId)
  const awayTeam = teamMap.get(matchup.awayTeamId)

  if (!homeTeam || !awayTeam) return null

  if (!matchup.completed) {
    return (
      <div className="flex items-center justify-between py-1.5 text-sm">
        <span className="text-foreground">{homeTeam.name}</span>
        <span className="text-xs text-muted-foreground px-2">vs</span>
        <span className="text-foreground">{awayTeam.name}</span>
      </div>
    )
  }

  const homeWon = matchup.homeScore > matchup.awayScore
  const awayWon = matchup.awayScore > matchup.homeScore

  return (
    <div className="flex items-center justify-between py-1.5 text-sm gap-2">
      <span className={cn('truncate', homeWon ? 'font-semibold text-foreground' : 'text-muted-foreground')}>
        {homeTeam.name}
      </span>
      <span className="text-xs tabular-nums text-muted-foreground shrink-0 whitespace-nowrap">
        <span className={cn('font-semibold', homeWon ? 'text-foreground' : 'text-muted-foreground')}>
          {matchup.homeScore.toFixed(1)}
        </span>
        {' - '}
        <span className={cn('font-semibold', awayWon ? 'text-foreground' : 'text-muted-foreground')}>
          {matchup.awayScore.toFixed(1)}
        </span>
      </span>
      <span className={cn('truncate text-right', awayWon ? 'font-semibold text-foreground' : 'text-muted-foreground')}>
        {awayTeam.name}
      </span>
    </div>
  )
}

export function ScheduleGrid({ schedules, teams, currentWeek }: ScheduleGridProps) {
  const teamMap = useMemo(() => new Map(teams.map((t) => [t.id, t])), [teams])

  const sortedSchedules = useMemo(() => {
    return [...schedules].sort((a, b) => a.week - b.week)
  }, [schedules])

  return (
    <div className="space-y-3">
      {sortedSchedules.map((weekSched) => {
        const isCurrent = weekSched.week === currentWeek
        return (
          <Card key={weekSched.week} className={cn('px-4 py-3', isCurrent && 'ring-primary/30')}>
            <div
              className={cn(
                'text-xs font-semibold uppercase tracking-wider mb-2',
                isCurrent ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              Week {weekSched.week}
              {isCurrent && (
                <span className="ml-2 text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full font-medium">
                  Current
                </span>
              )}
            </div>
            <div className="divide-y divide-border/50">
              {weekSched.matchups.map((matchup, i) => (
                <MatchupRow key={i} matchup={matchup} teamMap={teamMap} />
              ))}
            </div>
          </Card>
        )
      })}
    </div>
  )
}
