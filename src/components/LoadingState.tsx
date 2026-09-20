/** Full-page loading skeleton shown while the three CSVs parse. */
export function LoadingState() {
  return (
    <div data-testid="loading-state" role="status" aria-live="polite" className="mx-auto max-w-3xl px-4 py-24 text-center">
      <span className="mx-auto block h-10 w-10 animate-spin rounded-full border-[3px] border-border border-t-primary" aria-hidden="true" />
      <h2 className="mt-6 text-lg font-bold text-text">Opening the archive…</h2>
      <p className="mt-1 text-sm text-text-muted">Loading three eras of receipts — household ledgers, card swipes, and late-night tracks.</p>
      <div className="mt-8 space-y-3" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="mx-auto h-14 max-w-xl animate-pulse rounded-xl bg-surface-2" style={{ animationDelay: `${i * 120}ms` }} />
        ))}
      </div>
    </div>
  );
}
