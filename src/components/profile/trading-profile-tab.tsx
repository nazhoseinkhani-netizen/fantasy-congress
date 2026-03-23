'use client'

import type { Politician, Trade } from '@/types'

interface TradingProfileTabProps {
  politician: Politician
  trades: Trade[]
}

export function TradingProfileTab({ politician, trades }: TradingProfileTabProps) {
  return <div>Trading Profile — placeholder</div>
}
