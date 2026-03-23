'use client'

import type { Politician } from '@/types/politician'
import type { Trade } from '@/types/trade'
import { RosterCard } from './roster-card'

interface BenchSlotsProps {
  politicians: Politician[]
  trades: Trade[]
  selectedId: string | null
  expandedId: string | null
  onSelect: (bioguideId: string) => void
  onToggleExpand: (bioguideId: string) => void
}

export function BenchSlots({
  politicians,
  trades,
  selectedId,
  expandedId,
  onSelect,
  onToggleExpand,
}: BenchSlotsProps) {
  if (politicians.length === 0) return null

  return (
    <div className="mt-6">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
        Bench ({politicians.length})
      </p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {politicians.map((politician) => {
          const weeklyPointsData = politician.weeklyPoints.map((pts, i) => ({
            week: `W${i + 1}`,
            points: pts,
          }))
          const polTrades = trades.filter((t) => t.bioguideId === politician.bioguideId)
          return (
            <RosterCard
              key={politician.bioguideId}
              politician={politician}
              trades={polTrades}
              weeklyPointsData={weeklyPointsData}
              isSelected={selectedId === politician.bioguideId}
              isExpanded={expandedId === politician.bioguideId}
              onSelect={() => onSelect(politician.bioguideId)}
              onToggleExpand={() => onToggleExpand(politician.bioguideId)}
              className="opacity-80"
            />
          )
        })}
      </div>
    </div>
  )
}
