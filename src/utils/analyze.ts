import { ERA_META, MAX_CHAPTERS_PER_ERA } from '../constants';
import type { Chapter, Era, Pattern, Receipt } from '../types/receipt';
import { formatAmount, formatAmountCompact, hourLabel, monthLabel, percent } from './format';
import { monthKeyOf } from './parseDates';

interface Bucket {
  era: Era;
  key: string;
  receipts: Receipt[];
}

const SEASON_BY_MONTH = ['Winter', 'Winter', 'Summer', 'Summer', 'Summer', 'Monsoon', 'Monsoon', 'Monsoon', 'Autumn', 'Autumn', 'Winter', 'Winter'];

interface BucketFacts {
  counts: { music: number; purchase: number; transaction: number };
  topCategory: string;
  skipRate: number;
  lateRatio: number;
  peakHour: number;
  spent: number;
  distinctCities: number;
  topCity: string;
  fraud: number;
}

/** Buckets receipts by local YYYY-MM and drops buckets below the chapter threshold. */
function bucketByMonth(receipts: Receipt[]): Bucket[] {
  const map = new Map<string, Bucket>();
  for (const r of receipts) {
    const key = monthKeyOf(r.timestamp);
    const bucket = map.get(key);
    if (bucket) bucket.receipts.push(r);
    else map.set(key, { era: r.era, key, receipts: [r] });
  }
  return [...map.values()].sort((a, b) => a.key.localeCompare(b.key));
}

/** Merges every bucket below the threshold into its chronological neighbor. */
function mergeSmallBuckets(buckets: Bucket[], min: number): Bucket[] {
  const out: Bucket[] = [];
  for (const bucket of buckets) {
    const prev = out[out.length - 1];
    if (bucket.receipts.length < min && prev && prev.era === bucket.era) {
      prev.receipts.push(...bucket.receipts);
      prev.key = `${prev.key}+${bucket.key.split('-').pop()}`;
    } else {
      out.push({ era: bucket.era, key: bucket.key, receipts: [...bucket.receipts] });
    }
  }
  return out;
}

/** Collapses an era's buckets to at most `max` chapters by merging sparse neighbors. */
function collapseToMax(buckets: Bucket[], max: number): Bucket[] {
  let current = buckets;
  while (current.length > max) {
    let smallestIdx = 0;
    for (let i = 1; i < current.length; i++) {
      if (current[i].receipts.length < current[smallestIdx].receipts.length) smallestIdx = i;
    }
    // Merge the smallest bucket into its smaller neighbor to keep sizes balanced.
    const target = smallestIdx === 0 ? 1 : smallestIdx === current.length - 1 ? smallestIdx - 1 :
      current[smallestIdx - 1].receipts.length <= current[smallestIdx + 1].receipts.length ? smallestIdx - 1 : smallestIdx + 1;
    const [merged] = current.splice(smallestIdx, 1);
    const lo = Math.min(smallestIdx, target);
    current[lo] = {
      era: merged.era,
      key: lo < smallestIdx ? `${current[lo].key}+${merged.key.split('-').pop()}` : `${merged.key.split('-').pop()}+${current[lo].key}`,
      receipts: lo < smallestIdx ? [...current[lo].receipts, ...merged.receipts] : [...merged.receipts, ...current[lo].receipts],
    };
  }
  return current;
}

