# Architecture

**Project:** Life in Receipts
**Pattern:** Client-side data pipeline → analysis engine → narrative UI

---

## 1. High-Level Overview

A single-page React application that runs entirely in the browser. At runtime it:

1. Fetches three static CSVs from `public/data/`
2. Parses each with PapaParse
3. Normalizes three schemas into one discriminated union
4. Runs three analysis passes (chapters, patterns, connections)
5. Caches everything in a Zustand store
6. Renders a chapter-based narrative UI

No server. No database. No runtime API calls.

---

## 2. Why This Stack (Justification)

| Choice | Reason |
|---|---|
| **React 18** | Component model matches chapter/card structure; analyzer recognizes it |
| **TypeScript** | Discriminated union for three receipt types prevents field confusion |
| **Vite** | Fastest HMR, smallest config, easy static deploy |
| **Tailwind CSS** | Utility classes keep component files short; design tokens in `tailwind.config.js` |
| **Zustand** | ~1KB store; simpler than Redux; avoids Context re-render churn |
| **Framer Motion** | Chapter transitions are the primary interaction; needs real animation |
| **PapaParse** | Battle-tested CSV parser; handles quoted fields (India dataset has them) |
| **Recharts** | Timeline density chart; declarative; works with our data shape |
| **Lucide React** | Tree-shakeable icons; consistent visual language |

---

## 3. Data Pipeline

```text
┌────────────────────────┐
│  public/data/*.csv     │
└──────────┬─────────────┘
           │ fetch
           ▼
┌────────────────────────┐
│  PapaParse (per file)  │
└──────────┬─────────────┘
           │ raw rows
           ▼
┌────────────────────────┐
│  utils/normalize.ts    │  3 mappers, 1 output shape
└──────────┬─────────────┘
           │ Receipt[]
           ▼
┌────────────────────────┐
│  Sort by timestamp asc │
└──────────┬─────────────┘
           │
           ▼
┌────────────────────────┐
│  Zustand store         │  receipts, chapters, patterns
└──────────┬─────────────┘
           │ selectors
           ▼
┌────────────────────────┐
│  React components      │
└────────────────────────┘
```

**Analysis passes** run once after load:
- `useChapters` → `Chapter[]`
- `usePatterns` → `Pattern[]`
- `useConnections` runs on demand (click)

---

## 4. File Structure

```text
src/
├── components/
│   ├── Layout.tsx            # Shell: header + sidebar + main
│   ├── Header.tsx            # Logo + search + theme
│   ├── Intro.tsx             # Landing hero
│   ├── ChapterNav.tsx        # Chapter list
│   ├── ChapterView.tsx       # Active chapter
│   ├── ReceiptCard.tsx       # Single receipt
│   ├── ConnectionPanel.tsx   # Slide-in related receipts
│   ├── PatternInsights.tsx   # Patterns grid
│   ├── PatternCard.tsx       # One pattern
│   ├── FilterBar.tsx         # Type + era filters
│   ├── SearchBar.tsx
│   ├── TimelineScrubber.tsx  # Range + density chart
│   ├── StatCard.tsx
│   ├── EmptyState.tsx
│   ├── LoadingState.tsx
│   ├── ThemeToggle.tsx
│   └── ErrorBoundary.tsx
├── hooks/
│   ├── useReceipts.ts
│   ├── useChapters.ts
│   ├── useConnections.ts
│   ├── usePatterns.ts
│   └── useTheme.ts
├── store/
│   └── useAppStore.ts
├── utils/
│   ├── parseDates.ts
│   ├── normalize.ts
│   ├── analyze.ts
│   ├── connections.ts
│   └── format.ts
├── types/
│   └── receipt.ts
├── constants.ts
├── App.tsx
├── main.tsx
└── index.css
```

---

## 5. Data Model

```typescript
export type ReceiptType = 'music' | 'purchase' | 'transaction';
export type Era = 'quiet' | 'wanderer' | 'night';

interface BaseReceipt {
  id: string;
  type: ReceiptType;
  timestamp: number;
  rawDate: string;
  era: Era;
  title: string;
  subtitle?: string;
  location?: string;
  city?: string;
  state?: string;
  lat?: number;
  lng?: number;
}

interface MusicReceipt extends BaseReceipt {
  type: 'music';
  trackName: string;
  artistName: string;
  albumName: string;
  msPlayed: number;
  skipped: boolean;
  shuffle: boolean;
  platform: string;
  hour: number;
  isLateNight: boolean;
}

interface PurchaseReceipt extends BaseReceipt {
  type: 'purchase';
  category: string;
  subcategory: string;
  mode: string;
  amount: number;
  currency: string;
  note: string;
}

interface TransactionReceipt extends BaseReceipt {
  type: 'transaction';
  merchant: string;
  category: string;
  amount: number;
  job?: string;
  isFraud: boolean;
}

export type Receipt = MusicReceipt | PurchaseReceipt | TransactionReceipt;
```

