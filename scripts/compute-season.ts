/**
 * scripts/compute-season.ts
 *
 * Computes the 6-week season window from real trade dates and writes
 * public/data/season-weeks.json. Must run AFTER fetch-trades.ts and
 * BEFORE score-all.ts (which imports SEASON_WEEKS from config.ts which
 * reads season-weeks.json at module load time).
 *
 * Logic: end = most recent trade date, start = subMonths(end, 3).
 * Divides start-to-end into 6 equal windows.
 *
 * Run via: npx tsx scripts/compute-season.ts
 */

import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { subMonths } from 'date-fns'

function toISODate(date: Date): string {
  return date.toISOString().split('T')[0]
}

function main() {
  console.log('[compute-season] Computing season window from real trade dates...')

  const rawTradesPath = join(process.cwd(), 'public', 'data', '_raw-trades.json')
  const rawTrades = JSON.parse(
    readFileSync(rawTradesPath, 'utf8')
  ) as { tradeDate: string }[]

  const dates = rawTrades
    .map(t => new Date(t.tradeDate))
    .filter(d => !isNaN(d.getTime()))
    .sort((a, b) => b.getTime() - a.getTime())

  if (dates.length === 0) {
    console.error('[compute-season] FATAL: No valid trade dates in _raw-trades.json')
    process.exit(1)
  }

  const end = dates[0]
  const start = subMonths(end, 3)
  const totalMs = end.getTime() - start.getTime()
  const weekMs = totalMs / 6

  const seasonWeeks = Array.from({ length: 6 }, (_, i) => ({
    week: i + 1,
    startDate: toISODate(new Date(start.getTime() + i * weekMs)),
    endDate: toISODate(new Date(start.getTime() + (i + 1) * weekMs - (i === 5 ? 0 : 1))),
  }))

  // Ensure last week endDate is exactly the most recent trade date
  seasonWeeks[5].endDate = toISODate(end)

  const outputPath = join(process.cwd(), 'public', 'data', 'season-weeks.json')
  writeFileSync(outputPath, JSON.stringify(seasonWeeks, null, 2))

  const inRange = dates.filter(d => d >= start && d <= end).length
  console.log(`[compute-season] Season: ${seasonWeeks[0].startDate} to ${seasonWeeks[5].endDate}`)
  console.log(`[compute-season] ${rawTrades.length} total trades, ${inRange} in season window`)
  console.log('[compute-season] Written public/data/season-weeks.json')
}

main()
