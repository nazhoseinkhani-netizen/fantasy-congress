# Phase 2: Discovery - Context

**Gathered:** 2026-03-23
**Status:** Ready for planning

<domain>
## Phase Boundary

Landing page, politician directory, politician profiles, trade feed, and leaderboard — the complete P1 standalone Alva demo. Users can explore the full politician universe, see who is trading what, understand the Insider Trading Risk Score, and find out who the biggest Congressional traders are. No game mechanics (dashboard, team management, draft) — those are Phase 3+.

</domain>

<decisions>
## Implementation Decisions

### Landing Page
- **D-01:** Bold & provocative hero tone — headline like "DRAFT YOUR POLITICIANS. PROFIT FROM THEIR TRADES." Unapologetic, attention-grabbing, leans into satire/viral angle.
- **D-02:** Explore-first CTA strategy — primary button goes to `/politicians` (directory), secondary to `/feed` (trade feed). No fake sign-up flow. Visitors see real data immediately.
- **D-03:** Auto-rotating carousel of 5 top trader PoliticianCards in featured section. Uses existing compact card variant. Dot indicators for position.
- **D-04:** "Powered by Alva" as dedicated footer section near page bottom — "Built on Alva's financial data platform" with description + link. Visible but doesn't compete with the product pitch.

### Politician Directory
- **D-05:** Sticky left sidebar filter panel on desktop with collapsible filter sections (party, chamber, state, committee, salary tier, risk range, activity level). Mobile: slide-out drawer from "Filters" button.
- **D-06:** Medium card density — 3 PoliticianCards per row using 'full' variant. Photo, name, party, state, key stats, and risk badge all visible. DraftKings player-pool density.
- **D-07:** Search bar at top of page — instant client-side filtering by politician name. Data is static JSON, zero latency.
- **D-08:** Grid/list view toggle — Grid (default): PoliticianCard 'full' variant in 3-column grid. List: compact table rows with photo, name, party, key stats in columns. Toggle via icon buttons.

### Politician Profiles
- **D-09:** Full-width hero banner header — large photo on left, name/party/state prominent, committee badges below, key stats (cost, points, risk score) as big numbers on right. Dark gradient background.
- **D-10:** Recharts 3.x for ALL charts across all tabs — LineChart (season performance), PieChart (sector breakdown), AreaChart (equity curve), RadarChart (risk components). Single library, consistent dark theme config.
- **D-11:** Corruption Dossier tab styled as intelligence briefing — subtle 'CLASSIFIED' watermark, monospace section headers, redacted-style accents. Radar chart centerpiece. Dramatic, shareable feel.
- **D-12:** Mobile tabs: horizontal scrollable tab bar with all 4 tab labels. Active tab underlined. Standard sports app pattern (DraftKings/ESPN). No accordion fallback.

### Trade Feed
- **D-13:** Twitter-style vertical feed cards — politician photo + name on left, trade details (ticker, amount, return vs S&P) in body, points + bonus badges as footer. Scrollable timeline feel.
- **D-14:** Desktop: main feed column (70%) with trending sidebar (30%). Mobile: feed full-width, trending section below the feed. Classic social media layout.
- **D-15:** Trending sidebar shows: top by points this week, top by volume, hot waiver wire picks — using PoliticianCard mini variant.

### Leaderboard
- **D-16:** Podium + ranked list for Hall of Shame — top 3 get visual podium treatment (large cards, gold/silver/bronze accents). Remaining politicians in ranked table with photo, stats, tier color badges.
- **D-17:** Two tabs on leaderboard: "Fantasy Points" (LEAD-01) and "Risk Score" (LEAD-03). Tab toggle switches the ranking and tier visualization.
- **D-18:** Swamp Lords manager leaderboard (LEAD-02) uses simulated manager rankings from demo data — 8 team owners from user's league ranked by record and points. Weekly/season/all-time tabs. User's team highlighted.

