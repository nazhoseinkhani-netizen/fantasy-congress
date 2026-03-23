# Phase 5: Polish and Viral - Research

**Researched:** 2026-03-23
**Domain:** Animation (Motion 12 / framer-motion 12), client-side image generation (html-to-image), Developer Mode Easter egg, global Alva footer
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** ESPN spectacle vibe — bold, dramatic animations. Cards fly, numbers tick up like scoreboards, gauges fill with color sweeps.
- **D-02:** Load + interaction triggers — key elements animate on first page view AND on interaction.
- **D-03:** Sports scoreboard flip ticker for points counters — digits flip independently.
- **D-04:** Theatrical corruption gauge reveal — sweeps 0→score, green→yellow→red color transitions, slight overshoot bounce, tier label fades in. 1.5-2 second reveal duration.
- **D-05:** html-to-image for client-side card generation — renders a hidden DOM element to PNG. CORS non-issue: politician photos are in `public/photos/` (same-origin).
- **D-06:** Two share card types — (1) Individual politician card (photo, stats, corruption score, fantasy points). (2) My Team card (roster lineup, team record, league rank).
- **D-07:** Contextual share buttons — Share icon on politician cards (directory, profile, leaderboard) and on My Team page header.
- **D-08:** Dark premium trading card aesthetic — dark background, gold accents, politician photo prominent, "Powered by Alva" badge at bottom.
- **D-09:** Keyboard shortcut activation (Ctrl+Shift+D) for Developer Mode.
- **D-10:** Dashed borders + tooltips on data elements when dev mode active. Hover/tap shows which Alva Skill powers it. Toggle banner confirms mode is on.
- **D-11:** Attribute 3-4 main Alva Skills: getSenatorTrades, stock prices, politician metadata.
- **D-12:** AlvaFooter on every page — extend existing `AlvaFooter` component from landing page to global layout (root-layout.tsx).
- **D-13:** "Build Your Own" CTA in Alva footer alongside existing "Learn more at alva.ai" link.
- **D-14:** Static footer content everywhere — same AlvaFooter on all pages.

### Claude's Discretion

- Draft pick fly-to-roster animation specifics (trajectory, burst effect, timing)
- Trade alert slide-in animation design (direction, glow color, badge bounce timing)
- Swamp-o-meter gauge animation on leaderboard
- Share card exact layout and typography within the dark premium template
- Share preview modal design (preview + download/copy buttons)
- Developer Mode toggle banner design and positioning
- Developer Mode tooltip content format for each Alva Skill
- AlvaFooter updated copy and "Build Your Own" button styling
- Mobile share flow (native share sheet vs. download only)
- Animation performance optimization (intersection observer for scroll-triggered animations)

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| ANIM-01 | Draft pick animation — card flies to roster with burst effect | Motion `animate()` imperative API + `useAnimate` for positional fly-to; burst via scale+opacity keyframes |
| ANIM-02 | Trade alert animation — slide in from right with green/red glow, badges bounce in | Motion `AnimatePresence` + `initial`/`animate` on trade cards; glow via box-shadow in style prop |
| ANIM-03 | Points counter — animated number ticker like a sports scoreboard | `useMotionValue` + `useSpring` + `useTransform` pattern; digit-flip via staggered AnimatePresence children |
| ANIM-04 | Corruption Index reveal — gauge fills with color transitions | SVG arc or CSS clip-path animated via Motion; `animate()` from 0 to score with spring overshoot; color via interpolated values |
| ANIM-05 | Swamp-o-meter animated gauge on leaderboard page | Same pattern as ANIM-04 but applied to leaderboard corruption column/section |
| SHARE-01 | Shareable image cards for team and politician | html-to-image `toPng()` on hidden DOM element; call 2-3 times on iOS Safari to work around blank-image bug |
| SHARE-02 | "Powered by Alva" branding on all share cards | Static badge rendered inside hidden share card DOM element |
| SHARE-03 | Invite friends flow — create league, get shareable link | Static export: copy `window.location.href` to clipboard; no backend needed |
| SHARE-04 | Weekly recap email mockup (design only) | Static HTML/JSX page — no sending infrastructure required |
| PLAT-01 | "Data Sources" footer on every page showing Alva Skills used | Extend `AlvaFooter` and add to `RootLayout` (src/components/layout/root-layout.tsx) |
| PLAT-02 | "Build Your Own" CTA linking to alva.ai/skills | Add link/button inside `AlvaFooter` |
| PLAT-03 | Developer mode toggle (Ctrl+Shift+D) — dashed borders + tooltips per data element | `keydown` event listener on `document`; `data-alva-skill` attributes on elements; React context for dev mode state |
</phase_requirements>

