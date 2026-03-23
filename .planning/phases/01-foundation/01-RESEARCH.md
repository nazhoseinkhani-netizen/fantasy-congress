# Phase 1: Foundation - Research

**Researched:** 2026-03-23
**Domain:** Data pipeline, scoring engine, design system, demo data — static Next.js app with Congressional trade data
**Confidence:** HIGH (stack verified, data source alternatives documented, static export behavior confirmed from official docs)

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Data Pipeline Strategy**
- D-01: Real API first — build-time scripts call Alva Skills API to fetch politician trade data, output static JSON files to `public/data/`. If API is unavailable, build fails loudly.
- D-02: Politician photos sourced from dual chain: primary source bioguide.congress.gov official portraits, fallback unitedstates/images GitHub repo. Build script validates every URL returns HTTP 200.
- D-03: When both photo sources fail for a politician, generate a styled initials avatar using party color (blue/red) with the politician's initials. Do NOT exclude politicians with missing photos.
- D-04: Static JSON output structured as one file per entity type: `politicians.json`, `trades.json`, `leagues.json`, `matchups.json`, etc.

**Scoring Engine**
- D-05: Scoring point values and rules defined in a configurable JSON/TypeScript config object (not hardcoded).
- D-06: Scores computed at build time and baked into JSON output. Zero runtime computation cost.
- D-07: Trades with incomplete data are excluded from scoring but logged in a build report.
- D-08: Insider Trading Risk Score (0-100) uses bell curve distribution for tier thresholds.

**Demo Data**
- D-09: Real politician trade data from STOCK Act disclosures combined with programmatically simulated league structures.
- D-10: User pre-assigned to a competitive mid-tier team (approximately 3-3 record).
- D-11: 3 leagues with distinct themed names: 'The Beltway Bandits', 'Capitol Casuals', 'Swamp Lords Supreme'.
- D-12: Salary cap pricing based on historical fantasy point performance tiers. 5 tiers + unranked.

**Design System**
- D-13: CRITICAL — Full premium design system. Must feel like a funded startup's launch product.
- D-14: DraftKings premium aesthetic — near-black backgrounds, subtle card elevation, gold/amber accents, clean typography. Party colors (red/blue) as data indicators only.
- D-15: Fixed top navigation bar on desktop (logo, nav links, user area). Stays visible during scroll.
- D-16: Mobile: fixed bottom tab bar with 4-5 key sections. Top nav becomes minimal header with logo only.
- D-17: shadcn/ui with full customization — all components, spacing scale, typography scale, animation tokens. Custom dark mode CSS variables.

### Claude's Discretion
- Specific color hex values for the dark palette (within the DraftKings premium direction)
- Typography choices (font families, scale)
- Specific shadcn/ui component customization details
- Build script implementation patterns
- Scoring config file format (JSON vs TypeScript const)
- League name creativity and team name generation approach
- Insider Trading Risk Score component weights and tier boundary exact values

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| DATA-01 | Build-time scripts fetch politician trade data from Alva Skills API (or pre-cached fallback) and output static JSON files | tsx-based Node scripts run as `prebuild` hook; Congress.gov API + Quiver Quantitative as fallback sources documented below |
| DATA-02 | Politician dataset includes 50-100+ members of Congress with disclosed stock trades, name, party, chamber, state, committees, photo URL, trading stats | Congress.gov API v3 `/v3/member` endpoint returns all these fields; 5,000 req/hr free |
| DATA-03 | Trade dataset includes ticker, company, sector, trade type, disclosure date, amount range, and calculated returns vs S&P 500 | Quiver Quantitative and Unusual Whales both provide this schema; S&P return calculation at build time against Yahoo Finance or Alpha Vantage |
| DATA-04 | Official Congressional portrait photos are validated and served for every politician — no placeholders | unitedstates/images GitHub CDN: `https://unitedstates.github.io/images/congress/450x550/{bioguideId}.jpg`; HTTP HEAD validation in build script; initials fallback for misses |
| DATA-05 | Committee assignment data included for each politician | Congress.gov API v3 `/v3/member/{bioguideId}` includes committee memberships |
| SCORE-01 | Canonical scoring function calculates fantasy points per trade (base points for beating/losing to S&P 500 + excess return bonus/penalty) | Pure TypeScript function design pattern; config-driven rules; documented below |
| SCORE-02 | Trade amount multiplier applies based on disclosed amount range (1x to 4x) | Part of scoring config; STOCK Act discloses ranges ($1k-$15k, $15k-$50k, $50k-$100k, $100k+) |
| SCORE-03 | Bonus points: Insider Timing (+15), Donor Darling (+10), Big Mover (+20), Bipartisan Bet (+25), Activity Bonus (+5/trade) | Implemented as bonus detector functions called within scoring engine |
| SCORE-04 | Multipliers: Committee Chair (1.5x), Leadership (1.3x) | Politician metadata fields used at score computation time |
| SCORE-05 | Negative events: Paper Hands (-15), Late Disclosure (-10), Wash Sale (-5) | Penalty detector functions in scoring engine |
| SCORE-06 | Scoring engine is pure TypeScript with no React dependencies, unit-testable | Module in `src/lib/scoring/` with no DOM or React imports; receives data, returns data |
| CORR-01 | Composite 0-100 score from donor overlap, suspicious timing, committee conflict, STOCK Act compliance, trade volume | Weighted composite formula; component weights at Claude's discretion |
| CORR-02 | Score maps to named tiers: Clean Record / Minor Concerns / Raised Eyebrows / Seriously Suspicious / Peak Swamp | Bell curve distribution for tier thresholds per D-08 |
| CORR-03 | Per-politician breakdown shows individual component scores | Scoring function returns both composite and per-component breakdown |
| DEMO-01 | 3 pre-built leagues with 8 teams each, pre-drafted with realistic rosters | Programmatic generation script using real politician data |
| DEMO-02 | 6 weeks of simulated matchup results based on actual trade data | Simulated weekly scoring from real trade data; time-windowed |
| DEMO-03 | User pre-assigned to team in one league for immediate exploration | localStorage seed data loaded at app startup |
| DEMO-04 | Salary cap pricing calculated from historical performance tiers (5 tiers + unranked) | Quintile bucketing of historical fantasy point totals |
| UI-01 | Dark mode default with specified color palette | shadcn/ui + next-themes; OKLCH CSS variables in `.dark` selector; documented below |
| UI-02 | Global navigation bar with logo, nav items, user avatar | shadcn/ui NavigationMenu + custom fixed positioning |
| UI-03 | Responsive layout — desktop multi-column, mobile stacked with bottom tab nav | Tailwind responsive prefixes; CSS Grid; custom bottom nav component |
</phase_requirements>

