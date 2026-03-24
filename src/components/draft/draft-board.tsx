'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import type { Politician } from '@/types'
import { useDraftStore } from '@/store/draft-store'
import { DRAFT_CONFIG } from '@/types/draft'
import { selectAIPick } from '@/lib/draft/ai-engine'
import { PoliticianPool } from './politician-pool'
import { OnTheClock } from './on-the-clock'
import { DraftRoster } from './draft-roster'
import { PickTicker } from './pick-ticker'
import { cn } from '@/lib/utils'

interface FlyAnimation {
  politicianName: string
  fromRect: DOMRect
}

interface DraftBoardProps {
  politicians: Politician[]
  politicianMap: Map<string, Politician>
}

export function DraftBoard({ politicians, politicianMap }: DraftBoardProps) {
  const phase = useDraftStore((s) => s.phase)
  const teams = useDraftStore((s) => s.teams)
  const picks = useDraftStore((s) => s.picks)
  const availablePool = useDraftStore((s) => s.availablePool)
  const currentPickIndex = useDraftStore((s) => s.currentPickIndex)
  const userTeamIndex = useDraftStore((s) => s.userTeamIndex)
  const userPickTimer = useDraftStore((s) => s.userPickTimer)
  const isAITurnPending = useDraftStore((s) => s.isAITurnPending)
  const recordPick = useDraftStore((s) => s.recordPick)
  const setAITurnPending = useDraftStore((s) => s.setAITurnPending)
  const setUserPickTimer = useDraftStore((s) => s.setUserPickTimer)
  const getCurrentTeamIndex = useDraftStore((s) => s.getCurrentTeamIndex)

  const [mobileTab, setMobileTab] = useState<'pool' | 'roster'>('pool')
  const [flyAnimation, setFlyAnimation] = useState<FlyAnimation | null>(null)
  const [burstActive, setBurstActive] = useState(false)
  const aiTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const userTimerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // AI turn orchestration
  useEffect(() => {
    if (phase !== 'drafting' || isAITurnPending) return

    const sessionId = useDraftStore.getState().draftSessionId

    setAITurnPending(true)

    const delay =
      DRAFT_CONFIG.AI_DELAY_MIN_MS +
      Math.random() * (DRAFT_CONFIG.AI_DELAY_MAX_MS - DRAFT_CONFIG.AI_DELAY_MIN_MS)

    aiTimeoutRef.current = setTimeout(() => {
      // Stale session check
      if (useDraftStore.getState().draftSessionId !== sessionId) return

      const currentState = useDraftStore.getState()
      const teamIndex = getCurrentTeamIndex()
      const team = currentState.teams[teamIndex]
      if (!team) return

      const salaryRemaining = DRAFT_CONFIG.SALARY_CAP - team.salaryUsed
      // Filter available pool to only IDs that exist in politicianMap
      // (handles stale persisted state from ID changes)
      const validPool = currentState.availablePool.filter((id) => politicianMap.has(id))
      if (validPool.length === 0) {
        setAITurnPending(false)
        return
      }

      const bioguideId = selectAIPick(
        team.archetype === 'human' ? 'balanced' : team.archetype,
        validPool,
        team.roster,
        salaryRemaining,
        politicianMap
      )

      const politician = politicianMap.get(bioguideId)
      if (!politician) {
        // Reset pending flag so effect can retry
        setAITurnPending(false)
        return
      }

      recordPick(bioguideId, politician.salaryCap)
    }, delay)

    return () => {
      if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current)
    }
  }, [phase, isAITurnPending, currentPickIndex]) // eslint-disable-line react-hooks/exhaustive-deps

  // User pick timer
  useEffect(() => {
    if (phase !== 'user-turn') {
      if (userTimerIntervalRef.current) {
        clearInterval(userTimerIntervalRef.current)
        userTimerIntervalRef.current = null
      }
      return
    }

    userTimerIntervalRef.current = setInterval(() => {
      const currentTimer = useDraftStore.getState().userPickTimer
      if (currentTimer <= 1) {
        clearInterval(userTimerIntervalRef.current!)
        userTimerIntervalRef.current = null

        // Auto-pick best available
        const currentState = useDraftStore.getState()
        const teamIndex = currentState.userTeamIndex
        const team = currentState.teams[teamIndex]
        if (!team) return

        const salaryRemaining = DRAFT_CONFIG.SALARY_CAP - team.salaryUsed
        const available = currentState.availablePool
          .map((id) => politicianMap.get(id))
          .filter((p): p is Politician => p !== undefined && p.salaryCap <= salaryRemaining)
          .sort((a, b) => b.seasonPoints - a.seasonPoints)

        const best = available[0]
        if (best) {
          recordPick(best.bioguideId, best.salaryCap)
        }
      } else {
        setUserPickTimer(currentTimer - 1)
      }
    }, 1000)

    return () => {
      if (userTimerIntervalRef.current) {
        clearInterval(userTimerIntervalRef.current)
        userTimerIntervalRef.current = null
      }
    }
  }, [phase]) // eslint-disable-line react-hooks/exhaustive-deps

  const userTeam = teams[userTeamIndex]
  const currentTeamIndex = getCurrentTeamIndex()
  const currentTeam = teams[currentTeamIndex]
  const isUserTurn = phase === 'user-turn'

  function handleUserPick(bioguideId: string, event?: React.MouseEvent) {
    const politician = politicianMap.get(bioguideId)
    if (!politician) return

    // Capture pick source position for fly animation
    if (event?.currentTarget) {
      const fromRect = (event.currentTarget as HTMLElement).getBoundingClientRect()
      setFlyAnimation({ politicianName: politician.name, fromRect })
    }

    // Delay pick slightly so animation starts before card leaves pool
    setTimeout(() => {
      recordPick(bioguideId, politician.salaryCap)
    }, 50)
  }

  const salaryRemaining = userTeam
    ? DRAFT_CONFIG.SALARY_CAP - userTeam.salaryUsed
    : DRAFT_CONFIG.SALARY_CAP

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* 3-panel layout — desktop */}
      <div className="flex-1 hidden lg:grid grid-cols-[1fr_320px_300px] gap-0 overflow-hidden">
        {/* Left: Politician Pool */}
        <div className="overflow-hidden border-r border-border">
          <PoliticianPool
            politicians={politicians}
            availablePool={availablePool}
            salaryRemaining={salaryRemaining}
            isUserTurn={isUserTurn}
            onPick={(id, e) => handleUserPick(id, e)}
          />
        </div>

        {/* Center: On The Clock */}
        <div className="border-r border-border overflow-hidden">
          {currentTeam && (
            <OnTheClock
              currentTeam={currentTeam}
              isUserTurn={isUserTurn}
              userPickTimer={userPickTimer}
              currentPickNumber={currentPickIndex}
              totalPicks={DRAFT_CONFIG.TOTAL_PICKS}
              salaryRemaining={salaryRemaining}
              totalCap={DRAFT_CONFIG.SALARY_CAP}
            />
          )}
        </div>

        {/* Right: Draft Roster */}
        <div className="overflow-hidden">
          {userTeam && (
            <DraftRoster
              team={userTeam}
              politicians={politicianMap}
              totalCap={DRAFT_CONFIG.SALARY_CAP}
            />
          )}
        </div>
      </div>

      {/* Mobile layout */}
      <div className="lg:hidden flex-1 flex flex-col">
        {/* On The Clock pinned at top */}
        <div className="sticky top-0 z-10 border-b border-border bg-background">
          {currentTeam && (
            <OnTheClock
              currentTeam={currentTeam}
              isUserTurn={isUserTurn}
              userPickTimer={userPickTimer}
              currentPickNumber={currentPickIndex}
              totalPicks={DRAFT_CONFIG.TOTAL_PICKS}
              salaryRemaining={salaryRemaining}
              totalCap={DRAFT_CONFIG.SALARY_CAP}
            />
          )}
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-border">
          <button
            onClick={() => setMobileTab('pool')}
            className={cn(
              'flex-1 py-2.5 text-sm font-medium transition-colors',
              mobileTab === 'pool'
                ? 'text-foreground border-b-2 border-primary'
                : 'text-muted-foreground'
            )}
          >
            Available
          </button>
          <button
            onClick={() => setMobileTab('roster')}
            className={cn(
              'flex-1 py-2.5 text-sm font-medium transition-colors',
              mobileTab === 'roster'
                ? 'text-foreground border-b-2 border-primary'
                : 'text-muted-foreground'
            )}
          >
            My Roster
          </button>
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-hidden">
          {mobileTab === 'pool' && (
            <PoliticianPool
              politicians={politicians}
              availablePool={availablePool}
              salaryRemaining={salaryRemaining}
              isUserTurn={isUserTurn}
              onPick={(id, e) => handleUserPick(id, e)}
            />
          )}
          {mobileTab === 'roster' && userTeam && (
            <DraftRoster
              team={userTeam}
              politicians={politicianMap}
              totalCap={DRAFT_CONFIG.SALARY_CAP}
            />
          )}
        </div>
      </div>

      {/* Pick Ticker — full width */}
      <PickTicker
        picks={picks}
        teams={teams}
        politicians={politicianMap}
      />

      {/* Fly-to-roster animation overlay */}
      <AnimatePresence>
        {flyAnimation && (
          <motion.div
            className="fixed z-50 pointer-events-none"
            style={{
              left: flyAnimation.fromRect.left,
              top: flyAnimation.fromRect.top,
              width: flyAnimation.fromRect.width,
              height: flyAnimation.fromRect.height,
            }}
            initial={{ scale: 1, opacity: 1, x: 0, y: 0 }}
            animate={{
              x: [0, -50, -200],
              y: [0, -30, 100],
              scale: [1, 1.15, 0.3],
              opacity: [1, 1, 0],
            }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            onAnimationComplete={() => {
              setFlyAnimation(null)
              setBurstActive(true)
              setTimeout(() => setBurstActive(false), 500)
            }}
          >
            <div className="bg-card border border-primary rounded-lg p-2 shadow-lg shadow-primary/20 text-sm font-semibold text-center truncate h-full flex items-center justify-center">
              {flyAnimation.politicianName}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Burst particle effect */}
      <AnimatePresence>
        {burstActive && flyAnimation === null && (
          <>
            {[0, 60, 120, 180, 240, 300].map((angle) => (
              <motion.div
                key={angle}
                className="fixed z-50 pointer-events-none size-1.5 rounded-full bg-yellow-400"
                style={{ left: '50%', top: '50%' }}
                initial={{ scale: 0, opacity: 1, x: 0, y: 0 }}
                animate={{
                  scale: [0, 1, 0.5],
                  opacity: [1, 1, 0],
                  x: Math.cos((angle * Math.PI) / 180) * 40,
                  y: Math.sin((angle * Math.PI) / 180) * 40,
                }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
