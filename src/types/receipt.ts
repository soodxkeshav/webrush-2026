/** The three kinds of receipts merged from the three source datasets. */
export type ReceiptType = 'music' | 'purchase' | 'transaction';

/** The three narrative eras of the fictional life. */
export type Era = 'quiet' | 'wanderer' | 'night';

interface BaseReceipt {
  id: string;
  type: ReceiptType;
  /** Unix milliseconds (local-time interpretation of the raw date). */
  timestamp: number;
  /** Untouched date string from the source CSV. */
  rawDate: string;
  era: Era;
  title: string;
  subtitle?: string;
  location?: string;
  city?: string;
  state?: string;
  lat?: number;
  lng?: number;
}

export interface MusicReceipt extends BaseReceipt {
  type: 'music';
  trackName: string;
  artistName: string;
  albumName: string;
  msPlayed: number;
  skipped: boolean;
  shuffle: boolean;
  platform: string;
  /** Local hour 0–23, used for late-night analysis. */
  hour: number;
  isLateNight: boolean;
}

export interface PurchaseReceipt extends BaseReceipt {
  type: 'purchase';
  category: string;
  subcategory: string;
  mode: string;
  amount: number;
  currency: string;
  note: string;
}

export interface TransactionReceipt extends BaseReceipt {
  type: 'transaction';
  merchant: string;
  category: string;
  amount: number;
  job?: string;
  isFraud: boolean;
}

export type Receipt = MusicReceipt | PurchaseReceipt | TransactionReceipt;

/** A narrative chapter: one contiguous bucket of receipts with a generated title. */
export interface Chapter {
  id: string;
  title: string;
  /** Month/year range label, e.g. "Jan 2015 – Mar 2015". */
  subtitle: string;
  /** One auto-generated line about the strongest signal in the bucket. */
  insight: string;
  era: Era;
  startTs: number;
  endTs: number;
  receiptCount: number;
}

/** An icon key resolvable to a Lucide component by the UI layer. */
export type PatternIcon =
  | 'weekday'
  | 'clock'
  | 'artists'
  | 'wallet'
  | 'map'
  | 'moon'
  | 'flame'
  | 'alert'
  | 'hourglass'
  | 'layers'
  | 'busiest'
  | 'ratio';

/** One auto-computed insight for the Patterns panel. */
export interface Pattern {
  id: string;
  icon: PatternIcon;
  title: string;
  /** Formatted headline value, e.g. "₹12,480" or "11 PM". */
  value: string;
  description: string;
  accent: string;
  /** Optional 0–1 ratio rendered as a bar. */
  ratio?: number;
}

/** A scored, reasoned link between two receipts. */
export interface Connection {
  receipt: Receipt;
  score: number;
  reason: string;
}
