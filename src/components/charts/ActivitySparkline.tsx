/**
 * ActivitySparkline — A minimal area sparkline using recharts.
 *
 * No axes, no grid, no tooltip. Just the line and fill.
 */

import { AreaChart, Area, ResponsiveContainer } from 'recharts';

interface SparklineDataPoint {
  day: string;
  count: number;
}

interface ActivitySparklineProps {
  data: SparklineDataPoint[];
  color?: string;
  className?: string;
}

export default function ActivitySparkline({
  data,
  color = 'hsl(16, 65%, 48%)',
  className = '',
}: ActivitySparklineProps) {
  return (
    <div className={className} style={{ width: '100%', height: 40 }}>
      <ResponsiveContainer width="100%" height={40}>
        <AreaChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={`spark-${color.replace(/[^a-zA-Z0-9]/g, '')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={color} stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="count"
            stroke={color}
            strokeWidth={1.5}
            fill={`url(#spark-${color.replace(/[^a-zA-Z0-9]/g, '')})`}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
