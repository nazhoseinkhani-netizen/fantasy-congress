# Phase 5: Polish and Viral - Context

**Gathered:** 2026-03-23
**Status:** Ready for planning

<domain>
## Phase Boundary

Micro-interactions and animations across all major views, shareable image cards for politicians and teams, and Alva platform showcase (footer on every page + Developer Mode Easter egg). No new features or pages — this phase enhances what already exists. No real multiplayer, no authentication, no backend changes.

</domain>

<decisions>
## Implementation Decisions

### Animation Style & Intensity
- **D-01:** ESPN spectacle vibe — bold, dramatic animations throughout. Cards fly, numbers tick up like scoreboards, gauges fill with color sweeps. Matches the DraftKings premium aesthetic and Phase 4's live draft tension.
- **D-02:** Load + interaction triggers — key elements animate on first page view (corruption gauge fills, points count up) AND on user interaction (draft picks fly, cards expand). The app feels alive from the moment you land.
- **D-03:** Sports scoreboard flip ticker for points counters — numbers flip/roll like a stadium scoreboard or slot machine. Each digit transitions independently. Classic sports broadcast feel.
- **D-04:** Theatrical corruption gauge reveal — gauge sweeps from 0 to score with color transitions (green to yellow to red), slight overshoot bounce at final value, tier label fades in after. 1.5-2 second reveal duration.

### Share Card Design & Generation
- **D-05:** html-to-image for client-side card generation — renders a hidden DOM element to PNG. Full control over design using existing React components. CORS non-issue since politician photos are in `public/photos/` (same-origin with static export).
- **D-06:** Two share card types — (1) Individual politician card with photo, stats, corruption score, fantasy points. (2) My Team card with roster lineup, team record, league rank. Covers SHARE-01 core use cases.
- **D-07:** Contextual share buttons — Share icon appears on politician cards (directory, profile, leaderboard) and on the My Team page header. Tap to generate + show preview with download/copy options.
- **D-08:** Dark premium trading card aesthetic — matches app's DraftKings dark theme. Dark background, gold accents, politician photo prominent, "Powered by Alva" badge at bottom. Looks like a sports trading card.

### Developer Mode Easter Egg
- **D-09:** Keyboard shortcut activation (Ctrl+Shift+D) — Konami-style classic Easter egg discovery. Matches PLAT-03 spec requirement of keyboard shortcut.
- **D-10:** Dashed borders + tooltips on data elements — every data-driven element gets a dashed border with colored overlay when dev mode is active. Hover/tap reveals tooltip showing which Alva Skill powers it (e.g., "getSenatorTrades"). Toggle banner at top confirms mode is active.
- **D-11:** Core data source attribution only — attribute the 3-4 main Alva Skills: getSenatorTrades (trade data), stock prices (returns), politician metadata. Focused on what's impressive, not exhaustive.

### Platform Showcase Placement
- **D-12:** AlvaFooter on every page — consistent "Data Sources: Alva Skills API" footer across all pages. Extends existing `AlvaFooter` component from landing page to global layout. Reinforces platform story everywhere.
- **D-13:** "Build Your Own" CTA in Alva footer — add a "Build Your Own" button/link within the existing AlvaFooter alongside the "Learn more at alva.ai" link. Natural placement, not competing with product UX.
- **D-14:** Static footer content everywhere — same AlvaFooter content on all pages. General "Powered by Alva" message with link. Developer Mode handles the granular per-element attribution.

### Claude's Discretion
- Draft pick fly-to-roster animation specifics (trajectory, burst effect particles, timing)
- Trade alert slide-in animation design (direction, glow color, badge bounce timing)
- Swamp-o-meter gauge animation on leaderboard (similar to corruption gauge but potentially different scale)
- Share card exact layout and typography within the dark premium template
- Share preview modal design (preview + download/copy buttons)
- Developer Mode toggle banner design and positioning
- Developer Mode tooltip content format for each Alva Skill
- AlvaFooter updated copy and "Build Your Own" button styling
- Mobile share flow (native share sheet vs. download only)
- Animation performance optimization (intersection observer for scroll-triggered animations)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Context
- `.planning/PROJECT.md` — Core value, constraints (static export, localStorage), design direction (DraftKings premium, dark mode)
- `.planning/REQUIREMENTS.md` — Phase 5 requirements: ANIM-01 through ANIM-05, SHARE-01 through SHARE-04, PLAT-01 through PLAT-03
- `.planning/ROADMAP.md` — Phase 5 success criteria (3 criteria), phase dependencies

