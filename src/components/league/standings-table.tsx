'use client'

import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import type { Team } from '@/types/demo'

interface StandingsTableProps {
  teams: Team[]
  userTeamId: string
}

function formatRecord(record: { wins: number; losses: number; ties: number }): string {
  return `${record.wins}-${record.losses}${record.ties > 0 ? `-${record.ties}` : ''}`
}

export function StandingsTable({ teams, userTeamId }: StandingsTableProps) {
  const sortedTeams = useMemo((): Team[] => {
    return [...teams].sort((a, b) => {
      if (b.record.wins !== a.record.wins) return b.record.wins - a.record.wins
      return b.pointsFor - a.pointsFor
    })
  }, [teams])

  return (
    <div className="space-y-1">
      {/* Header */}
      <div className="grid grid-cols-[40px_1fr_60px_60px] lg:grid-cols-[40px_1fr_120px_80px_60px_60px_60px] gap-x-2 items-center px-3 py-2">
        <span className="text-xs text-muted-foreground uppercase tracking-wider">#</span>
        <span className="text-xs text-muted-foreground uppercase tracking-wider">Team</span>
        <span className="text-xs text-muted-foreground uppercase tracking-wider hidden lg:block">Owner</span>
        <span className="text-xs text-muted-foreground uppercase tracking-wider text-right">W-L</span>
        <span className="text-xs text-muted-foreground uppercase tracking-wider text-right">PF</span>
        <span className="text-xs text-muted-foreground uppercase tracking-wider text-right hidden lg:block">PA</span>
        <span className="text-xs text-muted-foreground uppercase tracking-wider text-right hidden lg:block">Streak</span>
      </div>

      {/* Rows */}
      <div className="rounded-xl border border-border overflow-hidden">
        {sortedTeams.map((team, index) => {
          const isUserTeam = team.id === userTeamId
          const streakColor = team.streak.startsWith('W')
            ? 'text-emerald-400'
            : team.streak.startsWith('L')
              ? 'text-red-400'
              : 'text-muted-foreground'

          return (
            <div
              key={team.id}
              className={cn(
                'grid grid-cols-[40px_1fr_60px_60px] lg:grid-cols-[40px_1fr_120px_80px_60px_60px_60px] gap-x-2 items-center px-3 py-2.5 border-b border-border/50 last:border-b-0 transition-colors',
                isUserTeam
                  ? 'bg-primary/10 border-l-2 border-l-primary rounded-r-md'
                  : 'hover:bg-muted/20'
              )}
            >
              {/* Rank */}
              <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>

              {/* Team Name */}
              <div className="flex items-center gap-2 min-w-0">
                <span className={cn('text-sm font-medium truncate', isUserTeam && 'text-primary')}>
                  {team.name}
                </span>
                {isUserTeam && (
                  <span className="text-xs px-1.5 py-0.5 rounded bg-primary/20 text-primary font-medium border border-primary/30 shrink-0">
                    You
                  </span>
                )}
              </div>

              {/* Owner — hidden on mobile */}
              <span className="text-sm text-muted-foreground hidden lg:block truncate">{team.owner}</span>

              {/* Record */}
              <span className="text-sm font-medium tabular-nums text-right">{formatRecord(team.record)}</span>

              {/* Points For */}
              <span className="text-sm font-medium tabular-nums text-right">{team.pointsFor.toFixed(1)}</span>

              {/* Points Against — hidden on mobile */}
              <span className="text-sm text-muted-foreground tabular-nums text-right hidden lg:block">
                {team.pointsAgainst.toFixed(1)}
              </span>

              {/* Streak — hidden on mobile */}
              <span className={cn('text-sm font-medium tabular-nums text-right hidden lg:block', streakColor)}>
                {team.streak}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
