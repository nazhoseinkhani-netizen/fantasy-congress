# Phase 3: Game Experience - Research

**Researched:** 2026-03-23
**Domain:** Fantasy sports dashboard, roster management, league standings — Next.js 16 / React 19 / Zustand 5 / Motion 12 / Recharts 3
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Dashboard Layout**
- D-01: Sports command center layout — multi-panel grid with KPI row across top, matchup scoreboard center-left (~70%), compact trade feed sidebar right (~30%), league standings compact below. Everything visible at once on desktop.
- D-02: Matchup scoreboard uses side-by-side columns — user's team on left, opponent on right. Each shows politician mini-cards stacked vertically with points. Total score at top. MVP highlighted with gold accent.
- D-03: "This Week's Action" (DASH-02) integrated INTO the matchup scoreboard — each politician row shows their trades inline or expandable. MVP highlight built in. No separate section. One unified matchup+action display.
- D-04: Mobile layout: stacked sections — KPI row, matchup scoreboard (full-width), trade feed section, standings. Natural vertical scroll. Matches Phase 1 D-16 mobile-stacked pattern.
- D-05: Compact trade feed sidebar (DASH-04) with "See Full Feed" link to `/feed`. Reuses trade card components from Phase 2 in compact form.

**Roster Management UX**
- D-06: Click-to-swap interaction for active/bench swapping — click a politician to select (highlight border), then click target slot to swap. No drag-and-drop library needed. Works on both desktop and mobile.
- D-07: Scoring breakdown expands inline — click a politician card on My Team and it expands in-place to reveal trade log and season timeline chart below. Other cards push down. Smooth animation.
- D-08: Active roster displayed as 2x4 grid per spec (TEAM-01) — 2 columns, 4 rows. Each card shows photo, stats, corruption badge. Bench as 4 compact slots below.
- D-09: Salary cap displayed as progress bar with dollar amounts — horizontal bar showing used/remaining. Green when under budget, amber at 80%+, red when over. Part of team stats panel alongside win rate, avg points/week, best/worst week (TEAM-05).

**Game State & Persistence**
- D-10: Roster swaps persist to localStorage via Zustand persist middleware. User returns and sees their customized roster. Reset button available to restore original demo roster.
- D-11: Week selector on dashboard — dropdown or tab row to navigate between weeks 1-6. Dashboard matchup and scores update for selected week. Current week highlighted. Adds season browsability.
- D-12: Zustand store scope: game state only — active roster (swaps), selected week, active league. All read-only data (politicians, trades, matchup results) stays in static JSON loaders fetched client-side. Store is thin, only user-mutable state.

**League Page**
- D-13: League activity feed (LEAG-03) generated from existing data at render time — matchup results ("Week 3: Swamp Lords beat Capitol Casuals 142-118"), big trades by league members with points, and weekly MVP. Derived from matchups.json and trades.json. No new data files needed.
- D-14: League schedule (LEAG-02) as week-by-week grid — weeks as columns/rows, each showing all 4 matchups (NOTE: actual data has 2 matchups per week per league — see Data Reality section). Completed weeks show scores, future weeks show pairings. Current week highlighted.
- D-15: Full standings table (LEAG-01) with rank, team name, owner, record, points for/against, streak. User's row highlighted.

