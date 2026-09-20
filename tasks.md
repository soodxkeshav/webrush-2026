# Build Plan — 6 Hours

**Start:** 10:00 AM · **Deadline:** 4:00 PM · **Attempts:** 3

---

## The 3-Attempt Strategy (Critical)

| # | When | What | Purpose |
|---|---|---|---|
| 1 | 10:15 | Placeholder app deployed | Safety net — never run out of time |
| 2 | 14:00 | Working app with all features | Read score report |
| 3 | 15:45 | Surgical fixes based on report | Final score |

---

## Hour 0 — Setup Sprint (10:00–10:15)

**Goal:** Live URL submitted before reading the problem in depth.

- [ ] Extract three zips → one folder
- [ ] Trim Spotify to 5,000 rows
- [ ] Copy CSVs to `public/data/` (spotify.csv, household.csv, india.csv)
- [ ] Copy starter template files (Vite config, tailwind, tsconfig)
- [ ] `npm install`
- [ ] Paste placeholder `App.tsx`
- [ ] `git init && git add . && git commit -m "chore: initial scaffold"`
- [ ] Create GitHub repo `webrush-2026`, push
- [ ] Import to Vercel, deploy
- [ ] **SUBMIT ATTEMPT #1** with placeholder URL

**Success criterion:** Live URL exists and is submitted. Nothing else matters yet.

---

## Hour 1 — Data Foundation (10:15–11:15)

- [ ] `src/types/receipt.ts` — full discriminated union
- [ ] `src/constants.ts` — era mapping, category configs, colors
- [ ] `src/utils/parseDates.ts` — three format handlers
- [ ] `src/utils/normalize.ts` — three schema mappers
- [ ] `src/utils/format.ts` — display helpers (formatAmount, formatTime)
- [ ] `src/hooks/useReceipts.ts` — fetch + parse + normalize
- [ ] `src/store/useAppStore.ts` — Zustand store
- [ ] **Verify:** `console.warn` logs total receipts loaded and skipped rows
- [ ] Commit: `feat: data pipeline`

**Checkpoint:** Open browser, run `npm run dev`, verify receipts load. If count is 0, fix before moving on.

---

## Hour 2 — Analysis Engine (11:15–12:15)

- [ ] `src/utils/analyze.ts` — `groupByChapter()`, `generateChapterTitle()`
- [ ] `src/utils/connections.ts` — `score()`, `findConnections()`
- [ ] `src/utils/analyze.ts` — `discoverPatterns()` returns 10 patterns
- [ ] `src/hooks/useChapters.ts`
- [ ] `src/hooks/useConnections.ts`
- [ ] `src/hooks/usePatterns.ts`
- [ ] **Verify:** chapters count ≈ 8–15; patterns count = 10
- [ ] Commit: `feat: analysis engine`

**Checkpoint:** Log chapters and patterns to console. Confirm titles are non-generic.

---

## Hour 3 — Core UI (12:15–13:15)

- [ ] `src/components/Layout.tsx`
- [ ] `src/components/Header.tsx`
- [ ] `src/components/Intro.tsx`
- [ ] `src/components/ChapterNav.tsx`
- [ ] `src/components/ChapterView.tsx`
- [ ] `src/components/ReceiptCard.tsx`
- [ ] `src/components/EmptyState.tsx`
- [ ] `src/components/LoadingState.tsx`
- [ ] **Verify:** intro → chapters → cards flow works end to end
- [ ] Commit: `feat: core UI`

**Checkpoint:** Screenshot-able. Share with friend — does the story make sense?

---

## Hour 4 — Interactivity + Insights (13:15–14:15)

- [ ] `src/components/ConnectionPanel.tsx`
- [ ] `src/components/PatternInsights.tsx`
- [ ] `src/components/PatternCard.tsx`
- [ ] `src/components/FilterBar.tsx`
- [ ] `src/components/SearchBar.tsx`
- [ ] `src/components/TimelineScrubber.tsx`
- [ ] `src/components/ThemeToggle.tsx`
- [ ] `src/hooks/useTheme.ts`
- [ ] **Verify:** click receipt → connections open; filters narrow list
- [ ] Commit: `feat: interactivity and insights`
- [ ] **DEPLOY + SUBMIT ATTEMPT #2**
- [ ] **READ SCORE REPORT CAREFULLY**

**Checkpoint:** Score report tells you exactly what to fix in Hour 5.

---

## Hour 5 — Polish + FAIE Pass (14:15–15:15)

### Design polish
- [ ] Tailwind spacing pass — all gaps use 8px scale
- [ ] Framer Motion transitions on chapter change (respect `prefers-reduced-motion`)
- [ ] Hover states on all interactive elements
- [ ] Lucide icons per receipt type
- [ ] Responsive: test at 375px, 768px, 1024px, 1440px

### FAIE-critical pass
- [ ] `data-testid` on every button, input, link, checkbox, card
- [ ] Every button has visible text
- [ ] No `<dialog>` anywhere
- [ ] No `appearance: none` on checkboxes
- [ ] No entry animation > 100ms on added DOM

### Error handling
- [ ] `ErrorBoundary.tsx` wraps App
- [ ] CSV fetch failure → EmptyState + retry
- [ ] Malformed row → skip with `console.warn`

- [ ] Commit: `style: polish and FAIE pass`

---

## Hour 6 — Documentation + Final (15:15–16:00)

- [ ] `README.md` — concept, tech stack, how to run, structure
- [ ] `PRD.md`
- [ ] `architecture.md`
- [ ] `rules.md`
- [ ] `design.md`
- [ ] `tasks.md` (this file)
- [ ] `memory.md`

### Fix pass (from attempt #2 report)

Prioritized by report category:

- **Functionality < 15** → more `data-testid`, ensure all buttons have text
- **Innovation < 3** → add novel feature (era comparison chart, "surprise me" jump)
- **Code Quality < 6** → extract more utils, add JSDoc, split large components
- **Performance < 6** → lazy-load Recharts, memoize chapters, trim more rows
- **Accessibility < 5** → audit labels, ARIA, keyboard nav

### Final verification
- [ ] Live URL loads in incognito (both Vercel + GitHub Pages)
- [ ] Zero console errors
- [ ] Zero network failures
- [ ] All three CSVs load
- [ ] Chapter nav works
- [ ] Connection panel opens + closes
- [ ] Search returns results
- [ ] Filters narrow list
- [ ] Dark mode toggles
- [ ] Mobile layout intact

- [ ] Commit: `docs: complete documentation`
- [ ] **DEPLOY + SUBMIT ATTEMPT #3**

---

## Post-Submission

- [ ] Screenshot light + dark + mobile
- [ ] Save all three score reports
- [ ] Archive project for portfolio
- [ ] Write a retro: what worked, what to improve

---

## Fallback If Behind Schedule

If at **12:00** the data pipeline isn't done:
- Cut patterns panel entirely
- Cut timeline scrubber
- Ship with: intro → chapters → receipt cards → connections → search

If at **14:00** the app doesn't work:
- Submit whatever exists as Attempt #2
- Spend Hour 5 fixing only what the report flags
- Accept a simpler app that scores

If at **15:30** the app is broken:
- Do NOT submit attempt #3
- Keep attempt #2's score

---

## Commit Message Convention

```text
feat: add chapter generation algorithm
fix: date parser handling Feb 29
docs: add architecture.md
style: align card padding to 8px scale
refactor: extract connection scoring into utils
chore: trim spotify csv to 5000 rows
```

Push after every commit. Vercel auto-deploys.
