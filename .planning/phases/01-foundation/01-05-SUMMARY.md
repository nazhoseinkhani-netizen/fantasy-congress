---
phase: 01-foundation
plan: 05
subsystem: data-layer
tags: [demo-data, snake-draft, data-loaders, leagues, matchups]
dependency_graph:
  requires: [01-01, 01-04]
  provides: [public/data/leagues.json, public/data/matchups.json, src/lib/data/]
  affects: [Phase 02 UI components that render leagues, dashboard, team, standings]
tech_stack:
  added: []
  patterns:
    - "Snake draft simulation with salary cap constraints"
    - "Module-level cache pattern for client-side fetch loaders"
    - "Round-robin schedule generation (Berger algorithm)"
key_files:
  created:
    - scripts/generate-demo.ts
    - public/data/leagues.json
    - public/data/matchups.json
    - src/lib/data/politicians.ts
    - src/lib/data/trades.ts
    - src/lib/data/demo.ts
    - src/lib/data/index.ts
  modified:
    - scripts/build-pipeline.ts
decisions:
  - "Allow same politician in multiple leagues (mirrors real fantasy sports — different leagues pick from same player pool)"
  - "User assigned to team with record closest to 3-3 by minimizing abs(wins-3)+abs(losses-3)"
  - "Snake draft uses salary floor reservation per remaining pick to prevent teams running out of budget mid-draft"
metrics:
  duration: 162s
  completed: "2026-03-23"
  tasks_completed: 2
  files_created: 7
  files_modified: 1
---

# Phase 01 Plan 05: Demo Data Layer Summary

Snake draft simulation generating 3 themed leagues with 8 teams each, 6 weeks of matchup results derived from real politician weekly points, and typed fetch-based data loaders for all JSON files.

## What Was Built

### Task 1: Demo League, Roster, and Matchup Generation

`scripts/generate-demo.ts` — 280-line TypeScript script that:

1. Loads `public/data/politicians.json` (82 politicians from Plan 04)
2. Runs a salary-cap snake draft simulation for each of 3 leagues
3. Generates a 6-week round-robin schedule using the Berger algorithm
4. Computes matchup scores from actual politician `weeklyPoints` data
5. Builds win/loss records, points totals, and streak strings per team
6. Generates `WeekResult` entries (MVP bioguideId) for each team/week
7. Assigns the user to the team in League 1 with record closest to 3-3

Output files:
- `public/data/leagues.json` — 3 leagues, 8 teams each, rosters, records
- `public/data/matchups.json` — 6-week schedules + 144 WeekResult entries

User result: "The Filibusters" in The Beltway Bandits with 3-3-0 record.

`scripts/build-pipeline.ts` updated: steps renumbered 1-5, new step `[5/5] Generating demo data...` calls `generate-demo.ts`.

### Task 2: Typed Data Loader Functions

`src/lib/data/` module with module-level caching (fetch once, return cached thereafter):

| File | Exports |
|------|---------|
| `politicians.ts` | `loadPoliticians`, `loadPoliticianById`, `loadPoliticiansByIds`, `clearPoliticiansCache` |
| `trades.ts` | `loadTrades`, `loadTradesForPolitician`, `clearTradesCache` |
| `demo.ts` | `loadLeagues`, `loadMatchups`, `loadDemoState`, `clearDemoCache` |
| `index.ts` | Re-exports all 11 functions |

All loaders fetch from `public/data/*.json`, are typed against `src/types` interfaces, and pass `tsc --noEmit` clean.

## Decisions Made

1. **Same politician allowed across leagues** — Real fantasy sports (ESPN, Yahoo) allow the same NFL player to be on different league teams; applied same pattern here. Simplifies draft simulation and allows better distribution of top talent per league.

2. **User team selection by closest-to-3-3 algorithm** — After matchup simulation, iterate all League 1 teams and score each by `abs(wins-3) + abs(losses-3)`. The Filibusters landed exactly 3-3 from natural simulation results.

3. **Salary floor reservation in snake draft** — During pick selection, the algorithm reserves `remaining_picks * min_salary (644)` to prevent a team from spending all salary on early picks and being unable to fill later roster slots.

## Deviations from Plan

None — plan executed exactly as written.

## Verification Results

- `scripts/generate-demo.ts` runs without errors
- `public/data/leagues.json`: 3 leagues, 8 teams each
- League names: The Beltway Bandits, Capitol Casuals, Swamp Lords Supreme
- All 24 teams have `roster.active` (8 entries) and `roster.bench` (4 entries)
- All 24 teams have `salaryUsed <= 50000`
- Exactly 1 team has `isUserTeam: true` (The Filibusters, 3-3-0)
- `public/data/matchups.json`: 6 weeks, 12 matchups/week (3 leagues x 4 each), 144 WeekResult entries
- All matchups have `completed: true`
- `npx tsc --noEmit` exits with code 0
- `src/lib/data/index.ts` re-exports from all 3 modules

## Self-Check: PASSED
