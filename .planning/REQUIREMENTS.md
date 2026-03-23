# Requirements: Fantasy Congress

**Defined:** 2026-03-23
**Core Value:** Fantasy football mechanics applied to Congressional stock trading — making political corruption data accessible, entertaining, and viral through gamification.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Data Pipeline

- [x] **DATA-01**: Build-time scripts fetch politician trade data from Alva Skills API (or pre-cached fallback) and output static JSON files
- [x] **DATA-02**: Politician dataset includes 50-100+ members of Congress with disclosed stock trades, including name, party, chamber, state, committees, photo URL, and trading stats
- [x] **DATA-03**: Trade dataset includes ticker, company, sector, trade type, disclosure date, amount range, and calculated returns vs S&P 500
- [x] **DATA-04**: Official Congressional portrait photos are validated and served for every politician — no placeholders
- [x] **DATA-05**: Committee assignment data is included for each politician

### Scoring Engine

- [x] **SCORE-01**: Canonical scoring function calculates fantasy points per trade (base points for beating/losing to S&P 500 + excess return bonus/penalty)
- [x] **SCORE-02**: Trade amount multiplier applies based on disclosed amount range (1x to 4x)
- [x] **SCORE-03**: Bonus points awarded for Insider Timing (+15), Donor Darling (+10), Big Mover (+20), Bipartisan Bet (+25), Activity Bonus (+5/trade)
- [x] **SCORE-04**: Multipliers applied for Committee Chair (1.5x) and Leadership positions (1.3x)
- [x] **SCORE-05**: Negative events deduct points — Paper Hands (-15), Late Disclosure (-10), Wash Sale (-5)
- [x] **SCORE-06**: Scoring engine is pure TypeScript with no React dependencies, unit-testable

### Corruption Index

- [x] **CORR-01**: Composite 0-100 score calculated from donor overlap, suspicious timing, committee conflict, STOCK Act compliance, and trade volume
- [x] **CORR-02**: Score maps to named tiers (Clean Record / Minor Concerns / Raised Eyebrows / Seriously Suspicious / Peak Swamp)
- [x] **CORR-03**: Per-politician breakdown shows individual component scores

### Landing Page

- [ ] **LAND-01**: Hero section with headline, subheadline, and prominent CTA button
- [ ] **LAND-02**: "How It Works" section with 3-step explanation (Draft, Score, Win)
- [ ] **LAND-03**: Featured politicians preview showing 4-5 high-profile trader cards
- [ ] **LAND-04**: "Powered by Alva" section with platform description and link

### Politician Directory

- [x] **DIR-01**: Searchable, filterable grid of all politician cards with photos, party color, stats, and corruption index
- [x] **DIR-02**: Filters for party, chamber, state, committee, salary tier, corruption range, activity level
- [x] **DIR-03**: Sort by fantasy cost, win rate, avg return, corruption index, season points, trade volume
- [x] **DIR-04**: Grid/list view toggle

### Politician Profile

- [x] **PROF-01**: Header with photo, name, party, state, committees as badges, fantasy cost, season points
- [x] **PROF-02**: Fantasy Stats tab — season performance chart, full trade log with scoring details, projected season total
- [x] **PROF-03**: Trading Profile tab — sector pie chart, win rate by sector, biggest wins/losses, performance vs S&P equity curve
- [x] **PROF-04**: Corruption Dossier tab — radar chart of index components, donor overlap details, trade-vs-legislation timeline, committee connection map
- [x] **PROF-05**: News & Disclosures tab — recent STOCK Act filings and committee hearing schedule

### Trade Feed

- [x] **FEED-01**: Scrollable feed of politician trades as cards showing photo, name, party, trade details, return vs S&P, fantasy points, and bonus badges
- [x] **FEED-02**: Filters for party, chamber, trade type, points impact, time period
- [x] **FEED-03**: "My Roster Only" toggle filter
- [x] **FEED-04**: Trending Politicians sidebar — top by points this week, top by volume, hot waiver wire picks

### Leaderboard

- [x] **LEAD-01**: "Hall of Shame" — politicians ranked by total fantasy points with photo, party, stats, corruption index
- [x] **LEAD-02**: "Swamp Lords" — top fantasy managers ranked by record and total points (weekly/season/all-time tabs)
- [x] **LEAD-03**: "Corruption Leaderboard" — politicians ranked by corruption index with tier colors, cleanest/swampiest featured sections

### Dashboard

