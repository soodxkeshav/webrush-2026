import { useMemo } from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { useAppStore } from '../store/useAppStore';
import { monthKeyOf } from '../utils/parseDates';
import { monthLabel } from '../utils/format';

interface DensityDatum {
  key: string;
  label: string;
  count: number;
}

/** Monthly receipt density across the full archive; default export for React.lazy. */
export default function DensityChart() {
  const receipts = useAppStore((s) => s.receipts);

  const data = useMemo<DensityDatum[]>(() => {
    const byMonth = new Map<string, number>();
    for (const r of receipts) {
      const key = monthKeyOf(r.timestamp);
      byMonth.set(key, (byMonth.get(key) ?? 0) + 1);
    }
    const keys = [...byMonth.keys()].sort();
    if (keys.length === 0) return [];
    // Include the silent years between eras — the gaps are part of the story.
    const first = keys[0];
    const last = keys[keys.length - 1];
    const startYear = Number(first.slice(0, 4));
    const endYear = Number(last.slice(0, 4));
    const out: DensityDatum[] = [];
    for (let year = startYear; year <= endYear; year++) {
      for (let month = 1; month <= 12; month++) {
        const key = `${year}-${String(month).padStart(2, '0')}`;
        out.push({ key, label: monthLabel(key), count: byMonth.get(key) ?? 0 });
      }
    }
    return out;
  }, [receipts]);

  if (data.length === 0) return null;

  return (
    <div data-testid="density-chart" aria-hidden="true" className="h-24">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="densityFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity={0.45} />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.04} />
            </linearGradient>
          </defs>
          <XAxis dataKey="label" hide />
          <Tooltip
            cursor={{ stroke: '#6366f1', strokeOpacity: 0.3, strokeWidth: 1 }}
            contentStyle={{ fontSize: 12, borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', boxShadow: 'var(--shadow-md)' }}
            formatter={(value: number | string) => [`${value} receipts`, undefined]}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#8b5cf6"
            strokeWidth={2}
            fill="url(#densityFill)"
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
