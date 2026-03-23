<!-- GSD:project-start source:PROJECT.md -->
## Project

**Fantasy Congress**

A fantasy sports-style web application where players draft US politicians into their roster and compete against friends based on the real-world stock trading performance of those politicians. Built as a standalone consumer product on top of Alva's financial data APIs to prove the platform thesis — that Alva is not just a dashboard builder but an API-powered ecosystem capable of powering real consumer applications.

**Core Value:** Fantasy football mechanics applied to Congressional stock trading — making political corruption data accessible, entertaining, and viral through gamification.

### Constraints

- **Tech stack**: React (Next.js or Vite) + Tailwind CSS, deployed to Vercel/Netlify as static site
- **Data layer**: Alva Skills API as primary backend data engine. May need to pre-cache data for prototype if API access is limited.
- **State management**: React state + localStorage for prototype (no backend database)
- **Photos**: Every politician card MUST show actual official photo — critical for virality and realism
- **Build priority**: P1 (landing, directory, feed, profiles, leaderboard) alone makes a compelling demo. P2 (dashboard, team, league) adds depth. P3 (draft, shares, animations) adds polish.
<!-- GSD:project-end -->

<!-- GSD:stack-start source:research/STACK.md -->
## Technology Stack

## Recommended Stack
### Core Technologies
| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Next.js | 16.x | Framework | App Router gives file-based routing, static export via `output: 'export'`, and first-class Vercel/Netlify deployment. Next.js 16 ships Turbopack as default bundler (5-10x faster Fast Refresh), stable React Compiler support, and React 19.2 features. For a prototype with 50+ politician profile routes, file-based routing with dynamic segments is mandatory — Vite requires manual wiring. |
| React | 19.2 | UI runtime | Bundled with Next.js 16. React Compiler auto-memoizes components — important for a gamification app with heavy re-renders on leaderboards and scoring feeds. |
| TypeScript | 5.x | Type safety | Fantasy scoring rules and Congressional data structures are deeply nested — TypeScript prevents the class of runtime bugs that plague demos in front of leadership. |
| Tailwind CSS | 4.x | Styling | Released January 22, 2025. Full builds 5x faster, incremental builds 100x faster. CSS-first config (no tailwind.config.js required). Dark mode by default via CSS variables aligns perfectly with the DraftKings aesthetic. |
| shadcn/ui | latest (CLI v4) | Component library | Copy-owned components built on Radix UI primitives + Tailwind CSS. Dark mode via `next-themes` works out of the box. Politician cards, stat tables, leaderboard rows, and modal dialogs are all covered. Because you own the components, customizing the "premium irreverent" aesthetic doesn't fight the library. |
### Supporting Libraries
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Zustand | 5.x | Client state management | Use for global app state: current user team, draft state, active league, leaderboard filters. Built-in `persist` middleware serializes to localStorage — no extra wiring needed for the prototype's "no backend" constraint. More ergonomic than Context for cross-cutting state like scoring rules and season data. |
| Recharts | 3.x | Data visualization | 3.6M+ weekly downloads. SVG-based, idiomatic React component API, responsive containers built in. Cover 90% of Fantasy Congress needs: line charts for politician trade performance over time, bar charts for corruption index comparisons, area charts for portfolio value. Use for most charts. |
| ApexCharts (react-apexcharts) | latest | Financial chart types | Use specifically for candlestick charts (stock price history on politician profiles) and range charts. Recharts lacks native candlestick support. ApexCharts has the best React candlestick implementation in the ecosystem. |
| Motion (prev. Framer Motion) | latest | Animations | Package name is now `motion`, import from `motion/react`. 30M+ monthly downloads. Springs, layout transitions, gesture handling. Use for: score counter animations, badge reveals, draft pick reveals, leaderboard position changes. Powers the "addictive" feel the design brief demands. |
| TanStack Query | 5.x | Data fetching + caching | Use for fetching from Alva Skills API. Handles loading/error states, automatic deduplication, and stale-while-revalidate patterns. For the prototype, enables "refresh on page load" trade feed updates without building custom cache logic. |
| html-to-image | latest | Share card generation | Client-side DOM-to-image conversion using HTML5 Canvas + SVG. Powers the "Corruption Index" share cards and team share cards that are the primary viral mechanic. No server required — pure client-side. |
| date-fns | 3.x | Date formatting | Functional API, excellent tree-shaking (each function has its own module entry), works directly on native Date objects without wrappers. Use for formatting Congressional trade disclosure dates, season week labels, and matchup timestamps. |
| next-themes | latest | Dark mode toggling | Official shadcn/ui recommendation for theme management. Prevents flash-of-unstyled-content on load. One-line setup with Next.js App Router. |
### Development Tools
| Tool | Purpose | Notes |
|------|---------|-------|
| Turbopack | Build + HMR | Default in Next.js 16 — no configuration needed. Replaces Webpack. 5-10x faster Fast Refresh is meaningful when iterating on 50+ politician cards. |
| ESLint 9 | Linting | Bundled with Next.js. Use flat config format (eslint.config.mjs). |
| Prettier | Code formatting | Install separately; Next.js does not include it. Add `prettier-plugin-tailwindcss` to auto-sort class names — critical for Tailwind v4 class ordering. |
| Vercel CLI | Deployment | `vercel --prod` for production. Preview deployments for every branch automatically on Vercel. |
## Installation
# Bootstrap
# State management
# Data fetching
# Components
# Charts
# Animation
# Utilities
# Dev dependencies
## Alternatives Considered
| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Next.js 16 | Vite + React Router v7 | When SEO is irrelevant, team dislikes the App Router mental model, or maximum deployment portability matters more than DX. Vite is genuinely faster to set up for pure SPAs. |
| Zustand | Jotai | When state is highly granular and independent (individual atom per entity). Jotai's atomic model fits fine-grained reactivity better; Zustand's store model fits interconnected fantasy roster/league state better. |
| Zustand | Redux Toolkit | When team size > 5 engineers and strict action traceability is required. Overkill for a prototype. |
| Recharts | Chart.js / react-chartjs-2 | When canvas rendering is needed for extreme dataset sizes (10K+ data points). Recharts SVG is fine for 50-200 data points per chart (politician trade histories). |
| Motion | React Spring | When physics-based spring animations are the primary need. Motion's API is more ergonomic for layout animations and entry/exit transitions. |
| html-to-image | @vercel/og + Satori | When OG images need to be generated server-side with consistent fonts across all browsers. For a prototype where share cards are triggered by user action, client-side html-to-image is simpler — no edge function required. |
| date-fns | dayjs | When Moment.js compatibility is needed or bundle size is the top constraint (dayjs is ~6kb gzip vs date-fns ~18kb). For this app, date-fns tree-shaking erases the size difference in practice. |
## What NOT to Use
| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Moment.js | Unmaintained since 2020, mutable API, 67kb gzipped. Explicitly listed as legacy by its own maintainers. | date-fns |
| Material UI (MUI) | Opinionated visual design requires fighting the library to achieve the dark, premium DraftKings aesthetic. Component customization surface is complex. | shadcn/ui (you own the components) |
| Tremor | Built on top of Recharts but intentionally limits access to Recharts' lower-level APIs. The "fantasy sports premium" design requires dropping below Tremor's abstraction layer. Use Recharts directly. | Recharts directly |
| Redux + Redux Toolkit | Correct tool for large teams needing audit trails, wrong tool for a solo/small prototype. Adds ~40kb and significant boilerplate for state that Zustand handles in 20 lines. | Zustand |
| Create React App (CRA) | Unmaintained since 2023. No longer receives security patches. Uses Webpack 4. | Next.js (or Vite if no SSG needed) |
| next/image with `output: 'export'` | Static export disables Next.js Image Optimization — `next/image` with remote URLs will throw at build time without `unoptimized: true`. | Set `images: { unoptimized: true }` in next.config.ts when using static export, or use standard `<img>` tags with manual lazy loading. |
| Styled Components / Emotion | CSS-in-JS runtime libraries add JS bundle weight and complicate dark mode implementation when Tailwind CSS is already handling theming via CSS variables. | Tailwind CSS |
## Stack Patterns by Variant
- Set `output: 'export'` in next.config.ts
- Set `images: { unoptimized: true }` (required for external politician portrait URLs)
- All data fetching must be client-side via TanStack Query (no `getServerSideProps`)
- Pre-populate data at build time or via JSON files imported into components
- Remove `output: 'export'` and use standard Next.js deployment on Vercel
- Use Route Handlers (`app/api/`) as a thin proxy to avoid exposing API keys in client bundle
- TanStack Query still handles client-side caching and request deduplication
- Add `@vercel/og` with Satori for edge-rendered OG images
- Keep `html-to-image` for user-triggered in-app share card downloads
- Both can coexist in the same project
## Version Compatibility
| Package | Compatible With | Notes |
|---------|-----------------|-------|
| Next.js 16.x | React 19.2 | Bundled together — do not manually install a different React version |
| Tailwind CSS 4.x | shadcn/ui CLI v4 | shadcn re-released components for Tailwind v4 compatibility; run `npx shadcn@latest` not `npx shadcn-ui@latest` (old package name) |
| Zustand 5.x | React 18+ | Dropped React < 18 support; uses native `useSyncExternalStore` |
| Recharts 3.x | React 18+ | 3.0 rewrote internal state management; migration guide available if upgrading from 2.x |
| Motion (latest) | React 18+ | Import from `motion/react` NOT `framer-motion` — package was renamed |
| TanStack Query 5.x | React 18+ | v5 requires React 18 for Suspense hooks |
## Sources
- [Vercel Next.js docs — framework overview](https://vercel.com/docs/frameworks/full-stack/nextjs) — deployment patterns confirmed
- [Next.js 16 release blog](https://nextjs.org/blog/next-16) — Turbopack default, React Compiler stable, October 2025 release
- [Tailwind CSS v4.0 release post](https://tailwindcss.com/blog/tailwindcss-v4) — January 22 2025 stable release confirmed
- [shadcn/ui dark mode docs](https://ui.shadcn.com/docs/dark-mode) — next-themes integration pattern
- [shadcn/ui Tailwind v4 docs](https://ui.shadcn.com/docs/tailwind-v4) — CLI v4 compatibility confirmed
- [Zustand v5 announcement](https://pmnd.rs/blog/announcing-zustand-v5) — persist middleware, React 18 requirement
- [TanStack Query v5 overview](https://tanstack.com/query/v5/docs/framework/react/overview) — Suspense hooks, caching behavior
- [Motion for React docs](https://motion.dev/docs/react) — `motion/react` import path, rebranding from framer-motion
- [LogRocket React chart libraries 2025](https://blog.logrocket.com/best-react-chart-libraries-2025/) — Recharts vs ApexCharts assessment; MEDIUM confidence (community source)
- [Recharts npm](https://www.npmjs.com/package/recharts) — v3.8.0 latest confirmed
- [html-to-image GitHub](https://github.com/bubkoo/html-to-image) — client-side approach for share cards
- [Vercel OG image generation](https://vercel.com/blog/introducing-vercel-og-image-generation-fast-dynamic-social-card-images) — Satori/edge alternative for OG images
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd:quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd:debug` for investigation and bug fixing
- `/gsd:execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd:profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
