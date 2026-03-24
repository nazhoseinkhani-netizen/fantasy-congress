'use client'

import { useState } from 'react'
import { Star, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PARTY_COLORS } from '@/lib/party-colors'
import { DigitFlipCounter } from '@/components/animations/animated-counter'
import type { Matchup, Team, WeekResult } from '@/types'
import type { Politician } from '@/types/politician'
import type { Trade } from '@/types/trade'

interface MatchupScoreboardProps {
  matchup: Matchup | undefined
  userTeam: Team
  opponentTeam: Team | undefined
  userWeekResult: WeekResult | undefined
  opponentWeekResult: WeekResult | undefined
  politicians: Map<string, Politician>
  trades: Trade[]
}

interface PoliticianRowProps {
  bioguideId: string
  points: number
  isMvp: boolean
  politician: Politician | undefined
  trades: Trade[]
}

function PoliticianRow({ bioguideId, points, isMvp, politician, trades }: PoliticianRowProps) {
  const [expanded, setExpanded] = useState(false)

  const partyColor = politician ? (PARTY_COLORS[politician.party] ?? PARTY_COLORS['I']) : '#888'
  const politicianTrades = trades.filter((t) => t.bioguideId === bioguideId)

  return (
    <div
      className={cn(
        'rounded-lg border border-border/50 mb-2 overflow-hidden transition-colors',
        isMvp && 'border-yellow-400/50 bg-yellow-400/5 border-l-2 border-l-yellow-400'
      )}
    >
      {/* Main row */}
      <div className="flex items-center gap-3 px-3 py-2">
        {/* MVP star */}
        {isMvp ? (
          <Star className="size-4 text-yellow-400 shrink-0 fill-yellow-400" />
        ) : (
          <div className="size-4 shrink-0" />
        )}

        {/* Photo */}
        {politician?.photoUrl ? (
          <img
            src={politician.photoUrl}
            alt={politician.name}
            className="size-12 rounded-full object-cover object-center bg-muted shrink-0"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
            }}
          />
        ) : (
          <div className="size-12 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground shrink-0">
            {politician?.name?.charAt(0) ?? '?'}
          </div>
        )}

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold truncate">
              {politician?.name ?? bioguideId}
            </span>
            {politician && (
              <span
                className="text-xs font-bold px-1 py-0.5 rounded shrink-0"
                style={{ color: partyColor, backgroundColor: `${partyColor}26` }}
              >
                {politician.party}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {politician
              ? `${politician.chamber === 'senate' ? 'Sen.' : 'Rep.'} · ${politician.state}`
              : 'Unknown'}
          </p>
        </div>

        {/* Points */}
        <div className="text-right shrink-0">
          <span className={cn('text-sm font-bold tabular-nums', isMvp && 'text-yellow-400')}>
            {points.toFixed(1)} pts
          </span>
        </div>

        {/* Toggle */}
        {politicianTrades.length > 0 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={expanded ? 'Collapse trades' : 'Expand trades'}
          >
            {expanded ? (
              <ChevronUp className="size-4" />
            ) : (
              <ChevronDown className="size-4" />
            )}
          </button>
        )}
      </div>

      {/* Expanded trades */}
      {expanded && politicianTrades.length > 0 && (
        <div className="border-t border-border/50 bg-muted/20 px-3 py-2 space-y-1.5">
          {politicianTrades.map((trade) => (
            <div key={trade.id} className="flex items-center gap-2 text-xs">
              <span
                className={cn(
                  'font-bold px-1.5 py-0.5 rounded border',
                  trade.tradeType === 'buy'
                    ? 'bg-green-400/10 text-green-400 border-green-400/30'
                    : 'bg-red-400/10 text-red-400 border-red-400/30'
                )}
              >
                {trade.tradeType.toUpperCase()}
              </span>
              <span className="font-mono font-bold">{trade.ticker}</span>
              <span className="text-muted-foreground truncate flex-1">{trade.company}</span>
              <span className="font-semibold shrink-0">
                {trade.fantasyPoints > 0 ? '+' : ''}{trade.fantasyPoints.toFixed(0)} pts
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

interface TeamColumnProps {
  label: string
  team: Team | undefined
  weekResult: WeekResult | undefined
  politicians: Map<string, Politician>
  trades: Trade[]
  isUser?: boolean
}

function TeamColumn({ label, team, weekResult, politicians, trades, isUser }: TeamColumnProps) {
  if (!team) {
    return (
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold text-muted-foreground">{label}</h3>
        <p className="text-sm text-muted-foreground italic py-4 text-center">No opponent this week</p>
      </div>
    )
  }

  const politicianPointsList = weekResult?.politicianPoints ?? team.roster.active.map((id) => ({ bioguideId: id, points: 0 }))
  const allZero = politicianPointsList.every((pp) => pp.points === 0)

  return (
    <div className="flex flex-col gap-2">
      <h3 className={cn('text-sm font-semibold', isUser ? 'text-primary' : 'text-muted-foreground')}>
        {label}
        {isUser && (
          <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded bg-primary/20 text-primary border border-primary/30">
            You
          </span>
        )}
      </h3>

      <div>
        {politicianPointsList.map(({ bioguideId, points }) => (
          <PoliticianRow
            key={bioguideId}
            bioguideId={bioguideId}
            points={points}
            isMvp={weekResult?.mvpBioguideId === bioguideId}
            politician={politicians.get(bioguideId)}
            trades={trades}
          />
        ))}
      </div>

      {allZero && (
        <p className="text-xs text-muted-foreground italic text-center py-2">
          No trades recorded this week
        </p>
      )}
    </div>
  )
}

export function MatchupScoreboard({
  matchup,
  userTeam,
  opponentTeam,
  userWeekResult,
  opponentWeekResult,
  politicians,
  trades,
}: MatchupScoreboardProps) {
  const userScore = userWeekResult?.points ?? (matchup?.homeTeamId === userTeam.id ? matchup?.homeScore : matchup?.awayScore) ?? 0
  const opponentScore = opponentWeekResult?.points ?? (matchup?.homeTeamId !== userTeam.id ? matchup?.homeScore : matchup?.awayScore) ?? 0

  const isCompleted = matchup?.completed ?? false

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden" data-alva-skill="getSenatorTrades">
      {/* Score header */}
      <div className="px-6 py-4 border-b border-border bg-muted/20">
        <div className="flex items-center justify-center gap-4">
          <div className="text-right flex-1 min-w-0">
            <p className="font-bold text-lg truncate">{userTeam.name}</p>
            <DigitFlipCounter value={Math.round(userScore * 10) / 10} className="text-3xl font-black text-primary tabular-nums" />
          </div>

          <div className="text-center shrink-0 px-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {isCompleted ? 'FINAL' : 'In Progress'}
            </p>
            <p className="text-lg font-bold text-muted-foreground">vs</p>
          </div>

          <div className="text-left flex-1 min-w-0">
            <p className="font-bold text-lg truncate">{opponentTeam?.name ?? 'No opponent'}</p>
            <DigitFlipCounter value={Math.round(opponentScore * 10) / 10} className="text-3xl font-black text-muted-foreground tabular-nums" />
          </div>
        </div>
      </div>

      {/* Roster columns */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        <TeamColumn
          label="Your Team"
          team={userTeam}
          weekResult={userWeekResult}
          politicians={politicians}
          trades={trades}
          isUser
        />
        <TeamColumn
          label={opponentTeam?.name ?? 'Opponent'}
          team={opponentTeam}
          weekResult={opponentWeekResult}
          politicians={politicians}
          trades={trades}
        />
      </div>
    </div>
  )
}
