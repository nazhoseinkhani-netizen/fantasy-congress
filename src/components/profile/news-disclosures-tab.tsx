'use client'

import { useMemo } from 'react'
import { format } from 'date-fns'
import type { Politician, Trade } from '@/types'
import { CHART_COLORS } from '@/lib/chart-config'

interface NewsDisclosuresTabProps {
  politician: Politician
  trades: Trade[]
}

const MAX_FILINGS = 20
const STOCK_ACT_DEADLINE_DAYS = 45

export function NewsDisclosuresTab({ politician, trades }: NewsDisclosuresTabProps) {
  const sortedTrades = useMemo(
    () => [...trades].sort((a, b) => b.disclosureDate.localeCompare(a.disclosureDate)),
    [trades]
  )

  const displayedTrades = sortedTrades.slice(0, MAX_FILINGS)

  return (
    <div className="space-y-8 pt-4">
      {/* Recent STOCK Act Filings */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recent STOCK Act Filings</h3>
          <span className="text-xs text-muted-foreground">
            Showing {displayedTrades.length} of {trades.length} total filings
          </span>
        </div>

        {displayedTrades.length > 0 ? (
          <div className="space-y-3">
            {displayedTrades.map((trade) => (
              <FilingCard key={trade.id} trade={trade} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">No filings on record</p>
        )}
      </section>

      {/* Committee Hearing Schedule (placeholder) */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Committee Hearing Schedule</h3>
        <div className="rounded-lg border border-dashed border-border p-6 text-center">
          <svg
            className="mx-auto size-8 text-muted-foreground mb-3"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <p className="text-sm text-muted-foreground">
            Committee hearing data is not yet available. When available, this section will show
            upcoming hearings relevant to this politician&apos;s committee assignments and recent trades.
          </p>
        </div>
      </section>
    </div>
  )
}

function FilingCard({ trade }: { trade: Trade }) {
  const isLate = trade.daysToDisclose > STOCK_ACT_DEADLINE_DAYS

  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-2">
      {/* Header row: dates and late badge */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <span className="text-sm">
          <span className="text-muted-foreground">Filed: </span>
          <span className="font-medium">
            {format(new Date(trade.disclosureDate), 'MMM d, yyyy')}
          </span>
        </span>
        <span className="text-sm">
          <span className="text-muted-foreground">Traded: </span>
          <span className="font-medium">
            {format(new Date(trade.tradeDate), 'MMM d, yyyy')}
          </span>
          <span className="text-xs text-muted-foreground ml-1">
            ({trade.daysToDisclose} days to disclose)
          </span>
        </span>
        {isLate && (
          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/40">
            Late Disclosure
          </span>
        )}
      </div>

      {/* Trade details */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="font-mono font-bold text-base">{trade.ticker}</span>
        <span className="text-sm text-muted-foreground">{trade.company}</span>
        <span
          className={`inline-block px-1.5 py-0.5 rounded text-xs font-medium ${
            trade.tradeType === 'buy'
              ? 'bg-emerald-500/20 text-emerald-400'
              : 'bg-red-500/20 text-red-400'
          }`}
        >
          {trade.tradeType.toUpperCase()}
        </span>
        <span className="text-sm text-muted-foreground">{trade.amountRange}</span>
      </div>

      {/* Return vs S&P */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Return vs S&P 500:</span>
        <span
          className="font-mono font-semibold text-sm"
          style={{ color: trade.returnVsSP500 >= 0 ? CHART_COLORS.positive : CHART_COLORS.negative }}
        >
          {trade.returnVsSP500 >= 0 ? '+' : ''}{trade.returnVsSP500.toFixed(1)}%
        </span>
      </div>
    </div>
  )
}
