import { useAppStore } from '../store/useAppStore';

/** Full-text search over titles, subtitles, locations and music metadata (PRD §5.5). */
export function SearchBar() {
  const search = useAppStore((s) => s.filters.search);
  const setFilters = useAppStore((s) => s.setFilters);

  return (
    <div className="relative min-w-0 flex-1 sm:max-w-xs">
      <label htmlFor="receipt-search" className="sr-only">
        Search receipts
      </label>
      <input
        id="receipt-search"
        type="search"
        value={search}
        onChange={(e) => setFilters({ search: e.target.value })}
        placeholder="Search receipts…"
        data-testid="search-input"
        className="h-9 w-full rounded-lg border border-border bg-surface px-3 text-sm text-text placeholder:text-text-faint focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:ring-offset-surface"
      />
    </div>
  );
}
