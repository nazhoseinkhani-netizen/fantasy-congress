# Pitfalls Research

**Domain:** Gamified political data web app (fantasy sports + congressional stock trading)
**Researched:** 2026-03-23
**Confidence:** HIGH (multiple sources verified across all critical areas)

---

## Critical Pitfalls

### Pitfall 1: Congressional Trade Data Has Structural Gaps You Cannot Fix

**What goes wrong:**
The app presents itself as authoritative on congressional trading, but the underlying STOCK Act data is fundamentally incomplete by design. Members have 45 days to disclose trades, routinely file late (Rep. Val Hoyle disclosed 217 trades months late in 2025), and some never file at all — then the trades appear only in annual disclosure forms. A politician's "current" score on your leaderboard may be missing weeks or months of actual trades.

**Why it happens:**
Developers assume the disclosure data reflects actual trading behavior. It does not. The STOCK Act has $200 penalties with zero enforcement, so non-compliance is common. Data sources like Capitol Trades, Quiver Quantitative, and the Senate eFD system all acknowledge their data may be incomplete or inaccurate.

**How to avoid:**
- Surface data freshness explicitly on every score. Label it "as of last disclosure" not "live."
- Add a disclosure lag indicator on politician cards: "Last disclosure: 47 days ago — score may undercount recent trades."
- Treat high-frequency traders as reliably scored; low-disclosure politicians as suspect.
- Never present a "total trades this session" number without a footnote about known disclosure gaps.
- Cache data proactively at build time — don't count on real-time API calls to paper over gaps.

**Warning signs:**
- A well-known active trader (e.g., Nancy Pelosi, Brian Mast) showing zero trades for 60+ days
- Score totals that don't match independent news reports about known trades
- Any politician who "retires" mid-session still appearing on active rosters with stale data

**Phase to address:**
Data layer / Scoring Engine phase. Establish data provenance conventions before any UI is built. Every score display should know its source timestamp.

---

### Pitfall 2: Photo Dependency Breaks the Entire Product Feel

**What goes wrong:**
The project explicitly states "real politician photos everywhere — no placeholders" as critical for virality and realism. The unitedstates/images GitHub repo (the canonical source) has documented gaps: newly sworn-in members take weeks to get official GPO photos, freshmen senators regularly have no photos at all, and the bioguide URL pattern (`https://bioguide.congress.gov/bioguide/photo/[letter]/[bioguide_id].jpg`) is not guaranteed to be stable or complete.

**Why it happens:**
Photo availability is tied to the Government Publishing Office release cycle, not Congress swearing-in dates. Developers build photo displays assuming 100% coverage, then ship with broken `<img>` tags or blank gray boxes for 10-15% of politicians.

**How to avoid:**
- Build a photo validation step into the data pipeline. During data seeding, check every bioguide ID for a valid image response.
- Maintain a fallback chain: bioguide.congress.gov → unitedstates/images on GitHub Pages → official congressional portrait directory → styled initials avatar (never a generic silhouette).
- For the MVP roster of 50-100 politicians, manually confirm every photo exists before launch.
- Store photo URLs in the data layer, not hardcoded in components, so swaps are single-field updates.
- Never render a broken `<img>` tag — use `onError` handlers universally.

