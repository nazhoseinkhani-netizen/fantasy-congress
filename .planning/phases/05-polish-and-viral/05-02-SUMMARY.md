---
phase: 05-polish-and-viral
plan: 02
subsystem: ui
tags: [react-context, dev-mode, easter-egg, data-attribution, motion, css]

# Dependency graph
requires:
  - phase: 05-polish-and-viral-01
    provides: "RootLayout with AlvaFooter already integrated — DevModeBanner slots in above NavDesktop"
provides:
  - DevModeProvider React context with Ctrl+Shift+D toggle and documentElement class sync
  - DevModeBanner animated banner component with AnimatePresence spring transition
  - CSS rules for .dev-mode [data-alva-skill] dashed borders and hover tooltips
  - data-alva-skill attributes on TradeCard, KpiRow, MatchupScoreboard, and ShameTable
affects: [05-polish-and-viral-03, 05-polish-and-viral-04, 05-polish-and-viral-05]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "DevModeProvider uses documentElement.classList.toggle for global CSS targeting without prop drilling"
    - "data-alva-skill attributes always present in DOM unconditionally — CSS class controls visibility"
    - "AnimatePresence spring (stiffness:300, damping:30) for banner mount/unmount"

key-files:
  created:
    - src/components/dev-mode/dev-mode-provider.tsx
    - src/components/dev-mode/dev-mode-banner.tsx
  modified:
    - src/styles/globals.css
    - src/app/layout.tsx
    - src/components/layout/root-layout.tsx
    - src/components/feed/trade-card.tsx
    - src/components/dashboard/kpi-row.tsx
    - src/components/dashboard/matchup-scoreboard.tsx
    - src/components/leaderboard/shame-table.tsx

key-decisions:
  - "data-alva-skill attributes are always in DOM (never conditional) to avoid hydration mismatch — CSS .dev-mode class controls visual display"
  - "e.preventDefault() in keydown handler avoids Ctrl+Shift+D conflicting with Firefox DevTools dock shortcut"
  - "DevModeProvider wraps ThemeProvider children in layout.tsx so all pages receive context"
  - "DevModeBanner placed before NavDesktop in RootLayout so it appears above navigation at top of viewport"

patterns-established:
  - "Global CSS class toggle pattern: useEffect syncing React state to documentElement.classList for CSS-only visual toggling without prop drilling"

requirements-completed: [PLAT-03]

# Metrics
duration: 2min
completed: 2026-03-24
---

# Phase 5 Plan 02: Developer Mode Easter Egg Summary

**Ctrl+Shift+D Easter egg revealing Alva Skill attribution via dashed borders and hover tooltips on all data elements, with animated gold banner confirming mode activation**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-24T01:13:36Z
- **Completed:** 2026-03-24T01:15:20Z
- **Tasks:** 2 completed
- **Files modified:** 7

## Accomplishments

- DevModeProvider React context with Ctrl+Shift+D toggle, e.preventDefault() guard, and documentElement class sync
- DevModeBanner with AnimatePresence spring animation showing "Developer Mode Active" with gold pulse dot and X dismiss button
- CSS rules in globals.css: dashed gold outline on [data-alva-skill] elements + hover::after tooltip showing "Alva Skill: [name]"
- data-alva-skill attributes wired to 4 key data components unconditionally in DOM (no hydration issues)
- Build succeeds with zero errors across all 130 static pages

## Task Commits

Each task was committed atomically:

1. **Task 1: Create DevModeProvider context and DevModeBanner component** - `a716222` (feat)
2. **Task 2: Wire DevModeProvider into app layout and add data-alva-skill attributes** - `c9eff82` (feat)

**Plan metadata:** [pending docs commit]

## Files Created/Modified

- `src/components/dev-mode/dev-mode-provider.tsx` - React context + Ctrl+Shift+D keydown listener + useDevMode hook
- `src/components/dev-mode/dev-mode-banner.tsx` - Animated banner with AnimatePresence spring + X dismiss
- `src/styles/globals.css` - Appended .dev-mode [data-alva-skill] dashed border + hover tooltip CSS rules
- `src/app/layout.tsx` - Wrapped RootLayout in DevModeProvider
- `src/components/layout/root-layout.tsx` - Added DevModeBanner as first child above NavDesktop
- `src/components/feed/trade-card.tsx` - data-alva-skill="getSenatorTrades" on outermost div
- `src/components/dashboard/kpi-row.tsx` - data-alva-skill="getSenatorTrades" on flex container
- `src/components/dashboard/matchup-scoreboard.tsx` - data-alva-skill="getSenatorTrades" on outer div
- `src/components/leaderboard/shame-table.tsx` - data-alva-skill="getPoliticianMetadata" on name cell, data-alva-skill="getSenatorTrades" on season points cell

## Decisions Made

- data-alva-skill attributes unconditionally in DOM (never wrapped in devMode conditional) to avoid React hydration mismatch per Pitfall 4 from research
- e.preventDefault() in keydown handler to prevent browser shortcut conflicts (Pitfall 5 from research)
- DevModeProvider placed outside ThemeProvider/RootLayout in layout.tsx so context is available to all client components

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Developer Mode system fully operational — Ctrl+Shift+D toggles gold banner and dashed borders on data elements
- data-alva-skill attributes present on trade cards, KPI rows, matchup scoreboard, and leaderboard rows
- Ready for Phase 5 Plan 03+ (share cards, additional animations)

---
*Phase: 05-polish-and-viral*
*Completed: 2026-03-24*
