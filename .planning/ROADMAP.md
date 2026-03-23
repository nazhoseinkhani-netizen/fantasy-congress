# Roadmap: Fantasy Congress

## Overview

Five phases that move from invisible infrastructure to a compelling standalone demo to a full fantasy sports product. Phases 1 and 2 together deliver the P1 demo sufficient for the Alva leadership pitch. Phases 3 through 5 add fantasy sports depth, the draft ritual, and viral shareability. The scoring engine and data pipeline are locked before any UI displays a score — this is non-negotiable per the research dependency chain.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation** - Data pipeline, scoring engine, Corruption Index, demo data, and design system — everything downstream depends on this (gap closure in progress)
- [ ] **Phase 2: Discovery** - Landing page, politician directory, profiles, trade feed, and leaderboard — the standalone Alva demo
- [ ] **Phase 3: Game Experience** - Dashboard, My Team roster management, and League standings with Zustand game state
- [ ] **Phase 4: Draft Room** - Full snake draft against AI opponents with pick animations and salary cap
- [ ] **Phase 5: Polish and Viral** - Animations, share cards, and platform showcase Easter egg

## Phase Details

### Phase 1: Foundation
**Goal**: The app has a complete data layer, a locked scoring engine, and a design system — any page built after this phase can display real politician data with correct scores
**Depends on**: Nothing (first phase)
**Requirements**: DATA-01, DATA-02, DATA-03, DATA-04, DATA-05, SCORE-01, SCORE-02, SCORE-03, SCORE-04, SCORE-05, SCORE-06, CORR-01, CORR-02, CORR-03, DEMO-01, DEMO-02, DEMO-03, DEMO-04, UI-01, UI-02, UI-03
**Success Criteria** (what must be TRUE):
  1. Running the build scripts produces `public/data/` JSON files with 50-100+ politicians, their trade histories, computed fantasy scores, and Insider Trading Risk Scores — no manual data entry required
  2. Every politician in the dataset has a validated official portrait photo (HTTP 200 confirmed) with a working fallback chain — zero broken image placeholders at build time
  3. Calling `scorePolitician(trades, rules)` in isolation returns a correct, deterministic breakdown including base points, bonuses, penalties, and multipliers — the same result every time for the same input
  4. The app renders in dark mode with the premium dark aesthetic, global nav, and responsive layout on both desktop and mobile
  5. Pre-populated demo data (3 leagues, 6 weeks of results, user pre-assigned to a team) loads immediately without any user setup
**Plans:** 6/7 plans executed

Plans:
- [x] 01-01-PLAN.md — Project bootstrap (Next.js 16, shadcn/ui, dependencies) and all TypeScript type contracts
- [x] 01-02-PLAN.md — Scoring engine (TDD): scoreTrade(), scorePolitician(), and Insider Trading Risk Score computation
- [x] 01-03-PLAN.md — Premium dark design system: theme CSS, global navigation, PoliticianCard/RiskBadge/StatCell components
- [x] 01-04-PLAN.md — Data pipeline: fetch politicians, generate trades, validate photos, compute scores, output JSON
- [x] 01-05-PLAN.md — Demo data: generate 3 leagues with rosters and 6 weeks of matchup results, plus data loader functions
- [x] 01-06-PLAN.md — Gap closure: Activity Bonus (+5/trade) scoring fix and pipeline regeneration (SCORE-03)
- [x] 01-07-PLAN.md — Gap closure: Fix bench roster underfill in demo data generation (DEMO-01)

### Phase 2: Discovery
**Goal**: Users can explore the full politician universe, see who is trading what, understand the Insider Trading Risk Score, and find out who the biggest Congressional traders are — this is the complete P1 standalone demo
**Depends on**: Phase 1
**Requirements**: LAND-01, LAND-02, LAND-03, LAND-04, DIR-01, DIR-02, DIR-03, DIR-04, PROF-01, PROF-02, PROF-03, PROF-04, PROF-05, FEED-01, FEED-02, FEED-03, FEED-04, LEAD-01, LEAD-02, LEAD-03, UI-04, UI-05, UI-06
**Success Criteria** (what must be TRUE):
  1. A visitor to the landing page immediately understands the product concept, sees real politician photos, and has a prominent CTA to explore
  2. A user can find any politician by filtering on party, chamber, state, or committee, and sort by fantasy cost, return, or Insider Trading Risk Score
  3. Clicking a politician opens a profile with four working tabs — Fantasy Stats, Trading Profile, Corruption Dossier, and News — each showing real data from the build-time pipeline
  4. The trade feed shows recent Congressional stock disclosures with bonus badges, return vs S&P 500, and fantasy points — filterable by party, chamber, and trade type
  5. The Hall of Shame leaderboard ranks politicians by fantasy points and by Insider Trading Risk Score with tier colors and methodology visible on score cards
**Plans:** 4/7 plans executed

Plans:
- [x] 02-01-PLAN.md — Install Recharts, shared chart config, skeleton component, and complete landing page
- [x] 02-02-PLAN.md — Politician directory with filters, search, sort, and grid/list toggle
- [x] 02-03-PLAN.md — Politician profiles with generateStaticParams, hero banner, and 4 chart-rich tabs
- [x] 02-04-PLAN.md — Trade feed with Twitter-style cards, filters, My Roster Only, and trending sidebar
- [x] 02-05-PLAN.md — Leaderboard with Hall of Shame podium, corruption rankings, and Swamp Lords
- [x] 02-06-PLAN.md — UI polish: skeleton loading, metric tooltips, and empty states across all pages
- [ ] 02-07-PLAN.md — Visual verification checkpoint for complete P1 demo

