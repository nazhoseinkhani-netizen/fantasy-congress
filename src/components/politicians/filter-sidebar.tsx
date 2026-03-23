'use client'

import { useState } from 'react'
import { Search, ChevronDown, ChevronUp, Filter } from 'lucide-react'
import type { Party, Chamber, SalaryTier, InsiderRiskTier } from '@/types'
import type { Politician } from '@/types'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

export type SortField = 'seasonPoints' | 'salaryCap' | 'insiderRiskScore' | 'winRate' | 'avgReturn' | 'tradeCount'
export type SortDir = 'asc' | 'desc'
export type ViewMode = 'grid' | 'list'

export interface FilterState {
  search: string
  party: Party | null
  chamber: Chamber | null
  state: string | null
  salaryTier: SalaryTier | null
  riskRange: [number, number] | null
  activityLevel: 'high' | 'medium' | 'low' | null
  sortBy: SortField
  sortDir: SortDir
  view: ViewMode
}

export const DEFAULT_FILTERS: FilterState = {
  search: '',
  party: null,
  chamber: null,
  state: null,
  salaryTier: null,
  riskRange: null,
  activityLevel: null,
  sortBy: 'seasonPoints',
  sortDir: 'desc',
  view: 'grid',
}

import { PARTY_COLORS } from '@/lib/party-colors'

const riskTierRanges: { label: string; range: [number, number]; tier: InsiderRiskTier }[] = [
  { label: 'Clean', range: [0, 14], tier: 'clean-record' },
  { label: 'Minor', range: [15, 34], tier: 'minor-concerns' },
  { label: 'Raised', range: [35, 59], tier: 'raised-eyebrows' },
  { label: 'Suspicious', range: [60, 84], tier: 'seriously-suspicious' },
  { label: 'Swamp', range: [85, 100], tier: 'peak-swamp' },
]

const tierColorVars: Record<string, string> = {
  'clean-record': '#4AAF6E',
  'minor-concerns': '#B8A846',
  'raised-eyebrows': '#C9944A',
  'seriously-suspicious': '#D46A3A',
  'peak-swamp': '#D94A4A',
}

const salaryTierLabels: SalaryTier[] = ['elite', 'starter', 'mid-tier', 'bench', 'sleeper', 'unranked']

function CollapsibleSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-border pb-3 mb-3 last:border-0 last:mb-0 last:pb-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between text-sm font-medium text-foreground py-1 hover:text-primary transition-colors"
      >
        {title}
        {open ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
      </button>
      {open && <div className="mt-2">{children}</div>}
    </div>
  )
}

interface FilterSidebarProps {
  filters: FilterState
  onFilterChange: (filters: FilterState) => void
  politicians: Politician[]
  resultCount: number
}

