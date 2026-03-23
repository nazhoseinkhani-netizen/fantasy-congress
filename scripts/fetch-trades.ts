/**
 * scripts/fetch-trades.ts
 *
 * Generates realistic Congressional stock trade data for the prototype.
 * Primary: checks for QUIVER_API_KEY and attempts Quiver Quantitative API.
 * Fallback (default): generates 500-1500 trades programmatically with
 * realistic distributions of tickers, amounts, returns, and disclosure timing.
 *
 * Trade dates fall within SEASON_WEEKS (2025-10-01 to 2025-12-23).
 * Uses seeded random for reproducibility.
 *
 * Writes to public/data/_raw-trades.json
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

const OUT_DIR = join(process.cwd(), 'public', 'data')
const OUT_FILE = join(OUT_DIR, '_raw-trades.json')
const POLITICIANS_FILE = join(OUT_DIR, '_raw-politicians.json')

// ---------------------------------------------------------------------------
// Ticker data
// ---------------------------------------------------------------------------

interface TickerInfo {
  company: string
  sector: string
}

const TICKERS: Record<string, TickerInfo> = {
  AAPL: { company: 'Apple Inc.', sector: 'Technology' },
  MSFT: { company: 'Microsoft Corporation', sector: 'Technology' },
  GOOGL: { company: 'Alphabet Inc.', sector: 'Technology' },
  AMZN: { company: 'Amazon.com Inc.', sector: 'Technology' },
  NVDA: { company: 'NVIDIA Corporation', sector: 'Technology' },
  META: { company: 'Meta Platforms Inc.', sector: 'Technology' },
  TSLA: { company: 'Tesla Inc.', sector: 'Technology' },
  CRM: { company: 'Salesforce Inc.', sector: 'Technology' },
  ORCL: { company: 'Oracle Corporation', sector: 'Technology' },
  IBM: { company: 'International Business Machines', sector: 'Technology' },
  INTC: { company: 'Intel Corporation', sector: 'Technology' },
  AMD: { company: 'Advanced Micro Devices', sector: 'Technology' },
  QCOM: { company: 'Qualcomm Incorporated', sector: 'Technology' },
  CSCO: { company: 'Cisco Systems Inc.', sector: 'Technology' },
  ADBE: { company: 'Adobe Inc.', sector: 'Technology' },
  JPM: { company: 'JPMorgan Chase & Co.', sector: 'Finance' },
  BAC: { company: 'Bank of America Corporation', sector: 'Finance' },
  GS: { company: 'Goldman Sachs Group Inc.', sector: 'Finance' },
  MS: { company: 'Morgan Stanley', sector: 'Finance' },
  WFC: { company: 'Wells Fargo & Company', sector: 'Finance' },
  C: { company: 'Citigroup Inc.', sector: 'Finance' },
  BRK: { company: 'Berkshire Hathaway Inc.', sector: 'Finance' },
  V: { company: 'Visa Inc.', sector: 'Finance' },
  MA: { company: 'Mastercard Incorporated', sector: 'Finance' },
  AXP: { company: 'American Express Company', sector: 'Finance' },
  PFE: { company: 'Pfizer Inc.', sector: 'Healthcare' },
  JNJ: { company: 'Johnson & Johnson', sector: 'Healthcare' },
  UNH: { company: 'UnitedHealth Group Incorporated', sector: 'Healthcare' },
  MRK: { company: 'Merck & Co. Inc.', sector: 'Healthcare' },
  ABBV: { company: 'AbbVie Inc.', sector: 'Healthcare' },
  BMY: { company: 'Bristol-Myers Squibb Company', sector: 'Healthcare' },
  AMGN: { company: 'Amgen Inc.', sector: 'Healthcare' },
  GILD: { company: 'Gilead Sciences Inc.', sector: 'Healthcare' },
  CVS: { company: 'CVS Health Corporation', sector: 'Healthcare' },
  HCA: { company: 'HCA Healthcare Inc.', sector: 'Healthcare' },
  LMT: { company: 'Lockheed Martin Corporation', sector: 'Defense' },
  BA: { company: 'Boeing Company', sector: 'Defense' },
  RTX: { company: 'RTX Corporation', sector: 'Defense' },
  NOC: { company: 'Northrop Grumman Corporation', sector: 'Defense' },
  GD: { company: 'General Dynamics Corporation', sector: 'Defense' },
  HII: { company: 'Huntington Ingalls Industries', sector: 'Defense' },
  LHX: { company: 'L3Harris Technologies Inc.', sector: 'Defense' },
  XOM: { company: 'Exxon Mobil Corporation', sector: 'Energy' },
  CVX: { company: 'Chevron Corporation', sector: 'Energy' },
  COP: { company: 'ConocoPhillips', sector: 'Energy' },
  OXY: { company: 'Occidental Petroleum Corporation', sector: 'Energy' },
  SLB: { company: 'SLB (Schlumberger)', sector: 'Energy' },
  PXD: { company: 'Pioneer Natural Resources', sector: 'Energy' },
  HAL: { company: 'Halliburton Company', sector: 'Energy' },
  AMZ: { company: 'Amazon Web Services', sector: 'Technology' },
  DIS: { company: 'The Walt Disney Company', sector: 'Media' },
  NFLX: { company: 'Netflix Inc.', sector: 'Media' },
  CMCSA: { company: 'Comcast Corporation', sector: 'Media' },
  T: { company: 'AT&T Inc.', sector: 'Telecommunications' },
  VZ: { company: 'Verizon Communications Inc.', sector: 'Telecommunications' },
  TMUS: { company: 'T-Mobile US Inc.', sector: 'Telecommunications' },
  WMT: { company: 'Walmart Inc.', sector: 'Retail' },
  TGT: { company: 'Target Corporation', sector: 'Retail' },
  COST: { company: 'Costco Wholesale Corporation', sector: 'Retail' },
  HD: { company: 'The Home Depot Inc.', sector: 'Retail' },
  NUE: { company: 'Nucor Corporation', sector: 'Materials' },
  FCX: { company: 'Freeport-McMoRan Inc.', sector: 'Materials' },
  CAT: { company: 'Caterpillar Inc.', sector: 'Industrials' },
  DE: { company: 'Deere & Company', sector: 'Industrials' },
  HON: { company: 'Honeywell International Inc.', sector: 'Industrials' },
  UPS: { company: 'United Parcel Service Inc.', sector: 'Industrials' },
  NEE: { company: 'NextEra Energy Inc.', sector: 'Utilities' },
  DUK: { company: 'Duke Energy Corporation', sector: 'Utilities' },
  SO: { company: 'Southern Company', sector: 'Utilities' },
}

const TICKER_KEYS = Object.keys(TICKERS)

// Season weeks (2025-10-01 to 2025-12-23)
const SEASON_START = new Date('2025-10-01')
const SEASON_END = new Date('2025-12-23')
const SEASON_DAYS = Math.floor(
  (SEASON_END.getTime() - SEASON_START.getTime()) / (1000 * 60 * 60 * 24)
)

const AMOUNT_RANGES = [
  '$1k-$15k',
  '$15k-$50k',
  '$50k-$100k',
  '$100k-$250k',
  '$250k-$500k',
  '$500k-$1M',
  '$1M+',
] as const

// Weighted distribution for amount ranges
// 40% $1k-$15k, 25% $15k-$50k, 15% $50k-$100k, 10% $100k-$250k, 5% $250k-$500k, 3% $500k-$1M, 2% $1M+
const AMOUNT_WEIGHTS = [0.40, 0.25, 0.15, 0.10, 0.05, 0.03, 0.02]

// ---------------------------------------------------------------------------
// Seeded random number generator (mulberry32)
// ---------------------------------------------------------------------------

function createRng(seed: number) {
  let s = seed >>> 0
  return function () {
    s = (s + 0x6d2b79f5) >>> 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) >>> 0
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function seedFromString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return Math.abs(hash)
}

/** Box-Muller transform to generate normally distributed random number */
function normalRandom(rng: () => number, mean: number, stdev: number): number {
  const u1 = Math.max(1e-10, rng())
  const u2 = rng()
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
  return mean + stdev * z
}

