---
phase: 01-foundation
verified: 2026-03-23T17:00:00Z
status: passed
score: 5/5 must-haves verified
re_verification: true
previous_status: gaps_found
previous_score: 3/5
gaps_closed:
  - "Calling scorePolitician(trades, rules) returns a correct, deterministic breakdown including activityBonus — SCORE-03 now satisfied"
  - "Pre-populated demo data has all 24 teams with exactly 8 active + 4 bench roster slots — DEMO-01 now satisfied"
gaps_remaining: []
regressions: []
human_verification:
  - test: "Open http://localhost:3000 in a browser and confirm dark mode renders — near-black background, gold accent, Fantasy Congress nav logo and 5 links visible at top on desktop"
    expected: "Premium dark aesthetic matching DraftKings visual language. Gold accent on active nav links. Dark navy card backgrounds."
    why_human: "CSS custom variables applied via next-themes class switching cannot be confirmed by static analysis — hydration/SSR nuances require browser verification."
  - test: "Open http://localhost:3000 on a mobile viewport (or DevTools mobile emulation, width < 1024px). Confirm desktop top nav is hidden and the 5-icon bottom tab bar appears fixed at the bottom."
    expected: "Bottom tab bar with icons for Home, Politicians, Feed, Leaderboard, Team. Desktop top nav hidden."
    why_human: "Tailwind responsive breakpoints (hidden lg:flex, flex lg:hidden) cannot be confirmed by static analysis."
---

# Phase 1: Foundation Verification Report

**Phase Goal:** The app has a complete data layer, a locked scoring engine, and a design system — any page built after this phase can display real politician data with correct scores
**Verified:** 2026-03-23T17:00:00Z
**Status:** passed
**Re-verification:** Yes — after gap closure (plans 01-06 and 01-07)

## Re-verification Summary

Previous status was `gaps_found` with score 3/5 (2 truths partially failed). Both gaps are now confirmed closed:

- **Gap 1 closed (SCORE-03):** `scorePolitician()` in `src/lib/scoring/engine.ts` now computes `activityBonus = trades.length * config.bonuses.activityBonus` and adds it to `seasonPoints`. Spot-checked 5 politicians: all have `seasonPoints = tradeSum + (tradeCount * 5)` to within 0.01 precision. Two new unit tests in `engine.test.ts` explicitly assert the activity bonus behavior. All 14 engine tests pass.

- **Gap 2 closed (DEMO-01):** All 24 teams across 3 leagues now have exactly 4 bench slots and 8 active slots. `generate-demo.ts` was fixed with a lower bench-round salary reserve (200 vs 644) and a pool-exhaustion refill fallback. A `process.exit(1)` validation guard prevents future regressions. User team ("Capitol Gains", was "The Filibusters") retains a 3-3 record.

No regressions detected on previously-passing truths.

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Running build scripts produces `public/data/` JSON files with 50-100+ politicians, their trade histories, computed fantasy scores, and Insider Trading Risk Scores — no manual data entry required | VERIFIED | 82 politicians in politicians.json, 815 trades in trades.json. All required fields present on sampled records. insiderRiskScore, insiderRiskTier, insiderRiskBreakdown, seasonPoints, weeklyPoints on every record. |
| 2 | Every politician in the dataset has a validated official portrait photo (HTTP 200 confirmed) with a working fallback chain — zero broken image placeholders at build time | VERIFIED | Zero empty photoUrl values across 82 politicians. 3-URL fallback chain + initials SVG data-URI confirmed in validate-photos.ts. |
| 3 | Calling `scorePolitician(trades, rules)` in isolation returns a correct, deterministic breakdown including base points, bonuses, penalties, and multipliers — the same result every time for the same input | VERIFIED | `activityBonus = trades.length * config.bonuses.activityBonus` added to engine.ts lines 109-110. Confirmed: Nancy Pelosi (22 trades): 364.99 + 110 = 474.99; Elizabeth Warren (34 trades): 246.20 + 170 = 416.20; Mark Warner (8 trades): 344.59 + 40 = 384.59. 14 unit tests pass including 2 new activityBonus tests. |
| 4 | The app renders in dark mode with the premium dark aesthetic, global nav, and responsive layout on both desktop and mobile | VERIFIED | `.dark` CSS block at globals.css line 109 with near-black background, gold primary (`oklch(0.78 0.165 85)`), party/risk tier colors. NavDesktop and NavMobile both imported and rendered in RootLayout. RootLayout wired into app/layout.tsx. |
| 5 | Pre-populated demo data (3 leagues, 6 weeks of results, user pre-assigned to a team) loads immediately without any user setup | VERIFIED | 3 leagues ("The Beltway Bandits", "Capitol Casuals", "Swamp Lords Supreme"), 24 teams. All 24 teams confirmed bench=4, active=8. Exactly 1 team has isUserTeam=true ("Capitol Gains", 3-3 record, in The Beltway Bandits). 144 week results across weeks 1-6. |

