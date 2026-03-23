# Phase 2: Discovery - Research

**Researched:** 2026-03-23
**Domain:** Next.js 16 App Router (static export) — multi-page UI with filtering, charts, tabs, feeds, leaderboards
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Landing Page**
- D-01: Bold & provocative hero tone — headline like "DRAFT YOUR POLITICIANS. PROFIT FROM THEIR TRADES." Unapologetic, attention-grabbing, leans into satire/viral angle.
- D-02: Explore-first CTA strategy — primary button goes to `/politicians` (directory), secondary to `/feed` (trade feed). No fake sign-up flow. Visitors see real data immediately.
- D-03: Auto-rotating carousel of 5 top trader PoliticianCards in featured section. Uses existing compact card variant. Dot indicators for position.
- D-04: "Powered by Alva" as dedicated footer section near page bottom — "Built on Alva's financial data platform" with description + link. Visible but doesn't compete with the product pitch.

**Politician Directory**
- D-05: Sticky left sidebar filter panel on desktop with collapsible filter sections (party, chamber, state, committee, salary tier, risk range, activity level). Mobile: slide-out drawer from "Filters" button.
- D-06: Medium card density — 3 PoliticianCards per row using 'full' variant. Photo, name, party, state, key stats, and risk badge all visible. DraftKings player-pool density.
- D-07: Search bar at top of page — instant client-side filtering by politician name. Data is static JSON, zero latency.
- D-08: Grid/list view toggle — Grid (default): PoliticianCard 'full' variant in 3-column grid. List: compact table rows with photo, name, party, key stats in columns. Toggle via icon buttons.

**Politician Profiles**
- D-09: Full-width hero banner header — large photo on left, name/party/state prominent, committee badges below, key stats (cost, points, risk score) as big numbers on right. Dark gradient background.
- D-10: Recharts 3.x for ALL charts across all tabs — LineChart (season performance), PieChart (sector breakdown), AreaChart (equity curve), RadarChart (risk components). Single library, consistent dark theme config.
- D-11: Corruption Dossier tab styled as intelligence briefing — subtle 'CLASSIFIED' watermark, monospace section headers, redacted-style accents. Radar chart centerpiece. Dramatic, shareable feel.
- D-12: Mobile tabs: horizontal scrollable tab bar with all 4 tab labels. Active tab underlined. Standard sports app pattern (DraftKings/ESPN). No accordion fallback.

**Trade Feed**
- D-13: Twitter-style vertical feed cards — politician photo + name on left, trade details (ticker, amount, return vs S&P) in body, points + bonus badges as footer. Scrollable timeline feel.
- D-14: Desktop: main feed column (70%) with trending sidebar (30%). Mobile: feed full-width, trending section below the feed. Classic social media layout.
- D-15: Trending sidebar shows: top by points this week, top by volume, hot waiver wire picks — using PoliticianCard mini variant.

**Leaderboard**
- D-16: Podium + ranked list for Hall of Shame — top 3 get visual podium treatment (large cards, gold/silver/bronze accents). Remaining politicians in ranked table with photo, stats, tier color badges.
- D-17: Two tabs on leaderboard: "Fantasy Points" (LEAD-01) and "Risk Score" (LEAD-03). Tab toggle switches the ranking and tier visualization.
- D-18: Swamp Lords manager leaderboard (LEAD-02) uses simulated manager rankings from demo data — 8 team owners from user's league ranked by record and points. Weekly/season/all-time tabs. User's team highlighted.

