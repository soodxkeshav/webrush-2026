import { motion } from 'framer-motion';
import { CreditCard, MapPin, Music, ShoppingBag } from 'lucide-react';
import { TYPE_META } from '../constants';
import { formatAmount, formatDateTime, formatDuration } from '../utils/format';
import type { Receipt } from '../types/receipt';

interface ReceiptCardProps {
  receipt: Receipt;
  onSelect: (id: string) => void;
  selected?: boolean;
}

const TYPE_ICONS = { music: Music, purchase: ShoppingBag, transaction: CreditCard } as const;

/** One premium receipt (design.md §8): type-colored spine, icon tile, meta chips, click to connect. */
export function ReceiptCard({ receipt, onSelect, selected = false }: ReceiptCardProps) {
  const meta = TYPE_META[receipt.type];
  const Icon = TYPE_ICONS[receipt.type];
  const amount = receipt.type === 'music' ? null : receipt.amount;

  const chip = 'inline-flex items-center gap-1 rounded-full bg-surface-2/80 px-2 py-0.5 text-[11px] font-medium text-text-muted';

  return (
    <motion.button
      type="button"
      data-testid="receipt-card"
      data-receipt-id={receipt.id}
      onClick={() => onSelect(receipt.id)}
      aria-label={`${receipt.type}: ${receipt.title}. View connections.`}
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={`group w-full overflow-hidden rounded-xl border bg-surface p-4 text-left transition-shadow hover:elevate-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
        selected ? 'border-primary' : 'border-border'
      }`}
      style={{ borderLeft: `4px solid ${meta.color}` }}
    >
      <span className="flex items-start gap-3">
        <span
          className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${meta.color}1a`, color: meta.color }}
          aria-hidden="true"
        >
          <Icon size={19} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[15px] font-bold text-text" data-testid="receipt-title">
            {receipt.title}
          </span>
          {receipt.subtitle && (
            <span className="mt-0.5 block truncate text-[13px] text-text-muted" data-testid="receipt-subtitle">
              {receipt.subtitle}
            </span>
          )}
          <span className="mt-2.5 flex flex-wrap items-center gap-1.5" data-testid="receipt-meta">
            <span className={chip} data-testid="receipt-datetime">{formatDateTime(receipt.timestamp)}</span>
            {receipt.location && (
              <span className={chip}>
                <MapPin size={10} aria-hidden="true" />
                {receipt.location}
              </span>
            )}
            {receipt.type === 'music' && (
              <span className={chip}>
                {formatDuration(receipt.msPlayed)}
                {receipt.skipped && ' · skipped'}
              </span>
            )}
            {amount !== null && (
              <span className={`${chip} font-bold tabular-nums`} data-testid="receipt-amount">
                {formatAmount(amount)}
              </span>
            )}
          </span>
        </span>
      </span>
    </motion.button>
  );
}
