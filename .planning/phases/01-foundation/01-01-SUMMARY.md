---
phase: 01-foundation
plan: 01
subsystem: infra
tags: [nextjs, typescript, tailwind, shadcn, next-themes, zustand, tanstack-query, motion, date-fns]

# Dependency graph
requires: []
provides:
  - Next.js 16 project bootstrapped with TypeScript, Tailwind CSS 4, App Router, static export
  - shadcn/ui initialized with dark mode CSS variables
  - All TypeScript interfaces for politicians, trades, scoring, and demo data
  - DEFAULT_SCORING_CONFIG and DEFAULT_INSIDER_RISK_CONFIG as configurable objects
  - SEASON_WEEKS defining 6-week demo season boundaries
  - Barrel export at src/types/index.ts
affects: [02-scoring-engine, 03-design-system, 04-data-pipeline, 05-demo-data]

# Tech tracking
tech-stack:
  added:
    - next@16.2.1
    - react@19.2.4
    - typescript@5
    - tailwindcss@4
    - shadcn/ui CLI v4 (new-york style, dark mode default)
    - zustand@5
    - @tanstack/react-query@5
    - motion@12
    - date-fns@4
    - next-themes@0.4.6
    - tsx@4 (dev)
  patterns:
    - Static export via next.config.ts output: 'export' + images.unoptimized: true
    - ThemeProvider wrapping app with defaultTheme dark and suppressHydrationWarning
    - TypeScript interfaces as named exports with barrel re-exports from src/types/index.ts
    - Scoring config as typed TypeScript const objects (not JSON), importable anywhere

key-files:
  created:
    - next.config.ts (static export + unoptimized images)
    - src/app/layout.tsx (ThemeProvider, dark mode, suppressHydrationWarning)
    - src/app/globals.css (Tailwind v4 imports + shadcn CSS variables)
    - src/types/politician.ts (Politician, InsiderRiskBreakdown, Party, Chamber, InsiderRiskTier, SalaryTier)
    - src/types/trade.ts (Trade, TradeScoreBreakdown, TradeType, AmountRange)
    - src/types/scoring.ts (ScoringConfig, TradeScore, PoliticianScore, InsiderRiskConfig, BonusType, PenaltyType, SeasonWeek)
    - src/types/demo.ts (League, Team, Roster, WeekSchedule, Matchup, WeekResult, DemoState)
    - src/types/index.ts (barrel re-exports)
    - src/lib/scoring/config.ts (DEFAULT_SCORING_CONFIG, DEFAULT_INSIDER_RISK_CONFIG, SEASON_WEEKS)
    - scripts/build-pipeline.ts (placeholder for Plan 04)
    - public/data/.gitkeep (directory placeholder for static JSON output)
  modified:
    - package.json (prebuild/fetch-data/dev scripts, all dependencies)

key-decisions:
  - "Static export configured at project bootstrap: output: 'export' + images.unoptimized: true — all downstream plans build against this"
  - "Scoring config defined as TypeScript const (not JSON) for type safety and IDE autocomplete"
  - "All TypeScript types defined before any implementation — stable contracts for Plans 02-05"
  - "ThemeProvider wraps the entire app at layout.tsx level with dark mode default and enableSystem: false"

patterns-established:
  - "Type imports: import type { Politician } from '@/types' — use barrel export"
  - "Scoring config: import { DEFAULT_SCORING_CONFIG } from '@/lib/scoring/config'"
  - "Static JSON output goes to public/data/ — fetched client-side via TanStack Query"

requirements-completed: [DATA-02, DATA-03, DATA-05, SCORE-06]

# Metrics
duration: 4min
completed: 2026-03-23
---

# Phase 1 Plan 1: Bootstrap + TypeScript Contracts Summary

**Next.js 16 static-export project with shadcn/ui dark mode, full TypeScript data layer contracts, and config-driven scoring system ready for downstream implementation**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-23T15:01:25Z
- **Completed:** 2026-03-23T15:05:43Z
- **Tasks:** 2
- **Files modified:** 11

