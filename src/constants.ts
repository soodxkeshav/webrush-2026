import type { Era, ReceiptType } from './types/receipt';

/** localStorage key for theme persistence (PRD §5.6). */
export const STORAGE_KEY = 'lifeReceipts.theme.v1';

/** Connections below this score are not shown (PRD §5.3). */
export const CONNECTION_THRESHOLD = 0.35;

/** Maximum related receipts returned per click (PRD §5.3). */
export const MAX_CONNECTIONS = 6;

/** Minimum receipts for a month bucket to survive as a chapter (PRD §5.2). */
export const MIN_CHAPTER_RECEIPTS = 5;

/** Chapters are merged downward to at most this many per era (real data spans 2015–2018 monthly). */
export const MAX_CHAPTERS_PER_ERA = 5;

/** Hour >= 23 or < 5 counts as late-night listening. */
export const isLateNightHour = (hour: number): boolean => hour >= 23 || hour < 5;

export interface EraMeta {
  label: string;
  color: string;
  years: string;
  blurb: string;
}

export const ERA_META: Record<Era, EraMeta> = {
  quiet: {
    label: 'The Quiet Years',
    color: '#14b8a6',
    years: '2015 – 2018',
    blurb: 'Homebound. Trains, idli, chai, festivals, subscription creep.',
  },
  wanderer: {
    label: 'The Wanderer',
    color: '#fb7185',
    years: '2022 – 2023',
    blurb: 'Mobile. Entertainment, credit cards, cities across India.',
  },
  night: {
    label: 'The Night Sessions',
    color: '#6366f1',
    years: '2024',
    blurb: 'Introspective. Late-night Android listening, skips, Beach Boys.',
  },
};

export interface TypeMeta {
  label: string;
  color: string;
}

export const TYPE_META: Record<ReceiptType, TypeMeta> = {
  music: { label: 'Music', color: '#8b5cf6' },
  purchase: { label: 'Purchase', color: '#f59e0b' },
  transaction: { label: 'Transaction', color: '#3b82f6' },
};

export const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Relative fetch paths — keep them relative so GitHub Pages project sites resolve them. */
export const DATA_FILES = {
  spotify: 'data/spotify.csv',
  household: 'data/household.csv',
  india: 'data/india.csv',
} as const;
