'use client'

import { useState } from 'react'
import type { Politician } from '@/types/politician'
import type { Trade } from '@/types/trade'
import { useGameStore } from '@/store/game-store'
import { RosterCard } from './roster-card'
import { BenchSlots } from './bench-slots'

interface RosterGridProps {
  politicians: Politician[]
  activeBioguideIds: string[]
  benchBioguideIds: string[]
  trades: Trade[]
  teamId: string
  originalRoster: { active: string[]; bench: string[] }
}

export function RosterGrid({
  politicians,
  activeBioguideIds,
  benchBioguideIds,
  trades,
  teamId,
  originalRoster,
}: RosterGridProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const swapRosterSlots = useGameStore((s) => s.swapRosterSlots)

  const polMap = new Map(politicians.map((p) => [p.bioguideId, p]))

  function handleSelect(bioguideId: string) {
    if (!selectedId) {
      setSelectedId(bioguideId)
    } else if (selectedId === bioguideId) {
      setSelectedId(null)
    } else {
      swapRosterSlots(teamId, selectedId, bioguideId, originalRoster)
      setSelectedId(null)
    }
  }

  function handleToggleExpand(bioguideId: string) {
    setExpandedId(expandedId === bioguideId ? null : bioguideId)
  }

  return (
    <div>
      <h2 className="text-lg font-bold mb-3">Active Roster ({activeBioguideIds.length})</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {activeBioguideIds.map((id) => {
          const pol = polMap.get(id)
          if (!pol) return null
          const polTrades = trades.filter((t) => t.bioguideId === id)
          const weeklyData = pol.weeklyPoints.map((pts, i) => ({ week: `W${i + 1}`, points: pts }))
          return (
            <RosterCard
              key={id}
              politician={pol}
              trades={polTrades}
              weeklyPointsData={weeklyData}
              isSelected={selectedId === id}
              isExpanded={expandedId === id}
              onSelect={() => handleSelect(id)}
              onToggleExpand={() => handleToggleExpand(id)}
            />
          )
        })}
      </div>

      <BenchSlots
        politicians={benchBioguideIds.map((id) => polMap.get(id)).filter(Boolean) as Politician[]}
        trades={trades}
        selectedId={selectedId}
        expandedId={expandedId}
        onSelect={handleSelect}
        onToggleExpand={handleToggleExpand}
      />
    </div>
  )
}
