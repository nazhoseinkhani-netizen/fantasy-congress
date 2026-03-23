'use client'

import { useState, useEffect } from 'react'
import type { DemoState } from '@/types/demo'
import type { Politician } from '@/types/politician'
import type { Trade } from '@/types/trade'
import { useGameStore } from '@/store/game-store'
import { loadDemoState } from '@/lib/data/demo'
import { loadPoliticiansByIds } from '@/lib/data/politicians'
import { loadTrades } from '@/lib/data/trades'
import { RosterGrid } from './roster-grid'
import { TeamStatsPanel } from './team-stats-panel'

export function TeamPage() {
  const [demoState, setDemoState] = useState<DemoState | null>(null)
  const [politicians, setPoliticians] = useState<Politician[]>([])
  const [trades, setTrades] = useState<Trade[]>([])

  const rosterOverrides = useGameStore((s) => s.rosterOverrides)
  const resetRoster = useGameStore((s) => s.resetRoster)

  useEffect(() => {
    Promise.all([loadDemoState(), loadTrades()]).then(([demo, trd]) => {
      setDemoState(demo)
      setTrades(trd)
      const userLeague = demo.leagues.find((l) => l.id === demo.activeLeagueId)
      const userTeam = userLeague?.teams.find((t) => t.id === demo.userTeamId)
      if (userTeam) {
        const allIds = [...userTeam.roster.active, ...userTeam.roster.bench]
        loadPoliticiansByIds(allIds).then(setPoliticians)
      }
    })
  }, [])

  if (!demoState || politicians.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="h-8 w-48 bg-muted rounded animate-pulse mb-2" />
        <div className="h-4 w-32 bg-muted rounded animate-pulse mb-6" />
        <div className="lg:grid lg:grid-cols-[1fr_280px] gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-20 bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
          <div className="hidden lg:block h-64 bg-muted rounded-xl animate-pulse" />
        </div>
      </div>
    )
  }

  const userLeague = demoState.leagues.find((l) => l.id === demoState.activeLeagueId)!
  const userTeam = userLeague.teams.find((t) => t.id === demoState.userTeamId)!
  const originalRoster = { active: userTeam.roster.active, bench: userTeam.roster.bench }
  const currentRoster = rosterOverrides[userTeam.id] ?? originalRoster
  const teamWeekResults = demoState.weekResults.filter((wr) => wr.teamId === userTeam.id)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-1">{userTeam.name}</h1>
      <p className="text-muted-foreground text-sm mb-6">Managed by {userTeam.owner}</p>

      <div className="lg:grid lg:grid-cols-[1fr_280px] gap-6">
        <div>
          <RosterGrid
            politicians={politicians}
            activeBioguideIds={currentRoster.active}
            benchBioguideIds={currentRoster.bench}
            trades={trades}
            teamId={userTeam.id}
            originalRoster={originalRoster}
          />
        </div>
        <div>
          <TeamStatsPanel
            roster={userTeam.roster}
            team={userTeam}
            weekResults={teamWeekResults}
            onResetRoster={() => resetRoster(userTeam.id)}
          />
        </div>
      </div>
    </div>
  )
}
