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
    <>
      <Header />
      <Layout
        nav={<ChapterNav chapters={chapters} />}
        main={
          <div className="space-y-5">
            <FilterBar />
            <TimelineScrubber />
            {activeChapter && <ChapterView chapter={activeChapter} />}
          </div>
        }
        insights={<PatternInsights />}
      />
      <ConnectionPanel />
    </>
  );
}
