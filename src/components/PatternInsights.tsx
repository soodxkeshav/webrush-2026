import { Sparkles } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { PatternCard } from './PatternCard';

/** Patterns panel: ten auto-computed insights, computed once on load (PRD §5.4). */
export function PatternInsights() {
  const patterns = useAppStore((s) => s.patterns);

  return (
    <section data-testid="pattern-insights" aria-label="Pattern insights">
      <h2 className="mb-3 flex items-center gap-1.5 px-1 text-[11px] font-bold uppercase tracking-[0.14em] text-text-faint">
        <Sparkles size={12} aria-hidden="true" />
        Patterns
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-1">
        {patterns.map((pattern) => (
          <PatternCard key={pattern.id} pattern={pattern} />
        ))}
      </div>
    </section>
  );
}
