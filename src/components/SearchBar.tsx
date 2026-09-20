import { Search } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

/** Full-text search over titles, subtitles, locations and music metadata (PRD §5.5). */
export function SearchBar() {
  const search = useAppStore((s) => s.filters.search);
  const setFilters = useAppStore((s) => s.setFilters);

  return (
    <div className="relative w-full">
      <label htmlFor="receipt-search" className="sr-only">
        Search receipts
      </label>
      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-faint" aria-hidden="true">
        <Search size={15} />
      </span>
      <input
        id="receipt-search"
        type="search"
        value={search}
        onChange={(e) => setFilters({ search: e.target.value })}
        placeholder="Search receipts…"
        data-testid="search-input"
        className="h-11 w-full rounded-full border border-border bg-surface-2/60 pl-10 pr-4 text-sm text-text placeholder:text-text-faint hover:border-primary/30 focus:border-primary focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
      />
    </div>
  );
}
