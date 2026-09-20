import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  message: string;
  testid?: string;
  onRetry?: () => void;
}

/** Friendly empty/error state; retry button carries visible text (FAIE rule). */
export function EmptyState({ title, message, testid = 'empty-state', onRetry }: EmptyStateProps) {
  return (
    <div data-testid={testid} className="rounded-xl border border-dashed border-border bg-surface px-6 py-12 text-center">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-surface-2 text-text-faint" aria-hidden="true">
        <Inbox size={22} />
      </span>
      <h3 className="mt-4 text-base font-semibold text-text">{title}</h3>
      <p className="mx-auto mt-1 max-w-sm text-sm leading-relaxed text-text-muted">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          data-testid={`${testid}-retry`}
          className="mt-5 rounded-lg bg-gradient-to-br from-primary to-music px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md active:scale-98 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Try loading again
        </button>
      )}
    </div>
  );
}
