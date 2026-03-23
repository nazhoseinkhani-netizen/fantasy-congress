# Phase 2: Discovery - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-23
**Phase:** 02-discovery
**Areas discussed:** Landing page feel, Directory & filtering, Politician profiles, Feed & leaderboard

---

## Landing Page Feel

### Hero Tone

| Option | Description | Selected |
|--------|-------------|----------|
| Bold & provocative | Big headline like "DRAFT YOUR POLITICIANS. PROFIT FROM THEIR TRADES." Unapologetic, attention-grabbing. | ✓ |
| Sleek & intriguing | More understated "What if you could fantasy-draft Congress?" Premium feel. | |
| Data-forward | Lead with numbers — "$X billion in Congressional trades." Journalistic feel. | |

**User's choice:** Bold & provocative
**Notes:** None

### CTA Strategy

| Option | Description | Selected |
|--------|-------------|----------|
| Explore-first | Primary CTA → /politicians, secondary → /feed. No fake sign-up. | ✓ |
| Dashboard-first | Primary CTA → /dashboard. More game-like entry point. | |
| Guided tour | CTA triggers 3-step walkthrough before free exploration. | |

**User's choice:** Explore-first
**Notes:** None

### Featured Politicians

| Option | Description | Selected |
|--------|-------------|----------|
| Carousel of top traders | Auto-rotating carousel of 5 politician cards. Eye-catching, shows real photos. | ✓ |
| Static grid with stats | Fixed 4-5 cards in grid, no animation. Cleaner, loads instantly. | |
| Live ticker strip | Horizontal scrolling ticker. Stock ticker feel with politician photos. | |

**User's choice:** Carousel of top traders
**Notes:** None

### Alva Branding

| Option | Description | Selected |
|--------|-------------|----------|
| Footer section | Dedicated section near bottom with platform description + link. | ✓ |
| Integrated badge | Small "Powered by Alva" badge in hero or nav area. Minimal footprint. | |
| You decide | Claude picks best placement. | |

**User's choice:** Footer section
**Notes:** None

---

## Directory & Filtering

### Filter UX

| Option | Description | Selected |
|--------|-------------|----------|
| Sticky sidebar | Desktop: persistent left sidebar. Mobile: slide-out drawer. DraftKings pattern. | ✓ |
| Top filter bar | Horizontal filter chips/dropdowns above grid. Compact, modern. | |
| Hybrid | Top bar for 3 most-used filters, expandable panel for rest. | |

**User's choice:** Sticky sidebar
**Notes:** None

### Card Density

| Option | Description | Selected |
|--------|-------------|----------|
| Medium — 3 per row | PoliticianCard 'full' variant. All stats visible. DraftKings density. | ✓ |
| Dense — 4-5 per row | PoliticianCard 'compact' variant. More per screen, fewer stats. | |
| You decide | Claude picks best density. | |

**User's choice:** Medium — 3 per row
**Notes:** None

### Search

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, top of page | Search input above grid, instant client-side filtering by name. | ✓ |
| No search | Filters and sort are sufficient. Keep it simple. | |
| You decide | Claude decides based on page flow. | |

**User's choice:** Yes, top of page
**Notes:** None

### View Toggle

| Option | Description | Selected |
|--------|-------------|----------|
| Grid default, list as table | Grid: 'full' variant 3-col. List: compact table rows. Toggle via icons. | ✓ |
| Grid only | Skip list view. Cards are the product. | |
| You decide | Claude picks best approach for both views. | |

**User's choice:** Grid default, list as table
**Notes:** None

---

## Politician Profiles

### Profile Header

| Option | Description | Selected |
|--------|-------------|----------|
| Full-width hero banner | Large photo left, name/party prominent, stats as big numbers right. Dark gradient. | ✓ |
| Compact header + sidebar | Smaller header, key stats in sticky right sidebar alongside tabs. | |
| You decide | Claude picks best layout. | |

**User's choice:** Full-width hero banner
**Notes:** None

### Chart Library

| Option | Description | Selected |
|--------|-------------|----------|
| Recharts for all | Recharts 3.x for line, pie, area, radar charts. One library, consistent API. | ✓ |
| Mix: Recharts + custom SVG | Recharts for standard, custom SVG for radar and risk gauge. | |
| You decide | Claude picks best approach per tab. | |

**User's choice:** Recharts for all
**Notes:** None

### Dossier Vibe

| Option | Description | Selected |
|--------|-------------|----------|
| Intelligence briefing | "CLASSIFIED" watermark, monospace headers, redacted accents. Dramatic, shareable. | ✓ |
| Clean data dashboard | Standard dashboard layout. Professional, readable, less theatrical. | |
| You decide | Claude picks best treatment. | |

**User's choice:** Intelligence briefing
**Notes:** None

### Mobile Tabs

| Option | Description | Selected |
|--------|-------------|----------|
| Scrollable tab bar | Horizontal scroll, all 4 labels visible. Active tab underlined. Sports app pattern. | ✓ |
| Accordion sections | Collapsible sections on mobile. All content in one scroll. | |
| You decide | Claude picks best mobile tab approach. | |

**User's choice:** Scrollable tab bar
**Notes:** None

---

## Feed & Leaderboard

### Feed Cards

| Option | Description | Selected |
|--------|-------------|----------|
| Twitter-style feed cards | Vertical cards: photo+name left, trade details body, points+badges footer. | ✓ |
| Compact table rows | Dense table rows. Bloomberg terminal feel. | |
| You decide | Claude picks best design. | |

**User's choice:** Twitter-style feed cards
**Notes:** None

### Feed Layout

| Option | Description | Selected |
|--------|-------------|----------|
| Feed + sidebar | Desktop: 70% feed + 30% trending sidebar. Mobile: feed + trending below. | ✓ |
| Full-width feed only | Skip sidebar. Trending as horizontal scroll above feed. | |
| You decide | Claude picks best layout. | |

**User's choice:** Feed + sidebar
**Notes:** None

### Leaderboard Presentation

| Option | Description | Selected |
|--------|-------------|----------|
| Podium + ranked list | Top 3 podium (gold/silver/bronze), rest in ranked table. Two tabs. | ✓ |
| Straight ranked table | Simple ranked list #1 down. Clean and functional. | |
| You decide | Claude picks best presentation. | |

**User's choice:** Podium + ranked list
**Notes:** None

### Swamp Lords

| Option | Description | Selected |
|--------|-------------|----------|
| Simulated manager rankings | 8 team owners from user's league, ranked by record/points. User highlighted. | ✓ |
| Skip for Phase 2 | Defer LEAD-02 to Phase 3 when dashboard exists. | |
| You decide | Claude decides how to handle manager leaderboard. | |

**User's choice:** Simulated manager rankings
**Notes:** None

---

## Claude's Discretion

- Skeleton loading state implementations (UI-04)
- Tooltip content and placement (UI-05)
- Empty state copy and illustrations (UI-06)
- Feed filter bar design
- "My Roster Only" toggle placement (FEED-03)
- Navigation routing structure
- How-It-Works section layout (LAND-02)
- Corruption Leaderboard featured sections presentation

## Deferred Ideas

None — discussion stayed within phase scope.