### Claude's Discretion
- Week selector component style (dropdown vs horizontal tabs vs pill buttons)
- Trade feed compact card design and how many to show in sidebar
- League activity feed card/event styling
- Schedule grid orientation (horizontal weeks vs vertical weeks)
- Animation timing for inline card expand
- Click-to-swap visual feedback (border color, glow, icon)
- Team stats panel layout within My Team page
- Mobile breakpoints for grid-to-stack transitions
- Navigation route structure (/dashboard, /team, /league URL patterns)

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| DASH-01 | Season KPIs row — team points this week, league rank, W-L-T record, next matchup opponent | Derived from weekResults + schedule + team.record via loadDemoState() |
| DASH-02 | This Week's Action — roster as politician mini-cards with points, trade cards inline, MVP highlight | WeekResult.politicianPoints + loadTrades() filtered to bioguideIds on active roster |
| DASH-03 | Matchup scoreboard — your team vs opponent with visual score display | Matchup from schedule filtered by userTeamId + currentWeek, scores from weekResults |
| DASH-04 | Live Trade Feed sidebar compact with "See Full Feed" link | Reuse TradeCard in compact variant, loadTrades() filtered/sorted by date |
| DASH-05 | League Standings compact table with user row highlighted | SwampLordsTable pattern already exists — adapt for league standings |
| TEAM-01 | 8 active roster slots 2x4 grid with photo, stats, corruption badge | PoliticianCard compact variant, loadPoliticiansByIds(roster.active) |
| TEAM-02 | 4 bench slots in compact format below active roster | PoliticianCard mini variant, loadPoliticiansByIds(roster.bench) |
| TEAM-03 | Drag-and-drop swap between active and bench (click-to-swap per D-06) | Pure React state — no library needed. Zustand store tracks overrides |
| TEAM-04 | Click politician card to expand scoring breakdown with full trade log and season timeline chart | motion/react AnimatePresence + BarChart/LineChart from recharts |
| TEAM-05 | Team stats panel — salary cap used/remaining, team win rate, avg points/week, best/worst week | Computed from roster.salaryUsed/salaryCap + weekResults for the team |
| LEAG-01 | Full standings table with rank, team name, owner, record, points for/against, streak | Pattern from SwampLordsTable in leaderboard — extend to full league scope |
| LEAG-02 | Full season schedule showing every matchup for every week | WeekSchedule[] from loadMatchups() — grid with team name lookups |
| LEAG-03 | League activity feed — trades, draft picks, matchup results | Derived from matchups.json weekResults + trades.json — generated at render time |
</phase_requirements>

---

## Summary

Phase 3 builds three new routes — `/dashboard`, `/team`, `/league` — on top of a data foundation that is already complete. All data loaders (`loadDemoState`, `loadPoliticians`, `loadTrades`, `loadMatchups`) exist and are cached client-side. The design system (PoliticianCard, TradeCard, StatCell, RiskBadge, shadcn/ui primitives) is ready to compose. The primary new work is: (1) creating a thin Zustand store for game state, (2) building the three page layouts, and (3) wiring interactive behaviors (click-to-swap, inline expand, week selector).

One critical data reality: the live `leagues.json` and `matchups.json` were generated with only 18 politicians available, causing the generation script to fall back from the spec'd 8-active + 4-bench to **3-active + 1-bench** per team. Weeks 1-3 have zero scores (no trades in those date ranges); weeks 4-6 have real computed scores. The UI must render correctly with the actual data shape rather than the idealized spec numbers. The 2x4 active grid and 4-bench-slot display from TEAM-01/TEAM-02 should become dynamic based on `roster.active.length` and `roster.bench.length`, not hardcoded to 8+4.

The stack for this phase is fully confirmed: Zustand 5.0.12 with `persist` middleware for localStorage, Motion 12.38 (`motion/react`) for inline expand animation, Recharts 3.8 for the scoring timeline chart (reusing established `CHART_COLORS`/`CHART_AXIS_STYLE` config), and Tailwind 4 with the project's CSS variables. No new packages are needed.

**Primary recommendation:** Build in wave order — Zustand store first (no UI), then Dashboard, then My Team, then League — so each wave has a working foundation and the store is available to all pages.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| zustand | 5.0.12 | Game state store (roster swaps, selected week, active league) | Already in package.json; only state library in project |
| zustand/middleware persist | 5.0.12 | localStorage persistence for roster overrides | Built into zustand dist, no extra install |
| motion/react | 12.38.0 | Inline card expand animation, smooth height transitions | Already installed (`motion` package), project uses it |
| recharts | 3.8.0 | Scoring breakdown timeline chart in TEAM-04 | Already in use with established dark theme config |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| lucide-react | 1.0.1 | Icons: Trophy, Users, Shield, ChevronDown, Star | Week selector, nav icons, MVP crown |
| date-fns | 4.1.0 | Format week date ranges from season-weeks.json | Schedule grid, week selector labels |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Click-to-swap | @dnd-kit, react-beautiful-dnd | DnD libraries add ~25KB and complex setup; click-to-swap works on touch/desktop equally per D-06 |
| Zustand persist | React context + useEffect | Context re-renders entire tree on write; Zustand subscriptions are granular |

