'use client'

import { useState, useEffect } from 'react'
import type { Politician, Trade } from '@/types'
import { loadPoliticianById } from '@/lib/data/politicians'
import { loadTradesForPolitician } from '@/lib/data/trades'
import { ProfileHero } from './profile-hero'
import { FantasyStatsTab } from './fantasy-stats-tab'
import { TradingProfileTab } from './trading-profile-tab'
import { CorruptionDossierTab } from './corruption-dossier-tab'
import { NewsDisclosuresTab } from './news-disclosures-tab'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { MetricTooltip } from '@/components/ui/metric-tooltip'

interface PoliticianProfileClientProps {
  bioguideId: string
}

function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      {/* Hero skeleton */}
      <div className="flex gap-4 items-start">
        <Skeleton className="size-24 rounded-full shrink-0" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
          <div className="flex gap-4 mt-4">
            <Skeleton className="h-16 w-24" />
            <Skeleton className="h-16 w-24" />
            <Skeleton className="h-16 w-24" />
            <Skeleton className="h-16 w-24" />
          </div>
        </div>
      </div>
      {/* Tabs skeleton */}
      <Skeleton className="h-10 w-full rounded-lg" />
      {/* Tab content skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-64 w-full rounded-lg" />
        <Skeleton className="h-32 w-full rounded-lg" />
      </div>
    </div>
  )
}

export function PoliticianProfileClient({ bioguideId }: PoliticianProfileClientProps) {
  const [politician, setPolitician] = useState<Politician | null>(null)
  const [trades, setTrades] = useState<Trade[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const [p, t] = await Promise.all([
          loadPoliticianById(bioguideId),
          loadTradesForPolitician(bioguideId),
        ])
        if (!cancelled) {
          setPolitician(p ?? null)
          setTrades(t)
          setLoading(false)
        }
      } catch {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [bioguideId])

  if (loading) return <ProfileSkeleton />

  if (!politician) {
    return (
      <EmptyState
        heading="Politician not found"
        description="This politician may not be in our database. Try browsing the directory."
      />
    )
  }

  return (
    <div className="space-y-6">
      <ProfileHero politician={politician} />

      <Tabs defaultValue="fantasy-stats" className="mt-6">
        <TabsList className="w-full overflow-x-auto flex">
          <TabsTrigger value="fantasy-stats">Fantasy Stats</TabsTrigger>
          <TabsTrigger value="trading-profile">Trading Profile</TabsTrigger>
          <TabsTrigger value="corruption-dossier">Corruption Dossier</TabsTrigger>
          <TabsTrigger value="news-disclosures">News &amp; Disclosures</TabsTrigger>
        </TabsList>

        <TabsContent value="fantasy-stats">
          <FantasyStatsTab politician={politician} trades={trades} />
        </TabsContent>

        <TabsContent value="trading-profile">
          <TradingProfileTab politician={politician} trades={trades} />
        </TabsContent>

        <TabsContent value="corruption-dossier">
          <CorruptionDossierTab politician={politician} trades={trades} />
        </TabsContent>

        <TabsContent value="news-disclosures">
          <NewsDisclosuresTab politician={politician} trades={trades} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
