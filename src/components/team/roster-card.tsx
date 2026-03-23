'use client'

import { AnimatePresence, motion } from 'motion/react'
import { ChevronDown } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import type { Politician } from '@/types/politician'
import type { Trade } from '@/types/trade'
import { RiskBadge } from '@/components/design/risk-badge'
import { CHART_COLORS, CHART_AXIS_STYLE, CHART_TOOLTIP_STYLE } from '@/lib/chart-config'
import { PARTY_COLORS } from '@/lib/party-colors'
import { cn } from '@/lib/utils'

interface RosterCardProps {
  politician: Politician
  trades: Trade[]
  weeklyPointsData: { week: string; points: number }[]
  isSelected: boolean
  isExpanded: boolean
  onSelect: () => void
  onToggleExpand: () => void
  className?: string
}

export function RosterCard({
  politician,
  trades,
  weeklyPointsData,
  isSelected,
  isExpanded,
  onSelect,
  onToggleExpand,
  className,
}: RosterCardProps) {
  return (
    <div
      className={cn(
        'bg-card border border-border rounded-xl p-3 cursor-pointer transition-all',
        isSelected && 'ring-2 ring-primary border-primary',
        className
      )}
      style={{ borderLeft: `3px solid ${PARTY_COLORS[politician.party]}` }}
      onClick={onSelect}
    >
      {/* Main content row */}
      <div className="flex items-center gap-3">
        <img
          src={politician.photoUrl}
          alt={politician.name}
          className="w-12 h-12 rounded-full object-cover shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate">{politician.name}</p>
          <p className="text-xs text-muted-foreground">{politician.party}-{politician.state}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-sm font-bold text-primary">{politician.seasonPoints} pts</p>
          <p className="text-xs text-muted-foreground">${politician.salaryCap.toLocaleString()}</p>
        </div>
        <RiskBadge
          score={politician.insiderRiskScore}
          tier={politician.insiderRiskTier}
          size="sm"
        />
        <button
          type="button"
          className="p-1 rounded hover:bg-muted transition-colors shrink-0"
          onClick={(e) => { e.stopPropagation(); onToggleExpand() }}
          aria-label={isExpanded ? 'Collapse' : 'Expand'}
        >
          <ChevronDown
            className={cn('w-4 h-4 text-muted-foreground transition-transform', isExpanded && 'rotate-180')}
          />
        </button>
      </div>

      {/* Inline expand section */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            key="expand"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pt-3 mt-3 border-t border-border space-y-4">
              {/* Scoring timeline chart */}
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Weekly Points</h4>
                <ResponsiveContainer width="100%" height={120}>
                  <BarChart data={weeklyPointsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.border} />
                    <XAxis dataKey="week" {...CHART_AXIS_STYLE} />
                    <YAxis {...CHART_AXIS_STYLE} />
                    <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                    <Bar dataKey="points" fill={CHART_COLORS.primary} radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {/* Trade log */}
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                  Recent Trades ({trades.length})
                </h4>
                {trades.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No trades recorded</p>
                ) : (
                  <div className="space-y-1">
                    {trades.slice(0, 5).map((trade, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <span className="font-medium">{trade.ticker}</span>
                        <span className={trade.tradeType === 'buy' ? 'text-emerald-400' : 'text-red-400'}>
                          {trade.tradeType.toUpperCase()}
                        </span>
                        <span>{trade.absoluteReturn >= 0 ? '+' : ''}{trade.absoluteReturn.toFixed(1)}%</span>
                        <span className="font-semibold text-primary">{trade.fantasyPoints} pts</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
