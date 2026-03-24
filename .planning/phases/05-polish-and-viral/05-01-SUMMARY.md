---
phase: 05-polish-and-viral
plan: 01
subsystem: ui
tags: [motion, animation, framer-motion, svg, spring-physics, footer, layout]

# Dependency graph
requires:
  - phase: 04-draft-room
    provides: motion/react animation patterns established in draft components

provides:
  - AnimatedCounter component: spring-animated number ticker with useSpring (stiffness:60, damping:15)
  - DigitFlipCounter component: per-digit AnimatePresence popLayout scoreboard flip
  - AnimatedGauge component: SVG semicircle with spring overshoot, green-to-red color interpolation, tier labels
  - getTierLabel helper: Clean/Minor/Raised/Suspicious/Peak Swamp tier mapping
  - Global AlvaFooter compact variant on all pages except /draft
  - Full AlvaFooter variant on landing page with Build Your Own button

affects: [05-03, 05-05, leaderboard, politicians, dashboard, team]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - useSpring(0, stiffness:60/damping:15) + useEffect spring.set(value) for animated counters
    - AnimatePresence mode=popLayout with key={digit} for per-digit flip animation
    - useMotionValue + animate(type:spring, stiffness:120, damping:10) for SVG gauge overshoot
    - useTransform for color interpolation across MotionValue range
    - strokeDashoffset animation on motion.circle for SVG arc fill
    - Pathname check (usePathname) in RootLayout to suppress footer on specific routes

key-files:
  created:
    - src/components/animations/animated-counter.tsx
    - src/components/animations/animated-gauge.tsx
  modified:
    - src/components/landing/alva-footer.tsx
    - src/components/layout/root-layout.tsx
    - src/app/page.tsx

key-decisions:
  - "AlvaFooter default variant changed to compact — landing page uses variant=full explicitly to avoid breaking existing centered layout"
  - "isDraftActive pathname check in RootLayout suppresses compact footer on /draft per research Pitfall 6"
  - "AnimatedGauge uses animate() imperative API with spring (stiffness:120, damping:10) for theatrical overshoot per D-04"
  - "showScore delayed reveal: starts false when animateOnMount=true, flips to true at 95% of target via progress.on('change') listener"

patterns-established:
  - "Pattern: Spring counter — useSpring(0, {stiffness:60,damping:15}) + useEffect spring.set(value) + useTransform display"
  - "Pattern: Digit flip — AnimatePresence mode=popLayout with key={digit}, initial y:100% animate y:0 exit y:-100%"
  - "Pattern: SVG gauge — useMotionValue + animate(progress, score, {type:spring,...}) + useTransform for dashOffset and color"

requirements-completed: [ANIM-03, ANIM-04, PLAT-01, PLAT-02]

# Metrics
duration: 3min
completed: 2026-03-24
---

# Phase 05 Plan 01: Animation Primitives and Global Footer Summary

**Spring-animated scoreboard counter (digit-flip), SVG semicircle gauge with overshoot bounce + green-to-red color sweep, and global Alva footer with Build Your Own CTA on every page except /draft**

## Performance

- **Duration:** ~3 min
- **Started:** 2026-03-24T02:28:30Z
- **Completed:** 2026-03-24T02:31:48Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments

- AnimatedCounter and DigitFlipCounter exported from src/components/animations/animated-counter.tsx — ready for Plans 03 and 05 to wire into dashboard KPIs and politician cards
- AnimatedGauge with theatrical spring overshoot (stiffness:120, damping:10), green-to-red color interpolation, tier label fade-in, and getTierLabel helper — satisfies D-04 requirements
- AlvaFooter compact variant visible on all pages (dashboard, politicians, leaderboard, team, league, feed) and suppressed on /draft; landing page retains full centered variant with new Build Your Own button
- Build verified: 130 static pages generated, zero TypeScript errors

## Task Commits

1. **Task 1: Create AnimatedCounter and AnimatedGauge primitives** - `74af003` (feat)
2. **Task 2: Update AlvaFooter with Build Your Own CTA and wire into global layout** - `cac1369` (feat)

## Files Created/Modified

- `src/components/animations/animated-counter.tsx` - AnimatedCounter (spring tick) + DigitFlipCounter (per-digit AnimatePresence flip)
- `src/components/animations/animated-gauge.tsx` - AnimatedGauge SVG semicircle, getTierLabel helper
- `src/components/landing/alva-footer.tsx` - Added variant prop (compact/full), Data Sources text, Build Your Own links
- `src/components/layout/root-layout.tsx` - Imports AlvaFooter + usePathname, renders compact footer with isDraftActive guard
- `src/app/page.tsx` - Updated to use variant="full" explicitly

## Decisions Made

- AlvaFooter default variant changed to `compact` (not `full`) so RootLayout gets compact without needing to pass a prop. Landing page updated to explicitly pass `variant="full"` to preserve existing centered layout.
- `isDraftActive` check added per research Pitfall 6 — draft room uses full-screen layout that would conflict with a global footer.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Updated landing page to pass variant="full" to AlvaFooter**
- **Found during:** Task 2 (AlvaFooter update)
- **Issue:** Changing AlvaFooter default from no-variant to `compact` would have broken the existing landing page centered layout silently
- **Fix:** Added `variant="full"` to the `<AlvaFooter />` call in `src/app/page.tsx`
- **Files modified:** src/app/page.tsx
- **Verification:** Build passes, landing page renders full centered variant as before
- **Committed in:** cac1369 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 - Bug)
**Impact on plan:** One-line fix required to preserve landing page layout. No scope creep.

## Issues Encountered

None — build succeeded first attempt, all TypeScript clean.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- AnimatedCounter and AnimatedGauge are importable and export documented APIs — Plans 03 and 05 can wire them into existing pages immediately
- AlvaFooter global requirement (PLAT-01, PLAT-02) satisfied — no further footer work needed
- Both components follow established motion/react patterns from existing codebase

---
*Phase: 05-polish-and-viral*
*Completed: 2026-03-24*
