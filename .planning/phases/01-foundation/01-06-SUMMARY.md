---
phase: 01-foundation
plan: 06
subsystem: scoring-engine
tags: [scoring, bug-fix, tdd, data-pipeline]
dependency_graph:
  requires: [01-04-scoring-engine, 01-05-demo-data]
  provides: [corrected-season-points, SCORE-03-requirement]
  affects: [politicians.json, trades.json, leagues.json, matchups.json]
tech_stack:
  added: []
  patterns: [TDD-red-green, pipeline-regeneration]
key_files:
  created: []
  modified:
    - src/lib/scoring/engine.ts
    - src/lib/scoring/__tests__/engine.test.ts
    - public/data/politicians.json
    - public/data/trades.json
    - public/data/build-report.json
decisions:
  - "activityBonus applied at politician level in scorePolitician() per STATE.md decision — not per-trade in detectBonuses()"
  - "Existing aggregate test updated to correct expected value (21 not 11 for 2 trades) — was asserting buggy behavior"
metrics:
  duration: 148
  completed_date: "2026-03-23T16:03:01Z"
  tasks_completed: 2
  files_modified: 5
---

# Phase 01 Plan 06: Activity Bonus Fix Summary

**One-liner:** Fixed missing activityBonus (+5/trade) in scorePolitician() via TDD and regenerated all 82 politician scores

## What Was Built

The scoring engine's `scorePolitician()` function was missing the activity bonus computation — `config.bonuses.activityBonus` (value: 5) was defined in `ScoringConfig` but never applied. All 82 politicians' `seasonPoints` were understated by `5 * tradeCount`.

### Task 1: TDD Fix — engine.ts + test

**RED:** Added two failing test cases to `engine.test.ts`:
- `includes activityBonus (5 * tradeCount) in seasonPoints` — asserts 3 trades produce seasonPoints = tradeTotal + 15
- `does not add activityBonus when trade list is empty` — confirms 0 * 5 = 0

Tests correctly failed: "expected 31 to be close to 46, received difference is 15"

**GREEN:** Modified `scorePolitician()` in `engine.ts` at line 108:
```typescript
// Before (bug):
const seasonPoints = tradeScores.reduce((sum, s) => sum + s.total, 0)

// After (fixed):
const tradeTotal = tradeScores.reduce((sum, s) => sum + s.total, 0)
const activityBonus = trades.length * config.bonuses.activityBonus
const seasonPoints = tradeTotal + activityBonus
```

All 14 tests pass.

### Task 2: Pipeline Regeneration

Ran `npm run fetch-data` (5-step pipeline):
1. fetch-politicians — 103 politicians (fallback dataset, API rate-limited)
2. fetch-trades — 815 trades generated for 82 politicians
3. validate-photos — 100 fallback, 3 initials
4. score-all — 82 politicians scored with corrected activityBonus
5. generate-demo — leagues.json and matchups.json regenerated

**Verification:** `seasonPoints = tradeTotal + (tradeCount * 5)` confirmed for 5 sampled politicians:
- Nancy Pelosi: 22 trades, 364.99 + 110 = 474.99 ✓
- Don Young: 18 trades, 180.31 + 90 = 270.31 ✓
- Shelley Capito: 3 trades, 108.57 + 15 = 123.57 ✓
- Haley Stevens: 2 trades, -20.31 + 10 = -10.31 ✓
- Ruben Gallego: 19 trades, -771.31 + 95 = -676.31 ✓

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Updated existing aggregate test to reflect correct expected value**
- **Found during:** Task 1 GREEN phase
- **Issue:** Existing test `aggregates trade scores into season total` expected `seasonPoints = 11` (20 + (-9) for 2 trades), which was the buggy/pre-fix behavior. After fixing engine.ts, the correct value is `21` (11 + 2*5 activityBonus).
- **Fix:** Updated test assertion from `toBeCloseTo(11)` to `toBeCloseTo(21)` and updated comment to document the activityBonus contribution
- **Files modified:** `src/lib/scoring/__tests__/engine.test.ts`
- **Commit:** f5cf12a

## Commits

| Hash | Type | Description |
|------|------|-------------|
| 7a3d122 | test | Add failing tests for activityBonus (RED phase) |
| f5cf12a | feat | Add activityBonus computation to scorePolitician() (GREEN phase) |
| 50b98d1 | feat | Regenerate pipeline data with corrected activity bonus scoring |

## Requirements Satisfied

- **SCORE-03:** Activity Bonus (+5/trade) is now computed and included in all politician seasonPoints

## Self-Check: PASSED

- [x] `src/lib/scoring/engine.ts` — exists and contains `activityBonus` (2 occurrences)
- [x] `src/lib/scoring/__tests__/engine.test.ts` — exists and contains `activityBonus` (7 occurrences)
- [x] `public/data/politicians.json` — exists with 82 politicians
- [x] All 14 unit tests pass: `npx vitest run src/lib/scoring/__tests__/engine.test.ts`
- [x] Spot-check verification: seasonPoints = tradeSum + (tradeCount * 5) for 5 politicians
- [x] Commits 7a3d122, f5cf12a, 50b98d1 exist in git log