function FilterContent({ filters, onFilterChange, politicians }: FilterSidebarProps) {
  const uniqueStates = Array.from(new Set(politicians.map((p) => p.state))).sort()

  const activeFilterCount = [
    filters.party,
    filters.chamber,
    filters.state,
    filters.salaryTier,
    filters.riskRange,
    filters.activityLevel,
    filters.search,
  ].filter(Boolean).length

  function clearFilters() {
    onFilterChange({
      ...DEFAULT_FILTERS,
      view: filters.view,
      sortBy: filters.sortBy,
      sortDir: filters.sortDir,
    })
  }

  return (
    <div className="space-y-0">
      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search politicians..."
            value={filters.search}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            className="w-full pl-9 pr-3 py-2 text-sm bg-muted rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Clear all */}
      {activeFilterCount > 0 && (
        <button
          onClick={clearFilters}
          className="w-full mb-4 text-xs text-muted-foreground hover:text-foreground transition-colors text-left"
        >
          Clear {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''}
        </button>
      )}

      {/* Party */}
      <CollapsibleSection title="Party">
        <div className="flex gap-2">
          {(['D', 'R', 'I'] as Party[]).map((party) => {
            const isActive = filters.party === party
            const color = PARTY_COLORS[party]
            const label = party === 'D' ? 'Democrat' : party === 'R' ? 'Republican' : 'Independent'
            return (
              <button
                key={party}
                onClick={() => onFilterChange({ ...filters, party: isActive ? null : party })}
                className="flex-1 py-1.5 text-xs font-medium rounded border transition-all"
                style={
                  isActive
                    ? {
                        backgroundColor: `${color}33`,
                        color,
                        borderColor: `${color}80`,
                      }
                    : {
                        color: 'var(--muted-foreground)',
                        borderColor: 'var(--border)',
                        backgroundColor: 'transparent',
                      }
                }
              >
                {label.slice(0, 3)}
              </button>
            )
          })}
        </div>
      </CollapsibleSection>

      {/* Chamber */}
      <CollapsibleSection title="Chamber">
        <div className="flex gap-2">
          {(['senate', 'house'] as Chamber[]).map((chamber) => {
            const isActive = filters.chamber === chamber
            return (
              <button
                key={chamber}
                onClick={() => onFilterChange({ ...filters, chamber: isActive ? null : chamber })}
                className="flex-1 py-1.5 text-xs font-medium rounded border transition-all capitalize"
                style={
                  isActive
                    ? {
                        backgroundColor: '#C9A84C33',
                        color: '#C9A84C',
                        borderColor: '#C9A84C80',
                      }
                    : {
                        color: 'var(--muted-foreground)',
                        borderColor: 'var(--border)',
                        backgroundColor: 'transparent',
                      }
                }
              >
                {chamber}
              </button>
            )
          })}
        </div>
      </CollapsibleSection>

      {/* State */}
      <CollapsibleSection title="State">
        <select
          value={filters.state ?? ''}
          onChange={(e) => onFilterChange({ ...filters, state: e.target.value || null })}
          className="w-full py-1.5 px-2 text-sm bg-muted border border-border rounded focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">All States</option>
          {uniqueStates.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </CollapsibleSection>

      {/* Committee — disabled */}
      <CollapsibleSection title="Committee" defaultOpen={false}>
        <p className="text-xs text-muted-foreground italic">Committee data unavailable</p>
      </CollapsibleSection>

      {/* Salary Tier */}
      <CollapsibleSection title="Salary Tier">
        <div className="grid grid-cols-2 gap-1.5">
          {salaryTierLabels.map((tier) => {
            const isActive = filters.salaryTier === tier
            return (
              <button
                key={tier}
                onClick={() => onFilterChange({ ...filters, salaryTier: isActive ? null : tier })}
                className="py-1 text-xs font-medium rounded border transition-all capitalize"
                style={
                  isActive
                    ? {
                        backgroundColor: '#C9A84C33',
                        color: '#C9A84C',
                        borderColor: '#C9A84C80',
                      }
                    : {
                        color: 'var(--muted-foreground)',
                        borderColor: 'var(--border)',
                        backgroundColor: 'transparent',
                      }
                }
              >
                {tier}
              </button>
            )
          })}
        </div>
      </CollapsibleSection>

      {/* Risk Range */}
      <CollapsibleSection title="Risk Level">
        <div className="flex flex-col gap-1.5">
          {riskTierRanges.map(({ label, range, tier }) => {
            const isActive =
              filters.riskRange !== null &&
              filters.riskRange[0] === range[0] &&
              filters.riskRange[1] === range[1]
            const color = tierColorVars[tier]
            return (
              <button
                key={tier}
                onClick={() =>
                  onFilterChange({ ...filters, riskRange: isActive ? null : range })
                }
                className="py-1 text-xs font-medium rounded border transition-all text-left px-2"
                style={
                  isActive
                    ? {
                        backgroundColor: `${color}33`,
                        color,
                        borderColor: `${color}80`,
                      }
                    : {
                        color: 'var(--muted-foreground)',
                        borderColor: 'var(--border)',
                        backgroundColor: 'transparent',
                      }
                }
              >
                {label}{' '}
                <span className="opacity-60">
                  ({range[0]}-{range[1]})
                </span>
              </button>
            )
          })}
        </div>
      </CollapsibleSection>

      {/* Activity Level */}
      <CollapsibleSection title="Activity Level">
        <div className="flex flex-col gap-1.5">
          {(
            [
              { value: 'high', label: 'High (20+ trades)' },
              { value: 'medium', label: 'Medium (10-19)' },
              { value: 'low', label: 'Low (<10)' },
            ] as const
          ).map(({ value, label }) => {
            const isActive = filters.activityLevel === value
            return (
              <button
                key={value}
                onClick={() =>
                  onFilterChange({ ...filters, activityLevel: isActive ? null : value })
                }
                className="py-1 text-xs font-medium rounded border transition-all text-left px-2"
                style={
                  isActive
                    ? {
                        backgroundColor: '#C9A84C33',
                        color: '#C9A84C',
                        borderColor: '#C9A84C80',
                      }
                    : {
                        color: 'var(--muted-foreground)',
                        borderColor: 'var(--border)',
                        backgroundColor: 'transparent',
                      }
                }
              >
                {label}
              </button>
            )
          })}
        </div>
      </CollapsibleSection>
    </div>
  )
}

export function FilterSidebar(props: FilterSidebarProps) {
  const { filters, resultCount } = props
  const activeFilterCount = [
    filters.party,
    filters.chamber,
    filters.state,
    filters.salaryTier,
    filters.riskRange,
    filters.activityLevel,
    filters.search,
  ].filter(Boolean).length

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-56 shrink-0 sticky top-20 h-fit">
        <div className="text-xs text-muted-foreground mb-3">
          {resultCount} politician{resultCount !== 1 ? 's' : ''}
        </div>
        <FilterContent {...props} />
      </aside>

      {/* Mobile trigger */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger
            className="flex items-center gap-2 px-3 py-2 text-sm border border-border rounded-md bg-muted hover:bg-muted/70 transition-colors"
          >
            <Filter className="size-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-1 inline-flex items-center justify-center size-5 text-xs rounded-full bg-primary text-primary-foreground font-bold">
                {activeFilterCount}
              </span>
            )}
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="px-4 pb-4 overflow-y-auto">
              <div className="text-xs text-muted-foreground mb-3">
                {resultCount} politician{resultCount !== 1 ? 's' : ''}
              </div>
              <FilterContent {...props} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
