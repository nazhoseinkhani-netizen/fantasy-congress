# Phase 3: Game Experience - Context

**Gathered:** 2026-03-23
**Status:** Ready for planning

<domain>
## Phase Boundary

Dashboard, My Team roster management, and League standings/schedule/activity — the full fantasy sports product loop. Users can check their weekly matchup, manage their roster (active/bench swaps), see league standings, browse the full season schedule, and follow league activity. All powered by pre-populated demo data that feels like a live season. No draft mechanics (Phase 4), no animations/sharing (Phase 5).

</domain>

<decisions>
## Implementation Decisions

### Dashboard Layout
- **D-01:** Sports command center layout — multi-panel grid with KPI row across top, matchup scoreboard center-left (~70%), compact trade feed sidebar right (~30%), league standings compact below. Everything visible at once on desktop.
- **D-02:** Matchup scoreboard uses side-by-side columns — user's team on left, opponent on right. Each shows politician mini-cards stacked vertically with points. Total score at top. MVP highlighted with gold accent.
- **D-03:** "This Week's Action" (DASH-02) integrated INTO the matchup scoreboard — each politician row shows their trades inline or expandable. MVP highlight built in. No separate section. One unified matchup+action display.
- **D-04:** Mobile layout: stacked sections — KPI row, matchup scoreboard (full-width), trade feed section, standings. Natural vertical scroll. Matches Phase 1 D-16 mobile-stacked pattern.
- **D-05:** Compact trade feed sidebar (DASH-04) with "See Full Feed" link to `/feed`. Reuses trade card components from Phase 2 in compact form.

### Roster Management UX
- **D-06:** Click-to-swap interaction for active/bench swapping — click a politician to select (highlight border), then click target slot to swap. No drag-and-drop library needed. Works on both desktop and mobile.
- **D-07:** Scoring breakdown expands inline — click a politician card on My Team and it expands in-place to reveal trade log and season timeline chart below. Other cards push down. Smooth animation.
- **D-08:** Active roster displayed as 2x4 grid per spec (TEAM-01) — 2 columns, 4 rows. Each card shows photo, stats, corruption badge. Bench as 4 compact slots below.
- **D-09:** Salary cap displayed as progress bar with dollar amounts — horizontal bar showing used/remaining. Green when under budget, amber at 80%+, red when over. Part of team stats panel alongside win rate, avg points/week, best/worst week (TEAM-05).

### Game State & Persistence
- **D-10:** Roster swaps persist to localStorage via Zustand persist middleware. User returns and sees their customized roster. Reset button available to restore original demo roster.
- **D-11:** Week selector on dashboard — dropdown or tab row to navigate between weeks 1-6. Dashboard matchup and scores update for selected week. Current week highlighted. Adds season browsability.
- **D-12:** Zustand store scope: game state only — active roster (swaps), selected week, active league. All read-only data (politicians, trades, matchup results) stays in static JSON loaders fetched client-side. Store is thin, only user-mutable state.

### League Page
- **D-13:** League activity feed (LEAG-03) generated from existing data at render time — matchup results ("Week 3: Swamp Lords beat Capitol Casuals 142-118"), big trades by league members with points, and weekly MVP. Derived from matchups.json and trades.json. No new data files needed.
- **D-14:** League schedule (LEAG-02) as week-by-week grid — weeks as columns/rows, each showing all 4 matchups. Completed weeks show scores, future weeks show pairings. Current week highlighted.
- **D-15:** Full standings table (LEAG-01) with rank, team name, owner, record, points for/against, streak. User's row highlighted.

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

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Context
- `.planning/PROJECT.md` — Core value proposition, constraints, "localStorage for prototype" state management, design direction
- `.planning/REQUIREMENTS.md` — Phase 3 requirements: DASH-01 through DASH-05, TEAM-01 through TEAM-05, LEAG-01 through LEAG-03
- `.planning/ROADMAP.md` — Phase 3 success criteria (3 criteria), phase dependencies
- `CLAUDE.md` — Technology stack: Next.js 16, React 19.2, Tailwind CSS 4.x, shadcn/ui, Zustand 5.x, Recharts 3.x, Motion

### Prior Phase Context
- `.planning/phases/01-foundation/01-CONTEXT.md` — Design system (D-13 through D-17), demo data structure (D-09 through D-12), DraftKings aesthetic locked
- `.planning/phases/02-discovery/02-CONTEXT.md` — UI patterns for trade feed (D-13 through D-15), leaderboard patterns (D-16 through D-18)

### Existing Code (Phase 3 dependencies)
- `src/types/demo.ts` — League, Team, Roster, Matchup, WeekResult, DemoState interfaces
- `src/lib/data/demo.ts` — loadLeagues(), loadMatchups(), loadDemoState() data loaders
- `src/lib/data/politicians.ts` — loadPoliticians() for politician lookup by bioguideId
- `src/lib/data/trades.ts` — loadTrades() for trade data
- `src/components/design/politician-card.tsx` — PoliticianCard with full/compact/mini variants
- `src/components/design/risk-badge.tsx` — RiskBadge component
- `src/components/design/stat-cell.tsx` — StatCell component
- `src/components/ui/` — Card, Badge, Tabs, Tooltip, Skeleton, Sheet, Button
- `src/components/layout/` — nav-desktop.tsx, nav-mobile.tsx (need new route links)
- `src/lib/scoring/config.ts` — SEASON_WEEKS constant for week count
- `public/data/leagues.json` — Pre-populated league data (3 leagues, 8 teams each)
- `public/data/matchups.json` — Season schedules and week results
- `public/data/season-weeks.json` — Week date ranges

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `PoliticianCard` (full/compact/mini): Mini variant ideal for matchup scoreboard rows and roster grid cards
- `RiskBadge`: Reuse on all roster cards for corruption indicator
- `StatCell`: Reuse for KPI row items on dashboard
- `Card`, `Tabs`, `Skeleton`: shadcn/ui primitives for page composition
- `loadDemoState()`: Single call loads user's league, team, and all week results — primary data source for dashboard
- `loadPoliticians()` + `loadTrades()`: For enriching roster cards with full politician data and trade details

### Established Patterns
- Client-side data loading via fetch to `/data/*.json` with caching
- `'use client'` directive on interactive components
- `<img>` tags (not next/image) per static export constraint
- `cn()` utility for Tailwind class merging
- Party colors via CSS variables: `var(--party-dem)`, `var(--party-rep)`, `var(--party-ind)`
- FilterSidebar dual-render pattern (mobile Sheet + desktop sidebar) from Phase 2
- Recharts with dark theme config established in Phase 2

### Integration Points
- Global nav needs new route links: /dashboard, /team, /league
- Mobile bottom tab bar needs updated navigation items
- `src/app/` needs new route directories: dashboard/, team/, league/
- No Zustand store exists yet — this phase introduces it
- Scoring engine (`src/lib/scoring/`) already computes per-politician scores — roster cards display these

</code_context>

<specifics>
## Specific Ideas

- **"Sports command center" dashboard** — Everything visible at once, DraftKings live matchup feel. KPIs + matchup + feed + standings in one view.
- **Integrated matchup + action** — DASH-02 and DASH-03 merged into one section. No separate "This Week's Action" — the matchup scoreboard IS the action, with politician trades visible inline.
- **Click-to-swap simplicity** — No drag library overhead. Click source, click target, swap. Clear highlight feedback. Works everywhere.
- **Thin Zustand store** — Only user-mutable state (roster swaps, week selection, active league). Read-only data stays in existing loaders. localStorage persistence for roster changes.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 03-game-experience*
*Context gathered: 2026-03-23*
