import { useEffect, useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { buildChapters } from '../utils/analyze';

/**
 * Memoized chapter computation over the merged receipt list (once on load),
 * mirrored into the store for the rest of the UI.
 */
export function useChapters(): void {
  const receipts = useAppStore((s) => s.receipts);
  const setChapters = useAppStore((s) => s.setChapters);
  const chapters = useMemo(() => buildChapters(receipts), [receipts]);

  useEffect(() => {
    setChapters(chapters);
  }, [chapters, setChapters]);
}
