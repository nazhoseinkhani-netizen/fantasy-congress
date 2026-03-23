# Phase 1: Foundation - Context

**Gathered:** 2026-03-23
**Status:** Ready for planning

<domain>
## Phase Boundary

Data pipeline, scoring engine, Insider Trading Risk Score, demo data generation, and full premium design system. This phase produces the complete data layer and visual foundation — every page built in subsequent phases renders real politician data with correct scores using established design components.

No user-facing pages are delivered in this phase (those are Phase 2). This is pure infrastructure + design system.

</domain>

<decisions>
## Implementation Decisions

### Data Pipeline Strategy
- **D-01:** Real API first — build-time scripts call Alva Skills API to fetch politician trade data, output static JSON files to `public/data/`. If API is unavailable, build fails loudly. Research phase investigates actual Alva endpoints, auth, and rate limits.
- **D-02:** Politician photos sourced from dual chain: primary source bioguide.congress.gov official portraits, fallback unitedstates/images GitHub repo. Build script validates every URL returns HTTP 200.
- **D-03:** When both photo sources fail for a politician, generate a styled initials avatar using party color (blue/red) with the politician's initials. Do NOT exclude politicians with missing photos — keep the dataset complete.
- **D-04:** Static JSON output structured as one file per entity type: `politicians.json`, `trades.json`, `leagues.json`, `matchups.json`, etc. Separate files loaded independently for smaller initial loads and easier debugging.

### Scoring Engine
- **D-05:** Scoring point values and rules defined in a configurable JSON/TypeScript config object (not hardcoded). Enables tuning without touching engine code and future per-league custom rules.
- **D-06:** Scores computed at build time and baked into JSON output. Zero runtime computation cost. Scores only change when the data pipeline reruns.
- **D-07:** Trades with incomplete data (missing return, no S&P benchmark) are excluded from scoring but logged in a build report. Politician still appears with scores from valid trades only.
- **D-08:** Insider Trading Risk Score (0-100) uses bell curve distribution for tier thresholds. Most politicians land in middle tiers. Clean Record (<15) and Peak Swamp (>85) are rare — makes extremes feel meaningful and shareable.

### Demo Data
- **D-09:** Real politician trade data from STOCK Act disclosures combined with programmatically simulated league structures (teams, matchups, rosters). Real trades, simulated leagues.
- **D-10:** User pre-assigned to a competitive mid-tier team (approximately 3-3 record). Mix of high-profile traders and sleepers. User should feel they can improve the roster.
- **D-11:** 3 leagues with distinct themed names and personality (e.g., 'The Beltway Bandits', 'Capitol Casuals', 'Swamp Lords Supreme'). Each league feels different and showcases different aspects of the product.
- **D-12:** Salary cap pricing based on historical fantasy point performance tiers. Top performers = highest salary. Creates natural draft strategy tension. 5 tiers + unranked.

### Design System
- **D-13:** CRITICAL — Full premium design system. Every component custom-tuned. The app MUST feel like a funded startup's launch product, not a tutorial or AI-generated project. Extremely polished, creative, responsive, and interactive. This is non-negotiable.
- **D-14:** DraftKings premium aesthetic — near-black backgrounds, subtle card elevation, gold/amber accents for highlights, clean typography. Party colors (red/blue) as data indicators only. Serious sports product feel with personality.
- **D-15:** Fixed top navigation bar on desktop (logo, nav links, user area). Stays visible during scroll.
- **D-16:** Mobile: fixed bottom tab bar (DraftKings/Instagram pattern) with 4-5 key sections. Content stacks vertically, cards go full-width. Top nav becomes minimal header with logo only.
- **D-17:** shadcn/ui with full customization — all components, spacing scale, typography scale, animation tokens. Custom dark mode CSS variables. Complete visual identity established before any pages are built.

### Claude's Discretion
- Specific color hex values for the dark palette (within the DraftKings premium direction)
- Typography choices (font families, scale)
- Specific shadcn/ui component customization details
- Build script implementation patterns
- Scoring config file format (JSON vs TypeScript const)
- League name creativity and team name generation approach
- Insider Trading Risk Score component weights and tier boundary exact values

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Context
- `.planning/PROJECT.md` — Core value proposition, constraints, design direction, data sources
- `.planning/REQUIREMENTS.md` — Full v1 requirements with traceability; Phase 1 covers DATA-01 through DATA-05, SCORE-01 through SCORE-06, CORR-01 through CORR-03, DEMO-01 through DEMO-04, UI-01 through UI-03
- `.planning/ROADMAP.md` — Phase dependencies and success criteria
- `CLAUDE.md` — Technology stack decisions, recommended libraries with versions, stack patterns, and what NOT to use

### Technology Stack
- `CLAUDE.md` §Technology Stack — Next.js 16, React 19.2, Tailwind CSS 4.x, shadcn/ui, Zustand 5.x, TypeScript 5.x, Recharts 3.x, Motion, TanStack Query 5.x
- `CLAUDE.md` §What NOT to Use — Moment.js, MUI, Tremor, Redux, CRA, Styled Components

### Data Sources
- bioguide.congress.gov — Official Congressional portrait photos (primary)
- unitedstates/images GitHub repo — Portrait fallback source
- Alva Skills API — Politician trade data, stock prices, fundamentals (shape TBD — needs research)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- None — greenfield project. Only CLAUDE.md exists in the repo.

### Established Patterns
- None yet. Phase 1 establishes all patterns.

### Integration Points
- This phase creates the foundation that all subsequent phases build on:
  - `public/data/*.json` — consumed by every data-displaying page
  - Scoring engine module — imported by dashboard, profile, and leaderboard components
  - Design system tokens and components — used by every UI component in Phases 2-5
  - Demo data structures — consumed by league, team, and draft features

</code_context>

<specifics>
## Specific Ideas

- **"Funded startup launch" quality bar** — The user explicitly requires the design to be extremely premium, creative, polished, responsive, and interactive. Must not look like an AI-generated or tutorial project. This is the single strongest directive for the design system work.
- **DraftKings as north star** — The premium dark aesthetic should reference DraftKings' visual language: dark backgrounds, elevation through subtle shadows, gold accent colors, clean data presentation.
- **"Insider Trading Risk Score" branding** — Legal risk mitigation requires this name over "Corruption Index" throughout the product.
- **Party colors for data only** — Red and blue used as data indicators (Republican/Democrat), not as primary UI colors.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 01-foundation*
*Context gathered: 2026-03-23*
