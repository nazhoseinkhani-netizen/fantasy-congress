'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { Politician } from '@/types'
import { RiskBadge } from '@/components/design/risk-badge'

interface PodiumProps {
  politicians: Politician[]
  rankBy: 'seasonPoints' | 'insiderRiskScore'
}

// Medal colors
const goldColor = 'var(--gold)' // same as var(--color-primary)
const silverColor = 'oklch(0.75 0.01 250)'
const bronzeColor = 'oklch(0.6 0.1 60)'

const partyColorVars: Record<string, string> = {
  D: 'var(--party-dem)',
  R: 'var(--party-rep)',
  I: 'var(--party-ind)',
}

interface PodiumPosition {
  rank: 1 | 2 | 3
  medalColor: string
  medalLabel: string
  heightClass: string
  orderClass: string
}

const positions: PodiumPosition[] = [
  {
    rank: 2,
    medalColor: silverColor,
    medalLabel: '2',
    heightClass: 'pt-4',
    orderClass: 'order-1 md:order-1',
  },
  {
    rank: 1,
    medalColor: goldColor,
    medalLabel: '1',
    heightClass: 'pt-0',
    orderClass: 'order-first md:order-2',
  },
  {
    rank: 3,
    medalColor: bronzeColor,
    medalLabel: '3',
    heightClass: 'pt-8',
    orderClass: 'order-last md:order-3',
  },
]

function PodiumCard({
  politician,
  position,
  rankBy,
}: {
  politician: Politician
  position: PodiumPosition
  rankBy: 'seasonPoints' | 'insiderRiskScore'
}) {
  const partyColor = partyColorVars[politician.party] ?? partyColorVars['I']
  const isFirst = position.rank === 1

  const rankingValue =
    rankBy === 'seasonPoints'
      ? `${politician.seasonPoints} pts`
      : `${politician.insiderRiskScore}`

  return (
    <Link
      href={`/politicians/${politician.bioguideId}`}
      className={cn(
        'flex flex-col items-center gap-2 p-4 rounded-xl border border-border transition-transform hover:scale-105',
        isFirst && 'ring-2 ring-primary/30 bg-primary/5',
        !isFirst && 'bg-card',
        position.heightClass,
        position.orderClass
      )}
    >
      {/* Rank medal */}
      <div
        className="size-9 rounded-full flex items-center justify-center text-base font-bold shrink-0"
        style={{
          backgroundColor: `color-mix(in oklch, ${position.medalColor} 25%, transparent)`,
          color: position.medalColor,
          border: `2px solid ${position.medalColor}`,
        }}
      >
        {position.medalLabel}
      </div>

      {/* Photo */}
      <div
        className="size-20 rounded-full overflow-hidden bg-muted shrink-0"
        style={{
          border: `3px solid ${position.medalColor}`,
        }}
      >
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

      {/* Name and info */}
      <div className="text-center">
        <p className="font-bold text-sm leading-tight">{politician.name}</p>
        <p className="text-xs text-muted-foreground mt-0.5" style={{ color: partyColor }}>
          {politician.party} &middot; {politician.state}
        </p>
      </div>

      {/* Ranking value */}
      <div className="text-center">
        <p
          className="text-2xl font-bold tabular-nums"
          style={rankBy === 'insiderRiskScore' ? { color: `var(--risk-swamp)` } : { color: goldColor }}
        >
          {rankingValue}
        </p>
      </div>

      {/* Risk badge */}
      <RiskBadge
        tier={politician.insiderRiskTier}
        score={politician.insiderRiskScore}
        size="sm"
      />
    </Link>
  )
}

export function Podium({ politicians, rankBy }: PodiumProps) {
  if (politicians.length === 0) return null

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-end gap-3 mb-6">
      {positions.map((position) => {
        const politician = politicians[position.rank - 1]
        if (!politician) return null
        return (
          <div key={position.rank} className={cn('flex-1', position.orderClass)}>
            <PodiumCard politician={politician} position={position} rankBy={rankBy} />
          </div>
        )
      })}
    </div>
  )
}
