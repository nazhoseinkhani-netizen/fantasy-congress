# Phase 4: Draft Room - Research

**Researched:** 2026-03-23
**Domain:** Simulated snake draft UI, AI opponent logic, real-time draft board state machine
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Draft Pacing & Timing**
- D-01: Live draft tension — AI picks take 2-5 seconds with a thinking animation
- D-02: Dramatic pre-draft countdown — 10-second countdown timer with visual animation before draft starts
- D-03: 60-second user pick timer — relaxed casual league pace
- D-04: No skip/fast-forward — users watch every AI pick; each pick animates in

**AI Opponent Behavior**
- D-05: Distinct AI drafting personalities — each AI team has a visible archetype (value hunter, corruption chaser, party loyalist, balanced)
- D-06: Competent with mistakes — AI makes generally smart picks but occasionally reaches or overlooks value

**Draft Board Layout**
- D-07: ESPN-style 3-panel layout — Left: available politician pool (sortable/filterable). Center: "On The Clock" + pick controls + search/filter. Right: user's building roster + salary cap progress bar. Pick ticker scrolls across bottom
- D-08: Pre-draft lobby shows draft order reveal (user's position highlighted with star), 10-second countdown timer, and full scoutable politician board below
- D-09: Snake draft format — 8 teams, 12 rounds (8 active + 4 bench). Draft order reverses each round per standard snake format

**Post-Draft Results**
- D-10: ESPN analyst commentary tone for draft grades — letter grade (A+ to F) with 2-3 sentence irreverent write-up
- D-11: Sleeper picks = politicians drafted from bottom 2 salary tiers (bench/sleeper) who have high trade volume or recent hot streak
- D-12: Composite grading algorithm — salary efficiency (points per dollar), roster balance (not all one party/tier), projected ceiling
- D-13: Full pick-by-pick draft board recap — grid showing every round and every team's pick. Click any pick for full politician details

### Claude's Discretion
- AI archetype names and specific strategy weights per archetype
- Exact AI pick delay timing distribution within 2-5 second range
- AI "mistake" frequency and logic
- Mobile layout adaptation (stacking panels, bottom sheet)
- Politician card variant for draft board (likely compact/mini)
- Salary cap enforcement UX (warning toast? block pick? highlight over-cap?)
- Pick ticker design and scrolling behavior
- Draft order randomization or fixed position for user
- Countdown timer animation style
- Grade write-up generation approach (template-based vs. dynamic)
- How drafted roster transitions/saves back to game store
- Sort/filter options on the draft board

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| DRAFT-01 | Pre-draft view with draft order (snake format), countdown timer, and sortable/filterable politician board | State machine pre-draft phase; reuse FilterSidebar + PoliticianCard; countdown via setTimeout/setInterval |
| DRAFT-02 | During-draft full-screen board with available politicians, current roster + salary cap, "On The Clock" banner, and pick ticker | 3-panel layout; extend game-store with draft state; salary cap = $50,000; pick ticker via auto-scrolling div |
| DRAFT-03 | AI-controlled opponent picks with realistic selection logic | Pure TS scoring function per archetype; setTimeout for 2-5s delay; deterministic pick selection |
| DRAFT-04 | Post-draft results showing every pick, draft grades (A+ to F), sleeper picks, and team summary | Grade algorithm from Politician fields; template write-ups; pick board as 8x12 grid |
</phase_requirements>

---

## Summary

Phase 4 builds a fully client-side simulated snake draft. The critical design insight is that this is a **state machine with 4 phases** — pre-draft lobby, active drafting (cycling through team turns), user-turn (awaiting user pick), and post-draft results. All state lives in a Zustand store extension; no backend or WebSockets are needed.

The existing data reality must shape the draft design: there are **18 politicians** in `politicians.json` and the existing leagues have **4 teams with 3 active + 1 bench** slots. The CONTEXT.md D-09 specifies "8 teams, 12 rounds" as the aspirational draft format — **this requires a draft-specific league configuration** distinct from the pre-populated demo leagues. The draft room creates its own isolated game state and saves the result into `rosterOverrides` when complete.

The `motion/react` library (already installed and in use at `src/components/team/roster-card.tsx`) provides `AnimatePresence` and `motion` components. No new animation libraries are needed. The existing `FilterSidebar`, `PoliticianCard` (mini/compact variants), and salary cap progress bar from `TeamStatsPanel` are the primary reusable UI building blocks.

**Primary recommendation:** Model the draft as a Zustand state machine with explicit phase transitions. Drive AI picks via `setTimeout` chains. Keep all draft logic in pure TypeScript functions for testability. Reuse existing UI components aggressively — the draft board is composition, not invention.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| zustand | 5.0.12 | Draft state machine (phase, picks, current turn, timer) | Already in use; persist middleware for localStorage |
| motion/react | 12.38.0 | Pick animations, countdown, ticker, panel transitions | Already installed; established pattern in roster-card.tsx |
| React | 19.2.4 | Component framework | Project standard |
| Next.js | 16.2.1 | App Router route at `/draft` | Project standard; static export |
| Tailwind CSS 4.x | 4.x | Styling | Project standard |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| shadcn/ui Card, Badge, Skeleton | 4.1.0 | Draft board panels, tier badges, loading states | Already installed, consistent with project UI |
| lucide-react | 1.0.1 | Timer icon, star icon (user position), check marks | Already used project-wide |
| date-fns | 4.1.0 | Timer formatting (seconds display) | Already installed; overkill but available |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Zustand state machine | useReducer + Context | Zustand already used; avoids prop drilling; persist middleware "just works" |
| setTimeout chains for AI delay | requestAnimationFrame | setTimeout is simpler and predictable for 2-5s delays; no frame-level precision needed |
| Template string grade write-ups | LLM/dynamic generation | No backend — templates with data interpolation are the only option in static export |
| CSS scroll for pick ticker | marquee tag | CSS animation via Tailwind + motion is idiomatic; marquee is deprecated |

**Installation:** All libraries already installed. No new dependencies needed.

---

## Architecture Patterns

### Recommended Project Structure
```
src/
├── app/
│   └── draft/
│       └── page.tsx              # Route entry; delegates to DraftPage client component
├── components/
│   └── draft/
│       ├── draft-page.tsx        # Top-level state consumer; renders phase-appropriate view
│       ├── pre-draft-lobby.tsx   # Draft order reveal + countdown + scouting board
│       ├── draft-board.tsx       # 3-panel layout (pool | clock | roster)
│       ├── pick-ticker.tsx       # Scrolling bottom bar of all picks
│       ├── politician-pool.tsx   # Left panel: available politicians with filter/sort
│       ├── on-the-clock.tsx      # Center panel: current drafter + timer + pick action
│       ├── draft-roster.tsx      # Right panel: user's building roster + cap tracker
│       └── post-draft.tsx        # Results: pick grid + grades + sleepers
└── store/
    └── draft-store.ts            # Zustand store: draft state machine
```

### Pattern 1: Draft State Machine (Zustand)
**What:** A single Zustand store models the entire draft lifecycle as an enum of phases
**When to use:** Any time UI needs to transition through discrete states with shared data

```typescript
// src/store/draft-store.ts
// Source: Zustand 5.x docs + project established pattern (game-store.ts)
type DraftPhase = 'lobby' | 'countdown' | 'drafting' | 'user-turn' | 'complete'

interface DraftState {
  phase: DraftPhase
  teams: DraftTeam[]           // 8 teams with archetypes
  picks: DraftPick[]           // All picks in order
  availablePool: string[]      // bioguideIds not yet drafted
  currentPickIndex: number     // Which pick number (0-95 for 8 teams x 12 rounds)
  userTeamIndex: number        // Which of the 8 teams is the user
  userPickTimer: number        // Countdown seconds remaining (60 -> 0)
  salaryRemaining: number      // User's salary cap remaining
}

interface DraftTeam {
  name: string
  archetype: 'value-hunter' | 'corruption-chaser' | 'party-loyalist' | 'balanced' | 'reach-specialist' | 'tier-stacker'
  roster: string[]             // bioguideIds, up to 12
  salaryUsed: number
}

interface DraftPick {
  pickNumber: number
  round: number
  teamIndex: number
  bioguideId: string
  timestamp: number
}
```

### Pattern 2: Snake Draft Order Calculation
**What:** Pure TypeScript function computing which team picks at position N
**When to use:** Anywhere the current team index or pick order needs to be determined

```typescript
// Pure function — no React dependencies, fully testable
function snakeDraftTeamIndex(pickNumber: number, teamCount: number): number {
  const round = Math.floor(pickNumber / teamCount)
  const posInRound = pickNumber % teamCount
  return round % 2 === 0 ? posInRound : teamCount - 1 - posInRound
}

// Example: 8 teams
// Pick 0: team 0, pick 7: team 7
// Pick 8: team 7, pick 15: team 0
// Pick 16: team 0, pick 23: team 7 (snake continues)
```

### Pattern 3: AI Pick Selection
**What:** Pure TypeScript function that scores each available politician for a given archetype and returns the best pick
**When to use:** Each AI turn triggers this synchronously; setTimeout provides the visual delay

```typescript
// src/lib/draft/ai-engine.ts
function selectAIPick(
  archetype: DraftTeam['archetype'],
  available: Politician[],
  teamRoster: string[],
  salaryRemaining: number,
  politicians: Map<string, Politician>
): string {
  const affordable = available.filter(
    p => politicians.get(p)!.salaryCap <= salaryRemaining
  )
  // Score each politician by archetype weights
  const scored = affordable.map(id => ({
    id,
    score: scoreForArchetype(archetype, politicians.get(id)!)
  }))
  scored.sort((a, b) => b.score - a.score)

  // Occasional "mistake": 15% chance to pick #2 or #3 instead of best
  const mistakeRoll = Math.random()
  if (mistakeRoll < 0.10 && scored.length > 1) return scored[1].id
  if (mistakeRoll < 0.15 && scored.length > 2) return scored[2].id
  return scored[0].id
}
```

### Pattern 4: AI Turn Orchestration (setTimeout Chain)
**What:** Each AI pick triggers a timeout; when it resolves, it makes the pick and triggers the next turn
**When to use:** The active `drafting` phase when it's an AI team's turn

```typescript
// Inside draft-store.ts action or a useEffect in draft-board.tsx
function triggerAITurn(state: DraftState, politicians: Politician[]) {
  const delay = 2000 + Math.random() * 3000  // 2-5 seconds
  setTimeout(() => {
    const team = state.teams[currentTeamIndex]
    const pick = selectAIPick(team.archetype, state.availablePool, ...)
    useDraftStore.getState().recordPick(pick)
    // recordPick advances currentPickIndex and transitions to next turn
  }, delay)
}
```

### Pattern 5: Draft Grade Algorithm
**What:** Pure TS function computing a letter grade from Politician fields
**When to use:** Post-draft results screen; computed once on draft completion

```typescript
// src/lib/draft/grading.ts
function gradeDraftTeam(roster: Politician[], totalCap: number): DraftGrade {
  const salaryUsed = roster.reduce((s, p) => s + p.salaryCap, 0)
  const totalPoints = roster.reduce((s, p) => s + p.seasonPoints, 0)

  // Factor 1: Salary efficiency (points per $1000 spent)
  const efficiency = totalPoints / (salaryUsed / 1000)

  // Factor 2: Roster balance (tier diversity — not all one tier)
  const tiers = new Set(roster.map(p => p.salaryTier))
  const balanceScore = tiers.size / 5  // 5 tiers = max balance

  // Factor 3: Ceiling (top scorer's seasonPoints)
  const ceiling = Math.max(...roster.map(p => p.seasonPoints))

  const composite = (efficiency * 0.5) + (balanceScore * 100 * 0.25) + (ceiling * 0.25)
  return letterGrade(composite)  // A+/A/A-/B+/B/B-/C/D/F
}
```

### Pattern 6: Salary Cap Enforcement
**What:** Disable/gray out politicians in the pool who would exceed remaining cap
**When to use:** During user-turn only; AI logic handles its own cap check

```typescript
// In politician-pool.tsx during user-turn
const canAfford = (politician: Politician) =>
  politician.salaryCap <= draftState.salaryRemaining

// Render: style={!canAfford(p) ? { opacity: 0.4, pointerEvents: 'none' } : {}}
// Toast on attempted over-cap pick (belt-and-suspenders)
```

### Recommended Project Structure (Route)
```
src/app/draft/page.tsx   — minimal server component, delegates to 'use client' DraftPage
```

### Anti-Patterns to Avoid
- **Don't use useEffect for AI turn logic:** Side effects inside useEffect with state dependencies create race conditions. Trigger AI turns from within the Zustand `recordPick` action instead.
- **Don't put draft state in URL params:** Draft is a session-only flow. URL would overflow. localStorage via Zustand persist is correct.
- **Don't reuse league data rosters for the draft pool:** The existing 18 politicians are the draft pool. Draft creates a NEW roster, saved to `rosterOverrides[userTeamId]` when done.
- **Don't make politician pool a derived value recalculated on every render:** Compute `availablePool` inside Zustand and update it imperatively when picks are recorded.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Smooth pick animations | CSS transitions or keyframe DIY | `motion/react` AnimatePresence + motion.div (already used in roster-card.tsx) | Height-auto animations, exit animations, and sequence control are solved |
| Countdown timer | setInterval cleanup management | Simple `useEffect` + `setInterval` with cleanup; or decrement in Zustand action on interval tick | Well-understood pattern; no library needed |
| Salary cap progress bar | New component | Reuse TeamStatsPanel's salary bar logic (already shows green/amber/red states) | Already built and styled |
| Available politician filter/sort | New filter component | Reuse `FilterSidebar` component with simplified subset of filters | Built, tested, matches project styling |
| Politician cards in draft pool | New card variant | `PoliticianCard` compact or mini variant with `onClick` for selection | Already has 3 variants; just needs selection state styling |
| Pick ticker scrolling | JS-driven scroll logic | CSS `overflow-x: auto` + auto-scroll to latest via `scrollIntoView` on new pick | Simple, no library needed |

**Key insight:** The draft board is primarily composition of existing components in a new layout, with new state management. The only truly new logic is the AI engine and grade calculator — both should be pure TypeScript functions in `src/lib/draft/`.

---

## Common Pitfalls

### Pitfall 1: Data Reality vs. Context.md Aspirations
**What goes wrong:** D-09 specifies "8 teams, 12 rounds (8 active + 4 bench)" but the actual data has 18 politicians, 4 teams per league, and 3 active + 1 bench slots. An 8-team, 12-round draft needs 96 picks from 18 politicians — impossible without repetition.
**Why it happens:** CONTEXT.md describes the draft room design intent, not the current data constraints.
**How to avoid:** The draft room must use a **draft-specific team count and round count** that fits the 18-politician pool. Options:
  - 4 teams (matches existing leagues) x 4 rounds = 16 picks from 18 pool (feasible)
  - 6 teams x 3 rounds = 18 picks (exactly exhausts pool)
  - Keep 8 teams as specified but limit rounds to 2 (16 picks) — rosters would be very shallow
  - **Recommended:** Use 4 teams x 4 rounds (matches existing league structure) OR expand politician dataset before/during Phase 4
**Warning signs:** Draft simulation hits "no available politicians" before all rounds complete.

### Pitfall 2: Static Export + setTimeout/setInterval
**What goes wrong:** Timers persist across route navigations in Next.js App Router. If the user navigates away mid-draft, orphaned setTimeouts fire and update stale store state.
**Why it happens:** React doesn't automatically cancel side effects on unmount when using raw setTimeout.
**How to avoid:** Store timeout IDs in a ref (`useRef<NodeJS.Timeout>`) and clear on unmount via `useEffect` cleanup. Or manage the "is draft active" flag in Zustand and check it before state updates inside timeout callbacks.
**Warning signs:** Console errors about updating unmounted components; draft state corrupted on return.

### Pitfall 3: Zustand Persist on Draft State
**What goes wrong:** Persisting in-progress draft state to localStorage means a page refresh mid-draft resumes the draft, which is desirable — but a stale draft state from a previous session could block the user from starting a new draft.
**Why it happens:** Zustand persist middleware serializes all state including phase and picks.
**How to avoid:** Either: (a) store draft state separately from game-store with a "version" or "session ID" so old drafts are discarded, or (b) expose a `resetDraft()` action that clears to 'lobby' phase. The draft route's entry page should offer "Start New Draft" even if a draft is in progress.
**Warning signs:** User can't start a new draft; stuck in `drafting` phase with no active timer.

### Pitfall 4: 3-Panel Layout on Mobile
**What goes wrong:** The ESPN-style 3-panel layout (left pool, center clock, right roster) is unworkable on a 375px mobile viewport — all three panels would be 125px wide.
**Why it happens:** D-07 describes desktop layout; mobile adaptation is Claude's discretion.
**How to avoid:** Mobile should collapse to a tab-based or bottom-sheet approach: single active view (pool or roster) with a bottom tab bar, and the "On The Clock" banner pinned at top. Use `lg:grid-cols-3` with a mobile-first stacked fallback.
**Warning signs:** Draft board unusable on iPhone Safari — text truncation, impossible touch targets.

### Pitfall 5: AI Turn Race Conditions
**What goes wrong:** Multiple `setTimeout` callbacks are queued for the same turn if state updates trigger re-renders that re-schedule AI turns.
**Why it happens:** Triggering AI turn logic in `useEffect` with draft state as a dependency means every re-render during an AI turn reschedules.
**How to avoid:** Use a `isAITurnPending` boolean in draft state, set to `true` when setTimeout is scheduled, and only schedule the next AI turn when it's `false`. Clear it immediately before the pick is recorded.
**Warning signs:** Politicians drafted multiple times; `currentPickIndex` advancing faster than expected.

### Pitfall 6: Draft Grade Template Quality
**What goes wrong:** Grade write-ups feel repetitive after one draft because templates lack variation.
**Why it happens:** Template-based generation with limited branching produces identical strings.
**How to avoid:** Build write-up templates with multiple variations per grade tier (3-4 variants per letter grade bracket), interpolating team-specific data (top pick name, primary party, salary used). Even 4 variants per grade = 32+ possible write-ups for 8 grades.
**Warning signs:** Same "Bold strategy" line appearing on multiple teams.

---

## Code Examples

### Motion Import (established project pattern)
```typescript
// Source: src/components/team/roster-card.tsx (verified in codebase)
import { AnimatePresence, motion } from 'motion/react'

// Height-auto animate pattern (confirmed working):
<AnimatePresence>
  {isVisible && (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="overflow-hidden"
    >
      {children}
    </motion.div>
  )}
</AnimatePresence>
```

### Salary Cap Progress Bar (existing pattern)
```typescript
// Source: src/components/team/team-stats-panel.tsx (verified in codebase)
const pct = roster.salaryUsed / roster.salaryCap  // roster.salaryCap = 50000
const barColor = pct >= 1 ? 'bg-red-500' : pct >= 0.8 ? 'bg-amber-500' : 'bg-emerald-500'

<div className="w-full bg-muted rounded-full h-2.5">
  <div
    className={cn('h-2.5 rounded-full transition-all', barColor)}
    style={{ width: `${Math.min(pct * 100, 100)}%` }}
  />
</div>
```

### Zustand Store Extension Pattern
```typescript
// Source: src/store/game-store.ts (verified in codebase)
// New file: src/store/draft-store.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useDraftStore = create<DraftState & DraftActions>()(
  persist(
    (set, get) => ({
      phase: 'lobby' as DraftPhase,
      // ... initial state
      recordPick: (bioguideId: string) => set((state) => {
        const newPick: DraftPick = {
          pickNumber: state.currentPickIndex,
          round: Math.floor(state.currentPickIndex / TEAM_COUNT),
          teamIndex: snakeDraftTeamIndex(state.currentPickIndex, TEAM_COUNT),
          bioguideId,
          timestamp: Date.now(),
        }
        return {
          picks: [...state.picks, newPick],
          availablePool: state.availablePool.filter(id => id !== bioguideId),
          currentPickIndex: state.currentPickIndex + 1,
          // Transition to complete if all picks done:
          phase: state.currentPickIndex + 1 >= TOTAL_PICKS ? 'complete' : 'drafting',
        }
      }),
    }),
    {
      name: 'fantasy-congress-draft',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
```

### Data Client Loading Pattern (established)
```typescript
// Source: src/lib/data/politicians.ts (verified in codebase)
// All data loaded client-side via fetch — no server components in interactive pages
const [politicians, setDraftState] = useState<Politician[]>([])
useEffect(() => {
  loadPoliticians().then(setPoliticians)
}, [])
```

### App Router Page Pattern (established)
```typescript
// Source: src/app/dashboard/page.tsx (verified in codebase)
// Draft route follows same minimal pattern:
// src/app/draft/page.tsx
import { DraftPage } from '@/components/draft/draft-page'
export default function Draft() {
  return <DraftPage />
}
// DraftPage component has 'use client' directive
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Framer Motion import | `motion/react` (Motion library) | Motion v11+ | Import path changed from `framer-motion` to `motion/react` — already correctly used in roster-card.tsx |
| Pages Router `/pages/draft.tsx` | App Router `/app/draft/page.tsx` | Next.js 13+ | Server components by default; interactive pages need `'use client'` |
| next/image | `<img>` tag | Phase 1 decision | Static export constraint — confirmed in AGENTS.md and game-store.ts comments |

**Deprecated/outdated:**
- `framer-motion` package: Project uses `motion` package with `motion/react` import. Do not import from `framer-motion`.
- `next/image`: Disabled for static export. Use `<img>` with `loading="lazy"`.
- Draft animations (ANIM-01): Card-flies-to-roster burst effect is Phase 5 scope. Phase 4 uses simpler pick transitions (AnimatePresence fade/slide).

---

## Critical Data Constraint: Pool Size vs. Draft Format

This is the most important finding for planning.

**Current state:**
- `politicians.json`: 18 politicians
- Existing leagues: 4 teams, 3 active + 1 bench = 4 picks per team = 16 total picks
- D-09 aspirational format: 8 teams x 12 rounds = 96 picks

**The math:**
- 8 teams x 12 rounds = 96 picks required
- 18 politicians available
- A politician can appear on multiple leagues (confirmed in STATE.md: "Same politician allowed across leagues")
- But within a single draft, a politician drafted goes off the board

**Resolution options for planning:**
1. **Match existing data structure (4 teams x 4 rounds = 16 picks):** Draft room simulates a 4-team draft matching the existing league format. User's drafted team replaces their pre-populated roster via `rosterOverrides`. This is safe with 18 politicians.
2. **Smaller team count, more rounds (3 teams x 6 rounds = 18 picks):** Exactly exhausts the pool. Interesting but unusual fantasy format.
3. **Pool duplication for 8-team draft:** Allow politicians to appear on multiple teams within the same draft (mirrors STATE.md decision). This makes the draft pool functionally unlimited but reduces strategic scarcity.

**Recommended for planning:** Use 4 teams x 4 rounds to match existing data structures (salaryCap: 50000, 3 active + 1 bench = 4 slots). This is lowest-risk and requires zero data changes. The planner should confirm this or expand the politician dataset as Wave 0.

---

## Open Questions

1. **Draft team count and round count**
   - What we know: 18 politicians in pool; 4 teams per league; D-09 says "8 teams, 12 rounds"
   - What's unclear: Does Phase 4 need to match existing 4-team league structure, or create a standalone 8-team draft that saves differently?
   - Recommendation: Planner should choose 4 teams x 4 rounds (matches data) OR flag as a Wave 0 data expansion task to add more politicians before implementing the draft

2. **Draft result persistence**
   - What we know: CONTEXT.md says "save back into game store's rosterOverrides"; game-store.ts uses `rosterOverrides: Record<string, { active: string[], bench: string[] }>`
   - What's unclear: Does the draft also update team salary data in the league data, or just roster slots?
   - Recommendation: Save only to `rosterOverrides[userTeamId]` (matching existing pattern); salary tracking is draft-store-local only

3. **AI team names**
   - What we know: 3 existing leagues have named teams (Filibusters, Capitol Gains, etc.)
   - What's unclear: Should AI teams in the draft be the existing league's teams, or new draft-specific teams?
   - Recommendation: Use existing league's teams as AI opponents in the draft — creates continuity with the game world

---

## Sources

### Primary (HIGH confidence)
- Codebase inspection (verified): `src/store/game-store.ts` — Zustand 5.x persist pattern
- Codebase inspection (verified): `src/components/team/roster-card.tsx` — `motion/react` AnimatePresence import and pattern
- Codebase inspection (verified): `src/components/politicians/filter-sidebar.tsx` — FilterState interface, FilterSidebar component
- Codebase inspection (verified): `src/components/design/politician-card.tsx` — PoliticianCard variants (full/compact/mini)
- Codebase inspection (verified): `src/components/team/team-stats-panel.tsx` — Salary cap progress bar (pct/barColor pattern)
- Codebase inspection (verified): `public/data/politicians.json` — 18 politicians, salary cap range $788-$9,981
- Codebase inspection (verified): `public/data/leagues.json` — 4 teams per league, salaryCap: 50000, 3 active + 1 bench
- Codebase inspection (verified): `src/types/politician.ts` — Politician interface with salaryCap, salaryTier, seasonPoints
- Codebase inspection (verified): `src/types/demo.ts` — Roster interface; rosterOverrides pattern
- Codebase inspection (verified): `next.config.ts` — `output: 'export'`, `images.unoptimized: true`
- Codebase inspection (verified): `package.json` — motion@12.38.0, zustand@5.0.12, next@16.2.1

### Secondary (MEDIUM confidence)
- `node_modules/next/dist/docs/01-app/` — App Router structure confirmed; `'use client'` directive requirement
- STATE.md decision log — "Same politician allowed across leagues" — cross-league pool logic
- REQUIREMENTS.md DRAFT-01 through DRAFT-04 — exact requirement text

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all libraries verified in package.json and codebase usage
- Architecture: HIGH — patterns directly derived from existing code; state machine is well-understood
- Pitfalls: HIGH for data constraint (verified count); MEDIUM for AI race conditions (common pattern, not yet encountered in this codebase)
- Data constraint: HIGH — verified by direct data inspection

**Research date:** 2026-03-23
**Valid until:** 2026-04-22 (stable stack; data may change if politician dataset is expanded)
