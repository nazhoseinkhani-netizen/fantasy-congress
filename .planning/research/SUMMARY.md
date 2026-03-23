# Project Research Summary

**Project:** Fantasy Congress
**Domain:** Gamified political transparency app — fantasy sports mechanic applied to congressional stock trading
**Researched:** 2026-03-23
**Confidence:** HIGH

## Executive Summary

Fantasy Congress is a novel hybrid product that maps the fantasy sports engagement loop (draft, roster management, weekly scoring, leaderboards) onto real congressional STOCK Act trade disclosures. The recommended approach treats it as a static-first web app: Next.js 16 with `output: 'export'`, all external API data fetched at build time via scripts and cached as static JSON in `/public/data/`, with Zustand persisting user game state to localStorage. This eliminates runtime API dependencies, ensures zero cold-start latency, and keeps the Alva Skills API key off the client entirely. The app deploys as a CDN-distributed static bundle to Vercel or Netlify.

The product's differentiation lives in three features that no competitor has combined: a named Insider Trading Risk Score (not "Corruption Index" — naming matters legally), trade-level bonus badges (e.g., "Pre-Legislation Buy," "STOCK Act Violator"), and share cards designed for Twitter/X virality. The fantasy sports scaffolding — draft room, weekly matchups, team roster — gives users a familiar engagement structure while the political data provides the novelty and shareability. For the prototype goal of demonstrating Alva's platform value, the P1 milestone (politician directory, live trade feed, politician profiles, leaderboard, scoring engine, landing page) is compelling as a standalone demo without the full fantasy sports depth.

The primary risks are data-structural rather than technical. Congressional disclosure data has inherent gaps (45-day filing window, routine late filers, known non-filers) that will make scores look wrong if not surfaced explicitly. The scoring engine must be built as a single canonical pure function before any UI that displays scores — score divergence between components destroys user trust and is the #1 post-launch credibility problem in fantasy sports. The Insider Trading Risk Score needs its methodology documented and visible before launch to preempt editorial and legal attacks. Each of these is a known, preventable problem with clear mitigation if addressed in the right phase.

## Key Findings

### Recommended Stack

The full stack is well-established and low-risk. Next.js 16 (Turbopack default, React Compiler stable, React 19.2 bundled) provides file-based routing, static export, and first-class Vercel deployment. Tailwind CSS 4.x with shadcn/ui (CLI v4) handles styling and components — both were released in 2025 and are fully compatible. Zustand 5.x with `persist` middleware handles user game state without a backend. TanStack Query 5.x handles API calls during the build-time data pipeline.

One critical version compatibility note: use `npx shadcn@latest` not `npx shadcn-ui@latest` (old package name). Import Motion from `motion/react`, not `framer-motion` (renamed package). Set `images: { unoptimized: true }` in `next.config.ts` for static export with external politician photo URLs.

**Core technologies:**
- **Next.js 16 + React 19.2**: Framework — App Router, static export, Turbopack, React Compiler auto-memoization for leaderboard/scoring re-renders
- **TypeScript 5.x**: Type safety — deeply nested scoring rules and Congressional data structures require it
- **Tailwind CSS 4.x + shadcn/ui**: Styling — dark mode via CSS variables, copy-owned components for full aesthetic control
- **Zustand 5.x**: Client state — team roster, draft state, league context persisted via localStorage middleware
- **Recharts 3.x + ApexCharts**: Charts — Recharts for line/bar/area; ApexCharts specifically for candlestick (Recharts lacks native candlestick)
- **Motion (latest)**: Animation — score counters, badge reveals, draft pick animations; import from `motion/react`
- **html-to-image**: Share card generation — client-side PNG export; CORS mitigation requires politician photos hosted at own domain
- **TanStack Query 5.x**: Data fetching in build scripts; stale-while-revalidate for any runtime fetches

### Expected Features

**Must have (P1 — standalone compelling demo):**
- Politician directory with photos, stats, and corruption tier badge — users assume this exists; placeholders kill credibility
- Individual politician profiles with three tabs: Fantasy Stats, Trading Profile, Corruption Dossier
- Live trade feed — recent STOCK Act disclosures with score and bonus badges
- Hall of Shame leaderboard — ranked by Insider Trading Risk Score and by return
- Scoring engine — translates raw trade data into fantasy points with bonuses/penalties
- Landing page — value proposition, product preview, CTA
- Insider Trading Risk Score — synthesizes trade timing, volume, sector concentration, legislative conflict-of-interest

