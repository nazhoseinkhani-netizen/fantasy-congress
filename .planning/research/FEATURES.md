# Feature Research

**Domain:** Gamified congressional stock trading app (fantasy sports + political transparency)
**Researched:** 2026-03-23
**Confidence:** HIGH (fantasy sports features), MEDIUM (hybrid gamified political transparency features)

---

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = product feels incomplete.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Politician directory with photos | Fantasy sports always have a player pool with real athlete images; political transparency tools always have browsable politician lists | LOW | Must use real official congressional portraits (bioguide.congress.gov) — placeholders kill credibility |
| Individual politician profile pages | Every fantasy platform has player detail pages with stats; every trading tracker has politician-level drill-down | MEDIUM | Core tabs: Fantasy Stats, Trading History, and Corruption Dossier are differentiated; basic bio + recent trades is table stakes |
| Live trade feed | Capitol Trades and Unusual Whales both surface a chronological feed of recent disclosures; users arrive expecting this | MEDIUM | STOCK Act disclosures have 45-day lag — "live" means recent filings, not real-time market data |
| Performance rankings / leaderboard | Quiver Quantitative leads with 1-year return rankings; Yahoo/ESPN both have standings tables | LOW | Table stakes for both parent domains |
| Scoring system with point totals | Core mechanic of all fantasy sports — users expect points, not raw dollar returns | MEDIUM | Must translate dollar trades into a legible fantasy point rubric |
| Weekly matchup view | Every season-long fantasy platform (ESPN, Yahoo) has head-to-head weekly matchups as primary engagement loop | MEDIUM | For the prototype: pre-populated simulated matchups suffice |
| Roster management (active/bench slots) | Fantasy users expect to set a lineup each week — bench vs. starters is a defining mechanic | MEDIUM | Salary cap constraint adds depth; even simulated requires logical slot rules |
| League standings / schedule | Season-long fantasy users expect a full standings table and a schedule of past/future matchups | LOW | Pre-populated demo data makes this straightforward to implement |
| Draft experience | Drafting is THE ritual entry point of season-long fantasy — no draft = no attachment to roster | HIGH | Snake draft format with AI-controlled opponents is the standard; simulated AI picks are required |
| Stats and performance breakdowns | Both domains show trade history, return %, and portfolio composition | MEDIUM | Per-politician: trade count, total traded value, return since trade, sector concentration |
| Responsive design | All competitors are multi-platform; users expect mobile-readable layouts even if desktop-primary | MEDIUM | Desktop primary, mobile secondary per project constraints |
| Pre-populated / explorable state | A blank app with no data is unusable for a demo — real data must be present from first load | HIGH | Critical for the Alva prototype goal — needs 50-100+ politicians with real trade histories |

### Differentiators (Competitive Advantage)

