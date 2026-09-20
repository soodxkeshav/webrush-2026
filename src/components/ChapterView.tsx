import { motion } from 'framer-motion';
import { ArrowDown, MapPin, ReceiptText, Wallet } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { ERA_META } from '../constants';
import { useAppStore } from '../store/useAppStore';
import type { Chapter, Receipt } from '../types/receipt';
import { formatAmountCompact } from '../utils/format';
import { ReceiptList } from './ReceiptList';

interface ChapterViewProps {
  chapter: Chapter;
}

const PAGE_SIZE = 50;

/** Active chapter hero: eyebrow, big title, insight, stat chips, then the receipts. */
export function ChapterView({ chapter }: ChapterViewProps) {
  const receipts = useAppStore((s) => s.receipts);
  const selectReceipt = useAppStore((s) => s.selectReceipt);
  const markChapterVisited = useAppStore((s) => s.markChapterVisited);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [typedInsight, setTypedInsight] = useState('');
  const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    markChapterVisited(chapter.id);
    setVisibleCount(PAGE_SIZE);
    if (reducedMotion) {
      setTypedInsight(chapter.insight);
      return;
    }
    setTypedInsight('');
    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setTypedInsight(chapter.insight.slice(0, index));
      if (index >= chapter.insight.length) window.clearInterval(timer);
    }, 1500 / Math.max(1, chapter.insight.length));
    return () => window.clearInterval(timer);
  }, [chapter.id, chapter.insight, markChapterVisited, reducedMotion]);

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

  const stats = useMemo(() => {
    let spent = 0;
    const cities = new Set<string>();
    for (const r of inChapter) {
      if (r.type !== 'music') spent += r.amount;
      if (r.city) cities.add(r.city);
    }
    return { spent, cities: cities.size };
  }, [inChapter]);

  const visible = inChapter.slice(0, visibleCount);
  const remaining = inChapter.length - visible.length;

  return (
    <motion.section
      key={chapter.id}
      data-testid="chapter-view"
      aria-label={`Chapter: ${chapter.title}`}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.1 }}
    >
      <header className="mb-6">
        <p
          className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-text-faint"
          data-testid="chapter-eyebrow"
        >
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: ERA_META[chapter.era].color }} aria-hidden="true" />
          {ERA_META[chapter.era].label}
          <span className="text-text-faint/60">·</span>
          {chapter.subtitle}
        </p>
        <h2 className="mt-3 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-text sm:text-[2.5rem] sm:leading-[1.1]" data-testid="chapter-title">
          {chapter.title}
        </h2>
        <p className="mt-3 max-w-2xl text-sm italic leading-relaxed text-text-muted" data-testid="chapter-insight">
          {typedInsight}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2" data-testid="chapter-stats">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold text-text-muted">
            <ReceiptText size={12} aria-hidden="true" style={{ color: ERA_META[chapter.era].color }} />
            {inChapter.length.toLocaleString()} receipts
          </span>
          {stats.spent > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold text-text-muted">
              <Wallet size={12} aria-hidden="true" className="text-purchase" />
              {formatAmountCompact(stats.spent)} spent
            </span>
          )}
          {stats.cities > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold text-text-muted">
              <MapPin size={12} aria-hidden="true" className="text-transaction" />
              {stats.cities} {stats.cities === 1 ? 'city' : 'cities'}
            </span>
          )}
          <span className="text-xs text-text-faint">Showing {visible.length.toLocaleString()}</span>
        </div>
      </header>

      <motion.div initial={reducedMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: reducedMotion ? 0 : 1.5, duration: 0.35 }}>
        <ReceiptList receipts={visible} onSelect={selectReceipt} reducedMotion={reducedMotion} />
      </motion.div>

      {remaining > 0 && (
        <div className="mt-6 text-center">
          <motion.button
            type="button"
            onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
            whileTap={{ scale: 0.98 }}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold text-white transition-shadow hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            style={{ background: 'var(--accent-gradient)' }}
            data-testid="load-more-receipts"
          >
            Show {Math.min(PAGE_SIZE, remaining)} more
            <ArrowDown size={15} aria-hidden="true" />
            <span className="text-white/70">({remaining} remaining)</span>
          </motion.button>
        </div>
      )}
    </motion.section>
  );
}
