import type { Receipt } from '../types/receipt';
import { EmptyState } from './EmptyState';
import { ReceiptCard } from './ReceiptCard';

interface ReceiptListProps {
  receipts: Receipt[];
  onSelect: (id: string) => void;
  reducedMotion?: boolean;
}

/** Grid of receipt cards; falls back to EmptyState when filters remove everything. */
export function ReceiptList({ receipts, onSelect, reducedMotion = false }: ReceiptListProps) {
  if (receipts.length === 0) {
    return <EmptyState testid="receipt-list-empty" title="No receipts match" message="Loosen the search, filters, or timeline range to see this chapter's receipts." />;
  }
  return (
    <motion.div
      data-testid="receipt-list"
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3"
      initial={reducedMotion ? false : 'hidden'}
      animate={reducedMotion ? false : 'visible'}
      variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
    >
      {receipts.map((receipt) => (
        <motion.div key={receipt.id} variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: reducedMotion ? 0 : 0.25 }}>
          <ReceiptCard receipt={receipt} onSelect={onSelect} />
        </motion.div>
      ))}
    </motion.div>
  );
}
import { motion } from 'framer-motion';
