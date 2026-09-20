import { useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function ActivityHeatmap() {
  const receipts = useAppStore((s) => s.receipts);
  const cells = useMemo(() => {
    const counts = Array.from({ length: 7 }, () => Array<number>(24).fill(0));
    receipts.forEach((receipt) => {
      const date = new Date(receipt.timestamp);
      counts[date.getDay()][date.getHours()] += 1;
    });
    return counts;
  }, [receipts]);
  const max = Math.max(1, ...cells.flat());
  return (
    <div className="mt-6 rounded-xl border border-border bg-surface p-4" data-testid="activity-heatmap">
      <h3 className="text-sm font-bold text-text">Activity by hour</h3>
      <div className="mt-3 overflow-x-auto">
        <div className="min-w-[620px]">
          <div className="ml-20 grid grid-cols-24 gap-1 text-[9px] text-text-faint">{Array.from({ length: 24 }, (_, h) => <span key={h}>{h}</span>)}</div>
          {cells.map((row, day) => (
            <div key={DAYS[day]} className="mt-1 flex items-center gap-1">
              <span className="w-19 shrink-0 text-right text-[10px] text-text-muted">{DAYS[day]}</span>
              {row.map((count, hour) => (
                <span key={hour} title={`${count} receipts at ${hour % 12 || 12} ${hour < 12 ? 'AM' : 'PM'} on ${DAYS[day]}`} className="h-4 min-w-4 flex-1 rounded-sm bg-indigo-500" style={{ opacity: count === 0 ? 0.06 : 0.18 + (count / max) * 0.82 }} />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 flex items-center justify-end gap-2 text-[10px] text-text-faint"><span>Fewer</span><span className="h-3 w-3 rounded-sm bg-indigo-500 opacity-10" /><span className="h-3 w-3 rounded-sm bg-indigo-500 opacity-50" /><span className="h-3 w-3 rounded-sm bg-indigo-500" /><span>More</span></div>
    </div>
  );
}
