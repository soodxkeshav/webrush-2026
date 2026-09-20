import { AnimatePresence, motion } from 'framer-motion';
import { CreditCard, Link2, Music, ShoppingBag, X } from 'lucide-react';
import { useEffect } from 'react';
import { ERA_META, TYPE_META } from '../constants';
import { useAppStore } from '../store/useAppStore';
import { useConnections } from '../hooks/useConnections';
import { formatDateTime } from '../utils/format';
import type { Receipt } from '../types/receipt';

const DAY_MS = 86_400_000;
const TYPE_ICONS = { music: Music, purchase: ShoppingBag, transaction: CreditCard } as const;

/** Short badge for the strongest link between two receipts (presentation mirror of connections.ts). */
function reasonBadge(target: Receipt, other: Receipt): string {
  if (Math.floor(target.timestamp / DAY_MS) === Math.floor(other.timestamp / DAY_MS)) return 'Same day';
  const sameCity = !!target.city && !!other.city && target.city.toLowerCase() === other.city.toLowerCase();
  const sameState = !!target.state && !!other.state && target.state.toLowerCase() === other.state.toLowerCase();
  if (sameCity || sameState) return 'Same place';
  if (target.type === 'music' && other.type === 'music') {
    const diff = Math.abs(target.hour - other.hour);
    if (Math.min(diff, 24 - diff) <= 1) return 'Same hour';
  }
  if (target.type !== 'music' && other.type !== 'music' && target.category === other.category) return 'Same category';
  return 'Related';
}

/** Slide-in drawer of related receipts with reasons and strength dots (PRD §5.3). */
export function ConnectionPanel() {
  const selectedReceiptId = useAppStore((s) => s.selectedReceiptId);
  const receipts = useAppStore((s) => s.receipts);
  const selectReceipt = useAppStore((s) => s.selectReceipt);
  const connections = useConnections();

  const target = selectedReceiptId === null ? null : receipts.find((r) => r.id === selectedReceiptId) ?? null;

  useEffect(() => {
    if (!target) return;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') selectReceipt(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [target, selectReceipt]);

  const meta = target ? TYPE_META[target.type] : null;
  const TargetIcon = target ? TYPE_ICONS[target.type] : null;

  return (
    <AnimatePresence>
      {target && (
        <>
          <motion.div
            key="backdrop"
            data-testid="connection-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => selectReceipt(null)}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            aria-hidden="true"
          />
          <motion.aside
            key="panel"
            role="complementary"
            aria-label={`Connections for ${target.title}`}
            data-testid="connection-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full flex-col border-l border-border bg-surface shadow-lg sm:w-[400px]"
          >
            <header className="flex items-start justify-between gap-3 border-b border-border p-5">
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-text-faint">
                  <Link2 size={12} aria-hidden="true" />
                  Connected to · {ERA_META[target.era].label}
                </p>
                <h2 className="mt-1.5 flex items-center gap-2 text-lg font-bold text-text" data-testid="connection-target-title">
                  {TargetIcon && (
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${meta?.color}1a`, color: meta?.color }}
                      aria-hidden="true"
                    >
                      <TargetIcon size={15} />
                    </span>
                  )}
                  <span className="truncate">{target.title}</span>
                </h2>
                <p className="mt-1 text-xs text-text-muted">
                  {meta?.label} · {formatDateTime(target.timestamp)}
                  {target.location ? ` · ${target.location}` : ''}
                </p>
              </div>
              <button
                type="button"
                onClick={() => selectReceipt(null)}
                data-testid="connection-close"
                aria-label="Close connections panel"
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border text-text-muted transition-colors hover:bg-surface-2 hover:text-text active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-5">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.16em] text-text-faint">
                {connections && connections.length > 0
                  ? `${connections.length} related receipt${connections.length === 1 ? '' : 's'}`
                  : 'No related receipts'}
              </h3>
              <ul className="mt-3 space-y-2">
                {(connections ?? []).map(({ receipt, score, reason }) => {
                  const rMeta = TYPE_META[receipt.type];
                  const RIcon = TYPE_ICONS[receipt.type];
                  const filled = Math.max(1, Math.min(3, Math.round(score * 3)));
                  return (
                    <li key={receipt.id}>
                      <motion.button
                        type="button"
                        data-testid="connection-item"
                        onClick={() => selectReceipt(receipt.id)}
                        whileTap={{ scale: 0.98 }}
                        className="flex w-full items-start gap-3 rounded-xl border border-border bg-surface-2/40 p-3.5 text-left transition-colors hover:bg-surface-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      >
                        <span
                          className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                          style={{ backgroundColor: `${rMeta.color}1a`, color: rMeta.color }}
                          aria-hidden="true"
                        >
                          <RIcon size={16} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold text-text">{receipt.title}</span>
                          <span className="mt-1.5 flex flex-wrap items-center gap-1.5">
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
                              {reasonBadge(target, receipt)}
                            </span>
                            <span className="text-[11px] font-medium text-text-faint">{formatDateTime(receipt.timestamp)}</span>
                          </span>
                          <span className="mt-1.5 block text-xs leading-snug text-text-muted">{reason}</span>
                        </span>
                        <span className="mt-1 flex shrink-0 flex-col items-end gap-1" aria-label={`Connection strength ${filled} of 3`}>
                          <span className="flex gap-1" aria-hidden="true">
                            {[1, 2, 3].map((dot) => (
                              <span
                                key={dot}
                                className={`h-1.5 w-1.5 rounded-full ${dot <= filled ? 'bg-primary' : 'bg-border'}`}
                              />
                            ))}
                          </span>
                          <span className="text-[10px] font-bold tabular-nums text-text-faint">{score.toFixed(2)}</span>
                        </span>
                      </motion.button>
                    </li>
                  );
                })}
              </ul>
              {connections !== null && connections.length === 0 && (
                <p className="mt-2 text-sm text-text-muted">
                  Nothing else in the archive shares a day, a place, or an hour with this one.
                </p>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
