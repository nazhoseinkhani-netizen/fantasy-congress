'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { PARTY_COLORS } from '@/lib/party-colors'
import type { Trade } from '@/types/trade'
import type { Politician } from '@/types/politician'

interface TradeFeedSidebarProps {
  trades: Trade[]
  politicians: Politician[]
}

export function TradeFeedSidebar({ trades, politicians }: TradeFeedSidebarProps) {
  const politicianMap = useMemo(() => {
    const map = new Map<string, Politician>()
    for (const p of politicians) map.set(p.bioguideId, p)
    return map
  }, [politicians])

  const recentTrades = useMemo(() => {
    return [...trades]
      .sort((a, b) => new Date(b.disclosureDate).getTime() - new Date(a.disclosureDate).getTime())
      .slice(0, 5)
  }, [trades])

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="font-semibold text-sm">Recent Trades</h3>
      </div>

      <div className="divide-y divide-border/50">
        {recentTrades.map((trade) => {
          const politician = politicianMap.get(trade.bioguideId)
          const partyColor = PARTY_COLORS[trade.party] ?? PARTY_COLORS['I']
          const isBuy = trade.tradeType === 'buy'

          return (
            <div key={trade.id} className="flex items-center gap-3 px-4 py-3">
              {/* Photo */}
              <div className="shrink-0">
                {politician?.photoUrl ? (
                  <img
                    src={politician.photoUrl}
                    alt={trade.politicianName}
                    className="size-8 rounded-full object-cover object-center bg-muted"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                    }}
                  />
                ) : (
                  <div className="size-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                    {trade.politicianName.charAt(0)}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-sm font-medium truncate">{trade.politicianName}</span>
                  <span
                    className="text-xs font-bold px-1 py-0.5 rounded shrink-0"
                    style={{ color: partyColor, backgroundColor: `${partyColor}26` }}
                  >
                    {trade.party}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                      isBuy
                        ? 'bg-green-400/10 text-green-400 border border-green-400/30'
                        : 'bg-red-400/10 text-red-400 border border-red-400/30'
                    }`}
                  >
                    {trade.tradeType.toUpperCase()}
                  </span>
                  <span className="font-mono text-xs font-bold">{trade.ticker}</span>
                  <span className="text-xs text-muted-foreground ml-auto shrink-0">
                    {trade.fantasyPoints > 0 ? '+' : ''}{trade.fantasyPoints.toFixed(0)} pts
                  </span>
                </div>
              </div>
            </div>
          )
        })}

        {recentTrades.length === 0 && (
          <div className="px-4 py-6 text-center text-sm text-muted-foreground">
            No recent trades
          </div>
        )}
      </div>

      <div className="px-4 py-3 border-t border-border">
        <Link
          href="/feed"
          className="text-primary text-sm hover:underline"
        >
          See Full Feed →
        </Link>
      </div>
    </div>
  )
}