### Phase 2.1: Real Data Pipeline (INSERTED)
**Goal**: Replace all simulated trade data with real Congressional stock disclosures from the Alva Skills API (`getSenatorTrades`), fetch real stock prices for return calculations, recompute all scoring from real data, and regenerate demo league matchups from real scores — the app shows actual Congressional corruption, not fake data
**Depends on**: Phase 2
**Requirements**: DATA-01, DATA-02, DATA-03, DATA-04, DATA-05, SCORE-01
**Success Criteria** (what must be TRUE):
  1. `public/data/trades.json` contains only real Congressional stock trade disclosures sourced from the Alva `getSenatorTrades` SDK — zero simulated trades
  2. `public/data/politicians.json` contains real politicians derived from actual trade records, with real trade counts, real return calculations using Alva stock price data, and real Insider Trading Risk Scores computed from actual trading patterns
  3. Fantasy scores are calculated by applying the existing scoring engine to real trade data — same bonuses/penalties, real returns vs S&P 500
  4. Demo league data (rosters, matchups, weekly results) is the only simulated layer — built on top of real politician scores
  5. All Phase 2 pages still render correctly with the new real data (no broken references, missing fields, or empty states)
**Plans**: 2 plans

Plans:
- [x] 02.1-01-PLAN.md — Rewrite fetch-trades.ts with Alva API integration, mapping layer, and stock price lookups
- [x] 02.1-02-PLAN.md — Dynamic season window, pipeline orchestration update, and end-to-end verification

### Phase 3: Game Experience
**Goal**: Users can experience the full fantasy sports product loop — check their weekly matchup, manage their roster, see league standings — all powered by pre-populated demo data that feels like a live season
**Depends on**: Phase 2.1
**Requirements**: DASH-01, DASH-02, DASH-03, DASH-04, DASH-05, TEAM-01, TEAM-02, TEAM-03, TEAM-04, TEAM-05, LEAG-01, LEAG-02, LEAG-03
**Success Criteria** (what must be TRUE):
  1. The dashboard loads immediately with the user's pre-assigned team, shows this week's matchup score vs opponent, season KPIs, and a compact trade feed sidebar
  2. On My Team, a user can click to swap active politicians with bench slots and bench politicians to active slots, see each politician's scoring breakdown, and view their team's salary cap usage
  3. The league page shows the full standings table, complete season schedule, and a league activity feed with trades and matchup results
**Plans**: 4 plans

Plans:
- [x] 03-01-PLAN.md — Zustand game store with persist middleware, route scaffolds, and navigation updates
- [ ] 03-02-PLAN.md — Dashboard page: KPIs, matchup scoreboard, trade feed sidebar, standings compact
- [ ] 03-03-PLAN.md — League page: standings table, schedule grid, activity feed
- [ ] 03-04-PLAN.md — My Team page: click-to-swap roster grid, inline expand with charts, team stats panel

### Phase 4: Draft Room
**Goal**: Users can run a full simulated snake draft against AI-controlled opponents, make picks with the salary cap live, and receive draft grades when the draft completes
**Depends on**: Phase 3
**Requirements**: DRAFT-01, DRAFT-02, DRAFT-03, DRAFT-04
**Success Criteria** (what must be TRUE):
  1. The pre-draft view shows draft order, a countdown, and a sortable politician board with salary cap values — a user can understand the format before the draft starts
  2. During the draft, AI opponents make realistic picks on their turns, the "On The Clock" banner shows whose turn it is, and the user can pick from the available politician pool without exceeding their salary cap
  3. The post-draft summary shows every pick by every team, assigns draft grades, and surfaces sleeper picks
**Plans**: TBD

### Phase 5: Polish and Viral
**Goal**: Every major view has micro-interactions and animations, users can generate and share image cards for their team and favorite politicians, and the Alva platform showcase is visible throughout
**Depends on**: Phase 4
**Requirements**: ANIM-01, ANIM-02, ANIM-03, ANIM-04, ANIM-05, SHARE-01, SHARE-02, SHARE-03, SHARE-04, PLAT-01, PLAT-02, PLAT-03
**Success Criteria** (what must be TRUE):
  1. Draft picks, trade alerts, points counters, and the Insider Trading Risk Score gauge all animate — the app feels alive rather than static
  2. A user can tap Share on any politician card or their team and receive a downloadable image card with "Powered by Alva" branding, verified working on both desktop and iOS Safari
  3. The Developer Mode Easter egg (keyboard shortcut) reveals which Alva Skill powers each data element with dashed borders and tooltips — every data-driven element is attributed
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 6/7 | In Progress|  |
| 2. Discovery | 4/7 | In Progress|  |
| 2.1 Real Data Pipeline | 1/2 | In Progress|  |
| 3. Game Experience | 1/4 | In Progress|  |
| 4. Draft Room | 0/TBD | Not started | - |
| 5. Polish and Viral | 0/TBD | Not started | - |