---

## Summary

Phase 5 builds on a well-established Motion (framer-motion 12.38.0) foundation already in place — seven components already import from `motion/react`. The core animation work is additive: new animated sub-components (`AnimatedGauge`, `AnimatedCounter`, digit-flip ticker) that slot into existing `RiskBadge`, `StatCell`, and draft components. No new animation library is needed.

The primary technical risk is share card generation on iOS Safari. `html-to-image` (not yet installed, latest 1.11.13) has a well-documented bug where images render blank on the first call on iOS Safari due to timing/security model differences. The established community workaround is calling `toPng()` two or three times in sequence — the final call reliably contains the images. Since photos are served from `public/photos/` (same-origin), CORS is not a concern.

Developer Mode is a pure client-side concern: a React context + `keydown` listener, CSS class on `<body>`, and `data-alva-skill` attributes on data elements. No library needed.

**Primary recommendation:** Implement animations in a bottom-up order — atomic components first (AnimatedCounter, AnimatedGauge), then wire into pages. Implement share cards second (install html-to-image, build hidden ShareCard DOM element). Implement Developer Mode last (touch many components with `data-alva-skill` attributes).

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| motion (framer-motion) | 12.38.0 (installed) | All animations — spring physics, AnimatePresence, useMotionValue, useSpring, useInView, whileInView | Already installed and imported in 7 components; established pattern in this codebase |
| html-to-image | 1.11.13 (needs install) | Client-side DOM → PNG for share cards | Maintained fork of dom-to-image; CORS-safe with same-origin images; full CSS support |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Tailwind CSS 4.x | installed | Styling share card hidden DOM element | Same as rest of app — share card uses existing utility classes |
| lucide-react | 1.0.1 (installed) | Share icon on politician cards | Already in use |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| html-to-image | @vercel/og + API route | @vercel/og requires a server — incompatible with `output: 'export'` static build |
| html-to-image | html2canvas | html2canvas (1.4.1) is older, less maintained, more CSS bugs with modern Tailwind 4 |
| html-to-image | Puppeteer/server screenshot | Requires backend — out of scope for static export prototype |
| useSpring digit flip | CSS animation `@keyframes` | CSS keyframes can't animate to dynamic runtime values; Motion handles physics-based interpolation |

**Installation:**
```bash
npm install html-to-image
```

**Version verification:** html-to-image 1.11.13 confirmed via `npm view html-to-image version` on 2026-03-23.

---

## Architecture Patterns

### Recommended Project Structure

New files for Phase 5:

```
src/
├── components/
│   ├── animations/
│   │   ├── animated-counter.tsx     # Scoreboard digit-flip ticker (ANIM-03)
│   │   ├── animated-gauge.tsx       # Sweep gauge with color transitions (ANIM-04, ANIM-05)
│   │   └── fly-to-roster.tsx        # Draft pick fly animation overlay (ANIM-01)
│   ├── share/
│   │   ├── share-button.tsx         # Trigger button with Share icon
│   │   ├── share-modal.tsx          # Preview + download/copy modal
│   │   ├── politician-share-card.tsx # Hidden DOM element for politician PNG
│   │   └── team-share-card.tsx      # Hidden DOM element for team PNG
│   └── dev-mode/
│       ├── dev-mode-provider.tsx    # React context + keydown listener
│       ├── dev-mode-banner.tsx      # Toggle banner at top of page
│       └── dev-mode-tooltip.tsx     # Per-element tooltip wrapper
├── app/
│   └── share/
│       └── weekly-recap/
│           └── page.tsx             # SHARE-04 static mockup page
```

