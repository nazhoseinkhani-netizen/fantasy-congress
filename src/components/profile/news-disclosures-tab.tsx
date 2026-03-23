'use client'

import type { Politician, Trade } from '@/types'

interface NewsDisclosuresTabProps {
  politician: Politician
  trades: Trade[]
}

export function NewsDisclosuresTab({ politician, trades }: NewsDisclosuresTabProps) {
  return <div>News & Disclosures — placeholder</div>
}
