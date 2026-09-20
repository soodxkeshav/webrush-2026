import type { Receipt } from '../types/receipt';
import { EmptyState } from './EmptyState';
import { ReceiptCard } from './ReceiptCard';

interface ReceiptListProps {
  receipts: Receipt[];
  onSelect: (id: string) => void;
}

/** Grid of receipt cards; falls back to EmptyState when filters remove everything. */
export function ReceiptList({ receipts, onSelect }: ReceiptListProps) {
  if (receipts.length === 0) {
    return <EmptyState testid="receipt-list-empty" title="No receipts match" message="Loosen the search, filters, or timeline range to see this chapter's receipts." />;
  }
  return (
    <div data-testid="receipt-list" className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {receipts.map((receipt) => (
        <ReceiptCard key={receipt.id} receipt={receipt} onSelect={onSelect} />
      ))}
    </div>
  );
}
