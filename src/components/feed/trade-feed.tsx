'use client'

import { useState, useEffect, useMemo } from 'react'
import { loadTrades } from '@/lib/data/trades'
import { loadPoliticians } from '@/lib/data/politicians'
import { loadDemoState } from '@/lib/data/demo'
import type { Trade } from '@/types/trade'
import type { Politician } from '@/types/politician'
import type { DemoState } from '@/types/demo'
import { TradeCard } from './trade-card'
import { FeedFilters, DEFAULT_FEED_FILTERS } from './feed-filters'
import type { FeedFilterState } from './feed-filters'
import { TrendingSidebar } from './trending-sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { MetricTooltip } from '@/components/ui/metric-tooltip'
import { Activity } from 'lucide-react'

const PAGE_SIZE = 50

function TradeCardSkeleton() {
  return (
    <div className="bg-card rounded-xl ring-1 ring-foreground/10 p-4 animate-pulse">
      <div className="flex gap-3">
        <div className="size-10 rounded-full bg-muted shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-muted rounded w-1/3" />
          <div className="h-3 bg-muted rounded w-2/3" />
          <div className="h-3 bg-muted rounded w-1/2" />
          <div className="h-4 bg-muted rounded w-1/4" />
        </div>
      </div>
    </div>
  )
}

function getTimeCutoff(timePeriod: FeedFilterState['timePeriod']): Date | null {
  if (timePeriod === 'all') return null
  const now = new Date()
  switch (timePeriod) {
    case 'week':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    case 'month':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    case 'quarter':
      return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
  }
}

export function TradeFeed() {
  const [trades, setTrades] = useState<Trade[]>([])
  const [politicians, setPoliticians] = useState<Politician[]>([])
  const [demoState, setDemoState] = useState<DemoState | null>(null)
  const [filters, setFilters] = useState<FeedFilterState>(DEFAULT_FEED_FILTERS)
  const [loading, setLoading] = useState(true)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  useEffect(() => {
    async function fetchData() {
      try {
        const [tradesData, politiciansData, demoData] = await Promise.all([
          loadTrades(),
          loadPoliticians(),
          loadDemoState(),
        ])
        setTrades(tradesData)
        setPoliticians(politiciansData)
        setDemoState(demoData)
      } catch (err) {
        console.error('Failed to load feed data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Build politician map for photo lookups
  const politicianMap = useMemo(() => {
    const map = new Map<string, Politician>()
    for (const p of politicians) {
      map.set(p.bioguideId, p)
    }
    return map
  }, [politicians])

  // Get user's roster bioguide IDs
  const rosterIds = useMemo(() => {
    if (!demoState) return new Set<string>()
    const userTeam = demoState.leagues
      .flatMap((l) => l.teams)
      .find((t) => t.id === demoState.userTeamId)
    if (!userTeam) return new Set<string>()
    return new Set([...userTeam.roster.active, ...userTeam.roster.bench])
  }, [demoState])

  // Filter and sort trades
  const filteredTrades = useMemo(() => {
    const cutoff = getTimeCutoff(filters.timePeriod)

    return trades
      .filter((trade) => {
        if (filters.party && trade.party !== filters.party) return false
        if (filters.chamber && trade.chamber !== filters.chamber) return false
        if (filters.tradeType && trade.tradeType !== filters.tradeType) return false
        if (filters.pointsImpact === 'positive' && trade.fantasyPoints <= 0) return false
        if (filters.pointsImpact === 'negative' && trade.fantasyPoints > 0) return false
        if (cutoff && new Date(trade.disclosureDate) < cutoff) return false
        if (filters.rosterOnly && !rosterIds.has(trade.bioguideId)) return false
        return true
      })
      .sort((a, b) => new Date(b.disclosureDate).getTime() - new Date(a.disclosureDate).getTime())
  }, [trades, filters, rosterIds])

  const visibleTrades = filteredTrades.slice(0, visibleCount)

  function handleLoadMore() {
    setVisibleCount((n) => n + PAGE_SIZE)
  }

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [filters])

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Trade Feed</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Congressional stock disclosures — scored and ranked
        </p>
      </div>

      {/* Desktop: 70/30 layout; Mobile: stacked */}
      <div className="flex gap-6">
        {/* Main feed column */}
        <div className="flex-1 lg:w-[70%] min-w-0 space-y-4">
          {/* Filter bar */}
          <FeedFilters
            filters={filters}
            onFilterChange={setFilters}
            resultCount={filteredTrades.length}
            totalCount={trades.length}
          />

          {/* Loading skeletons */}
          {loading && (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <TradeCardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Trade cards */}
          {!loading && (
            <div className="space-y-3">
              {visibleTrades.length === 0 ? (
                <EmptyState
                  icon={<Activity className="size-12" />}
                  heading="No trades match your filters"
                  description="Try broadening your filter criteria to see more trades."
                  action={{ label: 'Clear Filters', onClick: () => setFilters(DEFAULT_FEED_FILTERS) }}
                />
              ) : (
                visibleTrades.map((trade) => (
                  <TradeCard
                    key={trade.id}
                    trade={trade}
                    politicianPhotoUrl={politicianMap.get(trade.bioguideId)?.photoUrl}
                  />
                ))
              )}

              {/* Load More button */}
              {visibleCount < filteredTrades.length && (
                <div className="flex justify-center pt-4">
                  <button
                    onClick={handleLoadMore}
                    className="px-6 py-2 text-sm font-medium bg-muted hover:bg-muted/80 rounded-lg transition-colors"
                  >
                    Load More ({filteredTrades.length - visibleCount} remaining)
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar — hidden on mobile, shown on lg+ */}
        <div className="hidden lg:block lg:w-[30%] shrink-0 self-start sticky top-6">
          {!loading && politicians.length > 0 && (
            <TrendingSidebar politicians={politicians} />
          )}
        </div>
      </div>

      {/* Mobile trending section — shown below feed on small screens */}
      <div className="lg:hidden mt-8">
        {!loading && politicians.length > 0 && (
          <TrendingSidebar politicians={politicians} />
        )}
      </div>
    </div>
  )
}
