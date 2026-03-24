# Fantasy Congress — Playbook Context for Email Response

## What Was Built

**Fantasy Congress** is a fully functional fantasy sports web application where players draft US politicians and compete based on their real-world Congressional stock trading performance. It's built entirely on Alva's data infrastructure as a proof-of-concept that Alva Skills can power consumer-grade applications — not just dashboards.

**Live tech stack:** Next.js 16, React, Tailwind CSS, Framer Motion, Recharts, Zustand, deployed as static export to Vercel.

## How It Uses Alva Skills

The app's entire data pipeline is powered by Alva:

1. **`getSenatorTrades` (senator-trading:v1.0.0)** — Fetches real Congressional stock trade disclosures (STOCK Act filings). This is the core data source — every trade in the app is a real disclosure from a real member of Congress.

2. **Stock price data via Alva** — Historical OHLCV data for calculating actual returns vs S&P 500 benchmark. Each trade gets a real performance score based on how the stock moved after the politician traded it.

3. **The scoring engine** applies fantasy sports mechanics on top of real Alva data:
   - Base points for beating/losing to S&P 500
   - Excess return bonus (2x the return vs S&P)
   - Amount multiplier (larger trades = higher stakes)
   - Position multiplier (committee chairs get 1.5x, leadership gets 1.3x)
   - Bonus badges: Insider Timing, Donor Darling, Big Mover, Bipartisan Bet
   - Penalties: Late Disclosure, Paper Hands, Wash Sale

4. **"Powered by Alva" branding** — Every page has an AlvaFooter showing "Data Sources: Alva Skills API" with a "Build Your Own" CTA linking to alva.ai/skills.

5. **Developer Mode Easter Egg (Ctrl+Shift+D)** — Reveals which Alva Skill powers each data element with dashed borders and tooltips. Every data-driven component has a `data-alva-skill` attribute showing the specific API call.

## What the App Contains (Features Built)

### Phase 1: Foundation
- Data pipeline: fetches 119 politicians from Congress.gov, 97 real trades from Alva, validates photos, computes scores
- Scoring engine: pure TypeScript, deterministic, unit-testable
- Insider Trading Risk Score (0-100): composite of donor overlap, suspicious timing, committee conflicts, STOCK Act compliance, trade volume → maps to 5 tiers (Clean Record → Peak Swamp)
- Demo data: 3 pre-built leagues, 6 weeks of simulated matchups, user pre-assigned to a team
- Dark mode design system (DraftKings-meets-political-satire aesthetic)

### Phase 2: Discovery
- Landing page with hero, "How It Works", featured politician cards
- Politician directory: searchable, filterable by party/chamber/state, sortable grid
- Politician profiles: 4 tabs (Fantasy Stats with trade log, Trading Profile with sector analysis & equity curve, Corruption Dossier with radar chart, News & Disclosures)
- Live trade feed: Twitter-style cards with bonus badges, filters, trending sidebar
- Leaderboard: Hall of Shame (by points), Corruption Rankings (by risk score), Swamp Lords (fantasy managers)

### Phase 2.1: Real Data Pipeline
- Replaced all simulated trades with real Alva `getSenatorTrades` data
- Real stock price returns calculated via Alva
- Trade deduplication (API returned 10,000 records, 99% duplicates → 97 unique trades)

### Phase 3: Game Experience
- Dashboard: KPIs, matchup scoreboard, roster view, trade feed sidebar
- My Team: active roster + bench, drag-and-drop, scoring breakdown
- League: standings, full schedule, activity feed

### Phase 4: Draft Room
- Full snake draft against 3 AI opponents (Value Hunter, Corruption Chaser, Party Loyalist archetypes)
- Salary cap system ($50k budget, politicians priced $500-$10,000 by tier)
- 60-second pick timer with auto-pick
- Pick ticker showing all selections

### Phase 5: Polish and Viral
- Animations: draft pick fly-to-roster with burst particles, trade alert slide-ins, digit-flip counters, animated corruption gauge (green-to-red sweep with spring overshoot)
- Swamp-o-meter: aggregate corruption gauge on leaderboard with scroll-triggered animation
- Share cards: html-to-image PNG generation for politician cards and team cards, with iOS Safari workaround (triple-call bug), share modal with download/copy link/native Web Share API
- "Powered by Alva" branding on all share cards
- Developer Mode Easter egg (Ctrl+Shift+D): dashed borders + tooltips showing Alva Skills attribution
- Weekly recap email mockup at /share/weekly-recap
- AlvaFooter on every page with "Build Your Own" CTA

