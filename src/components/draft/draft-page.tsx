'use client'

import { useEffect, useRef, useState } from 'react'
import type { Politician } from '@/types'
import { loadPoliticians } from '@/lib/data/politicians'
import { loadDemoState } from '@/lib/data/demo'
import { useDraftStore } from '@/store/draft-store'
import { PreDraftLobby } from './pre-draft-lobby'
import { DraftBoard } from './draft-board'
import { PostDraft } from './post-draft'

export function DraftPage() {
  const [politicians, setPoliticians] = useState<Politician[]>([])
  const [leagueTeams, setLeagueTeams] = useState<import('@/types/demo').Team[]>([])
  const [loading, setLoading] = useState(true)
  const politicianMap = useRef<Map<string, Politician>>(new Map())

  const phase = useDraftStore((s) => s.phase)
  const initDraft = useDraftStore((s) => s.initDraft)
  const resetDraft = useDraftStore((s) => s.resetDraft)

  useEffect(() => {
    Promise.all([loadPoliticians(), loadDemoState()])
      .then(([pols, demo]) => {
        setPoliticians(pols)
        const map = new Map<string, Politician>()
        for (const p of pols) {
          map.set(p.bioguideId, p)
        }
        politicianMap.current = map
        const firstLeague = demo.leagues[0]
        if (firstLeague) {
          setLeagueTeams(firstLeague.teams)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  function handleStartNewDraft() {
    if (politicians.length > 0 && leagueTeams.length > 0) {
      resetDraft()
      initDraft(politicians, leagueTeams)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 p-8">
        <div className="text-lg font-semibold text-muted-foreground animate-pulse">
          Loading Draft Room...
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-2xl">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-xl bg-muted animate-pulse"
            />
          ))}
        </div>
      </div>
    )
  }

  if (phase === 'lobby' || phase === 'countdown') {
    return (
      <PreDraftLobby
        politicians={politicians}
        teams={leagueTeams}
        onStartNewDraft={handleStartNewDraft}
      />
    )
  }

  if (phase === 'drafting' || phase === 'user-turn') {
    return (
      <DraftBoard
        politicians={politicians}
        politicianMap={politicianMap.current}
      />
    )
  }

  if (phase === 'complete') {
    return <PostDraft politicians={politicianMap.current} />
  }

  // phase === 'lobby' fallback (before initDraft called)
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-3xl font-bold text-foreground">DRAFT ROOM</h1>
      <button
        onClick={handleStartNewDraft}
        className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 transition-colors"
      >
        Start New Draft
      </button>
    </div>
  )
}
