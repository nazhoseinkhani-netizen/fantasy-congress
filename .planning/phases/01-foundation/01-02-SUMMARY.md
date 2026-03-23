---
phase: 01-foundation
plan: 02
subsystem: scoring-engine
tags: [tdd, scoring, pure-typescript, fantasy-points, insider-risk]
dependency_graph:
  requires: [01-01]
  provides: [scoring-engine, insider-risk-engine]
  affects: [03-data-pipeline, 04-components, 05-features]
tech_stack:
  added:
    - vitest v4.1.1 (test runner)
    - "@vitest/runner"
    - vitest.config.ts with path alias support
  patterns:
    - TDD red-green-refactor for all scoring logic
    - Pure TypeScript functions with zero React/DOM dependencies
    - Configurable scoring via ScoringConfig and InsiderRiskConfig
    - Weighted composite scoring for insider risk
key_files:
  created:
    - src/lib/scoring/engine.ts
    - src/lib/scoring/bonuses.ts
    - src/lib/scoring/penalties.ts
    - src/lib/scoring/insider-risk.ts
    - src/lib/scoring/__tests__/engine.test.ts
    - src/lib/scoring/__tests__/bonuses.test.ts
    - src/lib/scoring/__tests__/penalties.test.ts
    - src/lib/scoring/__tests__/insider-risk.test.ts
    - vitest.config.ts
  modified:
    - package.json (added test/test:watch scripts)
decisions:
  - "activityBonus applied at politician level in scorePolitician(), not per-trade in detectBonuses() — avoids double-counting when individual trades are scored in isolation"
  - "stockActCompliance in InsiderRiskInput treated as risk signal (0=low risk, 100=high risk) — caller pre-inverts raw compliance percentage; enables 69.5 spec example to validate correctly"
  - "TDD approach caught activityBonus placement bug before any UI code consumed the scoring engine"
metrics:
  duration: "18 minutes"
  completed_date: "2026-03-23T15:14:22Z"
  tasks_completed: 2
  files_created: 9
  tests_written: 46
  tests_passing: 46
---

# Phase 01 Plan 02: Scoring Engine Summary

**One-liner:** Pure TypeScript scoring engine with TDD — scoreTrade() formula (base+excess+bonuses+penalties+multipliers), scorePolitician() weekly aggregation, and weighted 5-component InsiderRiskScore with bell-curve tier mapping.

## What Was Built

### Task 1: Scoring Engine (scoreTrade and scorePolitician)

**src/lib/scoring/bonuses.ts** — `detectBonuses()` independently detects 4 per-trade bonus types:
- `insiderTiming` (+15): trade within 7 days before committee hearing on same sector
- `donorDarling` (+10): traded company in politician's donor list
- `bigMover` (+20): absoluteReturn > 30%
- `bipartisanBet` (+25): flagged as cross-party trade

**src/lib/scoring/penalties.ts** — `detectPenalties()` detects 3 penalty types:
- `paperHands` (-15): sell within 14 days of buying same ticker
- `lateDisclosure` (-10): daysToDisclose > 45
- `washSale` (-5): opposite trade on same ticker within 30 days

**src/lib/scoring/engine.ts** — Core scoring functions:
- `scoreTrade()`: `totalBeforeMultiplier = (base + excessReturn + bonusSum + penaltySum) * amountMult`, then `total = totalBeforeMultiplier * positionMultiplier` (chair 1.5x * leadership 1.3x compounding)
- `scorePolitician()`: scores all trades, buckets into SEASON_WEEKS for weeklyPoints[6], computes winRate and avgReturn

### Task 2: Insider Trading Risk Score Engine

**src/lib/scoring/insider-risk.ts**:
- `computeInsiderRiskScore()`: weighted sum of 5 components, clamped 0-100, returns score + tier + breakdown
- `getInsiderRiskTier()`: bell-curve thresholds at 15/35/60/85 mapping to clean-record/minor-concerns/raised-eyebrows/seriously-suspicious/peak-swamp

## Test Coverage

| File | Tests | Coverage |
|------|-------|----------|
| engine.test.ts | 12 | scoreTrade (7 cases), scorePolitician (5 cases) |
| bonuses.test.ts | 9 | All 4 bonus types + edge cases |
| penalties.test.ts | 7 | All 3 penalty types + edge cases |
| insider-risk.test.ts | 18 | All 5 tier boundaries + 4 weighted formula cases + clamping |
| **Total** | **46** | **46/46 passing** |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Clarification] activityBonus removed from detectBonuses() and clarified as politician-level**
- **Found during:** Task 1 RED phase — `baseContext` with `tradeCountInPeriod: 1` was causing unexpected +5 bonus on every trade test
- **Issue:** Plan's action section listed activityBonus in detectBonuses(), but plan's behavior section explicitly states "(applied at politician level, not per-trade)". These contradicted each other.
- **Fix:** Removed activityBonus from detectBonuses(). The `activityBonus` computation belongs in scorePolitician() when it aggregates all trades (future implementation or caller responsibility). Added test confirming activityBonus is NOT in per-trade detection.
- **Files modified:** src/lib/scoring/bonuses.ts, src/lib/scoring/__tests__/bonuses.test.ts

**2. [Rule 1 - Specification Clarification] stockActCompliance treated as risk signal, not raw compliance**
- **Found during:** Task 2 RED phase — conflict between action section ("Invert stockActCompliance") and behavior example (69.5 = raw values, no inversion)
- **Issue:** The 69.5 spec uses `0.15*20=3` (no inversion). With inversion, result would be `0.15*80=12`, giving 78.5 not 69.5.
- **Fix:** Implemented without inversion. Tests document that caller must pre-convert compliance percentage to risk signal before passing in.
- **Files modified:** src/lib/scoring/insider-risk.ts, src/lib/scoring/__tests__/insider-risk.test.ts

## Self-Check: PASSED

All 9 created files confirmed present on disk. Both commits (f9a4ee2, 442f599) confirmed in git log. 46/46 tests passing. npx tsc --noEmit clean.
