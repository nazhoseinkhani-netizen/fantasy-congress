import type { Trade } from '@/types'

let cachedTrades: Trade[] | null = null

export async function loadTrades(): Promise<Trade[]> {
  if (cachedTrades) return cachedTrades
  const res = await fetch('/data/trades.json')
  if (!res.ok) throw new Error(`Failed to load trades: ${res.status}`)
  cachedTrades = (await res.json()) as Trade[]
  return cachedTrades
}

export async function loadTradesForPolitician(bioguideId: string): Promise<Trade[]> {
  const trades = await loadTrades()
  return trades.filter((t) => t.bioguideId === bioguideId)
}

export function clearTradesCache(): void {
  cachedTrades = null
}
