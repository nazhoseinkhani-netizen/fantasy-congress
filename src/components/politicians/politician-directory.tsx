'use client'

import { useState, useEffect, useMemo } from 'react'
import { LayoutGrid, List, ArrowUpDown, Search } from 'lucide-react'
import { EmptyState } from '@/components/ui/empty-state'
import { MetricTooltip } from '@/components/ui/metric-tooltip'
import type { Politician } from '@/types'
import { loadPoliticians } from '@/lib/data'
import {
  FilterSidebar,
  DEFAULT_FILTERS,
  type FilterState,
  type SortField,
} from './filter-sidebar'
import { PoliticianGrid } from './politician-grid'
import { PoliticianListTable } from './politician-list-table'

const SORT_OPTIONS: { value: SortField; label: string }[] = [
  { value: 'seasonPoints', label: 'Season Points' },
  { value: 'salaryCap', label: 'Fantasy Cost' },
  { value: 'winRate', label: 'Win Rate' },
  { value: 'avgReturn', label: 'Avg Return' },
  { value: 'insiderRiskScore', label: 'Risk Score' },
  { value: 'tradeCount', label: 'Trade Volume' },
]

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-border bg-card p-4 animate-pulse">
      <div className="flex gap-4 mb-4">
        <div className="size-16 rounded-full bg-muted shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-3 bg-muted rounded w-1/2" />
          <div className="h-3 bg-muted rounded w-1/3" />
        </div>
      </div>
      <div className="flex gap-4 mb-4 pb-4 border-b border-border">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex-1 space-y-1">
            <div className="h-3 bg-muted rounded" />
            <div className="h-4 bg-muted rounded" />
          </div>
        ))}
      </div>
      <div className="h-6 bg-muted rounded w-2/3" />
    </div>
  )
}

export function PoliticianDirectory() {
  const [politicians, setPoliticians] = useState<Politician[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)

  useEffect(() => {
    loadPoliticians()
      .then((data) => {
        setPoliticians(data)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  const filteredAndSorted = useMemo(() => {
    let result = [...politicians]

    // Search filter
    if (filters.search) {
      const query = filters.search.toLowerCase()
      result = result.filter((p) => p.name.toLowerCase().includes(query))
    }

    // Party filter
    if (filters.party !== null) {
      result = result.filter((p) => p.party === filters.party)
    }

    // Chamber filter
    if (filters.chamber !== null) {
      result = result.filter((p) => p.chamber === filters.chamber)
    }

    // State filter
    if (filters.state !== null) {
      result = result.filter((p) => p.state === filters.state)
    }

    // Salary tier filter
    if (filters.salaryTier !== null) {
      result = result.filter((p) => p.salaryTier === filters.salaryTier)
    }

    // Risk range filter
    if (filters.riskRange !== null) {
      const [min, max] = filters.riskRange
      result = result.filter(
        (p) => p.insiderRiskScore >= min && p.insiderRiskScore <= max
      )
    }

    // Activity level filter
    if (filters.activityLevel !== null) {
      if (filters.activityLevel === 'high') {
        result = result.filter((p) => p.tradeCount >= 20)
      } else if (filters.activityLevel === 'medium') {
        result = result.filter((p) => p.tradeCount >= 10 && p.tradeCount < 20)
      } else {
        result = result.filter((p) => p.tradeCount < 10)
      }
    }

    // Sort
    result.sort((a, b) => {
      const multiplier = filters.sortDir === 'desc' ? -1 : 1
      const aVal = a[filters.sortBy] as number
      const bVal = b[filters.sortBy] as number
      return (aVal - bVal) * multiplier
    })

    return result
  }, [politicians, filters])

  function handleSortField(field: SortField) {
    setFilters((prev) => {
      if (prev.sortBy === field) {
        return { ...prev, sortDir: prev.sortDir === 'desc' ? 'asc' : 'desc' }
      }
      return { ...prev, sortBy: field, sortDir: 'desc' }
    })
  }

  function toggleSortDir() {
    setFilters((prev) => ({
      ...prev,
      sortDir: prev.sortDir === 'desc' ? 'asc' : 'desc',
    }))
  }

  const totalCount = politicians.length
  const resultCount = filteredAndSorted.length

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Politician Directory</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Browse and filter all {totalCount} politicians by stats, risk, and activity
          </p>
        </div>

        {/* Top controls bar */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          {/* Mobile filter trigger — FilterSidebar renders this internally for lg:hidden */}
          <FilterSidebar
            filters={filters}
            onFilterChange={setFilters}
            politicians={politicians}
            resultCount={resultCount}
          />

          {/* Result count */}
          <span className="text-sm text-muted-foreground hidden lg:block">
            {resultCount === totalCount
              ? `${totalCount} Politicians`
              : `${resultCount} of ${totalCount}`}
          </span>

          <div className="ml-auto flex items-center gap-2">
            {/* Sort field */}
            <select
              value={filters.sortBy}
              onChange={(e) => handleSortField(e.target.value as SortField)}
              className="py-1.5 px-2 text-sm bg-muted border border-border rounded focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} title={opt.label}>
                  {opt.label}
                </option>
              ))}
            </select>

            {/* Sort direction */}
            <button
              onClick={toggleSortDir}
              title={`Sort ${filters.sortDir === 'desc' ? 'ascending' : 'descending'}`}
              className="p-1.5 border border-border rounded bg-muted hover:bg-muted/70 transition-colors"
            >
              <ArrowUpDown className="size-4" />
              <span className="sr-only">
                {filters.sortDir === 'desc' ? 'Sort ascending' : 'Sort descending'}
              </span>
            </button>

            {/* View toggle */}
            <div className="flex border border-border rounded overflow-hidden">
              <button
                onClick={() => setFilters((prev) => ({ ...prev, view: 'grid' }))}
                className={`p-1.5 transition-colors ${
                  filters.view === 'grid'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/70'
                }`}
                title="Grid view"
              >
                <LayoutGrid className="size-4" />
                <span className="sr-only">Grid view</span>
              </button>
              <button
                onClick={() => setFilters((prev) => ({ ...prev, view: 'list' }))}
                className={`p-1.5 transition-colors ${
                  filters.view === 'list'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/70'
                }`}
                title="List view"
              >
                <List className="size-4" />
                <span className="sr-only">List view</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex gap-6">
          {/* Desktop sidebar */}
          <div className="hidden lg:block w-56 shrink-0">
            <FilterSidebar
              filters={filters}
              onFilterChange={setFilters}
              politicians={politicians}
              resultCount={resultCount}
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 9 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : filteredAndSorted.length === 0 ? (
              <EmptyState
                icon={<Search className="size-12" />}
                heading="No politicians found"
                description="Try adjusting your filters or search terms to find politicians."
                action={{ label: 'Clear Filters', onClick: () => setFilters(DEFAULT_FILTERS) }}
              />
            ) : filters.view === 'grid' ? (
              <PoliticianGrid politicians={filteredAndSorted} />
            ) : (
              <PoliticianListTable
                politicians={filteredAndSorted}
                sortBy={filters.sortBy}
                sortDir={filters.sortDir}
                onSort={handleSortField}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