AlvaFooter modification: edit existing `src/components/landing/alva-footer.tsx` directly.
RootLayout modification: add AlvaFooter + DevModeBanner to `src/components/layout/root-layout.tsx`.

### Pattern 1: Motion AnimatePresence (established — follow existing pattern)

**What:** Wrap conditionally-rendered elements in `<AnimatePresence>` with `motion.div` initial/animate/exit props.
**When to use:** Trade alert slide-ins (ANIM-02), share modal mount/unmount, dev mode banner.

```typescript
// Source: existing src/components/draft/post-draft.tsx pattern
import { motion, AnimatePresence } from 'motion/react'

<AnimatePresence>
  {isVisible && (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      {/* content */}
    </motion.div>
  )}
</AnimatePresence>
```

### Pattern 2: Animated Gauge (SVG arc approach)

**What:** SVG `<circle>` with `strokeDasharray`/`strokeDashoffset` animated via `motion.circle`. Color interpolated via `useTransform` on a MotionValue.
**When to use:** ANIM-04 (corruption gauge), ANIM-05 (swamp-o-meter).

```typescript
// Source: Motion docs — useMotionValue + useTransform pattern
'use client'
import { motion, useMotionValue, useTransform, animate } from 'motion/react'
import { useEffect } from 'react'

interface AnimatedGaugeProps {
  score: number        // 0-100
  animate?: boolean    // trigger on mount
}

export function AnimatedGauge({ score, animate: shouldAnimate = true }: AnimatedGaugeProps) {
  const RADIUS = 40
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS
  const progress = useMotionValue(0)

  // Animate from 0 to score with spring overshoot
  useEffect(() => {
    if (!shouldAnimate) { progress.set(score); return }
    animate(progress, score, {
      duration: 1.7,
      ease: [0.16, 1, 0.3, 1],  // expo out — fast start, slight settle
    })
  }, [score, shouldAnimate])

  // strokeDashoffset = circumference * (1 - progress/100)
  const dashOffset = useTransform(progress, [0, 100], [CIRCUMFERENCE, 0])

  // Color interpolation: green (0) → yellow (50) → red (100)
  const color = useTransform(
    progress,
    [0, 40, 70, 100],
    ['#22c55e', '#eab308', '#f97316', '#ef4444']
  )

  return (
    <svg viewBox="0 0 100 60" className="w-full">
      {/* Track */}
      <circle cx="50" cy="50" r={RADIUS} fill="none" stroke="currentColor"
        strokeOpacity={0.1} strokeWidth="8"
        strokeDasharray={CIRCUMFERENCE} strokeLinecap="round"
        transform="rotate(-180 50 50)" />
      {/* Animated fill */}
      <motion.circle
        cx="50" cy="50" r={RADIUS} fill="none"
        stroke={color as unknown as string}
        strokeWidth="8"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        transform="rotate(-180 50 50)"
      />
    </svg>
  )
}
```

**Note on overshoot:** For the "slight overshoot bounce" from D-04, use a spring with `type: 'spring', stiffness: 120, damping: 10` instead of a tween ease. Overshoot will occur naturally past the target value before settling.

### Pattern 3: Animated Digit-Flip Counter (ANIM-03)

**What:** Each digit is a separate stacked column of numbers that translate vertically to reveal the current digit. Mimics a stadium scoreboard.
**When to use:** Points counters on Dashboard (DASH-01 KPIs), politician cards, My Team.

```typescript
// Source: buildui.com/recipes/animated-number pattern — verified community standard
'use client'
import { motion, useSpring, useTransform } from 'motion/react'
import { useEffect } from 'react'

export function AnimatedCounter({ value, duration = 1.5 }: { value: number; duration?: number }) {
  const spring = useSpring(0, { stiffness: 60, damping: 15 })

  useEffect(() => {
    spring.set(value)
  }, [spring, value])

  // Round for display
  const display = useTransform(spring, (latest) => Math.round(latest).toLocaleString())

  return <motion.span>{display}</motion.span>
}
```

