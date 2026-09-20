import { useMemo } from 'react';
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useAppStore } from '../store/useAppStore';
import { monthKeyOf } from '../utils/parseDates';
import { monthLabel } from '../utils/format';
import type { Era } from '../types/receipt';

const ERA_COLORS: Record<Era, string> = { quiet: '#14b8a6', wanderer: '#fb7185', night: '#6366f1' };

interface DensityDatum {
  key: string;
  label: string;
  count: number;
  color: string;
}

/** Monthly receipt density across the full archive; default export for React.lazy. */
export default function DensityChart() {
  const receipts = useAppStore((s) => s.receipts);

  const data = useMemo<DensityDatum[]>(() => {
    const byMonth = new Map<string, { count: number; era: Era }>();
    for (const r of receipts) {
      const key = monthKeyOf(r.timestamp);
      byMonth.set(key, { count: (byMonth.get(key)?.count ?? 0) + 1, era: r.era });
    }
    const keys = [...byMonth.keys()].sort();
    if (keys.length === 0) return [];
    // Include the silent years between eras — the gaps are part of the story.
    const [first, last] = [keys[0], keys[keys.length - 1]];
    const startYear = Number(first.slice(0, 4));
    const endYear = Number(last.slice(0, 4));
    const out: DensityDatum[] = [];
    for (let year = startYear; year <= endYear; year++) {
      for (let month = 1; month <= 12; month++) {
        const key = `${year}-${String(month).padStart(2, '0')}`;
        const hit = byMonth.get(key);
        out.push({
          key,
          label: monthLabel(key),
          count: hit?.count ?? 0,
          color: hit ? ERA_COLORS[hit.era] : 'var(--border)',
        });
      }
    }
    return out;
  }, [receipts]);

  if (data.length === 0) return null;

  return (
    <div data-testid="density-chart" aria-hidden="true" className="h-24">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }} barCategoryGap={0}>
          <Tooltip
            cursor={{ fill: 'rgba(99,102,241,0.08)' }}
            contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)' }}
            formatter={(value: number | string) => [`${value} receipts`, undefined]}
            labelFormatter={(label: string) => String(label)}
          />
          <Bar dataKey="count" radius={[2, 2, 0, 0]} isAnimationActive={false}>
            {data.map((d: DensityDatum) => (
              <Cell key={d.key} fill={d.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
