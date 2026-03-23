# Phase 4: Draft Room - Context

**Gathered:** 2026-03-23
**Status:** Ready for planning

<domain>
## Phase Boundary

Full simulated snake draft experience against AI-controlled opponents — pre-draft lobby with scouting board, live drafting with salary cap enforcement and "On The Clock" timer, and post-draft results with grades and full pick recap. The draft creates a new roster for the user's team. No animations beyond basic pick transitions (Phase 5 handles ANIM-01 draft pick animation). No sharing/viral features (Phase 5). No real multiplayer — all opponents are AI-controlled.

</domain>

<decisions>
## Implementation Decisions

### Draft Pacing & Timing
- **D-01:** Live draft tension — AI picks take 2-5 seconds with a thinking animation. Feels like a real ESPN/DraftKings draft room with suspense between picks. Not a quick simulation.
- **D-02:** Dramatic pre-draft countdown — 10-second countdown timer with visual animation before the draft starts. Builds anticipation.
- **D-03:** 60-second user pick timer — enough time for first-time users to browse the board. Relaxed casual league pace.
- **D-04:** No skip/fast-forward — users watch every AI pick. Part of the immersion is seeing who AI teams draft. Each pick animates in.

### AI Opponent Behavior
- **D-05:** Distinct AI drafting personalities — each AI team has a visible archetype (e.g., value hunter, corruption chaser, party loyalist, balanced). Adds character and makes the draft feel like playing against real people, not uniform robots.
- **D-06:** Competent with mistakes — AI makes generally smart picks but occasionally reaches for a player or overlooks value. Feels realistic like playing with friends. Not optimal min-max.

