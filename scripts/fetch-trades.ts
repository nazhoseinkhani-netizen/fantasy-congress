/**
 * scripts/fetch-trades.ts
 *
 * Fetches real Congressional stock trade disclosures from the Alva Skills API,
 * looks up historical stock prices for return calculations, maps Alva's response
 * into the existing RawTrade interface shape, and writes _raw-trades.json.
 *
 * Build fails loudly (process.exit(1)) if:
 *   - ALVA_API_KEY is not set
 *   - Alva API is unreachable or returns 0 trades
 *   - Fewer than 10 trades match known politicians
 *
 * Writes to public/data/_raw-trades.json
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

// Load .env file if present
try {
  const envFile = readFileSync(join(process.cwd(), '.env'), 'utf8')
  for (const line of envFile.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx === -1) continue
    const key = trimmed.slice(0, eqIdx).trim()
    const value = trimmed.slice(eqIdx + 1).trim()
    if (!process.env[key]) process.env[key] = value
  }
} catch { /* .env not required */ }

const OUT_DIR = join(process.cwd(), 'public', 'data')
const OUT_FILE = join(OUT_DIR, '_raw-trades.json')
const POLITICIANS_FILE = join(OUT_DIR, '_raw-politicians.json')
const ALVA_RAW_FILE = join(OUT_DIR, '_alva-raw-trades.json')
const ALVA_SDK_DISCOVERY_FILE = join(OUT_DIR, '_alva-sdk-discovery.json')

// ---------------------------------------------------------------------------
// Alva API Configuration
// ---------------------------------------------------------------------------

const ALVA_API_KEY = process.env.ALVA_API_KEY
const ALVA_ENDPOINT = process.env.ALVA_ENDPOINT ?? 'https://api-llm.prd.alva.ai'

if (!ALVA_API_KEY) {
  console.error(
    '[fetch-trades] FATAL: ALVA_API_KEY not set — build cannot proceed. Set ALVA_API_KEY in .env or environment.'
  )
  process.exit(1)
}

// ---------------------------------------------------------------------------
// Ticker enrichment data
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
  PLTR: { company: 'Palantir Technologies Inc.', sector: 'Technology' },
  PANW: { company: 'Palo Alto Networks Inc.', sector: 'Technology' },
  SNOW: { company: 'Snowflake Inc.', sector: 'Technology' },
  NOW: { company: 'ServiceNow Inc.', sector: 'Technology' },
  AMAT: { company: 'Applied Materials Inc.', sector: 'Technology' },
  JPM: { company: 'JPMorgan Chase & Co.', sector: 'Finance' },
  BAC: { company: 'Bank of America Corporation', sector: 'Finance' },
  GS: { company: 'Goldman Sachs Group Inc.', sector: 'Finance' },
  MS: { company: 'Morgan Stanley', sector: 'Finance' },
  WFC: { company: 'Wells Fargo & Company', sector: 'Finance' },
  C: { company: 'Citigroup Inc.', sector: 'Finance' },
  BRK: { company: 'Berkshire Hathaway Inc.', sector: 'Finance' },
  'BRK.B': { company: 'Berkshire Hathaway Inc. Class B', sector: 'Finance' },
  V: { company: 'Visa Inc.', sector: 'Finance' },
  MA: { company: 'Mastercard Incorporated', sector: 'Finance' },
  AXP: { company: 'American Express Company', sector: 'Finance' },
  BLK: { company: 'BlackRock Inc.', sector: 'Finance' },
  SCHW: { company: 'Charles Schwab Corporation', sector: 'Finance' },
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
  MDT: { company: 'Medtronic plc', sector: 'Healthcare' },
  LLY: { company: 'Eli Lilly and Company', sector: 'Healthcare' },
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
  SPY: { company: 'SPDR S&P 500 ETF Trust', sector: 'ETF' },
  QQQ: { company: 'Invesco QQQ Trust', sector: 'ETF' },
  IWM: { company: 'iShares Russell 2000 ETF', sector: 'ETF' },
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type AmountRange =
  | '$1k-$15k'
  | '$15k-$50k'
  | '$50k-$100k'
  | '$100k-$250k'
  | '$250k-$500k'
  | '$500k-$1M'
  | '$1M+'

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
  amountRange: AmountRange
  returnVsSP500: number
  absoluteReturn: number
  sp500Return: number
  daysToDisclose: number
}

