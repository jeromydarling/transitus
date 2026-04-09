/**
 * Gardener Analytics — Platform-wide data analysis and engagement metrics.
 */

import { useTransitusData } from '@/contexts/TransitusDataContext';
import { buildCompassDirection } from '@/lib/compassDirection';
import {
  BarChart3, MapPin, Users, Handshake, NotebookPen,
  Radio, Quote, BookOpen, FileText, Compass, TrendingUp,
} from 'lucide-react';

function SectionHeader({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Icon className="w-4 h-4 text-[hsl(16_65%_48%)]" />
      <h3 className="text-xs font-semibold text-[hsl(20_25%_12%)] uppercase tracking-wider">{label}</h3>
    </div>
  );
}

interface EntityRowProps {
  icon: React.ElementType;
  label: string;
  count: number;
  color: string;
}

function EntityRow({ icon: Icon, label, count, color }: EntityRowProps) {
  return (
    <div className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-[hsl(38_30%_95%)] transition-colors">
      <Icon className="w-4 h-4 shrink-0" style={{ color }} />
      <span className="text-sm text-[hsl(20_25%_12%)] flex-1">{label}</span>
      <span className="text-sm font-semibold text-[hsl(20_25%_12%)]">{count}</span>
    </div>
  );
}

export default function GardenerAnalytics() {
  const {
    places, stakeholders, commitments, fieldNotes,
    signals, communityStories, library, reports, journeys,
  } = useTransitusData();

  // Most active places (by associated field notes)
  const placesWithNotes = places.map(place => {
    const noteCount = fieldNotes.filter(fn => fn.place_id === place.id).length;
    return { ...place, noteCount };
  }).sort((a, b) => b.noteCount - a.noteCount).slice(0, 5);

  // Most engaged stakeholders (by field notes authored)
  const stakeholderEngagement = stakeholders.map(s => {
    const noteCount = fieldNotes.filter(fn => fn.author_id === s.id).length;
    return { ...s, noteCount };
  }).sort((a, b) => b.noteCount - a.noteCount).slice(0, 5);

  // Compass direction distribution (derived from signal categories)
  const directionCounts = { north: 0, east: 0, south: 0, west: 0 };
  signals.forEach(s => {
    const dir = buildCompassDirection(s.category);
    directionCounts[dir]++;
  });
  const topDirection = (Object.entries(directionCounts) as [string, number][])
    .sort((a, b) => b[1] - a[1])[0];

  // Mock: data created this week
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const recentFieldNotes = fieldNotes.filter(fn => new Date(fn.created_at) > oneWeekAgo).length;
  const recentStories = communityStories.filter(cs => new Date(cs.collected_at) > oneWeekAgo).length;
  const recentSignals = signals.filter(s => new Date(s.created_at) > oneWeekAgo).length;

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <BarChart3 className="w-5 h-5 text-[hsl(16_65%_48%)]" />
          <h2 className="font-serif text-2xl text-[hsl(20_25%_12%)]">Analytics</h2>
        </div>
        <p className="text-sm text-[hsl(20_25%_12%/0.5)]">
          Platform-wide data analysis and engagement patterns.
        </p>
      </div>

      {/* Total data counts */}
      <div className="bg-white rounded-xl border border-[hsl(30_18%_82%)] p-5">
        <SectionHeader icon={BarChart3} label="Data Counts by Entity" />
        <div className="divide-y divide-[hsl(30_18%_82%/0.5)]">
          <EntityRow icon={MapPin} label="Places" count={places.length} color="hsl(16 65% 48%)" />
          <EntityRow icon={Users} label="Stakeholders" count={stakeholders.length} color="hsl(152 40% 28%)" />
          <EntityRow icon={Handshake} label="Commitments" count={commitments.length} color="hsl(38 80% 50%)" />
          <EntityRow icon={NotebookPen} label="Field Notes" count={fieldNotes.length} color="hsl(270 30% 40%)" />
          <EntityRow icon={Radio} label="Signals" count={signals.length} color="hsl(198 55% 42%)" />
          <EntityRow icon={Quote} label="Community Stories" count={communityStories.length} color="hsl(0 25% 30%)" />
          <EntityRow icon={BookOpen} label="Library Items" count={library.length} color="hsl(152 35% 35%)" />
          <EntityRow icon={FileText} label="Reports" count={reports.length} color="hsl(20 25% 12%)" />
          <EntityRow icon={BookOpen} label="Journeys" count={journeys.length} color="hsl(38 70% 50%)" />
        </div>
      </div>

      {/* Data created this week */}
      <div className="bg-white rounded-xl border border-[hsl(30_18%_82%)] p-5">
        <SectionHeader icon={TrendingUp} label="Data Created This Week" />
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="text-center p-4 rounded-lg bg-[hsl(38_30%_95%)]">
            <p className="text-2xl font-semibold text-[hsl(270_30%_40%)]">{recentFieldNotes}</p>
            <p className="text-[10px] text-[hsl(20_25%_12%/0.4)] uppercase tracking-wider mt-1">Field Notes</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-[hsl(38_30%_95%)]">
            <p className="text-2xl font-semibold text-[hsl(0_25%_30%)]">{recentStories}</p>
            <p className="text-[10px] text-[hsl(20_25%_12%/0.4)] uppercase tracking-wider mt-1">Stories</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-[hsl(38_30%_95%)]">
            <p className="text-2xl font-semibold text-[hsl(198_55%_42%)]">{recentSignals}</p>
            <p className="text-[10px] text-[hsl(20_25%_12%/0.4)] uppercase tracking-wider mt-1">Signals</p>
          </div>
        </div>
      </div>

      {/* Most active places */}
      <div className="bg-white rounded-xl border border-[hsl(30_18%_82%)] p-5">
        <SectionHeader icon={MapPin} label="Most Active Places" />
        {placesWithNotes.length === 0 ? (
          <p className="text-sm text-[hsl(20_25%_12%/0.4)] italic">No places with field notes yet.</p>
        ) : (
          <div className="space-y-2">
            {placesWithNotes.map((place, i) => (
              <div key={place.id} className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-[hsl(38_30%_95%)] transition-colors">
                <span className="w-5 h-5 rounded-full bg-[hsl(16_65%_48%/0.1)] text-[hsl(16_65%_48%)] text-[10px] font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <span className="text-sm text-[hsl(20_25%_12%)] flex-1 truncate">{place.name}</span>
                <span className="text-xs text-[hsl(20_25%_12%/0.5)]">{place.noteCount} notes</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Most engaged stakeholders */}
      <div className="bg-white rounded-xl border border-[hsl(30_18%_82%)] p-5">
        <SectionHeader icon={Users} label="Most Engaged Stakeholders" />
        {stakeholderEngagement.length === 0 ? (
          <p className="text-sm text-[hsl(20_25%_12%/0.4)] italic">No stakeholder engagement data yet.</p>
        ) : (
          <div className="space-y-2">
            {stakeholderEngagement.map((s, i) => (
              <div key={s.id} className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-[hsl(38_30%_95%)] transition-colors">
                <span className="w-5 h-5 rounded-full bg-[hsl(152_40%_28%/0.1)] text-[hsl(152_40%_28%)] text-[10px] font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <span className="text-sm text-[hsl(20_25%_12%)] flex-1 truncate">{s.name}</span>
                <span className="text-xs text-[hsl(20_25%_12%/0.5)]">{s.noteCount} notes</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Compass direction activity */}
      <div className="bg-white rounded-xl border border-[hsl(30_18%_82%)] p-5">
        <SectionHeader icon={Compass} label="Compass Direction Activity" />
        <div className="grid grid-cols-4 gap-3">
          {(['north', 'east', 'south', 'west'] as const).map(dir => {
            const count = directionCounts[dir];
            const isTop = topDirection && topDirection[0] === dir;
            return (
              <div
                key={dir}
                className={`text-center p-4 rounded-lg ${isTop ? 'bg-[hsl(16_65%_48%/0.06)] border border-[hsl(16_65%_48%/0.15)]' : 'bg-[hsl(38_30%_95%)]'}`}
              >
                <p className={`text-xl font-semibold ${isTop ? 'text-[hsl(16_65%_48%)]' : 'text-[hsl(20_25%_12%)]'}`}>
                  {count}
                </p>
                <p className="text-[10px] text-[hsl(20_25%_12%/0.4)] uppercase tracking-wider mt-1 capitalize">
                  {dir}
                </p>
              </div>
            );
          })}
        </div>
        {topDirection && topDirection[1] > 0 && (
          <p className="text-xs text-[hsl(20_25%_12%/0.5)] mt-3 italic">
            Most activity in the <span className="font-medium capitalize">{topDirection[0]}</span> direction ({topDirection[1]} signals).
          </p>
        )}
      </div>
    </div>
  );
}
