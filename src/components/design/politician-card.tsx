'use client'

import { cn } from '@/lib/utils'
import type { Politician } from '@/types'
import { RiskBadge } from './risk-badge'
import { StatCell } from './stat-cell'
import { Card, CardContent } from '@/components/ui/card'

interface PoliticianCardProps {
  politician: Politician
  variant?: 'full' | 'compact' | 'mini'
  onClick?: () => void
  className?: string
}

const partyColorVars: Record<string, string> = {
  D: 'var(--party-dem)',
  R: 'var(--party-rep)',
  I: 'var(--party-ind)',
}

const partyLabels: Record<string, string> = {
  D: 'D',
  R: 'R',
  I: 'I',
}

function PoliticianPhoto({
  photoUrl,
  name,
  size,
}: {
  photoUrl: string
  name: string
  size: 'sm' | 'md' | 'lg'
}) {
  const sizeClass = {
    sm: 'size-8',
    md: 'size-14',
    lg: 'size-16',
  }[size]

  return (
    <div className={cn('relative shrink-0 overflow-hidden rounded-full bg-muted', sizeClass)}>
      <img
        src={photoUrl}
        alt={name}
        loading="lazy"
        className="size-full object-cover object-center"
        onError={(e) => {
          const target = e.target as HTMLImageElement
          target.style.display = 'none'
        }}
      />
    </div>
  )
}

export function PoliticianCard({
  politician,
  variant = 'full',
  onClick,
  className,
}: PoliticianCardProps) {
  const partyColor = partyColorVars[politician.party] ?? partyColorVars['I']
  const partyLabel = partyLabels[politician.party] ?? 'I'

  if (variant === 'mini') {
    return (
      <div
        onClick={onClick}
        className={cn(
          'flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer',
          className
        )}
      >
        <PoliticianPhoto photoUrl={politician.photoUrl} name={politician.name} size="sm" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{politician.name}</p>
          <p className="text-xs text-muted-foreground">
            <span style={{ color: partyColor }} className="font-semibold">{partyLabel}</span> &middot; {politician.state}
          </p>
        </div>
        <StatCell
          label="PTS"
          value={politician.seasonPoints}
          format="points"
          size="sm"
          className="shrink-0 items-end"
        />
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <Card
        onClick={onClick}
        className={cn(
          'relative overflow-hidden transition-all hover:scale-[1.02] hover:shadow-lg cursor-pointer',
          onClick && 'cursor-pointer',
          className
        )}
        style={{
          borderLeft: `3px solid ${partyColor}`,
        }}
      >
        <CardContent className="flex items-center gap-3 py-3">
          <PoliticianPhoto photoUrl={politician.photoUrl} name={politician.name} size="md" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="font-semibold text-sm truncate">{politician.name}</span>
              <span
                className="text-xs font-bold px-1.5 py-0.5 rounded shrink-0"
                style={{ color: partyColor }}
              >
                {partyLabel}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mb-1.5">
              {politician.chamber === 'senate' ? 'Sen.' : 'Rep.'} &middot; {politician.state}
            </p>
            <RiskBadge
              tier={politician.insiderRiskTier}
              score={politician.insiderRiskScore}
              size="sm"
            />
          </div>
          <StatCell
            label="Season"
            value={politician.seasonPoints}
            format="points"
            size="sm"
            className="shrink-0 items-end"
          />
        </CardContent>
      </Card>
    )
  }

  // 'full' variant (default)
  return (
    <Card
      onClick={onClick}
      className={cn(
        'relative overflow-hidden transition-all hover:scale-[1.02] hover:shadow-xl hover:ring-primary/20',
        onClick && 'cursor-pointer',
        className
      )}
      style={{
        borderLeft: `4px solid ${partyColor}`,
      }}
    >
      <CardContent className="p-4">
        {/* Top section: photo + info */}
        <div className="flex gap-4 mb-4">
          <PoliticianPhoto photoUrl={politician.photoUrl} name={politician.name} size="lg" />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-bold text-base leading-tight truncate">
                  {politician.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {politician.chamber === 'senate' ? 'Senator' : 'Representative'} &middot;{' '}
                  <span style={{ color: partyColor }} className="font-medium">
                    {partyLabel === 'D' ? 'Democrat' : partyLabel === 'R' ? 'Republican' : 'Independent'}
                  </span>{' '}
                  &middot; {politician.state}
                </p>
              </div>
              <span
                className="shrink-0 text-sm font-bold px-2 py-0.5 rounded border"
                style={{
                  color: partyColor,
                  borderColor: `color-mix(in oklch, ${partyColor} 40%, transparent)`,
                  backgroundColor: `color-mix(in oklch, ${partyColor} 15%, transparent)`,
                }}
              >
                {partyLabel}
              </span>
            </div>

            {/* Salary cap badge */}
            <div className="mt-2">
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">${politician.salaryCap.toLocaleString()}</span>
                <span>salary cap</span>
              </span>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-4 mb-4 pb-4 border-b border-border">
          <StatCell
            label="Season Pts"
            value={politician.seasonPoints}
            format="points"
            trend="up"
          />
          <StatCell
            label="Win Rate"
            value={Math.round(politician.winRate * 100)}
            format="percent"
            trend={politician.winRate >= 0.5 ? 'up' : 'down'}
          />
          <StatCell
            label="Avg Return"
            value={politician.avgReturn.toFixed(1)}
            format="percent"
            trend={politician.avgReturn > 0 ? 'up' : politician.avgReturn < 0 ? 'down' : 'neutral'}
          />
          <StatCell
            label="Trades"
            value={politician.tradeCount}
            format="number"
          />
        </div>

        {/* Risk badge */}
        <RiskBadge
          tier={politician.insiderRiskTier}
          score={politician.insiderRiskScore}
          size="sm"
        />
      </CardContent>
    </Card>
  )
}
