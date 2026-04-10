/**
 * CommitmentTimeline — interactive horizontal SVG timeline of commitments.
 * Hover a dot to see commitment details. Click to scroll to the commitment.
 */

import { useState } from 'react';
import type { Commitment, CommitmentStatus } from '@/types/transitus';
import { COMMITMENT_STATUS_LABELS } from '@/types/transitus';

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
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (commitments.length === 0) return null;

  const paddingX = 40;
  const height = 80;
  const width = 700;
  const innerWidth = width - paddingX * 2;
  const cy = 22;

  const dates = commitments.map((c) => new Date(c.created_at).getTime());
  const now = Date.now();
  const minDate = Math.min(...dates, now);
  const maxDate = Math.max(...dates, now);
  const range = maxDate - minDate || 1;

  const toX = (ts: number) => paddingX + ((ts - minDate) / range) * innerWidth;
  const todayX = toX(now);

  const hoveredCommitment = hoveredId ? commitments.find(c => c.id === hoveredId) : null;

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        style={{ maxHeight: `${height}px` }}
        role="img"
        aria-label="Commitment timeline"
      >
        {/* Base line */}
        <line x1={paddingX} y1={cy} x2={width - paddingX} y2={cy} stroke="hsl(30 18% 85%)" strokeWidth={1.5} />

        {/* Today marker */}
        <line x1={todayX} y1={4} x2={todayX} y2={cy + 10} stroke="hsl(16 65% 48%)" strokeWidth={1.5} strokeDasharray="3 2" />
        <text x={todayX} y={cy + 22} textAnchor="middle" fontSize="8" fill="hsl(16 65% 48%)" fontFamily="Inter, system-ui, sans-serif">Today</text>

        {/* Date labels */}
        <text x={paddingX} y={height - 4} textAnchor="start" fontSize="8" fill="hsl(20 8% 60%)" fontFamily="Inter, system-ui, sans-serif">
          {new Date(minDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
        </text>
        <text x={width - paddingX} y={height - 4} textAnchor="end" fontSize="8" fill="hsl(20 8% 60%)" fontFamily="Inter, system-ui, sans-serif">
          {new Date(maxDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
        </text>

        {/* Status legend */}
        {(() => {
          const statuses = [...new Set(commitments.map(c => c.status))];
          return statuses.map((status, i) => (
            <g key={status} transform={`translate(${paddingX + i * 85}, ${height - 16})`}>
              <circle cx={0} cy={0} r={3} fill={STATUS_COLORS[status]} />
              <text x={6} y={3} fontSize="7" fill="hsl(20 8% 50%)" fontFamily="Inter, system-ui, sans-serif">{COMMITMENT_STATUS_LABELS[status]}</text>
            </g>
          ));
        })()}

        {/* Commitment dots */}
        {commitments.map((c) => {
          const x = toX(new Date(c.created_at).getTime());
          const color = STATUS_COLORS[c.status];
          const isHovered = hoveredId === c.id;
          return (
            <g key={c.id}>
              {isHovered && <circle cx={x} cy={cy} r={10} fill={color} opacity={0.15} />}
              <circle
                cx={x}
                cy={cy}
                r={isHovered ? 7 : 5}
                fill={color}
                stroke="white"
                strokeWidth={isHovered ? 2 : 1.5}
                style={{ cursor: 'pointer', transition: 'r 0.15s' }}
                onMouseEnter={() => setHoveredId(c.id)}
                onMouseLeave={() => setHoveredId(null)}
              />
            </g>
          );
        })}
      </svg>

      {/* Tooltip */}
      {hoveredCommitment && (() => {
        const x = toX(new Date(hoveredCommitment.created_at).getTime());
        const pct = ((x / width) * 100);
        return (
          <div
            className="absolute z-10 rounded-lg bg-[hsl(20_28%_10%)] text-white px-3 py-2 shadow-lg text-xs max-w-[220px] pointer-events-none"
            style={{ left: `${pct}%`, top: '-4px', transform: 'translate(-50%, -100%)' }}
          >
            <p className="font-semibold text-[11px] leading-tight">{hoveredCommitment.title}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: STATUS_COLORS[hoveredCommitment.status] }} />
                {COMMITMENT_STATUS_LABELS[hoveredCommitment.status]}
              </span>
              <span className="text-white/40">
                {new Date(hoveredCommitment.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
