'use client'

import { cn } from '@/lib/utils'
import { DigitFlipCounter, AnimatedCounter } from '@/components/animations/animated-counter'
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
  children?: React.ReactNode
}

function KpiCard({ label, value, className, children }: KpiCardProps) {
  return (
    <div className={cn('bg-card rounded-xl border border-border p-4 text-center flex-1 min-w-[120px]', className)}>
      <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">{label}</p>
      {children ? (
        <div className="text-2xl font-bold text-primary tabular-nums leading-tight">{children}</div>
      ) : (
        <p className="text-2xl font-bold text-primary tabular-nums leading-tight">{value}</p>
      )}
    </div>
  )
}

export function KpiRow({ userTeam, weekResult, leagueRank, totalTeams, nextOpponent }: KpiRowProps) {
  const weekPoints = weekResult?.points ?? 0
  const { wins, losses, ties } = userTeam.record
  const recordStr = ties > 0 ? `${wins}-${losses}-${ties}` : `${wins}-${losses}`

  return (
    <div className="flex gap-4 flex-wrap" data-alva-skill="getSenatorTrades">
      <KpiCard label="This Week" value="">
        <DigitFlipCounter
          value={Math.round(weekPoints * 10) / 10}
          className="text-2xl font-bold tabular-nums"
        />
        <span className="text-sm font-medium text-muted-foreground ml-1">pts</span>
      </KpiCard>
      <KpiCard label="League Rank" value="">
        <span className="text-xl font-bold text-muted-foreground">#</span>
        <AnimatedCounter
          value={leagueRank}
          className="text-2xl font-bold"
        />
        <span className="text-sm font-medium text-muted-foreground ml-1">of {totalTeams}</span>
      </KpiCard>
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
