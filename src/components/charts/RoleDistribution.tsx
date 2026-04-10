/**
 * RoleDistribution — tiny donut chart showing stakeholder role breakdown
 *
 * Uses recharts PieChart with an inner radius for a donut style.
 * Center shows the total stakeholder count.
 */

import { useMemo } from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import type { Stakeholder, TransitusRole } from '@/types/transitus';
import { ROLE_LABELS } from '@/types/transitus';

// Match ROLE_COLORS from StakeholderGraph
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

  return (
    <div className="relative" style={{ width: 120, height: 120 }}>
      <PieChart width={120} height={120}>
        <Pie
          data={data}
          cx={55}
          cy={55}
          innerRadius={30}
          outerRadius={50}
          dataKey="value"
          stroke="none"
          isAnimationActive={false}
        >
          {data.map((entry) => (
            <Cell key={entry.role} fill={ROLE_COLORS[entry.role]} />
          ))}
        </Pie>
      </PieChart>
      {/* Center total */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
        style={{ width: 120, height: 120 }}
      >
        <span className="text-lg font-semibold text-[hsl(20,28%,15%)]">{stakeholders.length}</span>
        <span className="text-[8px] uppercase tracking-wider text-[hsl(20,8%,50%)]">People</span>
      </div>
    </div>
  );
}
