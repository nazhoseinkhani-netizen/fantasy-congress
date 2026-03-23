---
phase: 01-foundation
plan: "03"
subsystem: design-system
tags: [design-system, navigation, components, dark-mode, tailwind, shadcn]
dependency_graph:
  requires: ["01-01"]
  provides: ["design-system", "navigation-shell", "politician-card", "risk-badge", "stat-cell"]
  affects: ["all-subsequent-plans"]
tech_stack:
  added:
    - Inter (next/font/google)
    - JetBrains Mono (next/font/google)
    - shadcn/ui card, badge, avatar, separator, tooltip, navigation-menu, sheet, tabs
  patterns:
    - OKLCH color system for dark mode via CSS custom properties
    - color-mix() for opacity variants of semantic colors
    - Fixed nav shell with responsive show/hide (hidden lg:flex / flex lg:hidden)
    - Inline <img> with loading="lazy" (not next/image) for static export compatibility
key_files:
  created:
    - src/styles/globals.css
    - src/components/layout/nav-desktop.tsx
    - src/components/layout/nav-mobile.tsx
    - src/components/layout/root-layout.tsx
    - src/components/design/risk-badge.tsx
    - src/components/design/stat-cell.tsx
    - src/components/design/politician-card.tsx
    - src/components/ui/card.tsx
    - src/components/ui/badge.tsx
    - src/components/ui/avatar.tsx
    - src/components/ui/separator.tsx
    - src/components/ui/tooltip.tsx
    - src/components/ui/navigation-menu.tsx
    - src/components/ui/sheet.tsx
    - src/components/ui/tabs.tsx
  modified:
    - src/app/globals.css
    - src/app/layout.tsx
    - src/app/page.tsx
decisions:
  - "globals.css moved to src/styles/globals.css; src/app/globals.css imports it — keeps app directory clean and satisfies plan artifact spec"
  - "color-mix(in oklch, ...) used for opacity variants of party/risk colors — avoids hardcoding separate opacity tokens"
  - "NavDesktop uses active underline via absolute-positioned span — cleaner than border-bottom on link"
  - "PoliticianCard uses <img> not next/image per CLAUDE.md constraint for static export"
metrics:
  duration_seconds: 295
  completed_date: "2026-03-23"
  tasks_completed: 3
  tasks_total: 4
  files_created: 15
  files_modified: 3
---

# Phase 01 Plan 03: Premium Dark Design System Summary

**One-liner:** OKLCH-based dark design system with Inter/JetBrains Mono fonts, DraftKings-inspired navigation shell, and PoliticianCard/RiskBadge/StatCell component library.

## What Was Built

Three tasks completed out of four total (Task 4 is a human-verify checkpoint awaiting visual approval).

### Task 1: Premium Dark Theme + shadcn/ui Components (commit: c6a4f54)

Created `src/styles/globals.css` with the full Fantasy Congress OKLCH color system:
- Dark background: `oklch(0.085 0.008 265)` — near-black with subtle blue-gray tint
- Gold primary/accent: `oklch(0.78 0.165 85)` — warm gold DraftKings-inspired
- Party colors: Democrat blue, Republican red, Independent green
- 5 risk tier colors from clean-record (green) to peak-swamp (red)
- Inter and JetBrains Mono fonts configured via `next/font/google`
- ThemeProvider with `defaultTheme="dark"` — dark mode out of the box
- Installed 8 shadcn/ui components: card, badge, avatar, separator, tooltip, navigation-menu, sheet, tabs

### Task 2: Global Navigation and Layout Shell (commit: a630f9f)

- `NavDesktop`: Fixed top bar at 16 (64px), hidden on mobile (`hidden lg:flex`). Logo "Fantasy Congress" in gold, 5 nav links with `usePathname` active detection (gold underline), user avatar with "FC" initials.
- `NavMobile`: Fixed bottom bar at 16 (64px), hidden on desktop (`flex lg:hidden`). 5 tabs with lucide-react icons (LayoutDashboard, Users, Activity, Trophy, Shield), icon + label stacked.
- `RootLayout`: Combines both navs with `max-w-7xl` content container. `pt-0 pb-20 lg:pt-16 lg:pb-0` accounts for fixed nav elements.
- `layout.tsx` updated to wrap children in `RootLayout` inside `ThemeProvider`.

### Task 3: Core Design Components (commit: 63d8f58)

- `RiskBadge`: Maps all 5 `InsiderRiskTier` values to display names and OKLCH color CSS variables. Pill shape with color dot, tier name, and numeric score. Uses `color-mix(in oklch, ...)` for background opacity.
- `StatCell`: Label (muted, uppercase, small) over value (bold, tabular numbers) with inline SVG trend arrows (up/down/neutral).
- `PoliticianCard`: Three variants — `full` (complete card with photo, party stripe, stats grid, risk badge), `compact` (list-friendly horizontal layout), `mini` (tiny sidebar format). Uses `<img>` with `loading="lazy"` per static export constraint.
- `page.tsx`: Renders all 3 mock politicians in all 3 card variants as design system preview.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] globals.css path mismatch**
- **Found during:** Task 1
- **Issue:** Plan specified `src/styles/globals.css` but project had `src/app/globals.css` (shadcn's default location). `components.json` pointed to `src/app/globals.css`.
- **Fix:** Created `src/styles/globals.css` as the primary theme file. Updated `src/app/globals.css` to `@import "../styles/globals.css"`. Both paths satisfied.
- **Files modified:** src/app/globals.css, src/styles/globals.css

**2. [Rule 3 - Blocking] Dev server port conflict**
- **Found during:** Checkpoint task (server start)
- **Issue:** Another Next.js dev server was already running at port 3099 (from FantasyCongress working dir).
- **Fix:** Identified existing server at http://localhost:3099 — app is accessible there for visual verification.
- **No files modified** — runtime issue only.

### Out-of-Scope Deferred Items

Pre-existing TypeScript errors in `src/lib/scoring/__tests__/` (missing `bonuses.ts`, `penalties.ts`, `engine.ts` modules from Plan 02) — not caused by Plan 03 changes. Logged here for tracking; Plan 02 execution should create these files.

## Self-Check: PASSED

Files created/modified:
- FOUND: src/styles/globals.css
- FOUND: src/components/layout/nav-desktop.tsx
- FOUND: src/components/layout/nav-mobile.tsx
- FOUND: src/components/layout/root-layout.tsx
- FOUND: src/components/design/risk-badge.tsx
- FOUND: src/components/design/stat-cell.tsx
- FOUND: src/components/design/politician-card.tsx

Commits verified:
- FOUND: c6a4f54 (Task 1 - theme + shadcn)
- FOUND: a630f9f (Task 2 - navigation)
- FOUND: 63d8f58 (Task 3 - design components)

Dev server running at http://localhost:3099 — ready for visual verification.
