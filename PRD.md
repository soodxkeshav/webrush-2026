# Life in Receipts — Product Requirements Document

**Track:** WebRush 2026 — Track 1: "Your Life, In Receipts"
**Author:** Keshav Sood
**Date:** Sep 20, 2026
**Status:** In Development
**Time Budget:** 6 hours (10:00–16:00)

---

## 1. The Problem (As Stated)

Build a frontend-only digital experience that transforms a collection of fictional "life receipts" into a meaningful and interactive story. Participants receive the same dataset containing different types of digital-life activities. The task is **not** to display records. It is to:

> Raw Data → Insights → Connections → Story

A chronological list of receipts is explicitly insufficient. The solution must surface relationships between unrelated-looking records and make them discoverable.

---

## 2. Our Interpretation

The provided dataset is not one life — it is **three overlapping lives** across three distinct eras:

| Era | Years | Source Dataset | Character |
|---|---|---|---|
| **The Quiet Years** | ~2018 | Household Transactions | Homebound. Trains, idli, chai, festivals, subscription creep. |
| **The Wanderer** | 2023 | India Transact (Augmented) | Mobile. Entertainment, credit cards, cities across India. |
| **The Night Sessions** | 2024 | Spotify History | Introspective. Late-night Android listening, skips, Beach Boys. |

**Narrative claim:** these three eras are the same person. The app reveals what changed between them — from ritualized daily survival to urban movement to private late-night listening.

This framing is defensible because:
- The dates don't overlap, they sequence
- Each dataset has a distinct emotional texture
- The music threading across the eras gives the story a spine

---

## 3. Target User

**Primary:** A curious reader who wants to understand a stranger's life through digital traces. They spend 5–15 minutes exploring and should leave with a story in their head — not a table of numbers.

**Secondary:** The FAIE evaluator, whose criteria are documented in `memory.md`.

---

## 4. Success Criteria

### Core (must ship)
- [ ] All three datasets load and merge into one unified `Receipt[]`
- [ ] Auto-generated chapters group receipts into meaningful periods
- [ ] Click any receipt → discover up to 6 related receipts with reasons
- [ ] Patterns panel surfaces ≥6 auto-computed insights
- [ ] Full-text search + filter by type + filter by era
- [ ] Timeline scrubber narrows the visible range
- [ ] Intro screen sets the scene
- [ ] Responsive across mobile / tablet / desktop
- [ ] Light + dark themes with persistence

### FAIE-specific (evaluator-facing)
- [ ] 15+ component files in `src/components/`
- [ ] TypeScript strict mode, no `any`
- [ ] `data-testid` on every interactive element
- [ ] Every button has visible text
- [ ] No `<dialog>`, no icon-only primary actions
- [ ] README + 6 supporting docs in repo root
- [ ] Commit history ≥ 15 commits

### Quality bar
- [ ] First paint < 1.5s on desktop
- [ ] Zero console errors
- [ ] Zero external network requests beyond the three CSVs
- [ ] WCAG AA contrast in both themes
- [ ] `prefers-reduced-motion` respected

---

## 5. Functional Requirements

### 5.1 Data Loading
The app fetches three CSVs from `public/data/` and parses them with PapaParse. Each source has a dedicated mapper in `utils/normalize.ts`. Rows that fail validation are skipped with a `console.warn`, never crashing the app.

### 5.2 Chapter Generation
Receipts are bucketed by `YYYY-MM`. Buckets with fewer than 5 receipts are merged into the adjacent month. Each surviving bucket becomes a `Chapter` with:
- Title inferred from dominant signal (lookup table in `utils/analyze.ts`)
- Subtitle = month/year range
- Insight line auto-generated from the strongest pattern in that bucket

### 5.3 Connections
Clicking a receipt opens the Connection Panel. Every other receipt is scored:

| Condition | Weight |
|---|---|
| Same calendar day | +0.50 |
| Same city or state | +0.30 |
| Same hour ±1 (music only) | +0.15 |
| Complementary types | +0.10 |
| Same category | +0.10 |

Top 6 above threshold 0.35 are returned with a human-readable `reason` string.

### 5.4 Patterns
Ten patterns computed once on load and cached:
1. Most active weekday
2. Peak listening hour
3. Top 3 artists
4. Total subscription spend
5. Most-visited city
6. Late-night music ratio
7. Longest consecutive-day streak
8. Fraud transaction count
9. Full time span
10. Receipts per era

### 5.5 Search & Filters
- Search: case-insensitive match against `title`, `subtitle`, `location`
- Type: All / Music / Purchase / Transaction
- Era: All / Quiet / Wanderer / Night
- Date range: Timeline Scrubber

### 5.6 Theme
Three-state cycle: system → light → dark. Persisted under `lifeReceipts.theme.v1`.

---

## 6. Non-Functional Requirements

| Category | Requirement |
|---|---|
| Performance | First Contentful Paint < 1.5s; Total Blocking Time < 200ms |
| Accessibility | WCAG AA; keyboard navigable; semantic HTML; ARIA on all icon buttons |
| Responsiveness | Tested at 375px, 768px, 1024px, 1440px |
| Reliability | Corrupted CSV rows skipped, never crash; ErrorBoundary wraps App |
| Observability | `console.warn` on skipped rows; no `console.log` in production |
| Portability | Works from `file://` after build; deploys to Vercel + GitHub Pages |

---

## 7. Non-Goals

- Backend, APIs, server-side logic — forbidden by hackathon rules
- Real user authentication
- Editing, mutating, or adding to the dataset
- Persisting user state beyond theme
- Real-time collaboration

---

## 8. Constraints

- **Time:** 6 hours total, 3 submission attempts
- **Team:** Solo
- **Stack:** React 18 + TypeScript + Vite (locked — see `architecture.md` for justification)
- **Data:** Provided by organizers only, read-only

---

## 9. Deliverables

1. Public GitHub repository
2. Live deployment URL (Vercel primary, GitHub Pages fallback)
3. This documentation set: PRD, architecture, rules, design, tasks, memory
4. README.md at repo root

---

## 10. Risks & Mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| Spotify CSV slows initial load | High | Trimmed to 5,000 rows before deploy |
| Date parsing errors across three formats | High | Dedicated parser per format + skip-on-fail |
| FAIE evaluator fails to find elements | Medium | `data-testid` on every interactive element |
| Running out of time before deploy | Medium | Placeholder deployed at 10:15 (Attempt #1) |
| Missing FAIE pattern recognition | Medium | Documentation set + commit history |
| Losing all progress to a bad commit | Low | Commit every 20 min, push immediately |
