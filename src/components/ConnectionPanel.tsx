import { AnimatePresence, motion } from 'framer-motion';
import { Link2, X } from 'lucide-react';
import { useEffect } from 'react';
import { ERA_META, TYPE_META } from '../constants';
import { useAppStore } from '../store/useAppStore';
import { useConnections } from '../hooks/useConnections';
import { formatDateTime } from '../utils/format';

/** Slide-in panel of related receipts with human-readable reasons (PRD §5.3). */
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
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
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
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-border bg-surface shadow-lg"
          >
            <header className="flex items-start justify-between gap-3 border-b border-border p-5">
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-text-faint">
                  <Link2 size={12} aria-hidden="true" />
                  Connections · {ERA_META[target.era].label}
                </p>
                <h2 className="mt-1 truncate text-lg font-bold text-text" data-testid="connection-target-title">
                  {target.title}
                </h2>
                <p className="text-xs text-text-muted">
                  {meta?.label} · {formatDateTime(target.timestamp)}
                  {target.location ? ` · ${target.location}` : ''}
                </p>
              </div>
              <button
                type="button"
                onClick={() => selectReceipt(null)}
                data-testid="connection-close"
                className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-text-muted transition-colors hover:bg-surface-2 hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <X size={13} aria-hidden="true" />
                Close
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-5">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-text-faint">
                {connections && connections.length > 0
                  ? `${connections.length} related receipt${connections.length === 1 ? '' : 's'}`
                  : 'No related receipts'}
              </h3>
              <ul className="mt-3 space-y-2">
                {(connections ?? []).map(({ receipt, score, reason }) => {
                  const rMeta = TYPE_META[receipt.type];
                  return (
                    <li key={receipt.id}>
                      <button
                        type="button"
                        data-testid="connection-item"
                        onClick={() => selectReceipt(receipt.id)}
                        className="w-full rounded-xl border border-border bg-surface-2/50 p-3.5 text-left transition-colors hover:bg-surface-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      >
                        <span className="flex items-center justify-between gap-2">
                          <span className="truncate text-sm font-semibold text-text">{receipt.title}</span>
                          <span className="shrink-0 text-[11px] font-bold tabular-nums text-primary">
                            {score.toFixed(2)}
                          </span>
                        </span>
                        <span className="mt-1 block text-[11px] font-medium uppercase tracking-wide text-text-faint">
                          {rMeta.label} · {formatDateTime(receipt.timestamp)}
                        </span>
                        <span className="mt-2 block h-1 w-full overflow-hidden rounded-full bg-border">
                          <span className="block h-full rounded-full bg-primary" style={{ width: `${Math.min(100, score * 100)}%` }} />
                        </span>
                        <span className="mt-2 block text-xs leading-snug text-text-muted">{reason}</span>
                      </button>
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
