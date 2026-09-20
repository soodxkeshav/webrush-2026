# Life in Receipts

**Track:** WebRush 2026 — Track 1: "Your Life, In Receipts"
**Author:** Keshav Sood
**Live URL:** https://webrush-2026-phi.vercel.app/
**Code:** https://github.com/soodxkeshav/webrush-2026

Three datasets. Three eras. One fictional life — told entirely through the digital receipts it left behind.

![Landing screen] [screenshot: light-mode intro hero]
![Chapter view] [screenshot: chapter view with receipt cards and insights rail, light mode]
![Dark mode] [screenshot: dark-mode chapter view with connection drawer open]

---

## The Concept

The provided data is not displayed as records. It is read as **three overlapping eras of a single life**:

| Era | Years | Source Dataset | Character |
|---|---|---|---|
| **The Quiet Years** | ~2018 | Household Transactions | Homebound. Trains, idli, chai, festivals, subscription creep. |
| **The Wanderer** | 2023 | India Transact (Augmented) | Mobile. Entertainment, credit cards, cities across India. |
| **The Night Sessions** | 2024 | Spotify History | Introspective. Late-night Android listening, skips, Beach Boys. |

**Thesis:** the same person, six years apart. The app reveals what changed — from ritualized daily survival, to urban movement, to private late-night listening.

## Features

- **Chapter-based storytelling** — receipts grouped into narrative chapters with auto-generated titles and insights
- **Connection discovery** — click any receipt to surface up to 6 related receipts, each with a weighted score and a human-readable reason
- **12 auto-computed patterns** — peak listening hour, busiest month, top artists, subscription creep, most-visited city, fraud flags, music-to-purchase ratio, and more
- **Full-text search** across titles, subtitles, locations, and music metadata
- **Type & era filter buttons** plus a year-range timeline scrubber with a monthly density chart
- **"Surprise me"** — jump to a random receipt and see its connections
- **Light / dark / system themes** — persisted, with `prefers-reduced-motion` respected
- **Responsive to 375px**, keyboard navigable, semantic HTML with ARIA labels and visible focus rings

## The Pipeline

> Raw Data → Insights → Connections → Story

- **Chapters** — receipts are bucketed by month and titled by their dominant signal (e.g. "A Month of Rituals", "The Night Sessions")
- **Connections** — click any receipt to surface up to 6 related receipts, each with a human-readable reason
- **Patterns** — twelve auto-computed insights: peak listening hour, busiest month, subscription creep, most-visited city, fraud count, late-night ratio…
- **Search, filters & timeline** — full-text search, type/era filters, and a timeline scrubber with a density chart
- **Light & dark themes** — persisted, with `prefers-reduced-motion` respected

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 18 + TypeScript (strict) |
| Build | Vite |
| Styling | Tailwind CSS |
| State | Zustand |
| Animation | Framer Motion |
| CSV parsing | PapaParse |
| Charts | Recharts |
| Icons | Lucide React |

## How to Run

```bash
npm install
npm run dev      # local dev server
npm run build    # production build to dist/
npm run preview  # preview the production build
```

The app is fully client-side: no backend, no API keys, and no network requests beyond the three bundled CSVs. Corrupted rows are skipped with a `console.warn` — bad data never crashes the app.

## Data

Three CSVs live in `public/data/`:

| File | Era | Date format |
|---|---|---|
| `spotify.csv` | The Night Sessions (2024) | `YYYY-MM-DD HH:MM:SS` |
| `household.csv` | The Quiet Years (2018) | `DD/MM/YYYY [HH:MM:SS]` |
| `india.csv` | The Wanderer (2023) | `M/D/YYYY H:MM` |

## Project Structure

```text
src/
├── components/   # 15+ UI components, one per file
├── hooks/        # useReceipts, useChapters, usePatterns, useConnections, useTheme
├── store/        # Zustand store
├── utils/        # parseDates, normalize, analyze, connections, format
├── types/        # discriminated Receipt union
└── constants.ts
```

## Documentation

- [PRD.md](./PRD.md) — product requirements and success criteria
- [architecture.md](./architecture.md) — stack justification, data pipeline, algorithms
- [rules.md](./rules.md) — hackathon rules, evaluator rules, engineering standards
- [design.md](./design.md) — design system: type, color, spacing, motion
- [tasks.md](./tasks.md) — the 6-hour build plan
- [memory.md](./memory.md) — working memory, decisions log, evaluator notes

## Design System

- **Typeface:** Inter (400–800), with tabular numerals on all numeric displays
- **Palette:** slate neutrals on an off-black/white base; indigo `#6366f1` primary; era accents — teal `#14b8a6` (Quiet Years), coral `#fb7185` (Wanderer), indigo `#6366f1` (Night Sessions); receipt types — violet music, amber purchase, blue transaction
- **Elevation:** three-tier shadow scale (`--shadow-sm/md/lg`) as CSS variables, doubled in dark mode
- **Accents:** `--accent-gradient` (indigo → violet) drives brand marks, CTAs, and the density-chart fill
- **Shape & motion:** 12–16px radii, 8px spacing scale, hover lifts, spring-physics drawer, all gated by `prefers-reduced-motion`

## Accessibility

- Semantic HTML (`header`/`nav`/`main`/`aside`/`article`) with labeled regions
- Every input has an associated `<label>`; icon-only buttons carry `aria-label`
- Keyboard support: arrow-key chapter navigation, Esc closes the drawer, visible focus rings on all interactive elements
- Filter buttons expose `aria-pressed`; the connection strength indicator has an aria-label
- `prefers-reduced-motion` disables all animation; WCAG-AA contrast tokens in both themes

## Performance

- Fully client-side static build; no backend, no runtime APIs
- Recharts density chart lazy-loaded via `React.lazy`; connection scoring runs only on click
- Analysis (chapters + patterns) computed once on load and cached in the Zustand store
- Malformed CSV rows are skipped, never fatal; error boundary wraps the app
- Known tradeoff: the Inter webfont loads from Google Fonts (one external CSS request); everything else ships in the bundle

## Deployment

Static output, deployable to Vercel (primary) or GitHub Pages (`base: './'` for relative assets). Also works from `file://` after build.

---

Built solo in six hours for WebRush 2026. Frontend-only by rule, narrative by design.