**Should have (P2 — adds fantasy sports depth):**
- User dashboard with pre-populated team, weekly matchup scoreboard, season KPIs
- My Team roster management — active/bench slots, per-player scoring breakdown
- League standings + schedule — standings table, past/upcoming matchups
- Pre-populated demo data — 3 leagues, 6 weeks of simulated results, AI opponent rosters
- Badges/bonus labels on individual trades

**Defer (P3 — polish and virality):**
- Draft room with simulated snake draft vs. AI opponents
- Share card generation — politician dossier cards and team performance cards
- Developer Mode Easter egg — reveals Alva API calls powering each data point
- Weekly recap mockup — email card format

**Never build (anti-features):**
- Real-time WebSocket trade updates — no real-time STOCK Act data exists; 45-day lag makes this meaningless
- Real user authentication — full auth is weeks of work; localStorage demo state suffices for prototype
- Real multiplayer leagues — requires backend, matchmaking, real-time sync; out of scope
- Investment advice framing — legal liability; frame as entertainment and accountability
- Prediction markets or betting — active regulatory scrutiny in 2025-2026

### Architecture Approach

The architecture is a clean three-layer model: (1) build-time data pipeline (`scripts/` directory calls external APIs, computes scores, generates league fixtures, writes everything to `public/data/` as typed JSON), (2) static app layer (Next.js Server Components read from `public/data/` via `generateStaticParams`, producing pre-built HTML for all 150+ politician profile pages), and (3) runtime client layer (Zustand stores manage user game state, Client Components handle interaction, localStorage persists across navigation). The scoring engine lives in `lib/scoring/` as pure TypeScript functions with no React dependencies — callable identically by build scripts and by browser components. This separation is mandatory, not optional: game logic in components becomes untestable and divergent.

**Major components:**
1. **Data Pipeline (`scripts/`)** — fetch-politicians, fetch-trades, compute-scores, generate-league; runs once before `next build`; Alva API key never touches the browser
2. **Static Data Layer (`public/data/`)** — `index.json` for list queries, `[bioguideId].json` for profiles; structured JSON is the app's "database"
3. **Scoring Engine (`lib/scoring/`)** — pure functions: `scorePolitician(trades[], rules) => ScoringBreakdown`; single source of truth for all score displays
4. **Draft Simulator (`lib/draft/`)** — deterministic AI pick logic seeded from league config; pure functions, no side effects
5. **Zustand Stores (`stores/`)** — team.store, league.store, draft.store; `persist` middleware → localStorage; only user-specific delta state (not bulk data)
6. **Feature Modules (`features/`)** — scoring display, draft room UI, share card generator, developer mode Easter egg; self-contained, higher coupling tolerated
7. **App Router Pages (`app/`)** — thin Server Components that read from `public/data/` at build time; interactive sub-components are Client Components

### Critical Pitfalls

1. **Congressional disclosure data has structural gaps** — The 45-day STOCK Act filing window means a politician's "current" score may be missing weeks of actual trades. Prevention: show a disclosure lag indicator on every politician card ("Last disclosure: 47 days ago — score may undercount recent trades"); label scores "as of last disclosure"; treat low-disclosure politicians as suspect. Address in the Data Layer phase before any UI is built.

2. **Scoring engine divergence across components** — Build the canonical `scorePolitician()` pure function before any UI displays a score. Every score on the leaderboard, profile page, matchup scoreboard, and team view must call this function or display its cached output. Zero inline arithmetic on scores. Write unit tests for scoring edge cases before the first score-displaying component. Address before Dashboard/Team UI.

3. **Photo dependency breaks product credibility** — Congressional photo coverage is 85-90%, not 100%. Newly sworn-in members take weeks to get GPO photos. Prevention: validate every bioguide ID against a valid HTTP 200 response during data seeding; implement a fallback chain (bioguide → unitedstates/images → styled initials avatar); use `onError` handlers universally; never hotlink directly from bioguide.congress.gov (host photos at own domain). Address in the Politician Directory / Data Seeding phase.