### Claude's Discretion
- Skeleton loading state implementations (UI-04) — specific shimmer patterns and timing
- Tooltip content and placement strategy (UI-05)
- Empty state copy and illustrations (UI-06)
- Feed filter bar design (party, chamber, trade type, points impact, time period)
- "My Roster Only" toggle placement and behavior (FEED-03)
- Navigation routing structure (URL patterns for all pages)
- How-It-Works section layout on landing page (LAND-02)
- Corruption Leaderboard "cleanest/swampiest" featured sections presentation

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Context
- `.planning/PROJECT.md` — Core value proposition, constraints, design direction, data sources
- `.planning/REQUIREMENTS.md` — Full v1 requirements; Phase 2 covers LAND-01 through LAND-04, DIR-01 through DIR-04, PROF-01 through PROF-05, FEED-01 through FEED-04, LEAD-01 through LEAD-03, UI-04 through UI-06
- `.planning/ROADMAP.md` — Phase dependencies and success criteria
- `CLAUDE.md` — Technology stack decisions, recommended libraries with versions

### Phase 1 Foundation
- `.planning/phases/01-foundation/01-CONTEXT.md` — Design system decisions (D-13 through D-17), data pipeline decisions, scoring engine decisions. Premium DraftKings aesthetic is locked.

### Technology Stack
- `CLAUDE.md` §Technology Stack — Next.js 16, React 19.2, Tailwind CSS 4.x, shadcn/ui, Recharts 3.x, Motion, TanStack Query 5.x
- `CLAUDE.md` §What NOT to Use — Moment.js, MUI, Tremor, Redux, CRA, Styled Components

### Existing Code
- `src/components/design/politician-card.tsx` — PoliticianCard with full/compact/mini variants (reuse in directory, feed, profiles, leaderboard)
- `src/components/design/risk-badge.tsx` — RiskBadge component (reuse on cards, profiles, leaderboard)
- `src/components/design/stat-cell.tsx` — StatCell component (reuse across data displays)
- `src/components/ui/` — shadcn/ui primitives: Card, Badge, Button, Tabs, Tooltip, Avatar, Sheet, Separator, NavigationMenu
- `src/components/layout/` — nav-desktop.tsx, nav-mobile.tsx, root-layout.tsx
- `src/lib/data/` — Data loaders: loadPoliticians, loadTrades, loadLeagues, loadMatchups, loadDemoState
- `src/lib/scoring/` — Scoring engine, bonuses, penalties, insider-risk, config
- `src/types/` — TypeScript contracts: Politician, Trade, Scoring, Demo
- `public/data/` — Static JSON: politicians.json, trades.json, leagues.json, matchups.json

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `PoliticianCard` (full/compact/mini variants): Direct reuse in directory grid, feed cards, leaderboard podium, profile header, trending sidebar
- `RiskBadge`: Reuse on all politician displays — directory cards, profiles, leaderboard rankings
- `StatCell`: Reuse for stats display across profiles and leaderboard
- `Card`, `Badge`, `Tabs`, `Tooltip`: shadcn/ui primitives for all page compositions
- `Sheet`: For mobile filter drawer in directory
- Data loaders: `loadPoliticians()`, `loadTrades()`, `loadLeagues()` — all the data this phase needs to display

### Established Patterns
- Party colors via CSS variables: `var(--party-dem)`, `var(--party-rep)`, `var(--party-ind)` — data indicators only
- Dark theme with CSS custom properties in globals.css
- `'use client'` directive on interactive components
- `<img>` tags (not next/image) per static export constraint
- `cn()` utility for Tailwind class merging

### Integration Points
- Global nav (nav-desktop.tsx, nav-mobile.tsx): Needs new route links for all Phase 2 pages
- `src/app/`: Currently only has layout.tsx and page.tsx — needs new route directories for /politicians, /politicians/[id], /feed, /leaderboard
- Mobile bottom tab bar: Needs updated with Phase 2 navigation items

</code_context>

<specifics>
## Specific Ideas

- **Intelligence briefing aesthetic for Corruption Dossier** — "CLASSIFIED" watermark, monospace headers, redacted-style accents. This is the most unique, shareable part of the product. Make it dramatic.
- **Podium treatment for leaderboard top 3** — Gold/silver/bronze visual hierarchy. Sports award show feel. Not just a table.
- **Carousel on landing page** — Auto-rotating top trader cards. Immediate visual proof this uses real politician data with real photos.
- **Bold provocative copy** — The landing page should grab attention. "Draft Your Politicians. Profit From Their Trades." Set the tone for the whole product.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 02-discovery*
*Context gathered: 2026-03-23*
