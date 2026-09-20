import type { ReactNode } from 'react';

interface LayoutProps {
  nav: ReactNode;
  main: ReactNode;
  insights: ReactNode;
}

/**
 * Application shell (design.md §9): nav + main + insights on desktop,
 * insights dropping below on tablet and stacking on mobile.
 */
export function Layout({ nav, main, insights }: LayoutProps) {
  return (
    <div className="mx-auto grid w-full max-w-page grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)_320px] lg:px-8">
      <nav
        data-testid="chapter-nav-region"
        aria-label="Chapters"
        className="order-2 lg:order-1 lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto"
      >
        {nav}
      </nav>
      <main id="main-content" className="order-1 min-w-0 lg:order-2">
        {main}
      </main>
      <aside
        data-testid="insights-region"
        aria-label="Pattern insights"
        className="order-3 xl:sticky xl:top-20 xl:self-start xl:max-h-[calc(100vh-6rem)] xl:overflow-y-auto"
      >
        {insights}
      </aside>
    </div>
  );
}
