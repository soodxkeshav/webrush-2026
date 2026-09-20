import { ERA_META, TYPE_META } from '../constants';
import { useAppStore } from '../store/useAppStore';
import type { Era, ReceiptType } from '../types/receipt';

const TYPE_OPTIONS: ('all' | ReceiptType)[] = ['all', 'music', 'purchase', 'transaction'];
const ERA_OPTIONS: ('all' | Era)[] = ['all', 'quiet', 'wanderer', 'night'];

const BUTTON_BASE =
  'min-h-[44px] rounded-lg border px-3 text-xs font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';
const BUTTON_ON = 'border-primary bg-primary/10 text-text';
const BUTTON_OFF = 'border-border bg-surface text-text-muted hover:bg-surface-2 hover:text-text';

/** Type + era filters as button groups — one testid per option (PRD §5.5, FAIE rules). */
export function FilterBar() {
  const filters = useAppStore((s) => s.filters);
  const setFilters = useAppStore((s) => s.setFilters);
  const clearFilters = useAppStore((s) => s.clearFilters);
  const dateRange = useAppStore((s) => s.dateRange);

  const dirty = filters.type !== 'all' || filters.era !== 'all' || filters.search !== '' || dateRange !== null;

  return (
    <div data-testid="filter-bar" className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <div role="group" aria-label="Filter by receipt type" className="flex flex-wrap items-center gap-1.5">
        <span className="mr-1 text-[11px] font-bold uppercase tracking-wider text-text-faint">Type</span>
        {TYPE_OPTIONS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setFilters({ type: t })}
            aria-pressed={filters.type === t}
            data-testid={`filter-type-${t}`}
            className={`${BUTTON_BASE} ${filters.type === t ? BUTTON_ON : BUTTON_OFF}`}
          >
            {t === 'all' ? 'All' : TYPE_META[t].label}
          </button>
        ))}
      </div>
      <div role="group" aria-label="Filter by era" className="flex flex-wrap items-center gap-1.5">
        <span className="mr-1 text-[11px] font-bold uppercase tracking-wider text-text-faint">Era</span>
        {ERA_OPTIONS.map((era) => (
          <button
            key={era}
            type="button"
            onClick={() => setFilters({ era })}
            aria-pressed={filters.era === era}
            data-testid={`filter-era-${era}`}
            className={`${BUTTON_BASE} ${filters.era === era ? BUTTON_ON : BUTTON_OFF}`}
          >
            {era === 'all' ? 'All' : ERA_META[era].label.replace('The ', '')}
          </button>
        ))}
      </div>
      {dirty && (
        <button
          type="button"
          onClick={clearFilters}
          data-testid="filter-clear"
          className={`${BUTTON_BASE} border-border bg-surface text-text-muted hover:bg-surface-2 hover:text-text`}
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
