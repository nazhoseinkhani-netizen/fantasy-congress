'use client'

import { useEffect, useState } from 'react'
import { loadDemoState } from '@/lib/data/demo'
import { loadPoliticians } from '@/lib/data/politicians'
import { WeeklyRecapMockup } from '@/components/share/weekly-recap-mockup'
import type { Politician, DemoState } from '@/types'

interface RecapData {
  teamName: string
  weekNumber: number
  userScore: number
  opponentScore: number
  opponentName: string
  userRecord: string
  mvpPolitician: Politician | null
  topTrades: Array<{ politicianName: string; points: number; ticker: string }>
}

export default function WeeklyRecapPage() {
  const [recapData, setRecapData] = useState<RecapData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [demoState, politicians] = await Promise.all([
          loadDemoState(),
          loadPoliticians(),
        ])

        const data = deriveRecapData(demoState, politicians)
        setRecapData(data)
      } catch (error) {
        console.error('Failed to load recap data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-lg font-semibold text-muted-foreground mb-4 text-center">
          Weekly Recap Email — Design Preview
        </h1>
        <p className="text-xs text-muted-foreground text-center mb-8">
          This is a mockup of what a weekly recap email would look like. No email infrastructure needed.
        </p>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">
            Loading recap data...
          </div>
        ) : recapData ? (
          <WeeklyRecapMockup
            teamName={recapData.teamName}
            weekNumber={recapData.weekNumber}
            userScore={recapData.userScore}
            opponentScore={recapData.opponentScore}
            opponentName={recapData.opponentName}
            userRecord={recapData.userRecord}
            mvpPolitician={recapData.mvpPolitician}
            topTrades={recapData.topTrades}
          />
        ) : (
          <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">
            Failed to load recap data.
          </div>
        )}
      </div>
    </div>
  )
}

function deriveRecapData(demoState: DemoState, politicians: Politician[]): RecapData {
  const userLeague = demoState.leagues.find((l) => l.id === demoState.activeLeagueId)
  const userTeam = userLeague?.teams.find((t) => t.id === demoState.userTeamId)
  const weekNumber = userLeague?.currentWeek ?? 1

  // Find the latest matchup for the user team
  const userMatchup = userLeague?.schedule
    .flatMap((s) => s.matchups)
    .filter((m) => m.completed && (m.homeTeamId === demoState.userTeamId || m.awayTeamId === demoState.userTeamId))
    .sort((a, b) => b.week - a.week)[0]

  const isHome = userMatchup?.homeTeamId === demoState.userTeamId
  const userScore = isHome ? (userMatchup?.homeScore ?? 0) : (userMatchup?.awayScore ?? 0)
  const opponentScore = isHome ? (userMatchup?.awayScore ?? 0) : (userMatchup?.homeScore ?? 0)
  const opponentTeamId = isHome ? userMatchup?.awayTeamId : userMatchup?.homeTeamId
  const opponentTeam = userLeague?.teams.find((t) => t.id === opponentTeamId)

  // Build user record string
  const record = userTeam?.record
  const userRecord = record ? `${record.wins}-${record.losses}${record.ties > 0 ? `-${record.ties}` : ''}` : '0-0'

  // Find MVP: user's week result for latest week with roster politicians
  const latestWeekResult = demoState.weekResults
    .filter((r) => r.teamId === demoState.userTeamId)
    .sort((a, b) => b.week - a.week)[0]

  const mvpBioguideId = latestWeekResult?.mvpBioguideId ?? null
  const mvpPolitician = mvpBioguideId ? (politicians.find((p) => p.bioguideId === mvpBioguideId) ?? null) : null

  // Top 3 trades: from roster politicians with highest season points
  const rosterIds = [
    ...(userTeam?.roster.active ?? []),
    ...(userTeam?.roster.bench ?? []),
  ]
  const rosterPoliticians = politicians
    .filter((p) => rosterIds.includes(p.bioguideId))
    .sort((a, b) => b.seasonPoints - a.seasonPoints)
    .slice(0, 3)

  const topTrades = rosterPoliticians.map((p) => ({
    politicianName: p.name,
    points: p.seasonPoints,
    ticker: 'MISC',
  }))

  return {
    teamName: userTeam?.name ?? 'Your Team',
    weekNumber,
    userScore,
    opponentScore,
    opponentName: opponentTeam?.name ?? 'Opponent',
    userRecord,
    mvpPolitician,
    topTrades,
  }
}
