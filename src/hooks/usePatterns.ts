import { useEffect, useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { discoverPatterns } from '../utils/analyze';

/** Memoized pattern computation (once on load), mirrored into the store. */
export function usePatterns(): void {
  const receipts = useAppStore((s) => s.receipts);
  const setPatterns = useAppStore((s) => s.setPatterns);
  const patterns = useMemo(() => discoverPatterns(receipts), [receipts]);

  useEffect(() => {
    setPatterns(patterns);
  }, [patterns, setPatterns]);
}
