'use client'

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import type { DraftPick, DraftTeam } from '@/types/draft'
import type { Politician } from '@/types'
import { PARTY_COLORS } from '@/lib/party-colors'

interface PickTickerProps {
  picks: DraftPick[]
  teams: DraftTeam[]
  politicians: Map<string, Politician>
}

export function PickTicker({ picks, teams, politicians }: PickTickerProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current && picks.length > 0) {
      containerRef.current.scrollTo({ left: containerRef.current.scrollWidth, behavior: 'smooth' })
    }
  }, [picks.length])

  return (
    <div className="w-full bg-muted/50 border-t border-border h-16 flex items-center">
      {picks.length === 0 ? (
        <p className="w-full text-center text-xs text-muted-foreground">
          Picks will appear here as the draft progresses
        </p>
      ) : (
        <div
          ref={containerRef}
          className="flex overflow-x-auto gap-2 items-center px-4 h-full w-full scrollbar-hide"
          style={{ scrollbarWidth: 'none' }}
        >
          <AnimatePresence>
            {picks.map((pick) => {
              const politician = politicians.get(pick.bioguideId)
              const team = teams[pick.teamIndex]
              const partyColor = politician ? (PARTY_COLORS[politician.party] ?? PARTY_COLORS['I']) : '#888'
              const isUserTeam = team?.isUser ?? false
              const lastName = politician?.name.split(' ').pop() ?? '???'
              const teamAbbr = (team?.name ?? '???').slice(0, 3).toUpperCase()

              return (
                <motion.div
                  key={pick.pickNumber}
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                  className="flex items-center gap-1.5 shrink-0 rounded-md px-2 py-1 bg-background border border-border text-xs"
                  style={{
                    borderLeft: `3px solid ${partyColor}`,
                    outline: isUserTeam ? '1px solid hsl(var(--primary))' : undefined,
                    minWidth: '160px',
                    boxShadow: isUserTeam
                      ? '0 0 12px rgba(34,197,94,0.25)'
                      : '0 0 12px rgba(234,179,8,0.2)',
                  }}
                >
                  <span className="text-[10px] font-bold text-muted-foreground shrink-0">
                    #{pick.pickNumber + 1}
                  </span>
                  {politician && (
                    <div className="relative shrink-0 size-6 overflow-hidden rounded-full bg-muted">
                      <img
                        src={politician.photoUrl}
                        alt={politician.name}
                        loading="lazy"
                        className="size-full object-cover object-center"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                        }}
                      />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{lastName}</p>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {teamAbbr} &middot; ${pick.salaryCap.toLocaleString()}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
