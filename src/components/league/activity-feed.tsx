'use client'

import { useMemo } from 'react'
import { Trophy, Star, Activity } from 'lucide-react'
import type { League, WeekSchedule, WeekResult } from '@/types/demo'
import type { Politician } from '@/types/politician'
import type { Trade } from '@/types/trade'

interface ActivityFeedProps {
  league: League
  weekResults: WeekResult[]
  schedules: WeekSchedule[]
  politicians: Politician[]
  trades: Trade[]
}

type ActivityEvent =
  | { type: 'matchup_result'; week: number; winnerName: string; loserName: string; winnerScore: number; loserScore: number; sortKey: number }
  | { type: 'mvp'; week: number; teamName: string; politicianName: string; points: number; sortKey: number }
  | { type: 'big_trade'; politicianName: string; ticker: string; points: number; date: string; sortKey: number }

const MAX_EVENTS = 20

export function ActivityFeed({ league, weekResults, schedules, politicians, trades }: ActivityFeedProps) {
  const events = useMemo((): ActivityEvent[] => {
    const teamMap = new Map(league.teams.map((t) => [t.id, t]))
    const polMap = new Map(politicians.map((p) => [p.bioguideId, p]))
    const result: ActivityEvent[] = []

    // 1. Matchup results
    for (const weekSched of schedules) {
      for (const matchup of weekSched.matchups) {
        if (!matchup.completed) continue
        const homeTeam = teamMap.get(matchup.homeTeamId)
        const awayTeam = teamMap.get(matchup.awayTeamId)
        if (!homeTeam || !awayTeam) continue

        const homeWon = matchup.homeScore >= matchup.awayScore
        result.push({
          type: 'matchup_result',
          week: matchup.week,
          winnerName: homeWon ? homeTeam.name : awayTeam.name,
          loserName: homeWon ? awayTeam.name : homeTeam.name,
          winnerScore: homeWon ? matchup.homeScore : matchup.awayScore,
          loserScore: homeWon ? matchup.awayScore : matchup.homeScore,
          sortKey: matchup.week * 1000 + 100,
        })
      }
    }

    // 2. Weekly MVPs
    for (const wr of weekResults) {
      if (!wr.mvpBioguideId) continue
      const team = teamMap.get(wr.teamId)
      if (!team) continue
      const pol = polMap.get(wr.mvpBioguideId)
      const politicianName = pol?.name ?? wr.mvpBioguideId
      const mvpEntry = wr.politicianPoints.find((pp) => pp.bioguideId === wr.mvpBioguideId)
      const points = mvpEntry?.points ?? 0
      result.push({
        type: 'mvp',
        week: wr.week,
        teamName: team.name,
        politicianName,
        points,
        sortKey: wr.week * 1000 + 50,
      })
    }

    // 3. Big trades — politicians on any roster in this league
    const allBioguideIds = new Set<string>()
    for (const team of league.teams) {
      for (const id of team.roster.active) allBioguideIds.add(id)
      for (const id of team.roster.bench) allBioguideIds.add(id)
    }

    for (const trade of trades) {
      if (!allBioguideIds.has(trade.bioguideId)) continue
      if (trade.fantasyPoints <= 20) continue
      const dateKey = parseInt(trade.disclosureDate.replace(/-/g, ''), 10)
      result.push({
        type: 'big_trade',
        politicianName: trade.politicianName,
        ticker: trade.ticker,
        points: trade.fantasyPoints,
        date: trade.disclosureDate,
        sortKey: dateKey,
      })
    }

    // Sort descending, cap at MAX_EVENTS
    return result.sort((a, b) => b.sortKey - a.sortKey).slice(0, MAX_EVENTS)
  }, [league, weekResults, schedules, politicians, trades])

  if (events.length === 0) {
    return (
      <div className="text-sm text-muted-foreground py-8 text-center">
        No activity yet.
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {events.map((event, i) => {
        if (event.type === 'matchup_result') {
          return (
            <div key={i} className="flex items-start gap-3 rounded-lg border border-border/50 bg-card px-4 py-3">
              <Trophy className="size-4 text-amber-400 shrink-0 mt-0.5" />
              <span className="text-sm">
                <span className="text-muted-foreground">Week {event.week}: </span>
                <span className="font-semibold text-foreground">{event.winnerName}</span>
                <span className="text-muted-foreground"> beat </span>
                <span className="text-muted-foreground">{event.loserName}</span>
                <span className="text-muted-foreground tabular-nums">
                  {' '}
                  {event.winnerScore.toFixed(1)}–{event.loserScore.toFixed(1)}
                </span>
              </span>
            </div>
          )
        }

        if (event.type === 'mvp') {
          return (
            <div key={i} className="flex items-start gap-3 rounded-lg border border-border/50 bg-card px-4 py-3">
              <Star className="size-4 text-yellow-400 shrink-0 mt-0.5" />
              <span className="text-sm">
                <span className="text-muted-foreground">Week {event.week} MVP: </span>
                <span className="text-primary font-medium">{event.politicianName}</span>
                <span className="text-muted-foreground"> ({event.points.toFixed(1)} pts) on </span>
                <span className="text-foreground">{event.teamName}</span>
              </span>
            </div>
          )
        }

        if (event.type === 'big_trade') {
          return (
            <div key={i} className="flex items-start gap-3 rounded-lg border border-border/50 bg-card px-4 py-3">
              <Activity className="size-4 text-emerald-400 shrink-0 mt-0.5" />
              <span className="text-sm">
                <span className="font-medium text-foreground">{event.politicianName}</span>
                <span className="text-muted-foreground"> traded </span>
                <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">{event.ticker}</span>
                <span className="text-muted-foreground"> for </span>
                <span className="font-medium text-emerald-400">{event.points.toFixed(1)} pts</span>
                <span className="text-xs text-muted-foreground ml-2">{event.date}</span>
              </span>
            </div>
          )
        }

        return null
      })}
    </div>
  )
}