- [ ] **DASH-01**: Season KPIs row — team points this week, league rank, W-L-T record, next matchup opponent
- [ ] **DASH-02**: This Week's Action — roster as horizontal politician mini-cards with points, trade cards below each, MVP highlight
- [ ] **DASH-03**: Matchup scoreboard — your team vs opponent with visual score display
- [ ] **DASH-04**: Live Trade Feed sidebar (compact version with "See Full Feed" link)
- [ ] **DASH-05**: League Standings compact table with your row highlighted

### My Team

- [ ] **TEAM-01**: 8 active roster slots in 2x4 grid of politician cards with photo, stats, corruption badge
- [ ] **TEAM-02**: 4 bench slots in compact format below active roster
- [ ] **TEAM-03**: Drag-and-drop swap between active and bench
- [ ] **TEAM-04**: Click politician card to expand scoring breakdown with full trade log and season timeline chart
- [ ] **TEAM-05**: Team stats panel — salary cap used/remaining, team win rate, avg points/week, best/worst week

### League

- [x] **LEAG-01**: Full standings table with rank, team name, owner, record, points for/against, streak
- [x] **LEAG-02**: Full season schedule showing every matchup for every week
- [x] **LEAG-03**: League activity feed — trades, draft picks, matchup results

### Draft Room

- [ ] **DRAFT-01**: Pre-draft view with draft order (snake format), countdown timer, and sortable/filterable politician board
- [ ] **DRAFT-02**: During-draft full-screen board with available politicians, current roster + salary cap, "On The Clock" banner, and pick ticker
- [ ] **DRAFT-03**: AI-controlled opponent picks with realistic selection logic
- [ ] **DRAFT-04**: Post-draft results showing every pick, draft grades (A+ to F), sleeper picks, and team summary

### Demo Data

- [x] **DEMO-01**: 3 pre-built leagues with 8 teams each, pre-drafted with realistic rosters
- [x] **DEMO-02**: 6 weeks of simulated matchup results based on actual trade data
- [x] **DEMO-03**: User pre-assigned to a team in one league for immediate exploration
- [x] **DEMO-04**: Salary cap pricing calculated from historical performance tiers (5 tiers + unranked)

### Design System

- [x] **UI-01**: Dark mode default with specified color palette (near-black background, dark navy cards, party colors, gold accent)
- [x] **UI-02**: Global navigation bar with logo, nav items, user avatar
- [x] **UI-03**: Responsive layout — desktop multi-column, mobile stacked with bottom tab nav
- [x] **UI-04**: Skeleton loading states for all data-heavy pages
- [x] **UI-05**: Tooltips on every metric, badge, and scoring element explaining what it means
- [x] **UI-06**: Empty states with contextual copy for all zero-data scenarios

### Animations & Polish

- [ ] **ANIM-01**: Draft pick animation — card flies to roster with burst effect
- [ ] **ANIM-02**: Trade alert animation — slide in from right with green/red glow, badges bounce in
- [ ] **ANIM-03**: Points counter — animated number ticker like a sports scoreboard
- [ ] **ANIM-04**: Corruption Index reveal — gauge fills up with color transitions
- [ ] **ANIM-05**: Swamp-o-meter animated gauge on leaderboard page

### Viral & Sharing

- [ ] **SHARE-01**: Shareable image cards for team, politician, standings, trade, and corruption data
- [ ] **SHARE-02**: "Powered by Alva" branding on all share cards
- [ ] **SHARE-03**: Invite friends flow — create league, get shareable link
- [ ] **SHARE-04**: Weekly recap email mockup (design only)

### Platform Showcase

- [ ] **PLAT-01**: "Data Sources" footer on every page showing Alva Skills used
- [ ] **PLAT-02**: "Build Your Own" CTA linking to alva.ai/skills
- [ ] **PLAT-03**: Developer mode toggle showing which Alva Skill powers each data element with dashed borders and tooltips

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Multiplayer

- **MULTI-01**: Real user authentication with email/password
- **MULTI-02**: Persistent backend with database for leagues and rosters
- **MULTI-03**: Real-time matchup updates via WebSocket
- **MULTI-04**: Push notifications for new trade disclosures

### Advanced Analytics