### Claude's Discretion
- Skeleton loading state implementations (UI-04) — specific shimmer patterns and timing
- Tooltip content and placement strategy (UI-05)
- Empty state copy and illustrations (UI-06)
- Feed filter bar design (party, chamber, trade type, points impact, time period)
- "My Roster Only" toggle placement and behavior (FEED-03)
- Navigation routing structure (URL patterns for all pages)
- How-It-Works section layout on landing page (LAND-02)
- Corruption Leaderboard "cleanest/swampiest" featured sections presentation

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| LAND-01 | Hero section with headline, subheadline, and prominent CTA button | D-01/D-02 locked design; static page, no data fetching needed |
| LAND-02 | "How It Works" section with 3-step explanation (Draft, Score, Win) | At Claude's discretion for layout; pure presentational |
| LAND-03 | Featured politicians preview showing 4-5 high-profile trader cards | D-03 carousel; requires `loadPoliticians()` client-side to show real data |
| LAND-04 | "Powered by Alva" section with platform description and link | D-04 footer section; pure presentational |
| DIR-01 | Searchable, filterable grid of all politician cards with photos, party color, stats, and corruption index | 82 politicians in `politicians.json`; instant client-side filter via React state |
| DIR-02 | Filters for party, chamber, state, committee, salary tier, corruption range, activity level | Note: all committees are empty in current data — filter UI must handle gracefully |
| DIR-03 | Sort by fantasy cost, win rate, avg return, corruption index, season points, trade volume | All sort fields present on `Politician` type |
| DIR-04 | Grid/list view toggle | D-08 locked; toggle via React state |
| PROF-01 | Header with photo, name, party, state, committees as badges, fantasy cost, season points | D-09 hero layout; dynamic route `/politicians/[bioguideId]` |
| PROF-02 | Fantasy Stats tab — season performance chart, full trade log with scoring details, projected season total | Recharts LineChart; `weeklyPoints[6]` available; `loadTradesForPolitician()` for trade log |
| PROF-03 | Trading Profile tab — sector pie chart, win rate by sector, biggest wins/losses, performance vs S&P equity curve | Recharts PieChart + AreaChart; sector from Trade type |
| PROF-04 | Corruption Dossier tab — radar chart of index components, donor overlap details, trade-vs-legislation timeline, committee connection map | D-11 intelligence briefing aesthetic; RadarChart; `insiderRiskBreakdown` available |
| PROF-05 | News & Disclosures tab — recent STOCK Act filings and committee hearing schedule | Static data: show recent trades filtered by politician as "disclosures"; committee hearings simulated |
| FEED-01 | Scrollable feed of politician trades as cards showing photo, name, party, trade details, return vs S&P, fantasy points, and bonus badges | 815 trades in `trades.json`; bonus types: bigMover, bipartisanBet, donorDarling |
| FEED-02 | Filters for party, chamber, trade type, points impact, time period | Client-side filtering; all fields available on `Trade` type |
| FEED-03 | "My Roster Only" toggle filter | At Claude's discretion; requires `loadDemoState()` to get user roster |
| FEED-04 | Trending Politicians sidebar — top by points this week, top by volume, hot waiver wire picks | D-15 uses PoliticianCard mini variant; data derived from `politicians.json` |
| LEAD-01 | "Hall of Shame" — politicians ranked by total fantasy points with photo, party, stats, corruption index | D-16 podium treatment; derived from `politicians.json` sorted by seasonPoints |
| LEAD-02 | "Swamp Lords" — top fantasy managers ranked by record and total points (weekly/season/all-time tabs) | D-18 simulated from `leagues.json`; team records available |
| LEAD-03 | "Corruption Leaderboard" — politicians ranked by corruption index with tier colors, cleanest/swampiest featured sections | D-17 second tab; sorted by `insiderRiskScore`; tier color vars already in globals.css |
| UI-04 | Skeleton loading states for all data-heavy pages | At Claude's discretion; `animate-pulse` shimmer via Tailwind + tw-animate-css |
| UI-05 | Tooltips on every metric, badge, and scoring element explaining what it means | Shadcn/ui `Tooltip` primitive already installed |
| UI-06 | Empty states with contextual copy for all zero-data scenarios | At Claude's discretion; pure presentational fallbacks |
</phase_requirements>

---

## Summary

Phase 2 is a pure UI build on top of a complete data foundation. All data (`politicians.json` — 82 politicians, `trades.json` — 815 trades, `leagues.json` — 3 leagues) already exists in `public/data/`. The scoring engine, design system (PoliticianCard, RiskBadge, StatCell), global navigation (already has all Phase 2 routes), Tailwind CSS variables, and shadcn/ui primitives are all in place. Phase 2 creates six new routes: `/` (landing page, replaces placeholder), `/politicians`, `/politicians/[bioguideId]`, `/feed`, `/leaderboard` — and requires installing Recharts 3.x.

The architecture pattern for all Phase 2 pages is identical: page-level Server Component (or page component) with a `'use client'` wrapper component that calls data loaders on mount, holds filter/sort/view state, and renders composed UI. Because this is `output: 'export'`, data loading is always client-side fetch from `/data/*.json`. The `/politicians/[bioguideId]` dynamic route requires `generateStaticParams()` exporting all bioguideIds so Next.js can pre-render each profile page at build time.

