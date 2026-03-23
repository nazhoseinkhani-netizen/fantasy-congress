'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { Politician, InsiderRiskTier } from '@/types'

interface ShameTableProps {
  politicians: Politician[]
  rankBy: 'seasonPoints' | 'insiderRiskScore'
  startRank: number
}

import { PARTY_COLORS } from '@/lib/party-colors'

const tierColorVars: Record<InsiderRiskTier, string> = {
  'clean-record': '#4AAF6E',
  'minor-concerns': '#B8A846',
  'raised-eyebrows': '#C9944A',
  'seriously-suspicious': '#D46A3A',
  'peak-swamp': '#D94A4A',
}

function FeatureCard({
  politician,
  rank,
  rankBy,
  variant,
}: {
  politician: Politician
  rank: number
  rankBy: 'seasonPoints' | 'insiderRiskScore'
  variant: 'swampiest' | 'cleanest'
}) {
  const tierColor = tierColorVars[politician.insiderRiskTier]
  const bgTint = variant === 'swampiest'
    ? '#D94A4A1A'
    : '#4AAF6E1A'
  const borderTint = variant === 'swampiest'
    ? '#D94A4A4D'
    : '#4AAF6E4D'

  return (
    <Link
      href={`/politicians/${politician.bioguideId}`}
      className="flex items-center gap-3 p-3 rounded-lg border transition-all hover:scale-[1.01]"
      style={{ backgroundColor: bgTint, borderColor: borderTint }}
    >
      <span className="text-sm font-bold text-muted-foreground w-6 shrink-0">#{rank}</span>
      <div
        className="size-8 rounded-full overflow-hidden bg-muted shrink-0"
        style={{ border: `2px solid ${tierColor}` }}
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
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate">{politician.name}</p>
        <p className="text-xs text-muted-foreground">
          <span style={{ color: PARTY_COLORS[politician.party] ?? PARTY_COLORS['I'] }} className="font-semibold">{politician.party}</span> &middot; {politician.state}
        </p>
      </div>
      <span
        className="inline-flex items-center justify-center min-w-[2rem] px-1.5 py-0.5 rounded text-xs font-bold tabular-nums shrink-0"
        style={{
          color: tierColor,
          backgroundColor: `${tierColor}26`,
        }}
      >
        {politician.insiderRiskScore}
      </span>
    </Link>
  )
}

