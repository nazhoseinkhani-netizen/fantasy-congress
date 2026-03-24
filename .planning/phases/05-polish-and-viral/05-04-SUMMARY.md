---
phase: 05-polish-and-viral
plan: "04"
subsystem: share
tags: [share-cards, html-to-image, viral, png-generation, ios-safari]
dependency_graph:
  requires: [05-03]
  provides: [SHARE-01, SHARE-02, SHARE-03]
  affects: [leaderboard, team-page]
tech_stack:
  added: [html-to-image@1.11.13]
  patterns: [off-screen DOM rendering, iOS Safari triple-call workaround, Web Share API feature detection]
key_files:
  created:
    - src/components/share/use-share-card.ts
    - src/components/share/politician-share-card.tsx
    - src/components/share/team-share-card.tsx
    - src/components/share/share-button.tsx
    - src/components/share/share-modal.tsx
  modified:
    - src/components/leaderboard/shame-table.tsx
    - src/components/team/team-page.tsx
    - package.json
decisions:
  - "useShareCard triple toPng call pattern for iOS Safari blank-image workaround (per research Pitfall 1)"
  - "typeof navigator.canShare === 'function' check instead of truthiness — avoids TypeScript strict-mode error on method reference"
  - "ShareButton hidden on mobile (sm:table-cell) in shame-table to avoid row layout breakage on small screens"
  - "TeamShareCard always mounted in TeamPage DOM (not conditionally rendered) — html-to-image requires mounted element"
metrics:
  duration_seconds: 197
  completed_date: "2026-03-24"
  tasks_completed: 2
  files_created: 5
  files_modified: 3
---

# Phase 05 Plan 04: Share Card System Summary

Share card system for viral mechanics: html-to-image PNG generation for politician and team cards, with dark premium trading card aesthetic and "Powered by Alva" branding on every output.

## What Was Built

**useShareCard hook** (`src/components/share/use-share-card.ts`): iOS Safari-safe PNG generation via html-to-image triple-call pattern. Exports `useShareCard()` returning `{ cardRef, generate, generating }`, plus `downloadImage()` and `shareImage()` helpers. `shareImage` uses Web Share API file sharing with `<a download>` fallback.

**PoliticianShareCard** (`src/components/share/politician-share-card.tsx`): Hidden off-screen `forwardRef` component (400x560px, positioned at left:-9999px). Dark trading card design: gold gradient lines, FANTASY CONGRESS header, politician photo with gold border, 2x2 stats grid (season points, risk score, trade count, win rate), insider risk tier badge, "Powered by Alva" footer. All inline styles for html-to-image reliability.

**TeamShareCard** (`src/components/share/team-share-card.tsx`): Hidden off-screen team card (400x560px). Shows team name, W-L record, league rank, 8-politician 2-column roster with photos and points per player, total season points, "Powered by Alva" footer. All inline styles.

**ShareButton** (`src/components/share/share-button.tsx`): Trigger button with Share2 icon, generating spinner state, sm/md sizing.

**ShareModal** (`src/components/share/share-modal.tsx`): AnimatePresence spring modal with image preview, Download button, Copy Link button (`navigator.clipboard.writeText` for SHARE-03 invite flow), conditional native Share button.

**Leaderboard integration** (`shame-table.tsx`): Share column added to each politician row. Clicking generates politician PNG via useShareCard hook, opens ShareModal. PoliticianShareCard mounted off-screen inside component.

**My Team integration** (`team-page.tsx`): Share button in team name header. Computes league rank from pointsFor sort, active roster politicians, total points from weekResults. TeamShareCard always mounted, ShareModal opens on generate.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] TypeScript strict error on navigator.canShare truthiness check**
- **Found during:** Task 2 — `npx next build` type check
- **Issue:** `navigator.canShare` is a method reference; `&& navigator.canShare` always evaluates truthy per TypeScript strict mode
- **Fix:** Changed check to `typeof navigator.canShare === 'function'`
- **Files modified:** `src/components/share/share-modal.tsx`
- **Commit:** 4b14090

## Self-Check

### Files exist:
- src/components/share/use-share-card.ts: FOUND
- src/components/share/politician-share-card.tsx: FOUND
- src/components/share/team-share-card.tsx: FOUND
- src/components/share/share-button.tsx: FOUND
- src/components/share/share-modal.tsx: FOUND

### Commits:
- 8f4c17a: feat(05-04): install html-to-image, create useShareCard hook and share card renderers
- 4b14090: feat(05-04): create ShareButton, ShareModal, wire into leaderboard and My Team

## Self-Check: PASSED
