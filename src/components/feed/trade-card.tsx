'use client'

import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import type { Trade } from '@/types/trade'
import type { Party } from '@/types/politician'

interface TradeCardProps {
  trade: Trade
  politicianPhotoUrl?: string
}

const partyColorVars: Record<Party, string> = {
  D: 'var(--party-dem)',
  R: 'var(--party-rep)',
  I: 'var(--party-ind)',
}

const partyLabels: Record<Party, string> = {
  D: 'D',
  R: 'R',
  I: 'I',
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function BonusBadge({ type }: { type: string }) {
  const badgeMap: Record<string, { label: string; color: string }> = {
    bigMover: { label: 'Big Mover', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30' },
    bipartisanBet: { label: 'Bipartisan', color: 'text-blue-400 bg-blue-400/10 border-blue-400/30' },
    donorDarling: { label: 'Donor Darling', color: 'text-green-400 bg-green-400/10 border-green-400/30' },
  }

  const badge = badgeMap[type]
  if (!badge) {
    // Generic bonus badge
    return (
      <span className="inline-flex items-center px-1.5 py-0.5 text-xs font-medium rounded border text-yellow-400 bg-yellow-400/10 border-yellow-400/30">
        {type}
      </span>
    )
  }

  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 text-xs font-medium rounded border ${badge.color}`}>
      {badge.label}
    </span>
  )
}

function PenaltyBadge({ type }: { type: string }) {
  const labelMap: Record<string, string> = {
    lateDisclosure: 'Late Disclosure',
    paperHands: 'Paper Hands',
  }
  const label = labelMap[type] ?? type

  return (
    <span className="inline-flex items-center px-1.5 py-0.5 text-xs font-medium rounded border text-red-400 bg-red-400/10 border-red-400/30">
      {label}
    </span>
  )
}

export function TradeCard({ trade, politicianPhotoUrl }: TradeCardProps) {
  const partyColor = partyColorVars[trade.party] ?? partyColorVars['I']
  const partyLabel = partyLabels[trade.party] ?? 'I'

  const returnPositive = trade.returnVsSP500 >= 0
  const returnColor = returnPositive ? 'text-green-400' : 'text-red-400'
  const returnPrefix = returnPositive ? '+' : ''

  const pointsGold = trade.fantasyPoints > 50
  const pointsColor = pointsGold ? 'text-[var(--gold)]' : 'text-foreground'

  const relativeTime = formatDistanceToNow(new Date(trade.disclosureDate), { addSuffix: true })

  const chamberLabel = trade.chamber === 'senate' ? 'Senate' : 'House'

  return (
    <div
      className="bg-card rounded-xl ring-1 ring-foreground/10 p-4 hover:ring-foreground/20 transition-all"
      style={{ borderLeft: `3px solid ${partyColor}` }}
    >
      <div className="flex gap-3">
        {/* Left column: photo */}
        <div className="shrink-0">
          {politicianPhotoUrl ? (
            <img
              src={politicianPhotoUrl}
              alt={trade.politicianName}
              className="size-10 rounded-full object-cover object-center bg-muted"
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                const fallback = target.nextElementSibling as HTMLElement
                if (fallback) fallback.style.display = 'flex'
              }}
            />
          ) : null}
          <div
            className="size-10 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground"
            style={{ display: politicianPhotoUrl ? 'none' : 'flex' }}
          >
            {getInitials(trade.politicianName)}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 min-w-0">
          {/* Header row */}
          <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
            <Link
              href={`/politicians/${trade.bioguideId}`}
              className="font-bold text-sm hover:underline truncate"
            >
              {trade.politicianName}
            </Link>
            <span
              className="text-xs font-bold px-1.5 py-0.5 rounded shrink-0"
              style={{
                color: partyColor,
                backgroundColor: `color-mix(in oklch, ${partyColor} 15%, transparent)`,
              }}
            >
              {partyLabel}
            </span>
            <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded shrink-0">
              {chamberLabel}
            </span>
            <span className="text-xs text-muted-foreground ml-auto shrink-0">
              {relativeTime}
            </span>
          </div>

          {/* Trade details */}
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded ${
                trade.tradeType === 'buy'
                  ? 'bg-green-400/10 text-green-400 border border-green-400/30'
                  : 'bg-red-400/10 text-red-400 border border-red-400/30'
              }`}
            >
              {trade.tradeType.toUpperCase()}
            </span>
            <span className="font-mono font-bold text-sm">{trade.ticker}</span>
            <span className="text-sm text-muted-foreground truncate">{trade.company}</span>
            <span className="text-xs text-muted-foreground shrink-0">{trade.amountRange}</span>
          </div>

          {/* Return vs S&P */}
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-sm font-semibold ${returnColor}`}>
              {returnPrefix}{trade.returnVsSP500.toFixed(1)}% vs S&amp;P
            </span>
            <span className="text-xs text-muted-foreground">
              ({returnPrefix}{trade.absoluteReturn.toFixed(1)}% absolute)
            </span>
          </div>

          {/* Footer row: points + badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-sm font-bold ${pointsColor}`}>
              {trade.fantasyPoints > 0 ? '+' : ''}{trade.fantasyPoints} pts
            </span>
            {trade.scoreBreakdown.bonuses.map((bonus, i) => (
              <BonusBadge key={i} type={bonus.type} />
            ))}
            {trade.scoreBreakdown.penalties.map((penalty, i) => (
              <PenaltyBadge key={i} type={penalty.type} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
