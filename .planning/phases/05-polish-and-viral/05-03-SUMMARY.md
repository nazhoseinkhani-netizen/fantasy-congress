---
phase: 05-polish-and-viral
plan: 03
subsystem: animations
tags: [animation, draft, dashboard, leaderboard, framer-motion]
dependency_graph:
  requires: ["05-01"]
  provides: ["ANIM-01", "ANIM-02", "ANIM-03", "ANIM-05"]
  affects: ["draft-board", "pick-ticker", "kpi-row", "matchup-scoreboard", "leaderboard-page", "shame-table"]
tech_stack:
  added: []
  patterns: ["motion/react AnimatePresence overlay", "whileInView scroll-trigger", "DigitFlipCounter scoreboard", "staggered table rows"]
key_files:
  created: []
  modified:
    - src/components/draft/draft-board.tsx
    - src/components/draft/pick-ticker.tsx
    - src/components/draft/politician-pool.tsx
    - src/components/dashboard/kpi-row.tsx
    - src/components/dashboard/matchup-scoreboard.tsx
    - src/components/leaderboard/leaderboard-page.tsx
    - src/components/leaderboard/shame-table.tsx
decisions:
  - "handleUserPick updated to accept optional MouseEvent for getBoundingClientRect capture"
  - "PoliticianPool onPick signature extended to pass MouseEvent through from DRAFT button"
  - "Burst particles use fixed center position (50%/50%) as fly animation end position is off-screen"
  - "DigitFlipCounter wraps rounded floats (Math.round * 10 / 10) to avoid decimal digit noise"
  - "Swamp-o-meter placed as hero element inside Risk Score tab, not a standalone section"
  - "motion.tr used for shame-table rows — motion supports all HTML elements including table rows"
metrics:
  duration: 189s
  completed: "2026-03-24"
  tasks: 2
  files: 7
---

# Phase 05 Plan 03: Animation Wiring Summary

Wire animation primitives into draft board, dashboard KPIs, matchup scoreboard, and leaderboard — fixed-position fly overlay with burst particles, spring slide-in ticker with glow, DigitFlip scoreboards, and scroll-triggered Swamp-o-meter gauge.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Draft pick fly animation and trade alert slide-ins | 983c508 | draft-board.tsx, pick-ticker.tsx, politician-pool.tsx |
| 2 | Wire animated counters to dashboard and add Swamp-o-meter to leaderboard | 5e63e2a | kpi-row.tsx, matchup-scoreboard.tsx, leaderboard-page.tsx, shame-table.tsx |

## What Was Built

**ANIM-01 — Draft pick fly animation (draft-board.tsx):**
- Added `flyAnimation` state holding `{ politicianName, fromRect }` captured via `getBoundingClientRect()` on the DRAFT button click
- Fixed-position overlay `<motion.div>` animates from source rect to off-screen (x: -200, scale: 0.3, opacity: 0) over 0.6s
- Burst: 6 gold `motion.div` particles (2x2 circles) radiate in 60-degree increments on `onAnimationComplete`
- `recordPick` deferred 50ms so animation starts before card leaves pool

**ANIM-02 — Trade alert slide-ins (pick-ticker.tsx):**
- Changed `initial` from `{ opacity: 0, x: 20 }` to `{ opacity: 0, x: 60 }` for dramatic slide-from-right
- Added spring transition: `{ type: 'spring', stiffness: 300, damping: 28 }`
- Added `boxShadow` glow: green (`rgba(34,197,94,0.25)`) for user team picks, gold (`rgba(234,179,8,0.2)`) for others

**ANIM-03 — Dashboard digit-flip counters:**
- `kpi-row.tsx`: Season points replaced with `<DigitFlipCounter>`, league rank with `<AnimatedCounter>` — KpiCard extended to accept `children` for flexible layout
- `matchup-scoreboard.tsx`: Both `userScore` and `opponentScore` replaced with `<DigitFlipCounter>` at text-3xl scale

**ANIM-05 — Swamp-o-meter on leaderboard:**
- `leaderboard-page.tsx`: Added `avgCorruptionScore` computed as mean `insiderRiskScore` across all politicians
- "Congressional Swamp-o-Meter" section added in Risk Score tab using `<motion.div whileInView>` (viewport `once: true, amount: 0.3`)
- Renders `<AnimatedGauge score={avgCorruptionScore} size="lg" showLabel labelText="Avg Insider Risk" />`
- `shame-table.tsx`: Rows converted to `motion.tr` with staggered `delay: index * 0.05` and `AnimatedCounter` for risk score cells

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing functionality] PoliticianPool onPick signature needed MouseEvent**
- **Found during:** Task 1
- **Issue:** `onPick` typed as `(bioguideId: string) => void` — no way to get click position for fly animation
- **Fix:** Updated to `(bioguideId: string, event?: React.MouseEvent) => void` in both PoliticianPool props interface and DraftBoard handler, DRAFT button passes `e` to callback
- **Files modified:** src/components/draft/politician-pool.tsx
- **Commit:** 983c508

## Self-Check: PASSED

All 7 modified files confirmed present. Both commits (983c508, 5e63e2a) verified in git log. Build completes with zero errors (130 static pages generated).