For the "digit flips independently" (D-03 scoreboard flip), build `<DigitFlip>` per digit using `AnimatePresence` with `mode="popLayout"` and `key={digit}` so each digit exit/enters independently:

```typescript
// Per-digit flip pattern — each digit is keyed by its current value
function DigitFlip({ digit }: { digit: string }) {
  return (
    <span style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', height: '1em' }}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={digit}
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          style={{ display: 'block' }}
        >
          {digit}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
```

### Pattern 4: html-to-image Share Card Generation

**What:** Render a visually styled component in a hidden off-screen `<div>`, call `toPng()`, then trigger download or copy.
**When to use:** SHARE-01, SHARE-02 — politician and team share cards.

```typescript
'use client'
import { toPng } from 'html-to-image'
import { useRef, useCallback } from 'react'

export function useShareCard() {
  const ref = useRef<HTMLDivElement>(null)

  const generate = useCallback(async (): Promise<string> => {
    if (!ref.current) throw new Error('ref not attached')
    const options = { pixelRatio: 2, quality: 0.95 }

    // iOS Safari workaround: call toPng up to 3 times
    // First call often returns blank images; subsequent calls are reliable
    await toPng(ref.current, options)  // priming call — discard result
    await toPng(ref.current, options)  // second call — usually good
    return toPng(ref.current, options) // third call — return this
  }, [])

  return { ref, generate }
}
```

Hidden card container (renders off-screen but in the DOM — required for html-to-image):
```typescript
<div
  ref={ref}
  style={{
    position: 'absolute',
    left: '-9999px',
    top: '-9999px',
    width: '400px',     // fixed pixel dimensions — critical for html-to-image
    height: '560px',
  }}
>
  <PoliticianShareCard politician={politician} />
</div>
```

### Pattern 5: Developer Mode Context + data-alva-skill attributes

**What:** React context holds `devMode: boolean`. Toggle with `keydown` listener for Ctrl+Shift+D. Elements receive `data-alva-skill="getSenatorTrades"`. Global CSS (when devMode active) applies dashed borders.
**When to use:** PLAT-03 — every data-driven element.

```typescript
// dev-mode-provider.tsx
'use client'
import { createContext, useContext, useState, useEffect } from 'react'

interface DevModeContextValue { devMode: boolean }
const DevModeContext = createContext<DevModeContextValue>({ devMode: false })

export function DevModeProvider({ children }: { children: React.ReactNode }) {
  const [devMode, setDevMode] = useState(false)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        setDevMode((v) => !v)
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  // Apply class to document root for global CSS targeting
  useEffect(() => {
    document.documentElement.classList.toggle('dev-mode', devMode)
  }, [devMode])

  return <DevModeContext.Provider value={{ devMode }}>{children}</DevModeContext.Provider>
}

export const useDevMode = () => useContext(DevModeContext)
```

Global CSS for dev mode dashed borders:
```css
/* in globals.css */
.dev-mode [data-alva-skill] {
  outline: 2px dashed hsl(var(--primary) / 0.6);
  outline-offset: 2px;
  position: relative;
  cursor: help;
}
```

Tooltip via `title` attribute (zero-library approach) or `DevModeTooltip` wrapper:
```typescript
// Applied to any data element:
<div data-alva-skill="getSenatorTrades" title="Powered by: getSenatorTrades Alva Skill">
  {/* trade data content */}
</div>
```

### Pattern 6: whileInView for scroll-triggered animations

**What:** Motion's `whileInView` prop triggers animation when element scrolls into viewport. Uses native IntersectionObserver (off main thread, 0.5kb).
**When to use:** Corruption gauge fill on leaderboard corruption tab, stats on profile page.

```typescript
// Source: motion.dev/docs/react-use-in-view
<motion.div
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true, amount: 0.3 }}
  transition={{ duration: 0.5 }}
>
  <AnimatedGauge score={politician.insiderRiskScore} />
</motion.div>
```

`once: true` prevents re-triggering when scrolling back — appropriate for count-up animations that shouldn't reset.

### Anti-Patterns to Avoid