- **ANLYT-01**: Prediction model for which politicians will trade next
- **ANLYT-02**: Historical data going back beyond 2 years
- **ANLYT-03**: Custom scoring rule configuration per league

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Real authentication/accounts | Prototype uses localStorage — full auth is weeks of backend work |
| Real multiplayer backend | Simulated with pre-populated data — real multiplayer is a full product |
| Investment advice framing | Legal liability — securities law concerns. Frame as entertainment only |
| Prediction markets / betting | Active regulatory scrutiny — keep as pure fantasy scoring |
| Push notifications | Requires service workers and backend push service — overkill for prototype |
| Social feed / comments | Moderation burden and toxicity risk — share to external platforms instead |
| Real-time WebSocket updates | STOCK Act has 45-day disclosure lag — no real-time data exists to push |
| Native mobile app | Web responsive covers mobile — native app is a separate product |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| DATA-01 | Phase 1 | Complete |
| DATA-02 | Phase 1 | Complete |
| DATA-03 | Phase 1 | Complete |
| DATA-04 | Phase 1 | Complete |
| DATA-05 | Phase 1 | Complete |
| SCORE-01 | Phase 1 | Complete |
| SCORE-02 | Phase 1 | Complete |
| SCORE-03 | Phase 1 | Complete |
| SCORE-04 | Phase 1 | Complete |
| SCORE-05 | Phase 1 | Complete |
| SCORE-06 | Phase 1 | Complete |
| CORR-01 | Phase 1 | Complete |
| CORR-02 | Phase 1 | Complete |
| CORR-03 | Phase 1 | Complete |
| DEMO-01 | Phase 1 | Complete |
| DEMO-02 | Phase 1 | Complete |
| DEMO-03 | Phase 1 | Complete |
| DEMO-04 | Phase 1 | Complete |
| UI-01 | Phase 1 | Complete |
| UI-02 | Phase 1 | Complete |
| UI-03 | Phase 1 | Complete |
| LAND-01 | Phase 2 | Pending |
| LAND-02 | Phase 2 | Pending |
| LAND-03 | Phase 2 | Pending |
| LAND-04 | Phase 2 | Pending |
| DIR-01 | Phase 2 | Complete |
| DIR-02 | Phase 2 | Complete |
| DIR-03 | Phase 2 | Complete |
| DIR-04 | Phase 2 | Complete |
| PROF-01 | Phase 2 | Complete |
| PROF-02 | Phase 2 | Complete |
| PROF-03 | Phase 2 | Complete |
| PROF-04 | Phase 2 | Complete |
| PROF-05 | Phase 2 | Complete |
| FEED-01 | Phase 2 | Complete |
| FEED-02 | Phase 2 | Complete |
| FEED-03 | Phase 2 | Complete |
| FEED-04 | Phase 2 | Complete |
| LEAD-01 | Phase 2 | Complete |
| LEAD-02 | Phase 2 | Complete |
| LEAD-03 | Phase 2 | Complete |
| UI-04 | Phase 2 | Complete |
| UI-05 | Phase 2 | Complete |
| UI-06 | Phase 2 | Complete |
| DASH-01 | Phase 3 | Pending |
| DASH-02 | Phase 3 | Pending |
| DASH-03 | Phase 3 | Pending |
| DASH-04 | Phase 3 | Pending |
| DASH-05 | Phase 3 | Pending |
| TEAM-01 | Phase 3 | Pending |
| TEAM-02 | Phase 3 | Pending |
| TEAM-03 | Phase 3 | Pending |
| TEAM-04 | Phase 3 | Pending |
| TEAM-05 | Phase 3 | Pending |
| LEAG-01 | Phase 3 | Complete |
| LEAG-02 | Phase 3 | Complete |
| LEAG-03 | Phase 3 | Complete |
| DRAFT-01 | Phase 4 | Pending |
| DRAFT-02 | Phase 4 | Pending |
| DRAFT-03 | Phase 4 | Pending |
| DRAFT-04 | Phase 4 | Pending |
| ANIM-01 | Phase 5 | Pending |
| ANIM-02 | Phase 5 | Pending |
| ANIM-03 | Phase 5 | Pending |
| ANIM-04 | Phase 5 | Pending |
| ANIM-05 | Phase 5 | Pending |
| SHARE-01 | Phase 5 | Pending |
| SHARE-02 | Phase 5 | Pending |
| SHARE-03 | Phase 5 | Pending |
| SHARE-04 | Phase 5 | Pending |
| PLAT-01 | Phase 5 | Pending |
| PLAT-02 | Phase 5 | Pending |
| PLAT-03 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 62 total
- Mapped to phases: 62
- Unmapped: 0

---
*Requirements defined: 2026-03-23*
*Last updated: 2026-03-23 after roadmap creation*