**Installation:** No new packages needed. All dependencies are already in `package.json`.

---

## Architecture Patterns

### Recommended Project Structure

```
src/
├── store/
│   └── game-store.ts          # Zustand store (new — thin, only mutable state)
├── app/
│   ├── dashboard/
│   │   └── page.tsx           # Route: /dashboard (client component delegation)
│   ├── team/
│   │   └── page.tsx           # Route: /team
│   └── league/
│       └── page.tsx           # Route: /league
├── components/
│   ├── dashboard/
│   │   ├── dashboard-page.tsx       # Top-level client component, data loader
│   │   ├── kpi-row.tsx              # Season KPI stats (DASH-01)
│   │   ├── matchup-scoreboard.tsx   # Matchup + inline action (DASH-02/03)
│   │   ├── trade-feed-sidebar.tsx   # Compact feed (DASH-04)
│   │   ├── standings-compact.tsx    # Mini standings table (DASH-05)
│   │   └── week-selector.tsx        # Week navigation (D-11)
│   ├── team/
│   │   ├── team-page.tsx            # Top-level client component
│   │   ├── roster-grid.tsx          # Active slots 2-col grid (TEAM-01)
│   │   ├── bench-slots.tsx          # Bench row (TEAM-02)
│   │   ├── roster-card.tsx          # Interactive card with expand (TEAM-03/04)
│   │   └── team-stats-panel.tsx     # Salary cap + season stats (TEAM-05)
│   └── league/
│       ├── league-page.tsx          # Top-level client component
│       ├── standings-table.tsx      # Full standings (LEAG-01)
│       ├── schedule-grid.tsx        # Season schedule (LEAG-02)
│       └── activity-feed.tsx        # Generated event feed (LEAG-03)
```

### Pattern 1: Thin Zustand Store with Persist

**What:** Store holds only user-mutable state. Read-only JSON data lives in loader caches, not the store.
**When to use:** Any time a component needs to read or write game state (selected week, roster overrides).

```typescript
// Source: zustand/middleware/persist.d.ts (project node_modules)
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface GameState {
  selectedWeek: number
  activeLeagueId: string
  rosterOverrides: Record<string, { active: string[]; bench: string[] }>  // keyed by teamId
}

interface GameActions {
  setSelectedWeek: (week: number) => void
  swapRosterSlots: (teamId: string, fromId: string, toId: string, originalRoster: { active: string[]; bench: string[] }) => void
  resetRoster: (teamId: string) => void
}

export const useGameStore = create<GameState & GameActions>()(
  persist(
    (set) => ({
      selectedWeek: 6,          // default to current (most data)
      activeLeagueId: '',
      rosterOverrides: {},
      setSelectedWeek: (week) => set({ selectedWeek: week }),
      swapRosterSlots: (teamId, fromId, toId, originalRoster) =>
        set((state) => {
          const current = state.rosterOverrides[teamId] ?? { ...originalRoster }
          const active = [...current.active]
          const bench = [...current.bench]
          const fromActive = active.indexOf(fromId)
          const fromBench = bench.indexOf(fromId)
          const toActive = active.indexOf(toId)
          const toBench = bench.indexOf(toId)
          // Swap logic: handle active<->bench and active<->active
          if (fromActive >= 0 && toBench >= 0) {
            active[fromActive] = toId
            bench[toBench] = fromId
          } else if (fromBench >= 0 && toActive >= 0) {
            bench[fromBench] = toId
            active[toActive] = fromId
          }
          return { rosterOverrides: { ...state.rosterOverrides, [teamId]: { active, bench } } }
        }),
      resetRoster: (teamId) =>
        set((state) => {
          const { [teamId]: _, ...rest } = state.rosterOverrides
          return { rosterOverrides: rest }
        }),
    }),
    {
      name: 'fantasy-congress-game',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        selectedWeek: state.selectedWeek,
        rosterOverrides: state.rosterOverrides,
      }),
    }
  )
)
```