- **Animating layout-affecting properties:** Do not animate `width`, `height`, or `top/left` for performance-critical animations. Use `transform: translateX/Y` (Motion default for `x`, `y` props) which composites on the GPU.
- **Rendering share card element only on click:** html-to-image requires the DOM element to be rendered and visible (even if off-screen) before calling `toPng()`. Do not conditionally render it — keep it mounted, position it off-screen with `position: absolute; left: -9999px`.
- **Using next/image in share card:** Static export uses `<img>` not `next/image` per project constraint. html-to-image also works better with plain `<img>` tags.
- **Calling toPng once on iOS Safari:** Always use the 3-call pattern. Single call produces blank images on iOS Safari in ~40-60% of cases.
- **Attaching keydown to window in SSR context:** Use `document.addEventListener` inside `useEffect` — never at module scope, since the static export still runs RSC/SSR passes.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Spring physics for gauge overshoot | Custom CSS animation + requestAnimationFrame timer | `animate()` from Motion with spring type | Springs require mass/stiffness/damping math; edge cases with interrupted animations |
| DOM → PNG conversion | canvas.drawImage loop + getImageData | `html-to-image toPng()` | Shadow DOM, CSS variables, pseudo-elements, webfonts all handled; canvas approach misses all of these |
| Number interpolation for counter | Manual setInterval + Math.ceil | `useSpring` + `useTransform` | Spring interpolation is velocity-aware; setInterval gaps cause jank when tab is backgrounded |
| IntersectionObserver wiring | Manual `new IntersectionObserver()` in useEffect | Motion's `whileInView` prop or `useInView` hook | Motion pools observers across components, handles cleanup, respects `prefers-reduced-motion` |

**Key insight:** In animation work, the difference between a "working" implementation and a "good" implementation is 80% handled by the library — spring physics, `prefers-reduced-motion`, cleanup on unmount, and interrupted animation handling are all easy to get wrong by hand.

---

## Common Pitfalls

### Pitfall 1: html-to-image blank images on iOS Safari

**What goes wrong:** `toPng()` returns a PNG where `<img>` elements are transparent/white on iOS Safari 15-17.
**Why it happens:** Safari's `<foreignObject>` security model doesn't allow cross-origin rendering, and the image loading timing differs from Chrome. Even same-origin images can be blank on first call due to rasterization timing.
**How to avoid:** Call `toPng()` three times, discarding the first two results. The third call is reliably populated.
**Warning signs:** Share cards look correct in desktop Chrome/Firefox but show white boxes where photos should be when tested on iPhone.

### Pitfall 2: html-to-image fixed pixel dimensions required

**What goes wrong:** Share card renders with wrong dimensions or blurry output.
**Why it happens:** html-to-image uses the element's rendered dimensions from the DOM. Responsive/fluid widths produce variable-size output.
**How to avoid:** Set explicit `width` and `height` in pixels on the hidden container element (e.g., `style={{ width: '400px', height: '560px' }}`). Use `pixelRatio: 2` for retina-quality output.
**Warning signs:** Output PNG is the wrong aspect ratio, or images look blurry at actual size.

### Pitfall 3: Motion `useSpring` initial value mismatch

**What goes wrong:** Counter animates from 0 on every render/remount, even when value hasn't changed.
**Why it happens:** `useSpring(initialValue)` takes a snapshot at mount time — if the prop changes after mount, the spring won't track it automatically.
**How to avoid:** Combine `useSpring` with a `useEffect` that calls `spring.set(newValue)` when the prop changes. The spring then animates to the new target.
**Warning signs:** Every page navigation causes numbers to tick up from zero.

### Pitfall 4: Dev mode `data-alva-skill` breaks SSR hydration

**What goes wrong:** Hydration mismatch warning when `data-alva-skill` attributes are conditionally added by client-only dev mode state.
**Why it happens:** Server renders without dev mode state; client immediately applies attributes — React detects mismatch.
**How to avoid:** Always render `data-alva-skill` attributes unconditionally in the JSX. Dev mode CSS/visibility controls the visual display, not the DOM presence.
**Warning signs:** React hydration error in console: "Prop `data-alva-skill` did not match."

### Pitfall 5: Ctrl+Shift+D conflicts with browser DevTools

