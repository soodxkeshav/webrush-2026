import { MONTHS_SHORT } from '../constants';

const inr = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });
const inrPrecise = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 });

/** Formats a number as Indian-rupee text: 8552.65 → "₹8,552.65". */
export function formatAmount(amount: number, precise = false): string {
  return `₹${(precise ? inrPrecise : inr).format(amount)}`;
}

/** Compact amount for tight UI: 1250000 → "₹12.5L". */
export function formatAmountCompact(amount: number): string {
  if (amount >= 1e7) return `₹${(amount / 1e7).toFixed(1)}Cr`;
  if (amount >= 1e5) return `₹${(amount / 1e5).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  return formatAmount(amount);
}

/** "15 Dec 2024". */
export function formatDate(ts: number): string {
  const d = new Date(ts);
  return `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`;
}

/** "23:06". */
export function formatTime(ts: number): string {
  const d = new Date(ts);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

/** "15 Dec 2024, 23:06". */
export function formatDateTime(ts: number): string {
  return `${formatDate(ts)}, ${formatTime(ts)}`;
}

/** Listening duration: 189300 → "3m 9s". */
export function formatDuration(ms: number): string {
  const totalSec = Math.round(ms / 1000);
  if (totalSec < 60) return `${totalSec}s`;
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return s ? `${m}m ${s}s` : `${m}m`;
}

/** "2015-01" → "Jan 2015". */
export function monthLabel(monthKey: string): string {
  const [y, m] = monthKey.split('-');
  return `${MONTHS_SHORT[Number(m) - 1]} ${y}`;
}

/** Hour 23 → "11 PM". */
export function hourLabel(hour: number): string {
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${h12} ${suffix}`;
}

/** Percent helper with one decimal, used in pattern descriptions. */
export function percent(part: number, whole: number): string {
  if (!whole) return '0%';
  return `${Math.round((part / whole) * 1000) / 10}%`;
}