4. **Insider Trading Risk Score legal and editorial risk** — Never call it "Corruption Index." Brand it "Insider Trading Risk Score" or "Trading Transparency Score." Make methodology fully visible on the score card. Lean on unambiguous facts (disclosure timing, frequency, sector concentration). Add a visible disclaimer. Define the scoring formula in writing before building the UI. Address in the Leaderboard / Profile phase.

5. **Demo data staleness** — Hardcoded "Week 6" or absolute 2025 dates make the app feel abandoned within weeks. Prevention: compute current week as `week = floor((now - seasonStart) / 7) + 1`; separate real data (politician profiles, actual trade disclosures) from simulated data (league standings, matchup results); use 2026 congressional session dates. Address in the Architecture / Foundation phase.

6. **localStorage overflow** — Storing bulk politician data in localStorage (not just user state) will hit the 5MB quota. Prevention: keep all politician/trade/league data in the app bundle as imported JSON constants; localStorage stores only user delta state (roster picks, active bench, draft session). Total localStorage payload should be under 500KB at demo scale. Address in Architecture phase.

7. **Share card CORS failures** — Client-side `html-to-image` / `html2canvas` canvas rendering fails for cross-origin politician photos. Prevention: host all politician photos at own domain at build time; test with Twitter Card Validator and on iOS Safari before declaring done; consider server-side image generation via `@vercel/og` as a fallback. Address in the Share Cards phase — this is never a two-hour task.

## Implications for Roadmap

Based on combined research, the dependency chain is unambiguous. The scoring engine must precede all UI, the data layer must precede the scoring engine, and the P1 discovery features (directory, profiles, leaderboard) must be completable before P2 game experience features (dashboard, team, league). The draft room and share cards are genuinely P3 — they depend on everything above and are separable from the core demo.

Suggested phase structure: **8 phases** across three capability tiers.

### Phase 1: Foundation and Data Pipeline
**Rationale:** Everything depends on data. The scoring engine needs trade data shapes. The politician directory needs profiles and photos. The leaderboard needs computed scores. None of this can be built without the data layer in place. This phase establishes the entire build-time pipeline and prevents the Alva API key from ever touching the browser.
**Delivers:** `public/data/` JSON structure populated with 50-100 politicians and their trade histories; TypeScript types for all entities; typed data accessors in `lib/data/`; photo validation confirming HTTP 200 for every portrait; build scripts running without error
**Addresses:** Politician directory (data prerequisite), trade feed (data prerequisite)
**Avoids:** API key exposure (Pitfall 7), photo dependency fragility (Pitfall 2), monolithic JSON (anti-pattern 5), localStorage data overflow (Pitfall 6)
**Research flag:** Needs `/gsd:research-phase` — Alva Skills API shape, available endpoints, and rate limits are unknown until tested

### Phase 2: Scoring Engine and Corruption Index
**Rationale:** The scoring engine is the most depended-upon module in the codebase. If it's not locked before UI is built, score divergence will occur and trust is destroyed. The Insider Trading Risk Score formula must also be defined in writing here — before any leaderboard or profile UI shows a score.
**Delivers:** `lib/scoring/engine.ts` with pure scoring functions; `lib/utils/corruption-index.ts`; `lib/scoring/rules.ts` (configurable scoring weights); unit tests with edge cases; written methodology document for the Insider Trading Risk Score
**Addresses:** Scoring system (P1 table stakes), Insider Trading Risk Score (P1 differentiator), scoring bonuses/badges logic
**Avoids:** Scoring engine divergence (Pitfall 3), Corruption Index legal risk (Pitfall 4)
**Research flag:** Standard patterns — pure function design is well-documented; no additional research needed

### Phase 3: Next.js Infrastructure and Design System
**Rationale:** Static export configuration, global layout, theme, and shared component library must be established before building any pages. `generateStaticParams` patterns and the Server/Client Component split established here will be applied uniformly in Phase 4.
**Delivers:** `next.config.ts` with `output: 'export'` and `images: { unoptimized: true }`; `app/layout.tsx` with global nav and dark mode (next-themes); shadcn/ui initialized; base component library (cards, badges, tabs, tables); Tailwind design tokens for the premium dark aesthetic
**Addresses:** Responsive design (table stakes), dark mode (DraftKings aesthetic)
**Avoids:** next/image with static export pitfall (critical version compatibility), styled components runtime cost
**Research flag:** Standard patterns — well-documented; no additional research needed