---

## Summary

Phase 1 establishes three parallel tracks: (1) a Node.js build pipeline that fetches real Congressional trading data and outputs static JSON, (2) a pure TypeScript scoring engine that computes fantasy points and Insider Trading Risk Scores at build time, and (3) a premium design system built on shadcn/ui + Tailwind CSS v4 with full dark mode CSS variable customization.

The most critical unknown going into this phase is the Alva Skills API. Research found **no public documentation for an Alva Skills API with Congressional trading data endpoints**. Alva (alva.ai) appears to focus on quantamental investing intelligence, not STOCK Act disclosure data. The planning must treat Alva integration as an investigation task and prepare fallback data sources. The three verified fallback options — Congress.gov API (free, 5k req/hr, official), Quiver Quantitative (tiered pricing, $10/mo for congressional data), and Unusual Whales (paid API, `/api/congress/recent-trades`) — all provide the required data schema.

Photo validation is solved: the `unitedstates/images` GitHub CDN provides portraits at predictable URLs using bioguide IDs with three size variants. Congress.gov API v3 also returns `depiction.imageUrl` directly in member endpoints. The build script should HTTP HEAD validate all URLs and fall back through: Congress.gov depiction URL → unitedstates/images 450x550 → unitedstates/images original → generated initials SVG.

The design system work is well-supported: shadcn/ui CLI v4, Tailwind CSS v4.2.2, and Next.js 16.2.1 are all compatible. Dark mode via next-themes 0.4.6 uses OKLCH CSS variables in the `.dark` CSS class. `suppressHydrationWarning` on `<html>` prevents hydration mismatch. With `output: 'export'` in `next.config.ts`, all data must be either baked into JSON files or fetched client-side — no Server Actions, no cookies, no ISR.

**Primary recommendation:** Bootstrap the project first with `npx create-next-app@16`, then immediately run `npx shadcn@latest init` before building any other infrastructure. This locks the design system foundation before any data or scoring work begins.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 16.2.1 | App framework + static export | `output: 'export'` mode; file-based routing for 50+ politician profiles; Turbopack default for fast HMR; confirmed current via npm |
| React | 19.2.4 | UI runtime | Bundled with Next.js 16 — do not install separately |
| TypeScript | 5.9.3 | Type safety | Scoring rules and data structures are deeply nested; prevents runtime bugs |
| Tailwind CSS | 4.2.2 | Styling | CSS-first config, no `tailwind.config.ts` needed, OKLCH color space, 100x faster incremental builds |
| shadcn/ui | latest (CLI v4) | Component library | Copy-owned components; Tailwind v4 + React 19 compatible; new-york style as default |
| next-themes | 0.4.6 | Dark mode | Prevents FOUC; integrates with shadcn/ui CSS variable system out of the box |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Zustand | 5.0.12 | Client state | Demo user session, active league, current user's team; persist middleware for localStorage |
| tsx | 4.21.0 | Build script execution | Run TypeScript data pipeline scripts directly without a separate compile step |
| TanStack Query | 5.95.1 | Data fetching | Client-side API calls during development/prototype validation only; Phase 1 data is static JSON |
| date-fns | 4.1.0 | Date formatting | Disclosure date parsing, week labels, trade timestamps |
| motion | 12.38.0 | Animations | Phase 1 scope: subtle nav hover states and card transitions only; full animations are Phase 5 |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Congress.gov API | ProPublica Congress API | ProPublica is unmaintained as of late 2024; Congress.gov is official LoC-maintained |
| Quiver Quantitative (trades) | Unusual Whales API | Both are paid; Quiver has free tier, more documented for historical data |
| tsx (build scripts) | ts-node | tsx is faster, zero config, better ESM support; ts-node requires tsconfig adjustments |
| unitedstates/images CDN | Bioguide direct scraping | CDN is stable, predictable, publicly documented; scraping bioguide.congress.gov would be fragile |