### Technology & Patterns
- `CLAUDE.md` — Technology stack: Next.js 16, React 19.2, Tailwind CSS 4.x, shadcn/ui, Motion 12.x
- `package.json` — Motion v12.38.0 already installed as dependency

### Existing Animation Code (reuse patterns)
- `src/components/draft/post-draft.tsx` — AnimatePresence + motion usage pattern
- `src/components/draft/on-the-clock.tsx` — motion component pattern
- `src/components/draft/pick-ticker.tsx` — AnimatePresence scroll/ticker pattern
- `src/components/draft/pre-draft-lobby.tsx` — Countdown animation pattern
- `src/components/team/roster-card.tsx` — AnimatePresence for inline expand

### Platform Showcase
- `src/components/landing/alva-footer.tsx` — Existing AlvaFooter component (extend to global + add "Build Your Own" CTA)

### Data Layer (for share cards and dev mode attribution)
- `src/lib/data/politicians.ts` — loadPoliticians() for politician data in share cards
- `src/lib/data/demo.ts` — loadDemoState() for team data in share cards
- `src/types/politician.ts` — Politician interface with all fields for card rendering

### Prior Phase Context
- `.planning/phases/01-foundation/01-CONTEXT.md` — Design system locked (D-13 through D-17), dark theme, gold accent
- `.planning/phases/04-draft-room/04-CONTEXT.md` — Draft animation baseline (D-01 AI delay, D-02 countdown), ESPN-style vibe established

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `motion` library (v12.38.0): Already imported in 7 components — `motion/react` with `AnimatePresence` pattern established
- `AlvaFooter`: Existing "Powered by Alva" component — extend for global use and "Build Your Own" CTA
- `PoliticianCard` (full/compact/mini): Base for share card rendering — reuse in hidden DOM for html-to-image capture
- `RiskBadge`: Corruption tier display — animate the gauge reveal on this component
- `StatCell`: Stats display — animate number values with scoreboard ticker
- Draft components: Pick ticker, on-the-clock, pre-draft lobby all have Motion patterns to follow

### Established Patterns
- `motion/react` imports with `AnimatePresence` for enter/exit animations
- `'use client'` directive on interactive components
- `<img>` tags (not next/image) per static export constraint — relevant for share card photo rendering
- `cn()` utility for Tailwind class merging
- Party colors via CSS variables
- Client-side data loading via fetch to `/data/*.json`

### Integration Points
- Global layout (`src/app/layout.tsx` or `src/components/layout/root-layout.tsx`): Add AlvaFooter to global layout
- All pages with data elements: Add `data-alva-skill` attributes for Developer Mode tooltip targeting
- Politician cards across directory, profile, leaderboard: Add share button
- My Team page header: Add share button for team card
- Draft components: Enhance existing Motion animations with ANIM-01 effects
- Leaderboard page: Add Swamp-o-meter animated gauge (ANIM-05)

</code_context>

<specifics>
## Specific Ideas

- **"The app feels alive"** — ESPN spectacle on load AND interaction. No page should feel static. Points tick, gauges fill, cards animate in.
- **Sports trading card share aesthetic** — Dark premium with gold accents. The politician share card should look like something you'd collect. "Powered by Alva" badge at bottom like a card manufacturer logo.
- **Developer Mode as a wow moment** — When activated, the dashed borders and tooltips should feel like lifting the hood on a race car. The toggle banner should make it feel official and intentional, not debug-y.
- **Consistent Alva presence** — Footer on every page, "Build Your Own" CTA for developers, Developer Mode for the deep dive. Three layers of platform visibility.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 05-polish-and-viral*
*Context gathered: 2026-03-23*
