import { motion } from 'framer-motion';
import { useEffect, useMemo, useRef } from 'react';
import { useAppStore } from './store/useAppStore';
import { useReceipts } from './hooks/useReceipts';
import { useChapters } from './hooks/useChapters';
import { usePatterns } from './hooks/usePatterns';
import { debugLog } from './utils/analyze';
import { Header } from './components/Header';
import { Intro } from './components/Intro';
import { Layout } from './components/Layout';
import { ChapterNav } from './components/ChapterNav';
import { ChapterView } from './components/ChapterView';
import { FilterBar } from './components/FilterBar';
import { TimelineScrubber } from './components/TimelineScrubber';
import { PatternInsights } from './components/PatternInsights';
import { ConnectionPanel } from './components/ConnectionPanel';
import { EmptyState } from './components/EmptyState';
import { LoadingState } from './components/LoadingState';
import { HelpOverlay } from './components/HelpOverlay';
import { ERA_META, TYPE_META } from './constants';
import type { Era, ReceiptType } from './types/receipt';

/** Root: intro → header → (nav | chapter flow | patterns) with the connection overlay. */
export function App() {
  const { reload } = useReceipts();
  useChapters();
  usePatterns();

  const loading = useAppStore((s) => s.loading);
  const error = useAppStore((s) => s.error);
  const introDismissed = useAppStore((s) => s.introDismissed);
  const chapters = useAppStore((s) => s.chapters);
  const patterns = useAppStore((s) => s.patterns);
  const receipts = useAppStore((s) => s.receipts);
  const activeChapterId = useAppStore((s) => s.activeChapterId);
  const setChapter = useAppStore((s) => s.setChapter);
  const filters = useAppStore((s) => s.filters);
  const setFilters = useAppStore((s) => s.setFilters);
  const selectedReceiptId = useAppStore((s) => s.selectedReceiptId);
  const selectReceipt = useAppStore((s) => s.selectReceipt);
  const setHelpOpen = useAppStore((s) => s.setHelpOpen);
  const helpOpen = useAppStore((s) => s.helpOpen);
  const hydratedFromUrl = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const chapter = params.get('chapter');
    if (chapter) setChapter(chapter);
    const type = params.get('type');
    const era = params.get('era');
    const validType = type && (type === 'all' || type in TYPE_META) ? type as 'all' | ReceiptType : null;
    const validEra = era && (era === 'all' || era in ERA_META) ? era as 'all' | Era : null;
    if (validType || validEra) setFilters({ ...(validType ? { type: validType } : {}), ...(validEra ? { era: validEra } : {}) });
    const receipt = params.get('receipt');
    if (receipt) selectReceipt(receipt);
    hydratedFromUrl.current = true;
  }, [selectReceipt, setChapter, setFilters, filters.type, filters.era]);

  useEffect(() => {
    if (!hydratedFromUrl.current) return;
    const params = new URLSearchParams();
    if (activeChapterId) params.set('chapter', activeChapterId);
    if (filters.type !== 'all') params.set('type', filters.type);
    if (filters.era !== 'all') params.set('era', filters.era);
    if (selectedReceiptId) params.set('receipt', selectedReceiptId);
    const next = params.toString();
    window.history.replaceState(null, '', next ? `${window.location.pathname}?${next}` : window.location.pathname);
  }, [activeChapterId, filters.type, filters.era, selectedReceiptId]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      const target = event.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
        if (event.key === 'Escape') {
          setFilters({ search: '' });
          selectReceipt(null);
          setHelpOpen(false);
          target.blur();
        }
        return;
      }
      if (event.key === '?') { setHelpOpen(!helpOpen); return; }
      if (event.key === '/') { event.preventDefault(); document.getElementById('receipt-search')?.focus(); return; }
      const index = chapters.findIndex((chapter) => chapter.id === activeChapterId);
      if (event.key === 'j' || event.key === 'ArrowDown') { event.preventDefault(); if (chapters[index + 1]) setChapter(chapters[index + 1].id); }
      if (event.key === 'k' || event.key === 'ArrowUp') { event.preventDefault(); if (chapters[index - 1]) setChapter(chapters[index - 1].id); }
      if (event.key === 's') { const pick = receipts[Math.floor(Math.random() * receipts.length)]; if (pick) selectReceipt(pick.id); }
      if (event.key === 'Escape') { setHelpOpen(false); selectReceipt(null); setFilters({ search: '' }); }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [activeChapterId, chapters, filters, helpOpen, receipts, selectReceipt, setChapter, setFilters, setHelpOpen]);

  // Default to the first chapter once the archive is analyzed.
  useEffect(() => {
    if (activeChapterId === null && chapters.length > 0) setChapter(chapters[0].id);
  }, [activeChapterId, chapters, setChapter]);

  // ?debug=1 → structural counts in the console (architecture.md §13).
  useEffect(() => {
    if (receipts.length > 0) debugLog(receipts, chapters, patterns);
  }, [receipts, chapters, patterns]);

  const activeChapter = useMemo(
    () => chapters.find((c) => c.id === activeChapterId) ?? null,
    [chapters, activeChapterId],
  );

  if (loading) return <LoadingState />;
  if (error !== null) {
    return <EmptyState testid="data-error" title="The archive won't open" message={`The three receipt files failed to load (${error}). Check the connection and retry.`} onRetry={reload} />;
  }
  if (!introDismissed) return <Intro />;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }}>
      <Header />
      <Layout
        nav={<ChapterNav chapters={chapters} />}
        main={
          <div className="space-y-5">
            <div className="lg:hidden">
              <label htmlFor="chapter-mobile" className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-text-faint">
                Chapter
              </label>
              <select
                id="chapter-mobile"
                value={activeChapterId ?? ''}
                onChange={(e) => setChapter(e.target.value)}
                data-testid="chapter-select-mobile"
                className="h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm font-medium text-text focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {chapters.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title} · {c.subtitle}
                  </option>
                ))}
              </select>
            </div>
            <FilterBar />
            <TimelineScrubber />
            {activeChapter && <ChapterView chapter={activeChapter} />}
          </div>
        }
        insights={<PatternInsights />}
      />
      <ConnectionPanel />
      {helpOpen && <HelpOverlay onClose={() => setHelpOpen(false)} />}
    </motion.div>
  );
}
