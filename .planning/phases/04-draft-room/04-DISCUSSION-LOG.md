# Phase 4: Draft Room - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-23
**Phase:** 04-draft-room
**Areas discussed:** Draft pacing & timing, AI opponent behavior, Draft board layout, Post-draft grades

---

## Draft Pacing & Timing

| Option | Description | Selected |
|--------|-------------|----------|
| Live draft tension | AI picks take 2-5 seconds with thinking animation. User gets 30-60s countdown. ESPN/DraftKings feel. | ✓ |
| Quick simulation | AI picks near-instant (0.5-1s). Get through draft in 2-3 minutes. | |
| You decide | Claude picks the right balance. | |

**User's choice:** Live draft tension
**Notes:** Full immersion experience preferred.

| Option | Description | Selected |
|--------|-------------|----------|
| Yes — dramatic countdown | 10-second countdown with visual timer before draft starts. | ✓ |
| No — jump right in | User clicks Start Draft and first pick begins immediately. | |
| You decide | Claude decides. | |

**User's choice:** Yes — dramatic countdown

| Option | Description | Selected |
|--------|-------------|----------|
| 30 seconds | Enough pressure to feel real. Fantasy football standard. | |
| 60 seconds | More relaxed. Lets first-time users browse the board. | ✓ |
| No timer — take your time | User picks whenever ready. No pressure. | |
| You decide | Claude picks duration. | |

**User's choice:** 60 seconds
**Notes:** User prefers relaxed pace for first-time users to explore.

| Option | Description | Selected |
|--------|-------------|----------|
| No — watch every pick | Part of the experience. Each pick animates in. Full immersion. | ✓ |
| Speed up button | 2x speed toggle for AI picks. | |
| You decide | Claude decides. | |

**User's choice:** No — watch every pick

---

## AI Opponent Behavior

| Option | Description | Selected |
|--------|-------------|----------|
| Yes — distinct strategies | Each AI team has visible archetype: value hunter, corruption chaser, party loyalist, etc. | ✓ |
| Uniform smart drafting | All AI use same best-available logic. Simpler but less character. | |
| You decide | Claude designs AI personality level. | |

**User's choice:** Yes — distinct strategies

| Option | Description | Selected |
|--------|-------------|----------|
| Competent with mistakes | Generally smart but occasionally reaches or overlooks value. Like playing with friends. | ✓ |
| Optimal / min-max | Always picks mathematically best available. Harder to beat. | |
| You decide | Claude calibrates difficulty. | |

**User's choice:** Competent with mistakes

---

## Draft Board Layout

| Option | Description | Selected |
|--------|-------------|----------|
| ESPN-style 3-panel | Left: player pool. Center: On The Clock + controls. Right: roster + salary cap. Pick ticker at bottom. | ✓ |
| Full-width board + overlay | Full-screen grid. Roster slides out as drawer. Floating On The Clock banner. | |
| You decide | Claude picks layout. | |

**User's choice:** ESPN-style 3-panel
**Notes:** User selected after viewing ASCII mockup preview.

| Option | Description | Selected |
|--------|-------------|----------|
| Draft order reveal + board preview | Shows snake draft order, countdown, and full scoutable politician board. | ✓ |
| Simple start screen | Just draft order and Start Draft button. No scouting. | |
| You decide | Claude designs pre-draft. | |

**User's choice:** Draft order reveal + board preview

---

## Post-Draft Grades

| Option | Description | Selected |
|--------|-------------|----------|
| ESPN analyst commentary | Letter grade + 2-3 sentence irreverent write-up per team. | ✓ |
| Stats-only grades | Grade based purely on numbers. No personality. | |
| You decide | Claude picks grade tone. | |

**User's choice:** ESPN analyst commentary

| Option | Description | Selected |
|--------|-------------|----------|
| Low cost, high upside | Bottom 2 salary tiers with high trade volume or hot streak. | ✓ |
| Late-round picks with high scores | Rounds 9-12 with above-average season points. | |
| You decide | Claude defines sleeper criteria. | |

**User's choice:** Low cost, high upside

| Option | Description | Selected |
|--------|-------------|----------|
| Composite: value + balance + upside | Salary efficiency, roster balance, projected ceiling. | ✓ |
| Pure projected points | Grade based solely on total projected season points. | |
| You decide | Claude designs grading algorithm. | |

**User's choice:** Composite: value + balance + upside

| Option | Description | Selected |
|--------|-------------|----------|
| Yes — full pick-by-pick board | Grid showing every round and team's pick. Click to see politician card. | ✓ |
| Summary only | Just final roster + grade per team. | |
| You decide | Claude decides recap detail. | |

**User's choice:** Yes — full pick-by-pick board

---

## Claude's Discretion

- AI archetype names and specific strategy weights
- Exact AI pick delay timing distribution (2-5s range)
- AI mistake frequency and logic
- Mobile layout adaptation
- Draft board politician card variant
- Salary cap enforcement UX
- Pick ticker design
- Draft order randomization
- Countdown timer animation
- Grade write-up generation approach
- Draft-to-game-store roster transition
- Sort/filter options on draft board

## Deferred Ideas

None — discussion stayed within phase scope.