### Phase 4: P1 Discovery Pages (Politician-Facing)
**Rationale:** This is the standalone compelling demo. With data, scoring, and infrastructure in place, these four pages can be built in dependency order. Together they constitute the Alva leadership pitch without any fantasy sports depth.
**Delivers:** Landing page (`/`); Politician directory (`/politicians`) with photo, stats, corruption tier badge; Individual politician profiles (`/politicians/[bioguideId]`) with three tabs; Hall of Shame leaderboard (`/leaderboard`)
**Addresses:** All P1 features: politician directory, politician profiles, live trade feed, leaderboard, scoring display
**Avoids:** Disclosure data gap (every score shows freshness timestamp), photo broken images (onError fallbacks), Insider Trading Risk Score methodology (visible on score cards)
**Research flag:** Standard patterns for Next.js page structure; no additional research needed

### Phase 5: Zustand Stores and Game State Layer
**Rationale:** The P2 game experience pages (dashboard, team, league) require game state that persists across navigation. Stores must be built and validated before P2 pages consume them. This is also where the localStorage payload is measured and confirmed under 500KB.
**Delivers:** `stores/team.store.ts`, `stores/league.store.ts` with persist middleware; pre-populated default team state; localStorage payload measurement confirming under 500KB; Zustand hydration SSR mismatch handling
**Addresses:** Roster management, user dashboard prerequisites
**Avoids:** localStorage overflow (Pitfall 6), storing bulk politician data in state (anti-pattern 2)
**Research flag:** Standard patterns — Zustand persist is well-documented; no additional research needed

### Phase 6: P2 Game Experience Pages and Demo Data
**Rationale:** With stores in place and the scoring engine locked, the fantasy sports product depth can be layered on. Pre-populated demo data is the enabler — without it, the dashboard and league views are empty and unconvincing. Demo data must use relative date logic, not hardcoded 2025 dates.
**Delivers:** User dashboard (`/dashboard`) with weekly matchup scoreboard and season KPIs; My Team roster view (`/team`) with active/bench slot management; League standings + schedule (`/league`); pre-populated demo data (3 leagues, 6 weeks of simulated results, AI opponent rosters with real politician names)
**Addresses:** User dashboard, roster management, league standings, pre-populated demo state — all P2 features
**Avoids:** Demo data staleness (Pitfall 5) — relative date computation from day one; simulated leagues feeling fake (UX pitfall) — convincing AI opponent personas
**Research flag:** Standard patterns; no additional research needed

### Phase 7: Draft Room
**Rationale:** The draft room is the most complex single feature and is separated as its own phase. It depends on the politician pool (Phase 1), salary cap values derived from the scoring engine (Phase 2), and both Zustand stores (Phase 5). The draft simulator must be deterministic (seeded per league) so AI picks are reproducible.
**Delivers:** `lib/draft/simulator.ts` (deterministic AI pick logic) and `lib/draft/snake.ts` (pick ordering); `stores/draft.store.ts`; draft room page (`/draft`) with snake draft UI, AI opponent turns, confirmation dialogs, and undo capability; draft state persisted to localStorage; team store updated on draft completion
**Addresses:** Draft experience (P3 table stakes — "the ritual entry point of season-long fantasy")
**Avoids:** Draft room without undo/confirmation (UX pitfall); draft state lost on page refresh (verified in checklist)
**Research flag:** May benefit from `/gsd:research-phase` — snake draft UI patterns and AI pick strategy are domain-specific; DraftKings/ESPN draft room UX patterns worth studying before building

