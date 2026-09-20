# Life in Receipts

**Track:** WebRush 2026 — Track 1: "Your Life, In Receipts"
**Author:** Keshav Sood
**Live:** https://webrush-2026-phi.vercel.app/
**Code:** https://github.com/soodxkeshav/webrush-2026

Three datasets. Three eras. One fictional life — told entirely through the digital receipts it left behind.

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

## Getting Started

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

## Deployment

Static output, deployable to Vercel (primary) or GitHub Pages (`base: './'` for relative assets). Also works from `file://` after build.

---

Built solo in six hours for WebRush 2026. Frontend-only by rule, narrative by design.
