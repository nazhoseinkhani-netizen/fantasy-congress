'use client'

import type { Politician } from '@/types'
import { Badge } from '@/components/ui/badge'
import { StatCell } from '@/components/design/stat-cell'
import { RiskBadge } from '@/components/design/risk-badge'

interface ProfileHeroProps {
  politician: Politician
}

const partyColors: Record<string, string> = {
  D: 'var(--color-party-dem)',
  R: 'var(--color-party-rep)',
  I: 'var(--color-party-ind)',
}

const partyLabels: Record<string, string> = {
  D: 'Democrat',
  R: 'Republican',
  I: 'Independent',
}

const chamberLabels: Record<string, string> = {
  senate: 'Senator',
  house: 'Representative',
}

export function ProfileHero({ politician }: ProfileHeroProps) {
  const partyColor = partyColors[politician.party] ?? 'var(--color-foreground)'
  const partyLabel = partyLabels[politician.party] ?? politician.party
  const chamberLabel = chamberLabels[politician.chamber] ?? politician.chamber

  return (
    <div className="relative rounded-lg bg-gradient-to-r from-card to-card/80 p-6 border border-border overflow-hidden">
      <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
        {/* Photo */}
        <div
          className="shrink-0 size-[120px] rounded-full overflow-hidden"
          style={{ border: `3px solid ${partyColor}` }}
        >
          <img
            src={politician.photoUrl}
            alt={politician.name}
            className="size-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex-1 text-center sm:text-left space-y-3">
          <div>
            <h1 className="text-3xl font-bold">{politician.name}</h1>
            <p className="text-base text-muted-foreground mt-0.5">
              {chamberLabel}{' '}
              <span style={{ color: partyColor }}>({politician.party})</span>
              {' - '}
              {politician.state}
            </p>
          </div>

          {/* Committee badges */}
          <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start">
            {politician.committees.length > 0 ? (
              politician.committees.map((committee) => (
                <Badge key={committee} variant="outline" className="text-xs">
                  {committee}
                </Badge>
              ))
            ) : (
              <span className="text-xs text-muted-foreground italic">
                No committee data available
              </span>
            )}
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap gap-6 justify-center sm:justify-start pt-2">
            <StatCell
              label="Fantasy Cost"
              value={`$${politician.salaryCap.toLocaleString()}`}
              size="lg"
            />
            <StatCell
              label="Season Points"
              value={politician.seasonPoints}
              format="points"
              size="lg"
            />
            <StatCell
              label="Win Rate"
              value={`${Math.round(politician.winRate * 100)}%`}
              size="lg"
            />
            <div className="flex flex-col gap-0.5">
              <span className="text-sm text-muted-foreground font-medium uppercase tracking-wide">
                Risk Score
              </span>
              <RiskBadge
                tier={politician.insiderRiskTier}
                score={politician.insiderRiskScore}
                size="lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