### Pattern 2: Page Shell — Server Page Delegates to Client Component

**What:** `/app/dashboard/page.tsx` is a thin server page that delegates to a `'use client'` component. This is the established project pattern (see `app/feed/page.tsx`, `app/politicians/page.tsx`).
**When to use:** All three new pages (dashboard, team, league) — consistent with project.

```typescript
// src/app/dashboard/page.tsx
import { DashboardPage } from '@/components/dashboard/dashboard-page'

export default function Dashboard() {
  return <DashboardPage />
}
```

```typescript
// src/components/dashboard/dashboard-page.tsx
'use client'
import { useEffect, useState } from 'react'
import { loadDemoState } from '@/lib/data/demo'
import { loadPoliticians } from '@/lib/data/politicians'
import { loadTrades } from '@/lib/data/trades'
import { loadMatchups } from '@/lib/data/demo'
// ... component body with skeleton loading state
```

### Pattern 3: Click-to-Swap State Machine

**What:** Two-phase selection — first click selects source (highlights card), second click on any other slot executes swap.
**When to use:** RosterGrid component on /team page.

```typescript
// src/components/team/roster-grid.tsx
'use client'
const [selectedId, setSelectedId] = useState<string | null>(null)

function handleCardClick(bioguideId: string) {
  if (!selectedId) {
    // Phase 1: select source
    setSelectedId(bioguideId)
  } else if (selectedId === bioguideId) {
    // Deselect
    setSelectedId(null)
  } else {
    // Phase 2: execute swap
    swapRosterSlots(userTeamId, selectedId, bioguideId, originalRoster)
    setSelectedId(null)
  }
}
```

### Pattern 4: Inline Expand with Motion AnimatePresence

**What:** Clicking a politician card on /team expands a section below it showing trade log + timeline chart. Other cards push down via layout animation.
**When to use:** RosterCard expand on My Team (TEAM-04). Uses `motion/react`.

```typescript
// Source: motion/react (motion package v12.38.0)
import { AnimatePresence, motion } from 'motion/react'

// Inside roster card:
<AnimatePresence>
  {isExpanded && (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="overflow-hidden"
    >
      {/* Trade log + scoring timeline */}
    </motion.div>
  )}
</AnimatePresence>
```

### Pattern 5: Derived Activity Feed

**What:** League activity events are generated at render time from existing data — no new data file.
**When to use:** Activity feed on /league page (LEAG-03).

```typescript
// Derive events from existing data
type ActivityEvent =
  | { type: 'matchup_result'; week: number; winnerName: string; loserName: string; winnerScore: number; loserScore: number }
  | { type: 'mvp'; week: number; teamName: string; politicianName: string; points: number }
  | { type: 'big_trade'; politicianName: string; ticker: string; points: number; tradeDate: string }

function deriveActivityFeed(league: League, weekResults: WeekResult[], schedules: WeekSchedule[], politicians: Politician[], trades: Trade[]): ActivityEvent[] {
  const events: ActivityEvent[] = []
  // 1. For each completed matchup: add matchup_result event
  // 2. For each week: add mvp event (highest points in weekResults for that team in that week)
  // 3. For trades by politicians on league rosters: add big_trade events (fantasyPoints > threshold)
  return events.sort((a, b) => /* week desc */ )
}
```

### Anti-Patterns to Avoid

