import { motion } from 'framer-motion';
import { useEffect, useMemo } from 'react';
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
    </motion.div>
  );
}
