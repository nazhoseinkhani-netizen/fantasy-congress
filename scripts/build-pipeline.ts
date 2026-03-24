/**
 * scripts/build-pipeline.ts
 *
 * Orchestrates the full data pipeline in sequence:
 * 1. Fetch politicians from Congress.gov API
 * 2. Fetch real trade data from Alva API
 * 3. Validate politician photos with fallback chain
 * 4. Compute season window from real trade dates
 * 5. Compute all fantasy scores and Insider Trading Risk Scores
 * 6. Generate demo league data
 *
 * Run via: npx tsx scripts/build-pipeline.ts
 * Or via:  npm run fetch-data
 */

import { execSync } from 'child_process'
import { join } from 'path'
import { readFileSync, existsSync } from 'fs'

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

const PROJECT_ROOT = process.cwd()

function run(label: string, scriptPath: string) {
  console.log(`\n${label}`)
  console.log('─'.repeat(50))
  execSync(`npx tsx ${scriptPath}`, {
    stdio: 'inherit',
    cwd: PROJECT_ROOT,
  })
}

async function main() {
  // Skip pipeline on Vercel — use committed pre-built data files
  // Set REBUILD_DATA=1 to force pipeline even on Vercel
  const dataDir = join(process.cwd(), 'public', 'data')
  const hasData = existsSync(join(dataDir, 'politicians.json')) && existsSync(join(dataDir, 'trades.json'))
  if (hasData && process.env.VERCEL && !process.env.REBUILD_DATA) {
    console.log('\n[build-pipeline] Vercel build detected with pre-built data — skipping pipeline.\n')
    return
  }
  if (hasData && !process.env.ALVA_API_KEY) {
    console.log('\n[build-pipeline] Pre-built data found and no ALVA_API_KEY set — skipping pipeline.\n')
    return
  }

  const start = Date.now()
  console.log('\n╔════════════════════════════════════════════════════╗')
  console.log('║         Fantasy Congress Data Pipeline              ║')
  console.log('╚════════════════════════════════════════════════════╝')

  run(
    '[1/6] Fetching politicians from Congress.gov...',
    join('scripts', 'fetch-politicians.ts')
  )

  run(
    '[2/6] Fetching real trade data from Alva...',
    join('scripts', 'fetch-trades.ts')
  )

  run(
    '[3/6] Validating politician photos...',
    join('scripts', 'validate-photos.ts')
  )

  run(
    '[4/6] Computing season window from trade dates...',
    join('scripts', 'compute-season.ts')
  )

  run(
    '[5/6] Computing fantasy scores and risk assessments...',
    join('scripts', 'score-all.ts')
  )

  run(
    '[6/6] Generating demo data...',
    join('scripts', 'generate-demo.ts')
  )

  const elapsed = ((Date.now() - start) / 1000).toFixed(1)
  console.log('\n╔════════════════════════════════════════════════════╗')
  console.log(`║  Build pipeline complete in ${elapsed}s`.padEnd(52) + '║')
  console.log('╚════════════════════════════════════════════════════╝\n')
}

main().catch((err) => {
  console.error('\nBUILD PIPELINE FAILED:', err.message ?? err)
  process.exit(1)
})