/** Computes the signals a title/insight is generated from. */
function bucketFacts(bucket: Bucket): BucketFacts {
  const rs = bucket.receipts;
  const counts = { music: 0, purchase: 0, transaction: 0 };
  const categoryTotals = new Map<string, number>();
  const cityCount = new Map<string, number>();
  const hourCount = new Map<number, number>();
  let skipped = 0;
  let late = 0;
  let spent = 0;
  let fraud = 0;
  for (const r of rs) {
    counts[r.type] += 1;
    if (r.type === 'music') {
      if (r.skipped) skipped += 1;
      if (r.isLateNight) late += 1;
      hourCount.set(r.hour, (hourCount.get(r.hour) ?? 0) + 1);
    } else {
      categoryTotals.set(r.category, (categoryTotals.get(r.category) ?? 0) + r.amount);
      spent += r.amount;
      if (r.type === 'transaction' && r.isFraud) fraud += 1;
    }
    if (r.city) cityCount.set(r.city, (cityCount.get(r.city) ?? 0) + 1);
  }
  const musicCount = counts.music;
  const topCategory = [...categoryTotals.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? '';
  const peakHour = [...hourCount.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? 0;
  const topCity = [...cityCount.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? '';
  return {
    counts,
    topCategory,
    skipRate: musicCount ? skipped / musicCount : 0,
    lateRatio: musicCount ? late / musicCount : 0,
    peakHour,
    spent,
    distinctCities: cityCount.size,
    topCity,
    fraud,
  };
}

/** Infers a chapter title from the bucket's dominant signal (architecture.md §7). */
function generateChapterTitle(era: Era, facts: BucketFacts, firstMonth: string, lastMonth: string): string {
  const season = SEASON_BY_MONTH[Number(firstMonth.split('-')[1]) - 1] ?? '';
  const year = firstMonth.split('-')[0];
  if (era === 'night' && facts.lateRatio > 0.3) return 'The Night Sessions';
  if (facts.skipRate > 0.4 && facts.counts.music > facts.counts.purchase + facts.counts.transaction) return 'The Restless Month';
  if (facts.topCategory.toLowerCase() === 'subscription') return 'The Streaming Season';
  if (facts.topCategory.toLowerCase() === 'festivals') return 'A Month of Rituals';
  if (facts.distinctCities >= 8) return 'The Restless Geography';
  if (facts.counts.transaction > facts.counts.purchase && facts.spent > 100_000) return 'The Big Spends';
  const prefix = firstMonth === lastMonth ? '' : 'The Long ';
  return `${prefix}${season} of ${year}`;
}

/** Generates the single strongest insight line for a chapter. */
function generateInsight(era: Era, facts: BucketFacts, count: number): string {
  if (era === 'night' && facts.lateRatio > 0.3) {
    return `${percent(facts.lateRatio * facts.counts.music, facts.counts.music)} of listening happened after midnight — sleep was negotiable.`;
  }
  if (facts.fraud > 0) return `${facts.fraud} flagged ${facts.fraud === 1 ? 'transaction' : 'transactions'} slipped into the record.`;
  if (facts.skipRate > 0.4) return `${percent(facts.skipRate * facts.counts.music, facts.counts.music)} of tracks were skipped — restless ears.`;
  if (facts.distinctCities >= 5) return `${facts.distinctCities} cities in one chapter, most often ${facts.topCity}.`;
  if (facts.topCategory.toLowerCase() === 'subscription') return `Subscriptions dominated: ${formatAmount(facts.spent)} across the chapter.`;
  if (facts.peakHour > 0 || era === 'night') return `Music peaked around ${hourLabel(facts.peakHour)}.`;
  if (facts.spent > 0) return `${formatAmount(facts.spent)} spent across ${count} receipts.`;
  return `${count} receipts from a quieter stretch of life.`;
}

/** Builds narrative chapters: month buckets → merged → titled (PRD §5.2). */
export function buildChapters(receipts: Receipt[]): Chapter[] {
  if (receipts.length === 0) return [];
  const eras: Era[] = ['quiet', 'wanderer', 'night'];
  const chapters: Chapter[] = [];
  for (const era of eras) {
    const eraReceipts = receipts.filter((r) => r.era === era);
    if (eraReceipts.length === 0) continue;
    let buckets = mergeSmallBuckets(bucketByMonth(eraReceipts), 5);
    buckets = collapseToMax(buckets, MAX_CHAPTERS_PER_ERA);
    for (const bucket of buckets) {
      const facts = bucketFacts(bucket);
      const ts = [...bucket.receipts].sort((a, b) => a.timestamp - b.timestamp);
      const first = ts[0];
      const last = ts[ts.length - 1];
      const startLabel = monthLabel(monthKeyOf(first.timestamp));
      const endLabel = monthLabel(monthKeyOf(last.timestamp));
      chapters.push({
        id: `ch-${era}-${bucket.key}`,
        title: generateChapterTitle(era, facts, monthKeyOf(first.timestamp), monthKeyOf(last.timestamp)),
        subtitle: startLabel === endLabel ? startLabel : `${startLabel} → ${endLabel}`,
        insight: generateInsight(era, facts, bucket.receipts.length),
        era,
        startTs: first.timestamp,
        endTs: last.timestamp,
        receiptCount: bucket.receipts.length,
      });
    }
  }
  return chapters;
}

/** Most common local weekday across all receipts. */
function mostActiveWeekday(receipts: Receipt[]): { label: string; count: number } | null {
  const counts = new Array(7).fill(0) as number[];
  for (const r of receipts) counts[new Date(r.timestamp).getDay()] += 1;
  const best = counts.indexOf(Math.max(...counts));
  return counts[best] > 0 ? { label: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][best], count: counts[best] } : null;
}

/** Top N artists by play count among music receipts. */
function topArtists(receipts: Receipt[], n: number): { name: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const r of receipts) if (r.type === 'music') counts.set(r.artistName, (counts.get(r.artistName) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, n).map(([name, count]) => ({ name, count }));
}

/** Longest run of consecutive calendar days with at least one receipt. */
function longestStreak(receipts: Receipt[]): number {
  const days = new Set(receipts.map((r) => Math.floor(r.timestamp / 86_400_000)));
  const sorted = [...days].sort((a, b) => a - b);
  let best = 0;
  let run = 0;
  let prev = Number.NaN;
  for (const d of sorted) {
    run = d === prev + 1 ? run + 1 : 1;
    prev = d;
    if (run > best) best = run;
  }
  return best;
}

/** Computes the ten cached patterns (PRD §5.4). */
export function discoverPatterns(receipts: Receipt[]): Pattern[] {
  const music = receipts.filter((r): r is Extract<Receipt, { type: 'music' }> => r.type === 'music');
  const purchases = receipts.filter((r): r is Extract<Receipt, { type: 'purchase' }> => r.type === 'purchase');
  const transactions = receipts.filter((r): r is Extract<Receipt, { type: 'transaction' }> => r.type === 'transaction');

  const weekday = mostActiveWeekday(receipts);
  const hourCounts = new Map<number, number>();
  for (const r of music) hourCounts.set(r.hour, (hourCounts.get(r.hour) ?? 0) + 1);
  const peakHour = [...hourCounts.entries()].sort((a, b) => b[1] - a[1])[0];
  const artists = topArtists(receipts, 3);
  const subscriptionSpend = [...purchases, ...transactions]
    .filter((r) => r.category.toLowerCase().includes('subscription') || r.category.toLowerCase().includes('entertainment'))
    .reduce((acc, r) => acc + r.amount, 0);
  const cityCount = new Map<string, number>();
  for (const r of transactions) if (r.city) cityCount.set(r.city, (cityCount.get(r.city) ?? 0) + 1);
  const topCity = [...cityCount.entries()].sort((a, b) => b[1] - a[1])[0];
  const lateNight = music.filter((r) => r.isLateNight).length;
  const streak = longestStreak(receipts);
  const fraudCount = transactions.filter((r) => r.isFraud).length;
  const span = receipts.length > 0
    ? Math.max(...receipts.map((r) => r.timestamp)) - Math.min(...receipts.map((r) => r.timestamp))
    : 0;
  const spanYears = (span / (365.25 * 86_400_000)).toFixed(1);
  const eraCount = (era: Era): number => receipts.filter((r) => r.era === era).length;

  const patterns: Pattern[] = [];
  const push = (candidate: Pattern | false | null): void => {
    if (candidate) patterns.push(candidate);
  };

  push(
    weekday && {
      id: 'weekday',
      icon: 'weekday' as const,
      title: 'Most active weekday',
      value: weekday.label,
      description: `${weekday.count} receipts fell on ${weekday.label}s across the whole life.`,
      accent: '#6366f1',
    },
  );
  push(
    peakHour && {
      id: 'peak-hour',
      icon: 'clock' as const,
      title: 'Peak listening hour',
      value: hourLabel(peakHour[0]),
      description: `${percent(peakHour[1], music.length)} of all tracks were played around ${hourLabel(peakHour[0])}.`,
      accent: '#8b5cf6',
    },
  );
  push(
    artists.length > 0 && {
      id: 'artists',
      icon: 'artists' as const,
      title: 'Top 3 artists',
      value: artists[0].name,
      description: `${artists.map((a) => `${a.name} (${a.count})`).join(' · ')}`,
      accent: '#8b5cf6',
    },
  );
  push({
    id: 'subscriptions',
    icon: 'wallet' as const,
    title: 'Subscription & entertainment spend',
    value: formatAmountCompact(subscriptionSpend),
    description: `Lifetime spend on subscriptions and entertainment across ${purchases.length + transactions.length} money receipts.`,
    accent: '#f59e0b',
  });
  push(
    topCity && {
      id: 'city',
      icon: 'map' as const,
      title: 'Most-visited city',
      value: topCity[0],
      description: `${topCity[1]} card transactions happened in ${topCity[0]} during the wandering years.`,
      accent: '#3b82f6',
    },
  );
  push(
    music.length > 0 && {
      id: 'late-night',
      icon: 'moon' as const,
      title: 'Late-night listening',
      value: percent(lateNight, music.length),
      description: `${lateNight} of ${music.length} tracks played between 11 PM and 5 AM.`,
      accent: '#6366f1',
      ratio: lateNight / music.length,
    },
  );
  push(
    streak > 1 && {
      id: 'streak',
      icon: 'flame' as const,
      title: 'Longest daily streak',
      value: `${streak} days`,
      description: 'The longest run of consecutive days with at least one recorded receipt.',
      accent: '#10b981',
    },
  );
  push(
    fraudCount > 0 && {
      id: 'fraud',
      icon: 'alert' as const,
      title: 'Flagged transactions',
      value: String(fraudCount),
      description: `${percent(fraudCount, transactions.length)} of card transactions were flagged as fraud in the data.`,
      accent: '#ef4444',
    },
  );
  push(
    receipts.length > 0 && {
      id: 'span',
      icon: 'hourglass' as const,
      title: 'Time span',
      value: `${spanYears} years`,
      description: 'From the first household entry to the last track played.',
      accent: '#6366f1',
    },
  );
  push({
    id: 'eras',
    icon: 'layers' as const,
    title: 'Receipts per era',
    value: `${eraCount('quiet')} · ${eraCount('wanderer')} · ${eraCount('night')}`,
    description: 'Quiet Years · Wanderer · Night Sessions — the shape of one life in three acts.',
    accent: '#14b8a6',
  });

  // Busiest single month across all eras.
  const monthCounts = new Map<string, number>();
  for (const r of receipts) {
    const key = monthKeyOf(r.timestamp);
    monthCounts.set(key, (monthCounts.get(key) ?? 0) + 1);
  }
  const busiest = [...monthCounts.entries()].sort((a, b) => b[1] - a[1])[0];
  push(
    busiest && {
      id: 'busiest-month',
      icon: 'busiest' as const,
      title: 'Busiest month',
      value: monthLabel(busiest[0]),
      description: `${busiest[1]} receipts in ${monthLabel(busiest[0])} — the loudest month on record.`,
      accent: '#fb7185',
    },
  );

  // Which era leaned hardest on music relative to money receipts?
  const eraStats = (['quiet', 'wanderer', 'night'] as Era[])
    .map((era) => {
      const plays = receipts.filter((r) => r.era === era && r.type === 'music').length;
      const money = receipts.filter((r) => r.era === era && r.type !== 'music').length;
      return { era, plays, money, ratio: money > 0 ? plays / money : Number.POSITIVE_INFINITY };
    })
    .sort((a, b) => b.ratio - a.ratio)[0];
  push(
    eraStats &&
      eraStats.plays > 0 && {
        id: 'music-ratio',
        icon: 'ratio' as const,
        title: 'Music-to-purchase ratio',
        value: ERA_META[eraStats.era].label,
        description:
          eraStats.money === 0
            ? `${eraStats.plays} plays against zero money receipts — in this era, music was the only currency.`
            : `${eraStats.plays} plays vs ${eraStats.money} money receipts — a ${(eraStats.plays / eraStats.money).toFixed(1)}× ratio, the highest of any era.`,
        accent: '#8b5cf6',
      },
  );

  return patterns;
}

/** Debug hook: prints pattern counts when ?debug=1 (architecture.md §13). */
export function debugLog(receipts: Receipt[], chapters: Chapter[], patterns: Pattern[]): void {
  if (new URLSearchParams(window.location.search).get('debug') !== '1') return;
  console.warn(`[debug] receipts=${receipts.length} chapters=${chapters.length} patterns=${patterns.length}`);
}