### Phase 8: Share Cards and Developer Mode Polish
**Rationale:** Share cards are last because they depend on everything above (politician profiles, scoring breakdowns, team scores) and have a non-trivial implementation challenge (CORS, mobile rendering). Developer Mode is last because revealing an incomplete data pipeline in earlier phases would undermine the Alva pitch.
**Delivers:** Share card generation for politician dossier cards and team performance cards; CORS-safe image pipeline (politician photos hosted at own domain); share cards tested with Twitter Card Validator and on iOS Safari; Developer Mode Easter egg (keyboard shortcut reveals Alva API calls behind each card); Motion animations and micro-interactions throughout; weekly recap mockup
**Addresses:** Share card generation, developer mode Easter egg, weekly recap mockup — all P3 features
**Avoids:** Share card CORS failures (Pitfall 7) — server-side generation via `@vercel/og` as fallback if client-side html-to-image fails on mobile
**Research flag:** Needs `/gsd:research-phase` — CORS handling strategy for html-to-image vs. `@vercel/og` tradeoff requires investigation; Web Share API mobile compatibility needs validation

### Phase Ordering Rationale

- **Data before scoring before UI:** ARCHITECTURE.md's suggested build order is explicit — data layer, then scoring engine, then static page infrastructure, then P1 pages, then stores, then P2 pages, then draft, then polish. Every dependency in FEATURES.md confirms this ordering.
- **Scoring engine isolated before UI:** PITFALLS.md's Pitfall 3 is the most operationally dangerous — score divergence. The only prevention is building the canonical function first and never deviating. Phases 1-2 create an unbreakable contract before any score-displaying component exists in Phase 4.
- **P1 before P2:** FEATURES.md's dependency map confirms that matchups, team management, and league standings all require rosters (draft or pre-populated), which require the scoring engine, which requires the data layer.
- **Draft room late:** The draft room is isolated to Phase 7 because it is the highest-complexity UI feature with the most dependencies and the least urgency for the Alva demo. Phases 1-6 already deliver a compelling demo.
- **Share cards last:** PITFALLS.md is unambiguous — share card CORS is consistently underestimated. Phase 8 scopes it as a real engineering milestone, not a polish item.

### Research Flags

Phases likely needing `/gsd:research-phase` during planning:
- **Phase 1 (Data Pipeline):** Alva Skills API endpoints, data shape, authentication pattern, and rate limits are unknown. API research required before data scripts can be designed.
- **Phase 7 (Draft Room):** Snake draft UI patterns and AI opponent pick strategy are domain-specific. DraftKings and ESPN draft room UX patterns are worth researching to avoid obvious UX mistakes.
- **Phase 8 (Share Cards):** CORS mitigation strategy (html-to-image + self-hosted photos vs. `@vercel/og` server-side generation) has non-obvious tradeoffs. Mobile Web Share API compatibility needs validation.

Phases with standard patterns (skip `/gsd:research-phase`):
- **Phase 2 (Scoring Engine):** Pure function design is well-documented; TypeScript module patterns are standard.
- **Phase 3 (Infrastructure):** Next.js static export configuration and shadcn/ui setup are covered by official docs.
- **Phase 4 (Discovery Pages):** Next.js App Router page patterns and `generateStaticParams` are well-documented.
- **Phase 5 (Zustand Stores):** Zustand persist middleware is well-documented with official examples.
- **Phase 6 (Game Experience):** Fantasy sports dashboard and roster UI patterns are standard; Recharts charting patterns are well-documented.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Core stack (Next.js, Tailwind, shadcn, Zustand, Recharts) all verified against official docs. Charting library comparison (Recharts vs. ApexCharts) rated MEDIUM by stack researcher — community source — but recommendation is conservative and safe. |
| Features | HIGH (fantasy sports) / MEDIUM (hybrid political transparency) | Fantasy sports feature set is well-researched from ESPN, Yahoo, DraftKings sources. Hybrid political gamification features have no direct comparators — extrapolated from Quiver Quantitative, Capitol Trades, and Unusual Whales. The Corruption Index legal risk assessment is well-grounded. |
| Architecture | HIGH | All major patterns verified against official Next.js static export docs. Data pipeline pattern is widely used for static-first apps. Zustand persist and localStorage boundaries are documented. |
| Pitfalls | HIGH | Multiple independent sources verified across all 7 critical pitfalls. STOCK Act disclosure gaps confirmed by Brennan Center, OpenSecrets, Government Accountability Project. Photo dependency confirmed by unitedstates/images repo issue tracker. localStorage limits confirmed by MDN. |

**Overall confidence:** HIGH

### Gaps to Address