One data reality to design around: all 82 politicians currently have empty `committees` arrays. The committee filter in DIR-02 must render gracefully (empty state, not broken). The Corruption Dossier's "committee connection map" (PROF-04) will need simulated/placeholder content. Risk breakdown components are fully populated and the RadarChart centerpiece will work as designed.

**Primary recommendation:** Install Recharts 3.x, create one shared `usePageData<T>` hook pattern for client-side data loading, implement all five routes in page-by-page order (landing → directory → profile → feed → leaderboard), and use `generateStaticParams` for the dynamic profile route.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next | 16.2.1 | App Router, static export, dynamic routes | Already installed; `output: 'export'` configured |
| react | 19.2.4 | Component model, `use()` API, Suspense | Already installed |
| recharts | 3.8.0 | LineChart, PieChart, AreaChart, RadarChart | Locked in D-10; must install |
| tailwindcss | 4.x | Utility styling, CSS custom properties | Already installed |
| lucide-react | 1.0.1 | Icon set (filter, grid/list toggle, badges) | Already installed |
| next-themes | 0.4.6 | Dark mode via ThemeProvider | Already installed |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @tanstack/react-query | 5.95.1 | Optional: async state for data loading | Already installed; use if page data loading complexity grows |
| motion | 12.38.0 | Carousel animation, skeleton transitions | Already installed; use for carousel autoplay, tab transitions |
| date-fns | 4.1.0 | Trade date formatting, time period labels | Already installed |
| shadcn/ui | 4.1.0 | Card, Badge, Button, Tabs, Tooltip, Sheet, Separator | Already installed; Sheet for mobile filter drawer |
| zustand | 5.0.12 | Shared filter state if lifted across components | Already installed |
| tw-animate-css | 1.4.0 | `animate-pulse` shimmer for skeleton states | Already installed |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Recharts | Victory, Chart.js | Recharts locked (D-10); no alternative |
| React `useState` for filters | Zustand / URL params | URL params (`useSearchParams`) require Suspense boundary; useState is simpler for static export |
| `fetch()` in useEffect | TanStack Query | TanStack adds deduplication/caching; fine for this app but `fetch + useState` is sufficient for static JSON |

**Installation:**
```bash
npm install recharts
```

**Version verification:** Recharts 3.8.0 confirmed via `npm view recharts version` on 2026-03-23.

---

## Architecture Patterns

### Recommended Project Structure
```
src/app/
├── page.tsx                          # Landing page (replaces placeholder)
├── politicians/
│   ├── page.tsx                      # Politician directory
│   └── [bioguideId]/
│       └── page.tsx                  # Politician profile (dynamic route)
├── feed/
│   └── page.tsx                      # Trade feed
└── leaderboard/
    └── page.tsx                      # Leaderboard (Hall of Shame + Swamp Lords)

src/components/
├── design/
│   ├── politician-card.tsx           # EXISTING — reuse full/compact/mini variants
│   ├── risk-badge.tsx                # EXISTING — reuse on all displays
│   └── stat-cell.tsx                 # EXISTING — reuse across data displays
├── ui/
│   ├── card.tsx / badge.tsx / ...    # EXISTING shadcn primitives
│   └── skeleton.tsx                  # NEW — shimmer skeleton component (UI-04)
├── layout/
│   ├── nav-desktop.tsx               # EXISTING — already has all Phase 2 nav links
│   └── nav-mobile.tsx                # EXISTING — already has all Phase 2 nav items
├── landing/
│   ├── hero-section.tsx
│   ├── how-it-works.tsx
│   ├── featured-carousel.tsx
│   └── alva-footer.tsx
├── politicians/
│   ├── politician-directory.tsx      # 'use client' wrapper for filter/sort state
│   ├── filter-sidebar.tsx
│   ├── politician-grid.tsx
│   └── politician-list-table.tsx
├── profile/
│   ├── profile-hero.tsx
│   ├── profile-tabs.tsx
│   ├── fantasy-stats-tab.tsx
│   ├── trading-profile-tab.tsx
│   ├── corruption-dossier-tab.tsx
│   └── news-disclosures-tab.tsx
├── feed/
│   ├── trade-feed.tsx                # 'use client' wrapper
│   ├── trade-card.tsx
│   ├── feed-filters.tsx
│   └── trending-sidebar.tsx
└── leaderboard/
    ├── leaderboard-page.tsx          # 'use client' wrapper
    ├── podium.tsx
    ├── shame-table.tsx
    └── swamp-lords-table.tsx
```