Features that set this product apart. Not required by baseline expectations, but create the viral + "wow" reaction.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Corruption Index | Synthesizes trade timing, volume, sector concentration, and legislative conflict-of-interest into a single scannable score — pure shareability fuel | HIGH | No competitor does this. Quiver shows raw returns; Unusual Whales shows trade counts. A named "score" with tiers (e.g., Squeaky Clean / Suspicious / Full Swamp) is novel |
| Scoring bonuses and badges | "Insider Trade Bonus," "Pre-Legislation Buy," "STOCK Act Violator" badges attached to individual trades make raw data entertaining | MEDIUM | DraftKings uses captain multipliers; this adapts that pattern to political data. Badges are unique to this domain |
| Share card generation | One-tap image card for a politician's stats, a corruption dossier, or a weekly team score — designed for Twitter/X virality | MEDIUM | FanArena and DraftKings both have shareable content; applying it to a corruption profile card is novel and provocative |
| "Hall of Shame" leaderboard | Ranks politicians by Corruption Index rather than financial returns — flips the metric from "who made money" to "who behaved worst" | LOW | Competitor trackers rank by return. Hall of Shame reframes the product around accountability, not investment advice |
| Developer mode / API visualization Easter egg | Clicking a hidden trigger reveals the Alva data pipeline — which API calls power which cards | LOW | Unique to this prototype. Demonstrates platform thesis to Alva leadership. No user-facing analogue exists in competitors |
| Salary cap draft mechanic | Assigning salary values to politicians based on their trading volume and corruption index forces strategic trade-offs | HIGH | DraftKings uses $50K salary caps for DFS. Applying this to politicians — "Pelosi costs 8,500 cap; freshman backbencher costs 1,200" — is novel and strategically engaging |
| Party affiliation matchups | League matchups framed as "Democrats vs. Republicans" weekly face-offs add political flavor | LOW | Unusual Whales tracks by party but doesn't gamify it. Adds satirical punch to the matchup view |
| Corruption Dossier tab | Per-politician: timeline of suspicious trades, STOCK Act violation history, relevant legislation they voted on | HIGH | Quiver shows portfolio and returns; Capitol Trades shows trade history. A "dossier" framing with narrative context is differentiated |
| Simulated league with AI opponents | Pre-built leagues with named AI opponents (e.g., "The Swamp Monsters," "Bipartisan Bulls") provide immediate social proof and explorable competition | MEDIUM | Needed because there's no real multiplayer backend; done well, feels like a real product rather than a demo |
| Weekly recap / newsletter mockup | Design-only email card showing team performance, top scoring trade of the week, and corruption highlight | LOW | ESPN and Yahoo both have weekly recap emails; this applies the format to congressional satire |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but create complexity, legal exposure, or scope creep that kills the prototype.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Real-time WebSocket trade updates | "Live" feeds feel more exciting and urgent | STOCK Act disclosures have up to 45-day lag — there is no real-time data to push. WebSocket infrastructure adds backend complexity for zero data benefit | Page-load refresh of recent disclosures; show "as of [date]" timestamps clearly |
| Real user authentication + accounts | Users want to save their team and come back | Full auth requires backend, session management, security hardening, email flows — weeks of work for a prototype | localStorage for prototype state; pre-populated demo user with a named team already built |
| Real multiplayer leagues | Competing against real people is core to fantasy sports | Real multiplayer requires matchmaking, real-time sync, backend API, user management — this is a full product, not a prototype | Pre-populated AI opponents with named personas; simulated league history that feels real |
| Investment advice framing | Users may want "trade like Congress" signals | Legal liability — any implication that the app recommends trades triggers securities law concerns | Frame explicitly as entertainment and political accountability, not investment advice. Add a visible disclaimer |
| Prediction markets / betting | Natural extension of the "who will trade next" curiosity | Active regulatory scrutiny in 2025-2026 (Kalshi, Polymarket challenges); adds compliance complexity and legal risk | Keep as pure fantasy scoring — points, not dollars wagered |
| Full historical data (back to 2000+) | Power users want long-term research capability | Parsing, cleaning, and serving decades of STOCK Act predecessor data is a data engineering project, not a feature | Focus on current Congress + 2 prior years; label scope clearly |
| Push notifications | Alerts for new trades feel engaging | Requires notification permissions, service workers, and a backend push service — over-engineered for a prototype | In-app "new trades since your last visit" badge on the feed; no push needed |
| Social feed / comments | Community features increase engagement | Moderation burden, toxicity risk, significant frontend complexity | Share cards push content to real social platforms (Twitter/X, Reddit) — outsource the social graph |

---

## Feature Dependencies

```
Scoring Engine
    └──requires──> Politician Trade Data (Alva Skills API)
                       └──requires──> Politician Directory (canonical list with IDs)

Politician Profile Pages
    └──requires──> Politician Directory
    └──requires──> Scoring Engine (to show fantasy point totals)

Corruption Index
    └──requires──> Politician Trade Data
    └──requires──> Scoring Engine (base scores as inputs)
    └──enhances──> Hall of Shame Leaderboard
    └──enhances──> Share Cards (corruption-focused card variant)

Draft Room
    └──requires──> Politician Directory (player pool)
    └──requires──> Salary Cap Values (derived from Corruption Index + trading volume)
    └──requires──> AI Draft Logic (simulated opponents)

Weekly Matchup View
    └──requires──> Draft Room (rosters must exist)
    └──requires──> Scoring Engine (weekly point totals)
    └──requires──> League Standings (opponent roster)

League Standings
    └──requires──> Draft Room (team assignments)
    └──requires──> Weekly Matchup View (cumulative scores)

Share Cards
    └──requires──> Politician Profile Pages (data source)
    └──requires──> Corruption Index (for dossier cards)
    └──enhances──> Viral growth loop

Developer Mode Easter Egg
    └──requires──> Any feature using Alva API (surfaces API calls made)
    └──conflicts──> Production polish phase (reveal too early = confusing to non-Alva users)

Live Trade Feed
    └──requires──> Politician Trade Data
    └──enhances──> Badges (trade-level bonus detection)
    └──enhances──> Politician Profile Pages (recent activity)

Badges / Bonuses
    └──requires──> Scoring Engine
    └──requires──> Live Trade Feed (trade-level event detection)
```

