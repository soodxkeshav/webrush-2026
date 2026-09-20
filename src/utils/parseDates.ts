/**
 * Date parsing for the three source formats (architecture.md §6).
 * All parsers construct dates in local time so the displayed hour matches
 * the raw string, and validate the components to reject impossible dates
 * (e.g. Feb 30) rather than letting Date silently roll them over.
 */

const SECONDS_IN_DAY = 86_400_000;

/** Parses Spotify's "YYYY-MM-DD HH:MM:SS" (seconds optional). */
export function parseSpotifyDate(raw: string): number | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2}))?$/.exec(raw.trim());
  if (!m) return null;
  const [, y, mo, d, h, mi, s] = m;
  return buildLocal(+y, +mo, +d, +h, +mi, s ? +s : 0);
}

/** Parses Household's "DD/MM/YYYY [HH:MM:SS]". */
export function parseHouseholdDate(raw: string): number | null {
  const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/.exec(raw.trim());
  if (!m) return null;
  const [, d, mo, y, h, mi, s] = m;
  return buildLocal(+y, +mo, +d, h ? +h : 0, mi ? +mi : 0, s ? +s : 0);
}

/** Parses India Transact's "M/D/YYYY H:MM" (US order, seconds absent). */
export function parseIndiaDate(raw: string): number | null {
  const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/.exec(raw.trim());
  if (!m) return null;
  const [, mo, d, y, h, mi, s] = m;
  return buildLocal(+y, +mo, +d, h ? +h : 0, mi ? +mi : 0, s ? +s : 0);
}

/** Builds a local timestamp only if every component round-trips (catches Feb 29+). */
function buildLocal(year: number, month: number, day: number, hour: number, minute: number, second: number): number | null {
  if (month < 1 || month > 12 || day < 1 || day > 31 || hour > 23 || minute > 59 || second > 59) return null;
  const date = new Date(year, month - 1, day, hour, minute, second);
  const ok =
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day &&
    date.getHours() === hour &&
    date.getMinutes() === minute &&
    date.getSeconds() === second;
  if (!ok || Math.abs(date.getTime()) > 8.64e15) return null;
  return date.getTime();
}

/** Local-time YYYY-MM key used for chapter bucketing. */
export function monthKeyOf(ts: number): string {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

/** Local-time date key used for day-level scoring and streaks. */
export function dayKeyOf(ts: number): string {
  return String(Math.floor(ts / SECONDS_IN_DAY));
}
