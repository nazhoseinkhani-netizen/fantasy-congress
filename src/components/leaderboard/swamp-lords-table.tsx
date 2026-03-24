'use client'

import { useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import type { DemoState, Team, WeekResult } from '@/types'

interface SwampLordsTableProps {
  demoState: DemoState
}

type SubTab = 'Season' | 'Weekly' | 'All-Time'

function formatRecord(record: { wins: number; losses: number; ties: number }): string {
  return `${record.wins}-${record.losses}${record.ties > 0 ? `-${record.ties}` : ''}`
}

function getTeamWeeklyPoints(teamId: string, weekResults: WeekResult[]): number {
  const mostRecentWeek = weekResults.reduce((max, r) => Math.max(max, r.week), 0)
  const result = weekResults.find((r) => r.teamId === teamId && r.week === mostRecentWeek)
  return result?.points ?? 0
}

function getWinValue(record: { wins: number; losses: number; ties: number }): number {
  // Win value for ranking: wins * 2 + ties for tiebreaking
  return record.wins * 2 + record.ties
}

export function SwampLordsTable({ demoState }: SwampLordsTableProps) {
  const [activeTab, setActiveTab] = useState<SubTab>('Season')

  const league = useMemo(
    () => demoState.leagues.find((l) => l.id === demoState.activeLeagueId),
    [demoState]
  )

  const teams = league?.teams ?? []

  const sortedTeams = useMemo((): Team[] => {
    if (activeTab === 'Weekly') {
      return [...teams].sort((a, b) => {
        const aPoints = getTeamWeeklyPoints(a.id, demoState.weekResults)
        const bPoints = getTeamWeeklyPoints(b.id, demoState.weekResults)
        return bPoints - aPoints
      })
    }
    // Season or All-Time: sort by wins desc, then pointsFor desc
    return [...teams].sort((a, b) => {
      const aWins = getWinValue(a.record)
      const bWins = getWinValue(b.record)
      if (bWins !== aWins) return bWins - aWins
      return b.pointsFor - a.pointsFor
    })
  }, [teams, activeTab, demoState.weekResults])

  const subTabs: SubTab[] = ['Season', 'Weekly', 'All-Time']

  if (!league) {
    return (
      <div className="text-sm text-muted-foreground py-6 text-center">
        No league data available.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Sub-tab toggle */}
      <div className="flex gap-1 bg-muted rounded-lg p-1 w-fit">
        {subTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-4 py-1.5 rounded-md text-sm font-medium transition-all',
              activeTab === tab
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground w-10">#</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Team</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden sm:table-cell">Owner</th>
                {activeTab === 'Weekly' ? (
                  <>
                    <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">This Week</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Record</th>
                  </>
                ) : (
                  <>
                    <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Record</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Points For</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden lg:table-cell">Points Against</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Streak</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {sortedTeams.map((team, index) => {
                const isUserTeam = team.isUserTeam || team.id === demoState.userTeamId
                const weeklyPoints = getTeamWeeklyPoints(team.id, demoState.weekResults)

                return (
                  <tr
                    key={team.id}
                    className={cn(
                      'border-b border-border/50 transition-colors',
                      isUserTeam && 'ring-1 ring-primary/50 bg-primary/5',
                      !isUserTeam && index % 2 === 0 && 'bg-muted/20'
                    )}
                  >
                    {/* Rank */}
                    <td className="px-4 py-3">
                      <span className="font-bold text-muted-foreground">#{index + 1}</span>
                    </td>

                    {/* Team Name */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className={cn('font-semibold', isUserTeam && 'text-primary')}>
                          {team.name}
                        </span>
                        {isUserTeam && (
                          <span className="text-xs px-1.5 py-0.5 rounded bg-primary/20 text-primary font-medium border border-primary/30">
                            You
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Owner */}
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-muted-foreground">{team.owner}</span>
                    </td>

                    {activeTab === 'Weekly' ? (
                      <>
                        {/* Weekly points */}
                        <td className="px-4 py-3 text-right">
                          <span className="font-bold tabular-nums">{weeklyPoints.toFixed(1)}</span>
                          <span className="text-xs text-muted-foreground ml-1">pts</span>
                        </td>
                        {/* Record */}
                        <td className="px-4 py-3 text-right hidden md:table-cell">
                          <span className="text-muted-foreground tabular-nums">{formatRecord(team.record)}</span>
                        </td>
                      </>
                    ) : (
                      <>
                        {/* Record */}
                        <td className="px-4 py-3 text-right">
                          <span className="font-bold tabular-nums">{formatRecord(team.record)}</span>
                        </td>
                        {/* Points For */}
                        <td className="px-4 py-3 text-right hidden md:table-cell">
                          <span className="font-medium tabular-nums">{team.pointsFor.toFixed(1)}</span>
                        </td>
                        {/* Points Against */}
                        <td className="px-4 py-3 text-right hidden lg:table-cell">
                          <span className="text-muted-foreground tabular-nums">{team.pointsAgainst.toFixed(1)}</span>
                        </td>
                        {/* Streak */}
                        <td className="px-4 py-3 text-right hidden md:table-cell">
                          <span
                            className={cn(
                              'text-xs font-bold px-1.5 py-0.5 rounded tabular-nums',
                              team.streak.startsWith('W') && 'text-emerald-500 bg-emerald-500/10',
                              team.streak.startsWith('L') && 'text-red-500 bg-red-500/10',
                              team.streak.startsWith('T') && 'text-muted-foreground bg-muted/50'
                            )}
                          >
                            {team.streak}
                          </span>
                        </td>
                      </>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