### Dependency Notes

- **Scoring Engine requires Politician Trade Data:** The engine cannot calculate points until raw STOCK Act disclosure data (trade date, ticker, amount, direction) is available from Alva.
- **Corruption Index requires Scoring Engine:** The index synthesizes multiple scoring signals — it's a derived metric, not a raw data field.
- **Draft Room requires Salary Cap Values:** Salary values must be assigned before the draft can run — this is a design/data decision that precedes the UI.
- **Weekly Matchup requires Draft Room:** Head-to-head matchups only exist once rosters are formed; the demo's pre-populated teams satisfy this.
- **Share Cards enhance viral loop:** Cards are not required for the core product but are a multiplier on distribution — schedule them after core profile pages.
- **Developer Mode conflicts with early phases:** The Easter egg should be built last — revealing incomplete data pipelines during early demos undermines the Alva pitch.

---

## MVP Definition

### Launch With (P1 — Makes a compelling demo alone)

- [ ] Politician directory — browsable cards with photos, trading stats, and corruption tier badge
- [ ] Live trade feed — scrollable feed of recent STOCK Act disclosures with score and bonus badges
- [ ] Individual politician profiles — Fantasy Stats + Trading Profile + Corruption Dossier tabs
- [ ] Hall of Shame leaderboard — politician rankings by Corruption Index and by return
- [ ] Scoring engine — translates real trade data into fantasy points with bonuses and penalties
- [ ] Landing page — communicates value proposition, previews the product, has CTA

### Add After P1 Validation (P2 — Adds the "fantasy sports" depth)

- [ ] User dashboard — pre-populated team, weekly matchup scoreboard, season KPIs
- [ ] My Team roster view — active/bench slots, per-player scoring breakdown
- [ ] League standings + schedule — standings table, past matchups, upcoming schedule
- [ ] Pre-populated demo data — 3 leagues, 6 weeks of simulated results, AI opponent rosters

### Future Consideration (P3 — Polish and virality)

- [ ] Draft room — simulated snake draft against AI opponents
- [ ] Share card generation — politician cards and team performance cards for social sharing
- [ ] Developer mode / API visualization Easter egg
- [ ] Weekly recap mockup — design-only email card

---

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Politician directory with photos | HIGH | LOW | P1 |
| Live trade feed | HIGH | MEDIUM | P1 |
| Individual politician profiles | HIGH | MEDIUM | P1 |
| Hall of Shame leaderboard | HIGH | LOW | P1 |
| Scoring engine | HIGH | HIGH | P1 |
| Landing page | HIGH | LOW | P1 |
| Corruption Index | HIGH | HIGH | P1 |
| User dashboard / matchup scoreboard | HIGH | MEDIUM | P2 |
| My Team roster management | MEDIUM | MEDIUM | P2 |
| League standings + schedule | MEDIUM | LOW | P2 |
| Pre-populated demo data | HIGH | HIGH | P2 |
| Draft room (snake draft + AI) | HIGH | HIGH | P3 |
| Share card generation | HIGH | MEDIUM | P3 |
| Badges / bonus labels on trades | MEDIUM | LOW | P2 |
| Developer mode Easter egg | MEDIUM | LOW | P3 |
| Weekly recap mockup | LOW | LOW | P3 |
| Party affiliation matchup framing | LOW | LOW | P2 |

