'use client'

import { motion } from 'motion/react'
import type { DraftTeam } from '@/types/draft'
import type { Politician } from '@/types'
import { DRAFT_CONFIG } from '@/types/draft'
import { PoliticianCard } from '@/components/design/politician-card'
import { cn } from '@/lib/utils'

interface DraftRosterProps {
  team: DraftTeam
  politicians: Map<string, Politician>
  totalCap: number
}

export function DraftRoster({ team, politicians, totalCap }: DraftRosterProps) {
  const pct = team.salaryUsed / totalCap
  const barColor = pct >= 1 ? 'bg-red-500' : pct >= 0.8 ? 'bg-amber-500' : 'bg-emerald-500'
  const remaining = totalCap - team.salaryUsed

  const activeRoster = team.roster.slice(0, DRAFT_CONFIG.ACTIVE_SLOTS)
  const benchRoster = team.roster.slice(DRAFT_CONFIG.ACTIVE_SLOTS)

  return (
    <div className="flex flex-col h-full border-l border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold uppercase tracking-widest text-primary">
            Your Roster
          </h2>
          <span className="text-xs text-muted-foreground">
            {team.roster.length}/{DRAFT_CONFIG.ACTIVE_SLOTS + DRAFT_CONFIG.BENCH_SLOTS} picks
          </span>
        </div>

        {/* Salary Cap */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium">
              ${team.salaryUsed.toLocaleString()} / ${totalCap.toLocaleString()}
            </span>
            <span className={cn(
              'font-medium',
              pct >= 1 ? 'text-red-500' : pct >= 0.8 ? 'text-amber-500' : 'text-emerald-500'
            )}>
              ${remaining.toLocaleString()} left
            </span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className={cn('h-full rounded-full transition-all', barColor)}
              style={{ width: `${Math.min(100, pct * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Roster Slots */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Active Roster */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-px flex-1 bg-border" />
            <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
              Active Roster
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <div className="space-y-1.5">
            {Array.from({ length: DRAFT_CONFIG.ACTIVE_SLOTS }, (_, i) => {
              const bioguideId = activeRoster[i]
              const politician = bioguideId ? politicians.get(bioguideId) : undefined

              if (politician) {
                return (
                  <motion.div
                    key={bioguideId}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="border-l-2 border-emerald-500 rounded-lg overflow-hidden"
                  >
                    <PoliticianCard politician={politician} variant="mini" draftMode />
                  </motion.div>
                )
              }

              return (
                <div
                  key={`active-empty-${i}`}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg border border-dashed border-muted-foreground/30 h-12"
                >
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Active Slot {i + 1}</p>
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-600/50">
                    ACTIVE
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Bench */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-px flex-1 bg-border" />
            <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
              Bench
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <div className="space-y-1.5">
            {Array.from({ length: DRAFT_CONFIG.BENCH_SLOTS }, (_, i) => {
              const bioguideId = benchRoster[i]
              const politician = bioguideId ? politicians.get(bioguideId) : undefined

              if (politician) {
                return (
                  <motion.div
                    key={bioguideId}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="border-l-2 border-muted rounded-lg overflow-hidden"
                  >
                    <PoliticianCard politician={politician} variant="mini" draftMode />
                  </motion.div>
                )
              }

              return (
                <div
                  key={`bench-empty-${i}`}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg border border-dashed border-muted-foreground/30 h-12"
                >
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Bench Slot</p>
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/50">
                    BENCH
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