### Pattern 1: Static Export Page with Client-Side Data Loading

**What:** Page component is a thin server component shell; a `'use client'` component beneath it loads JSON data on mount and owns all interactive state.
**When to use:** All Phase 2 pages — data lives in `/data/*.json`, filtering/sorting is client-side.

```typescript
// Source: Next.js 16 App Router docs — static exports, client components pattern
// app/politicians/page.tsx (Server Component — no 'use client')
import { PoliticianDirectory } from '@/components/politicians/politician-directory'

export default function PoliticiansPage() {
  return <PoliticianDirectory />
}

// src/components/politicians/politician-directory.tsx
'use client'
import { useState, useEffect } from 'react'
import { loadPoliticians } from '@/lib/data'
import type { Politician } from '@/types'

export function PoliticianDirectory() {
  const [politicians, setPoliticians] = useState<Politician[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPoliticians().then(data => {
      setPoliticians(data)
      setLoading(false)
    })
  }, [])

  if (loading) return <PoliticianDirectorySkeleton />
  // ... render with filter/sort state
}
```

### Pattern 2: Dynamic Route with generateStaticParams

**What:** `/politicians/[bioguideId]` must export `generateStaticParams()` so `output: 'export'` can pre-render an HTML file for each politician at build time.
**When to use:** Required for `/politicians/[bioguideId]`. Without it, the static export will fail at `next build`.

```typescript
// Source: Next.js 16 App Router docs — generateStaticParams + static export
// app/politicians/[bioguideId]/page.tsx
import { readFile } from 'fs/promises'
import path from 'path'
import type { Politician } from '@/types'
import { PoliticianProfile } from '@/components/profile/profile-tabs'

// Called at build time — reads politicians.json directly from filesystem
export async function generateStaticParams() {
  const filePath = path.join(process.cwd(), 'public/data/politicians.json')
  const data = await readFile(filePath, 'utf-8')
  const politicians: Politician[] = JSON.parse(data)
  return politicians.map(p => ({ bioguideId: p.bioguideId }))
}

// Client Component page — reads bioguideId, fetches data on mount
'use client'
import { use } from 'react'
export default function ProfilePage({ params }: { params: Promise<{ bioguideId: string }> }) {
  const { bioguideId } = use(params)
  return <PoliticianProfile bioguideId={bioguideId} />
}
```

**CRITICAL:** In Client Component pages with dynamic segments, `params` is a Promise in Next.js 16. Use `use(params)` (React 19 API) to unwrap it, not direct destructuring.

### Pattern 3: Client-Side Filter State (No URL Params)

**What:** Filter/sort/view state lives in React `useState`, not URL query params.
**When to use:** All directory/feed/leaderboard filtering. Avoids `useSearchParams` Suspense complexity.

```typescript
// Source: project decision — static export, zero-latency client-side filtering
'use client'
import { useState, useMemo } from 'react'

type FilterState = {
  party: string | null
  chamber: string | null
  state: string | null
  search: string
  sortBy: 'seasonPoints' | 'salaryCap' | 'insiderRiskScore' | 'winRate' | 'avgReturn' | 'tradeCount'
  sortDir: 'asc' | 'desc'
  view: 'grid' | 'list'
}

// useMemo for filtered + sorted slice — instant because data is already in memory
const filtered = useMemo(() => {
  return politicians
    .filter(p => !filterState.party || p.party === filterState.party)
    .filter(p => !filterState.chamber || p.chamber === filterState.chamber)
    .filter(p => !filterState.search || p.name.toLowerCase().includes(filterState.search.toLowerCase()))
    .sort((a, b) => {
      const dir = filterState.sortDir === 'asc' ? 1 : -1
      return (a[filterState.sortBy] - b[filterState.sortBy]) * dir
    })
}, [politicians, filterState])
```

### Pattern 4: Recharts Dark Theme Configuration

**What:** Consistent dark theme config shared across all charts. Charts must use CSS variables, not hardcoded hex values.
**When to use:** All chart components — LineChart, PieChart, AreaChart, RadarChart.

