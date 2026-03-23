'use client'

import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import type { Team } from '@/types'

interface StandingsCompactProps {
  teams: Team[]
  userTeamId: string
}

export function StandingsCompact({ teams, userTeamId }: StandingsCompactProps) {
  const sortedTeams = useMemo(() => {
    return [...teams].sort((a, b) => {
      if (b.record.wins !== a.record.wins) return b.record.wins - a.record.wins
      return b.pointsFor - a.pointsFor
    })
  }, [teams])

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-[2rem_1fr_auto_auto] gap-2 px-3 py-2 bg-muted/30 border-b border-border">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">#</span>
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Team</span>
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right">W-L</span>
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right">Pts</span>
      </div>

      {/* Rows */}
      {sortedTeams.map((team, index) => {
        const isUser = team.id === userTeamId || team.isUserTeam
        const { wins, losses, ties } = team.record
        const recordStr = ties > 0 ? `${wins}-${losses}-${ties}` : `${wins}-${losses}`

        return (
          <div
            key={team.id}
            className={cn(
              'grid grid-cols-[2rem_1fr_auto_auto] gap-2 px-3 py-2 border-b border-border/50 last:border-0 transition-colors',
              isUser
                ? 'bg-primary/10 border-l-2 border-l-primary'
                : index % 2 === 0 ? 'bg-muted/10' : ''
            )}
          >
            <span className="text-xs font-bold text-muted-foreground self-center">#{index + 1}</span>
            <span className={cn('text-sm font-medium truncate self-center', isUser && 'text-primary font-semibold')}>
              {team.name}
              {isUser && (
                <span className="ml-1 text-xs px-1 py-0.5 rounded bg-primary/20 text-primary border border-primary/30">
                  You
                </span>
              )}
            </span>
            <span className="text-xs font-medium tabular-nums text-right self-center text-muted-foreground">
              {recordStr}
            </span>
            <span className="text-xs font-bold tabular-nums text-right self-center">
              {team.pointsFor.toFixed(0)}
            </span>
          </div>
        )
      })}
    </div>
  )
}