- **Alva Skills API specifics:** The data pipeline in Phase 1 cannot be fully designed until the Alva API shape, available endpoints (trade history, politician IDs, stock prices), authentication method, and rate limits are known. This is the single highest-risk unknown. Address via `/gsd:research-phase` in Phase 1 planning.
- **Insider Trading Risk Score formula:** The scoring weights (trade timing, volume, sector concentration, disclosure lag multipliers) are not defined in research. The Phase 2 milestone must include writing the methodology document as a deliverable before any UI is built.
- **Salary cap values for draft room:** Salary values for 50-100 politicians must be derived from the scoring engine and trading volume. The specific formula (e.g., "Pelosi costs 8,500 cap; backbencher costs 1,200") is a design decision that research does not resolve. Address during Phase 7 planning.
- **Photo hosting strategy:** Research identifies that politician photos must be hosted at own domain to avoid CORS issues with share cards. The specific CDN or hosting approach (committed to repo at build time vs. Cloudflare Images vs. Vercel Blob) is not decided. Address during Phase 1 data pipeline design.

## Sources

### Primary (HIGH confidence)
- [Next.js Static Exports — Official Docs](https://nextjs.org/docs/app/guides/static-exports) — static export patterns, `generateStaticParams`
- [Next.js 16 release blog](https://nextjs.org/blog/next-16) — Turbopack default, React Compiler stable
- [Tailwind CSS v4.0 release](https://tailwindcss.com/blog/tailwindcss-v4) — CSS-first config, January 2025 stable
- [shadcn/ui Tailwind v4 docs](https://ui.shadcn.com/docs/tailwind-v4) — CLI v4 compatibility
- [Zustand v5 announcement](https://pmnd.rs/blog/announcing-zustand-v5) — persist middleware, React 18 requirement
- [TanStack Query v5 overview](https://tanstack.com/query/v5/docs/framework/react/overview) — caching behavior
- [Motion for React docs](https://motion.dev/docs/react) — `motion/react` import path
- [MDN Storage quotas](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria) — localStorage limits
- [STOCK Act / insider trading — Brennan Center](https://www.brennancenter.org/our-work/research-reports/congressional-stock-trading-explained) — disclosure gap confirmed
- [Rep. Val Hoyle STOCK Act violation — OpenSecrets](https://www.opensecrets.org/news/2025/09/rep-val-hoyle-violated-stock-act-by-missing-deadlines-to-disclose-217-stock-transactions/) — disclosure lag real example
- [unitedstates/images repo issue #125](https://github.com/unitedstates/images/issues/125) — photo coverage gaps confirmed

### Secondary (MEDIUM confidence)
- [LogRocket React chart libraries 2025](https://blog.logrocket.com/best-react-chart-libraries-2025/) — Recharts vs. ApexCharts comparison
- [Fantasy Sports Engine Architecture — Arka Softwares](https://www.arkasoftwares.com/blog/fantasy-sports-engine-architecture-core-modules/) — architecture patterns
- [Quiver Quantitative Politician Directory](https://www.quiverquant.com/politicians/) — competitor feature analysis
- [Unusual Whales Congress Trading Report 2025](https://unusualwhales.com/congress-trading-report-2025) — competitor feature analysis
- [Capitol Trades Politician Directory](https://www.capitoltrades.com/politicians) — competitor feature analysis
- [ESPN Fantasy App What's New in 2025](https://support.espn.com/hc/en-us/articles/39732027887764-ESPN-Fantasy-App-What-s-New-in-2025) — table stakes features
- [DraftKings Daily Fantasy Contest Rules](https://draftkings1452613992.zendesk.com/hc/en-us/articles/4402266096787-Daily-Fantasy-Contest-Rules-Scoring-overview) — scoring patterns, salary cap mechanic
- [The ABCs of the CPI — Transparency International](https://www.transparency.org/en/news/how-cpi-scores-are-calculated) — corruption index methodology critique
- [Next.js static generation rate limits — Vercel GitHub Discussions](https://github.com/vercel/next.js/discussions/18550) — API rate limit during build
- [html-to-image vs html2canvas — Better Programming](https://betterprogramming.pub/heres-why-i-m-replacing-html2canvas-with-html-to-image-in-our-react-app-d8da0b85eadf) — share card library comparison

---
*Research completed: 2026-03-23*
*Ready for roadmap: yes*