## Accomplishments
- Next.js 16.2.1 project bootstrapped with TypeScript, Tailwind CSS 4, App Router, static export (`output: 'export'`)
- shadcn/ui v4 initialized with dark mode CSS variables; ThemeProvider wraps app with `defaultTheme="dark"`
- All TypeScript interfaces for the full data layer defined and compiling: Politician, Trade, ScoringConfig, League, Team, Matchup, etc.
- DEFAULT_SCORING_CONFIG with all point values, multipliers, bonuses, and penalties defined as configurable TypeScript constants
- Build pipeline script placeholder and public/data/ directory ready for Plan 04

## Task Commits

Each task was committed atomically:

1. **Task 1: Bootstrap Next.js 16 with static export and ThemeProvider** - `6a865c4` (feat)
2. **Task 2: Define all TypeScript interfaces and scoring config** - `1ac503f` (feat)

**Plan metadata:** (docs commit — see below)

## Files Created/Modified
- `next.config.ts` - Static export configuration with unoptimized images
- `package.json` - All dependencies + prebuild/fetch-data/dev --turbopack scripts
- `src/app/layout.tsx` - ThemeProvider wrapping, dark mode default, suppressHydrationWarning
- `src/app/globals.css` - Tailwind v4 imports + shadcn/ui OKLCH CSS variable theme
- `src/types/politician.ts` - Politician interface with InsiderRiskBreakdown, Party, Chamber, SalaryTier
- `src/types/trade.ts` - Trade interface with TradeScoreBreakdown, TradeType, AmountRange
- `src/types/scoring.ts` - ScoringConfig, TradeScore, PoliticianScore, InsiderRiskConfig, BonusType, PenaltyType, SeasonWeek
- `src/types/demo.ts` - League, Team, Roster, WeekSchedule, Matchup, WeekResult, DemoState
- `src/types/index.ts` - Barrel re-exports all type modules
- `src/lib/scoring/config.ts` - DEFAULT_SCORING_CONFIG, DEFAULT_INSIDER_RISK_CONFIG, SEASON_WEEKS
- `scripts/build-pipeline.ts` - Placeholder for Plan 04 data pipeline
- `public/data/.gitkeep` - Directory placeholder for static JSON output

## Decisions Made
- Static export configured at project bootstrap: `output: 'export'` + `images: { unoptimized: true }` — all downstream plans build against this constraint
- Scoring config defined as TypeScript const (not JSON) — type safety, IDE autocomplete, import flexibility
- All TypeScript types defined before any implementation — stable contracts for Plans 02-05

## Deviations from Plan

### Minor Deviation: Temp Directory Bootstrap

**[Rule 3 - Blocking] Used temp directory for create-next-app**
- **Found during:** Task 1 (bootstrap)
- **Issue:** `create-next-app` rejects directories with capital letters in the path component. `/Users/solofilms/FantasyCongress` has capital F and C which triggered an npm naming restriction error.
- **Fix:** Bootstrapped in `/tmp/fantasy-congress-app` then rsync'd all files (excluding .git) to `/Users/solofilms/FantasyCongress`. Result is identical to direct bootstrap.
- **Files modified:** All bootstrapped files (same content as direct bootstrap)
- **Verification:** `npm run dev` starts successfully and responds 200
- **Committed in:** `6a865c4` (Task 1 commit, included in initial commit)

---

**Total deviations:** 1 auto-fixed (1 blocking/workaround)
**Impact on plan:** Workaround was necessary due to npm naming restriction. No functional impact. All acceptance criteria pass.

## Issues Encountered
- `create-next-app@16` rejects directory names with capital letters — worked around with temp dir + rsync. No impact on output.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Next.js 16 project with all dependencies installed and compiling
- TypeScript interfaces stable — Plans 02-05 can import from `@/types` immediately
- Scoring config exported from `@/lib/scoring/config` for Plan 02 (Scoring Engine)
- public/data/ directory ready for Plan 04 (Data Pipeline) JSON output
- No blockers for any downstream plan

---
*Phase: 01-foundation*
*Completed: 2026-03-23*