function weightedChoice<T>(items: T[], weights: number[], rng: () => number): T {
  const total = weights.reduce((a, b) => a + b, 0)
  let r = rng() * total
  for (let i = 0; i < items.length; i++) {
    r -= weights[i]
    if (r <= 0) return items[i]
  }
  return items[items.length - 1]
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setUTCDate(d.getUTCDate() + days)
  return d
}

function toISODate(date: Date): string {
  return date.toISOString().split('T')[0]
}

// ---------------------------------------------------------------------------
// Quiver Quantitative API (optional)
// ---------------------------------------------------------------------------

async function tryQuiverAPI(): Promise<boolean> {
  const apiKey = process.env.QUIVER_API_KEY
  if (!apiKey) return false

  console.log('[fetch-trades] QUIVER_API_KEY found, attempting Quiver Quantitative API...')
  // If key exists, we would fetch here. For now, just note it and fall through.
  // Real implementation would call: https://api.quiverquant.com/beta/bulk/congresstrading
  console.log('[fetch-trades] Quiver integration not yet implemented — using generated data')
  return false
}

// ---------------------------------------------------------------------------
// Main trade generation
// ---------------------------------------------------------------------------

interface RawPolitician {
  bioguideId: string
  name: string
  party: 'D' | 'R' | 'I'
  chamber: 'senate' | 'house'
  state: string
  committees: string[]
}

