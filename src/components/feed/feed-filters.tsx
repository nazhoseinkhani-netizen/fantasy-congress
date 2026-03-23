'use client'

import { cn } from '@/lib/utils'
import type { Party, Chamber } from '@/types/politician'
import type { TradeType } from '@/types/trade'

export interface FeedFilterState {
  party: Party | null
  chamber: Chamber | null
  tradeType: TradeType | null
  pointsImpact: 'positive' | 'negative' | null
  timePeriod: 'week' | 'month' | 'quarter' | 'all'
  rosterOnly: boolean
}

export const DEFAULT_FEED_FILTERS: FeedFilterState = {
  party: null,
  chamber: null,
  tradeType: null,
  pointsImpact: null,
  timePeriod: 'all',
  rosterOnly: false,
}

interface FeedFiltersProps {
  filters: FeedFilterState
  onFilterChange: (f: FeedFilterState) => void
  resultCount: number
  totalCount: number
}

function ToggleGroup<T extends string>({
  options,
  value,
  onChange,
  getLabel,
  getColor,
}: {
  options: (T | null)[]
  value: T | null
  onChange: (v: T | null) => void
  getLabel: (v: T | null) => string
  getColor?: (v: T | null) => string
}) {
  return (
    <div className="flex items-center gap-1">
      {options.map((option, i) => {
        const isActive = value === option
        const color = getColor ? getColor(option) : undefined
        return (
          <button
            key={i}
            onClick={() => onChange(isActive ? null : option)}
            className={cn(
              'px-2.5 py-1 text-xs font-medium rounded transition-colors',
              isActive
                ? 'bg-foreground/10 text-foreground ring-1 ring-foreground/20'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            )}
            style={isActive && color ? { color, borderColor: color } : undefined}
          >
            {getLabel(option)}
          </button>
        )
      })}
    </div>
  )
}

export function FeedFilters({ filters, onFilterChange, resultCount, totalCount }: FeedFiltersProps) {
  function update(patch: Partial<FeedFilterState>) {
    onFilterChange({ ...filters, ...patch })
  }

  return (
    <div className="bg-card rounded-xl ring-1 ring-foreground/10 p-3 space-y-3">
      {/* Row 1: Party, Chamber, Trade Type, Points Impact */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 items-center">
        {/* Party */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium">Party</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => update({ party: null })}
              className={cn(
                'px-2.5 py-1 text-xs font-medium rounded transition-colors',
                filters.party === null
                  ? 'bg-foreground/10 text-foreground ring-1 ring-foreground/20'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              All
            </button>
            {(['D', 'R', 'I'] as Party[]).map((party) => {
              const colorMap: Record<Party, string> = {
                D: 'var(--party-dem)',
                R: 'var(--party-rep)',
                I: 'var(--party-ind)',
              }
              const isActive = filters.party === party
              return (
                <button
                  key={party}
                  onClick={() => update({ party: isActive ? null : party })}
                  className={cn(
                    'px-2.5 py-1 text-xs font-bold rounded transition-colors',
                    isActive
                      ? 'ring-1'
                      : 'text-muted-foreground hover:bg-muted/50'
                  )}
                  style={isActive ? {
                    color: colorMap[party],
                    backgroundColor: `color-mix(in oklch, ${colorMap[party]} 15%, transparent)`,
                    borderColor: `color-mix(in oklch, ${colorMap[party]} 40%, transparent)`,
                  } : { color: colorMap[party] }}
                >
                  {party}
                </button>
              )
            })}
          </div>
        </div>

        {/* Chamber */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium">Chamber</span>
          <ToggleGroup<Chamber>
            options={[null, 'senate', 'house']}
            value={filters.chamber}
            onChange={(v) => update({ chamber: v })}
            getLabel={(v) => v === null ? 'All' : v === 'senate' ? 'Senate' : 'House'}
          />
        </div>

        {/* Trade Type */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium">Type</span>
          <ToggleGroup<TradeType>
            options={[null, 'buy', 'sell']}
            value={filters.tradeType}
            onChange={(v) => update({ tradeType: v })}
            getLabel={(v) => v === null ? 'All' : v === 'buy' ? 'Buy' : 'Sell'}
          />
        </div>

        {/* Points Impact */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium">Points</span>
          <ToggleGroup<'positive' | 'negative'>
            options={[null, 'positive', 'negative']}
            value={filters.pointsImpact}
            onChange={(v) => update({ pointsImpact: v })}
            getLabel={(v) => v === null ? 'All' : v === 'positive' ? 'Positive' : 'Negative'}
          />
        </div>
      </div>

      {/* Row 2: Time Period + My Roster Only + Result Count */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 items-center">
        {/* Time Period */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium">Period</span>
          <select
            value={filters.timePeriod}
            onChange={(e) => update({ timePeriod: e.target.value as FeedFilterState['timePeriod'] })}
            className="text-xs bg-muted/50 text-foreground border border-border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="all">All Time</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
          </select>
        </div>

        {/* My Roster Only toggle */}
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <button
              role="switch"
              aria-checked={filters.rosterOnly}
              onClick={() => update({ rosterOnly: !filters.rosterOnly })}
              className={cn(
                'relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                filters.rosterOnly ? 'bg-primary' : 'bg-muted'
              )}
            >
              <span
                className={cn(
                  'inline-block size-3.5 rounded-full bg-white shadow-sm transition-transform',
                  filters.rosterOnly ? 'translate-x-4' : 'translate-x-0.5'
                )}
              />
            </button>
            <span className="text-xs font-medium text-muted-foreground">
              My Roster Only
            </span>
          </label>
        </div>

        {/* Result count */}
        <div className="ml-auto text-xs text-muted-foreground">
          Showing <span className="font-medium text-foreground">{resultCount}</span> of{' '}
          <span className="font-medium text-foreground">{totalCount}</span> trades
        </div>
      </div>
    </div>
  )
}
