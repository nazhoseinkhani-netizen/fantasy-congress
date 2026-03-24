---
phase: 02-discovery
plan: "01"
subsystem: landing-page
tags: [landing, recharts, carousel, hero, skeleton]
dependency_graph:
  requires: []
  provides: [landing-page, chart-config, skeleton-component]
  affects: [all-phase-2-plans]
tech_stack:
  added: [recharts]
  patterns: [client-component-carousel, server-component-sections, shared-chart-config]
key_files:
  created:
    - src/lib/chart-config.ts
    - src/components/ui/skeleton.tsx
    - src/components/landing/hero-section.tsx
    - src/components/landing/how-it-works.tsx
    - src/components/landing/featured-carousel.tsx
    - src/components/landing/alva-footer.tsx
  modified:
    - src/app/page.tsx
    - package.json
decisions:
  - "HeroSection uses Link-styled anchor tags instead of Button component to avoid 'use client' requirement on server component"
  - "FeaturedCarousel uses useRef for interval to avoid stale closure issues with hover state"
metrics:
  duration: 134s
  completed: "2026-03-23T17:42:40Z"
  tasks_completed: 2
  files_created: 6
  files_modified: 2
---

# Phase 02 Plan 01: Landing Page + Chart Config + Skeleton Summary

**One-liner:** Landing page with bold hero, 3-step how-it-works, auto-rotating politician carousel, and Alva footer, plus recharts chart-config and skeleton primitives for all Phase 2 pages.

## What Was Built

### Task 1: Recharts + Shared Utilities
- Installed `recharts` package (34 packages added)
- Created `src/lib/chart-config.ts` exporting `CHART_COLORS`, `CHART_TOOLTIP_STYLE`, `CHART_AXIS_STYLE`, `SECTOR_COLORS` — dark theme constants used by all Phase 2 chart components
- Created `src/components/ui/skeleton.tsx` exporting `Skeleton` — animate-pulse shimmer component for data-loading states

### Task 2: Landing Page
- **HeroSection** — Full-width section with radial gradient background, bold headline "DRAFT YOUR POLITICIANS. PROFIT FROM THEIR TRADES." in gold accent, subheadline, and dual CTAs linking to `/politicians` and `/feed`
- **HowItWorks** — 3-step responsive grid (Draft Your Team, Score Their Trades, Win Your League) with lucide icons, gold step numbers, and card layout
- **FeaturedCarousel** — Client component that loads all politicians, sorts by `seasonPoints` descending, takes top 5, auto-rotates every 4 seconds with setInterval/clearInterval cleanup, dot indicators, hover-pause, and skeleton loading state. Each card wrapped in Link to politician profile.
- **AlvaFooter** — Powered by Alva section with description and link to alva.ai
- **page.tsx** — Replaced design system preview placeholder with HeroSection + HowItWorks + FeaturedCarousel + AlvaFooter in `space-y-16 pb-16` container

## Verification

- `npx next build` completed successfully — 0 TypeScript errors, static export generated
- All acceptance criteria met (verified with grep checks)
- All 5 landing sections render without client-side errors

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing critical] HeroSection uses styled Link elements instead of Button component**
- **Found during:** Task 2
- **Issue:** Button component has `"use client"` directive (uses BaseUI ButtonPrimitive). Using it in a server component would require either making the hero a client component or wrapping Button imports.
- **Fix:** Used `<Link>` with Tailwind classes matching button styles instead of importing Button — keeps HeroSection as a server component (no `use client`) as specified in the plan
- **Files modified:** src/components/landing/hero-section.tsx
- **Commit:** fe915b6

None of the other specified plan steps required deviation.

## Self-Check

Files created/exist:
- src/lib/chart-config.ts: FOUND
- src/components/ui/skeleton.tsx: FOUND
- src/components/landing/hero-section.tsx: FOUND
- src/components/landing/how-it-works.tsx: FOUND
- src/components/landing/featured-carousel.tsx: FOUND
- src/components/landing/alva-footer.tsx: FOUND
- src/app/page.tsx: FOUND (modified)

Commits:
- 272bf12: feat(02-01): install recharts and create shared chart config and skeleton component
- fe915b6: feat(02-01): build complete landing page with hero, how-it-works, carousel, and Alva footer

## Self-Check: PASSED