## Why This Playbook Was Created (Strategic Rationale)

### 1. Proves the Platform Thesis
Alva's positioning challenge: most users see it as "a dashboard builder." Fantasy Congress proves Alva is an **API-powered ecosystem** capable of powering standalone consumer applications. The senator trading data isn't displayed in a chart — it's the engine behind a gamified product with its own UX, scoring system, and viral mechanics.

### 2. Demonstrates Viral Distribution
Every feature is designed to pull new users toward Alva:
- **Share cards** with "Powered by Alva" reach non-Alva audiences on social media
- **Developer Mode** lets curious builders see exactly which API calls power each element
- **"Build Your Own" CTA** converts attention into platform signups
- **League invites** — each player invites 5-10 friends, each of whom sees Alva branding

### 3. Taps Into Cultural Moment
Congressional stock trading is a hot-button issue (STOCK Act enforcement, Nancy Pelosi memes, bipartisan outrage). This app rides that wave and makes Alva the infrastructure behind the conversation.

### 4. Shows Alva Skills' Range
The app uses financial data (stock prices, returns), government data (Congress.gov API, STOCK Act filings), and computed analytics (scoring engine, risk indices) — demonstrating that Alva Skills span multiple domains, not just one vertical.

## Criteria for Developing Growth Playbooks

Based on building Fantasy Congress, here are the criteria that make a playbook effective for growth:

1. **Cultural relevance** — Tap into something people are already talking about. Congressional trading was already viral on Twitter/Reddit. The playbook didn't create demand — it channeled existing attention through Alva's platform.

2. **Inherent virality** — Every interaction should have a sharing surface. Share cards, league invites, corruption rankings — users spread the product organically. "Powered by Alva" rides along.

3. **Builder inspiration** — The playbook should make developers think "I could build something like this." Developer Mode and visible API attribution convert viewers into creators.

4. **Data uniqueness** — Use Alva data that's hard to get elsewhere. Senator trading disclosures + real-time stock prices + committee data creates a dataset no one else has assembled this way.

5. **Production quality** — It must feel like a real product, not a demo. Dark mode, real photos, animations, responsive design. People don't share demos — they share products they enjoy using.

6. **Low friction** — No signup required. Pre-populated data means instant exploration. Users see value in seconds, not minutes.

7. **Platform showcase without platform dependency** — The app stands alone as valuable, but every surface subtly introduces Alva. The branding is earned through utility, not forced.

## Content-Driven Growth Strategy for Alva

### Playbook-as-Content Pipeline
1. **Build publicly** — Document the creation process as content (blog posts, Twitter threads, YouTube). "How I built a fantasy sports app on Alva in 48 hours" is inherently shareable.
2. **Template gallery** — Each playbook becomes a template others can fork. Fantasy Congress → "Fantasy [Industry]" framework.
3. **Creator spotlight** — Feature builders who create playbooks. Their audience becomes Alva's audience.

### Vertical Playbook Strategy
Create one killer playbook per vertical Alva serves:
- **Finance**: Fantasy Congress (done) → Congressional trading gamification
- **Crypto**: "Whale Watch" → track and gamify large on-chain transactions
- **Macro**: "Fed Bingo" → predict and score Federal Reserve meeting outcomes
- **Social**: "Influencer Index" → fantasy league for social media creator performance

Each playbook proves Alva works in that vertical and attracts domain-specific creators.

### Distribution Channels
- **Reddit/Twitter** — Congressional trading content goes viral in r/wallstreetbets, r/politics, FinTwit
- **Product Hunt** — Launch each playbook as its own product
- **Dev communities** — Developer Mode and open architecture attract builders on HN, Dev.to
- **Newsletters** — Partner with finance/politics newsletters for featured coverage

### Flywheel
Playbook attracts users → Users see "Powered by Alva" → Curious builders try Alva Skills → Builders create new playbooks → New playbooks attract new users → Repeat

## Technical Details for Reference

- **119 real politicians** with official Congressional photos
- **97 unique real trades** from Alva's senator-trading API (after deduplication)
- **5 Insider Risk tiers**: Clean Record → Minor Concerns → Raised Eyebrows → Seriously Suspicious → Peak Swamp
- **6 salary tiers**: Elite ($8k-$10k) → Starter → Mid-tier → Bench → Sleeper → Unranked ($500)
- **62 v1 requirements** across 13 categories, all implemented
- **5 phases** of development, all complete
- **Static export** — no server required, deploys to Vercel/Netlify as static files
