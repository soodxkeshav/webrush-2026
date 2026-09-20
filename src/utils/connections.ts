import { CONNECTION_THRESHOLD, MAX_CONNECTIONS } from '../constants';
import type { Connection, Receipt } from '../types/receipt';
import { formatAmount } from './format';

const DAY_MS = 86_400_000;

const dayKey = (ts: number): number => Math.floor(ts / DAY_MS);

/** True when both receipts carry a non-empty equal city or state. */
function samePlace(a: Receipt, b: Receipt): boolean {
  if (a.city && b.city && a.city.toLowerCase() === b.city.toLowerCase()) return true;
  if (a.state && b.state && a.state.toLowerCase() === b.state.toLowerCase()) return true;
  return false;
}

/** Music-hour proximity only counts when both receipts are music. */
function hourDistance(hourA: number, hourB: number): number {
  const diff = Math.abs(hourA - hourB);
  return Math.min(diff, 24 - diff);
}

function musicHourWithin(a: Receipt, b: Receipt, tolerance: number): boolean {
  if (a.type !== 'music' || b.type !== 'music') return false;
  return hourDistance(a.hour, b.hour) <= tolerance;
}

/** Cross-type pairs that tell a story together (music before a purchase, etc.). */
function complementaryTypes(a: Receipt, b: Receipt): boolean {
  return a.type !== b.type;
}

function categoryOf(r: Receipt): string {
  return r.type === 'music' ? '' : r.category;
}

/** Weighted similarity score per PRD §5.3 / architecture.md §8. */
export function score(a: Receipt, b: Receipt): number {
  let s = 0;
  if (dayKey(a.timestamp) === dayKey(b.timestamp)) s += 0.5;
  if (samePlace(a, b)) s += 0.3;
  if (musicHourWithin(a, b, 1)) s += 0.15;
  if (complementaryTypes(a, b)) s += 0.1;
  if (categoryOf(a) !== '' && categoryOf(a) === categoryOf(b)) s += 0.1;
  return s;
}

/** Builds the human-readable reason for the highest contributing signal. */
function reasonFor(a: Receipt, b: Receipt, s: number): string {
  if (dayKey(a.timestamp) === dayKey(b.timestamp)) return 'Happened on the very same day.';
  if (samePlace(a, b)) {
    const place = (a.city && b.city && a.city.toLowerCase() === b.city.toLowerCase() ? a.city : a.state) ?? 'the same place';
    return `Both trace back to ${place}.`;
  }
  if (a.type === 'music' && b.type === 'music' && hourDistance(a.hour, b.hour) <= 1) {
    return `Played within an hour of ${b.hour}:00 — the same window of the night.`;
  }
  if (complementaryTypes(a, b)) return `A ${a.type} that shares the day's rhythm with this ${b.type}.`;
  if (categoryOf(a) !== '' && categoryOf(a) === categoryOf(b)) {
    const amountText = b.type !== 'music' ? ` — worth about ${formatAmount(b.amount)} here.` : '';
    return `Both filed under ${categoryOf(a)}${amountText}`;
  }
  return `Weak link (score ${s.toFixed(2)}).`;
}

/**
 * Finds up to MAX_CONNECTIONS receipts scoring above CONNECTION_THRESHOLD,
 * sorted by score then proximity in time. Runs on click, never on render.
 */
export function findConnections(target: Receipt, all: Receipt[]): Connection[] {
  const results: Connection[] = [];
  for (const candidate of all) {
    if (candidate.id === target.id) continue;
    const s = score(target, candidate);
    if (s < CONNECTION_THRESHOLD) continue;
    results.push({ receipt: candidate, score: s, reason: reasonFor(target, candidate, s) });
  }
  results.sort((x, y) => y.score - x.score || Math.abs(x.receipt.timestamp - target.timestamp) - Math.abs(y.receipt.timestamp - target.timestamp));
  return results.slice(0, MAX_CONNECTIONS);
}
