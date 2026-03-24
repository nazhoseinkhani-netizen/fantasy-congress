'use client'

import { useState, useMemo } from 'react'
import { format } from 'date-fns'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'
import type { Politician, Trade } from '@/types'
import { CHART_COLORS, CHART_TOOLTIP_STYLE, CHART_AXIS_STYLE } from '@/lib/chart-config'
import { Badge } from '@/components/ui/badge'

interface FantasyStatsTabProps {
  politician: Politician
  trades: Trade[]
}

const bonusBadgeConfig: Record<string, { label: string; className: string }> = {
  bigMover: { label: 'Big Mover', className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40' },
  bipartisanBet: { label: 'Bipartisan', className: 'bg-blue-500/20 text-blue-400 border-blue-500/40' },
  donorDarling: { label: 'Donor Darling', className: 'bg-green-500/20 text-green-400 border-green-500/40' },
}

export function FantasyStatsTab({ politician, trades }: FantasyStatsTabProps) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null)

  const weeklyData = useMemo(
    () => politician.weeklyPoints.map((pts, i) => ({ week: `Week ${i + 1}`, points: pts })),
    [politician.weeklyPoints]
  )

  const avgWeekly = politician.weeklyPoints.length > 0
    ? politician.seasonPoints / politician.weeklyPoints.length
    : 0
  const projected16 = Math.round(avgWeekly * 16)

  const sortedTrades = useMemo(
    () => [...trades].sort((a, b) => b.disclosureDate.localeCompare(a.disclosureDate)),
    [trades]
  )

  return (
    <div className="space-y-8 pt-4">
      {/* Season Performance Chart */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Season Performance</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.border} />
            <XAxis
              dataKey="week"
              {...CHART_AXIS_STYLE}
            />
            <YAxis
              {...CHART_AXIS_STYLE}
            />
            <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
            <Line
              type="monotone"
              dataKey="points"
              stroke={CHART_COLORS.primary}
              strokeWidth={2}
              dot={{ fill: CHART_COLORS.primary, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </section>

      {/* Projected Season Total */}
      <section className="flex flex-wrap gap-4">
        <div className="rounded-lg border border-border bg-card p-4 flex-1 min-w-[180px]">
          <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
            Current Season Total
          </p>
          <p className="text-3xl font-black tabular-nums mt-1">
            {politician.seasonPoints.toLocaleString()}
          </p>
        </div>
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 flex-1 min-w-[180px]">
          <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
            Projected 16-Week Total
          </p>
          <p className="text-3xl font-black tabular-nums mt-1" style={{ color: CHART_COLORS.primary }}>
            {projected16.toLocaleString()}
          </p>
        </div>
      </section>

      {/* Full Trade Log */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Trade Log</h3>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-3 py-2 font-medium text-muted-foreground">Date</th>
                <th className="text-left px-3 py-2 font-medium text-muted-foreground">Ticker</th>
                <th className="text-left px-3 py-2 font-medium text-muted-foreground hidden md:table-cell">Company</th>
                <th className="text-left px-3 py-2 font-medium text-muted-foreground">Type</th>
                <th className="text-left px-3 py-2 font-medium text-muted-foreground hidden sm:table-cell">Amount</th>
                <th className="text-right px-3 py-2 font-medium text-muted-foreground hidden sm:table-cell">Return</th>
                <th className="text-right px-3 py-2 font-medium text-muted-foreground">vs S&P</th>
                <th className="text-right px-3 py-2 font-medium text-muted-foreground">Points</th>
                <th className="text-left px-3 py-2 font-medium text-muted-foreground hidden lg:table-cell">Bonuses</th>
              </tr>
            </thead>
            <tbody>
              {sortedTrades.map((trade) => (
                <TradeRow
                  key={trade.id}
                  trade={trade}
                  expanded={expandedRow === trade.id}
                  onToggle={() => setExpandedRow(expandedRow === trade.id ? null : trade.id)}
                />
              ))}
              {sortedTrades.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-muted-foreground">
                    No trades recorded
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function TradeRow({
  trade,
  expanded,
  onToggle,
}: {
  trade: Trade
  expanded: boolean
  onToggle: () => void
}) {
  return (
    <>
      <tr
        className="border-b border-border bg-card hover:bg-muted/50 cursor-pointer transition-colors"
        onClick={onToggle}
      >
        <td className="px-3 py-2 tabular-nums whitespace-nowrap">
          {format(new Date(trade.disclosureDate), 'MMM d, yyyy')}
        </td>
        <td className="px-3 py-2 font-mono font-semibold">{trade.ticker}</td>
        <td className="px-3 py-2 hidden md:table-cell text-muted-foreground truncate max-w-[200px]">
          {trade.company}
        </td>
        <td className="px-3 py-2">
          <span
            className={`inline-block px-1.5 py-0.5 rounded text-xs font-medium ${
              trade.tradeType === 'buy'
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-red-500/20 text-red-400'
            }`}
          >
            {trade.tradeType.toUpperCase()}
          </span>
        </td>
        <td className="px-3 py-2 hidden sm:table-cell text-muted-foreground">{trade.amountRange}</td>
        <td className="px-3 py-2 text-right tabular-nums font-mono hidden sm:table-cell">
          <span style={{ color: trade.absoluteReturn >= 0 ? CHART_COLORS.positive : CHART_COLORS.negative }}>
            {trade.absoluteReturn >= 0 ? '+' : ''}{trade.absoluteReturn.toFixed(1)}%
          </span>
        </td>
        <td className="px-3 py-2 text-right tabular-nums font-mono">
          <span style={{ color: trade.returnVsSP500 >= 0 ? CHART_COLORS.positive : CHART_COLORS.negative }}>
            {trade.returnVsSP500 >= 0 ? '+' : ''}{trade.returnVsSP500.toFixed(1)}%
          </span>
        </td>
        <td className="px-3 py-2 text-right tabular-nums font-mono font-semibold">
          {trade.fantasyPoints.toFixed(1)}
        </td>
        <td className="px-3 py-2 hidden lg:table-cell">
          <div className="flex gap-1 flex-wrap">
            {trade.scoreBreakdown.bonuses.map((b) => {
              const cfg = bonusBadgeConfig[b.type]
              return cfg ? (
                <span
                  key={b.type}
                  className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-medium border ${cfg.className}`}
                >
                  {cfg.label}
                </span>
              ) : null
            })}
          </div>
        </td>
      </tr>
      {expanded && (
        <tr className="border-b border-border bg-muted/30">
          <td colSpan={9} className="px-3 py-3">
            <ScoreBreakdown breakdown={trade.scoreBreakdown} />
          </td>
        </tr>
      )}
    </>
  )
}

function ScoreBreakdown({ breakdown }: { breakdown: Trade['scoreBreakdown'] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
      <div>
        <span className="text-muted-foreground">Base Points</span>
        <p className="font-mono font-semibold">{breakdown.basePoints.toFixed(1)}</p>
      </div>
      <div>
        <span className="text-muted-foreground">Excess Return Pts</span>
        <p className="font-mono font-semibold">{breakdown.excessReturnPoints.toFixed(1)}</p>
      </div>
      <div>
        <span className="text-muted-foreground">Amount Multiplier</span>
        <p className="font-mono font-semibold">{breakdown.amountMultiplier.toFixed(2)}x</p>
      </div>
      <div>
        <span className="text-muted-foreground">Position Multiplier</span>
        <p className="font-mono font-semibold">{breakdown.positionMultiplier.toFixed(2)}x</p>
      </div>
      {breakdown.bonuses.length > 0 && (
        <div className="col-span-2">
          <span className="text-muted-foreground">Bonuses</span>
          <div className="flex gap-2 mt-0.5">
            {breakdown.bonuses.map((b) => (
              <span key={b.type} className="font-mono text-emerald-400">
                +{b.points.toFixed(1)} ({b.type})
              </span>
            ))}
          </div>
        </div>
      )}
      {breakdown.penalties.length > 0 && (
        <div className="col-span-2">
          <span className="text-muted-foreground">Penalties</span>
          <div className="flex gap-2 mt-0.5">
            {breakdown.penalties.map((p) => (
              <span key={p.type} className="font-mono text-red-400">
                {p.points.toFixed(1)} ({p.type})
              </span>
            ))}
          </div>
        </div>
      )}
      <div className="col-span-2 sm:col-span-4 border-t border-border pt-2 mt-1">
        <span className="text-muted-foreground">Total Before Multiplier: </span>
        <span className="font-mono font-semibold">{breakdown.totalBeforeMultiplier.toFixed(1)}</span>
        <span className="text-muted-foreground ml-4">Final: </span>
        <span className="font-mono font-bold text-foreground">{breakdown.total.toFixed(1)}</span>
      </div>
    </div>
  )
}
