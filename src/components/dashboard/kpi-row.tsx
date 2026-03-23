'use client'

import { cn } from '@/lib/utils'
import type { Team, WeekResult } from '@/types'

interface KpiRowProps {
  userTeam: Team
  weekResult: WeekResult | undefined
  leagueRank: number
  totalTeams: number
  nextOpponent: string
}

interface KpiCardProps {
  label: string
  value: string
  className?: string
}

function KpiCard({ label, value, className }: KpiCardProps) {
  return (
    <div className={cn('bg-card rounded-xl border border-border p-4 text-center flex-1 min-w-[120px]', className)}>
      <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">{label}</p>
      <p className="text-2xl font-bold text-primary tabular-nums leading-tight">{value}</p>
    </div>
  )
}

export function KpiRow({ userTeam, weekResult, leagueRank, totalTeams, nextOpponent }: KpiRowProps) {
  const weekPoints = weekResult?.points ?? 0
  const { wins, losses, ties } = userTeam.record
  const recordStr = ties > 0 ? `${wins}-${losses}-${ties}` : `${wins}-${losses}`

  return (
    <div className="flex gap-4 flex-wrap">
      <KpiCard
        label="This Week"
        value={`${weekPoints.toFixed(1)} pts`}
      />
      <KpiCard
        label="League Rank"
        value={`#${leagueRank} of ${totalTeams}`}
      />
      <KpiCard
        label="Record"
        value={recordStr}
      />
      <KpiCard
        label="Next Matchup"
        value={`vs ${nextOpponent}`}
        className="truncate"
      />
    </div>
  )
}
