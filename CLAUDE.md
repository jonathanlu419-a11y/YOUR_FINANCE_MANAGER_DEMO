# CLAUDE.md — DoubleEntry (Feature Showcase)

Reference for future Claude Code sessions. Read at session start; keep it current.

## 1. Project overview

- **DoubleEntry** — a **public, standalone feature-showcase site**, NOT a working app. There is **no backend, no database, no auth, and no real data**. Each route is an isolated, fully-mocked interactive demo of **one** feature lifted from the main finance app.
- **Purpose**: a portfolio / showcase piece — a way to demonstrate specific engineering and interaction-design work to the public (job search, LinkedIn) **without exposing the private finance-app codebase or any real financial data**. Every demo reimplements just enough of a feature's shape to sell it; none of the real app's data model, API layer, or business logic ships here.
- **Main project (private, the real app)**: https://github.com/jonathanlu419-a11y/finance-portfolio-manager — this repo links back to it in the shared footer for full context.
- **Audience**: the public / hiring audience. Copy and framing are written for them, not for a developer sandbox.

## 2. Tech stack

- **Vite + React 18 + TypeScript** (SPA).
- **react-router-dom** (v6) — multi-page nav. This is the **one deliberately-accepted extra dependency** beyond React itself; see Guardrails. `lucide-react` is used for icons.
- **Plain CSS** — a single hand-written `src/index.css` with CSS custom properties (dark theme tokens). **No CSS framework** (no Tailwind, no CSS-in-JS).
- **BrowserRouter** (`src/main.tsx`) — real path-based routes, not hash routes.
- **Deployed on Vercel.** `vercel.json` holds an SPA rewrite (`/(.*) → /index.html`) so BrowserRouter deep-links (e.g. `/csv-import`) resolve on refresh/direct-hit instead of 404ing.

**Run locally:**
```bash
npm install
npm run dev       # Vite dev server
npm run build     # tsc --noEmit && vite build (type-check gates the build)
npm run preview   # preview the production build
```

## 3. Architecture / conventions

**Layout** (`src/components/Layout.tsx`): global `Header` + routed `<Outlet />` + one shared `footer` (linking to the main finance-portfolio-manager repo). The `.showcase` container centers and width-caps content (max 960px). Footer lives here once, not per-page.

**Routing** (`src/App.tsx`): `/` and any unknown path redirect to `/quick-add` (the flagship showcase). Each feature showcase is its own route → its own page component under `src/pages/`.

**Global header** (`src/components/Header.tsx`): Apple-style sticky, translucent dark bar — **"DoubleEntry" wordmark (◆ rotated-square glyph)** on the left, understated tracked nav links on the right, active-route underline. **Every new showcase gets a nav link added here when it ships.**

**Branding — "DoubleEntry"** (naming history, so it isn't re-litigated):
FPM → "Your Finance Manager" → KYM / "Know Your Money" (considered, rejected) → **DoubleEntry** (chosen). It self-evidences the differentiator — real double-entry accounting underneath, vs. a vibe-coded expense tracker — with no explanation needed.

**Mock-state rule**: every interactive demo is **100% client-side mock state** (`useState`/`useReducer`). Nothing is persisted, nothing is sent to a server, nothing needs real user data. **Each demo must be resettable to its initial state.**

**Component/file map:**

| Path | Purpose |
|------|---------|
| `src/main.tsx` | Entry — `BrowserRouter` + `App` |
| `src/App.tsx` | Route table (redirects + per-feature routes) |
| `src/components/Layout.tsx` | Header + routed outlet + shared footer |
| `src/components/Header.tsx` | Global Apple-style nav bar + wordmark |
| `src/components/Reveal.tsx` | CSS-only IntersectionObserver scroll-reveal wrapper (`delay` prop for stagger) |
| `src/pages/QuickAddPage.tsx` | Quick Add showcase (hero → features → framed stage w/ desktop/mobile toggle) |
| `src/pages/CsvImportPage.tsx` | CSV Import showcase — **placeholder** ("Coming soon") |
| `src/QuickAddDemo.tsx` | The interactive Quick Add wizard rendered inside the stage |
| `src/mockData.ts` | Static mock accounts / shortcuts / helpers (`formatCurrency`, etc.) |
| `src/index.css` | All theme tokens + component styles (copied faithfully from the real app) |

## 4. Design language / style guide

This is the Apple **"how we introduce a new iPhone feature"** pattern. Every showcase page follows it:

- **Page structure**: hero → hook / explainer copy → **framed interactive stage** → footer (link to main project repo).
- **Copy tone**: confident, benefit-led **marketing** copy that sells what the feature does and why it's good — never a neutral dev-sandbox description. Weave in the **privacy-first** angle where relevant: no bank login, no third-party sync, nothing you enter is saved or sent anywhere — it's a local simulation on mock data.
- **Visual style**: dark theme, large confident typography, generous whitespace. Section entrances animate via the CSS-only IntersectionObserver **scroll-reveal** (`Reveal`), staggered with the `delay` prop.
- **Interactive presentation — framed like a product shot, not a raw embedded app**:
  - **Desktop view** sits inside a mock app/browser window with traffic-light dots (`.desktop-window`).
  - **Mobile view** is shown via a **phone-frame** (`.mobile-frame`, with status bar + bottom nav), toggled by the pill **desktop / mobile switch** (`.view-toggle`).
  - The whole thing lives inside a gradient-lit **`.stage`** frame.
- **Reuse, don't rebuild**: new showcases should reuse the existing `Reveal`, `.stage`, `.desktop-window` / `.mobile-frame` / `.view-toggle` patterns and the shared hero/feature/footer classes rather than inventing new structure. Keep step/section transitions CSS-only (consistent with the no-new-dependencies rule).

## 5. Current state (as of this session — 2026-07-02)

- **Quick Add showcase** — ✅ **shipped and live.** Hero + feature highlights + framed interactive stage with the **desktop mock-window / mobile phone-frame toggle**, driven by a real mock dataset in `mockData.ts`: **8 grid entries** (7 one-tap quick shortcuts — Meal alone, Grocery, Public transit, Transfer, Salary, Dating, Refreshments — plus a "Full journal entry" fallback). Wizard: shortcut → payee → amount → review → confirm, appending to an in-memory session list.
- **CSV Import showcase** — 🟡 **placeholder only.** `src/pages/CsvImportPage.tsx` renders a "Coming soon" hero at `/csv-import` (route + nav link already wired). The full interactive wizard (**upload → auto-detect → three-tab review [Matched / Needs Review / Duplicates] → confirm**, all mock data keyed by which sample file is picked) is **scoped but not yet built** — the next planned showcase.
- **LinkedIn posts** — two drafted (a Quick Add announcement, and a dedup-index debugging story) but **not yet posted**. Not part of this repo — noted here only for context.

## 6. Guardrails

- **No new dependencies without discussion.** This repo stays lightweight. Before any `npm install` or first-time import from a new library: is a native/existing approach enough? Is it maintained? Bundle-size impact? Prefer the native alternative. `react-router-dom` is the accepted exception; don't grow the list casually.
- **No real backend / API calls in any showcase.** Everything is pre-baked mock data + local component state. No `fetch` to a live service, no file-system reads, no persistence.
- **No sensitive data, credentials, or private internals.** Never commit secrets, and never link to or reproduce private finance-app internals (real schema, real account data, API shapes, business logic). This repo is public — treat everything in it as published.
- **Every demo must reset.** Any interactive showcase needs a clear path back to its initial state (e.g. a "Start over" action).
- **Type-check before done.** `npm run build` runs `tsc --noEmit` first; keep it clean.
