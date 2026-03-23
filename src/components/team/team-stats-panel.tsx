'use client'

import type { Roster, Team, WeekResult } from '@/types/demo'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface TeamStatsPanelProps {
  roster: Roster
  team: Team
  weekResults: WeekResult[]
  onResetRoster: () => void
}

export function TeamStatsPanel({ roster, team, weekResults, onResetRoster }: TeamStatsPanelProps) {
  const pct = roster.salaryUsed / roster.salaryCap
  const barColor = pct >= 1 ? 'bg-red-500' : pct >= 0.8 ? 'bg-amber-500' : 'bg-emerald-500'

  const totalGames = team.record.wins + team.record.losses + team.record.ties
  const winRate = totalGames > 0 ? ((team.record.wins / totalGames) * 100).toFixed(1) : '0.0'

  const avgPoints =
    weekResults.length > 0
      ? (weekResults.reduce((sum, wr) => sum + wr.points, 0) / weekResults.length).toFixed(1)
      : '0.0'

  const pointValues = weekResults.map((wr) => wr.points)
  const bestWeek = pointValues.length > 0 ? Math.max(...pointValues) : 0
  const worstWeek = pointValues.length > 0 ? Math.min(...pointValues) : 0

  return (
    <div className="bg-card border border-border rounded-xl p-4 space-y-4">
      <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Team Stats</h3>

      {/* Salary cap progress bar */}
      <div>
        <p className="text-sm font-semibold mb-1.5">Salary Cap</p>
        <div className="w-full bg-muted rounded-full h-2.5">
          <div
            className={cn('h-2.5 rounded-full transition-all', barColor)}
            style={{ width: `${Math.min(pct * 100, 100)}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          ${roster.salaryUsed.toLocaleString()} / ${roster.salaryCap.toLocaleString()}
        </p>
      </div>

      {/* Win rate */}
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Win Rate</p>
        <p className="text-sm font-semibold">
          {team.record.wins}-{team.record.losses}-{team.record.ties}
          <span className="text-muted-foreground ml-1">({winRate}%)</span>
        </p>
      </div>

      {/* Avg points */}
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Avg Points/Week</p>
        <p className="text-sm font-semibold">{avgPoints}</p>
      </div>

      {/* Best week */}
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Best Week</p>
        <p className="text-sm font-semibold text-emerald-400">{bestWeek.toFixed(1)}</p>
      </div>

      {/* Worst week */}
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Worst Week</p>
        <p className="text-sm font-semibold text-red-400">{worstWeek.toFixed(1)}</p>
      </div>

      <Button variant="outline" size="sm" onClick={onResetRoster} className="w-full mt-4">
        Reset to Original Roster
      </Button>
    </div>
  )
}