- **Storing fetched data in Zustand:** All JSON data (politicians, trades, leagues, matchups) belongs in loader caches and local component state, not in the Zustand store. Store is for user mutations only (D-12).
- **Hardcoding 8 active / 4 bench slots:** The live data has 3 active + 1 bench due to politician pool size. Render `roster.active.map(...)` dynamically — never `Array(8).fill(null)`.
- **Using `next/image`:** Static export is configured (`output: 'export'`). Use `<img>` tags, same as PoliticianCard already does.
- **Using `searchParams` for week selection:** Since this is a static export, server-side search params cause dynamic rendering which breaks static export. Week state belongs in Zustand store (or React state for local-only selection).
- **Reinventing Recharts dark config:** `CHART_COLORS`, `CHART_AXIS_STYLE`, and `CHART_TOOLTIP_STYLE` in `src/lib/chart-config.ts` already encode the dark theme with correct oklch values. Import and reuse — do not inline new color strings.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| localStorage persistence | Custom useEffect save/load | `zustand/middleware/persist` with `createJSONStorage(() => localStorage)` | Handles SSR hydration mismatch, version migration, partial state — all edge cases |
| Animated expand/collapse | CSS max-height transitions | `motion/react` AnimatePresence with `height: 'auto'` | height:auto cannot be CSS-transitioned; motion handles it via layout measurement |
| Standings sort logic | Custom sort function | Adapt SwampLordsTable pattern in `src/components/leaderboard/swamp-lords-table.tsx` | Already implements wins-desc + pointsFor-desc tiebreaker — proven correct |
| Salary cap color logic | Ad-hoc className ternaries | Inline threshold check with Tailwind classes: `salaryPct >= 1 ? 'bg-red-500' : salaryPct >= 0.8 ? 'bg-amber-500' : 'bg-emerald-500'` | Simple but worth centralizing in one function |
| Dark theme Recharts | New color config | `CHART_COLORS`, `CHART_AXIS_STYLE`, `CHART_TOOLTIP_STYLE` from `@/lib/chart-config` | Already correct for oklch-based dark theme |
| Party color for borders | Hardcoded hex values | `PARTY_COLORS[politician.party]` from `@/lib/party-colors` | CSS vars via inline `style={{ borderLeft: \`3px solid ${partyColor}\` }}` pattern |

**Key insight:** The project already has correct implementations of sorting, coloring, charting, and card patterns. Phase 3 is composition more than net-new code.

---

## Common Pitfalls

### Pitfall 1: Roster Data vs. Spec Mismatch

**What goes wrong:** Code assumes 8 active + 4 bench slots but live data has 3 active + 1 bench. Hardcoded slot grids render empty cards or throw array-out-of-bounds errors.
**Why it happens:** `scripts/generate-demo.ts` dynamically scales down from 8+4 when politician pool is small. With 18 politicians and 8 teams per league, 3 active + 1 bench (4 total = 32 per league) fits; 8+4 (96 per league) does not.
**How to avoid:** Render roster slots from `roster.active` and `roster.bench` array lengths. Use `ACTIVE_SLOTS = roster.active.length` dynamically. Display "X of Y active" rather than hardcoding "8 active slots".
**Warning signs:** TypeScript errors on index access, empty card placeholders in the grid, console errors about undefined `bioguideId`.

### Pitfall 2: Zustand + SSR Hydration Mismatch

**What goes wrong:** Zustand persist middleware reads localStorage during server render, causing React hydration warnings or mismatches because server has no localStorage.
**Why it happens:** The project uses `output: 'export'` (static export), which means no true SSR — but Next.js still does a server-side render pass during `next build`. Accessing localStorage in the store initializer triggers "localStorage is not defined" errors.
**How to avoid:** Use `createJSONStorage(() => localStorage)` (the lazy getter pattern) — Zustand middleware already calls the getter lazily. Also add `skipHydration: false` (default) and use `useGameStore.persist.hasHydrated()` check if needed in components that render before hydration completes.
**Warning signs:** "localStorage is not defined" during `next build`, React hydration mismatch warnings in the console.

### Pitfall 3: Weeks 1-3 Have Zero Scores

**What goes wrong:** Dashboard shows "0 pts" for all team members when week 1, 2, or 3 is selected. Matchup scoreboards show 0-0. This looks like a bug.
**Why it happens:** Only weeks 4-6 have trades falling within the week date ranges in `season-weeks.json`. Weeks 1-3 in `matchups.json` have `homeScore: 0 / awayScore: 0` and all `weekResults` for those weeks have `points: 0`.
**How to avoid:** Default `selectedWeek` in the Zustand store to 6 (the current week with data). If displaying empty-state for zero-point weeks, add a note ("No trades recorded this week") rather than implying error. Verify current week is 6 via `league.currentWeek`.
**Warning signs:** Users see blank/zero dashboards when week selector defaults to week 1.