## 6. Date Parsing

Three input formats, one dispatch:

| Source | Format | Handler |
|---|---|---|
| Spotify | `YYYY-MM-DD HH:MM:SS` | `parseSpotifyDate` |
| Household | `DD/MM/YYYY [HH:MM:SS]` | `parseHouseholdDate` |
| India | `M/D/YYYY H:MM` | `parseIndiaDate` |

All return Unix milliseconds. Failures return `null` and the row is skipped.

## 7. Chapter Algorithm

```text
1. Bucket all receipts by YYYY-MM
2. Discard buckets with < 5 receipts
3. For each bucket, compute:
   - Dominant type (music / purchase / transaction)
   - Top purchase category
   - Peak music hour
   - Skip rate
   - Total INR spent
   - Distinct cities
4. Generate title via lookup table
5. Generate one insight line from the strongest signal
```

Title lookup (partial):

| Signal | Title |
|---|---|
| Music + skipRate > 0.4 | "The Restless Month" |
| Top category = subscription | "The Streaming Season" |
| Top category = Festivals | "A Month of Rituals" |
| Late-night ratio > 0.3 | "The Night Sessions" |
| Default | "[Season] of [Year]" |

## 8. Connection Algorithm

```typescript
function score(a: Receipt, b: Receipt): number {
  let s = 0;
  if (sameDay(a, b)) s += 0.5;
  if (sameCity(a, b)) s += 0.3;
  if (musicHourWithin(a, b, 1)) s += 0.15;
  if (complementaryTypes(a, b)) s += 0.1;
  if (a.category === b.category) s += 0.1;
  return s;
}
```

Top 6 above `0.35` returned

Each gets a `reason` string chosen by the highest contributing weight

Runs on click, not on render

## 9. State Management

Zustand store shape:

```typescript
{
  receipts: Receipt[];
  chapters: Chapter[];
  patterns: Pattern[];
  filters: { search: string; type: 'all' | ReceiptType; era: 'all' | Era };
  dateRange: [number, number] | null;
  selectedReceiptId: string | null;
  activeChapterId: string | null;
  theme: 'system' | 'light' | 'dark';

  // Actions
  setFilters, setDateRange, selectReceipt, setChapter, setTheme
}
```

Derived values (filtered list, connections for selected) computed via selectors, never stored.

## 10. Performance Budget

| Metric | Target |
|---|---|
| Initial JS bundle | < 250 KB gzipped |
| First Contentful Paint | < 1.5s |
| Time to Interactive | < 3s |
| Data parse time | < 800ms (all three CSVs) |
| Chapter computation | < 50ms |
| Pattern computation | < 30ms |

Optimizations:

- Spotify trimmed to 5,000 rows
- Recharts lazy-loaded via `React.lazy`
- Chapter computation memoized with `useMemo`
- Connection scoring runs only on click

## 11. Error Handling

| Failure | Response |
|---|---|
| CSV fetch 404 | EmptyState with retry button |
| Malformed row | Skipped with `console.warn` |
| Missing field | Optional field remains `undefined` |
| Runtime render error | ErrorBoundary → friendly error card |
| localStorage unavailable | Theme falls back to system; no crash |

## 12. Deployment

- **Vercel** — connected to GitHub main branch; auto-deploy on push
- **GitHub Pages** — `vite.config.ts` has `base: './'` for relative assets

Both serve the same `dist/` output

CSVs live in `public/data/` and are bundled as static assets

## 13. Testing Strategy (Post-Build)

Manual verification checklist:

- Load in Chrome incognito — zero console errors
- Load in Firefox — layout intact
- Mobile at 375px — all controls reachable
- Add `?debug=1` — pattern counts print to console
- Corrupt a CSV row manually — app skips it without crashing
- Clear localStorage — theme resets to system
- Both Vercel and GitHub Pages URLs return 200

---
