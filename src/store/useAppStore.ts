import { create } from 'zustand';
import type { Chapter, Era, Pattern, Receipt, ReceiptType } from '../types/receipt';

export interface Filters {
  search: string;
  type: 'all' | ReceiptType;
  era: 'all' | Era;
}

export interface AppState {
  receipts: Receipt[];
  skipped: number;
  loading: boolean;
  error: string | null;
  chapters: Chapter[];
  patterns: Pattern[];
  filters: Filters;
  /** Inclusive [startMs, endMs] window from the timeline scrubber. */
  dateRange: [number, number] | null;
  selectedReceiptId: string | null;
  activeChapterId: string | null;
  introDismissed: boolean;

  setReceipts: (receipts: Receipt[], skipped: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setChapters: (chapters: Chapter[]) => void;
  setPatterns: (patterns: Pattern[]) => void;
  setFilters: (patch: Partial<Filters>) => void;
  setDateRange: (range: [number, number] | null) => void;
  selectReceipt: (id: string | null) => void;
  setChapter: (id: string | null) => void;
  dismissIntro: () => void;
  clearFilters: () => void;
}

export const useAppStore = create<AppState>()((set) => ({
  receipts: [],
  skipped: 0,
  loading: true,
  error: null,
  chapters: [],
  patterns: [],
  filters: { search: '', type: 'all', era: 'all' },
  dateRange: null,
  selectedReceiptId: null,
  activeChapterId: null,
  introDismissed: false,

  setReceipts: (receipts, skipped) =>
    set((s) => ({
      receipts,
      skipped,
      activeChapterId: s.activeChapterId ?? null,
    })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setChapters: (chapters) => set({ chapters }),
  setPatterns: (patterns) => set({ patterns }),
  setFilters: (patch) => set((s) => ({ filters: { ...s.filters, ...patch } })),
  setDateRange: (dateRange) => set({ dateRange }),
  selectReceipt: (selectedReceiptId) => set({ selectedReceiptId }),
  setChapter: (activeChapterId) => set({ activeChapterId }),
  dismissIntro: () => set({ introDismissed: true }),
  clearFilters: () =>
    set({ filters: { search: '', type: 'all', era: 'all' }, dateRange: null }),
}));

/** Case-insensitive full-text match against title, subtitle, location and music fields (PRD §5.5). */
function matchesSearch(r: Receipt, q: string): boolean {
  const haystack = [
    r.title,
    r.subtitle,
    r.location,
    r.city,
    r.state,
    r.type === 'music' ? `${r.artistName} ${r.trackName} ${r.albumName}` : '',
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return haystack.includes(q);
}

/** Applies search, type, era and date-range filters to a receipt list. */
export function applyFilters(receipts: Receipt[], filters: Filters, dateRange: [number, number] | null): Receipt[] {
  const q = filters.search.trim().toLowerCase();
  return receipts.filter((r) => {
    if (filters.type !== 'all' && r.type !== filters.type) return false;
    if (filters.era !== 'all' && r.era !== filters.era) return false;
    if (dateRange && (r.timestamp < dateRange[0] || r.timestamp > dateRange[1])) return false;
    if (q && !matchesSearch(r, q)) return false;
    return true;
  });
}

/** Convenience selector: filtered receipts in store order (chronological). */
export function selectFilteredReceipts(state: AppState): Receipt[] {
  return applyFilters(state.receipts, state.filters, state.dateRange);
}
