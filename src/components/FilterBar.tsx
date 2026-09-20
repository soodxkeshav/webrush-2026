import { ERA_META, TYPE_META } from '../constants';
import { useAppStore } from '../store/useAppStore';
import type { Era, ReceiptType } from '../types/receipt';

const TYPE_OPTIONS: ('all' | ReceiptType)[] = ['all', 'music', 'purchase', 'transaction'];
const ERA_OPTIONS: ('all' | Era)[] = ['all', 'quiet', 'wanderer', 'night'];

/** Type + era filters as native selects with visible labels (PRD §5.5). */
export function FilterBar() {
  const filters = useAppStore((s) => s.filters);
  const setFilters = useAppStore((s) => s.setFilters);
  const clearFilters = useAppStore((s) => s.clearFilters);
  const dateRange = useAppStore((s) => s.dateRange);

  const dirty = filters.type !== 'all' || filters.era !== 'all' || filters.search !== '' || dateRange !== null;

  return (
    <div data-testid="filter-bar" className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-1.5">
        <label htmlFor="filter-type" className="text-[11px] font-bold uppercase tracking-wider text-text-faint">
          Type
        </label>
        <select
          id="filter-type"
          value={filters.type}
          onChange={(e) => setFilters({ type: e.target.value as 'all' | ReceiptType })}
          data-testid="filter-type"
          className="h-9 rounded-lg border border-border bg-surface px-2.5 text-sm font-medium text-text focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {TYPE_OPTIONS.map((t) => (
            <option key={t} value={t}>
              {t === 'all' ? 'All types' : TYPE_META[t].label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-1.5">
        <label htmlFor="filter-era" className="text-[11px] font-bold uppercase tracking-wider text-text-faint">
          Era
        </label>
        <select
          id="filter-era"
          value={filters.era}
          onChange={(e) => setFilters({ era: e.target.value as 'all' | Era })}
          data-testid="filter-era"
          className="h-9 rounded-lg border border-border bg-surface px-2.5 text-sm font-medium text-text focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {ERA_OPTIONS.map((era) => (
            <option key={era} value={era}>
              {era === 'all' ? 'All eras' : ERA_META[era].label}
            </option>
          ))}
        </select>
      </div>
      {dirty && (
        <button
          type="button"
          onClick={clearFilters}
          data-testid="filter-clear"
          className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-text-muted transition-colors hover:bg-surface-2 hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
