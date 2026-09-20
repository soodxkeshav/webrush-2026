import Papa from 'papaparse';
import { useCallback, useEffect, useRef, useState } from 'react';
import { DATA_FILES } from '../constants';
import { useAppStore } from '../store/useAppStore';
import type { Receipt } from '../types/receipt';
import {
  normalizeHouseholdRows,
  normalizeIndiaRows,
  normalizeSpotifyRows,
  type NormalizeResult,
  type RawRow,
} from '../utils/normalize';

/** Fetches one CSV (relative path) and parses it with PapaParse; throws on HTTP or parse failure. */
async function fetchAndParse(url: string): Promise<RawRow[]> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`);
  const text = await res.text();
  // Normalize BOM + CRLF: PapaParse 5.x misparses CRLF-only sources into a single record.
  const cleanText = text.replace(/^\ufeff/, '').replace(/\r\n/g, '\n');
  const parsed = Papa.parse<RawRow>(cleanText, { header: true, skipEmptyLines: 'greedy' });
  if (parsed.errors.length > 0) {
    console.warn(`[data] ${url}: ${parsed.errors.length} parse-level issue(s)`);
  }
  return parsed.data;
}

/**
 * Loads all three datasets once, merges them into a chronological Receipt[]
 * in the store, and reports skipped rows via console.warn (PRD §5.1).
 * Exposes a reload callback for the error state's retry button.
 */
export function useReceipts(): { reload: () => void } {
  const setReceipts = useAppStore((s) => s.setReceipts);
  const setLoading = useAppStore((s) => s.setLoading);
  const setError = useAppStore((s) => s.setError);
  const [attempt, setAttempt] = useState(0);
  const cancelled = useRef(false);

  useEffect(() => {
    cancelled.current = false;
    setLoading(true);
    setError(null);

    const run = async (): Promise<void> => {
      try {
        const [spotify, household, india] = await Promise.all([
          fetchAndParse(DATA_FILES.spotify),
          fetchAndParse(DATA_FILES.household),
          fetchAndParse(DATA_FILES.india),
        ]);
        const results: NormalizeResult[] = [
          normalizeSpotifyRows(spotify),
          normalizeHouseholdRows(household),
          normalizeIndiaRows(india),
        ];
        const totalSkipped = results.reduce((acc, r) => acc + r.skipped, 0);
        const all: Receipt[] = results.flatMap((r) => r.receipts).sort((a, b) => a.timestamp - b.timestamp);
        if (cancelled.current) return;
        console.warn(`[data] loaded ${all.length} receipts, skipped ${totalSkipped} invalid rows`);
        setReceipts(all, totalSkipped);
        setLoading(false);
      } catch (err) {
        if (cancelled.current) return;
        console.warn(`[data] load failed: ${String(err)}`);
        setError(err instanceof Error ? err.message : 'Unknown data error');
        setLoading(false);
      }
    };
    void run();

    return () => {
      cancelled.current = true;
    };
  }, [attempt, setReceipts, setLoading, setError]);

  const reload = useCallback(() => setAttempt((a) => a + 1), []);
  return { reload };
}
