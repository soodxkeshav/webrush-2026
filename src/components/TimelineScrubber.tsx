import { lazy, Suspense, useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { formatDate } from '../utils/format';

const DensityChart = lazy(() => import('./DensityChart'));

/** Timeline scrubber: narrows everything to a year window (memory.md: lives above the chapters). */
export function TimelineScrubber() {
  const receipts = useAppStore((s) => s.receipts);
  const dateRange = useAppStore((s) => s.dateRange);
  const setDateRange = useAppStore((s) => s.setDateRange);

  const bounds = useMemo(() => {
    if (receipts.length === 0) return null;
    const min = Math.min(...receipts.map((r) => r.timestamp));
    const max = Math.max(...receipts.map((r) => r.timestamp));
    return { min, max, fromYear: new Date(min).getFullYear(), toYear: new Date(max).getFullYear() };
  }, [receipts]);

  const [fromYear, toYear] = useMemo(() => {
    if (!bounds) return [0, 0];
    if (!dateRange) return [bounds.fromYear, bounds.toYear];
    return [new Date(dateRange[0]).getFullYear(), new Date(dateRange[1]).getFullYear()];
  }, [bounds, dateRange]);

  if (!bounds) return null;

  const setFrom = (year: number): void => {
    const clamped = Math.min(year, toYear);
    setDateRange([new Date(clamped, 0, 1).getTime(), dateRange?.[1] ?? bounds.max]);
  };
  const setTo = (year: number): void => {
    const clamped = Math.max(year, fromYear);
    setDateRange([dateRange?.[0] ?? bounds.min, new Date(clamped, 11, 31, 23, 59, 59).getTime()]);
  };

  return (
    <section data-testid="timeline-scrubber" aria-label="Timeline range" className="rounded-xl border border-border bg-surface p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.14em] text-text-faint">Timeline</h2>
        <p className="text-xs font-medium tabular-nums text-text-muted" data-testid="timeline-label">
          {formatDate(dateRange?.[0] ?? bounds.min)} – {formatDate(dateRange?.[1] ?? bounds.max)}
        </p>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-4">
        <div className="flex flex-1 items-center gap-2">
          <label htmlFor="timeline-from" className="text-[11px] font-bold uppercase tracking-wider text-text-faint">
            From
          </label>
          <input
            id="timeline-from"
            type="range"
            min={bounds.fromYear}
            max={bounds.toYear}
            step={1}
            value={fromYear}
            onChange={(e) => setFrom(Number(e.target.value))}
            data-testid="timeline-from"
            className="w-full accent-primary"
          />
          <span className="w-10 text-right text-xs font-semibold tabular-nums text-text">{fromYear}</span>
        </div>
        <div className="flex flex-1 items-center gap-2">
          <label htmlFor="timeline-to" className="text-[11px] font-bold uppercase tracking-wider text-text-faint">
            To
          </label>
          <input
            id="timeline-to"
            type="range"
            min={bounds.fromYear}
            max={bounds.toYear}
            step={1}
            value={toYear}
            onChange={(e) => setTo(Number(e.target.value))}
            data-testid="timeline-to"
            className="w-full accent-primary"
          />
          <span className="w-10 text-right text-xs font-semibold tabular-nums text-text">{toYear}</span>
        </div>
        {dateRange && (
          <button
            type="button"
            onClick={() => setDateRange(null)}
            data-testid="timeline-reset"
            className="min-h-[44px] rounded-lg border border-border px-3 py-2.5 text-xs font-semibold text-text-muted transition-colors hover:bg-surface-2 hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            All years
          </button>
        )}
      </div>
      <div className="mt-3">
        <Suspense fallback={null}>
          <DensityChart />
        </Suspense>
      </div>
    </section>
  );
}
