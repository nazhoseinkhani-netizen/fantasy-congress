---
phase: 04-draft-room
plan: 01
subsystem: ui
tags: [zustand, typescript, draft, snake-draft, ai, grading]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: Politician types, scoring engine, salary cap constants
  - phase: 03-game-experience
    provides: Zustand persist pattern, game-store.ts reference implementation
provides:
  - DraftPhase, AIArchetype, DRAFT_CONFIG, DraftTeam, DraftPick, DraftGrade, SleeperPick types
  - snakeDraftTeamIndex and generateDraftOrder pure utility functions
  - scoreForArchetype and selectAIPick AI engine with 4 archetypes and 15% mistake rate
  - gradeDraftTeam, generateGradeWriteup, findSleeperPicks grading algorithm
  - useDraftStore Zustand state machine with full draft lifecycle and localStorage persistence
affects: [04-02-draft-board, 04-03-post-draft]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Pure TypeScript draft engine with zero React dependencies
    - AI archetype scoring pattern (weight functions over politician attributes)
    - Template-based ESPN-style grade commentary with deterministic variant selection
    - Zustand state machine with partial persist (runtime-only state excluded)

key-files:
  created:
    - src/types/draft.ts
    - src/lib/draft/snake-order.ts
    - src/lib/draft/ai-engine.ts
    - src/lib/draft/grading.ts
    - src/store/draft-store.ts
  modified: []

key-decisions:
  - "DRAFT_CONFIG defined as TypeScript const (not JSON) for type safety — consistent with scoring-config pattern from Phase 1"
  - "Grading composite: 50% salary efficiency + 25% roster balance + 25% ceiling — balances value, depth, and upside"
  - "AI mistake rate implemented as tiered random check: <0.10 picks #2, <0.15 picks #3, else picks #1 — produces realistic but exploitable behavior"
  - "party-loyalist archetype uses first 2 picks to establish party preference before applying 30% loyalty bonus — dynamic not static"
  - "Draft store partialize excludes isAITurnPending and userPickTimer — runtime-only values that must reset on page load"
  - "findSleeperPicks uses top-25th-percentile weekly max as hot streak threshold — data-driven relative benchmark"

patterns-established:
  - "Draft store pattern: create + persist + createJSONStorage matches game-store.ts exactly"
  - "Exhaustive switch case for AIArchetype using never type — compile-time safety for archetype additions"
  - "Grade bracket selection: score % 3 for deterministic template variant — same team always gets same variant"

requirements-completed: [DRAFT-01, DRAFT-02, DRAFT-03, DRAFT-04]

# Metrics
duration: 3min
completed: 2026-03-23
---

# Phase 4 Plan 01: Draft Room Logic Layer Summary

**Snake draft engine with 4 AI archetypes, composite grading algorithm, and Zustand state machine — complete TypeScript logic layer for the draft room with zero React dependencies**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-23T22:27:01Z
- **Completed:** 2026-03-23T22:30:51Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments

- Draft type system with DraftPhase, DraftTeam, DraftPick, DraftGrade, SleeperPick and DRAFT_CONFIG constants
- Snake draft order algorithm that correctly alternates direction each round for any team/round count
- AI pick engine with 4 distinct archetypes (value-hunter, corruption-chaser, party-loyalist, balanced) and realistic 15% mistake rate
- Composite grading algorithm producing A+ through F grades with ESPN-style template commentary
- Zustand store managing full draft lifecycle (lobby -> countdown -> drafting <-> user-turn -> complete) with localStorage persistence

## Task Commits

Each task was committed atomically:

1. **Task 1: Draft types and pure utility functions** - `3a5cb4a` (feat)
2. **Task 2: Zustand draft store state machine** - `0dfccb2` (feat)

## Files Created/Modified

- `src/types/draft.ts` - DraftPhase, AIArchetype, DRAFT_CONFIG, DraftTeam, DraftPick, DraftGrade, SleeperPick interfaces
- `src/lib/draft/snake-order.ts` - snakeDraftTeamIndex and generateDraftOrder pure functions
- `src/lib/draft/ai-engine.ts` - scoreForArchetype with 4 archetypes, selectAIPick with mistake logic
- `src/lib/draft/grading.ts` - gradeDraftTeam composite formula, generateGradeWriteup ESPN templates, findSleeperPicks
- `src/store/draft-store.ts` - Zustand draft state machine with persist middleware

## Decisions Made

- DRAFT_CONFIG defined as TypeScript const for type safety, consistent with scoring-config Phase 1 pattern
- Grading formula: 50% salary efficiency, 25% roster balance (unique tiers), 25% ceiling — balanced across value, depth, upside
- AI mistake logic: tiered random (< 0.10 picks #2, < 0.15 picks #3, else #1) — realistic without being purely random
- party-loyalist archetype dynamically determines party preference after 2 picks rather than assigning at creation
- findSleeperPicks uses data-driven top-25th-percentile weekly max threshold for hot streak detection

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None. TypeScript compiled cleanly on first attempt. Full `npx tsc --noEmit` with zero errors.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All draft logic complete as pure TypeScript — Plan 02 (draft board UI) can consume these contracts directly
- useDraftStore ready for UI integration: initDraft, startCountdown, startDrafting, recordPick all implemented
- AI engine ready for background task integration in the UI layer (setTimeout + selectAIPick)
- Grade computation ready for Plan 03 (post-draft results) consumption

---
*Phase: 04-draft-room*
*Completed: 2026-03-23*
