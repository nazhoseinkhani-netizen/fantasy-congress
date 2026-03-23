/**
 * scripts/validate-photos.ts
 *
 * Validates photo URLs for all politicians using a fallback chain:
 * 1. bioguide.congress.gov/bioguide/photo/{first}/{bioguideId}.jpg
 * 2. unitedstates.github.io/images/congress/450x550/{bioguideId}.jpg
 * 3. unitedstates.github.io/images/congress/original/{bioguideId}.jpg
 * 4. Initials SVG data URI (generated locally, never fails)
 *
 * Uses max 10 concurrent requests to avoid rate limiting.
 * Writes updated politicians to public/data/_validated-politicians.json
 */

import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const DATA_DIR = join(process.cwd(), 'public', 'data')
const IN_FILE = join(DATA_DIR, '_raw-politicians.json')
const OUT_FILE = join(DATA_DIR, '_validated-politicians.json')

interface RawPolitician {
  bioguideId: string
  name: string
  firstName: string
  lastName: string
  party: 'D' | 'R' | 'I'
  chamber: 'senate' | 'house'
  state: string
  district?: string
  committees: string[]
  isCommitteeChair: boolean
  isLeadership: boolean
  photoUrl: string
}

interface ValidationStats {
  validated: number
  fallbackUsed: number
  initialsGenerated: number
}

const PARTY_COLORS: Record<string, string> = {
  D: '#3B82F6',
  R: '#EF4444',
  I: '#22C55E',
}

function getInitials(firstName: string, lastName: string): string {
  const f = (firstName || '').trim()
  const l = (lastName || '').trim()
  if (f && l) return `${f[0]}${l[0]}`.toUpperCase()
  if (l) return l.slice(0, 2).toUpperCase()
  if (f) return f.slice(0, 2).toUpperCase()
  return '?'
}

function generateInitialsSvg(politician: RawPolitician): string {
  const initials = getInitials(politician.firstName, politician.lastName)
  const color = PARTY_COLORS[politician.party] ?? '#6B7280'
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect fill="${color}" width="200" height="200"/><text x="50%" y="50%" fill="white" font-size="72" font-family="sans-serif" text-anchor="middle" dominant-baseline="central">${initials}</text></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

function getPhotoUrls(bioguideId: string): string[] {
  const first = bioguideId[0].toUpperCase()
  return [
    `https://bioguide.congress.gov/bioguide/photo/${first}/${bioguideId}.jpg`,
    `https://unitedstates.github.io/images/congress/450x550/${bioguideId}.jpg`,
    `https://unitedstates.github.io/images/congress/original/${bioguideId}.jpg`,
  ]
}

async function checkUrl(url: string, timeoutMs = 5000): Promise<boolean> {
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    const res = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      redirect: 'follow',
    })
    clearTimeout(timer)
    return res.ok
  } catch {
    return false
  }
}

async function validatePoliticianPhoto(
  politician: RawPolitician,
  stats: ValidationStats
): Promise<string> {
  const urls = getPhotoUrls(politician.bioguideId)

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i]
    const ok = await checkUrl(url)
    if (ok) {
      if (i === 0) {
        stats.validated++
      } else {
        stats.fallbackUsed++
      }
      return url
    }
  }

  // All URLs failed — generate initials SVG
  stats.initialsGenerated++
  return generateInitialsSvg(politician)
}

/** Run at most `maxConcurrent` promises at a time */
async function runWithConcurrencyLimit<T>(
  tasks: (() => Promise<T>)[],
  maxConcurrent: number
): Promise<T[]> {
  const results: T[] = new Array(tasks.length)
  let nextIdx = 0

  async function worker() {
    while (true) {
      const idx = nextIdx++
      if (idx >= tasks.length) break
      results[idx] = await tasks[idx]()
    }
  }

  const workers = Array.from({ length: maxConcurrent }, () => worker())
  await Promise.all(workers)
  return results
}

async function main() {
  console.log('[validate-photos] Starting...')

  const politicians: RawPolitician[] = JSON.parse(readFileSync(IN_FILE, 'utf8'))
  console.log(`[validate-photos] Validating photos for ${politicians.length} politicians...`)

  const stats: ValidationStats = {
    validated: 0,
    fallbackUsed: 0,
    initialsGenerated: 0,
  }

  let processed = 0
  const tasks = politicians.map((politician) => async () => {
    const photoUrl = await validatePoliticianPhoto(politician, stats)
    processed++
    if (processed % 25 === 0 || processed === politicians.length) {
      process.stdout.write(
        `  Progress: ${processed}/${politicians.length} (${stats.validated} validated, ${stats.fallbackUsed} fallback, ${stats.initialsGenerated} initials)\r`
      )
    }
    return { ...politician, photoUrl }
  })

  const validatedPoliticians = await runWithConcurrencyLimit(tasks, 10)
  console.log('\n[validate-photos] Validation complete:')
  console.log(`  - Primary URL validated: ${stats.validated}`)
  console.log(`  - Fallback URL used: ${stats.fallbackUsed}`)
  console.log(`  - Initials SVG generated: ${stats.initialsGenerated}`)

  // Verify no empty photoUrls
  const emptyPhotos = validatedPoliticians.filter((p) => !p.photoUrl)
  if (emptyPhotos.length > 0) {
    console.error(`[validate-photos] ${emptyPhotos.length} politicians still have empty photoUrl!`)
    process.exit(1)
  }

  writeFileSync(OUT_FILE, JSON.stringify(validatedPoliticians, null, 2))
  console.log(`[validate-photos] Written to ${OUT_FILE}`)

  // Write stats for build report
  const statsFile = join(DATA_DIR, '_photo-stats.json')
  writeFileSync(statsFile, JSON.stringify(stats, null, 2))
}

main().catch((err) => {
  console.error('[validate-photos] FAILED:', err)
  process.exit(1)
})
