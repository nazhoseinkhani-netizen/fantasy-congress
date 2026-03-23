'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import type { Politician } from '@/types'
import type { Team } from '@/types/demo'
import { useDraftStore } from '@/store/draft-store'
import { DRAFT_CONFIG } from '@/types/draft'
import { PoliticianCard } from '@/components/design/politician-card'
import { cn } from '@/lib/utils'

const ARCHETYPE_LABELS: Record<string, string> = {
  'value-hunter': 'Value Hunter',
  'corruption-chaser': 'Corruption Chaser',
  'party-loyalist': 'Party Loyalist',
  'balanced': 'Balanced',
  'human': 'YOU',
}

const ARCHETYPE_COLORS: Record<string, string> = {
  'value-hunter': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'corruption-chaser': 'bg-red-500/20 text-red-400 border-red-500/30',
  'party-loyalist': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'balanced': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'human': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
}

type SortField = 'seasonPoints' | 'salaryCap' | 'insiderRiskScore'

interface PreDraftLobbyProps {
  politicians: Politician[]
  teams: Team[]
  onStartNewDraft: () => void
}

export function PreDraftLobby({ politicians, teams, onStartNewDraft }: PreDraftLobbyProps) {
  const phase = useDraftStore((s) => s.phase)
  const draftTeams = useDraftStore((s) => s.teams)
  const userTeamIndex = useDraftStore((s) => s.userTeamIndex)
  const startCountdown = useDraftStore((s) => s.startCountdown)
  const startDrafting = useDraftStore((s) => s.startDrafting)

  const [countdown, setCountdown] = useState<number>(DRAFT_CONFIG.COUNTDOWN_SECONDS)
  const [sortBy, setSortBy] = useState<SortField>('seasonPoints')
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Run countdown when phase transitions to 'countdown'
  useEffect(() => {
    if (phase !== 'countdown') return
    setCountdown(DRAFT_CONFIG.COUNTDOWN_SECONDS)

    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!)
          intervalRef.current = null
          startDrafting()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [phase, startDrafting])

  // Sort politicians for scouting board
  const sortedPoliticians = [...politicians].sort((a, b) => {
    if (sortBy === 'seasonPoints') return b.seasonPoints - a.seasonPoints
    if (sortBy === 'salaryCap') return b.salaryCap - a.salaryCap
    if (sortBy === 'insiderRiskScore') return b.insiderRiskScore - a.insiderRiskScore
    return 0
  })

  // Use draft store teams if available (after initDraft), else use raw league teams
  const displayTeams = draftTeams.length > 0 ? draftTeams : null

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-black tracking-tight text-foreground">
            DRAFT ROOM
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {teams[0] ? `${teams[0].name.split(' ').slice(0, -1).join(' ')} League` : 'Fantasy Congress'}
          </p>
        </div>

        {/* Draft Order Reveal */}
        {displayTeams && (
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground text-center">
              Draft Order
            </h2>
            <div className="flex gap-3 justify-center flex-wrap">
              {displayTeams.map((team, i) => (
                <motion.div
                  key={team.index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.2, duration: 0.4 }}
                  className={cn(
                    'relative flex flex-col items-center gap-2 rounded-xl border p-4 w-40',
                    team.isUser
                      ? 'border-amber-500/60 bg-amber-500/10 ring-2 ring-amber-500/40'
                      : 'border-border bg-card'
                  )}
                >
                  {/* Pick number badge */}
                  <div className={cn(
                    'absolute -top-2 -left-2 size-6 rounded-full text-xs font-bold flex items-center justify-center',
                    team.isUser ? 'bg-amber-500 text-black' : 'bg-muted text-muted-foreground'
                  )}>
                    {i + 1}
                  </div>

                  {/* Star or archetype icon */}
                  {team.isUser ? (
                    <div className="text-2xl">★</div>
                  ) : (
                    <div className="text-xl opacity-60">🤖</div>
                  )}

                  {/* Team name */}
                  <p className="text-sm font-semibold text-center leading-tight">{team.name}</p>

                  {/* Archetype badge */}
                  <span className={cn(
                    'text-xs font-medium px-2 py-0.5 rounded-full border',
                    ARCHETYPE_COLORS[team.archetype] ?? ARCHETYPE_COLORS['balanced']
                  )}>
                    {team.isUser ? 'YOUR PICK' : ARCHETYPE_LABELS[team.archetype] ?? team.archetype}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Countdown / Ready section */}
        <div className="flex flex-col items-center gap-4 py-4">
          {phase === 'lobby' && (
            <div className="flex flex-col items-center gap-3">
              {displayTeams ? (
                <button
                  onClick={startCountdown}
                  className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 transition-colors"
                >
                  Ready to Draft
                </button>
              ) : (
                <button
                  onClick={onStartNewDraft}
                  className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 transition-colors"
                >
                  Start New Draft
                </button>
              )}
              <p className="text-xs text-muted-foreground">Scout the board below before the draft begins</p>
            </div>
          )}

          {phase === 'countdown' && (
            <div className="flex flex-col items-center gap-2">
              <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">
                Draft Starting In
              </p>
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={countdown}
                  initial={{ scale: 1.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.6, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="text-8xl font-black text-primary tabular-nums"
                >
                  {countdown}
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Scouting Board */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Scouting Board
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortField)}
                className="text-xs bg-muted border border-border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="seasonPoints">Season Points</option>
                <option value="salaryCap">Salary Cap</option>
                <option value="insiderRiskScore">Risk Score</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {sortedPoliticians.map((politician) => (
              <PoliticianCard
                key={politician.bioguideId}
                politician={politician}
                variant="compact"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
