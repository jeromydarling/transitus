/**
 * RoleDistribution — interactive donut chart showing stakeholder role breakdown.
 * Hover a segment to see the role name and count. Click to filter (future).
 */

import { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import type { Stakeholder, TransitusRole } from '@/types/transitus';
import { ROLE_LABELS } from '@/types/transitus';

const ROLE_COLORS: Record<TransitusRole, string> = {
  steward: 'hsl(152, 40%, 28%)',
  field_companion: 'hsl(16, 65%, 48%)',
  listener: 'hsl(198, 55%, 42%)',
  convener: 'hsl(38, 80%, 55%)',
  analyst: 'hsl(270, 40%, 50%)',
  sponsor: 'hsl(20, 30%, 40%)',
  resident_witness: 'hsl(340, 45%, 50%)',
};

interface Props {
  stakeholders: Stakeholder[];
}

export default function RoleDistribution({ stakeholders }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const data = useMemo(() => {
    const counts: Partial<Record<TransitusRole, number>> = {};
    for (const s of stakeholders) {
      counts[s.role] = (counts[s.role] || 0) + 1;
    }
    return (Object.entries(counts) as [TransitusRole, number][]).map(([role, count]) => ({
      name: ROLE_LABELS[role],
      value: count,
      role,
    }));
  }, [stakeholders]);

  if (data.length === 0) return null;

  const activeEntry = activeIndex !== null ? data[activeIndex] : null;

  return (
    <div className="relative" style={{ width: 140, height: 140 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={35}
            outerRadius={55}
            dataKey="value"
            stroke="none"
            isAnimationActive={true}
            animationDuration={600}
            onMouseEnter={(_, index) => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            {data.map((entry, i) => (
              <Cell
                key={entry.role}
                fill={ROLE_COLORS[entry.role]}
                opacity={activeIndex === null || activeIndex === i ? 1 : 0.3}
                style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
              />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload;
              return (
                <div className="rounded-lg bg-[hsl(20_28%_10%)] text-white px-3 py-2 shadow-lg text-xs">
                  <p className="font-semibold">{d.name}</p>
                  <p className="text-white/60">{d.value} {d.value === 1 ? 'person' : 'people'}</p>
                </div>
              );
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      {/* Center — shows hovered role or total */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        {activeEntry ? (
          <>
            <span className="text-lg font-semibold text-[hsl(20,28%,15%)]">{activeEntry.value}</span>
            <span className="text-[7px] uppercase tracking-wider text-[hsl(20,8%,50%)] max-w-[60px] text-center leading-tight">{activeEntry.name}</span>
          </>
        ) : (
          <>
            <span className="text-lg font-semibold text-[hsl(20,28%,15%)]">{stakeholders.length}</span>
            <span className="text-[8px] uppercase tracking-wider text-[hsl(20,8%,50%)]">People</span>
          </>
        )}
      </div>
    </div>
  );
}