### Pitfall 4: Schedule Has 2 Matchups Per Week (Not 4)

**What goes wrong:** LEAG-02 schedule grid spec says "all 4 matchups" per week but each league's weekly schedule only contains 2 matchups (4 teams playing = 2 games per week, not 4).
**Why it happens:** 8 teams produce 4 matchups per week, but the generated league data has 8 teams but the schedule only shows 2 matchups per week in the leagues.json schedule (the generator may have constrained this). The global `matchups.json` schedules have 6 matchups per week across all 3 leagues combined (2 per league).
**How to avoid:** Filter `schedules` by `leagueId` to get only that league's matchups. Render however many matchups exist (not a hardcoded 4). Confirm by reading `leagues[0].schedule[0].matchups.length` which is 2.
**Warning signs:** Empty rows in schedule grid, incorrect matchup count labels.

### Pitfall 5: Navigation Already Has /team But Not /dashboard or /league

**What goes wrong:** `nav-desktop.tsx` already links `/team` — clicking it before this phase's route is created shows a 404.
**Why it happens:** Nav was built anticipating these routes but the pages don't exist yet.
**How to avoid:** Create all three route directories simultaneously (`dashboard/`, `team/`, `league/`). The nav for `/dashboard` and `/league` also needs to be added to both `nav-desktop.tsx` and `nav-mobile.tsx`.
**Warning signs:** 404 on `/dashboard` and `/league`, nav active state not matching.

### Pitfall 6: Static Export Prevents Dynamic Route Params

**What goes wrong:** Using URL params like `/dashboard?week=4` with `searchParams` prop causes the page to opt into dynamic rendering, breaking static export.
**Why it happens:** `searchParams` is a Request-time API per Next.js 16 docs — using it prevents static generation.
**How to avoid:** Store selected week in Zustand (D-12 locks this). Never use URL search params for week state. Navigation between weeks happens entirely in client state.
**Warning signs:** `next build` error: "Page /dashboard cannot be statically generated because it uses searchParams".

---

## Code Examples

Verified patterns from project codebase:

### Loading Demo State (data foundation for all three pages)
```typescript
// Pattern established in src/lib/data/demo.ts
'use client'
import { useState, useEffect } from 'react'
import { loadDemoState } from '@/lib/data/demo'
import { loadPoliticians } from '@/lib/data/politicians'
import { loadMatchups } from '@/lib/data/demo'
import type { DemoState, WeekSchedule, WeekResult } from '@/types'
import type { Politician } from '@/types'

// In a dashboard-page.tsx client component:
const [demoState, setDemoState] = useState<DemoState | null>(null)
const [politicians, setPoliticians] = useState<Politician[]>([])
const [schedules, setSchedules] = useState<WeekSchedule[]>([])

useEffect(() => {
  Promise.all([
    loadDemoState(),
    loadPoliticians(),
    loadMatchups(),
  ]).then(([demo, pols, { schedules }]) => {
    setDemoState(demo)
    setPoliticians(pols)
    setSchedules(schedules)
  })
}, [])
```

### Zustand Store Creation (Persist Pattern)
```typescript
// Source: zustand/middleware persist.d.ts + zustand main exports
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useGameStore = create<GameState & GameActions>()(
  persist(
    (set) => ({ /* ... state and actions ... */ }),
    {
      name: 'fantasy-congress-game',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        selectedWeek: state.selectedWeek,
        rosterOverrides: state.rosterOverrides,
      }),
    }
  )
)
```

### Inline Expand Animation (Motion/React)
```typescript
// Source: motion package v12.38.0, exported via 'motion/react'
import { AnimatePresence, motion } from 'motion/react'

<AnimatePresence>
  {expanded && (
    <motion.div
      key="expand"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="overflow-hidden"
    >
      {/* content */}
    </motion.div>
  )}
</AnimatePresence>
```