### Installation
```bash
# Bootstrap
npx create-next-app@16 fantasy-congress --typescript --tailwind --eslint --app --src-dir --import-alias="@/*"

# Design system
npx shadcn@latest init

# State management + data fetching
npm install zustand @tanstack/react-query

# Animations
npm install motion

# Utilities
npm install date-fns

# Build pipeline
npm install --save-dev tsx
```

**Version verification:** All versions above confirmed via `npm view [package] version` on 2026-03-23.

---

## Architecture Patterns

### Recommended Project Structure
```
fantasy-congress/
├── scripts/
│   ├── fetch-politicians.ts    # Calls Alva / fallback APIs, outputs politicians.json
│   ├── fetch-trades.ts         # Fetches STOCK Act trade data, computes returns
│   ├── score-all.ts            # Runs scoring engine over all trades, outputs scores
│   ├── generate-demo.ts        # Builds leagues.json, matchups.json, rosters.json
│   ├── validate-photos.ts      # HTTP HEAD checks all photo URLs
│   └── build-pipeline.ts       # Orchestrates all scripts in order
├── public/
│   └── data/
│       ├── politicians.json    # 50-100+ politicians with scores, photo URLs
│       ├── trades.json         # All trade records with computed returns
│       ├── leagues.json        # 3 demo leagues with teams and rosters
│       ├── matchups.json       # 6 weeks of matchup results per league
│       └── build-report.json   # Excluded trades, photo failures, stats
├── src/
│   ├── lib/
│   │   ├── scoring/
│   │   │   ├── engine.ts           # scorePolitician(), scoreAllTrades() — pure TS
│   │   │   ├── config.ts           # ScoringConfig type + default config object
│   │   │   ├── bonuses.ts          # detectInsiderTiming(), detectBigMover(), etc.
│   │   │   ├── penalties.ts        # detectPaperHands(), detectLateDisclosure(), etc.
│   │   │   └── insider-risk.ts     # computeInsiderRiskScore() — pure TS
│   │   ├── data/
│   │   │   ├── politicians.ts      # Type: Politician; loader: loadPoliticians()
│   │   │   ├── trades.ts           # Type: Trade; loader: loadTrades()
│   │   │   └── demo.ts             # Type: League, Matchup; demo data loaders
│   │   └── utils/
│   │       ├── photo.ts            # getPhotoUrl(), generateInitialsAvatar()
│   │       └── format.ts           # formatDate(), formatPoints(), formatMoney()
│   ├── components/
│   │   ├── ui/                 # shadcn/ui generated components (do not hand-edit)
│   │   ├── layout/
│   │   │   ├── nav-desktop.tsx     # Fixed top nav — desktop
│   │   │   ├── nav-mobile.tsx      # Fixed bottom tab bar — mobile
│   │   │   └── root-layout.tsx     # Combines desktop/mobile nav + ThemeProvider
│   │   └── design/
│   │       ├── politician-card.tsx # Reusable card: photo, name, party, stats, risk badge
│   │       ├── risk-badge.tsx      # Insider Trading Risk Score tier badge
│   │       └── stat-cell.tsx       # Numeric stat display with label
│   ├── styles/
│   │   └── globals.css         # Tailwind @import + @theme + :root + .dark variables
│   └── app/
│       └── layout.tsx          # Root layout with ThemeProvider
```

### Pattern 1: Build-Time Data Pipeline
**What:** TypeScript scripts in `scripts/` run as `prebuild` npm hook, call external APIs, write JSON to `public/data/`. Next.js static export then bundles these as static assets.
**When to use:** All data that is known at build time and doesn't change during a user session.
**Example:**
```typescript
// scripts/build-pipeline.ts
// Source: Next.js static export docs, nextjs.org/docs/app/guides/static-exports

import { execSync } from 'child_process'

async function main() {
  console.log('[1/4] Fetching politicians...')
  execSync('npx tsx scripts/fetch-politicians.ts', { stdio: 'inherit' })

  console.log('[2/4] Fetching trades...')
  execSync('npx tsx scripts/fetch-trades.ts', { stdio: 'inherit' })

  console.log('[3/4] Computing scores...')
  execSync('npx tsx scripts/score-all.ts', { stdio: 'inherit' })

  console.log('[4/4] Generating demo data...')
  execSync('npx tsx scripts/generate-demo.ts', { stdio: 'inherit' })

  console.log('Build pipeline complete.')
}

main().catch((err) => { console.error(err); process.exit(1) })
```
```json
// package.json
{
  "scripts": {
    "prebuild": "npx tsx scripts/build-pipeline.ts",
    "build": "next build",
    "fetch-data": "npx tsx scripts/build-pipeline.ts"
  }
}
```