export function ShameTable({ politicians, rankBy, startRank }: ShameTableProps) {
  if (politicians.length === 0) return null

  // Sort by rankBy descending (already sorted by parent, but re-sort for safety)
  const sortedPoliticians = [...politicians]

  // For insiderRiskScore: find top 5 "swampiest" and bottom 5 "cleanest"
  const allSorted = rankBy === 'insiderRiskScore'
    ? [...politicians].sort((a, b) => b.insiderRiskScore - a.insiderRiskScore)
    : null

  const swampiestTop5 = allSorted?.slice(0, 5) ?? []
  const cleanestBottom5 = allSorted
    ? [...politicians].sort((a, b) => a.insiderRiskScore - b.insiderRiskScore).slice(0, 5)
    : []

  return (
    <div className="space-y-6">
      {/* Swampiest featured section — only for risk score ranking */}
      {rankBy === 'insiderRiskScore' && swampiestTop5.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: '#D94A4A' }}
            />
            Swampiest
          </h3>
          <div className="space-y-2">
            {swampiestTop5.map((politician, index) => (
              <FeatureCard
                key={politician.bioguideId}
                politician={politician}
                rank={index + 1}
                rankBy={rankBy}
                variant="swampiest"
              />
            ))}
          </div>
        </div>
      )}

      {/* Main ranked table */}
      <div className="rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground w-12">#</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Politician</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden sm:table-cell">Party</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">State</th>
                <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Season Pts</th>
                <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden lg:table-cell">Win Rate</th>
                <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden lg:table-cell">Avg Return</th>
                <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Trades</th>
                <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Risk</th>
              </tr>
            </thead>
            <tbody>
              {sortedPoliticians.map((politician, index) => {
                const rank = startRank + index
                const partyColor = PARTY_COLORS[politician.party] ?? PARTY_COLORS['I']
                const tierColor = tierColorVars[politician.insiderRiskTier]
                const isOdd = index % 2 === 0

                return (
                  <tr
                    key={politician.bioguideId}
                    className={cn(
                      'border-b border-border/50 transition-colors hover:bg-muted/20 cursor-pointer',
                      isOdd && 'bg-muted/30'
                    )}
                    style={
                      rankBy === 'insiderRiskScore'
                        ? { borderLeft: `3px solid ${tierColor}` }
                        : {}
                    }
                  >
                    {/* Rank */}
                    <td className="px-4 py-3">
                      <Link href={`/politicians/${politician.bioguideId}`} className="block">
                        <span className="font-bold text-muted-foreground">#{rank}</span>
                      </Link>
                    </td>

                    {/* Name + Photo */}
                    <td className="px-4 py-3">
                      <Link href={`/politicians/${politician.bioguideId}`} className="flex items-center gap-3">
                        <div className="size-8 rounded-full overflow-hidden bg-muted shrink-0">
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
                        <span className="font-medium hover:text-primary transition-colors truncate max-w-[140px]">
                          {politician.name}
                        </span>
                      </Link>
                    </td>

                    {/* Party */}
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <Link href={`/politicians/${politician.bioguideId}`} className="block">
                        <span
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border"
                          style={{
                            color: partyColor,
                            borderColor: `${partyColor}66`,
                            backgroundColor: `${partyColor}26`,
                          }}
                        >
                          {politician.party}
                        </span>
                      </Link>
                    </td>

                    {/* State */}
                    <td className="px-4 py-3 hidden md:table-cell">
                      <Link href={`/politicians/${politician.bioguideId}`} className="block text-muted-foreground">
                        {politician.state}
                      </Link>
                    </td>

                    {/* Season Points */}
                    <td className="px-4 py-3 text-right">
                      <Link href={`/politicians/${politician.bioguideId}`} className="block">
                        <span className="font-bold tabular-nums">{politician.seasonPoints}</span>
                        <span className="text-xs text-muted-foreground ml-1">pts</span>
                      </Link>
                    </td>

                    {/* Win Rate */}
                    <td className="px-4 py-3 text-right hidden lg:table-cell">
                      <Link href={`/politicians/${politician.bioguideId}`} className="block text-muted-foreground tabular-nums">
                        {Math.round(politician.winRate * 100)}%
                      </Link>
                    </td>

                    {/* Avg Return */}
                    <td className="px-4 py-3 text-right hidden lg:table-cell">
                      <Link
                        href={`/politicians/${politician.bioguideId}`}
                        className={cn(
                          'block tabular-nums font-medium',
                          politician.avgReturn > 0 ? 'text-emerald-500' : 'text-red-500'
                        )}
                      >
                        {politician.avgReturn > 0 ? '+' : ''}
                        {politician.avgReturn.toFixed(1)}%
                      </Link>
                    </td>

                    {/* Trades */}
                    <td className="px-4 py-3 text-right hidden md:table-cell">
                      <Link href={`/politicians/${politician.bioguideId}`} className="block text-muted-foreground tabular-nums">
                        {politician.tradeCount}
                      </Link>
                    </td>

                    {/* Risk Score */}
                    <td className="px-4 py-3 text-right">
                      <Link href={`/politicians/${politician.bioguideId}`} className="block">
                        <span
                          className="inline-flex items-center justify-center min-w-[2rem] px-1.5 py-0.5 rounded text-xs font-bold tabular-nums"
                          style={{
                            color: tierColor,
                            backgroundColor: `${tierColor}26`,
                          }}
                        >
                          {politician.insiderRiskScore}
                        </span>
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cleanest featured section — only for risk score ranking */}
      {rankBy === 'insiderRiskScore' && cleanestBottom5.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: '#4AAF6E' }}
            />
            Cleanest
          </h3>
          <div className="space-y-2">
            {cleanestBottom5.map((politician, index) => (
              <FeatureCard
                key={politician.bioguideId}
                politician={politician}
                rank={index + 1}
                rankBy={rankBy}
                variant="cleanest"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