### Party Color via CSS Variable Pattern
```typescript
// Source: src/lib/party-colors.ts + politician-card.tsx established pattern
import { PARTY_COLORS } from '@/lib/party-colors'
const partyColor = PARTY_COLORS[politician.party] ?? PARTY_COLORS['I']
// Use inline style for SVG-compatible color (not CSS var):
<div style={{ borderLeft: `3px solid ${partyColor}` }}>
```

### Timeline Chart for Scoring Breakdown (TEAM-04)
```typescript
// Source: src/components/profile/fantasy-stats-tab.tsx + src/lib/chart-config.ts
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { CHART_COLORS, CHART_AXIS_STYLE, CHART_TOOLTIP_STYLE } from '@/lib/chart-config'

const weeklyData = politician.weeklyPoints.map((pts, i) => ({
  week: `W${i + 1}`,
  points: pts,
}))

<ResponsiveContainer width="100%" height={150}>
  <BarChart data={weeklyData}>
    <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.border} />
    <XAxis dataKey="week" {...CHART_AXIS_STYLE} />
    <YAxis {...CHART_AXIS_STYLE} />
    <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
    <Bar dataKey="points" fill={CHART_COLORS.primary} radius={[3, 3, 0, 0]} />
  </BarChart>
</ResponsiveContainer>
```

### Skeleton Loading Pattern
```typescript
// Source: src/components/ui/skeleton.tsx (project pattern)
import { Skeleton } from '@/components/ui/skeleton'

// While data loading:
if (!demoState) {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20 flex-1 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-64 w-full rounded-xl" />
    </div>
  )
}
```

### Salary Cap Progress Bar
```typescript
// Derived from D-09 spec
const pct = roster.salaryUsed / roster.salaryCap
const barColor = pct >= 1 ? 'bg-red-500' : pct >= 0.8 ? 'bg-amber-500' : 'bg-emerald-500'

<div className="w-full bg-muted rounded-full h-2">
  <div
    className={`h-2 rounded-full transition-all ${barColor}`}
    style={{ width: `${Math.min(pct * 100, 100)}%` }}
  />
</div>
<div className="flex justify-between text-xs text-muted-foreground mt-1">
  <span>${roster.salaryUsed.toLocaleString()} used</span>
  <span>${(roster.salaryCap - roster.salaryUsed).toLocaleString()} remaining</span>
</div>
```

---

## Data Reality

This section documents the actual live data shapes (from `public/data/`) vs. what the requirements spec describes. Implementors must use the actual data.

| Spec | Actual | Impact |
|------|--------|--------|
| 8 active + 4 bench per team | 3 active + 1 bench | Render slots dynamically from array length, not hardcoded |
| Weeks 1-6 have match scores | Weeks 1-3 = all zeros; weeks 4-6 have real scores | Default to week 6; add zero-state handling |
| "4 matchups per week" in league schedule | 2 matchups per week per league (8 teams / 2 = 4 games but data shows 2) | Render however many matchups exist |
| Politicians with rich weekly point data | `politicianPoints` only lists politicians on active roster at time of gen | Expand chart only for politicians in roster |
| 8 teams per league | Confirmed 8 teams per league | Matches spec |
| 3 leagues | Confirmed: league-beltway, league-capitol, league-swamp | Matches spec |

**Roster data note:** If more politicians are added in a future data rebuild (via `npm run fetch-data`), the dynamic sizing script will automatically scale up to 8+4. UI rendering dynamically means it will "just work" with more slots without a code change.

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `react-beautiful-dnd` for roster swaps | Click-to-swap with React state | D-06 decision | No extra library, works on mobile, simpler state model |
| `framer-motion` | `motion` (standalone) | motion v10+ split from framer-motion | Import from `'motion/react'` not `'framer-motion'` — different package |
| Zustand v4 `persist` | Zustand v5 `persist` (stable, same API) | v5.0.0 | API unchanged; `createJSONStorage` pattern identical |
| `next/image` | `<img>` tag | Project constraint (static export) | `images.unoptimized: true` in next.config.ts |

