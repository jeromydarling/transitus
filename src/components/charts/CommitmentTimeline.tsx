/**
 * CommitmentTimeline — horizontal SVG timeline of commitments by date
 *
 * Each commitment is a dot positioned by creation date and colored by status.
 * A vertical "today" marker line is drawn.
 */

import type { Commitment, CommitmentStatus } from '@/types/transitus';

const STATUS_COLORS: Record<CommitmentStatus, string> = {
  proposed: 'hsl(198 55% 42%)',
  acknowledged: 'hsl(210 15% 55%)',
  accepted: 'hsl(180 35% 40%)',
  in_motion: 'hsl(152 40% 28%)',
  delayed: 'hsl(38 80% 55%)',
  breached: 'hsl(0 50% 45%)',
  repaired: 'hsl(270 40% 50%)',
  completed: 'hsl(152 45% 30%)',
};

interface Props {
  commitments: Commitment[];
}

export default function CommitmentTimeline({ commitments }: Props) {
  if (commitments.length === 0) return null;

  const paddingX = 40;
  const height = 60;
  const width = 700;
  const innerWidth = width - paddingX * 2;
  const cy = 22;

  // Date range
  const dates = commitments.map((c) => new Date(c.created_at).getTime());
  const now = Date.now();
  const minDate = Math.min(...dates, now);
  const maxDate = Math.max(...dates, now);
  const range = maxDate - minDate || 1;

  const toX = (ts: number) => paddingX + ((ts - minDate) / range) * innerWidth;

  const todayX = toX(now);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full"
      style={{ maxHeight: `${height}px` }}
      role="img"
      aria-label="Commitment timeline"
    >
      {/* Base line */}
      <line
        x1={paddingX}
        y1={cy}
        x2={width - paddingX}
        y2={cy}
        stroke="hsl(30 18% 85%)"
        strokeWidth={1.5}
      />

      {/* Today marker */}
      <line
        x1={todayX}
        y1={4}
        x2={todayX}
        y2={cy + 10}
        stroke="hsl(16 65% 48%)"
        strokeWidth={1.5}
        strokeDasharray="3 2"
      />
      <text
        x={todayX}
        y={cy + 22}
        textAnchor="middle"
        fontSize="8"
        fill="hsl(16 65% 48%)"
        fontFamily="Inter, system-ui, sans-serif"
      >
        Today
      </text>

      {/* Date labels */}
      <text
        x={paddingX}
        y={height - 4}
        textAnchor="start"
        fontSize="8"
        fill="hsl(20 8% 60%)"
        fontFamily="Inter, system-ui, sans-serif"
      >
        {new Date(minDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
      </text>
      <text
        x={width - paddingX}
        y={height - 4}
        textAnchor="end"
        fontSize="8"
        fill="hsl(20 8% 60%)"
        fontFamily="Inter, system-ui, sans-serif"
      >
        {new Date(maxDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
      </text>

      {/* Commitment dots */}
      {commitments.map((c) => {
        const x = toX(new Date(c.created_at).getTime());
        const color = STATUS_COLORS[c.status];
        return (
          <circle
            key={c.id}
            cx={x}
            cy={cy}
            r={5}
            fill={color}
            stroke="white"
            strokeWidth={1.5}
          >
            <title>{c.title} ({c.status})</title>
          </circle>
        );
      })}
    </svg>
  );
}