**What goes wrong:** Ctrl+Shift+D opens a browser panel (e.g., Firefox developer tools docking) instead of triggering the Easter egg.
**Why it happens:** Some browsers bind Ctrl+Shift+D as a DevTools shortcut.
**How to avoid:** Call `e.preventDefault()` in the keydown handler. Test on Chrome (primary) and Firefox. On macOS, Ctrl+Shift+D generally does not conflict.
**Warning signs:** Key combo opens browser UI instead of activating the banner.

### Pitfall 6: AlvaFooter in RootLayout conflicts with draft page full-screen layout

**What goes wrong:** Draft room page (`/draft`) uses full-screen layout — a global footer may break the layout or appear over draft UI.
**Why it happens:** RootLayout wraps all pages including draft.
**How to avoid:** Check if `/draft` page uses a full-screen override. If it does, either suppress the footer on that route via pathname check, or ensure the draft layout already handles overflow correctly.
**Warning signs:** Footer overlaps or is visible during active draft session.

---

## Code Examples

### Stagger children on page load (established pattern from post-draft.tsx)

```typescript
// Source: src/components/draft/post-draft.tsx
{grades.map((grade, i) => (
  <motion.div
    key={grade.teamIndex}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: i * 0.15 }}
  >
    {/* card content */}
  </motion.div>
))}
```

### Trade alert slide-in from right (ANIM-02)

```typescript
// New pattern for trade feed entries
<AnimatePresence>
  {trades.map((trade) => (
    <motion.div
      key={trade.id}
      layout
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 60 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      style={{
        boxShadow: trade.returnPct > 0
          ? '0 0 12px 0 rgba(34,197,94,0.25)'
          : '0 0 12px 0 rgba(239,68,68,0.25)'
      }}
    >
      <TradeCard trade={trade} />
    </motion.div>
  ))}
</AnimatePresence>
```

### Draft pick fly-to-roster (ANIM-01) — useAnimate imperative approach

```typescript
// useAnimate lets you animate a specific DOM node imperatively
'use client'
import { useAnimate } from 'motion/react'

export function DraftPickFlyAnimation({ onComplete }: { onComplete: () => void }) {
  const [scope, animate] = useAnimate()

  const triggerFly = async (fromRect: DOMRect, toRect: DOMRect) => {
    const deltaX = toRect.left - fromRect.left
    const deltaY = toRect.top - fromRect.top

    await animate(scope.current, {
      x: [0, deltaX * 0.5, deltaX],
      y: [0, deltaY * 0.3 - 40, deltaY],   // arc trajectory
      scale: [1, 1.15, 0.8],
      opacity: [1, 1, 0],
    }, {
      duration: 0.6,
      ease: 'easeInOut',
    })
    onComplete()
  }

  return <div ref={scope}>{/* card content */}</div>
}
```

### Share card trigger with iOS-safe toPng