interface RawTrade {
  id: string
  bioguideId: string
  politicianName: string
  party: 'D' | 'R' | 'I'
  chamber: 'senate' | 'house'
  ticker: string
  company: string
  sector: string
  tradeType: 'buy' | 'sell'
  disclosureDate: string
  tradeDate: string
  amountRange: (typeof AMOUNT_RANGES)[number]
  returnVsSP500: number
  absoluteReturn: number
  sp500Return: number
  daysToDisclose: number
}

function generateTradesForPolitician(
  politician: RawPolitician,
  tradeCount: number
): RawTrade[] {
  const trades: RawTrade[] = []
  const rng = createRng(seedFromString(politician.bioguideId + '2025'))

  // Pick preferred sectors for this politician (based on committees or random)
  const preferredSectors = getPreferredSectors(politician, rng)

  for (let i = 0; i < tradeCount; i++) {
    const seed2 = createRng(seedFromString(politician.bioguideId + String(i)))

    // Distribute trades across season weeks with weighting toward weeks 3-5
    const weekWeights = [0.12, 0.14, 0.20, 0.22, 0.20, 0.12]
    const weekBoundaries = [
      { start: 0, end: 13 }, // Week 1: days 0-13
      { start: 14, end: 27 }, // Week 2: days 14-27
      { start: 28, end: 41 }, // Week 3: days 28-41
      { start: 42, end: 55 }, // Week 4: days 42-55
      { start: 56, end: 69 }, // Week 5: days 56-69
      { start: 70, end: 83 }, // Week 6: days 70-83
    ]
    const weekIdx = weekBoundaries.indexOf(
      weightedChoice(weekBoundaries, weekWeights, seed2)
    )
    const weekBound = weekBoundaries[weekIdx]
    const dayOffset = weekBound.start + Math.floor(seed2() * (weekBound.end - weekBound.start))
    const tradeDate = addDays(SEASON_START, Math.min(dayOffset, SEASON_DAYS))

    // Disclosure delay: mostly 1-45 days, ~15% late (>45 days)
    const isLate = seed2() < 0.15
    const daysToDisclose = isLate
      ? 46 + Math.floor(seed2() * 60) // 46-105 days
      : 1 + Math.floor(seed2() * 44) // 1-44 days
    const disclosureDate = addDays(tradeDate, daysToDisclose)

    // Select ticker — prefer politician's sector bias
    let ticker: string
    if (seed2() < 0.6 && preferredSectors.length > 0) {
      // 60% chance to trade in preferred sector
      const sectorTickers = TICKER_KEYS.filter(
        (t) => preferredSectors.includes(TICKERS[t].sector)
      )
      ticker = sectorTickers.length > 0
        ? sectorTickers[Math.floor(seed2() * sectorTickers.length)]
        : TICKER_KEYS[Math.floor(seed2() * TICKER_KEYS.length)]
    } else {
      ticker = TICKER_KEYS[Math.floor(seed2() * TICKER_KEYS.length)]
    }

    const tickerInfo = TICKERS[ticker]

    // Trade type: 60% buy, 40% sell
    const tradeType: 'buy' | 'sell' = seed2() < 0.6 ? 'buy' : 'sell'

    // Amount range — weighted distribution
    const amountRange = weightedChoice(
      AMOUNT_RANGES as unknown as (typeof AMOUNT_RANGES)[number][],
      AMOUNT_WEIGHTS,
      seed2
    )

    // Returns: normal distributions
    const absoluteReturn = normalRandom(seed2, 5, 15) // mean 5%, stdev 15%
    const sp500Return = normalRandom(seed2, 8, 10) // mean 8%, stdev 10%
    const returnVsSP500 = absoluteReturn - sp500Return

    // Unique trade ID
    const id = `${politician.bioguideId}-${ticker}-${toISODate(tradeDate)}-${i}`

    trades.push({
      id,
      bioguideId: politician.bioguideId,
      politicianName: politician.name,
      party: politician.party,
      chamber: politician.chamber,
      ticker,
      company: tickerInfo.company,
      sector: tickerInfo.sector,
      tradeType,
      disclosureDate: toISODate(disclosureDate),
      tradeDate: toISODate(tradeDate),
      amountRange,
      returnVsSP500: Math.round(returnVsSP500 * 100) / 100,
      absoluteReturn: Math.round(absoluteReturn * 100) / 100,
      sp500Return: Math.round(sp500Return * 100) / 100,
      daysToDisclose,
    })
  }

  return trades
}

