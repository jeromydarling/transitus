/**
 * SignalSourceBar — horizontal bar chart showing signal counts per source
 *
 * Uses recharts BarChart with horizontal bars. Source names on Y axis,
 * counts on X. Earth tone palette.
 */

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { Signal, SignalSource } from '@/types/transitus';
import { SIGNAL_SOURCE_LABELS } from '@/types/transitus';

// Earth tone palette for bars
const BAR_COLOR = 'hsl(16, 65%, 48%)';

interface Props {
  signals: Signal[];
}

export default function SignalSourceBar({ signals }: Props) {
  const data = useMemo(() => {
    const counts: Partial<Record<SignalSource, number>> = {};
    for (const s of signals) {
      counts[s.source] = (counts[s.source] || 0) + 1;
    }
    return (Object.entries(counts) as [SignalSource, number][])
      .map(([source, count]) => ({
        source: SIGNAL_SOURCE_LABELS[source],
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }, [signals]);

  if (data.length === 0) return null;

  const chartHeight = Math.max(200, data.length * 32);

  return (
    <div className="rounded-lg bg-white border border-[hsl(30,18%,82%)] p-4">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-[hsl(30,10%,55%)] mb-3">
        Signals by Source
      </p>
      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 10 }}>
          <XAxis type="number" allowDecimals={false} tick={{ fontSize: 10, fill: 'hsl(20, 8%, 50%)' }} axisLine={false} tickLine={false} />
          <YAxis
            type="category"
            dataKey="source"
            width={110}
            tick={{ fontSize: 11, fill: 'hsl(20, 10%, 35%)' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: '1px solid hsl(30, 18%, 82%)',
              fontSize: 12,
            }}
          />
          <Bar dataKey="count" fill={BAR_COLOR} radius={[0, 4, 4, 0]} barSize={18} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
