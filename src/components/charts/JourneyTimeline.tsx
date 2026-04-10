/**
 * JourneyTimeline — horizontal SVG timeline for journey chapters
 *
 * Renders colored circle nodes connected by lines. Each node represents
 * a chapter, colored by chapter type. The latest chapter is slightly larger.
 */

import type { JourneyChapter, ChapterType } from '@/types/transitus';
import { CHAPTER_TYPE_LABELS } from '@/types/transitus';

const CHAPTER_COLORS: Record<ChapterType, string> = {
  recognition: 'hsl(38 80% 55%)',
  listening: 'hsl(198 55% 42%)',
  coalition_building: 'hsl(152 40% 28%)',
  negotiation: 'hsl(16 65% 48%)',
  transition: 'hsl(152 35% 35%)',
  repair: 'hsl(270 40% 50%)',
  stewardship: 'hsl(152 45% 30%)',
};

interface Props {
  chapters: JourneyChapter[];
}

export default function JourneyTimeline({ chapters }: Props) {
  if (chapters.length === 0) return null;

  const nodeSpacing = 80;
  const paddingX = 40;
  const paddingY = 14;
  const height = 80;
  const width = paddingX * 2 + (chapters.length - 1) * nodeSpacing;
  const cy = paddingY + 10; // vertical center of the dots

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full"
      style={{ maxHeight: `${height}px` }}
      role="img"
      aria-label="Journey chapter timeline"
    >
      {/* Connecting lines */}
      {chapters.map((_, idx) => {
        if (idx === 0) return null;
        const x1 = paddingX + (idx - 1) * nodeSpacing;
        const x2 = paddingX + idx * nodeSpacing;
        return (
          <line
            key={`line-${idx}`}
            x1={x1}
            y1={cy}
            x2={x2}
            y2={cy}
            stroke="hsl(30 18% 82%)"
            strokeWidth={2}
          />
        );
      })}

      {/* Nodes + labels */}
      {chapters.map((ch, idx) => {
        const cx = paddingX + idx * nodeSpacing;
        const isLatest = idx === chapters.length - 1;
        const r = isLatest ? 8 : 6;
        const color = CHAPTER_COLORS[ch.chapter_type];

        return (
          <g key={ch.id}>
            {/* Outer ring for latest */}
            {isLatest && (
              <circle cx={cx} cy={cy} r={r + 3} fill="none" stroke={color} strokeWidth={1.5} opacity={0.4} />
            )}
            {/* Dot */}
            <circle cx={cx} cy={cy} r={r} fill={color} />
            {/* Title below */}
            <text
              x={cx}
              y={cy + r + 14}
              textAnchor="middle"
              fontSize="9"
              fill="hsl(20 8% 50%)"
              fontFamily="Inter, system-ui, sans-serif"
            >
              {ch.title.length > 12 ? ch.title.slice(0, 11) + '\u2026' : ch.title}
            </text>
            {/* Chapter type label */}
            <text
              x={cx}
              y={cy + r + 25}
              textAnchor="middle"
              fontSize="7"
              fill="hsl(20 8% 62%)"
              fontFamily="Inter, system-ui, sans-serif"
            >
              {CHAPTER_TYPE_LABELS[ch.chapter_type]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