### Draft Board Layout
- **D-07:** ESPN-style 3-panel layout during active drafting — Left: available politician pool (sortable/filterable grid using existing filter patterns from Phase 2). Center: "On The Clock" banner + pick controls + search/filter. Right: user's building roster + salary cap progress bar. Pick ticker scrolls across bottom showing all picks.
- **D-08:** Pre-draft lobby shows draft order reveal (user's position highlighted with star), 10-second countdown timer, and the full scoutable politician board below for pre-draft strategy planning. Users can sort/filter the board before the draft starts.
- **D-09:** Snake draft format — 8 teams, 12 rounds (8 active + 4 bench). Draft order reverses each round per standard snake format.

### Post-Draft Results
- **D-10:** ESPN analyst commentary tone for draft grades — each team gets a letter grade (A+ to F) with a 2-3 sentence irreverent but informed write-up. "The Swamp Lords went all-in on corruption, loading up on peak-swamp politicians. Bold strategy."
- **D-11:** Sleeper picks = politicians drafted from bottom 2 salary tiers (bench/sleeper) who have high trade volume or recent hot streak. Highlights value finds across all teams.
- **D-12:** Composite grading algorithm — grade factors in salary efficiency (points per dollar), roster balance (not all one party/tier), and projected ceiling. A+ = great value with high upside. F = overpaid with weak roster.
- **D-13:** Full pick-by-pick draft board recap — grid showing every round and every team's pick. Each cell is a mini politician card/chip. Click any pick to see full politician details. Classic fantasy draft recap format.

### Claude's Discretion
- AI archetype names and specific strategy weights per archetype
- Exact AI pick delay timing distribution within 2-5 second range
- AI "mistake" frequency and logic (how often, what kind of reaches)
- Mobile layout adaptation (stacking panels, bottom sheet, etc.)
- Politician card variant for the draft board (likely compact/mini)
- Salary cap enforcement UX (warning toast? block pick? highlight over-cap?)
- Pick ticker design and scrolling behavior
- Draft order randomization or fixed position for user
- Countdown timer animation style
- Grade write-up generation approach (template-based vs. dynamic)
- How the drafted roster transitions/saves back to the game store
- Sort/filter options on the draft board (reuse from politician directory or simplified subset)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Context
- `.planning/PROJECT.md` — Core value, constraints (static export, localStorage, salary cap format), design direction (DraftKings premium)
- `.planning/REQUIREMENTS.md` — Phase 4 requirements: DRAFT-01 through DRAFT-04
- `.planning/ROADMAP.md` — Phase 4 success criteria (3 criteria), phase dependencies

### Technology & Patterns
- `CLAUDE.md` — Technology stack: Next.js 16, React 19.2, Tailwind CSS 4.x, shadcn/ui, Zustand 5.x, Motion
- `src/store/game-store.ts` — Existing Zustand game store with persist middleware, roster override pattern
- `src/components/design/politician-card.tsx` — PoliticianCard with full/compact/mini variants (reuse for draft board)

### Data Layer
- `src/types/politician.ts` — Politician interface with salaryCap, salaryTier, seasonPoints, and all scoring fields
- `src/types/demo.ts` — League, Team, Roster (salaryCap/salaryUsed), Matchup, DemoState interfaces
- `src/lib/data/politicians.ts` — loadPoliticians() data loader
- `src/lib/data/demo.ts` — loadLeagues(), loadDemoState() data loaders
- `public/data/politicians.json` — Full politician dataset with salary data
- `public/data/leagues.json` — Pre-populated league data (3 leagues, 8 teams each)

### Prior Phase Context
- `.planning/phases/01-foundation/01-CONTEXT.md` — Salary cap pricing (D-12), design system (D-13 through D-17), demo data structure
- `.planning/phases/03-game-experience/03-CONTEXT.md` — Zustand store pattern (D-10, D-12), click interaction pattern (D-06), roster grid layout (D-08)

### Existing UI Patterns (reusable for draft board)
- `src/components/politicians/filter-sidebar.tsx` — Filter/sort pattern with salary tier, party, chamber filters
- `src/components/politicians/politician-directory.tsx` — Sort field options (salaryCap, seasonPoints, insiderRiskScore, etc.)
- `src/components/team/team-stats-panel.tsx` — Salary cap progress bar visualization
- `src/components/team/roster-card.tsx` — Roster card with salary display

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `PoliticianCard` (full/compact/mini): Mini or compact variant ideal for draft board cards and pick ticker chips
- `FilterSidebar` + sort logic: Existing filter/sort patterns from politician directory can be adapted for draft board's available player pool
- `TeamStatsPanel`: Salary cap progress bar already implemented — reuse for draft board's live salary tracker
- `RosterCard`: Shows politician with salary — reuse pattern for building roster panel
- `RiskBadge`: Corruption indicator on draft board cards
- `useGameStore`: Zustand store with persist — extend for draft state (picks, draft progress)
- `loadPoliticians()` + `loadDemoState()`: Data loaders for politician pool and league context

### Established Patterns
- Client-side data loading via fetch to `/data/*.json`
- `'use client'` directive on interactive components
- `<img>` tags (not next/image) per static export constraint
- `cn()` utility for Tailwind class merging
- Party colors via CSS variables
- Zustand persist with createJSONStorage for localStorage

### Integration Points
- Global nav needs `/draft` route link
- `src/app/` needs new `draft/` route directory
- Game store needs draft state extensions (current pick, draft history, draft phase)
- After draft completes, new roster needs to save back into game store's rosterOverrides
- Politicians pool = all politicians from `politicians.json` minus already-drafted (by other teams in the league)

</code_context>

<specifics>
## Specific Ideas

- **"Live draft tension" as the north star** — This should feel like sitting in an ESPN draft room, not clicking through a wizard. Every pick has weight. The 2-5 second AI delay with thinking animation is key to the vibe.
- **AI personality adds replayability** — Distinct archetypes mean different drafts play out differently. A corruption-chaser AI scooping peak-swamp politicians before you adds drama.
- **ESPN analyst tone for grades** — Irreverent but data-informed. "Bold strategy" energy. The write-ups should be entertaining enough that users screenshot and share them.
- **Pre-draft scouting board** — Users who engage with the scouting board before the timer hits zero will feel more prepared and invested in the draft.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 04-draft-room*
*Context gathered: 2026-03-23*
