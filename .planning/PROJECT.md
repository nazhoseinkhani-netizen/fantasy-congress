# Fantasy Congress

## What This Is

A fantasy sports-style web application where players draft US politicians into their roster and compete against friends based on the real-world stock trading performance of those politicians. Built as a standalone consumer product on top of Alva's financial data APIs to prove the platform thesis — that Alva is not just a dashboard builder but an API-powered ecosystem capable of powering real consumer applications.

## Core Value

Fantasy football mechanics applied to Congressional stock trading — making political corruption data accessible, entertaining, and viral through gamification.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Landing page communicating the value proposition with CTA
- [ ] Politician directory with real photos, trading stats, corruption index, and filterable cards
- [ ] Live trade feed showing real Congressional stock trades with scoring and bonus badges
- [ ] Individual politician profile pages with Fantasy Stats, Trading Profile, Corruption Dossier, and News tabs
- [ ] Global leaderboard — politician rankings (Hall of Shame) and corruption rankings
- [ ] Dashboard with pre-populated team, matchup scoreboard, and season KPIs
- [ ] My Team roster management with active/bench slots and scoring breakdown
- [ ] League standings, schedule, and activity feed
- [ ] Draft room with simulated snake draft against AI-controlled teams
- [ ] Scoring engine implementing full scoring system (base, bonuses, penalties, multipliers)
- [ ] Share card generation for teams, trades, and corruption data
- [ ] Developer mode / API visualization Easter egg showing Alva data sources
- [ ] Responsive design (desktop primary, mobile secondary)
- [ ] Pre-populated demo data — 3 leagues, 6 weeks of simulated results, 50-100+ politicians with real trade data

### Out of Scope

- Real authentication/user accounts — prototype uses local state
- Real multiplayer/backend — simulated with pre-populated data and localStorage
- Real-time WebSocket trade updates — trades refresh on page load
- Payment processing or premium features
- Native mobile app — web responsive only
- Real email sending — weekly recap is design mockup only

## Context

- **Assessment context**: This app demonstrates to Alva leadership that consumer products can be built on Alva's data infrastructure. It needs to feel like a real product launch, not a hackathon project.
- **Data sources**: Alva Skills API (senator trading, stock prices, fundamentals), FEC donation data (web scraping/API), official Congressional portraits (bioguide.congress.gov, unitedstates/images GitHub repo)
- **Prototype strategy**: Real politician data and trade disclosures wherever possible. Multiplayer features (leagues, drafts, matchups) simulated with pre-populated realistic data. User assigned to a pre-built team for immediate exploration.
- **Design direction**: Premium, slightly irreverent, addictive. DraftKings meets political satire. Dark mode default. Real politician photos everywhere — no placeholders. Emojis used strategically for badges and alerts.
- **Viral mechanics**: Every player invites 5-10 friends to form leagues. Corruption Index generates social shareability. "Powered by Alva" branding introduces Alva to new audiences.

## Constraints

- **Tech stack**: React (Next.js or Vite) + Tailwind CSS, deployed to Vercel/Netlify as static site
- **Data layer**: Alva Skills API as primary backend data engine. May need to pre-cache data for prototype if API access is limited.
- **State management**: React state + localStorage for prototype (no backend database)
- **Photos**: Every politician card MUST show actual official photo — critical for virality and realism
- **Build priority**: P1 (landing, directory, feed, profiles, leaderboard) alone makes a compelling demo. P2 (dashboard, team, league) adds depth. P3 (draft, shares, animations) adds polish.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Standalone web app, not Alva Playbook | Proves platform thesis — Alva as API ecosystem | — Pending |
| Dark mode default | Matches fantasy sports aesthetic (DraftKings, ESPN) | — Pending |
| Pre-populated demo data over live-only | Ensures app always feels complete and explorable | — Pending |
| Salary cap fantasy format | Adds strategic depth beyond simple drafting | — Pending |
| Corruption Index as core feature | Maximum virality and shareability factor | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-03-23 after initialization*
