import { AlertTriangle, ArrowLeftRight, CalendarDays, CalendarRange, Clock, Flame, Hourglass, Layers, MapPin, Moon, Music2, Sparkles, Wallet } from 'lucide-react';
import type { Pattern, PatternIcon } from '../types/receipt';

const ICONS: Record<PatternIcon, typeof Sparkles> = {
  weekday: CalendarDays,
  clock: Clock,
  artists: Music2,
  wallet: Wallet,
  map: MapPin,
  moon: Moon,
  flame: Flame,
  alert: AlertTriangle,
  hourglass: Hourglass,
  layers: Layers,
  busiest: CalendarRange,
  ratio: ArrowLeftRight,
};

/** One pattern insight (design.md §8): icon tile, value, description, optional bar. */
export function PatternCard({ pattern }: { pattern: Pattern }) {
  const Icon = ICONS[pattern.icon];
  return (
    <article data-testid="pattern-card" className="rounded-xl border border-border bg-surface p-4">
      <div className="flex items-center gap-2.5">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${pattern.accent}1a`, color: pattern.accent }}
          aria-hidden="true"
        >
          <Icon size={17} />
        </span>
        <h3 className="text-xs font-bold uppercase tracking-wide text-text-muted" data-testid="pattern-title">
          {pattern.title}
        </h3>
      </div>
      <p className="mt-2.5 truncate text-xl font-extrabold tracking-tight tabular-nums text-text" data-testid="pattern-value">
        {pattern.value}
      </p>
      {pattern.ratio !== undefined && (
        <span className="mt-2 block h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
          <span className="block h-full rounded-full" style={{ width: `${Math.round(pattern.ratio * 100)}%`, backgroundColor: pattern.accent }} />
        </span>
      )}
      <p className="mt-2 text-xs leading-snug text-text-muted">{pattern.description}</p>
    </article>
  );
}
