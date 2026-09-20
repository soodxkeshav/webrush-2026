import { ReceiptText, Shuffle } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { SearchBar } from './SearchBar';
import { ThemeToggle } from './ThemeToggle';

/** Sticky top bar: brand, search, "Surprise me" jump, theme cycle (design.md §9). */
export function Header() {
  const receipts = useAppStore((s) => s.receipts);
  const selectReceipt = useAppStore((s) => s.selectReceipt);

  const surprise = (): void => {
    if (receipts.length === 0) return;
    const pick = receipts[Math.floor(Math.random() * receipts.length)];
    selectReceipt(pick.id);
  };

  return (
    <header
      data-testid="app-header"
      className="sticky top-0 z-30 border-b border-border bg-surface/90 backdrop-blur"
    >
      <div className="mx-auto flex w-full max-w-page flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3 lg:px-8">
        <a href="#main-content" className="flex items-center gap-2 text-text" data-testid="brand">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-music text-white" aria-hidden="true">
            <ReceiptText size={18} />
          </span>
          <span className="hidden flex-col leading-tight sm:flex">
            <span className="text-sm font-bold tracking-tight">Life in Receipts</span>
            <span className="text-[11px] font-medium uppercase tracking-widest text-text-faint">Three eras · One life</span>
          </span>
        </a>
        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={surprise}
            data-testid="surprise-me"
            className="inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-lg bg-gradient-to-br from-primary to-music px-3 py-2 text-xs font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            title="Jump to a random receipt"
          >
            <Shuffle size={14} aria-hidden="true" />
            Surprise me
          </button>
          <ThemeToggle />
        </div>
        <div className="w-full sm:ml-auto sm:w-52 lg:w-64">
          <SearchBar />
        </div>
      </div>
    </header>
  );
}