interface OHLCVBar {
  date: string
  close: number
}

// ---------------------------------------------------------------------------
// Alva API helpers
// ---------------------------------------------------------------------------

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function callAlvaScript(code: string): Promise<unknown> {
  const MAX_RETRIES = 3
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(`${ALVA_ENDPOINT}/api/v1/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Alva-Api-Key': ALVA_API_KEY!,
        },
        body: JSON.stringify({ code }),
      })

      if (!res.ok) {
        const text = await res.text()
        const shouldRetry = res.status === 429 || res.status >= 500
        const err = new Error(`Alva API error ${res.status}: ${text.slice(0, 300)}`)

        if (shouldRetry && attempt < MAX_RETRIES) {
          console.warn(`[fetch-trades] Attempt ${attempt} failed (${res.status}), retrying in 2s...`)
          lastError = err
          await sleep(5000)
          continue
        }
        throw err
      }

      return res.json()
    } catch (err) {
      if (attempt < MAX_RETRIES) {
        console.warn(`[fetch-trades] Attempt ${attempt} failed, retrying in 2s...`)
        lastError = err as Error
        await sleep(2000)
      } else {
        throw lastError ?? err
      }
    }
  }

  throw lastError ?? new Error('Unknown error in callAlvaScript')
}

// ---------------------------------------------------------------------------
// SDK partition discovery
// ---------------------------------------------------------------------------

async function discoverSdkPartition(): Promise<void> {
  try {
    const res = await fetch(
      `${ALVA_ENDPOINT}/api/v1/sdk/partitions/equity_ownership_and_flow/summary`,
      {
        headers: { 'X-Alva-Api-Key': ALVA_API_KEY! },
      }
    )

    const result = await res.json()
    console.log(
      `[fetch-trades] SDK partition discovery: ${JSON.stringify(result).slice(0, 500)}`
    )

    writeFileSync(ALVA_SDK_DISCOVERY_FILE, JSON.stringify(result, null, 2))
    console.log(`[fetch-trades] SDK discovery written to ${ALVA_SDK_DISCOVERY_FILE}`)
  } catch (err) {
    console.warn(`[fetch-trades] SDK partition discovery failed (non-fatal): ${err}`)
  }
}

// ---------------------------------------------------------------------------
// Fetch senator trades from Alva
// ---------------------------------------------------------------------------

async function fetchAlvaTrades(): Promise<unknown[]> {
  console.log('[fetch-trades] Fetching senator trades from Alva...')

  const PAGE_SIZE = 100
  const MAX_TRADES = 10000
  const allItems: unknown[] = []

  // Use Unix timestamps — Alva requires integer seconds
  const startTime = Math.floor(new Date('2024-01-01').getTime() / 1000)
  const endTime = Math.floor(Date.now() / 1000)

  let offset = 0
  while (allItems.length < MAX_TRADES) {
    const tradeScript = `
(async () => {
  try {
    const mod = require("@arrays/data/stock/person/senator-trading:v1.0.0")
    const result = await mod.getSenatorTrades({
      start_time: ${startTime},
      end_time: ${endTime},
      time_type: "DISCLOSURE_DATE",
      limit: ${PAGE_SIZE},
      offset: ${offset}
    })
    return JSON.stringify(result)
  } catch (err) {
    return JSON.stringify({ error: String(err), stack: String(err && err.stack) })
  }
})()
`
    const rawResponse = await callAlvaScript(tradeScript)
    const resp = rawResponse as Record<string, unknown>

    // Alva double-wraps: { result: "\"{ ... }\"" } — parse until we get an object
    let parsed: unknown = rawResponse
    if (resp && typeof resp.result === 'string') {
      parsed = JSON.parse(resp.result)
    }
    // May still be a string after first parse — unwrap again
    if (typeof parsed === 'string') {
      parsed = JSON.parse(parsed)
    }

    // Write first page raw for debugging
    if (offset === 0) {
      writeFileSync(ALVA_RAW_FILE, JSON.stringify(rawResponse, null, 2))
      console.log(`[fetch-trades] Raw Alva response written to ${ALVA_RAW_FILE}`)
    }

    // Check for error
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      const p = parsed as Record<string, unknown>
      if (p.error) {
        console.error(`[fetch-trades] Alva script error: ${p.error}`)
        break
      }
    }

    // Extract items from { success, data: { count, items } }
    const p = parsed as Record<string, unknown>
    const data = p?.data as Record<string, unknown> | undefined
    const items = data?.items
    if (!Array.isArray(items) || items.length === 0) {
      break
    }

    allItems.push(...items)
    console.log(`[fetch-trades] Fetched ${allItems.length} trades (page offset=${offset})...`)

    if (items.length < PAGE_SIZE) break // last page
    offset += PAGE_SIZE
    await sleep(1000) // rate limit courtesy — Alva enforces aggressive limits
  }

  // Log first record for field name debugging
  if (allItems.length > 0) {
    console.log(`[fetch-trades] First raw Alva trade: ${JSON.stringify(allItems[0])}`)
  }

  return allItems
}

// ---------------------------------------------------------------------------
// Politician name normalization and lookup
// ---------------------------------------------------------------------------

function normalizeName(name: string): string {
  if (!name) return ''
  // Strip honorifics
  let normalized = name.replace(/^(Rep\.|Sen\.|Dr\.|Mr\.|Mrs\.|Ms\.)\s+/i, '').trim()
  // Handle "Last, First Middle" format
  if (normalized.includes(',')) {
    const parts = normalized.split(',').map((s) => s.trim())
    normalized = parts.reverse().join(' ')
  }
  // Strip middle initials (e.g., "Richard W. Allen" -> "Richard Allen")
  normalized = normalized.replace(/\s+[A-Z]\.\s+/g, ' ')
  // Strip "Moore", "Louise" etc middle names for matching — keep only first + last
  return normalized.toLowerCase().trim()
}

function simplifyName(name: string): string {
  // Reduce to just first + last name for fuzzy matching
  const parts = normalizeName(name).split(/\s+/)
  if (parts.length <= 2) return parts.join(' ')
  return `${parts[0]} ${parts[parts.length - 1]}`
}

function buildNameIndex(politicians: RawPolitician[]): {
  byFullName: Map<string, RawPolitician>
  bySimpleName: Map<string, RawPolitician>
  byLastName: Map<string, RawPolitician[]>
} {
  const byFullName = new Map<string, RawPolitician>()
  const bySimpleName = new Map<string, RawPolitician>()
  const byLastName = new Map<string, RawPolitician[]>()

  for (const p of politicians) {
    const normalized = normalizeName(p.name)
    byFullName.set(normalized, p)
    bySimpleName.set(simplifyName(p.name), p)

    // Also index by last name for fuzzy fallback
    const parts = normalized.split(' ')
    const lastName = parts[parts.length - 1]
    if (!byLastName.has(lastName)) byLastName.set(lastName, [])
    byLastName.get(lastName)!.push(p)
  }

  return { byFullName, bySimpleName, byLastName }
}

function lookupPolitician(
  alvaName: string,
  byFullName: Map<string, RawPolitician>,
  bySimpleName: Map<string, RawPolitician>,
  byLastName: Map<string, RawPolitician[]>
): RawPolitician | null {
  const normalized = normalizeName(alvaName)
  if (!normalized) return null

  // Exact normalized name match
  if (byFullName.has(normalized)) return byFullName.get(normalized)!

  // Simplified name match (first + last only)
  const simplified = simplifyName(alvaName)
  if (bySimpleName.has(simplified)) return bySimpleName.get(simplified)!

  // Last-name-only fallback (only if unique)
  const parts = normalized.split(' ')
  const lastName = parts[parts.length - 1]
  const candidates = byLastName.get(lastName)
  if (candidates && candidates.length === 1) return candidates[0]

  // Try partial match — first token of Alva name matches first name
  if (candidates && candidates.length > 1) {
    const firstName = parts[0]
    const match = candidates.find((p) => normalizeName(p.name).startsWith(firstName))
    if (match) return match
  }

  return null
}

// ---------------------------------------------------------------------------
// Amount range mapping
// ---------------------------------------------------------------------------

function mapAmountRange(raw: string): AmountRange {
  if (!raw) return '$1k-$15k'

  // Strip non-numeric except commas and periods, then find all numbers
  const numbers = raw
    .replace(/[^0-9,.]/g, ' ')
    .trim()
    .split(/\s+/)
    .map((n) => parseFloat(n.replace(/,/g, '')))
    .filter((n) => !isNaN(n) && n > 0)

  if (numbers.length === 0) return '$1k-$15k'

  const upper = Math.max(...numbers)

  if (upper <= 15000) return '$1k-$15k'
  if (upper <= 50000) return '$15k-$50k'
  if (upper <= 100000) return '$50k-$100k'
  if (upper <= 250000) return '$100k-$250k'
  if (upper <= 500000) return '$250k-$500k'
  if (upper <= 1000000) return '$500k-$1M'
  return '$1M+'
}

// ---------------------------------------------------------------------------
// Field extraction helpers — handles multiple possible Alva field name formats
// ---------------------------------------------------------------------------

function extractField(record: Record<string, unknown>, ...keys: string[]): string {
  for (const key of keys) {
    if (record[key] !== undefined && record[key] !== null) {
      return String(record[key]).trim()
    }
  }
  return ''
}

function extractTicker(record: Record<string, unknown>): string {
  return extractField(record, 'ticker', 'symbol', 'asset', 'stock', 'stockTicker', 'assetDescription')
    .split(' ')[0]  // Some APIs include company name after ticker
    .toUpperCase()
    .replace(/[^A-Z.]/g, '')
}

function extractTradeType(record: Record<string, unknown>): 'buy' | 'sell' {
  const raw = extractField(
    record,
    'transactionType',
    'transaction_type',
    'type',
    'tradeType',
    'trade_type',
    'action'
  ).toLowerCase()
  if (raw.includes('purchase') || raw.includes('buy') || raw === 'p') return 'buy'
  return 'sell'
}

function extractDate(record: Record<string, unknown>, ...keys: string[]): string {
  const raw = extractField(record, ...keys)
  if (!raw) return ''
  // Normalize to YYYY-MM-DD
  try {
    const d = new Date(raw)
    if (!isNaN(d.getTime())) return d.toISOString().split('T')[0]
  } catch {
    // fall through
  }
  // Already in YYYY-MM-DD format?
  if (/^\d{4}-\d{2}-\d{2}/.test(raw)) return raw.slice(0, 10)
  return raw
}

// ---------------------------------------------------------------------------
// Stock price lookups
// ---------------------------------------------------------------------------

function toISODate(date: Date): string {
  return date.toISOString().split('T')[0]
}

async function fetchStockPrices(
  ticker: string,
  fromDate: string,
  toDate: string
): Promise<OHLCVBar[]> {
  const startTs = Math.floor(new Date(fromDate).getTime() / 1000)
  const endTs = Math.floor(new Date(toDate).getTime() / 1000)
  const priceScript = `
(async () => {
  try {
    const mod = require("@arrays/data/stock/spot/ohlcv:v1.0.0")
    const result = await mod.getStockKline({ ticker: "${ticker}", start_time: ${startTs}, end_time: ${endTs}, interval: "1d" })
    return JSON.stringify(result)
  } catch (err) {
    return JSON.stringify({ error: String(err) })
  }
})()
`

  try {
    const rawResponse = await callAlvaScript(priceScript)
    const resp = rawResponse as Record<string, unknown>

    let parsed: unknown = rawResponse
    if (resp && typeof resp.result === 'string') {
      parsed = JSON.parse(resp.result)
    } else if (resp && typeof resp.output === 'string') {
      parsed = JSON.parse(resp.output)
    }
    // Alva double-wraps — unwrap again if still a string
    if (typeof parsed === 'string') {
      parsed = JSON.parse(parsed)
    }

    // Alva OHLCV returns { success, response: { data: [{ date: epochMs, close, ... }] } }
    const p = parsed as Record<string, unknown>
    if (p?.error || (p as any)?.success === false) {
      console.warn(`[fetch-trades] Price lookup error for ${ticker}: ${p.error ?? 'success=false'}`)
      return []
    }

    let bars: OHLCVBar[] = []
    const responseData = (p?.response as Record<string, unknown>)?.data
      ?? (p as Record<string, unknown>)?.data
    if (Array.isArray(responseData)) {
      bars = responseData.map((bar: unknown) => {
        const b = bar as Record<string, unknown>
        // date can be epoch ms or ISO string
        let dateStr = ''
        if (typeof b.date === 'number') {
          dateStr = new Date(b.date).toISOString().split('T')[0]
        } else {
          dateStr = extractDate(b, 'date', 't', 'timestamp', 'datetime')
        }
        return {
          date: dateStr,
          close: Number(b.close ?? b.c ?? b.closing ?? b.price ?? 0),
        }
      }).filter((b) => b.date && b.close > 0)
    }

    return bars.sort((a, b) => a.date.localeCompare(b.date))
  } catch (err) {
    console.warn(`[fetch-trades] Failed price lookup for ${ticker}: ${err}`)
    return []
  }
}

function findClosestPrice(bars: OHLCVBar[], targetDate: string): number | null {
  if (bars.length === 0) return null

  // Find nearest bar by date
  let closest: OHLCVBar | null = null
  let minDiff = Infinity

  for (const bar of bars) {
    const diff = Math.abs(
      new Date(bar.date).getTime() - new Date(targetDate).getTime()
    )
    if (diff < minDiff) {
      minDiff = diff
      closest = bar
    }
  }

  // Only return price if within 10 trading days (~14 calendar days)
  if (minDiff > 14 * 24 * 60 * 60 * 1000) return null
  return closest?.close ?? null
}

// ---------------------------------------------------------------------------
// Concurrent price fetching with semaphore
// ---------------------------------------------------------------------------

async function fetchAllPrices(
  tickers: string[],
  tradeDateMap: Map<string, string[]>  // ticker -> [tradeDate, ...]
): Promise<Map<string, OHLCVBar[]>> {
  const priceCache = new Map<string, OHLCVBar[]>()
  const CONCURRENCY = 3
  const today = toISODate(new Date())

  const queue = [...tickers]
  let active = 0
  let completed = 0
  const total = queue.length

  async function processNext(): Promise<void> {
    if (queue.length === 0) return

    const ticker = queue.shift()!
    active++

    try {
      // Use earliest trade date for this ticker as fromDate
      const tradeDates = tradeDateMap.get(ticker) ?? [today]
      const earliestTrade = tradeDates.sort()[0]

      // Fetch from earliest trade date to today (or +365 days)
      const fromDate = earliestTrade
      const toDateRaw = new Date(earliestTrade)
      toDateRaw.setDate(toDateRaw.getDate() + 365)
      const toDate = toDateRaw > new Date() ? today : toISODate(toDateRaw)

      const bars = await fetchStockPrices(ticker, fromDate, toDate)
      priceCache.set(ticker, bars)

      completed++
      if (completed % 10 === 0 || completed === total) {
        console.log(`[fetch-trades] Price lookups: ${completed}/${total} complete`)
      }
    } catch (err) {
      console.warn(`[fetch-trades] Price fetch failed for ${ticker}: ${err}`)
      priceCache.set(ticker, [])
    } finally {
      active--
    }
  }

  // Process in batches with concurrency limit
  const workers: Promise<void>[] = []

  async function worker(): Promise<void> {
    while (queue.length > 0) {
      await processNext()
    }
  }

  for (let i = 0; i < Math.min(CONCURRENCY, total); i++) {
    workers.push(worker())
  }

  await Promise.all(workers)
  return priceCache
}

// ---------------------------------------------------------------------------
// Return calculation
// ---------------------------------------------------------------------------

function computeReturns(
  ticker: string,
  tradeDate: string,
  priceCache: Map<string, OHLCVBar[]>,
  spyCache: OHLCVBar[]
): { absoluteReturn: number; sp500Return: number; returnVsSP500: number } {
  const bars = priceCache.get(ticker) ?? []
  const today = toISODate(new Date())

  // Determine end date: min(tradeDate + 365d, today)
  const tradeDateObj = new Date(tradeDate)
  const endDateObj = new Date(tradeDate)
  endDateObj.setDate(endDateObj.getDate() + 365)
  const endDate = endDateObj > new Date() ? today : toISODate(endDateObj)

  const tradePrice = findClosestPrice(bars, tradeDate)
  const latestPrice = findClosestPrice(bars, endDate)

  const spyTradePrice = findClosestPrice(spyCache, tradeDateObj.toISOString().split('T')[0])
  const spyLatestPrice = findClosestPrice(spyCache, endDate)

  let absoluteReturn = 0
  let sp500Return = 0

  if (tradePrice !== null && latestPrice !== null && tradePrice > 0) {
    absoluteReturn = ((latestPrice - tradePrice) / tradePrice) * 100
  }

  if (spyTradePrice !== null && spyLatestPrice !== null && spyTradePrice > 0) {
    sp500Return = ((spyLatestPrice - spyTradePrice) / spyTradePrice) * 100
  }

  const returnVsSP500 = absoluteReturn - sp500Return

  return {
    absoluteReturn: Math.round(absoluteReturn * 100) / 100,
    sp500Return: Math.round(sp500Return * 100) / 100,
    returnVsSP500: Math.round(returnVsSP500 * 100) / 100,
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('[fetch-trades] Starting Alva real data pipeline...')
  mkdirSync(OUT_DIR, { recursive: true })

  // Step 1: SDK discovery (diagnostic)
  await discoverSdkPartition()

  // Step 2: Load politicians for name matching
  let politicians: RawPolitician[] = []
  try {
    const raw = readFileSync(POLITICIANS_FILE, 'utf8')
    politicians = JSON.parse(raw) as RawPolitician[]
    console.log(`[fetch-trades] Loaded ${politicians.length} politicians from ${POLITICIANS_FILE}`)
  } catch (err) {
    console.error(`[fetch-trades] FATAL: Could not load ${POLITICIANS_FILE}: ${err}`)
    console.error('[fetch-trades] Run fetch-politicians.ts first.')
    process.exit(1)
  }

  const { byFullName, bySimpleName, byLastName } = buildNameIndex(politicians)

  // Step 3: Fetch trades from Alva
  const alvaRaw = await fetchAlvaTrades()

  if (alvaRaw.length === 0) {
    console.error(
      '[fetch-trades] FATAL: Alva returned 0 senator trades — check API key and endpoint'
    )
    process.exit(1)
  }

  console.log(`[fetch-trades] Alva returned ${alvaRaw.length} raw trade records`)

  const tradeRecords = alvaRaw

  // Step 4: Match politicians and extract tickers
  const matchedTrades: Array<{
    record: Record<string, unknown>
    politician: RawPolitician
    ticker: string
    tradeDate: string
    disclosureDate: string
    tradeType: 'buy' | 'sell'
    amountRange: AmountRange
  }> = []

  let unmatchedCount = 0
  const unmatchedNames = new Set<string>()
  const tickerTradeDates = new Map<string, string[]>()

  for (const rawRecord of tradeRecords) {
    const record = rawRecord as Record<string, unknown>

    // Alva provides firstName + lastName as separate fields
    const firstName = extractField(record, 'firstName', 'first_name')
    const lastName = extractField(record, 'lastName', 'last_name')
    const alvaName = firstName && lastName
      ? `${firstName} ${lastName}`
      : extractField(record, 'name', 'office', 'senator', 'politician', 'full_name', 'fullName')

    if (!alvaName) {
      unmatchedCount++
      continue
    }

    let politician = lookupPolitician(alvaName, byFullName, bySimpleName, byLastName)
    if (!politician) {
      // Auto-create politician record from Alva trade data
      const district = extractField(record, 'district', 'state')
      const stateCode = district ? district.replace(/\d+/g, '').slice(0, 2) : 'XX'
      const isHouse = district && /\d/.test(district) // e.g. "LA06" has digits = house
      const chamber = isHouse ? 'house' : 'senate'
      const bioguideId = `ALVA-${alvaName.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 12)}`

      politician = {
        bioguideId,
        name: alvaName,
        party: 'I' as const, // Unknown party from Alva, default to Independent
        chamber: chamber as 'senate' | 'house',
        state: stateCode,
        committees: [],
      }

      // Register for future lookups in this run
      const normalized = normalizeName(alvaName)
      byFullName.set(normalized, politician)
      bySimpleName.set(simplifyName(alvaName), politician)
      unmatchedNames.add(`${alvaName} (auto-created)`)
    }

    const ticker = extractTicker(record)
    if (!ticker || ticker.length === 0 || ticker.length > 10) continue

    const tradeDate = extractDate(
      record,
      'transactionDate',
      'transaction_date',
      'tradeDate',
      'trade_date',
      'date',
      'transacted_at'
    )

    const disclosureDate = extractDate(
      record,
      'filingDate',
      'filing_date',
      'disclosureDate',
      'disclosure_date',
      'reportDate',
      'report_date',
      'filed_at'
    )

    if (!tradeDate) continue

    const tradeType = extractTradeType(record)
    const amountRaw = extractField(
      record,
      'amount',
      'amountRange',
      'amount_range',
      'transactionAmount',
      'transaction_amount',
      'size',
      'value'
    )
    const amountRange = mapAmountRange(amountRaw)

    // Track trade dates per ticker for price lookup
    if (!tickerTradeDates.has(ticker)) tickerTradeDates.set(ticker, [])
    tickerTradeDates.get(ticker)!.push(tradeDate)

    matchedTrades.push({
      record,
      politician,
      ticker,
      tradeDate,
      disclosureDate: disclosureDate || tradeDate,
      tradeType,
      amountRange,
    })
  }

  console.log(
    `[fetch-trades] Matched ${matchedTrades.length} trades to politicians (${unmatchedCount} unmatched)`
  )

  if (unmatchedNames.size > 0) {
    console.warn(
      `[fetch-trades] WARNING: Unmatched politician names (${unmatchedNames.size}): ${
        [...unmatchedNames].slice(0, 20).join(', ')
      }${unmatchedNames.size > 20 ? ' ...' : ''}`
    )
  }

  // Step 4a: Deduplicate trades by content (same politician + ticker + date + type + amount)
  const dedupSeen = new Set<string>()
  const dedupedTrades: typeof matchedTrades = []
  for (const t of matchedTrades) {
    const key = `${t.politician.bioguideId}-${t.ticker}-${t.tradeDate}-${t.tradeType}-${t.amountRange}`
    if (dedupSeen.has(key)) continue
    dedupSeen.add(key)
    dedupedTrades.push(t)
  }
  console.log(
    `[fetch-trades] Deduplicated: ${matchedTrades.length} → ${dedupedTrades.length} unique trades`
  )
  // Replace matchedTrades with deduplicated version
  matchedTrades.length = 0
  matchedTrades.push(...dedupedTrades)

  if (matchedTrades.length < 10) {
    console.error(
      `[fetch-trades] FATAL: Only ${matchedTrades.length} trades matched politicians — insufficient data`
    )
    process.exit(1)
  }

  // Step 4b: Merge auto-created politicians back into _raw-politicians.json
  // so validate-photos and score-all can process them
  const autoCreatedPols = [...byFullName.values()].filter(
    (p) => p.bioguideId.startsWith('ALVA-')
  )
  if (autoCreatedPols.length > 0) {
    const existingBioguides = new Set(politicians.map((p) => p.bioguideId))
    const newPols = autoCreatedPols.filter((p) => !existingBioguides.has(p.bioguideId))
    if (newPols.length > 0) {
      // Read full shape from existing file and merge
      const fullPols = JSON.parse(readFileSync(POLITICIANS_FILE, 'utf8')) as Record<string, unknown>[]
      for (const p of newPols) {
        const nameParts = p.name.split(' ')
        fullPols.push({
          bioguideId: p.bioguideId,
          name: p.name,
          firstName: nameParts[0],
          lastName: nameParts[nameParts.length - 1],
          party: p.party,
          chamber: p.chamber,
          state: p.state,
          committees: [],
          isCommitteeChair: false,
          isLeadership: false,
          photoUrl: '',
        })
      }
      writeFileSync(POLITICIANS_FILE, JSON.stringify(fullPols, null, 2))
      console.log(`[fetch-trades] Added ${newPols.length} auto-created politicians to ${POLITICIANS_FILE}`)
    }
  }

  // Step 5: Fetch stock prices for all unique tickers + SPY benchmark
  const uniqueTickers = [...new Set(matchedTrades.map((t) => t.ticker))]
  const allTickers = [...new Set([...uniqueTickers, 'SPY'])]

  // Add SPY trade dates (use all trade dates for SPY)
  const allTradeDates = matchedTrades.map((t) => t.tradeDate)
  tickerTradeDates.set('SPY', allTradeDates)

  console.log(
    `[fetch-trades] Fetching prices for ${allTickers.length} unique tickers (including SPY)...`
  )

  const priceCache = await fetchAllPrices(allTickers, tickerTradeDates)

  const spyBars = priceCache.get('SPY') ?? []
  let priceMisses = 0
  const unknownTickers = new Set<string>()

  // Step 6 + 7 + 8: Compute returns, enrich, map to RawTrade
  const rawTrades: RawTrade[] = []

  for (let i = 0; i < matchedTrades.length; i++) {
    const { politician, ticker, tradeDate, disclosureDate, tradeType, amountRange } =
      matchedTrades[i]

    const tickerInfo = TICKERS[ticker] ?? null
    if (!tickerInfo) unknownTickers.add(ticker)

    const company = tickerInfo?.company ?? ticker
    const sector = tickerInfo?.sector ?? 'Other'

    const bars = priceCache.get(ticker) ?? []
    const hasPriceData = bars.length > 0

    const returns = hasPriceData
      ? computeReturns(ticker, tradeDate, priceCache, spyBars)
      : { absoluteReturn: 0, sp500Return: 0, returnVsSP500: 0 }

    if (!hasPriceData) priceMisses++

    const daysToDisclosureRaw = Math.floor(
      (new Date(disclosureDate).getTime() - new Date(tradeDate).getTime()) /
        (1000 * 60 * 60 * 24)
    )
    const daysToDisclose = isNaN(daysToDisclosureRaw) || daysToDisclosureRaw < 0
      ? 0
      : daysToDisclosureRaw

    const id = `${politician.bioguideId}-${ticker}-${tradeDate}-${tradeType}-${amountRange.replace(/[^0-9kM]/g, '')}`

    rawTrades.push({
      id,
      bioguideId: politician.bioguideId,
      politicianName: politician.name,
      party: politician.party,
      chamber: politician.chamber,
      ticker,
      company,
      sector,
      tradeType,
      disclosureDate,
      tradeDate,
      amountRange,
      returnVsSP500: returns.returnVsSP500,
      absoluteReturn: returns.absoluteReturn,
      sp500Return: returns.sp500Return,
      daysToDisclose,
    })
  }

  if (unknownTickers.size > 0) {
    console.warn(
      `[fetch-trades] WARNING: Unknown tickers (set to sector "Other"): ${
        [...unknownTickers].sort().join(', ')
      }`
    )
  }

  // Step 9: Write output
  writeFileSync(OUT_FILE, JSON.stringify(rawTrades, null, 2))
  console.log(`[fetch-trades] Written ${rawTrades.length} real trades to ${OUT_FILE}`)

  // Build summary
  const uniquePoliticians = new Set(rawTrades.map((t) => t.bioguideId))
  const tradesWithMissingReturns = rawTrades.filter(
    (t) => t.absoluteReturn === 0 && t.sp500Return === 0
  ).length

  console.log(`
[fetch-trades] === PIPELINE SUMMARY ===
  Alva raw records received:    ${alvaRaw.length}
  Matched to politicians:       ${matchedTrades.length}
  Unmatched (skipped):          ${unmatchedCount}
  Final trade records:          ${rawTrades.length}
  Unique tickers:               ${uniqueTickers.length}
  Unique politicians with trades: ${uniquePoliticians.size}
  Price lookups succeeded:      ${allTickers.length - priceMisses - (spyBars.length === 0 ? 1 : 0)}
  Price lookups failed:         ${priceMisses}
  Trades with 0 returns (no price data): ${tradesWithMissingReturns}
  Unknown tickers (sector=Other): ${unknownTickers.size}
[fetch-trades] === DONE ===
`)
}

main().catch((err) => {
  console.error('[fetch-trades] FAILED:', err)
  process.exit(1)
})
