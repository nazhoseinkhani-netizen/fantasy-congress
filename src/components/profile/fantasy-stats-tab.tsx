'use client'

import type { Politician, Trade } from '@/types'

interface FantasyStatsTabProps {
  politician: Politician
  trades: Trade[]
}

export function FantasyStatsTab({ politician, trades }: FantasyStatsTabProps) {
  return <div>Fantasy Stats — placeholder</div>
}
