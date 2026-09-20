import { ReceiptText, Search, Shuffle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { SearchBar } from './SearchBar';
import { ThemeToggle } from './ThemeToggle';

/** Sticky SaaS top bar: brand, search, "Surprise me", theme — shadow appears on scroll. */
export function Header() {
  const receipts = useAppStore((s) => s.receipts);
  const selectReceipt = useAppStore((s) => s.selectReceipt);
  const search = useAppStore((s) => s.filters.search);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = (): void => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const surprise = (): void => {
    if (receipts.length === 0) return;
    const pick = receipts[Math.floor(Math.random() * receipts.length)];
    selectReceipt(pick.id);
  };

  return (
    <header
      data-testid="app-header"
      className={`sticky top-0 z-30 border-b border-border bg-surface/90 backdrop-blur-md transition-shadow ${
        scrolled ? 'elevate-2' : ''
      }`}
    >
      <div className="mx-auto flex w-full max-w-page flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3 lg:px-8">
        <a href="#main-content" className="flex items-center gap-2.5 text-text" data-testid="brand">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl text-white" style={{ background: 'var(--accent-gradient)' }} aria-hidden="true">
            <ReceiptText size={18} />
          </span>
          <span className="hidden flex-col leading-tight sm:flex">
            <span className="text-sm font-bold tracking-tight">Life in Receipts</span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-text-faint">Three Eras · One Life</span>
          </span>
        </a>

        <div className="mx-auto hidden min-w-0 flex-1 justify-center px-4 md:flex md:max-w-md">
          <SearchBar />
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={surprise}
            data-testid="surprise-me"
            className="inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-white transition-transform hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            style={{ background: 'var(--accent-gradient)', boxShadow: 'var(--shadow-sm)' }}
            title="Jump to a random receipt"
          >
            <Shuffle size={14} aria-hidden="true" />
            Surprise me
          </button>
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setSearchOpen((v) => !v)}
            data-testid="search-toggle"
            aria-label="Toggle search"
            aria-expanded={searchOpen}
            className={`inline-flex h-11 w-11 items-center justify-center rounded-full border transition-colors md:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
              searchOpen ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-surface text-text-muted hover:bg-surface-2 hover:text-text'
            }`}
          >
            <Search size={17} aria-hidden="true" />
          </button>
        </div>

        {(searchOpen || search !== '') && (
          <div className="w-full md:hidden">
            <SearchBar />
          </div>
        )}
      </div>
    </header>
  );
}