**Priority key:**
- P1: Must have — standalone compelling demo for Alva leadership
- P2: Should have — adds the fantasy sports product depth
- P3: Nice to have — polish, virality, and Alva platform showcase

---

## Competitor Feature Analysis

| Feature | ESPN / Yahoo (season-long) | DraftKings (DFS) | Quiver Quantitative | Unusual Whales / Capitol Trades | Our Approach |
|---------|---------------------------|------------------|--------------------|---------------------------------|--------------|
| Player/politician directory | Full roster pool with stats | Player pool with salary | Politician search with portfolio | All politicians, filterable by party/chamber | Directory with Corruption Index tiers + photos |
| Scoring system | Points from real-game stats | $50K salary cap, pts per stat | 1-year return % | No scoring — raw data only | Custom scoring: base pts for trade volume + bonuses for timing + penalties for violations |
| Draft mechanic | Snake or auction draft | Single-session lineup build | N/A | N/A | Simulated snake draft vs. AI opponents with salary cap |
| Leaderboard | League standings, weekly | Contest standings | 1-year return ranking | Most active traders, party comparisons | Hall of Shame (Corruption Index rank) + return rank |
| Individual profile depth | Player stats, news, projections | Player stats, ownership % | Portfolio, trades, net worth, donors | Trade history, sector breakdown, STOCK Act violations | Fantasy Stats + Trading Profile + Corruption Dossier (deepest narrative framing in category) |
| Social / sharing | Share team score, invite to league | Share lineup, refer friends | N/A | Annual report PDFs | Share cards for politician dossiers, team scores — designed for Twitter/X virality |
| Mobile experience | Mobile-first apps | Mobile-first | Functional mobile | Functional mobile | Desktop primary, responsive mobile secondary |
| Gamification beyond scoring | Badges, trade notifications | Captain multiplier (1.5x) | N/A | N/A | Badges per trade (Insider Trade, Pre-Legislation Buy, STOCK Act Violator) + Corruption tiers |
| Data transparency | Player injury/news feeds | Live lock status | Links to raw SEC filings | Links to original STOCK Act filings | Developer mode Easter egg shows Alva API calls powering each card |

---

## Sources

- [ESPN Fantasy Football 30th Anniversary Features (2025)](https://espnpressroom.com/us/press-releases/2025/08/espn-fantasy-football-30th-anniversary-new-design-new-features-all-new-fantasy-app-for-2025/)
- [ESPN Fantasy App What's New in 2025](https://support.espn.com/hc/en-us/articles/39732027887764-ESPN-Fantasy-App-What-s-New-in-2025)
- [DraftKings Daily Fantasy Contest Rules & Scoring](https://draftkings1452613992.zendesk.com/hc/en-us/articles/4402266096787-Daily-Fantasy-Contest-Rules-Scoring-overview)
- [Quiver Quantitative Politician Directory](https://www.quiverquant.com/politicians/)
- [Unusual Whales Congress Trading Tracker](https://unusualwhales.com/politics)
- [Unusual Whales Congress Trading Report 2025](https://unusualwhales.com/congress-trading-report-2025)
- [Capitol Trades — What Is It](https://themoneytimes.media/2025/06/14/what-is-capitol-trades-the-website-providing-insights-into-politician-trading-activity/)
- [Capitol Trades Politician Directory](https://www.capitoltrades.com/politicians)
- [Fantasy Congress (fantasycongress.com)](https://fantasycongress.com/)
- [Fantasy Sports Gamification Trends 2025](https://www.a3logics.com/blog/fantasy-sports-app-trends/)
- [How Social Media Is Transforming Fantasy Sports](https://www.gamingtoday.com/news/social-media-reshaping-sports-betting-and-fantasy-sports/)
- [FanArena Shareable Social Visuals for Fantasy Sports](https://fanarena.com/generate-social-media-visuals-for-fantasy-sports-with-1-click/)
- [Congress Beat the Market 2025 — Independent Institute](https://www.independent.org/article/2026/02/16/congress-beat-stock-market-2025/)

---
*Feature research for: Fantasy Congress — gamified congressional stock trading app*
*Researched: 2026-03-23*
