'use client'

import { useMemo } from 'react'
import { format } from 'date-fns'
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
} from 'recharts'
import type { Politician, Trade } from '@/types'
import { CHART_COLORS, CHART_TOOLTIP_STYLE, CHART_AXIS_STYLE, SECTOR_COLORS } from '@/lib/chart-config'

interface TradingProfileTabProps {
  politician: Politician
  trades: Trade[]
}

interface SectorData {
  sector: string
  count: number
  points: number
  wins: number
  avgReturn: number
}

export function TradingProfileTab({ politician, trades }: TradingProfileTabProps) {
  const sectorData = useMemo(() => {
    const map = new Map<string, { count: number; points: number; wins: number; totalReturn: number }>()
    for (const t of trades) {
      const entry = map.get(t.sector) ?? { count: 0, points: 0, wins: 0, totalReturn: 0 }
      entry.count++
      entry.points += t.fantasyPoints
      if (t.returnVsSP500 > 0) entry.wins++
      entry.totalReturn += t.returnVsSP500
      map.set(t.sector, entry)
    }
    return Array.from(map.entries())
      .map(([sector, d]): SectorData => ({
        sector,
        count: d.count,
        points: Math.round(d.points),
        wins: d.wins,
        avgReturn: d.count > 0 ? d.totalReturn / d.count : 0,
      }))
      .sort((a, b) => b.count - a.count)
  }, [trades])

  const biggestWins = useMemo(
    () => [...trades].sort((a, b) => b.fantasyPoints - a.fantasyPoints).slice(0, 3),
    [trades]
  )

  const biggestLosses = useMemo(
    () => [...trades].sort((a, b) => a.fantasyPoints - b.fantasyPoints).slice(0, 3),
    [trades]
  )

  const equityCurveData = useMemo(() => {
    const sorted = [...trades].sort((a, b) => a.tradeDate.localeCompare(b.tradeDate))
    let cumPolitician = 0
    let cumSP = 0
    return sorted.map((t) => {
      cumPolitician += t.absoluteReturn
      cumSP += t.sp500Return
      return {
        date: format(new Date(t.tradeDate), 'MMM yy'),
        politician: parseFloat(cumPolitician.toFixed(2)),
        sp500: parseFloat(cumSP.toFixed(2)),
      }
    })
  }, [trades])

  return (
    <div className="space-y-8 pt-4">
      {/* Sector Pie Chart */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Trades by Sector</h3>
        {sectorData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={sectorData}
                dataKey="count"
                nameKey="sector"
                cx="50%"
                cy="50%"
                outerRadius={100}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                label={(entry: any) => `${entry.sector} (${entry.count})`}
                labelLine={false}
              >
                {sectorData.map((_, i) => (
                  <Cell key={i} fill={SECTOR_COLORS[i % SECTOR_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={CHART_TOOLTIP_STYLE}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={((value: any, _name: any, props: any) => {
                  const payload = props?.payload as SectorData | undefined
                  return [
                    `${value} trades, ${payload?.points ?? 0} pts`,
                    payload?.sector ?? '',
                  ]
                }) as any}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-muted-foreground text-center py-8">No trade data available</p>
        )}
      </section>

      {/* Win Rate by Sector */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Win Rate by Sector</h3>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-3 py-2 font-medium text-muted-foreground">Sector</th>
                <th className="text-right px-3 py-2 font-medium text-muted-foreground">Trades</th>
                <th className="text-right px-3 py-2 font-medium text-muted-foreground">Win Rate</th>
                <th className="text-right px-3 py-2 font-medium text-muted-foreground">Avg Return</th>
              </tr>
            </thead>
            <tbody>
              {sectorData.map((s) => (
                <tr key={s.sector} className="border-b border-border bg-card hover:bg-muted/50 transition-colors">
                  <td className="px-3 py-2">{s.sector}</td>
                  <td className="px-3 py-2 text-right tabular-nums font-mono">{s.count}</td>
                  <td className="px-3 py-2 text-right tabular-nums font-mono">
                    {s.count > 0 ? Math.round((s.wins / s.count) * 100) : 0}%
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums font-mono">
                    <span style={{ color: s.avgReturn >= 0 ? CHART_COLORS.positive : CHART_COLORS.negative }}>
                      {s.avgReturn >= 0 ? '+' : ''}{s.avgReturn.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
              {sectorData.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-muted-foreground">No data</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Biggest Wins / Losses */}
      <section className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Biggest Wins</h3>
          <div className="space-y-2">
            {biggestWins.map((t) => (
              <TradeCard key={t.id} trade={t} />
            ))}
            {biggestWins.length === 0 && (
              <p className="text-muted-foreground text-sm">No trades</p>
            )}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Biggest Losses</h3>
          <div className="space-y-2">
            {biggestLosses.map((t) => (
              <TradeCard key={t.id} trade={t} />
            ))}
            {biggestLosses.length === 0 && (
              <p className="text-muted-foreground text-sm">No trades</p>
            )}
          </div>
        </div>
      </section>

      {/* Equity Curve */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Performance vs S&P 500</h3>
        {equityCurveData.length > 0 ? (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={equityCurveData}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.border} />
              <XAxis dataKey="date" {...CHART_AXIS_STYLE} />
              <YAxis {...CHART_AXIS_STYLE} tickFormatter={(v: number) => `${v}%`} />
              <Tooltip
                contentStyle={CHART_TOOLTIP_STYLE}
                formatter={(v: unknown) => `${Number(v).toFixed(2)}%`}
              />
              <Area
                type="monotone"
                dataKey="politician"
                name={politician.name}
                stroke={CHART_COLORS.primary}
                fill={CHART_COLORS.primary}
                fillOpacity={0.15}
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="sp500"
                name="S&P 500"
                stroke={CHART_COLORS.muted}
                fill={CHART_COLORS.muted}
                fillOpacity={0.08}
                strokeWidth={1.5}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-muted-foreground text-center py-8">No trade data to chart</p>
        )}
      </section>
    </div>
  )
}

function TradeCard({ trade }: { trade: Trade }) {
  return (
    <div className="rounded-lg border border-border bg-card p-3 flex items-center justify-between gap-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold">{trade.ticker}</span>
          <span className={`text-[10px] font-medium px-1 py-0.5 rounded ${trade.tradeType === 'buy' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
            {trade.tradeType.toUpperCase()}
          </span>
          <span className="text-xs text-muted-foreground truncate">{trade.company}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          {format(new Date(trade.tradeDate), 'MMM d, yyyy')} · {trade.amountRange}
        </p>
      </div>
      <div className="text-right shrink-0 space-y-0.5">
        <p className="font-mono text-sm font-semibold" style={{ color: trade.returnVsSP500 >= 0 ? CHART_COLORS.positive : CHART_COLORS.negative }}>
          {trade.fantasyPoints.toFixed(1)} pts
        </p>
        <p className="font-mono text-[11px]" style={{ color: trade.absoluteReturn >= 0 ? CHART_COLORS.positive : CHART_COLORS.negative }}>
          Return: {trade.absoluteReturn >= 0 ? '+' : ''}{trade.absoluteReturn.toFixed(1)}%
        </p>
        <p className="font-mono text-[11px] text-muted-foreground">
          vs S&P: {trade.returnVsSP500 >= 0 ? '+' : ''}{trade.returnVsSP500.toFixed(1)}%
        </p>
      </div>
    </div>
  )
}
