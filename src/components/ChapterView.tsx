import { useMemo, useState } from 'react';
import { ERA_META } from '../constants';
import { useAppStore } from '../store/useAppStore';
import type { Chapter, Receipt } from '../types/receipt';
import { ReceiptList } from './ReceiptList';

interface ChapterViewProps {
  chapter: Chapter;
}

const PAGE_SIZE = 50;

/** Active chapter: eyebrow, generated title, insight line, and its receipts (design.md §8). */
export function ChapterView({ chapter }: ChapterViewProps) {
  const receipts = useAppStore((s) => s.receipts);
  const selectReceipt = useAppStore((s) => s.selectReceipt);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const inChapter = useMemo(
    () =>
      receipts.filter(
        (r: Receipt) =>
          r.era === chapter.era &&
          r.timestamp >= chapter.startTs &&
          r.timestamp <= chapter.endTs,
      ),
    [receipts, chapter.era, chapter.startTs, chapter.endTs],
  );

  const visible = inChapter.slice(0, visibleCount);
  const remaining = inChapter.length - visible.length;

  return (
    <section data-testid="chapter-view" aria-label={`Chapter: ${chapter.title}`}>
      <header className="mb-5">
        <p
          className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-text-faint"
          data-testid="chapter-eyebrow"
        >
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: ERA_META[chapter.era].color }}
            aria-hidden="true"
          />
          {ERA_META[chapter.era].label} · {chapter.subtitle}
        </p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-text" data-testid="chapter-title">
          {chapter.title}
        </h2>
        <p className="mt-2 max-w-2xl text-sm italic leading-relaxed text-text-muted" data-testid="chapter-insight">
          {chapter.insight}
        </p>
        <p className="mt-2 text-xs text-text-faint">
          Showing {visible.length} of {inChapter.length} receipts in this chapter
        </p>
      </header>

      <ReceiptList receipts={visible} onSelect={selectReceipt} />

      {remaining > 0 && (
        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
            className="min-h-[44px] rounded-lg border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-text-muted hover:bg-surface-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            data-testid="load-more-receipts"
          >
            Show {Math.min(PAGE_SIZE, remaining)} more · {remaining} remaining
          </button>
        </div>
      )}
    </section>
  );
}