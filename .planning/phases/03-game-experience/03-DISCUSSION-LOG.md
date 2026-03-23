# Phase 3: Game Experience - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-23
**Phase:** 03-game-experience
**Areas discussed:** Dashboard layout, Roster management UX, Game state persistence, League activity feed

---

## Dashboard Layout

### Organization

| Option | Description | Selected |
|--------|-------------|----------|
| Sports command center | Multi-panel grid: KPI row top, matchup center-left, trade feed sidebar right, standings below | ✓ |
| Matchup-first fullscreen | Matchup dominates page, tabs below for feed/standings | |
| You decide | Claude picks | |

**User's choice:** Sports command center
**Notes:** None

### Matchup Display

| Option | Description | Selected |
|--------|-------------|----------|
| Side-by-side columns | Your team left, opponent right, politician rows with points, MVP gold accent | ✓ |
| Alternating rows | Position-by-position comparison in shared rows | |
| You decide | Claude picks | |

**User's choice:** Side-by-side columns
**Notes:** None

### This Week's Action Integration

| Option | Description | Selected |
|--------|-------------|----------|
| Integrated into matchup | Matchup scoreboard IS the week's action, trades inline per politician | ✓ |
| Separate section below matchup | Matchup shows scores only, separate horizontal scroll section below | |
| You decide | Claude picks | |

**User's choice:** Integrated into matchup
**Notes:** None

### Mobile Layout

| Option | Description | Selected |
|--------|-------------|----------|
| Stacked sections | KPIs → matchup → trade feed → standings, natural scroll | ✓ |
| Swipeable cards | KPIs fixed, swipeable panels for matchup/feed/standings | |
| You decide | Claude picks | |

**User's choice:** Stacked sections
**Notes:** None

---

## Roster Management UX

### Swap Interaction

| Option | Description | Selected |
|--------|-------------|----------|
| Click-to-swap | Click to select, click target to swap. No DnD library. Works on mobile. | ✓ |
| Drag-and-drop | DnD library needed, touch fallback required | |
| Both modes | DnD desktop, click mobile. Most work. | |
| You decide | Claude picks | |

**User's choice:** Click-to-swap
**Notes:** None

### Scoring Breakdown Expand

| Option | Description | Selected |
|--------|-------------|----------|
| Inline expand | Card expands in-place, trade log + chart below, other cards push down | ✓ |
| Slide-out drawer | Right drawer (desktop) / bottom sheet (mobile) with full breakdown | |
| You decide | Claude picks | |

**User's choice:** Inline expand
**Notes:** None

### Roster Grid

| Option | Description | Selected |
|--------|-------------|----------|
| 2x4 grid (per spec) | 2 columns, 4 rows as specified in TEAM-01 | ✓ |
| 4x2 grid | 4 columns, 2 rows, wider layout | |
| You decide | Claude picks | |

**User's choice:** 2x4 grid (per spec)
**Notes:** None

### Salary Cap Display

| Option | Description | Selected |
|--------|-------------|----------|
| Progress bar + numbers | Horizontal bar, used/remaining, green/amber/red thresholds | ✓ |
| Pie/donut chart | Visual donut showing salary allocation per politician | |
| You decide | Claude picks | |

**User's choice:** Progress bar + numbers
**Notes:** None

---

## Game State Persistence

### Roster Persistence

| Option | Description | Selected |
|--------|-------------|----------|
| localStorage via Zustand persist | Roster changes saved, persist across sessions, reset button available | ✓ |
| Session only | Memory only, page refresh resets | |
| You decide | Claude picks | |

**User's choice:** localStorage via Zustand persist
**Notes:** None

### Week Navigation

| Option | Description | Selected |
|--------|-------------|----------|
| Week selector | Dropdown/tabs for weeks 1-6, dashboard updates per week | ✓ |
| Current week only | Dashboard locked to latest week | |
| You decide | Claude picks | |

**User's choice:** Week selector
**Notes:** None

### Zustand Store Scope

| Option | Description | Selected |
|--------|-------------|----------|
| Game state only | Roster swaps, selected week, active league. Read-only data stays in loaders. | ✓ |
| Full app state | Also caches loaded JSON in Zustand | |
| You decide | Claude picks | |

**User's choice:** Game state only
**Notes:** None

---

## League Activity Feed

### Data Source

| Option | Description | Selected |
|--------|-------------|----------|
| Generated from existing data | Derive events from matchup results + trades at render time | ✓ |
| New events JSON file | Pre-generate league-events.json in build pipeline | |
| You decide | Claude picks | |

**User's choice:** Generated from existing data
**Notes:** None

### Event Types

| Option | Description | Selected |
|--------|-------------|----------|
| Matchup results + trades | Results, big trades with points, weekly MVP | ✓ |
| Results only | Just matchup outcomes and standings changes | |
| Full fantasy sim | Add fake waiver moves, trash talk, roster moves | |

**User's choice:** Matchup results + trades
**Notes:** None

### Schedule Display

| Option | Description | Selected |
|--------|-------------|----------|
| Week-by-week grid | Weeks as columns/rows, 4 matchups each, scores for completed | ✓ |
| Calendar view | Month calendar with matchup dates | |
| You decide | Claude picks | |

**User's choice:** Week-by-week grid
**Notes:** None

---

## Claude's Discretion

- Week selector component style
- Trade feed compact card design and count
- League activity feed event styling
- Schedule grid orientation
- Animation timing for inline expand
- Click-to-swap visual feedback
- Team stats panel layout
- Mobile breakpoints
- Route URL patterns

## Deferred Ideas

None — discussion stayed within phase scope.
