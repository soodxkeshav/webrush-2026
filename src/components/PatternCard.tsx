import { motion } from 'framer-motion';
import { AlertTriangle, ArrowLeftRight, CalendarDays, CalendarRange, Clock, Flame, Hourglass, Layers, MapPin, Moon, Music2, Sparkles, Wallet } from 'lucide-react';
import type { Pattern, PatternIcon } from '../types/receipt';
import { useEffect, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';

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

/** One analytics widget: 36px icon tile, bold value, muted description, optional ratio bar. */
export function PatternCard({ pattern }: { pattern: Pattern }) {
  const Icon = ICONS[pattern.icon];
  const ref = useRef<HTMLElement>(null);
  const markPatternViewed = useAppStore((s) => s.markPatternViewed);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) markPatternViewed(pattern.id);
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [markPatternViewed, pattern.id]);
  return (
    <motion.article
      ref={ref}
      data-testid="pattern-card"
      whileHover={{ y: -2 }}
      className="rounded-xl border border-border bg-surface p-4 transition-shadow hover:elevate-2"
    >
      <div className="flex items-center gap-2.5">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${pattern.accent}1a`, color: pattern.accent }}
          aria-hidden="true"
        >
          <Icon size={16} />
        </span>
        <h3 className="text-sm font-bold text-text-muted" data-testid="pattern-title">
          {pattern.title}
        </h3>
      </div>
      <p className="mt-2.5 truncate text-[20px] font-extrabold leading-tight tracking-tight tabular-nums text-text" data-testid="pattern-value">
        {pattern.value}
      </p>
      <p className="mt-1 text-xs leading-snug text-text-muted">{pattern.description}</p>
      {pattern.ratio !== undefined && (
        <span className="mt-3 block h-1.5 w-full overflow-hidden rounded-full bg-surface-2" aria-hidden="true">
          <span
            className="block h-full rounded-full transition-[width] duration-500"
            style={{ width: `${Math.round(pattern.ratio * 100)}%`, backgroundColor: pattern.accent }}
          />
        </span>
      )}
    </motion.article>
  );
}
