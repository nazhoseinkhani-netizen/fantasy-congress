'use client'

import Link from 'next/link'
import type { Politician } from '@/types/politician'
import { PoliticianCard } from '@/components/design/politician-card'

interface TrendingSidebarProps {
  politicians: Politician[]
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-2">
      {children}
    </h3>
  )
}

function TrendingSection({
  title,
  politicians,
}: {
  title: string
  politicians: Politician[]
}) {
  return (
    <div>
      <SectionHeading>{title}</SectionHeading>
      <div className="space-y-1">
        {politicians.map((p) => (
          <Link key={p.bioguideId} href={`/politicians/${p.bioguideId}`} className="block">
            <PoliticianCard politician={p} variant="mini" />
          </Link>
        ))}
      </div>
    </div>
  )
}

export function TrendingSidebar({ politicians }: TrendingSidebarProps) {
  // Top by Points This Week: sort by last element of weeklyPoints descending
  const topByPoints = [...politicians]
    .sort((a, b) => {
      const aLast = a.weeklyPoints[a.weeklyPoints.length - 1] ?? 0
      const bLast = b.weeklyPoints[b.weeklyPoints.length - 1] ?? 0
      return bLast - aLast
    })
    .slice(0, 5)

  // Top by Volume: sort by tradeCount descending
  const topByVolume = [...politicians]
    .sort((a, b) => b.tradeCount - a.tradeCount)
    .slice(0, 5)

  // Hot Waiver Wire: bench or sleeper salary tiers, sorted by seasonPoints
  const waiverWire = [...politicians]
    .filter((p) => p.salaryTier === 'bench' || p.salaryTier === 'sleeper')
    .sort((a, b) => b.seasonPoints - a.seasonPoints)
    .slice(0, 5)

  return (
    <div className="bg-card rounded-xl ring-1 ring-foreground/10 p-4 space-y-6">
      <TrendingSection title="Top by Points This Week" politicians={topByPoints} />
      <div className="border-t border-border" />
      <TrendingSection title="Top by Volume" politicians={topByVolume} />
      <div className="border-t border-border" />
      <TrendingSection title="Hot Waiver Wire" politicians={waiverWire} />
    </div>
  )
}