function getPreferredSectors(politician: RawPolitician, rng: () => number): string[] {
  const sectors: string[] = []

  // Map committee names to sectors
  const committeeToSector: Record<string, string> = {
    finance: 'Finance',
    banking: 'Finance',
    financial: 'Finance',
    'ways and means': 'Finance',
    technology: 'Technology',
    science: 'Technology',
    intelligence: 'Technology',
    'armed services': 'Defense',
    defense: 'Defense',
    'homeland security': 'Defense',
    energy: 'Energy',
    environment: 'Energy',
    commerce: 'Retail',
    health: 'Healthcare',
    judiciary: 'Finance',
    agriculture: 'Materials',
    transportation: 'Industrials',
  }

  for (const committee of politician.committees ?? []) {
    const lower = committee.toLowerCase()
    for (const [keyword, sector] of Object.entries(committeeToSector)) {
      if (lower.includes(keyword) && !sectors.includes(sector)) {
        sectors.push(sector)
      }
    }
  }

  // If no committees matched, give random sector bias
  if (sectors.length === 0) {
    const allSectors = [
      'Technology',
      'Finance',
      'Healthcare',
      'Defense',
      'Energy',
      'Retail',
      'Industrials',
    ]
    sectors.push(allSectors[Math.floor(rng() * allSectors.length)])
  }

  return sectors
}

async function main() {
  console.log('[fetch-trades] Starting...')
  mkdirSync(OUT_DIR, { recursive: true })

  // Try real API first
  const gotRealData = await tryQuiverAPI()
  if (gotRealData) {
    console.log('[fetch-trades] Used real Quiver data — done')
    return
  }

  // Load politicians
  let politicians: RawPolitician[] = []
  try {
    const raw = readFileSync(POLITICIANS_FILE, 'utf8')
    politicians = JSON.parse(raw) as RawPolitician[]
    console.log(`[fetch-trades] Loaded ${politicians.length} politicians`)
  } catch {
    console.warn('[fetch-trades] Could not load _raw-politicians.json — using minimal set')
    // Should not happen in pipeline, but graceful fallback
    process.exit(1)
  }

  // Select 80-120 traders (not all politicians trade stocks)
  const rng = createRng(seedFromString('trade-selection-2025'))
  const shuffled = [...politicians].sort(() => rng() - 0.5)
  const traderCount = Math.min(Math.max(80, Math.floor(politicians.length * 0.8)), 120)
  const traders = shuffled.slice(0, traderCount)

  console.log(`[fetch-trades] Generating trades for ${traders.length} politicians...`)

  // Generate trade counts: ensure distribution of heavy/light traders
  const allTrades: RawTrade[] = []

  traders.forEach((politician, idx) => {
    const r = createRng(seedFromString(politician.bioguideId + 'count'))
    // 15% heavy traders (20+ trades), 25% mid (8-19 trades), 60% light (2-7 trades)
    let tradeCount: number
    if (idx < Math.floor(traders.length * 0.15)) {
      tradeCount = 20 + Math.floor(r() * 15) // 20-34
    } else if (idx < Math.floor(traders.length * 0.40)) {
      tradeCount = 8 + Math.floor(r() * 12) // 8-19
    } else {
      tradeCount = 2 + Math.floor(r() * 6) // 2-7
    }

    const trades = generateTradesForPolitician(politician, tradeCount)
    allTrades.push(...trades)
  })

  console.log(`[fetch-trades] Generated ${allTrades.length} trades`)

  // Verify we have enough
  if (allTrades.length < 200) {
    console.error(`[fetch-trades] Only ${allTrades.length} trades generated — need at least 200`)
    process.exit(1)
  }

  // Verify sector diversity
  const sectors = new Set(allTrades.map((t) => t.sector))
  console.log(`[fetch-trades] Sectors represented: ${[...sectors].join(', ')}`)

  if (sectors.size < 5) {
    console.error(`[fetch-trades] Only ${sectors.size} sectors — need at least 5`)
    process.exit(1)
  }

  writeFileSync(OUT_FILE, JSON.stringify(allTrades, null, 2))
  console.log(`[fetch-trades] Written to ${OUT_FILE}`)
}

main().catch((err) => {
  console.error('[fetch-trades] FAILED:', err)
  process.exit(1)
})
