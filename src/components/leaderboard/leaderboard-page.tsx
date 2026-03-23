'use client'

import { useState, useEffect } from 'react'
import { loadPoliticians, loadDemoState } from '@/lib/data'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Podium } from './podium'
import { ShameTable } from './shame-table'
import { SwampLordsTable } from './swamp-lords-table'
import { EmptyState } from '@/components/ui/empty-state'
import { MetricTooltip } from '@/components/ui/metric-tooltip'
import type { Politician, DemoState } from '@/types'

// Trophy icon
function TrophyIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  )
}

// Shield icon
function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}

// Skeleton loading components
function SkeletonPodium() {
  return (
    <div className="flex flex-col md:flex-row gap-3 mb-6">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex-1 h-48 rounded-xl bg-muted/50 animate-pulse"
        />
      ))}
    </div>
  )
}

function SkeletonTable() {
  return (
    <div className="rounded-xl border border-border overflow-hidden">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="h-14 border-b border-border/50 bg-muted/20 animate-pulse"
        />
      ))}
    </div>
  )
}

export function LeaderboardPage() {
  const [politicians, setPoliticians] = useState<Politician[]>([])
  const [demoState, setDemoState] = useState<DemoState | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [politiciansData, demoData] = await Promise.all([
          loadPoliticians(),
          loadDemoState(),
        ])
        setPoliticians(politiciansData)
        setDemoState(demoData)
      } catch (error) {
        console.error('Failed to load leaderboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Sort by fantasy points descending
  const byFantasyPoints = [...politicians].sort((a, b) => b.seasonPoints - a.seasonPoints)
  const fantasyTop3 = byFantasyPoints.slice(0, 3)
  const fantasyRemaining = byFantasyPoints.slice(3)

  // Sort by risk score descending
  const byRiskScore = [...politicians].sort((a, b) => b.insiderRiskScore - a.insiderRiskScore)
  const riskTop3 = byRiskScore.slice(0, 3)
  const riskRemaining = byRiskScore.slice(3)

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <TrophyIcon className="size-8 text-primary" />
          Hall of Shame
        </h1>
        <p className="mt-2 text-muted-foreground max-w-xl">
          The definitive ranking of Congressional stock traders. Ranked by fantasy points earned from their trades — the best returns win.
        </p>
      </div>

      {/* Main tabs */}
      <Tabs defaultValue="fantasy">
        <TabsList>
          <TabsTrigger value="fantasy">
            <MetricTooltip metric="seasonPoints">Fantasy Points</MetricTooltip>
          </TabsTrigger>
          <TabsTrigger value="risk">
            <MetricTooltip metric="insiderRiskScore">Risk Score</MetricTooltip>
          </TabsTrigger>
        </TabsList>

        {/* Fantasy Points tab */}
        <TabsContent value="fantasy" className="mt-6">
          {loading ? (
            <>
              <SkeletonPodium />
              <SkeletonTable />
            </>
          ) : politicians.length === 0 ? (
            <EmptyState
              heading="No leaderboard data"
              description="Politician data is not yet available. Check back soon."
            />
          ) : (
            <>
              <Podium politicians={fantasyTop3} rankBy="seasonPoints" />
              <ShameTable politicians={fantasyRemaining} rankBy="seasonPoints" startRank={4} />
            </>
          )}
        </TabsContent>

        {/* Risk Score tab */}
        <TabsContent value="risk" className="mt-6">
          {loading ? (
            <>
              <SkeletonPodium />
              <SkeletonTable />
            </>
          ) : politicians.length === 0 ? (
            <EmptyState
              heading="No leaderboard data"
              description="Politician data is not yet available. Check back soon."
            />
          ) : (
            <>
              <Podium politicians={riskTop3} rankBy="insiderRiskScore" />
              <ShameTable politicians={riskRemaining} rankBy="insiderRiskScore" startRank={4} />
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Swamp Lords section */}
      <section>
        <div className="mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <ShieldIcon className="size-6 text-primary" />
            Swamp Lords
          </h2>
          <p className="mt-1 text-muted-foreground">
            Fantasy manager rankings from your league
          </p>
        </div>
        {loading || !demoState ? (
          <SkeletonTable />
        ) : (
          <SwampLordsTable demoState={demoState} />
        )}
      </section>
    </div>
  )
}
