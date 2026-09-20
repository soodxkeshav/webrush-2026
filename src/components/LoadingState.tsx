/** Full-page loading state: three shimmer skeleton cards while the three CSVs parse. */
export function LoadingState() {
  return (
    <div data-testid="loading-state" role="status" aria-live="polite" className="mx-auto max-w-6xl px-4 py-10">
      <span className="mx-auto block h-10 w-10 animate-spin rounded-full border-[3px] border-border border-t-primary" aria-hidden="true" />
      <h2 className="mt-6 text-lg font-bold text-text">Opening the archive…</h2>
      <p className="mt-1 text-sm text-text-muted">Loading three eras of receipts — household ledgers, card swipes, and late-night tracks.</p>
      <div className="mt-10 grid gap-4 lg:grid-cols-[220px_1fr] lg:grid-rows-[80px_1fr]" aria-hidden="true">
        <div className="shimmer h-20 rounded-xl lg:col-span-2" />
        <div className="shimmer hidden min-h-[420px] rounded-xl lg:block" />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="shimmer flex h-28 items-center gap-4 rounded-xl px-4">
            <span className="h-10 w-10 shrink-0 rounded-lg bg-border/60" />
            <span className="flex-1 space-y-2">
              <span className="block h-3 w-3/4 rounded-full bg-border/60" />
              <span className="block h-3 w-1/2 rounded-full bg-border/40" />
            </span>
            <span className="h-3 w-14 shrink-0 rounded-full bg-border/40" />
          </div>
        ))}
        </div>
      </div>
    </div>
  );
}