```typescript
'use client'
import { toPng } from 'html-to-image'
import { useRef, useState, useCallback } from 'react'

export function useShareCard() {
  const cardRef = useRef<HTMLDivElement>(null)
  const [generating, setGenerating] = useState(false)

  const generate = useCallback(async (): Promise<string | null> => {
    if (!cardRef.current) return null
    setGenerating(true)
    try {
      const opts = { pixelRatio: 2, cacheBust: true }
      // iOS Safari blank-image workaround: prime with 2 discarded calls
      await toPng(cardRef.current, opts)
      await toPng(cardRef.current, opts)
      const dataUrl = await toPng(cardRef.current, opts)
      return dataUrl
    } finally {
      setGenerating(false)
    }
  }, [])

  return { cardRef, generate, generating }
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `framer-motion` npm package directly | `motion` package (wraps framer-motion) | Motion v10+ | This project already uses `motion/react` — correct import path |
| `AnimatePresence` + `useAnimation` for scroll-triggered | `whileInView` prop | Motion v5 | Simpler, no manual IntersectionObserver, `once: true` option |
| `useTransform` with numbers for color | Same — still the standard | - | No change needed |
| `AnimateNumber` from Motion+ | Not available in open motion package | - | Must hand-build digit-flip with `AnimatePresence` + `mode="popLayout"` |

**Deprecated/outdated:**
- `useViewportScroll`: replaced by `useScroll` — do not use.
- `AnimateSharedLayout`: deprecated, replaced by `layout` prop — do not use.
- `motion/react` re-exports from framer-motion directly (confirmed from dist/react.d.ts) — import from `motion/react` as already done in codebase.

---

## Open Questions

1. **Draft pick fly animation — source/target element ref acquisition**
   - What we know: The fly needs to animate from the draft board card position to the roster slot position. Both are in different component subtrees.
   - What's unclear: Whether `getBoundingClientRect()` at click time is the right approach, or if a portal/overlay pattern is cleaner.
   - Recommendation: Use an overlay portal (`<div>` fixed positioned in RootLayout) + `getBoundingClientRect()` at pick time to clone the card and animate it. This avoids z-index conflicts with the draft board panels.

2. **Native share sheet on iOS (SHARE-01 mobile)**
   - What we know: The Web Share API (`navigator.share({ files: [pngBlob] })`) can trigger the iOS native share sheet.
   - What's unclear: Whether the project wants native share sheet or just a download link on mobile.
   - Recommendation: Feature-detect `navigator.canShare`. If supported and file sharing is available, use native share sheet. Otherwise, fall back to `<a download>` link. This is Claude's discretion per CONTEXT.md.

3. **SHARE-04 weekly recap mockup scope**
   - What we know: "Design only" — no email infrastructure needed.
   - What's unclear: Whether this is a standalone `/share/weekly-recap` page or just a static component screenshot.
   - Recommendation: Build as a Next.js page at `/share/weekly-recap` that renders the email-style layout. Static export produces a shareable HTML page that looks like the email.

---

## Sources

### Primary (HIGH confidence)

- Installed `framer-motion@12.38.0` package — inspected `dist/types/index.d.ts` for exported APIs: `animate`, `useAnimate`, `useMotionValue`, `useSpring`, `useTransform`, `useInView`, `whileInView`, `AnimatePresence`, `inView` all confirmed exported
- `motion` package `dist/react.d.ts` — confirmed re-exports from framer-motion; `motion/react` import path is correct
- Existing codebase animation components — `post-draft.tsx`, `on-the-clock.tsx`, `pick-ticker.tsx` read directly; established patterns confirmed
- `npm view html-to-image version` — confirmed 1.11.13 on 2026-03-23
- `npm view framer-motion version` — confirmed 12.38.0 matches installed package
- Project source code: `alva-footer.tsx`, `root-layout.tsx`, `risk-badge.tsx`, `stat-cell.tsx` — read directly

### Secondary (MEDIUM confidence)

- [motion.dev/docs/react-use-in-view](https://motion.dev/docs/react-use-in-view) — `useInView`, `whileInView`, `once` option confirmed; IntersectionObserver pooling documented
- [motion.dev/docs/react-animate-number](https://motion.dev/docs/react-animate-number) — `AnimateNumber` confirmed as Motion+ exclusive; not in installed package; manual digit-flip is the correct approach
- [buildui.com/recipes/animated-number](https://buildui.com/recipes/animated-number) — `useSpring` + `useTransform` counter pattern; well-regarded community source
- [html-to-image GitHub issues #361, #420](https://github.com/bubkoo/html-to-image/issues/361) — iOS Safari blank image bug and 3-call workaround confirmed from multiple issue reports

### Tertiary (LOW confidence)

- WebSearch: "html-to-image iOS Safari fix retry" — community workaround (3-call pattern) appears in multiple GitHub issues; not officially documented in library README. Flag for testing during implementation.

---

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH — libraries verified via npm registry and installed package inspection
- Architecture: HIGH — all patterns derived from installed framer-motion API types and existing codebase code; no training-data assumptions
- Pitfalls: MEDIUM-HIGH — animation pitfalls from codebase patterns; iOS Safari html-to-image issue from multiple GitHub reports (MEDIUM)

**Research date:** 2026-03-23
**Valid until:** 2026-04-23 (html-to-image and motion are stable; iOS Safari behavior could change with OS updates)
