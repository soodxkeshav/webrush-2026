import { ReceiptText } from 'lucide-react';
import { SearchBar } from './SearchBar';
import { ThemeToggle } from './ThemeToggle';

/** Sticky top bar: brand mark, full-text search, theme cycle (design.md §9). */
export function Header() {
  return (
    <header
      data-testid="app-header"
      className="sticky top-0 z-30 border-b border-border bg-surface/90 backdrop-blur"
    >
      <div className="mx-auto flex w-full max-w-page items-center gap-3 px-4 py-3 lg:px-8">
        <a href="#main-content" className="flex items-center gap-2 text-text" data-testid="brand">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-music text-white" aria-hidden="true">
            <ReceiptText size={18} />
          </span>
          <span className="hidden flex-col leading-tight sm:flex">
            <span className="text-sm font-bold tracking-tight">Life in Receipts</span>
            <span className="text-[11px] font-medium uppercase tracking-widest text-text-faint">Three eras · One life</span>
          </span>
        </a>
        <div className="ml-auto flex min-w-0 flex-1 items-center justify-end gap-2 sm:gap-3">
          <SearchBar />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
