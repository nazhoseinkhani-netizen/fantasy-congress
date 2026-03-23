---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: Ready to plan
stopped_at: Completed 02.1-02-PLAN.md
last_updated: "2026-03-23T20:52:54.661Z"
progress:
  total_phases: 6
  completed_phases: 2
  total_plans: 16
  completed_plans: 15
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-23)

**Core value:** Fantasy football mechanics applied to Congressional stock trading — making political corruption data accessible, entertaining, and viral through gamification.
**Current focus:** Phase 02.1 — real-data-pipeline

## Current Position

Phase: 3
Plan: Not started

## Performance Metrics

**Velocity:**

- Total plans completed: 0
- Average duration: -
- Total execution time: 0 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| - | - | - | - |

**Recent Trend:**

- Last 5 plans: none yet
- Trend: -

*Updated after each plan completion*
| Phase 01-foundation P01 | 4 | 2 tasks | 11 files |
| Phase 01-foundation P02 | 18m | 2 tasks | 9 files |
| Phase 01-foundation P03 | 295 | 4 tasks | 18 files |
| Phase 01-foundation P04 | 13 | 2 tasks | 12 files |
| Phase 01-foundation P05 | 162 | 2 tasks | 8 files |
| Phase 01-foundation P07 | 118 | 2 tasks | 3 files |
| Phase 01-foundation P06 | 148 | 2 tasks | 5 files |
| Phase 02-discovery P04 | 12 | 2 tasks | 5 files |
| Phase 02-discovery P02 | 1 | 2 tasks | 5 files |
| Phase 02-discovery P05 | 1 | 2 tasks | 5 files |
| Phase 02-discovery P03 | 366 | 3 tasks | 7 files |
| Phase 02-discovery P06 | 3 | 2 tasks | 6 files |
| Phase 02.1-real-data-pipeline P01 | 239 | 1 tasks | 1 files |
| Phase 02.1-real-data-pipeline P02 | 264 | 2 tasks | 4 files |

## Accumulated Context

### Roadmap Evolution

- Phase 2.1 inserted after Phase 2: Real Data Pipeline — Replace simulated trades with real Congressional disclosures from Alva Skills API (URGENT)

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- [Init]: Static-first Next.js 16 with `output: 'export'` — Alva API key never touches browser
- [Init]: Scoring engine built as pure TypeScript before any score-displaying UI
- [Init]: Politician photos must be hosted at own domain by build time (CORS for share cards)
- [Init]: Brand as "Insider Trading Risk Score" not "Corruption Index" — legal risk mitigation
- [Phase 01-foundation]: Static export configured at project bootstrap: output: 'export' + images.unoptimized: true — all downstream plans build against this
- [Phase 01-foundation]: Scoring config defined as TypeScript const (not JSON) for type safety and IDE autocomplete
- [Phase 01-foundation]: All TypeScript types defined before implementation — stable contracts for Plans 02-05
- [Phase 01-foundation]: activityBonus applied at politician level in scorePolitician(), not per-trade in detectBonuses()
- [Phase 01-foundation]: stockActCompliance in InsiderRiskInput treated as pre-inverted risk signal (0=low risk, 100=high risk) — caller converts raw compliance before passing in
- [Phase 01-foundation]: globals.css moved to src/styles/globals.css; src/app/globals.css imports it — keeps app directory clean
- [Phase 01-foundation]: PoliticianCard uses <img> not next/image per CLAUDE.md constraint for static export
- [Phase 01-foundation]: Build scripts use relative imports (../src/lib/) not @/ path aliases — tsx doesn't resolve tsconfig paths in script mode
- [Phase 01-foundation]: InsiderRiskScore components simulated with seeded hashes when committee data unavailable (DEMO_KEY API limitation)
- [Phase 01-foundation]: Top 2% of politicians by season points rank get floored risk components (90+) to guarantee peak-swamp tier in distribution
- [Phase 01-foundation]: Same politician allowed across leagues — mirrors real fantasy sports; simplifies draft simulation
- [Phase 01-foundation]: User team selection by closest-to-3-3 algorithm using abs(wins-3)+abs(losses-3) score
- [Phase 01-foundation]: Pool exhaustion in snake draft handled by allowing same politician on multiple teams within a league when pool (82) < total picks needed (96)
- [Phase 01-foundation]: activityBonus applied at politician level in scorePolitician() confirmed via TDD — engine.ts computes tradeTotal + (trades.length * config.bonuses.activityBonus)
- [Phase 02-discovery]: Client-side filtering via useMemo for trade feed — all 815 trades loaded at once since static export
- [Phase 02-discovery]: FilterSidebar rendered twice (mobile Sheet trigger + desktop sidebar) to avoid complex responsive state
- [Phase 02-discovery]: Committee filter disabled with explanation rather than hidden — communicates data limitation
- [Phase 02-discovery]: Inline sub-tab toggle for Swamp Lords instead of full shadcn Tabs to visually differentiate from main tabs
- [Phase 02-discovery]: Server page delegates to client component for generateStaticParams + interactivity split
- [Phase 02-discovery]: Recharts tooltip formatters use any cast where strict PieLabelRenderProps conflicts with custom data
- [Phase 02-discovery]: MetricTooltip wraps each TooltipProvider individually for isolation — avoids global provider conflicts
- [Phase 02.1-01]: Alva V8 sandbox: require('@arrays/...') goes inside code strings passed to POST /api/v1/run — not importable in Node.js script scope
- [Phase 02.1-01]: Defensive Alva response field mapping: try resp.result, resp.output, then raw — multiple container shapes handled
- [Phase 02.1-01]: Set price returns to 0 (not null) for missing Alva price data — score-all.ts existing NaN exclusion handles 0-return trades per D-06
- [Phase 02.1-02]: Standalone compute-season.ts script avoids circular dependency between generate-demo (needs politicians.json) and score-all (needs season-weeks.json)
- [Phase 02.1-02]: config.ts reads season-weeks.json via readFileSync at module load time — SEASON_WEEKS is a synchronous const export, safe in all Node.js build contexts

### Pending Todos

None yet.

### Blockers/Concerns

- [Phase 1]: Alva Skills API shape, endpoints, auth, and rate limits are unknown — needs research before data scripts can be designed
- [Phase 5]: Share card CORS strategy (html-to-image + self-hosted photos vs. @vercel/og) unresolved — needs research before Phase 5 planning

## Session Continuity

Last session: 2026-03-23T20:12:45.366Z
Stopped at: Completed 02.1-02-PLAN.md
Resume file: None
