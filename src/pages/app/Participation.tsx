/**
 * Community Participation — Volunteer & community engagement tracking.
 *
 * Summary stats, recent engagement feed, participation breakdowns by place and role,
 * and a "quiet voices" section highlighting stakeholders who need nurturing.
 */

import { useMemo } from 'react';
import {
  Heart,
  MapPin,
  Users,
  NotebookPen,
  AlertTriangle,
} from 'lucide-react';
import { useTransitusData } from '@/contexts/TransitusDataContext';
import { ROLE_LABELS } from '@/types/transitus';
import type { TransitusRole, FieldNoteType } from '@/types/transitus';

// ── Helpers ──

const FIELD_NOTE_TYPE_LABELS: Record<FieldNoteType, string> = {
  site_visit: 'Site Visit',
  listening_session: 'Listening Session',
  community_meeting: 'Community Meeting',
  prayer_vigil: 'Prayer Vigil',
  utility_meeting: 'Utility Meeting',
  household_interview: 'Household Interview',
  corridor_observation: 'Corridor Observation',
  quick_note: 'Quick Note',
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function daysAgo(iso: string): number {
  const now = new Date();
  const then = new Date(iso);
  return Math.floor((now.getTime() - then.getTime()) / (1000 * 60 * 60 * 24));
}

function SectionHeader({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Icon className="h-4 w-4 text-[hsl(16_65%_48%)]" />
      <span className="font-sans text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
        {label}
      </span>
    </div>
  );
}

// ── Main page ──

export default function Participation() {
  const { stakeholders, fieldNotes, places } = useTransitusData();

  const placeNameById = (id: string): string => {
    const place = places.find((p) => p.id === id);
    return place ? place.name : id;
  };

  const stakeholderNameById = (id: string): string => {
    const s = stakeholders.find((st) => st.id === id);
    return s ? s.name : 'Unknown';
  };

  // Summary stats
  const totalStakeholders = stakeholders.length;
  const totalEngagementEvents = fieldNotes.length;
  const placesCovered = useMemo(() => {
    const ids = new Set(fieldNotes.map((fn) => fn.place_id));
    return ids.size;
  }, [fieldNotes]);

  // Recent engagement feed (field notes sorted by date, most recent first)
  const sortedFieldNotes = useMemo(() => {
    return [...fieldNotes].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  }, [fieldNotes]);

  // Participation by place
  const byPlace = useMemo(() => {
    const map = new Map<string, { noteCount: number; uniqueAuthors: Set<string> }>();
    fieldNotes.forEach((fn) => {
      const entry = map.get(fn.place_id) || { noteCount: 0, uniqueAuthors: new Set() };
      entry.noteCount++;
      entry.uniqueAuthors.add(fn.author_id);
      map.set(fn.place_id, entry);
    });
    return Array.from(map.entries())
      .map(([placeId, data]) => ({
        placeId,
        placeName: placeNameById(placeId),
        noteCount: data.noteCount,
        uniqueStakeholders: data.uniqueAuthors.size,
      }))
      .sort((a, b) => b.noteCount - a.noteCount);
  }, [fieldNotes, places]);

  // Participation by role
  const byRole = useMemo(() => {
    const map = new Map<TransitusRole, number>();
    stakeholders.forEach((s) => {
      map.set(s.role, (map.get(s.role) || 0) + 1);
    });
    return Array.from(map.entries())
      .map(([role, count]) => ({ role, label: ROLE_LABELS[role], count }))
      .sort((a, b) => b.count - a.count);
  }, [stakeholders]);

  // Quiet voices: stakeholders with trust_level 'new' or 'building'
  const quietVoices = useMemo(() => {
    return stakeholders.filter(
      (s) => s.trust_level === 'new' || s.trust_level === 'building',
    );
  }, [stakeholders]);

  return (
    <div className="min-h-screen bg-[hsl(38_30%_95%)]">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        {/* ── Header ── */}
        <header className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <Heart className="h-4 w-4 text-[hsl(16_65%_48%)]" />
            <span className="font-sans text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
              Community Participation
            </span>
          </div>
          <h1 className="font-serif text-2xl font-normal text-[hsl(20_10%_18%)] sm:text-3xl">
            Who is showing up — and who are we missing
          </h1>
          <p className="mt-2 text-sm text-[hsl(20_8%_40%)] leading-relaxed max-w-2xl">
            A picture of community engagement across your places.
            Look for patterns — and gaps.
          </p>
        </header>

        {/* ── Summary stats ── */}
        <div className="mb-10 flex flex-wrap gap-3">
          <div className="flex items-center gap-2 rounded-md border border-[hsl(30_18%_82%)] bg-white px-3 py-2">
            <Users className="h-3.5 w-3.5 text-[hsl(20_8%_48%)]" />
            <span className="text-xs text-[hsl(20_8%_48%)]">
              <span className="font-semibold text-[hsl(20_10%_20%)]">{totalStakeholders}</span>{' '}
              stakeholders
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-md border border-[hsl(30_18%_82%)] bg-white px-3 py-2">
            <NotebookPen className="h-3.5 w-3.5 text-[hsl(20_8%_48%)]" />
            <span className="text-xs text-[hsl(20_8%_48%)]">
              <span className="font-semibold text-[hsl(20_10%_20%)]">{totalEngagementEvents}</span>{' '}
              engagement events
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-md border border-[hsl(30_18%_82%)] bg-white px-3 py-2">
            <MapPin className="h-3.5 w-3.5 text-[hsl(20_8%_48%)]" />
            <span className="text-xs text-[hsl(20_8%_48%)]">
              <span className="font-semibold text-[hsl(20_10%_20%)]">{placesCovered}</span>{' '}
              places covered
            </span>
          </div>
        </div>

        {/* ── Recent engagement feed ── */}
        <section className="mb-10">
          <SectionHeader icon={NotebookPen} label="Recent Engagement" />
          {sortedFieldNotes.length === 0 && (
            <p className="text-sm text-[hsl(20_8%_52%)] italic">No engagement events recorded yet.</p>
          )}
          <div className="flex flex-col gap-2">
            {sortedFieldNotes.slice(0, 8).map((fn) => (
              <div
                key={fn.id}
                className="rounded-lg bg-white px-4 py-3 border border-[hsl(30_18%_82%)] hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-flex items-center rounded-full bg-[hsl(30_20%_92%)] px-2 py-0.5 text-[10px] font-medium text-[hsl(20_10%_40%)]">
                        {FIELD_NOTE_TYPE_LABELS[fn.note_type]}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] text-[hsl(20_8%_52%)]">
                        <MapPin className="h-2.5 w-2.5" />
                        {placeNameById(fn.place_id).length > 28
                          ? placeNameById(fn.place_id).slice(0, 28) + '\u2026'
                          : placeNameById(fn.place_id)}
                      </span>
                    </div>
                    <p className="text-sm text-[hsl(20_10%_25%)] line-clamp-2 leading-relaxed">
                      {fn.content}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-xs font-medium text-[hsl(20_10%_35%)]">
                      {stakeholderNameById(fn.author_id)}
                    </p>
                    <p className="text-[10px] text-[hsl(20_8%_52%)]">{formatDate(fn.created_at)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Two-column breakdowns ── */}
        <div className="grid gap-8 sm:grid-cols-2 mb-10">
          {/* Participation by place */}
          <section>
            <SectionHeader icon={MapPin} label="Participation by Place" />
            {byPlace.length === 0 && (
              <p className="text-sm text-[hsl(20_8%_52%)] italic">No data yet.</p>
            )}
            <div className="flex flex-col gap-2">
              {byPlace.map((item) => (
                <div
                  key={item.placeId}
                  className="rounded-lg bg-white px-4 py-3 border border-[hsl(30_18%_82%)]"
                >
                  <p className="text-sm font-medium text-[hsl(20_10%_20%)]">{item.placeName}</p>
                  <div className="mt-1 flex items-center gap-3 text-xs text-[hsl(20_8%_48%)]">
                    <span>
                      <span className="font-semibold text-[hsl(20_10%_20%)]">{item.noteCount}</span>{' '}
                      field {item.noteCount === 1 ? 'note' : 'notes'}
                    </span>
                    <span>
                      <span className="font-semibold text-[hsl(20_10%_20%)]">{item.uniqueStakeholders}</span>{' '}
                      {item.uniqueStakeholders === 1 ? 'participant' : 'participants'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Participation by role */}
          <section>
            <SectionHeader icon={Users} label="Participation by Role" />
            {byRole.length === 0 && (
              <p className="text-sm text-[hsl(20_8%_52%)] italic">No data yet.</p>
            )}
            <div className="flex flex-col gap-2">
              {byRole.map((item) => (
                <div
                  key={item.role}
                  className="flex items-center justify-between rounded-lg bg-white px-4 py-3 border border-[hsl(30_18%_82%)]"
                >
                  <span className="text-sm font-medium text-[hsl(20_10%_20%)]">{item.label}</span>
                  <span className="text-xs font-semibold text-[hsl(16_65%_48%)]">{item.count}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ── Quiet voices ── */}
        <section className="mb-10">
          <SectionHeader icon={Heart} label="Quiet Voices" />
          <p className="text-xs text-[hsl(20_8%_48%)] mb-3 -mt-2">
            Stakeholders at the 'new' or 'building' trust level — relationships that need nurturing.
          </p>

          {quietVoices.length === 0 && (
            <p className="text-sm text-[hsl(20_8%_52%)] italic">
              All stakeholders have established or deep relationships.
            </p>
          )}

          <div className="flex flex-col gap-2">
            {quietVoices.map((s) => {
              const days = s.last_contact ? daysAgo(s.last_contact) : null;
              return (
                <div
                  key={s.id}
                  className="flex items-center justify-between gap-3 rounded-lg bg-white px-4 py-3 border border-[hsl(30_18%_82%)] hover:shadow-sm transition-shadow"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[hsl(20_10%_20%)]">{s.name}</p>
                    <p className="text-xs text-[hsl(20_8%_48%)]">
                      {ROLE_LABELS[s.role]}
                      {s.title ? ` \u00b7 ${s.title}` : ''}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {s.place_ids.map((pid) => (
                        <span
                          key={pid}
                          className="inline-flex items-center gap-1 text-[10px] text-[hsl(20_8%_52%)]"
                        >
                          <MapPin className="h-2.5 w-2.5" />
                          {placeNameById(pid).length > 22
                            ? placeNameById(pid).slice(0, 22) + '\u2026'
                            : placeNameById(pid)}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        s.trust_level === 'new'
                          ? 'bg-[hsl(38_80%_90%)] text-[hsl(38_80%_35%)]'
                          : 'bg-[hsl(205_70%_93%)] text-[hsl(205_70%_35%)]'
                      }`}
                    >
                      {s.trust_level === 'new' ? 'New' : 'Building'}
                    </span>
                    {days !== null && (
                      <p className="mt-1 flex items-center justify-end gap-1 text-xs text-[hsl(16_50%_48%)]">
                        <AlertTriangle className="h-3 w-3" />
                        {days}d ago
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