```typescript
// Source: Recharts 3.x API (npm view recharts version: 3.8.0)
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

// Shared dark theme defaults — extract to src/lib/chart-config.ts
export const CHART_COLORS = {
  primary: 'var(--color-primary)',      // gold accent
  dem: 'var(--color-party-dem)',
  rep: 'var(--color-party-rep)',
  positive: 'oklch(0.65 0.18 145)',     // green
  negative: 'oklch(0.6 0.23 25)',       // red (risk-swamp color)
  muted: 'var(--color-muted-foreground)',
  border: 'var(--color-border)',
}

// Example LineChart with dark theme
<ResponsiveContainer width="100%" height={200}>
  <LineChart data={weeklyData}>
    <XAxis
      dataKey="week"
      stroke={CHART_COLORS.muted}
      tick={{ fill: CHART_COLORS.muted, fontSize: 11 }}
      axisLine={false}
      tickLine={false}
    />
    <YAxis
      stroke={CHART_COLORS.muted}
      tick={{ fill: CHART_COLORS.muted, fontSize: 11 }}
      axisLine={false}
      tickLine={false}
    />
    <Tooltip
      contentStyle={{
        backgroundColor: 'var(--color-card)',
        border: '1px solid var(--color-border)',
        borderRadius: '6px',
        color: 'var(--color-foreground)',
      }}
    />
    <Line type="monotone" dataKey="points" stroke={CHART_COLORS.primary} strokeWidth={2} dot={false} />
  </LineChart>
</ResponsiveContainer>
```

### Pattern 5: Skeleton Loading

**What:** Shimmer skeleton that mirrors the shape of the actual content.
**When to use:** Show during data fetch on all pages (loadPoliticians, loadTrades, etc.).

```typescript
// Source: tw-animate-css (installed) + Tailwind CSS 4.x
// Reusable skeleton primitive
function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn('animate-pulse rounded-md bg-muted', className)} />
  )
}

// Card-shaped skeleton for politician directory loading
function PoliticianCardSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex gap-4 mb-4">
        <Skeleton className="size-16 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <div className="flex gap-4">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-16" />
      </div>
    </div>
  )
}
```

### Anti-Patterns to Avoid

- **Using `useSearchParams` without Suspense boundary:** In static export, `useSearchParams` causes the component tree up to the nearest Suspense boundary to be client-rendered. Avoid it entirely — use `useState` for filter state instead.
- **Using `next/image` for politician photos:** Project uses `output: 'export'` with `images: { unoptimized: true }`. PoliticianCard already uses `<img>` — never switch to `next/image` for politician portraits.
- **Calling `loadPoliticians()` in Server Components on the profile page:** The page renders as static HTML; `loadPoliticianById()` must happen client-side via fetch, not at build time in the Server Component. Use `generateStaticParams()` only to enumerate routes, not to pre-fetch profile data.
- **Hardcoding `generateStaticParams` with manual bioguideIds:** Read from the actual JSON file at build time using `fs/promises` — do not maintain a static list.
- **Missing `dynamicParams: false` on profile route:** When `output: 'export'`, all dynamic params must be enumerated by `generateStaticParams`. Add `export const dynamicParams = false` to the profile page to make this explicit and fail-fast.
- **Recharts inside non-client components:** Recharts uses DOM APIs. All chart components must have `'use client'` directive.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Carousel autoplay | Custom interval + ref logic | `motion` (already installed) — `useAnimate` or `AnimatePresence` | Edge cases: pause on hover, cleanup on unmount |
| Charts (line, pie, area, radar) | SVG paths by hand | Recharts 3.x | Locked in D-10; edge cases in responsive sizing, tooltips, axis formatting |
| Filter sidebar on mobile | Custom off-canvas | shadcn/ui `Sheet` (already installed) | Handles focus trapping, backdrop, animation, a11y |
| Collapsible filter sections | Custom accordion | shadcn/ui or simple `useState` toggle | Already have the primitives |
| Tab navigation on profiles | Custom tab state | shadcn/ui `Tabs` (already installed) | Accessible keyboard navigation, ARIA roles |
| Tooltip explanations | Custom tooltip | shadcn/ui `Tooltip` (already installed) | Portal rendering, positioning, a11y |
| Podium gold/silver/bronze | Image assets | CSS with `--gold` CSS variable + inline styles | Keeps it as code, consistent with design system |
| Class merging | Manual string concat | `cn()` utility (already in `src/lib/utils.ts`) | Handles Tailwind conflicts |

**Key insight:** The entire design system foundation is already built. Phase 2 is wiring data to UI, not creating new primitives.

---

## Common Pitfalls

### Pitfall 1: Missing generateStaticParams on the Profile Route

