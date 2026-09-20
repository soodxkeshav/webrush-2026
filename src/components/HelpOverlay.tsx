import { X } from 'lucide-react';

interface HelpOverlayProps {
  onClose: () => void;
}

export function HelpOverlay({ onClose }: HelpOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4" role="presentation" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-title"
        data-testid="help-overlay"
        className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 id="shortcuts-title" className="text-lg font-bold text-text">Keyboard shortcuts</h2>
          <button type="button" onClick={onClose} aria-label="Close shortcuts" className="rounded-lg p-2 text-text-muted hover:bg-surface-2">
            <X size={18} />
            <span className="sr-only">Close</span>
          </button>
        </div>
        <dl className="mt-5 space-y-3 text-sm">
          {[['j / ↓', 'Next chapter'], ['k / ↑', 'Previous chapter'], ['/', 'Focus search'], ['s', 'Surprise me'], ['Esc', 'Close panel / clear search'], ['?', 'Toggle this help']].map(([key, label]) => (
            <div key={key} className="flex items-center justify-between border-b border-border pb-2">
              <dt className="font-semibold text-text">{label}</dt>
              <dd className="rounded bg-surface-2 px-2 py-1 font-mono text-xs text-text-muted">{key}</dd>
            </div>
          ))}
        </dl>
        <button type="button" data-testid="help-close" onClick={onClose} className="mt-6 min-h-[44px] w-full rounded-lg border border-border font-semibold text-text hover:bg-surface-2">
          Close
        </button>
      </div>
    </div>
  );
}
