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

/** One receipt (design.md §8): type-colored left border, icon tile, click to connect. */
export function ReceiptCard({ receipt, onSelect, selected = false }: ReceiptCardProps) {
  const meta = TYPE_META[receipt.type];
  const Icon = TYPE_ICONS[receipt.type];
  const amount = receipt.type === 'music' ? null : receipt.amount;

  return (
    <button
      type="button"
      data-testid="receipt-card"
      data-receipt-id={receipt.id}
      onClick={() => onSelect(receipt.id)}
      aria-label={`${receipt.type}: ${receipt.title}. View connections.`}
      className={`group w-full rounded-xl border bg-surface p-4 text-left shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
        selected ? 'border-primary' : 'border-border'
      }`}
      style={{ borderLeft: `4px solid ${meta.color}` }}
    >
      <div className="flex items-start gap-3">
        <span
          className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${meta.color}1a`, color: meta.color }}
          aria-hidden="true"
        >
          <Icon size={18} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-text" data-testid="receipt-title">
            {receipt.title}
          </span>
          {receipt.subtitle && (
            <span className="mt-0.5 block truncate text-xs text-text-muted" data-testid="receipt-subtitle">
              {receipt.subtitle}
            </span>
          )}
          <span className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-medium text-text-faint">
            <span data-testid="receipt-datetime">{formatDateTime(receipt.timestamp)}</span>
            {receipt.location && (
              <span className="inline-flex items-center gap-1">
                <MapPin size={11} aria-hidden="true" />
                {receipt.location}
              </span>
            )}
            {receipt.type === 'music' && (
              <span>
                {formatDuration(receipt.msPlayed)}
                {receipt.skipped && ' · skipped'}
              </span>
            )}
            {amount !== null && (
              <span className="font-semibold tabular-nums" data-testid="receipt-amount">
                {formatAmount(amount)}
              </span>
            )}
          </span>
        </span>
      </div>
    </button>
  );
}
