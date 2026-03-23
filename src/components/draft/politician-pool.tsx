'use client'

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import type { Politician } from '@/types'
import type { Party } from '@/types'
import { PoliticianCard } from '@/components/design/politician-card'
import { cn } from '@/lib/utils'
import { PARTY_COLORS } from '@/lib/party-colors'
import { Button } from '@/components/ui/button'

type SortField = 'seasonPoints' | 'salaryCap' | 'insiderRiskScore' | 'value'

interface PoliticianPoolProps {
  politicians: Politician[]
  availablePool: string[]
  salaryRemaining: number
  isUserTurn: boolean
  onPick: (bioguideId: string) => void
}

export function PoliticianPool({
  politicians,
  availablePool,
  salaryRemaining,
  isUserTurn,
  onPick,
}: PoliticianPoolProps) {
  const [sortBy, setSortBy] = useState<SortField>('seasonPoints')
  const [search, setSearch] = useState('')
  const [activeParties, setActiveParties] = useState<Set<Party>>(new Set(['D', 'R', 'I']))

  // Build a set for O(1) lookup
  const availableSet = useMemo(() => new Set(availablePool), [availablePool])

  // Map available pool to politician objects
  const availablePoliticians = useMemo(() => {
    return politicians.filter((p) => availableSet.has(p.bioguideId))
  }, [politicians, availableSet])

  // Filter
  const filtered = useMemo(() => {
    return availablePoliticians.filter((p) => {
      const matchesSearch =
        search === '' || p.name.toLowerCase().includes(search.toLowerCase())
      const matchesParty = activeParties.has(p.party as Party)
      return matchesSearch && matchesParty
    })
  }, [availablePoliticians, search, activeParties])

  // Sort
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'seasonPoints':
          return b.seasonPoints - a.seasonPoints
        case 'salaryCap':
          return b.salaryCap - a.salaryCap
        case 'insiderRiskScore':
          return b.insiderRiskScore - a.insiderRiskScore
        case 'value': {
          const valueA = a.salaryCap > 0 ? a.seasonPoints / a.salaryCap : 0
          const valueB = b.salaryCap > 0 ? b.seasonPoints / b.salaryCap : 0
          return valueB - valueA
        }
        default:
          return 0
      }
    })
  }, [filtered, sortBy])

  function toggleParty(party: Party) {
    setActiveParties((prev) => {
      const next = new Set(prev)
      if (next.has(party)) {
        // Don't allow deselecting all
        if (next.size > 1) next.delete(party)
      } else {
        next.add(party)
      }
      return next
    })
  }

  return (
    <div className="flex flex-col h-full">
      {/* Filter/Sort bar */}
      <div className="p-3 border-b border-border space-y-2 shrink-0">
        {/* Search */}
        <input
          type="text"
          placeholder="Search politicians..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-1.5 text-sm bg-muted border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground"
        />

        <div className="flex items-center gap-2">
          {/* Party toggles */}
          <div className="flex gap-1">
            {(['D', 'R', 'I'] as Party[]).map((party) => {
              const active = activeParties.has(party)
              const color = PARTY_COLORS[party] ?? '#888'
              return (
                <button
                  key={party}
                  onClick={() => toggleParty(party)}
                  className="px-2 py-1 text-xs font-bold rounded border transition-all"
                  style={
                    active
                      ? {
                          backgroundColor: `${color}26`,
                          color,
                          borderColor: `${color}66`,
                        }
                      : {
                          backgroundColor: 'transparent',
                          color: 'var(--muted-foreground)',
                          borderColor: 'var(--border)',
                        }
                  }
                >
                  {party}
                </button>
              )
            })}
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortField)}
            className="flex-1 text-xs bg-muted border border-border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="seasonPoints">Season Points</option>
            <option value="salaryCap">Salary</option>
            <option value="insiderRiskScore">Risk Score</option>
            <option value="value">Value (pts/$)</option>
          </select>
        </div>

        <p className="text-[11px] text-muted-foreground">
          {sorted.length} available
          {!isUserTurn && (
            <span className="ml-2 text-muted-foreground/60">— waiting for AI pick</span>
          )}
        </p>
      </div>

      {/* Politician list */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence>
          {sorted.map((politician) => {
            const overCap = politician.salaryCap > salaryRemaining

            return (
              <motion.div
                key={politician.bioguideId}
                layout
                exit={{ opacity: 0, x: -20, height: 0 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  'relative border-b border-border/50 last:border-0',
                  overCap && 'opacity-50'
                )}
              >
                <div className="flex items-center gap-2 px-2 py-1">
                  <div className="flex-1 min-w-0">
                    <PoliticianCard
                      politician={politician}
                      variant="compact"
                      className="border-0 shadow-none hover:scale-100 p-0"
                    />
                  </div>

                  <div className="shrink-0 flex flex-col items-end gap-1">
                    {overCap && (
                      <span className="text-[9px] font-bold text-red-500 uppercase tracking-wider">
                        Over cap
                      </span>
                    )}
                    {isUserTurn && (
                      <Button
                        size="sm"
                        disabled={overCap}
                        onClick={() => onPick(politician.bioguideId)}
                        className={cn(
                          'text-xs h-7 px-3 font-bold',
                          overCap && 'opacity-40 pointer-events-none'
                        )}
                      >
                        DRAFT
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {sorted.length === 0 && (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No politicians match your filters
          </div>
        )}
      </div>
    </div>
  )
}
