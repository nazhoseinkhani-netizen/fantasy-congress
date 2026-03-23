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
const goldColor = '#C9A84C'
const silverColor = '#A8A8B8'
const bronzeColor = '#B87333'

import { PARTY_COLORS } from '@/lib/party-colors'

interface PodiumPosition {
  rank: 1 | 2 | 3
  medalColor: string
  medalLabel: string
  heightClass: string
  orderClass: string
}

const positions: PodiumPosition[] = [
  {
    rank: 1,
    medalColor: goldColor,
    medalLabel: '1',
    heightClass: '',
    orderClass: 'order-1',
  },
  {
    rank: 2,
    medalColor: silverColor,
    medalLabel: '2',
    heightClass: '',
    orderClass: 'order-2',
  },
  {
    rank: 3,
    medalColor: bronzeColor,
    medalLabel: '3',
    heightClass: '',
    orderClass: 'order-3',
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
  const partyColor = PARTY_COLORS[politician.party] ?? PARTY_COLORS['I']
  const isFirst = position.rank === 1

  const rankingValue =
    rankBy === 'seasonPoints'
      ? `${politician.seasonPoints} pts`
      : `${politician.insiderRiskScore}`

  return (
    <Link
      href={`/politicians/${politician.bioguideId}`}
      className={cn(
        'flex flex-col items-center gap-3 p-5 rounded-xl border transition-transform hover:scale-105',
        !isFirst && 'bg-card border-border',
        position.heightClass,
        position.orderClass
      )}
      style={isFirst ? {
        background: `linear-gradient(135deg, ${goldColor}26 0%, transparent 100%)`,
        borderColor: goldColor,
        boxShadow: `0 0 24px ${goldColor}40`,
      } : undefined}
    >
      {/* Rank medal */}
      <div
        className="size-9 rounded-full flex items-center justify-center text-base font-bold shrink-0"
        style={{
          backgroundColor: `${position.medalColor}40`,
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
        <p className="text-xs text-muted-foreground mt-0.5">
          <span style={{ color: partyColor }} className="font-semibold">{politician.party}</span> &middot; {politician.state}
        </p>
      </div>

      {/* Ranking value */}
      <div className="text-center">
        <p
          className="text-2xl font-bold tabular-nums"
          style={rankBy === 'insiderRiskScore' ? { color: '#D94A4A' } : { color: goldColor }}
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
