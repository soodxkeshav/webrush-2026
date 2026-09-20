import { useCallback } from 'react';
import { ERA_META } from '../constants';
import { useAppStore } from '../store/useAppStore';
import type { Chapter } from '../types/receipt';

interface ChapterNavProps {
  chapters: Chapter[];
}

/** Chapter rail: one button per chapter, arrow-key navigable (rules: keyboard nav). */
export function ChapterNav({ chapters }: ChapterNavProps) {
  const activeChapterId = useAppStore((s) => s.activeChapterId);
  const setChapter = useAppStore((s) => s.setChapter);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLUListElement>) => {
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
      event.preventDefault();
      const index = chapters.findIndex((c) => c.id === activeChapterId);
      const next = event.key === 'ArrowDown'
        ? Math.min(chapters.length - 1, index + 1)
        : Math.max(0, index <= 0 ? 0 : index - 1);
      if (chapters[next]) setChapter(chapters[next].id);
    },
    [activeChapterId, chapters, setChapter],
  );

  return (
    <section data-testid="chapter-nav" aria-label="Chapters">
      <h2 className="mb-3 px-1 text-[11px] font-bold uppercase tracking-[0.14em] text-text-faint">
        Chapters
      </h2>
      <ul
        className="flex flex-col gap-1"
        role="listbox"
        aria-label="Choose a chapter"
        onKeyDown={handleKeyDown}
      >
        {chapters.map((chapter) => {
          const active = chapter.id === activeChapterId;
          return (
            <li key={chapter.id}>
              <button
                type="button"
                role="option"
                aria-selected={active}
                data-testid="chapter-item"
                data-chapter-id={chapter.id}
                onClick={() => setChapter(chapter.id)}
                className={`w-full rounded-lg border px-3 py-2.5 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary ${
                  active
                    ? 'border-primary/40 bg-surface-2 shadow-xs'
                    : 'border-transparent hover:border-border hover:bg-surface-2/60'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: ERA_META[chapter.era].color }} aria-hidden="true" />
                  <span className={`truncate text-sm font-semibold ${active ? 'text-text' : 'text-text-muted'}`}>
                    {chapter.title}
                  </span>
                </span>
                <span className="mt-0.5 block pl-4 text-[11px] font-medium uppercase tracking-wider text-text-faint">
                  {chapter.subtitle} · {chapter.receiptCount}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
