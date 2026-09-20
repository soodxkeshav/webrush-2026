import { isLateNightHour } from '../constants';
import type { MusicReceipt, PurchaseReceipt, Receipt, TransactionReceipt } from '../types/receipt';
import { parseHouseholdDate, parseIndiaDate, parseSpotifyDate } from './parseDates';

/** A raw PapaParse row: header-name to cell value. */
export type RawRow = Record<string, string | undefined>;

export interface NormalizeResult {
  receipts: Receipt[];
  skipped: number;
}

const truthy = (v: string | undefined): boolean => (v ?? '').trim().toUpperCase() === 'TRUE';
const num = (v: string | undefined): number => {
  const n = parseFloat((v ?? '').trim());
  return Number.isFinite(n) ? n : NaN;
};
const clean = (v: string | undefined): string => (v ?? '').trim();

/** Humanizes snake_case categories: "food_dining" → "Food dining". */
export function humanizeCategory(raw: string): string {
  const s = raw.replace(/_/g, ' ').trim();
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
}

/** Strips the synthetic "fraud_" prefix merchants carry in the India dataset. */
export function cleanMerchant(raw: string): string {
  return raw.replace(/^fraud_/i, '').trim();
}

/** Extracts the first "Place X" style location from a household note. */
export function extractPlace(note: string): string | undefined {
  const m = /place\s*\S+/i.exec(note);
  return m ? m[0].replace(/\s+/g, ' ') : undefined;
}

/** Maps spotify_history.csv rows to music receipts. Requires ts, track, artist. */
export function normalizeSpotifyRows(rows: RawRow[]): NormalizeResult {
  const receipts: Receipt[] = [];
  let skipped = 0;
  rows.forEach((row, i) => {
    const ts = parseSpotifyDate(clean(row.ts));
    const track = clean(row.track_name);
    const artist = clean(row.artist_name);
    if (ts === null || !track || !artist) {
      skipped += 1;
      return;
    }
    const msPlayed = num(row.ms_played);
    const hour = new Date(ts).getHours();
    const receipt: MusicReceipt = {
      id: `sp-${i}`,
      type: 'music',
      timestamp: ts,
      rawDate: clean(row.ts),
      era: 'night',
      title: track,
      subtitle: artist,
      trackName: track,
      artistName: artist,
      albumName: clean(row.album_name),
      msPlayed: Number.isNaN(msPlayed) ? 0 : msPlayed,
      skipped: truthy(row.skipped),
      shuffle: truthy(row.shuffle),
      platform: clean(row.platform) || 'unknown',
      hour,
      isLateNight: isLateNightHour(hour),
    };
    receipts.push(receipt);
  });
  return { receipts, skipped };
}

/** Maps household.csv rows to purchase receipts. Requires date, amount. */
export function normalizeHouseholdRows(rows: RawRow[]): NormalizeResult {
  const receipts: Receipt[] = [];
  let skipped = 0;
  rows.forEach((row, i) => {
    const rawDate = clean(row.Date);
    const ts = parseHouseholdDate(rawDate);
    const amount = num(row.Amount);
    if (ts === null || Number.isNaN(amount)) {
      skipped += 1;
      return;
    }
    const note = clean(row.Note);
    const category = clean(row.Category) || 'Other';
    const subcategory = clean(row.Subcategory);
    const mode = clean(row.Mode) || 'Unknown';
    const isIncome = clean(row['Income/Expense']).toUpperCase() === 'INCOME';
    const receipt: PurchaseReceipt = {
      id: `hh-${i}`,
      type: 'purchase',
      timestamp: ts,
      rawDate,
      era: 'quiet',
      title: isIncome ? `Income — ${note || category}` : note || category,
      subtitle: [subcategory, mode].filter(Boolean).join(' • '),
      location: extractPlace(note),
      category,
      subcategory,
      mode,
      amount,
      currency: clean(row.Currency) || 'INR',
      note,
    };
    receipts.push(receipt);
  });
  return { receipts, skipped };
}

/** Maps india.csv rows to transaction receipts. Requires date, merchant, amount. */
export function normalizeIndiaRows(rows: RawRow[]): NormalizeResult {
  const receipts: Receipt[] = [];
  let skipped = 0;
  rows.forEach((row, i) => {
    const rawDate = clean(row.trans_date_trans_time);
    const ts = parseIndiaDate(rawDate);
    const merchant = cleanMerchant(clean(row.merchant));
    const amount = num(row.amt);
    if (ts === null || !merchant || Number.isNaN(amount)) {
      skipped += 1;
      return;
    }
    const city = clean(row.city);
    const state = clean(row.state);
    const category = humanizeCategory(clean(row.category));
    const lat = num(row.lat);
    const lng = num(row.long);
    const receipt: TransactionReceipt = {
      id: `in-${i}`,
      type: 'transaction',
      timestamp: ts,
      rawDate,
      era: 'wanderer',
      title: merchant,
      subtitle: category || undefined,
      location: [city, state].filter(Boolean).join(', ') || undefined,
      city: city || undefined,
      state: state || undefined,
      merchant,
      category,
      amount,
      job: clean(row.job) || undefined,
      isFraud: clean(row.is_fraud).startsWith('1'),
      lat: Number.isNaN(lat) ? undefined : lat,
      lng: Number.isNaN(lng) ? undefined : lng,
    };
    receipts.push(receipt);
  });
  return { receipts, skipped };
}
