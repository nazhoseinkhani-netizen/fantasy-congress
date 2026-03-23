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

interface PoliticianProfileClientProps {
  bioguideId: string
}

function ProfileSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-48 bg-muted rounded-lg" />
      <div className="h-10 bg-muted rounded-lg w-3/4" />
      <div className="h-64 bg-muted rounded-lg" />
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
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <p className="text-lg font-medium">Politician not found</p>
        <p className="text-sm mt-1">No data available for ID: {bioguideId}</p>
      </div>
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
