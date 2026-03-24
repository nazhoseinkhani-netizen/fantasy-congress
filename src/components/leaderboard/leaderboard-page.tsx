'use client'

import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { loadPoliticians, loadDemoState } from '@/lib/data'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { AnimatedGauge, getTierLabel } from '@/components/animations/animated-gauge'
import { Podium } from './podium'
import { ShameTable } from './shame-table'
import { SwampLordsTable } from './swamp-lords-table'
import { EmptyState } from '@/components/ui/empty-state'
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

  // Average corruption score for Swamp-o-meter
  const avgCorruptionScore = politicians.length > 0
    ? Math.round(politicians.reduce((sum, p) => sum + p.insiderRiskScore, 0) / politicians.length)
    : 0

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
          <TabsTrigger value="fantasy">Fantasy Points</TabsTrigger>
          <TabsTrigger value="risk">Risk Score</TabsTrigger>
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
              {/* Swamp-o-meter */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                className="flex flex-col items-center py-6 mb-6 bg-card rounded-xl border border-border"
              >
                <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                  Congressional Swamp-o-Meter
                </h3>
                <AnimatedGauge
                  score={avgCorruptionScore}
                  size="lg"
                  showLabel
                  labelText="Avg Insider Risk"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Average Insider Trading Risk Score across {politicians.length} members of Congress
                </p>
              </motion.div>

              {/* Per-politician corruption gauge cards — animate on scroll-into-view (ANIM-04) */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  Corruption Rankings
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {byRiskScore.slice(0, 12).map((politician) => (
                    <motion.div
                      key={politician.bioguideId}
                      whileInView={{ opacity: 1 }}
                      initial={{ opacity: 0 }}
                      viewport={{ once: true, amount: 0.5 }}
                      className="flex flex-col items-center gap-2 p-3 rounded-xl border border-border bg-card"
                    >
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
                      <AnimatedGauge
                        score={politician.insiderRiskScore}
                        size="sm"
                        showLabel
                        labelText={getTierLabel(politician.insiderRiskScore)}
                      />
                      <p className="text-xs font-medium text-center truncate w-full leading-tight">
                        {politician.name}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

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