### Pattern 2: Pure TypeScript Scoring Engine
**What:** All scoring logic lives in `src/lib/scoring/` as pure functions. Receives data objects, returns score objects. No React imports, no DOM, no side effects. Callable from both build scripts and browser.
**When to use:** Any computation that must be deterministic and unit-testable.
**Example:**
```typescript
// src/lib/scoring/config.ts
export interface ScoringConfig {
  basePointsOutperform: number      // e.g. 10 — beat S&P
  basePointsUnderperform: number    // e.g. -5 — lost to S&P
  excessReturnMultiplier: number    // points per % excess return
  amountMultipliers: {
    tier1: number  // $1k-$15k: 1x
    tier2: number  // $15k-$50k: 1.5x
    tier3: number  // $50k-$100k: 2x
    tier4: number  // $100k+: 4x
  }
  bonuses: {
    insiderTiming: number    // +15
    donorDarling: number     // +10
    bigMover: number         // +20
    bipartisanBet: number    // +25
    activityBonus: number    // +5 per trade
  }
  penalties: {
    paperHands: number       // -15
    lateDisclosure: number   // -10
    washSale: number         // -5
  }
  multipliers: {
    committeeChair: number   // 1.5x
    leadership: number       // 1.3x
  }
}

export const DEFAULT_SCORING_CONFIG: ScoringConfig = {
  basePointsOutperform: 10,
  basePointsUnderperform: -5,
  excessReturnMultiplier: 2,
  amountMultipliers: { tier1: 1, tier2: 1.5, tier3: 2, tier4: 4 },
  bonuses: { insiderTiming: 15, donorDarling: 10, bigMover: 20, bipartisanBet: 25, activityBonus: 5 },
  penalties: { paperHands: -15, lateDisclosure: -10, washSale: -5 },
  multipliers: { committeeChair: 1.5, leadership: 1.3 }
}
```

### Pattern 3: Static JSON Data Loader
**What:** Each data file in `public/data/` has a corresponding TypeScript type and loader function in `src/lib/data/`. Browser fetches JSON on component mount via TanStack Query.
**When to use:** Any data that was baked in at build time.
**Example:**
```typescript
// src/lib/data/politicians.ts
export interface Politician {
  bioguideId: string
  name: string
  party: 'D' | 'R' | 'I'
  chamber: 'senate' | 'house'
  state: string
  committees: string[]
  photoUrl: string
  isCommitteeChair: boolean
  isLeadership: boolean
  seasonPoints: number
  weeklyPoints: number[]
  insiderRiskScore: number         // 0-100
  insiderRiskTier: InsiderRiskTier
  salaryCap: number
}

export type InsiderRiskTier =
  | 'clean-record'       // 0-14
  | 'minor-concerns'     // 15-34
  | 'raised-eyebrows'    // 35-59
  | 'seriously-suspicious' // 60-84
  | 'peak-swamp'         // 85-100
```

### Pattern 4: Dark Mode CSS Variables (Tailwind v4)
**What:** All theme colors defined as OKLCH CSS variables in `globals.css`. `.dark` class (set by next-themes on `<html>`) overrides to dark palette. Tailwind utility classes use `var(--color-name)` references via `@theme inline`.
**When to use:** The only correct pattern for dark-first theming in Tailwind v4 + shadcn/ui.
**Example:**
```css
/* src/styles/globals.css */
/* Source: ui.shadcn.com/docs/theming + tailwindcss.com/docs/dark-mode */
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-border: var(--border);
  --color-ring: var(--ring);
  /* Party colors */
  --color-party-dem: var(--party-dem);
  --color-party-rep: var(--party-rep);
  /* Risk tier colors */
  --color-risk-clean: var(--risk-clean);
  --color-risk-minor: var(--risk-minor);
  --color-risk-raised: var(--risk-raised);
  --color-risk-suspicious: var(--risk-suspicious);
  --color-risk-swamp: var(--risk-swamp);
}

:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  /* ... light mode vars */
}

.dark {
  /* Near-black primary background */
  --background: oklch(0.085 0.008 265);
  /* Slightly lighter card surfaces */
  --card: oklch(0.115 0.008 265);
  /* Near-white text */
  --foreground: oklch(0.97 0 0);
  --card-foreground: oklch(0.95 0 0);
  /* Gold/amber accent */
  --primary: oklch(0.78 0.165 85);
  --primary-foreground: oklch(0.1 0 0);
  /* Muted text */
  --muted: oklch(0.165 0.008 265);
  --muted-foreground: oklch(0.62 0.01 265);
  /* Borders */
  --border: oklch(0.22 0.008 265);
  --ring: oklch(0.78 0.165 85);
  /* Data-only party colors */
  --party-dem: oklch(0.55 0.2 260);    /* blue */
  --party-rep: oklch(0.55 0.22 25);    /* red */
  /* Risk tier colors */
  --risk-clean: oklch(0.65 0.18 145);        /* green */
  --risk-minor: oklch(0.72 0.19 95);         /* yellow-green */
  --risk-raised: oklch(0.75 0.2 60);         /* amber */
  --risk-suspicious: oklch(0.7 0.22 38);     /* orange */
  --risk-swamp: oklch(0.6 0.23 25);          /* red */
}
```