**Deprecated/outdated:**
- `framer-motion`: Do NOT install or import this. The project uses the `motion` package (v12.38.0), imported as `'motion/react'`.
- `@hello-pangea/dnd` / `react-beautiful-dnd`: Do NOT add for roster swaps — click-to-swap is locked in D-06.
- `useRouter().push()` for week navigation: Week state is in Zustand store, not URL params.

---

## Open Questions

1. **Roster slot display when active count is 3 (not 8)**
   - What we know: `roster.active.length === 3`, `roster.bench.length === 1` in all live data
   - What's unclear: Should the UI show 8 labeled empty slots with 3 filled, or just 3 cards with no empty slots?
   - Recommendation: Show only filled cards — empty slots add visual noise with no interactivity when there are no players to put in them. Label as "Active Roster (3)" not "Active Roster (8 slots)". If data later has 8, it renders 8.

2. **Week selector default: should it be `league.currentWeek` or hardcoded to 6?**
   - What we know: `league.currentWeek === 6` in all three leagues. Weeks 4-6 have scores.
   - What's unclear: `currentWeek` is dynamic (reads from JSON), but initializing Zustand with a fetched value requires two-step initialization.
   - Recommendation: Initialize `selectedWeek` to 6 as a constant in the store default, then override with `league.currentWeek` when data loads in the page component via `setSelectedWeek(league.currentWeek)` on first load (if not already persisted).

3. **Navigation: should `/dashboard` replace `/` as the default landing page?**
   - What we know: `/` currently renders the landing page. CONTEXT.md D-04 references `/dashboard` as the dashboard route. Nav already links `/team`.
   - What's unclear: Whether `/` should redirect to `/dashboard` or stay as landing. CONTEXT.md doesn't specify a route change for `/`.
   - Recommendation: Keep `/` as landing. Add `/dashboard`, `/team`, `/league` as new routes. Update nav to add Dashboard and League links alongside existing Team link.

---

## Sources

### Primary (HIGH confidence)
- `/Users/solofilms/FantasyCongress/node_modules/zustand/middleware/persist.d.ts` — persist middleware full API
- `/Users/solofilms/FantasyCongress/node_modules/zustand/` main exports — `create`, `useStore`, `createStore`
- `/Users/solofilms/FantasyCongress/node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/page.md` — Next.js 16 page conventions, params as Promise, static export constraints
- `/Users/solofilms/FantasyCongress/src/types/demo.ts` — verified League, Team, Roster, Matchup, WeekResult interfaces
- `/Users/solofilms/FantasyCongress/public/data/leagues.json` — actual roster sizes (3+1), confirmed 8 teams, 3 leagues
- `/Users/solofilms/FantasyCongress/public/data/matchups.json` — confirmed weeks 1-3 zero scores, weeks 4-6 have data
- `/Users/solofilms/FantasyCongress/src/lib/chart-config.ts` — CHART_COLORS, CHART_AXIS_STYLE (reuse verbatim)
- `/Users/solofilms/FantasyCongress/src/components/design/politician-card.tsx` — full/compact/mini variant API confirmed
- `/Users/solofilms/FantasyCongress/src/components/leaderboard/swamp-lords-table.tsx` — standings sort pattern to adapt
- `/Users/solofilms/FantasyCongress/src/components/feed/trade-card.tsx` — TradeCard API for compact feed reuse
- `/Users/solofilms/FantasyCongress/package.json` — confirmed: motion 12.38.0, zustand 5.0.12, recharts 3.8.0, lucide-react 1.0.1

### Secondary (MEDIUM confidence)
- `motion/react` export path confirmed via package.json `exports` key inspection
- Zustand v5 persist pattern confirmed via dist/middleware directory scan

### Tertiary (LOW confidence)
- None

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all packages confirmed installed with exact versions from package.json
- Architecture: HIGH — patterns derived from existing project code, not speculation
- Data shapes: HIGH — verified by direct inspection of live JSON files
- Pitfalls: HIGH — derived from code inspection (generate-demo.ts sizing logic, next.config.ts static export) not guesswork

**Research date:** 2026-03-23
**Valid until:** 2026-04-22 (stable stack; data may change if `npm run fetch-data` is re-run and produces more politicians, which would change roster slot counts)