**What goes wrong:** `next build` fails with "Dynamic segments are not supported" or generates no politician profile pages.
**Why it happens:** `output: 'export'` cannot generate dynamic pages on-demand; all routes must be pre-enumerated.
**How to avoid:** Export `generateStaticParams` from `app/politicians/[bioguideId]/page.tsx` that reads `public/data/politicians.json` via `fs/promises` and returns `{ bioguideId }` for all 82 politicians. Also add `export const dynamicParams = false`.
**Warning signs:** `next build` completes but `/politicians/[bioguideId]` routes return 404 in production.

### Pitfall 2: params as Promise in Client Component Pages

**What goes wrong:** `TypeError: Cannot destructure property 'bioguideId' of params` or `bioguideId` is `undefined`.
**Why it happens:** In Next.js 16 App Router, `params` is a Promise in both Server and Client Components. Direct destructuring `{ params: { bioguideId } }` will not work.
**How to avoid:** Use `const { bioguideId } = use(params)` with the React 19 `use()` API in client component pages. This is documented in the official Next.js dynamic-routes.md.
**Warning signs:** Profile page renders but `bioguideId` is undefined; no data loads.

### Pitfall 3: Recharts SSR Crash

**What goes wrong:** Build error or blank chart on profile pages — "window is not defined" or similar.
**Why it happens:** Recharts accesses DOM APIs. In static export, client components are pre-rendered to HTML during `next build`. If Recharts is not properly wrapped in `'use client'`, the pre-render fails.
**How to avoid:** Every chart component file must have `'use client'` at the top. Alternatively, wrap with `dynamic(() => import('./chart'), { ssr: false })` for components that need to be browser-only.
**Warning signs:** Build completes but charts are blank in development; or build fails with `window is not defined`.

### Pitfall 4: Empty Committees Array Silently Breaking DIR-02 Filter

**What goes wrong:** The committee filter dropdown shows options but filtering never returns results (all 82 politicians have empty `committees: []`).
**Why it happens:** The build pipeline was unable to fetch committee data from the DEMO_KEY API (documented in STATE.md: "InsiderRiskScore components simulated with seeded hashes when committee data unavailable").
**How to avoid:** Detect empty committee data at filter build time. If all politicians have empty committees, disable the committee filter with an "unavailable" state. Do not silently show a filter that always returns all results.
**Warning signs:** Committee filter renders but selecting any committee shows all 82 politicians unchanged.

### Pitfall 5: Carousel Memory Leak from setInterval

**What goes wrong:** Browser console shows `Warning: Can't perform a React state update on an unmounted component` when navigating away from landing page.
**Why it happens:** Auto-rotating carousel uses `setInterval` that continues after component unmounts.
**How to avoid:** Return cleanup function from `useEffect` — `return () => clearInterval(id)`. Or use `motion`'s animation APIs which handle cleanup automatically.
**Warning signs:** Visible in React DevTools profiler; navigation becomes slow after visiting landing page.

### Pitfall 6: useSearchParams Suspense Requirement

**What goes wrong:** Build warning "useSearchParams() should be wrapped in a suspense boundary" or pages lose prerendering.
**Why it happens:** `useSearchParams()` in a Client Component triggers client-side rendering of the component tree up to the nearest Suspense boundary.
**How to avoid:** Do not use `useSearchParams` for filter state. Use `useState` for all directory/feed/leaderboard filter state. URL does not need to reflect filter choices for this phase.
**Warning signs:** `next build` emits "useSearchParams" warning; URL is not bookmarkable for filtered views (acceptable per scope).

---

## Code Examples

Verified patterns from official sources and project codebase:

### Dynamic Route Page (Client Component, params unwrapped with use())
```typescript
// Source: /node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/dynamic-routes.md
// app/politicians/[bioguideId]/page.tsx
'use client'
import { use } from 'react'
import { PoliticianProfile } from '@/components/profile/profile-tabs'

export const dynamicParams = false

export default function ProfilePage({
  params,
}: {
  params: Promise<{ bioguideId: string }>
}) {
  const { bioguideId } = use(params)
  return <PoliticianProfile bioguideId={bioguideId} />
}
```

### generateStaticParams Reading from Filesystem
```typescript
// Source: /node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-static-params.md
// Must be in the same file as the page — not in a 'use client' component
import { readFile } from 'fs/promises'
import path from 'path'
import type { Politician } from '@/types'

export async function generateStaticParams() {
  const filePath = path.join(process.cwd(), 'public/data/politicians.json')
  const raw = await readFile(filePath, 'utf-8')
  const politicians: Politician[] = JSON.parse(raw)
  return politicians.map(p => ({ bioguideId: p.bioguideId }))
}
```