### Anti-Patterns to Avoid
- **Hardcoded scoring values in engine code:** All point values must live in `ScoringConfig`. Hardcoding makes A/B testing and tuning impossible.
- **Using `next/image` without `unoptimized: true`:** Static export mode throws build errors with remote image URLs unless image optimization is disabled.
- **Importing scoring engine from React components at SSR:** The engine is safe for SSR (no DOM), but any component importing it must be careful not to pull in React-specific hooks as indirect dependencies.
- **Server Actions in static export:** `output: 'export'` does not support Server Actions. All mutations must happen client-side via state.
- **Dynamic routes without `generateStaticParams()`:** Static export requires all dynamic segments to be statically enumerable at build time.
- **Calling localStorage directly outside useEffect:** Next.js server-renders components before hydration; `localStorage` is undefined on server. Always guard with `typeof window !== 'undefined'` or `useEffect`.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Dark mode toggle with persistence | Custom CSS class toggler + localStorage | next-themes | Handles FOUC, SSR hydration mismatch, system preference detection, persistence |
| UI component primitives | Custom modal, dropdown, tooltip, dialog | shadcn/ui | Accessibility (ARIA, keyboard nav, focus management) is non-trivial; Radix primitives are battle-tested |
| TypeScript script execution | Custom webpack/babel build setup for scripts | `tsx` | Zero-config TypeScript execution; faster than ts-node |
| Date arithmetic | Custom date math | date-fns | DST edge cases, fiscal year week calculations, disclosure lag math |
| Tailwind class merge conflicts | Manual class deduplication | `cn()` (clsx + tailwind-merge) | shadcn/ui ships this helper; Tailwind v4 `size-*` utilities work correctly with it |
| Photo URL fallback chain | Complex try/catch fetch | Build-time validation script | Catch broken images at build time, not at render time; never ship broken image URLs |

**Key insight:** The photo fallback chain is the highest-risk hand-roll area. Attempting lazy fallback at render time (onerror handlers) creates flicker and deferred FOUC. Validating and baking working URLs into `politicians.json` at build time eliminates the problem entirely.

---

## Common Pitfalls

### Pitfall 1: Alva API Unknown Shape
**What goes wrong:** The build pipeline depends on Alva Skills API, but no public documentation confirms the endpoints, auth mechanism, rate limits, or response shape for Congressional trading data.
**Why it happens:** Alva.ai and alva.xyz appear to be separate products. Alva's public-facing identity is a "quantamental investing AI agent" focused on equities and crypto — not STOCK Act PTRF data.
**How to avoid:** Make Wave 0 of planning include an Alva API investigation task. Build the data scripts with a feature flag: `ALVA_AVAILABLE=true/false`. When false, fall back to Congress.gov + Quiver Quantitative. The pipeline interface (output schema) stays identical regardless of source.
**Warning signs:** `ALVA_AVAILABLE` is never set to true by the end of Wave 1 — pivot to fallback sources immediately.

### Pitfall 2: Static Export + Image Optimization Conflict
**What goes wrong:** `next/image` with remote URLs throws at build time with `output: 'export'` unless `images: { unoptimized: true }` is set.
**Why it happens:** Next.js Image Optimization requires a server-side image transformation worker. Static export has no server.
**How to avoid:** Add to `next.config.ts` immediately during project bootstrap:
```typescript
const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
}
```
**Warning signs:** Build errors mentioning `next/image` loader or image optimization.

### Pitfall 3: Dynamic Routes Break Static Export
**What goes wrong:** Politician profile pages use dynamic segments (`/politician/[bioguideId]`). Without `generateStaticParams()`, `next build` throws.
**Why it happens:** Static export must enumerate all pages at build time. Dynamic routes with unknown parameters can't be pre-rendered without an explicit list.
**How to avoid:** Phase 1 doesn't need profile pages, but the project structure should include `generateStaticParams()` stubs for any `[slug]` routes created in Phase 2+. The build pipeline output (`politicians.json`) provides the required ID list.
**Warning signs:** Build error: "Page requires `generateStaticParams`."

