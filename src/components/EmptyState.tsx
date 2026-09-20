interface EmptyStateProps {
  title: string;
  message: string;
  testid?: string;
  onRetry?: () => void;
}

/** Friendly empty/error state with an inline receipt illustration; retry carries visible text. */
export function EmptyState({ title, message, testid = 'empty-state', onRetry }: EmptyStateProps) {
  return (
    <div data-testid={testid} className="rounded-2xl border border-dashed border-border bg-surface px-6 py-14 text-center">
      <svg
        viewBox="0 0 96 96"
        className="mx-auto h-20 w-20 text-text-faint"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="22" y="12" width="52" height="72" rx="6" />
        <path d="M22 70h52" strokeDasharray="2 4" />
        <line x1="34" y1="30" x2="62" y2="30" />
        <line x1="34" y1="42" x2="58" y2="42" />
        <line x1="34" y1="54" x2="54" y2="54" />
        <circle cx="48" cy="66" r="4" />
      </svg>
      <h3 className="mt-5 text-base font-bold text-text">{title}</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-text-muted">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          data-testid={`${testid}-retry`}
          className="mt-6 inline-flex min-h-[44px] items-center rounded-full px-6 py-2.5 text-sm font-semibold text-white transition-shadow hover:shadow-md active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          style={{ background: 'var(--accent-gradient)' }}
        >
          Try loading again
        </button>
      )}
    </div>
  );
}
