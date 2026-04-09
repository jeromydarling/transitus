import { Link } from 'react-router-dom';
import { Target, MapPin, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { useTransitusData } from '@/contexts/TransitusDataContext';
import { COMMITMENT_STATUS_LABELS } from '@/types/transitus';

interface Milestone { label: string; current: number; goal: number; unit: string }

const CBA_MILESTONES: Record<string, Milestone[]> = {
  'c-2': [
    { label: 'Local hiring positions', current: 127, goal: 500, unit: 'positions' },
    { label: 'Green space developed', current: 2.1, goal: 8, unit: 'acres' },
    { label: 'Pollution control systems', current: 3, goal: 5, unit: 'systems' },
    { label: 'Advisory meetings held', current: 8, goal: 12, unit: 'meetings' },
  ],
  'c-1': [
    { label: 'Air monitoring stations', current: 2, goal: 4, unit: 'stations' },
    { label: 'Monthly reports published', current: 3, goal: 12, unit: 'reports' },
  ],
  'c-3': [
    { label: 'Homes insulated', current: 210, goal: 800, unit: 'homes' },
    { label: 'Noise complaints addressed', current: 45, goal: 120, unit: 'complaints' },
  ],
};

function ProgressBar({ current, goal }: { current: number; goal: number }) {
  const pct = Math.min(100, Math.round((current / goal) * 100));
  return (
    <div className="w-full h-3 rounded-full bg-[hsl(30_18%_82%/0.5)] overflow-hidden">
      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: pct >= 80 ? 'hsl(152 40% 28%)' : pct >= 40 ? 'hsl(38 80% 55%)' : 'hsl(16 65% 48%)' }} />
    </div>
  );
}

export default function CommunityBenefits() {
  const { commitments, places } = useTransitusData();
  const trackable = commitments.filter(c => c.commitment_type === 'cba' || c.commitment_type === 'legal_agreement' || c.commitment_type === 'public_pledge');
  const placeName = (id: string) => places.find(p => p.id === id)?.name || id;
  const statusColor = (s: string) => ({ completed: 'hsl(152 40% 28%)', in_motion: 'hsl(152 35% 35%)', accepted: 'hsl(198 55% 42%)', delayed: 'hsl(38 80% 55%)', breached: 'hsl(0 55% 48%)', proposed: 'hsl(198 55% 42%)', acknowledged: 'hsl(20 12% 46%)', repaired: 'hsl(270 30% 50%)' }[s] || 'hsl(20 12% 46%)');

  return (
    <div className="min-h-screen bg-[hsl(38_30%_95%)]">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <div className="flex items-center gap-2 mb-2">
          <Target className="h-4 w-4 text-[hsl(16_65%_48%)]" />
          <span className="font-sans text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">Community Benefits</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl text-[hsl(20_25%_12%)] mb-2">Commitment Progress Tracker</h1>
        <p className="text-sm text-[hsl(20_25%_12%/0.55)] mb-8">Track milestones and deliverables for CBAs, cleanup commitments, and public pledges.</p>

        {trackable.length === 0 ? (
          <div className="text-center py-16"><Target className="h-10 w-10 text-[hsl(20_25%_12%/0.2)] mx-auto mb-4" /><p className="text-[hsl(20_25%_12%/0.5)]">No trackable commitments yet.</p></div>
        ) : (
          <div className="space-y-6">
            {trackable.map(c => {
              const milestones = CBA_MILESTONES[c.id] || [];
              return (
                <div key={c.id} className="rounded-xl bg-white border border-[hsl(30_18%_82%)] overflow-hidden">
                  <div className="px-5 py-4 border-b border-[hsl(30_18%_82%/0.5)]">
                    <h2 className="font-serif text-lg text-[hsl(20_25%_12%)]">{c.title}</h2>
                    <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold text-white" style={{ backgroundColor: statusColor(c.status) }}>
                        {c.status === 'delayed' && <AlertTriangle className="h-3 w-3" />}
                        {c.status === 'completed' && <CheckCircle2 className="h-3 w-3" />}
                        {c.status === 'in_motion' && <Clock className="h-3 w-3" />}
                        {COMMITMENT_STATUS_LABELS[c.status]}
                      </span>
                      {c.place_ids.map(pid => (
                        <Link key={pid} to={`/app/places/${pid}`} className="flex items-center gap-1 text-[10px] text-[hsl(20_25%_12%/0.5)] hover:text-[hsl(16_65%_48%)]">
                          <MapPin className="h-3 w-3" />{placeName(pid)}
                        </Link>
                      ))}
                    </div>
                    {c.community_interpretation && (
                      <p className="mt-3 text-xs text-[hsl(20_25%_12%/0.55)] italic border-l-2 border-[hsl(16_65%_48%/0.3)] pl-3">"{c.community_interpretation}"</p>
                    )}
                  </div>
                  {milestones.length > 0 ? (
                    <div className="px-5 py-4 space-y-4">
                      {milestones.map((m, i) => {
                        const pct = Math.round((m.current / m.goal) * 100);
                        return (
                          <div key={i}>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-sm font-medium text-[hsl(20_25%_12%)]">{m.label}</span>
                              <span className="text-xs text-[hsl(20_25%_12%/0.5)]">{m.current} / {m.goal} {m.unit} ({pct}%)</span>
                            </div>
                            <ProgressBar current={m.current} goal={m.goal} />
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="px-5 py-6 text-center"><p className="text-xs text-[hsl(20_25%_12%/0.4)]">No milestones defined yet.</p></div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