### Pitfall 4: Zustand Hydration Mismatch
**What goes wrong:** Zustand `persist` middleware reads from localStorage on mount, causing server HTML (no localStorage) to differ from client HTML (has localStorage). React warns about hydration mismatch.
**Why it happens:** Next.js pre-renders components on the server where `localStorage` is undefined.
**How to avoid:** Use the `skipHydration: true` option in Zustand persist config, then manually call `useStore.persist.rehydrate()` inside a `useEffect`. Pattern:
```typescript
// Client component only
useEffect(() => {
  useAppStore.persist.rehydrate()
}, [])
```
**Warning signs:** React console warning: "Text content does not match server-rendered HTML."

### Pitfall 5: Scoring Engine Drift Between Build and Runtime
**What goes wrong:** Scores in `politicians.json` (computed at build) don't match scores shown in UI components (computed at runtime) because the config object or logic diverged.
**Why it happens:** If anyone imports `DEFAULT_SCORING_CONFIG` and mutates it, or duplicates scoring logic in a component.
**How to avoid:** Per D-06, scores are **only** computed at build time. UI components read pre-computed scores from JSON — they never call `scorePolitician()` directly. The scoring engine module should not be imported by any React component in Phase 1.
**Warning signs:** Score numbers in UI differ from values in `public/data/politicians.json`.

### Pitfall 6: Photo Validation at Render Time Instead of Build Time
**What goes wrong:** Using `onerror` fallback chain in `<img>` tags causes visible flicker when primary photo fails — user sees broken image briefly, then initials avatar.
**Why it happens:** Render-time fallback is lazy; validation is deferred to when the browser requests the image.
**How to avoid:** `validate-photos.ts` script runs HTTP HEAD on every URL during `prebuild`, stores the working URL in `politicians.json`. Component always renders a known-good URL. Initials SVGs are pre-generated as data URIs during build.
**Warning signs:** Broken image icon visible on any politician card during load.

---

## Code Examples

Verified patterns from official sources:

### Next.js Static Export Configuration
```typescript
// next.config.ts
// Source: nextjs.org/docs/app/guides/static-exports (version 16.2.1, updated 2026-03-03)
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },  // Required for remote politician portrait URLs
  trailingSlash: false,
}

export default nextConfig
```

### shadcn/ui ThemeProvider Setup (Static Export Safe)
```typescript
// src/app/layout.tsx
// Source: ui.shadcn.com/docs/dark-mode
import { ThemeProvider } from 'next-themes'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

### Politician Photo URL Chain (Build Script)
```typescript
// scripts/validate-photos.ts
// Source: github.com/unitedstates/images (confirmed URL format)

async function validatePhotoUrl(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(5000) })
    return res.ok
  } catch {
    return false
  }
}

function getUnitedStatesImageUrl(bioguideId: string): string {
  return `https://unitedstates.github.io/images/congress/450x550/${bioguideId}.jpg`
}

function getCongressGovImageUrl(depictionUrl: string | undefined): string | null {
  return depictionUrl ?? null
}

// Returns first working URL from chain, or generated initials SVG
async function resolvePhotoUrl(politician: RawPolitician): Promise<string> {
  const candidates = [
    politician.depiction?.imageUrl,                           // Congress.gov official
    getUnitedStatesImageUrl(politician.bioguideId),           // unitedstates/images CDN
    `https://unitedstates.github.io/images/congress/original/${politician.bioguideId}.jpg`,
  ].filter(Boolean) as string[]

  for (const url of candidates) {
    if (await validatePhotoUrl(url)) return url
  }

  // Fallback: return data URI of generated initials avatar
  return generateInitialsSvg(politician.name, politician.party)
}
```

### Scoring Engine (Pure TypeScript)
```typescript
// src/lib/scoring/engine.ts
// Pattern: pure function, no React, no DOM

import type { Trade } from '../data/trades'
import type { Politician } from '../data/politicians'
import { DEFAULT_SCORING_CONFIG, type ScoringConfig } from './config'
import { detectBonuses } from './bonuses'
import { detectPenalties } from './penalties'

export interface TradeScore {
  tradeId: string
  basePoints: number
  bonusPoints: number
  penaltyPoints: number
  amountMultiplier: number
  positionMultiplier: number
  totalPoints: number
  bonuses: string[]
  penalties: string[]
}

export interface PoliticianScoreBreakdown {
  politicianId: string
  totalPoints: number
  tradeScores: TradeScore[]
  weeklyTotals: number[]
}

export function scoreTrade(
  trade: Trade,
  politician: Politician,
  config: ScoringConfig = DEFAULT_SCORING_CONFIG
): TradeScore {
  // Deterministic: same input always produces same output
  const basePoints = trade.excessReturn > 0
    ? config.basePointsOutperform + (trade.excessReturn * config.excessReturnMultiplier)
    : config.basePointsUnderperform + (trade.excessReturn * config.excessReturnMultiplier)

  const amountMultiplier = getAmountMultiplier(trade.amountRange, config)
  const positionMultiplier = getPositionMultiplier(politician, config)
  const { bonuses, bonusPoints } = detectBonuses(trade, politician, config)
  const { penalties, penaltyPoints } = detectPenalties(trade, politician, config)

  const totalPoints = (basePoints * amountMultiplier * positionMultiplier) + bonusPoints + penaltyPoints

  return { tradeId: trade.id, basePoints, bonusPoints, penaltyPoints,
           amountMultiplier, positionMultiplier, totalPoints, bonuses, penalties }
}
```

### Insider Trading Risk Score
```typescript
// src/lib/scoring/insider-risk.ts

