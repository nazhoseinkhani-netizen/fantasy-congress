# Phase 5: Polish and Viral - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-23
**Phase:** 05-polish-and-viral
**Areas discussed:** Animation style & intensity, Share card design & generation, Developer Mode Easter egg, Platform showcase placement

---

## Animation Style & Intensity

### Overall animation vibe

| Option | Description | Selected |
|--------|-------------|----------|
| ESPN spectacle | Bold, dramatic animations — cards fly, numbers tick up like scoreboards, gauges fill with color sweeps. Matches DraftKings premium aesthetic. | ✓ |
| Subtle polish | Smooth but understated — gentle fades, soft slides, eased transitions. Professional and refined. | |
| Selective drama | Most interactions get subtle polish, key moments get full spectacle. Two tiers of intensity. | |

**User's choice:** ESPN spectacle
**Notes:** None — clear preference for dramatic, sports broadcast-level animations.

### Animation triggers

| Option | Description | Selected |
|--------|-------------|----------|
| Load + interaction | Key elements animate on first view AND on interaction. App feels alive from the moment you land. | ✓ |
| Interaction only | Static on load, animations trigger on user actions. | |
| Load only for hero moments | Corruption gauge and leaderboard podium animate on load, rest interaction-triggered. | |

**User's choice:** Load + interaction
**Notes:** None.

### Points counter ticker style

| Option | Description | Selected |
|--------|-------------|----------|
| Sports scoreboard flip | Numbers flip/roll like a stadium scoreboard. Each digit transitions independently. | ✓ |
| Counting up | Number rapidly counts from 0 to final value. | |
| Pop-in with scale | Number appears with quick scale-up bounce. | |

**User's choice:** Sports scoreboard flip
**Notes:** None.

### Corruption gauge reveal

| Option | Description | Selected |
|--------|-------------|----------|
| Theatrical fill | Gauge sweeps 0 to score with color transitions, overshoot bounce, tier label fade-in. 1.5-2s. | ✓ |
| Quick fill with glow | Fast fill (0.5s) with color glow pulse at end. | |
| Segmented reveal | Each corruption component fills sequentially. More educational, slower. | |

**User's choice:** Theatrical fill
**Notes:** None.

---

## Share Card Design & Generation

### Generation method

| Option | Description | Selected |
|--------|-------------|----------|
| html-to-image | Renders hidden DOM element to PNG client-side. Full control, works offline. CORS non-issue with static export. | ✓ |
| Canvas API direct | Draw programmatically on canvas. No DOM dependency, full pixel control. | |
| @vercel/og | Server-side OG image generation. Requires server, not static export compatible. | |

**User's choice:** html-to-image
**Notes:** Resolves the CORS blocker noted in STATE.md — photos in public/photos/ are same-origin.

### Share card types

| Option | Description | Selected |
|--------|-------------|----------|
| Politician + Team | Individual politician card + My Team card. Covers SHARE-01 core use cases. | ✓ |
| Full suite | All 5 types: politician, team, trade, standings, corruption. | |
| Politician only | Just politician card — highest viral potential. | |

**User's choice:** Politician + Team
**Notes:** None.

### Share button placement

| Option | Description | Selected |
|--------|-------------|----------|
| Contextual buttons | Share icon on politician cards and My Team page header. Tap to generate + preview. | ✓ |
| Dedicated share modal | Single Share button in nav opens modal picker. | |
| Long-press / hover menu | Long-press (mobile) or hover (desktop) reveals share option. | |

**User's choice:** Contextual buttons
**Notes:** None.

### Share card aesthetic

| Option | Description | Selected |
|--------|-------------|----------|
| Dark premium with gold | Matches DraftKings dark theme. Sports trading card look. "Powered by Alva" badge at bottom. | ✓ |
| Instagram story style | Vibrant gradients, bold typography, vertical story format. | |
| Clean minimal | White/light background, clean typography, data-forward. | |

**User's choice:** Dark premium with gold
**Notes:** None.

---

## Developer Mode Easter Egg

### Activation method

| Option | Description | Selected |
|--------|-------------|----------|
| Keyboard shortcut | Ctrl+Shift+D — classic Easter egg discovery. Matches PLAT-03 spec. | ✓ |
| Hidden UI element | Tap Alva logo 5 times or long-press. More discoverable on mobile. | |
| Both keyboard + hidden tap | Ctrl+Shift+D on desktop, 5-tap on mobile. Covers both platforms. | |

**User's choice:** Keyboard shortcut
**Notes:** None.

### Developer Mode visual treatment

| Option | Description | Selected |
|--------|-------------|----------|
| Dashed borders + tooltips | Data elements get dashed borders + colored overlay. Hover/tap for Alva Skill tooltip. Toggle banner at top. | ✓ |
| Sidebar panel | Slide-out panel listing all Alva Skills on current page. Subtle element highlights. | |
| Inline badges | Small "API" badges next to each data element. Always visible in dev mode. | |

**User's choice:** Dashed borders + tooltips
**Notes:** None.

### Attribution granularity

| Option | Description | Selected |
|--------|-------------|----------|
| Core data sources | 3-4 main Alva Skills: getSenatorTrades, stock prices, politician metadata. Focused. | ✓ |
| Every data element | Granular attribution — every stat, chart, score traced to source. | |

**User's choice:** Core data sources
**Notes:** None.

---

## Platform Showcase Placement

### Footer scope

| Option | Description | Selected |
|--------|-------------|----------|
| Every page | Consistent footer on all pages. Extends existing AlvaFooter globally. | ✓ |
| Key pages only | Landing, leaderboard, profiles only. Game pages skip it. | |
| Global but minimal | Small "Powered by Alva" text in global footer/nav. One line. | |

**User's choice:** Every page
**Notes:** None.

### "Build Your Own" CTA

| Option | Description | Selected |
|--------|-------------|----------|
| In Alva footer section | Add button/link within existing AlvaFooter alongside "Learn more" link. | ✓ |
| Floating badge | Persistent badge in bottom corner. Always visible, dismissible. | |
| Developer Mode only | CTA only appears when Developer Mode is active. Targets developers. | |

**User's choice:** In Alva footer section
**Notes:** None.

### Footer content strategy

| Option | Description | Selected |
|--------|-------------|----------|
| Static everywhere | Same AlvaFooter on all pages. Developer Mode handles granular attribution. | ✓ |
| Dynamic per page | Footer lists page-specific Alva Skills. Overlaps with Developer Mode. | |

**User's choice:** Static everywhere
**Notes:** None.

---

## Claude's Discretion

- Draft pick fly-to-roster animation specifics (trajectory, burst, timing)
- Trade alert slide-in design (direction, glow, badge bounce)
- Swamp-o-meter gauge animation on leaderboard
- Share card layout and typography details
- Share preview modal design
- Developer Mode toggle banner design
- Developer Mode tooltip content format
- AlvaFooter updated copy and button styling
- Mobile share flow
- Animation performance optimization

## Deferred Ideas

None — discussion stayed within phase scope.