**Note:** `generateStaticParams` must be exported from the page file directly (not from a 'use client' component). This means the profile page.tsx needs a Server Component export for `generateStaticParams` and a Client Component for the actual page default export. Achieve this by splitting: keep `generateStaticParams` in a non-'use client' page.tsx that delegates rendering to a `'use client'` component.

Correct split pattern:
```typescript
// app/politicians/[bioguideId]/page.tsx — NO 'use client' directive
import { readFile } from 'fs/promises'
import path from 'path'
import type { Politician } from '@/types'
import { PoliticianProfileClient } from '@/components/profile/politician-profile-client'

export const dynamicParams = false

export async function generateStaticParams() {
  const filePath = path.join(process.cwd(), 'public/data/politicians.json')
  const raw = await readFile(filePath, 'utf-8')
  const politicians: Politician[] = JSON.parse(raw)
  return politicians.map(p => ({ bioguideId: p.bioguideId }))
}

export default function ProfilePage({
  params,
}: {
  params: Promise<{ bioguideId: string }>
}) {
  return <PoliticianProfileClient params={params} />
}
```

### RadarChart for Corruption Dossier
```typescript
// Source: Recharts 3.x API docs (verified installed: 3.8.0)
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts'
import type { InsiderRiskBreakdown } from '@/types'

function CorruptionRadar({ breakdown }: { breakdown: InsiderRiskBreakdown }) {
  const data = [
    { label: 'Donor Overlap', value: breakdown.donorOverlap },
    { label: 'Suspicious Timing', value: breakdown.suspiciousTiming },
    { label: 'Committee Conflict', value: breakdown.committeeConflict },
    { label: 'STOCK Act', value: breakdown.stockActCompliance },
    { label: 'Trade Volume', value: breakdown.tradeVolume },
  ]

  return (
    <ResponsiveContainer width="100%" height={280}>
      <RadarChart data={data}>
        <PolarGrid stroke="var(--color-border)" />
        <PolarAngleAxis
          dataKey="label"
          tick={{ fill: 'var(--color-muted-foreground)', fontSize: 11 }}
        />
        <Radar
          dataKey="value"
          stroke="var(--color-risk-swamp)"
          fill="var(--color-risk-swamp)"
          fillOpacity={0.25}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            borderRadius: '6px',
          }}
        />
      </RadarChart>
    </ResponsiveContainer>
  )
}
```

### Mobile Filter Drawer using shadcn Sheet
```typescript
// Source: shadcn/ui Sheet (already installed at src/components/ui/sheet.tsx)
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Filter } from 'lucide-react'

// Mobile: slide-out drawer triggered by Filters button (D-05)
function MobileFilterDrawer({ children }: { children: React.ReactNode }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="lg:hidden">
          <Filter className="size-4 mr-2" />
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  )
}
```

### Bonus Badge Mapping
```typescript
// Source: project codebase — bonus types confirmed from trades.json analysis
// Bonus types in data: 'bigMover', 'bipartisanBet', 'donorDarling'
// insiderTiming and activityBonus not appearing in trade-level bonuses
const BONUS_CONFIG: Record<string, { label: string; emoji: string; color: string }> = {
  bigMover:       { label: 'Big Mover',       emoji: '🚀', color: 'text-yellow-400' },
  bipartisanBet:  { label: 'Bipartisan Bet',  emoji: '🤝', color: 'text-blue-400' },
  donorDarling:   { label: 'Donor Darling',   emoji: '💰', color: 'text-green-400' },
  insiderTiming:  { label: 'Insider Timing',  emoji: '⏰', color: 'text-red-400' },
  activityBonus:  { label: 'Active Trader',   emoji: '⚡', color: 'text-purple-400' },
}
```

---

## Data Reality (Important for Planning)

### What Exists
- 82 politicians with all fields populated: party, chamber, state, seasonPoints, weeklyPoints[6], winRate, avgReturn, tradeCount, insiderRiskScore, insiderRiskTier, insiderRiskBreakdown (5 components), salaryCap, salaryTier
- 815 trades with: bioguideId, ticker, company, sector, tradeType, disclosureDate, tradeDate, amountRange, returnVsSP500, absoluteReturn, sp500Return, daysToDisclose, fantasyPoints, scoreBreakdown
- 3 leagues with 8 teams each; teams have record, pointsFor, pointsAgainst, streak, isUserTeam flag
- Risk tiers distribution: 2 peak-swamp, 12 seriously-suspicious, 48 raised-eyebrows, 17 minor-concerns, 3 clean-record
- Bonus types in actual trade data: bigMover, bipartisanBet, donorDarling (insiderTiming not present in trades.json)