**Warning signs:**
- Any politician card rendering a browser default broken image icon
- Newly elected members added to the dataset without photo validation
- The `unitedstates/images` repo has open issues about missing members (it does — issue #125 documented this)

**Phase to address:**
Politician Directory / Data seeding phase. Photo validation must be part of the data build script, not a UI concern.

---

### Pitfall 3: Scoring Engine Logic Diverges From the UI That Displays It

**What goes wrong:**
The scoring system has base points, bonuses, penalties, and multipliers. Developers implement scoring logic in one place (a utility function), then build UI score displays that partially reimplement or shortcut the same logic for display purposes. After a few iterations, the number shown on a politician card, their profile page, the leaderboard, and the matchup scoreboard are all slightly different because they're computed differently.

**Why it happens:**
Pressure to show "a score" early leads to quick display math. The authoritative scoring function gets written later. By then, display components have diverged. This is the #1 cause of user trust destruction in fantasy sports — ESPN and Yahoo both have documented score correction flows because of this.

**How to avoid:**
- Write the canonical scoring engine first, before any UI. It is a pure function: `scorePolitician(trades[], rules) => ScoringBreakdown`.
- Every score displayed anywhere in the app must call this function or display its cached output. Zero exceptions.
- The `ScoringBreakdown` type should include: basePoints, bonusPoints, penaltyPoints, multiplier, total, and a human-readable breakdown array for the "scoring breakdown" UI.
- Write unit tests for scoring edge cases before building the first UI component that shows a score.

**Warning signs:**
- A politician's score on their profile page differs from their score on the leaderboard by any amount
- "Points breakdown" tooltip shows different math than the headline number
- Any component doing arithmetic on scores instead of calling the scoring function

**Phase to address:**
Scoring Engine milestone (before Dashboard/Team UI). The engine must be locked before UI is built around it.

---

### Pitfall 4: The Corruption Index Becomes Legally and Reputationally Risky

**What goes wrong:**
The Corruption Index is designed as the app's primary viral mechanic, but calling a real, named US politician "corrupt" using a proprietary algorithm exposes the product to defamation risk, political blowback, and editorial credibility attacks. Critics will ask: "By whose definition? Who built this algorithm? What's the methodology?" If the index is perceived as partisan, media coverage will focus on the controversy rather than the product.

**Why it happens:**
Developers focus on the fun, shareable output ("Senator X has a 94 corruption score!") without thinking through the inputs. Globally, corruption indices like Transparency International's face criticism for subjective variable selection, expert bias, and the fundamental problem that perception ≠ actual corruption. The same critique applies here at 10x intensity because this targets named individuals.

**How to avoid:**
- Brand the metric precisely. Call it "Insider Trading Risk Score" or "Trading Transparency Score" — not "Corruption Index." This grounds it in disclosed factual data (late filings, trade volume around legislation, stock performance correlation) rather than moral judgment.
- Make the methodology fully visible. The score card should show: "Score based on: late disclosures (x2 weight), trades adjacent to committee votes (x3 weight), total trade volume (x1 weight)." No black box.
- Lean on facts that are unambiguous: disclosure timing, trade frequency, sector concentration. Avoid soft inputs like "questionable timing" judgments.
- Add a small disclaimer: "Scores based solely on public STOCK Act disclosures. Not a legal finding."
- The "hall of shame" framing is fine as satire, but keep it clearly tongue-in-cheek in the copy — don't imply criminality.

**Warning signs:**
- Any score component that can't be traced to a specific, citable public record
- Score formula that can be characterized as ideologically weighted (e.g., any variable that correlates with party affiliation without a non-partisan justification)
- No visible methodology explanation for end users

**Phase to address:**
Leaderboard / Politician Profile phase. Define the scoring formula in writing before building the UI that displays it.

---

### Pitfall 5: Demo Data Becomes a Maintenance Liability

**What goes wrong:**
The app uses pre-populated demo data (3 leagues, 6 weeks of results, 50-100 politicians) so it always looks complete. This data is seeded at build time and stored in static JSON or embedded in the app bundle. Six months after launch, the "current season" shows 2025 dates, trade data is stale, and the app feels like a ghost town demo rather than a live product. Worse, if real trading data gets pulled from an API, the pre-seeded simulated data gets out of sync with real politician scores.

**Why it happens:**
Demo data feels solved the moment it's generated. The maintenance cost only appears later. Fantasy sports prototypes with simulated seasons always face this: the "current week" in the demo needs to advance, scores need to reflect something vaguely plausible, and the narrative of "who's winning" needs to feel current.

**How to avoid:**
- Make "current week" relative, not absolute. Compute it as `week = floor((now - seasonStart) / 7) + 1`, not hardcoded as "Week 6."
- Separate real data (politician profiles, actual trade disclosures) from simulated data (league standings, matchup results). The former should pull from the API/cache; the latter can be static but should be date-relative.
- Build a data freshness indicator visible to Alva stakeholders: "Trade data last updated: [timestamp]."
- Pre-seed with 2026 congressional session dates, not past dates.
- Document exactly which data is real vs. simulated, so future maintainers know what needs updating.

**Warning signs:**
- Hardcoded week numbers or season dates in the codebase
- A "current matchup" that refers to a date in the past
- Politician scores in demo data that don't match their actual disclosed trade totals

**Phase to address:**
Data seeding / Demo data generation. Establish relative date logic from day one.

---

### Pitfall 6: localStorage Fails as the State Layer at Demo Scale

**What goes wrong:**
The app uses React state + localStorage as the only persistence layer. With 50-100 politicians, 3 leagues, 6 weeks of matchup data, trade history, scoring breakdowns, and user roster state, the localStorage payload approaches the 5-10MB browser limit. Beyond that, the synchronous blocking API causes jank on low-end devices, and race conditions between tabs can corrupt draft state during multi-step interactions.

**Why it happens:**
localStorage feels like the obvious no-backend choice. For truly simple state (a single user preference) it's fine. For a full fantasy sports app with relational data (leagues → teams → rosters → trades → scores), it's using a key-value store as a database.

**How to avoid:**
- Pre-compute and flatten all data at build time into minimal, denormalized JSON. Don't store raw relational data in localStorage — store only the user's current state delta (which team slot is benched, which view they're on).
- Keep the core data (politicians, trades, scores, league standings) in the app bundle as imported JSON constants, not in localStorage. localStorage should only store transient UI state.
- Calculate total localStorage payload during development. If it exceeds 1MB for baseline app state, refactor.
- Use `try/catch` around all localStorage reads/writes to handle quota errors gracefully.
- Never store redundant data. If you can derive a value from other stored data, don't store it.

**Warning signs:**
- Any component that serializes a full politician array into localStorage
- `localStorage.setItem` calls storing more than ~100KB of data
- Draft room state that would be lost if the user closes and reopens the tab mid-draft

**Phase to address:**
Architecture / Data layer phase. Define the data boundary (bundle vs. localStorage vs. runtime state) before building any feature.

---

### Pitfall 7: Virality Mechanics Are Designed But Never Actually Shareable

**What goes wrong:**
The app plans "share card generation for teams, trades, and corruption data" as a P3 feature. Share cards are frequently the last feature built and the first feature that feels broken in production. The generated image looks great in a desktop browser preview, then renders wrong on iOS Safari, gets clipped by the OG image scraper, or hits CORS errors when trying to canvas-render politician photos from external CDNs.

**Why it happens:**
Browser canvas rendering of images from cross-origin sources requires CORS headers. Official congressional photos from `bioguide.congress.gov` and GitHub Pages may not send the correct CORS headers for canvas use. The `html2canvas` / `dom-to-image` approach breaks differently on every browser. Developers test share cards on their own machine, not on mobile Twitter/Facebook previews.

**How to avoid:**
- Use `satori` + `@vercel/og` (or similar server-side image generation) rather than client-side canvas. Generates a PNG on the server where CORS is not a problem.
- Alternatively, proxy all politician photos through your own domain at build time — download and embed them in the static build.
- Test OG image previews using the Twitter Card Validator and Facebook Sharing Debugger before shipping.
- Allocate a full milestone to share card implementation — it is never a two-hour P3 task.

**Warning signs:**
- Share card code using `html2canvas` + cross-origin images
- No server function or API route for image generation
- Share card tested only in desktop Chrome

**Phase to address:**
Share Cards / Viral Mechanics phase. Must be planned as a real engineering task, not a polish item.

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Hardcode "current week" as a constant | Faster to build | Demo looks stale within weeks; demo dates don't advance | Never — use relative date computation from day 1 |
| Store full politician data in localStorage | Simpler state access | Hits 5MB quota; blocks main thread; corrupts on multi-tab | Never for bulk data — put it in the bundle |
| Compute scores inline in display components | Faster prototyping | Score drift between components; trust destruction | Never — scoring engine must be a shared pure function |
| Use html2canvas for share cards | Works in demo | CORS failures in production; broken on mobile | Only for internal screenshots never seen by end users |
| Infer photo URL without validation | No extra build step | Broken images for 10-15% of politicians | Never when "real photos everywhere" is a product requirement |
| Skip methodology docs for the corruption score | Faster to ship | First journalist or critic destroys the product narrative | Never — document the methodology concurrently with building it |
| Generate demo data with absolute 2025 dates | One-time effort | App feels abandoned within months | Only acceptable if app has explicit hard-coded season framing |

---

## Integration Gotchas

Common mistakes when connecting to external services.

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Alva Skills API | Making API calls at runtime from the browser (exposes API keys, hits CORS) | Call Alva API at build time in Next.js `getStaticProps` / `generateStaticParams`; bake data into static JSON |
| Alva Skills API | Assuming data is always available — no fallback if API is down at build time | Cache last-good API response; build fails gracefully with warning, not hard error |
| bioguide.congress.gov photos | Hotlinking directly to bioguide for photo `src` tags | Download and host photos locally or via CDN at build time; bioguide is not a CDN |
| unitedstates/images GitHub Pages | Assuming all bioguide IDs have a corresponding photo | Validate every bioguide ID against the repo index during data seeding |
| STOCK Act disclosure endpoints | Treating "no recent disclosure" as "no recent trades" | Model disclosure lag explicitly; show last disclosure date, not an implied "current" status |
| Next.js + Vercel static generation | Making hundreds of API calls during build (triggers rate limits) | Batch requests, add delays between calls, or pre-fetch data into a single JSON seed file |
| FEC donation data | Scraping FEC without respecting robots.txt / rate limits | Use FEC's official bulk data download or API with proper rate limiting |

---

## Performance Traps

Patterns that work at small scale but fail as usage grows.

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Loading all 535 politician records on every page | Slow initial load, poor Core Web Vitals | Paginate directory, lazy-load off-screen cards | Immediately for mobile users on 3G |
| Rendering politician photos without `loading="lazy"` | 50-100 simultaneous image requests on directory page | `loading="lazy"` on all below-fold images | On any page with more than ~12 politician cards |
| Computing leaderboard sort on every render | Visible sort jank when filtering/searching | Memoize sorted lists; compute once, cache result | ~50+ politicians in a filtered list |
| Storing full trade history in component state | Memory growth as user navigates; slow re-renders | Paginate trade history; only load visible window | Trade history > ~200 entries per politician |
| Unoptimized politician card grid with no virtualization | Scroll jank on full directory page | Use CSS `content-visibility: auto` or windowed list | Directory with 100+ politicians on mobile |

---

## Security Mistakes

Domain-specific security issues beyond general web security.

| Mistake | Risk | Prevention |
|---------|------|------------|
| Embedding Alva API key in client-side bundle | API key scraped by anyone viewing source; Alva account compromised | API calls must happen at build time (server-side only); never expose API keys in the browser bundle |
| No rate limiting on share card generation endpoint | Denial of service via automated share card generation; Vercel function costs spike | Add rate limiting to any server function that generates images |
| Serving politician photos directly from bioguide.congress.gov | Government domain blocks hot-linking; hotlink protection adds legal/ToS uncertainty | Host politician photos at your own domain or use an image CDN with proper caching |
| Using eval() or dangerouslySetInnerHTML for dynamic score display | XSS if any trade data includes script-injectable characters | Sanitize all data at ingestion; never use raw API response content as HTML |

---

## UX Pitfalls

Common user experience mistakes in this domain.

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Displaying raw STOCK Act disclosure amounts (ranges like "$1,001-$15,000") | Users confused by ranges; can't compare politicians meaningfully | Use range midpoints for scoring/display; label clearly as "estimated" with range shown in tooltip |
| Showing too many stats on politician cards (every available data point) | Cognitive overload; users can't identify who to draft | Lead with 3 fantasy-relevant stats: score rank, recent trade volume, "hot/cold" indicator. Progressive disclosure for full stats on profile page |
| Leaderboard that only shows top 10 | Users with low-scoring rosters disengage immediately | Show "Your Rank: #47 of 200" plus top 10; near-you segments keep mid-tier users engaged |
| Draft room with no undo or confirmation | Users accidentally draft the wrong politician; no recovery | Require confirmation for draft picks; allow swap within a time window |
| Scoring breakdown hidden behind multiple clicks | Users don't understand why their score is what it is | Inline expandable breakdown on every score display; demystify the math |
| Treating simulated leagues as obviously fake | Destroys the fantasy sports immersion that makes the app compelling | Make pre-populated league data feel fully real — real politician names, plausible matchup scores, convincing activity feeds |
| Points shown without context (is 47 good or bad?) | Users can't evaluate player value | Always show rank alongside absolute score; show season average; use relative indicators |

---

## "Looks Done But Isn't" Checklist

Things that appear complete but are missing critical pieces.

- [ ] **Politician Directory:** Photos appear to load — verify every photo has a valid HTTP 200 response, not just a rendered `<img>` tag that silently falls back to broken
- [ ] **Scoring Engine:** All components show the same score — verify the leaderboard, profile page, matchup scoreboard, and team view all call the same scoring function, not independent computations
- [ ] **Trade Feed:** Trades appear real-time — verify data freshness timestamp is visible and the stale-data warning triggers after the expected disclosure lag window
- [ ] **Share Cards:** Preview looks correct in browser — test with Twitter Card Validator and on an actual iOS device before declaring done
- [ ] **Draft Room:** Draft picks appear to work — verify state persists correctly across page refresh and that partial draft state doesn't corrupt the team view
- [ ] **Corruption/Transparency Score:** Score is displayed — verify methodology documentation exists and is visible to end users; score must be traceable to specific public records
- [ ] **Demo Data:** League standings look plausible — verify all dates are relative (not hardcoded to past dates), scores are internally consistent, and politician stats in demo match real disclosed trade data
- [ ] **localStorage:** App appears to work — test after clearing localStorage (first-time user experience), with a full draft in localStorage (returning user), and with localStorage at capacity (edge case)

---

## Recovery Strategies

When pitfalls occur despite prevention, how to recover.

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Trade data gaps discovered post-launch | LOW | Add disclosure-lag UI labels; recalculate scores with explicit "incomplete data" flags; no rewrite needed |
| Photo gaps discovered post-launch | LOW | Add `onError` fallback to all `<img>` tags pointing to styled initials avatar; run validation script to identify gaps; fix individually |
| Score divergence between UI components | MEDIUM | Audit all score-displaying components; replace inline math with canonical scoring function calls; add integration test |
| Corruption Index generates PR controversy | MEDIUM | Rename the metric; publish methodology; add "data methodology" page explaining inputs; framing change is faster than algorithm change |
| localStorage quota exceeded in production | HIGH | Migrate bulk data from localStorage to bundled JSON constants; redesign state layer to only persist user-specific delta state; requires data architecture rewrite |
| Share card CORS failures in production | MEDIUM | Switch to server-side image generation (`@vercel/og`); requires adding a server function but no data changes |
| Demo data feels stale post-launch | LOW | Replace hardcoded dates with relative date computation; refresh base trade data from API; one-day effort if date logic was abstracted |

---

## Pitfall-to-Phase Mapping

How roadmap phases should address these pitfalls.

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Congressional data gaps | Data layer / Scoring Engine | Every score display shows data freshness timestamp |
| Photo dependency fragility | Politician Directory / Data seeding | Automated validation confirms 200 OK for every bioguide photo URL |
| Scoring engine divergence | Scoring Engine (before UI) | All score displays produce identical output for same politician; unit tests pass |
| Corruption index legal/editorial risk | Leaderboard / Profile phase | Methodology page exists; metric name avoids legal conclusions; traceable inputs |
| Demo data staleness | Data seeding / Architecture | Zero hardcoded dates in codebase; "current week" computed from season start constant |
| localStorage overflow | Architecture / Foundation | Total localStorage payload measured and under 500KB at demo scale |
| Share card CORS failures | Share Cards / Viral Mechanics | Share card tested with Twitter Card Validator and on iOS Safari |
| API key exposure | Architecture / Foundation | `grep -r "alvaApiKey"` in client bundle returns no results |

---

## Sources

- [Mistakes to Avoid While Developing a Fantasy Sports App — NimbleAppGenie](https://www.nimbleappgenie.com/blogs/fantasy-sports-app-development-mistakes-to-avoid/)
- [Fantasy Sports Platform Architecture: Real-Time Data Pipelines, Scoring Engines — iSportsAPI](https://www.isportsapi.com/en/blog/others-2279-fantasy-sports-platform-architecture:-real-time-data-pipelines,-scoring-engines,-and-ai-analytics.html)
- [Scoring & Stat Corrections — ESPN Fan Support](https://support.espn.com/hc/en-us/articles/360000099732-Scoring-Stat-Corrections)
- [STOCK Act and Insider Trading in Congress — Government Accountability Project](https://whistleblower.org/blog/stock-act-and-insider-trading-in-congress/)
- [Rep. Val Hoyle violated STOCK Act by missing deadlines to disclose 217 stock transactions — OpenSecrets](https://www.opensecrets.org/news/2025/09/rep-val-hoyle-violated-stock-act-by-missing-deadlines-to-disclose-217-stock-transactions/)
- [Congressional Stock Trading, Explained — Brennan Center for Justice](https://www.brennancenter.org/our-work/research-reports/congressional-stock-trading-explained)
- [Congress Stock Trading Rules and Key Data Sources — LuxAlgo](https://www.luxalgo.com/blog/congress-stock-trading-rules-and-key-data-sources/)
- [unitedstates/images GitHub repo — missing members issue #125](https://github.com/unitedstates/images/issues/125)
- [Storage quotas and eviction criteria — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria)
- [Using localStorage in Modern Applications — RxDB](https://rxdb.info/articles/localstorage.html)
- [The Dark Side of Gamification: When Points, Badges, & Leaderboards Go Wrong — Growth Engineering](https://www.growthengineering.co.uk/dark-side-of-gamification/)
- [The ABCs of the CPI: How the Corruption Perceptions Index is Calculated — Transparency International](https://www.transparency.org/en/news/how-cpi-scores-are-calculated)
- [Fintech App Design Guide: Fixing Top 20 Financial App Issues — UXDA](https://theuxda.com/blog/top-20-financial-ux-dos-and-donts-to-boost-customer-experience)
- [Avoid external API rate limit during static generation — Vercel/Next.js GitHub Discussions](https://github.com/vercel/next.js/discussions/18550)
- [Demo Content 101: How to Use It Correctly in Your SaaS — Userpilot](https://userpilot.com/blog/demo-content/)
- [Questions about Quiver Quantitative Insider Trading Dataset — QuantConnect](https://www.quantconnect.com/forum/discussion/18583/questions-about-the-insider-trading-dataset-by-quiver-quantitative/)

---
*Pitfalls research for: Fantasy Congress (fantasy sports + congressional stock trading)*
*Researched: 2026-03-23*
