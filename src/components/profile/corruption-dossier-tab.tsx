'use client'

import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip,
} from 'recharts'
import type { Politician, Trade } from '@/types'
import { CHART_TOOLTIP_STYLE } from '@/lib/chart-config'
import { RiskBadge } from '@/components/design/risk-badge'

interface CorruptionDossierTabProps {
  politician: Politician
  trades: Trade[]
}

const componentDescriptions: Record<string, string> = {
  'Donor Overlap': 'Correlation between campaign donors and traded stocks',
  'Suspicious Timing': 'Trades made shortly before major announcements',
  'Committee Conflict': 'Trades in sectors overseen by assigned committees',
  'STOCK Act Issues': 'Timeliness and completeness of trade disclosures',
  'Trade Volume': 'Frequency and size of trading activity',
}

export function CorruptionDossierTab({ politician }: CorruptionDossierTabProps) {
  const breakdown = politician.insiderRiskBreakdown

  const radarData = [
    { label: 'Donor Overlap', value: breakdown.donorOverlap },
    { label: 'Suspicious Timing', value: breakdown.suspiciousTiming },
    { label: 'Committee Conflict', value: breakdown.committeeConflict },
    { label: 'STOCK Act Issues', value: breakdown.stockActCompliance },
    { label: 'Trade Volume', value: breakdown.tradeVolume },
  ]

  const componentCards = radarData.map((d) => ({
    ...d,
    description: componentDescriptions[d.label],
  }))

  return (
    <div className="relative pt-4">
      {/* CLASSIFIED watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none">
        <span className="text-8xl font-black tracking-widest rotate-[-15deg] text-foreground">
          CLASSIFIED
        </span>
      </div>

      <div className="space-y-8 relative">
        {/* Section Header */}
        <div className="border-b border-border pb-2">
          <h3 className="font-mono uppercase tracking-widest text-xs text-muted-foreground">
            Intelligence Briefing // Insider Trading Risk Assessment
          </h3>
        </div>

        {/* Score Header */}
        <section className="flex flex-col sm:flex-row items-center sm:items-end gap-4">
          <div className="text-center sm:text-left">
            <p className="font-mono uppercase tracking-widest text-xs text-muted-foreground mb-1">
              Composite Risk Score
            </p>
            <p className="text-5xl font-black tabular-nums font-mono">
              {politician.insiderRiskScore}
            </p>
          </div>
          <RiskBadge
            tier={politician.insiderRiskTier}
            score={politician.insiderRiskScore}
            size="lg"
          />
        </section>

        {/* Radar Chart */}
        <section>
          <div className="border-b border-border pb-2 mb-4">
            <h4 className="font-mono uppercase tracking-widest text-xs text-muted-foreground">
              Risk Component Analysis
            </h4>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
              <PolarGrid stroke="var(--color-border)" />
              <PolarAngleAxis
                dataKey="label"
                tick={{ fill: 'var(--color-muted-foreground)', fontSize: 11 }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fill: 'var(--color-muted-foreground)', fontSize: 9 }}
              />
              <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
              <Radar
                name="Risk Score"
                dataKey="value"
                stroke="var(--color-risk-swamp)"
                fill="var(--color-risk-swamp)"
                fillOpacity={0.25}
              />
            </RadarChart>
          </ResponsiveContainer>
        </section>

        {/* Component Breakdown Cards */}
        <section>
          <div className="border-b border-border pb-2 mb-4">
            <h4 className="font-mono uppercase tracking-widest text-xs text-muted-foreground">
              Component Breakdown
            </h4>
          </div>
          <div className="space-y-3">
            {componentCards.map((c) => (
              <div key={c.label} className="rounded-lg border border-border bg-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{c.label}</span>
                  <span className="font-mono font-bold text-sm tabular-nums">{c.value}</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${c.value}%`,
                      background: `linear-gradient(to right, oklch(0.65 0.18 145), oklch(0.6 0.23 25))`,
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">{c.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Committee Connection Map (placeholder) */}
        <section>
          <div className="border-b border-border pb-2 mb-4">
            <h4 className="font-mono uppercase tracking-widest text-xs text-muted-foreground">
              Committee Connection Map
            </h4>
          </div>
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
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <p className="text-sm text-muted-foreground">
              Committee assignment data is currently unavailable. This section will map trading
              activity to committee oversight areas when data becomes available.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