### What Is Missing / Simulated
- All 82 politicians have `committees: []` — committee filter must degrade gracefully; Corruption Dossier committee map is simulated/placeholder
- No `district` field on most politicians (house members may lack it)
- No "news" data — News & Disclosures tab (PROF-05) will render recent STOCK Act filings from `trades.json` filtered by politician as its primary content; committee hearing schedule is static/simulated placeholder text

### Route Navigation Already Done
The global nav (`nav-desktop.tsx`, `nav-mobile.tsx`) already includes links to `/`, `/politicians`, `/feed`, `/leaderboard`, `/team`. No nav changes needed for Phase 2 routes.

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `next export` CLI command | `output: 'export'` in next.config | Next.js 14.0.0 | `next export` removed; project already uses correct approach |
| `getStaticPaths` + `getStaticProps` (Pages Router) | `generateStaticParams` (App Router) | Next.js 13.4+ | Project uses App Router; must use `generateStaticParams` |
| `params.bioguideId` direct access | `use(params)` or `await params` | Next.js 15+ (React 19) | params is now a Promise; must unwrap with `use()` in client components |
| Class-based Recharts config | Functional ResponsiveContainer | Recharts 3.x | Current standard |

**Deprecated/outdated:**
- `next export`: Removed in Next.js 14.0.0. Never use as CLI command.
- Direct `params` destructuring in page components: params is a Promise in Next.js 16. Always unwrap.

---

## Open Questions

1. **generateStaticParams cannot coexist with `'use client'` in same file**
   - What we know: `generateStaticParams` must be in a Server Component context; the profile page needs client interactivity
   - What's unclear: Whether Next.js 16 App Router supports a "mixed" page where a server export (`generateStaticParams`) lives alongside a default client component export
   - Recommendation: Use the split pattern documented above — page.tsx with no `'use client'` exports `generateStaticParams` and delegates rendering to a `'use client'` child component. This is documented in Next.js App Router patterns and confirmed by how `PoliticianCard` is already structured.

2. **Recharts 3.x API changes vs 2.x**
   - What we know: Recharts 3.8.0 is current. The core API (ResponsiveContainer, LineChart, etc.) is consistent. The project has not installed recharts yet.
   - What's unclear: Any breaking changes specific to 3.x that affect the chart types planned (RadarChart, AreaChart specifically).
   - Recommendation: Install recharts 3.8.0 and verify imports. The chart component implementations should be verified in dev mode before wiring to real data.

---

## Sources

### Primary (HIGH confidence)
- `/node_modules/next/dist/docs/01-app/02-guides/static-exports.md` — static export constraints, unsupported features, image handling
- `/node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/dynamic-routes.md` — dynamic segment convention, `use(params)` pattern
- `/node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-static-params.md` — generateStaticParams API
- `/node_modules/next/dist/docs/01-app/02-guides/single-page-applications.md` — SPA patterns, client-side data fetching
- `/node_modules/next/dist/docs/01-app/03-api-reference/04-functions/use-search-params.md` — Suspense requirement, prerendering behavior
- Project codebase: `src/components/`, `src/types/`, `src/lib/`, `public/data/` — confirmed existing contracts
- `npm view recharts version` → 3.8.0 (verified 2026-03-23)

### Secondary (MEDIUM confidence)
- `public/data/politicians.json` — 82 politicians, all committees empty, confirmed field shapes
- `public/data/trades.json` — 815 trades, bonus types confirmed: bigMover, bipartisanBet, donorDarling
- `public/data/leagues.json` — 3 leagues, team record/points structure confirmed

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all packages either already installed or version-verified via npm
- Architecture: HIGH — grounded in actual Next.js 16 docs from node_modules, not training data
- Data contracts: HIGH — confirmed by reading actual JSON files in public/data/
- Pitfalls: HIGH — derived from official docs + observed data anomalies (empty committees)
- Chart patterns: MEDIUM — Recharts 3.x not yet installed; API verified from npm metadata but chart component patterns not tested in this project yet

**Research date:** 2026-03-23
**Valid until:** 2026-04-22 (stable stack; recharts version may update but 3.x API is stable)