export interface InsiderRiskComponents {
  donorOverlap: number          // 0-100: campaign donor vs traded company overlap
  suspiciousTiming: number      // 0-100: trades proximate to legislation/committee action
  committeeConflict: number     // 0-100: trades in sectors within committee oversight
  stockActCompliance: number    // 0-100: late disclosures, violations (inverted — higher = worse)
  tradeVolume: number           // 0-100: normalized trade frequency and dollar volume
}

// Component weights — at Claude's discretion; these are reasonable starting values
const WEIGHTS = {
  donorOverlap: 0.20,
  suspiciousTiming: 0.30,
  committeeConflict: 0.25,
  stockActCompliance: 0.15,
  tradeVolume: 0.10,
}

export function computeInsiderRiskScore(components: InsiderRiskComponents): number {
  const raw = Object.entries(WEIGHTS).reduce((acc, [key, weight]) => {
    return acc + (components[key as keyof InsiderRiskComponents] * weight)
  }, 0)
  // Clamp to 0-100, round to integer
  return Math.min(100, Math.max(0, Math.round(raw)))
}

export function getRiskTier(score: number): InsiderRiskTier {
  if (score < 15) return 'clean-record'
  if (score < 35) return 'minor-concerns'
  if (score < 60) return 'raised-eyebrows'
  if (score < 85) return 'seriously-suspicious'
  return 'peak-swamp'
}
```

---

## Data Sources: Detailed Findings

### Alva Skills API (Status: UNKNOWN — Highest Risk Item)
Research found **no public documentation** for Alva Skills API congressional trading endpoints.

- alva.ai describes itself as "Quantamental Investing AI Agent" with skills installed via `npx skills add https://github.com/alva-ai/skills`
- No congressional/STOCK Act data features found in public docs
- The platform focuses on equity analytics, not disclosure data
- **Action required:** Investigate actual Alva API access in Wave 0. Build data scripts with `ALVA_AVAILABLE` feature flag. If Alva provides a custom skill endpoint, it will likely return similar schema to the verified fallbacks below.

### Congress.gov API (Fallback 1 — HIGH confidence)
- **Auth:** Free API key from api.congress.gov (Data.gov signup)
- **Rate limits:** 5,000 requests/hour
- **Member endpoint:** `GET /v3/member` — returns bioguideId, name, party, chamber, state, depiction.imageUrl, currentMember
- **Photo URLs:** `depiction.imageUrl` format: `https://www.congress.gov/img/member/{bioguideId}_200.jpg`
- **Committee data:** Available via `/v3/member/{bioguideId}/committee-assignment`
- **Limitation:** Does NOT include trade/disclosure data — covers member metadata only

### Quiver Quantitative (Fallback 2 — MEDIUM confidence)
- **Auth:** API key, paid (Hobbyist $10/mo for congressional data)
- **Endpoint:** `quiver.congress_trading()` — returns ticker, politician, party, transaction type, amount range, date
- **Coverage:** 1,800+ US equities, data from January 2016, daily frequency
- **Rate limits:** Not publicly documented
- **Source:** LibraryOfCongress scraping of Periodic Transaction Reports

### Unusual Whales (Fallback 3 — MEDIUM confidence)
- **Auth:** Bearer token, paid API
- **Endpoint:** `GET /api/congress/recent-trades`
- **Required headers:** `Authorization: Bearer {token}`, `UW-CLIENT-API-ID: 100001`
- **Limitation:** Response schema fields not confirmed — only endpoint name found in docs

### unitedstates/images (Photo Source — HIGH confidence)
- **URL format:** `https://unitedstates.github.io/images/congress/{size}/{bioguideId}.jpg`
- **Sizes:** `original` (~675x825), `450x550`, `225x275`
- **Use 450x550** for politician cards (optimal size/quality tradeoff)
- **Source:** Government Printing Office Member Guide, public domain
- **Coverage:** All members with official portraits; gaps exist for very recent members

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `tailwind.config.js` + `tailwind.config.ts` | CSS-first config in `globals.css` via `@theme` | Tailwind v4.0 (Jan 2025) | No config file needed; remove if accidentally created |
| HSL color values | OKLCH color values in shadcn/ui | shadcn/ui v4 (2025) | More perceptually uniform; dark mode colors look better |
| `import { ... } from 'framer-motion'` | `import { ... } from 'motion/react'` | Motion v11 rebranding | Package renamed; old import path throws module not found |
| `next export` CLI command | `output: 'export'` in next.config.ts | Next.js v14 | CLI command removed entirely |
| `npx shadcn-ui@latest` | `npx shadcn@latest` | shadcn/ui 2025 rebrand | Old package name deprecated |
| `tailwindcss-animate` | `tw-animate-css` | shadcn/ui v4 | Former package deprecated; new package is drop-in replacement |
| `toast` component (shadcn) | `sonner` component | shadcn/ui v4 | `toast` deprecated in shadcn v4; use `sonner` for notifications |
| `default` shadcn style | `new-york` style | shadcn/ui v4 | `default` style deprecated; new projects use `new-york` |
| `forwardRef` wrapped components | Direct components with adjusted types | React 19 + shadcn/ui v4 | forwardRef removed from shadcn components; use ref prop directly |

