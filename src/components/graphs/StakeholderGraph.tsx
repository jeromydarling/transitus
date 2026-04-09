import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';
import { useTransitusData } from '@/contexts/TransitusDataContext';
import { ROLE_LABELS } from '@/types/transitus';
import type { TransitusRole } from '@/types/transitus';

const ROLE_COLORS: Record<TransitusRole, string> = {
  steward: 'hsl(152 40% 28%)', field_companion: 'hsl(16 65% 48%)',
  listener: 'hsl(198 55% 42%)', convener: 'hsl(38 80% 55%)',
  analyst: 'hsl(270 40% 50%)', sponsor: 'hsl(20 30% 40%)',
  resident_witness: 'hsl(340 45% 50%)',
};

export default function StakeholderGraph() {
  const { stakeholders, places } = useTransitusData();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const SIZE = 500; const CENTER = SIZE / 2; const RADIUS = 180; const NODE_R = 22;

  const positions = useMemo(() => stakeholders.map((s, i) => {
    const angle = (2 * Math.PI * i) / stakeholders.length - Math.PI / 2;
    return { id: s.id, x: CENTER + RADIUS * Math.cos(angle), y: CENTER + RADIUS * Math.sin(angle) };
  }), [stakeholders]);

  const connections = useMemo(() => {
    const edges: { from: string; to: string; count: number }[] = [];
    for (let i = 0; i < stakeholders.length; i++) {
      for (let j = i + 1; j < stakeholders.length; j++) {
        const shared = stakeholders[i].place_ids.filter(p => stakeholders[j].place_ids.includes(p));
        if (shared.length > 0) edges.push({ from: stakeholders[i].id, to: stakeholders[j].id, count: shared.length });
      }
    }
    return edges;
  }, [stakeholders]);

  const getPos = (id: string) => positions.find(p => p.id === id)!;
  const isConnected = (id: string) => {
    if (!hoveredId) return true;
    if (id === hoveredId) return true;
    return connections.some(c => (c.from === hoveredId && c.to === id) || (c.to === hoveredId && c.from === id));
  };

  return (
    <div className="min-h-screen bg-[hsl(38_30%_95%)]">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <div className="flex items-center gap-2 mb-2">
          <Users className="h-4 w-4 text-[hsl(16_65%_48%)]" />
          <span className="font-sans text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">Relationship Network</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl text-[hsl(20_25%_12%)] mb-2">Stakeholder Connections</h1>
        <p className="text-sm text-[hsl(20_25%_12%/0.55)] mb-6">Connected by shared places. Hover to highlight relationships.</p>

        <div className="flex flex-wrap gap-3 mb-6">
          {(Object.entries(ROLE_COLORS) as [TransitusRole, string][]).map(([role, color]) => (
            <div key={role} className="flex items-center gap-1.5 text-xs text-[hsl(20_25%_12%/0.6)]">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} /> {ROLE_LABELS[role]}
            </div>
          ))}
        </div>

        <div className="rounded-xl bg-white border border-[hsl(30_18%_82%)] p-4 overflow-auto">
          <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full max-w-[500px] mx-auto" style={{ aspectRatio: '1' }}>
            {connections.map((edge, i) => {
              const from = getPos(edge.from); const to = getPos(edge.to);
              const hl = hoveredId && (edge.from === hoveredId || edge.to === hoveredId);
              return <line key={i} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={hl ? 'hsl(16 65% 48%)' : 'hsl(30 18% 82%)'} strokeWidth={hl ? 2 : 1} opacity={!hoveredId ? 0.3 : hl ? 0.8 : 0.05} strokeDasharray={edge.count > 1 ? undefined : '4 4'} />;
            })}
            <text x={CENTER} y={CENTER - 6} textAnchor="middle" fontSize="11" fill="hsl(20 25% 12% / 0.3)" fontFamily="Inter">{places.length} places</text>
            <text x={CENTER} y={CENTER + 10} textAnchor="middle" fontSize="10" fill="hsl(20 25% 12% / 0.2)" fontFamily="Inter">{connections.length} connections</text>
            {stakeholders.map(s => {
              const pos = getPos(s.id);
              const color = ROLE_COLORS[s.role] || 'hsl(20 12% 46%)';
              const initials = s.name.split(' ').map(n => n[0]).join('').slice(0, 2);
              return (
                <g key={s.id} opacity={isConnected(s.id) ? 1 : 0.15} style={{ transition: 'opacity 0.2s' }}>
                  <Link to={`/app/people/${s.id}`}>
                    <circle cx={pos.x} cy={pos.y} r={NODE_R} fill={color} stroke={hoveredId === s.id ? 'hsl(38 80% 55%)' : 'white'} strokeWidth={hoveredId === s.id ? 3 : 2} onMouseEnter={() => setHoveredId(s.id)} onMouseLeave={() => setHoveredId(null)} style={{ cursor: 'pointer' }} />
                    <text x={pos.x} y={pos.y + 1} textAnchor="middle" dominantBaseline="middle" fontSize="10" fontWeight="600" fill="white" fontFamily="Inter" style={{ pointerEvents: 'none' }}>{initials}</text>
                    <text x={pos.x} y={pos.y + NODE_R + 14} textAnchor="middle" fontSize="9" fill="hsl(20 25% 12% / 0.6)" fontFamily="Inter" style={{ pointerEvents: 'none' }}>{s.name.split(' ')[0]}</text>
                  </Link>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}
