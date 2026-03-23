/**
 * scripts/build-pipeline.ts
 *
 * Orchestrates the full data pipeline in sequence:
 * 1. Fetch politicians from Congress.gov API
 * 2. Generate trade data (with realistic fallback)
 * 3. Validate politician photos with fallback chain
 * 4. Compute all fantasy scores and Insider Trading Risk Scores
 * 5. Write build report
 *
 * Run via: npx tsx scripts/build-pipeline.ts
 * Or via:  npm run fetch-data
 */

import { execSync } from 'child_process'
import { join } from 'path'

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
  const start = Date.now()
  console.log('\n╔════════════════════════════════════════════════════╗')
  console.log('║         Fantasy Congress Data Pipeline              ║')
  console.log('╚════════════════════════════════════════════════════╝')

  run(
    '[1/4] Fetching politicians from Congress.gov...',
    join('scripts', 'fetch-politicians.ts')
  )

  run(
    '[2/4] Generating trade data...',
    join('scripts', 'fetch-trades.ts')
  )

  run(
    '[3/4] Validating politician photos...',
    join('scripts', 'validate-photos.ts')
  )

  run(
    '[4/4] Computing fantasy scores and risk assessments...',
    join('scripts', 'score-all.ts')
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