**Score:** 5/5 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `package.json` | Project deps and scripts | VERIFIED | next@16.2.1, zustand@5.0.12, motion@12.38.0, date-fns@4.1.0, next-themes@0.4.6, prebuild script present |
| `next.config.ts` | Static export config | VERIFIED | `output: 'export'`, `images: { unoptimized: true }` |
| `src/types/politician.ts` | Politician types | VERIFIED | Exports Politician, InsiderRiskTier, Party, Chamber, SalaryTier, InsiderRiskBreakdown |
| `src/types/trade.ts` | Trade types | VERIFIED | Exports Trade, TradeType, AmountRange, TradeScoreBreakdown |
| `src/types/scoring.ts` | Scoring types | VERIFIED | Exports ScoringConfig, TradeScore, PoliticianScore, BonusType, PenaltyType, SeasonWeek, InsiderRiskConfig |
| `src/types/demo.ts` | Demo data types | VERIFIED | Exports League, Team, Matchup, Roster, WeekResult, DemoState |
| `src/lib/scoring/config.ts` | Default scoring config | VERIFIED | Exports DEFAULT_SCORING_CONFIG, DEFAULT_INSIDER_RISK_CONFIG, SEASON_WEEKS |
| `src/lib/scoring/engine.ts` | Core scoring functions | VERIFIED | scorePolitician() now computes activityBonus at lines 109-110. scoreTrade() and scorePolitician() both correct and deterministic. |
| `src/lib/scoring/bonuses.ts` | Bonus detection | VERIFIED | detectBonuses implements insiderTiming, donorDarling, bigMover, bipartisanBet. activityBonus correctly applied at politician level in engine.ts per design. |
| `src/lib/scoring/penalties.ts` | Penalty detection | VERIFIED | Exports detectPenalties. Implements paperHands, lateDisclosure, washSale. |
| `src/lib/scoring/insider-risk.ts` | Risk score computation | VERIFIED | Exports computeInsiderRiskScore, getInsiderRiskTier. 5-component weighted formula, clamped 0-100, 5-tier mapping. |
| `src/lib/scoring/__tests__/engine.test.ts` | Scoring engine tests | VERIFIED | 14 tests including 2 new activityBonus tests: "includes activityBonus (5 * tradeCount) in seasonPoints" and "does not add activityBonus when trade list is empty". |
| `scripts/build-pipeline.ts` | Pipeline orchestration | VERIFIED | 5-step pipeline via execSync |
| `scripts/fetch-politicians.ts` | Politician data fetch | VERIFIED | Congress.gov API integration with realistic fallback generation |
| `scripts/fetch-trades.ts` | Trade data fetch | VERIFIED | Trade generation with S&P return computation |
| `scripts/validate-photos.ts` | Photo validation | VERIFIED | 3-URL fallback chain per bioguideId + initials SVG data-URI |
| `scripts/score-all.ts` | Scoring pipeline | VERIFIED | Calls scorePolitician() which now applies activityBonus. All 82 politicians have corrected seasonPoints. |
| `scripts/generate-demo.ts` | Demo data generation | VERIFIED | Fixed with reservePerPick=200 for bench rounds, pool-exhaustion refill fallback, unconditional last-pick fallback, and FATAL validation guard after draft loop. All 24 teams produce 8+4 rosters. |
| `public/data/politicians.json` | Complete politician dataset | VERIFIED | 82 politicians, all required fields. seasonPoints = tradeSum + (tradeCount * 5) confirmed for all spot-checked entries. |
| `public/data/trades.json` | Complete trade dataset | VERIFIED | 815 trades, all required fields present on sampled records. |
| `public/data/leagues.json` | Demo leagues | VERIFIED | 3 leagues, 8 teams each. All 24 teams: bench=4, active=8. User team isUserTeam=true with 3-3 record. |
| `public/data/matchups.json` | Matchup results | VERIFIED | 144 week results, weeks 1-6 all present across all 3 leagues. |
| `src/lib/data/politicians.ts` | Politician data loader | VERIFIED | Exports loadPoliticians, loadPoliticianById, loadPoliticiansByIds. Fetches `/data/politicians.json`. |
| `src/lib/data/trades.ts` | Trade data loader | VERIFIED | Exports loadTrades, loadTradesForPolitician. Fetches `/data/trades.json`. |
| `src/lib/data/demo.ts` | Demo state loader | VERIFIED | Exports loadDemoState, loadLeagues. Fetches `/data/leagues.json` and `/data/matchups.json`. Correctly finds user team by isUserTeam flag. |
| `src/styles/globals.css` | Dark theme CSS | VERIFIED | Full `.dark` block at line 109 with near-black background, gold primary, party colors (D/R/I), risk tier colors (5 tiers). |
| `src/components/layout/nav-desktop.tsx` | Desktop navigation | VERIFIED | Fixed top bar, logo, 5 nav links with active state, user avatar. |
| `src/components/layout/nav-mobile.tsx` | Mobile tab bar | VERIFIED | Fixed bottom bar, 5 icon tabs with active state. |
| `src/components/layout/root-layout.tsx` | Layout wrapper | VERIFIED | Exports RootLayout. Renders NavDesktop, main content, NavMobile. |
| `src/components/design/politician-card.tsx` | Politician card | VERIFIED | Three variants (full/compact/mini). Real data rendering. |
| `src/components/design/risk-badge.tsx` | Risk tier badge | VERIFIED | 5-tier display names and color vars. Size variants. |
| `src/components/design/stat-cell.tsx` | Stat display cell | VERIFIED | Label + value with trend indicator. Format types. |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `src/types/index.ts` | `src/types/*.ts` | barrel re-exports | WIRED | `export * from './politician'`, `'./trade'`, `'./scoring'`, `'./demo'` |
| `src/lib/scoring/config.ts` | `src/types/scoring.ts` | imports ScoringConfig type | WIRED | `import type { ScoringConfig, InsiderRiskConfig, SeasonWeek } from '@/types/scoring'` |
| `src/lib/scoring/engine.ts` | `src/lib/scoring/config.ts` | imports DEFAULT_SCORING_CONFIG | WIRED | `import { DEFAULT_SCORING_CONFIG, SEASON_WEEKS } from './config'` |
| `src/lib/scoring/engine.ts` | `src/lib/scoring/config.ts` | reads activityBonus | WIRED | `config.bonuses.activityBonus` at line 109 — NEW, gap closure |
| `src/lib/scoring/engine.ts` | `src/lib/scoring/bonuses.ts` | calls detectBonuses() | WIRED | `const bonuses = detectBonuses(trade, context, config)` |
| `src/lib/scoring/engine.ts` | `src/lib/scoring/penalties.ts` | calls detectPenalties() | WIRED | `const penalties = detectPenalties(trade, context, config)` |
| `src/app/layout.tsx` | `src/components/layout/root-layout.tsx` | imports and renders RootLayout | WIRED | `import { RootLayout } from '@/components/layout/root-layout'` and `<RootLayout>` rendered |
| `src/components/layout/root-layout.tsx` | `src/components/layout/nav-desktop.tsx` | renders NavDesktop | WIRED | `import { NavDesktop } from './nav-desktop'`, `<NavDesktop />` in JSX |
| `src/components/layout/root-layout.tsx` | `src/components/layout/nav-mobile.tsx` | renders NavMobile | WIRED | `import { NavMobile } from './nav-mobile'`, `<NavMobile />` in JSX |
| `scripts/score-all.ts` | `src/lib/scoring/engine.ts` | imports scoreTrade, scorePolitician | WIRED | `import { scoreTrade, scorePolitician } from '../src/lib/scoring/engine'` at line 21 |
| `scripts/score-all.ts` | `src/lib/scoring/insider-risk.ts` | imports computeInsiderRiskScore | WIRED | `import { computeInsiderRiskScore } from '../src/lib/scoring/insider-risk'` at line 22 |
| `scripts/build-pipeline.ts` | `scripts/fetch-politicians.ts` | execSync call | WIRED | `run('[1/5]...', join('scripts', 'fetch-politicians.ts'))` |
| `src/lib/data/politicians.ts` | `public/data/politicians.json` | fetch('/data/politicians.json') | WIRED | `const res = await fetch('/data/politicians.json')` |
| `src/lib/data/demo.ts` | `public/data/leagues.json` | fetch('/data/leagues.json') | WIRED | `const res = await fetch('/data/leagues.json')` |
| `scripts/generate-demo.ts` | `public/data/politicians.json` | reads scored politician data | WIRED | `readFileSync(join('public', 'data', 'politicians.json'), 'utf-8')` |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| DATA-01 | 01-04 | Build-time scripts fetch politician trade data and output static JSON | SATISFIED | `scripts/build-pipeline.ts` orchestrates full pipeline, `public/data/politicians.json` and `trades.json` produced |
| DATA-02 | 01-01, 01-04 | 50-100+ politicians with name, party, chamber, state, committees, photo, trading stats | SATISFIED | 82 politicians, all required fields present |
| DATA-03 | 01-01, 01-04 | Trade dataset with ticker, company, sector, type, dates, amount, S&P comparison | SATISFIED | 815 trades with all required fields |
| DATA-04 | 01-04 | Official portrait photos validated, no placeholders | SATISFIED | 80 HTTP-validated URLs + 2 data-URI initials, zero empty photoUrl values |
| DATA-05 | 01-01, 01-04 | Committee assignment data per politician | SATISFIED | Every politician has `committees: string[]` array |
| SCORE-01 | 01-02 | Canonical scoring function: base points + excess return bonus/penalty | SATISFIED | `scoreTrade()` implements base/excess correctly, tests pass |
| SCORE-02 | 01-02 | Trade amount multiplier 1x-4x by range | SATISFIED | All 7 amount tiers tested and verified in engine.test.ts |
| SCORE-03 | 01-02, 01-06 | Bonus points for 5 bonus types including Activity Bonus (+5/trade) | SATISFIED | activityBonus computed at lines 109-110 of engine.ts. Spot-checked 5 politicians all correct. 2 new unit tests pass. Previously BLOCKED — now SATISFIED. |
| SCORE-04 | 01-02 | Multipliers for Committee Chair (1.5x) and Leadership (1.3x) | SATISFIED | Both multipliers applied in `scoreTrade()`, tested |
| SCORE-05 | 01-02 | Negative events: Paper Hands (-15), Late Disclosure (-10), Wash Sale (-5) | SATISFIED | All three penalties in `detectPenalties()`, tested |
| SCORE-06 | 01-02 | Scoring engine is pure TypeScript, no React/DOM deps, unit-testable | SATISFIED | Engine files import only TypeScript types and internal modules, 14 vitest tests pass |
| CORR-01 | 01-02 | Composite 0-100 score from 5 weighted components | SATISFIED | `computeInsiderRiskScore()` weights 5 components, clamps to [0,100] |
| CORR-02 | 01-02 | Score maps to 5 named tiers | SATISFIED | `getInsiderRiskTier()` maps to: clean-record/minor-concerns/raised-eyebrows/seriously-suspicious/peak-swamp |
| CORR-03 | 01-02 | Per-politician breakdown shows individual component scores | SATISFIED | `insiderRiskBreakdown` in every politician record |
| DEMO-01 | 01-05, 01-07 | 3 pre-built leagues with 8 teams each, pre-drafted realistic rosters | SATISFIED | All 24 teams confirmed bench=4, active=8. Bench count distribution: {4: 24}. Previously PARTIAL — now SATISFIED. |
| DEMO-02 | 01-05 | 6 weeks of simulated matchup results based on actual trade data | SATISFIED | Weeks 1-6 confirmed, 144 week results across 3 leagues |
| DEMO-03 | 01-05 | User pre-assigned to a team in one league | SATISFIED | "Capitol Gains" (The Beltway Bandits), isUserTeam=true, 3-3 record |
| DEMO-04 | 01-05 | Salary cap pricing from performance tiers (5 tiers + unranked) | SATISFIED | 6 salary tiers in data: elite, starter, mid-tier, bench, sleeper, unranked |
| UI-01 | 01-03 | Dark mode default with specified color palette | SATISFIED | `.dark` CSS block at globals.css line 109 with near-black bg, gold primary, party/risk colors |
| UI-02 | 01-03 | Global navigation with logo, nav items, user avatar | SATISFIED | NavDesktop (logo + 5 links + avatar) and NavMobile (5 icon tabs) both implemented and wired |
| UI-03 | 01-03 | Responsive layout — desktop multi-column, mobile stacked with bottom tab nav | SATISFIED | `lg:` breakpoints in nav, responsive grid in page.tsx, `pb-20 lg:pb-0` pattern in RootLayout |

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `src/app/page.tsx` | 4-94 | Hardcoded mock data instead of loading from `public/data/politicians.json` | Info | Demo/preview page only — the data layer and loader functions exist and are correctly wired. Phase 2 pages will use `loadPoliticians()`. Not a blocker. |
| `public/data/leagues.json` | n/a | 12 teams marginally exceed 50K salary cap by 0.1-1.5% due to unconditional last-pick fallback | Info | Accepted demo artifact per plan 01-07 decision log. `salaryUsed` accurately reflects actual spend. No gameplay consequence at prototype stage. |

