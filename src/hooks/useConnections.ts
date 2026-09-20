import { useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import type { Connection } from '../types/receipt';
import { findConnections } from '../utils/connections';

/**
 * Connections for the selected receipt, recomputed only when the selection
 * changes (architecture.md: "runs on demand (click)"). Returns null when
 * nothing is selected.
 */
export function useConnections(): Connection[] | null {
  const receipts = useAppStore((s) => s.receipts);
  const selectedReceiptId = useAppStore((s) => s.selectedReceiptId);

  return useMemo(() => {
    if (selectedReceiptId === null) return null;
    const target = receipts.find((r) => r.id === selectedReceiptId);
    if (!target) return null;
    return findConnections(target, receipts);
  }, [receipts, selectedReceiptId]);
}