**Deprecated/outdated:**
- `next export` command: removed in Next.js v14, use `output: 'export'` in config
- `pages/` router data fetching (`getStaticProps`, `getServerSideProps`): use App Router patterns
- Moment.js: unmaintained since 2020, 67kb gzipped — use date-fns

---

## Open Questions

1. **Alva Skills API Shape and Availability**
   - What we know: Alva is a real product at alva.ai with a skills system; no public docs for congressional trading endpoints
   - What's unclear: Whether Alva has a private/internal congressional data skill; what the auth mechanism is; whether it's REST or something else
   - Recommendation: Wave 0 task should be "investigate Alva API access" with a hard deadline; if not resolved by end of Wave 0, activate fallback sources (Congress.gov + Quiver Quantitative)

2. **S&P 500 Return Calculation for Trade Scoring**
   - What we know: SCORE-01 requires comparing trade returns vs S&P 500 benchmark over the same period
   - What's unclear: Which API to use for historical S&P 500 data at build time (Yahoo Finance, Alpha Vantage, Quiver's built-in benchmark field)
   - Recommendation: Quiver Quantitative already computes this and returns cumulative return with benchmark; if using Quiver, leverage their pre-computed field. If using raw STOCK Act data, use Alpha Vantage or Yahoo Finance for historical OHLC.

3. **FEC Donor Overlap Data for Insider Risk Score (CORR-01)**
   - What we know: CORR-01 requires donor overlap component; FEC has public API at api.open.fec.gov
   - What's unclear: Rate limits and data freshness for FEC API; matching accuracy between campaign donation records and traded company names
   - Recommendation: FEC API is free (1,000 req/day, higher with key); implement as best-effort — missing donor data should zero out that component, not break scoring.

---

## Sources

### Primary (HIGH confidence)
- `nextjs.org/docs/app/guides/static-exports` — Static export features and unsupported features; version 16.2.1, updated 2026-03-03
- `github.com/unitedstates/images` — Congressional photo URL format: `https://unitedstates.github.io/images/congress/{size}/{bioguideId}.jpg`
- `github.com/LibraryOfCongress/api.congress.gov/blob/main/Documentation/MemberEndpoint.md` — Member endpoint fields, photo URL format, authentication
- `ui.shadcn.com/docs/theming` — CSS variable names, OKLCH values, `.dark` selector pattern
- `ui.shadcn.com/docs/tailwind-v4` — Tailwind v4 changes: tw-animate-css, new-york style, OKLCH migration
- `ui.shadcn.com/docs/installation/next` — `npx shadcn@latest init -t next` command
- npm registry — All package versions confirmed via `npm view [package] version` on 2026-03-23

### Secondary (MEDIUM confidence)
- `unusualwhales.com/skill.md` — Endpoint name `/api/congress/recent-trades`, auth headers confirmed; full schema unconfirmed
- `quiverquant.com` + QuantConnect docs — Congress trading dataset confirmed (1,800 equities, 2016+, daily); pricing confirmed ($10/mo Hobbyist)
- WebSearch results on Next.js 16 static export + Tailwind v4 + shadcn dark mode — multiple community tutorials corroborate patterns documented here

### Tertiary (LOW confidence — flagged for validation)
- Alva Skills API congressional data capability — could not be verified; treat as unknown until investigated
- FEC API for donor overlap — endpoint exists (`api.open.fec.gov`), rate limits and matching strategy unverified
- Unusual Whales response schema fields — endpoint confirmed, field names unconfirmed

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all versions verified via npm registry 2026-03-23
- Architecture patterns: HIGH — Next.js static export behavior confirmed from official docs; shadcn/ui CSS variable patterns from official theming docs
- Data pipeline (Alva): LOW — Alva API shape is unknown; documented fallbacks are HIGH confidence
- Data pipeline (fallbacks): MEDIUM-HIGH — Congress.gov API is official LoC-maintained; Quiver/Unusual Whales are widely used but paid
- Photo validation: HIGH — unitedstates/images URL format confirmed from GitHub repo
- Pitfalls: HIGH — static export constraints directly from Next.js 16 docs; hydration issues from multiple verified community sources

**Research date:** 2026-03-23
**Valid until:** 2026-04-23 for stack versions (check npm before coding); 2026-03-30 for Alva API status (investigate immediately)
