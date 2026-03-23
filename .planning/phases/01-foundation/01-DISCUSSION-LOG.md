# Phase 1: Foundation - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-23
**Phase:** 01-foundation
**Areas discussed:** Data Pipeline Strategy, Scoring Formula Tuning, Demo Data Realism, Design System Foundation

---

## Data Pipeline Strategy

### Data Source Approach

| Option | Description | Selected |
|--------|-------------|----------|
| Real API first | Build scripts call Alva Skills API at build time, output static JSON. Build fails if API unavailable. | ✓ |
| Mock data first | Hand-crafted JSON fixtures matching expected schema. Swap in real API later. | |
| Hybrid approach | Real API with checked-in JSON snapshot as fallback. | |

**User's choice:** Real API first
**Notes:** Research phase will investigate actual Alva endpoints, auth, and rate limits.

### Photo Sourcing

| Option | Description | Selected |
|--------|-------------|----------|
| Congress.gov + GitHub fallback | Primary: bioguide.congress.gov. Fallback: unitedstates/images GitHub. Build validates HTTP 200. | ✓ |
| Single source only | congress.gov only. Simpler but higher gap risk. | |
| Download and self-host all | Download all to public/images/ at build time. No external deps but adds 50-100MB. | |

**User's choice:** Congress.gov + GitHub fallback
**Notes:** None.

### JSON Output Shape

| Option | Description | Selected |
|--------|-------------|----------|
| One file per entity type | politicians.json, trades.json, leagues.json, matchups.json — separate files. | ✓ |
| Single bundled file | One big data.json with everything nested. | |
| Per-politician files | Individual JSON per politician plus index files. | |

**User's choice:** One file per entity type
**Notes:** None.

### Photo Failure Handling

| Option | Description | Selected |
|--------|-------------|----------|
| Build fails | Exclude politician if no photo found. Zero broken images. | |
| Initials avatar fallback | Generate styled avatar with initials and party color. Keeps dataset complete. | ✓ |
| You decide | Claude chooses. | |

**User's choice:** Initials avatar fallback
**Notes:** Keeps dataset complete. Avatar uses party color (blue/red) with politician's initials.

---

## Scoring Formula Tuning

### Score Configuration

| Option | Description | Selected |
|--------|-------------|----------|
| Configurable via JSON | Scoring rules in config object. Easy to tune without code changes. | ✓ |
| Hardcoded constants | Point values as const enums. Simpler but requires code changes to tune. | |
| You decide | Claude picks. | |

**User's choice:** Configurable via JSON
**Notes:** None.

### Incomplete Data Handling

| Option | Description | Selected |
|--------|-------------|----------|
| Skip and log | Missing-data trades excluded from scoring but logged in build report. | ✓ |
| Score as zero | Missing data trades score 0 points. | |
| Estimate from available data | Use sector averages to fill gaps. | |

**User's choice:** Skip and log
**Notes:** None.

### Risk Score Tier Distribution

| Option | Description | Selected |
|--------|-------------|----------|
| Bell curve distribution | Most politicians in middle tiers. Extremes are rare and meaningful. | ✓ |
| Even distribution | Each tier spans 20 points. Simple but boring. | |
| You decide | Claude designs distribution. | |

**User's choice:** Bell curve distribution
**Notes:** Clean Record (<15) and Peak Swamp (>85) should be rare.

### Score Computation Timing

| Option | Description | Selected |
|--------|-------------|----------|
| Build time | Scores pre-computed and included in JSON. Zero runtime cost. | ✓ |
| Runtime computation | Raw data in JSON, scoring engine runs in browser. | |
| Both | Pre-computed for display, engine available at runtime. | |

**User's choice:** Build time
**Notes:** None.

---

## Demo Data Realism

### Data Authenticity

| Option | Description | Selected |
|--------|-------------|----------|
| Real trades, simulated leagues | Real STOCK Act data + programmatically simulated league structures. | ✓ |
| Fully real | Reconstruct actual fantasy leagues from historical data. | |
| Fully synthetic | All data generated. | |

**User's choice:** Real trades, simulated leagues
**Notes:** None.

### User's Pre-Assigned Team

| Option | Description | Selected |
|--------|-------------|----------|
| Competitive mid-tier | ~3-3 record, mix of high-profile and sleepers. Room to improve. | ✓ |
| Top-performing team | Best team in league. Feels great but less engagement. | |
| Underdog team | Struggling 2-4 record. Turnaround narrative. | |

**User's choice:** Competitive mid-tier
**Notes:** None.

### League Themes

| Option | Description | Selected |
|--------|-------------|----------|
| Themed leagues | Each league has fun name and personality. | ✓ |
| Generic leagues | League 1, 2, 3. | |
| You decide | Claude designs themes. | |

**User's choice:** Themed leagues
**Notes:** None.

### Salary Cap Pricing

| Option | Description | Selected |
|--------|-------------|----------|
| Performance-based tiers | Top performers = highest salary. Based on historical fantasy output. | ✓ |
| Corruption-weighted | Higher risk score = higher salary. | |
| Hybrid: performance + corruption | Performance base with corruption premium. | |

**User's choice:** Performance-based tiers
**Notes:** None.

---

## Design System Foundation

### Aesthetic Direction

| Option | Description | Selected |
|--------|-------------|----------|
| DraftKings premium | Near-black backgrounds, gold accents, clean typography. Serious sports feel. | ✓ |
| Political satire forward | Playful, bold headlines, exaggerated badges. Daily Show meets fantasy sports. | |
| Minimal and data-dense | Bloomberg Terminal meets dark mode. | |

**User's choice:** DraftKings premium
**Notes:** None.

### Component Customization Depth

| Option | Description | Selected |
|--------|-------------|----------|
| Theme tokens + key components | 5-8 core components customized. | |
| Minimal — defaults only | Default dark theme, only colors customized. | |
| Full design system | All components, spacing, typography, animation tokens. | ✓ |

**User's choice:** Full design system (with strong emphasis)
**Notes:** User explicitly stated: "full design and extremely premium and responsive and interactive. I do not want this to look basic as if it was AI coded, it has to feel extremely premium frontend design and graphic design. Extremely creative and polished." This is a non-negotiable quality bar.

### Navigation Pattern

| Option | Description | Selected |
|--------|-------------|----------|
| Fixed top bar + sidebar collapse | Desktop: persistent top nav. Mobile: hamburger/bottom tab. | ✓ |
| Sidebar-first | Collapsible left sidebar like Discord/Slack. | |
| You decide | Claude designs nav. | |

**User's choice:** Fixed top bar + sidebar collapse
**Notes:** None.

### Mobile Responsive Strategy

| Option | Description | Selected |
|--------|-------------|----------|
| Bottom tab bar on mobile | Fixed bottom tabs (Instagram/DraftKings pattern). 4-5 key sections. | ✓ |
| Hamburger menu on mobile | Standard hamburger icon, full-screen overlay. | |
| You decide | Claude picks. | |

**User's choice:** Bottom tab bar on mobile
**Notes:** None.

---

## Claude's Discretion

- Specific color hex values (within DraftKings premium direction)
- Typography choices (font families, scale)
- shadcn/ui component customization details
- Build script implementation patterns
- Scoring config file format
- League/team name creativity
- Insider Trading Risk Score component weights and tier boundaries

## Deferred Ideas

None — discussion stayed within phase scope.
