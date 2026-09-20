import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/** Wraps the app: render crashes become a friendly card with a retry (architecture.md §11). */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[error-boundary]', error.message, info.componentStack);
  }

  render(): ReactNode {
    if (this.state.error === null) return this.props.children;
    return (
      <div data-testid="error-boundary" className="mx-auto max-w-lg px-4 py-24 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-danger/10 text-danger" aria-hidden="true">
          <AlertTriangle size={22} />
        </span>
        <h1 className="mt-4 text-xl font-bold text-text">The story hit a snag</h1>
        <p className="mt-2 text-sm leading-relaxed text-text-muted">
          Something broke while rendering the receipts. Your data is fine — the page just needs a reload.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          data-testid="error-boundary-retry"
          className="mt-6 rounded-lg bg-gradient-to-br from-primary to-music px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Try again
        </button>
      </div>
    );
  }
}