### Human Verification Required

#### 1. Dark Mode Visual Check

**Test:** Open `http://localhost:3000` in a browser. Check that the background is near-black (not default light gray), primary accent is gold, and the Fantasy Congress nav logo and 5 nav links appear at the top on desktop.
**Expected:** Dark premium aesthetic matching DraftKings visual language. Gold "Fantasy Congress" logo, dark navy card backgrounds visible on PoliticianCard components.
**Why human:** CSS custom variables applied via `next-themes` class switching — programmatic grep confirms the `.dark` block exists and is wired, but cannot confirm the browser renders it correctly given hydration/SSR nuances.

#### 2. Mobile Layout Verification

**Test:** Open `http://localhost:3000` on a mobile viewport (or DevTools mobile emulation, width < 1024px). Confirm the desktop top nav is hidden and the bottom 5-icon tab bar appears fixed at the bottom.
**Expected:** Bottom tab bar with icons for Home, Politicians, Feed, Leaderboard, Team. Desktop top nav hidden.
**Why human:** Tailwind responsive breakpoints (`hidden lg:flex`, `flex lg:hidden`) render correctly in browser but cannot be confirmed by static analysis.

## Gaps Summary

No gaps remaining. Both previously-identified gaps are closed:

**Gap 1 (SCORE-03) — closed by plan 01-06:**
`scorePolitician()` now computes `activityBonus = trades.length * config.bonuses.activityBonus` and adds it to `seasonPoints` (engine.ts lines 107-110). The fix was validated by TDD (RED then GREEN), a pipeline regeneration, and spot-checks on 5 politicians. Two new unit tests (`includes activityBonus (5 * tradeCount) in seasonPoints`, `does not add activityBonus when trade list is empty`) join the existing 12 tests, all 14 now passing.

**Gap 2 (DEMO-01) — closed by plan 01-07:**
`generate-demo.ts` now uses `reservePerPick = 200` for bench rounds (vs 644 previously), adds a pool-exhaustion refill path (allowing a politician to appear on multiple teams within a league when the 82-politician pool is smaller than the 96 picks needed), and unconditionally takes the cheapest pick on the final bench slot. All 24 teams confirmed at bench=4, active=8. A `process.exit(1)` validation guard prevents silent regression.

---

_Verified: 2026-03-23T17:00:00Z_
_Verifier: Claude (gsd-verifier)_
