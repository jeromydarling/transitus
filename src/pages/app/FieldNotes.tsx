/**
 * Field Notes — feed view
 *
 * Vertical timeline-like layout of field notes captured across all tracked places.
 * Filterable by tag and place.
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { slugify, placeSlug } from '@/lib/slugify';
import { NotebookPen, MapPin, User, Shield, Plus } from 'lucide-react';

import { useTransitusData } from '@/contexts/TransitusDataContext';
import { CreateFieldNoteForm } from '@/components/forms/CreateFieldNoteForm';
import { FIELD_NOTE_TAG_LABELS } from '@/types/transitus';
import type { FieldNote, FieldNoteTag, FieldNoteType } from '@/types/transitus';

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

const TAG_COLORS: Record<FieldNoteTag, string> = {
  air: 'bg-sky-100 text-sky-700',
  water: 'bg-blue-100 text-blue-700',
  labor: 'bg-amber-100 text-amber-700',
  health: 'bg-rose-100 text-rose-700',
  housing: 'bg-orange-100 text-orange-700',
  energy: 'bg-yellow-100 text-yellow-700',
  food: 'bg-lime-100 text-lime-700',
  land_use: 'bg-emerald-100 text-emerald-700',
  permitting: 'bg-slate-100 text-slate-700',
  safety: 'bg-red-100 text-red-700',
  faith: 'bg-violet-100 text-violet-700',
  culture: 'bg-fuchsia-100 text-fuchsia-700',
  displacement: 'bg-pink-100 text-pink-700',
  jobs: 'bg-teal-100 text-teal-700',
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const CONSENT_LABELS: Record<string, string> = {
  local_only: 'Local Only',
  trusted_allies: 'Trusted Allies',
  institutional: 'Institutional',
  public: 'Public',
};

// ── Components ──

function TagPill({
  tag,
  active,
  onClick,
}: {
  tag: FieldNoteTag;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-all ${
        active
          ? TAG_COLORS[tag] + ' ring-2 ring-offset-1 ring-[hsl(16_65%_48%)]'
          : TAG_COLORS[tag] + ' opacity-70 hover:opacity-100'
      }`}
    >
      {FIELD_NOTE_TAG_LABELS[tag]}
    </button>
  );
}

function FieldNoteCard({ note, authorName, placeName }: { note: FieldNote; authorName: string; placeName: string }) {
  const excerpt = note.content.length > 200 ? note.content.slice(0, 200) + '...' : note.content;

  return (
    <div className="relative flex gap-4">
      {/* Timeline spine */}
      <div className="flex flex-col items-center">
        <div className="mt-1 h-3 w-3 rounded-full border-2 border-[hsl(16_65%_48%)] bg-white" />
        <div className="flex-1 w-px bg-[hsl(30_18%_82%)]" />
      </div>

      {/* Card */}
      <div className="mb-6 flex-1 rounded-lg bg-white p-4 border border-[hsl(30_18%_82%)]">
        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="inline-flex items-center rounded-full bg-[hsl(30_20%_92%)] px-2 py-0.5 text-[10px] font-medium text-[hsl(20_10%_40%)]">
            {FIELD_NOTE_TYPE_LABELS[note.note_type]}
          </span>
          {note.is_testimony && (
            <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 text-violet-700 px-2 py-0.5 text-[10px] font-medium">
              <Shield className="h-2.5 w-2.5" />
              Testimony
              {note.consent_level && (
                <span className="ml-0.5 text-[9px] opacity-75">
                  ({CONSENT_LABELS[note.consent_level]})
                </span>
              )}
            </span>
          )}
          <span className="text-[10px] text-[hsl(20_8%_52%)]">
            {formatDate(note.created_at)}
          </span>
        </div>

        {/* Author and place */}
        <div className="flex flex-wrap items-center gap-3 mb-3 text-xs text-[hsl(20_8%_42%)]">
          <span className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {authorName}
          </span>
          <Link
            to={`/app/places/${placeSlug(places, note.place_id)}`}
            className="flex items-center gap-1 hover:text-[hsl(16_65%_48%)] transition-colors"
          >
            <MapPin className="h-3 w-3" />
            {placeName}
          </Link>
        </div>

        {/* Content excerpt */}
        <p className="text-sm leading-relaxed text-[hsl(20_10%_25%)] mb-3">{excerpt}</p>

        {/* Tags */}
        {note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {note.tags.map((tag) => (
              <span
                key={tag}
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${TAG_COLORS[tag]}`}
              >
                {FIELD_NOTE_TAG_LABELS[tag]}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main page ──

export default function FieldNotes() {
  const { fieldNotes, canCreate, stakeholders, places } = useTransitusData();
  const [activeTag, setActiveTag] = useState<FieldNoteTag | null>(null);
  const [activePlaceId, setActivePlaceId] = useState<string | null>(null);

  const getAuthorName = (authorId: string): string => {
    const s = stakeholders.find((st) => st.id === authorId);
    return s ? s.name : authorId;
  };

  const getPlaceName = (placeId: string): string => {
    const p = places.find((pl) => pl.id === placeId);
    return p ? p.name : placeId;
  };

  const allTags = Array.from(
    new Set(fieldNotes.flatMap((n) => n.tags)),
  ) as FieldNoteTag[];

  const usedPlaces = Array.from(
    new Set(fieldNotes.map((n) => n.place_id)),
  );

  const filtered = fieldNotes.filter((n) => {
    if (activeTag && !n.tags.includes(activeTag)) return false;
    if (activePlaceId && n.place_id !== activePlaceId) return false;
    return true;
  }).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  return (
    <div className="min-h-screen bg-[hsl(38_30%_95%)]">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <NotebookPen className="h-4 w-4 text-[hsl(16_65%_48%)]" />
            <span className="font-sans text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
              Field Notes
            </span>
          </div>
          <CreateFieldNoteForm
            trigger={
              <button className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-[hsl(16_65%_48%)] px-4 py-2 text-sm font-medium text-white hover:bg-[hsl(12_55%_35%)] transition-colors">
                <Plus className="h-4 w-4" />
                New Field Note
              </button>
            }
          />
        </div>
        <h1 className="font-serif text-3xl tracking-tight text-[hsl(20_28%_15%)] mb-2">
          Field Notes
        </h1>
        <p className="text-sm leading-relaxed text-[hsl(30_10%_40%)] max-w-2xl mb-6">
          Observations, conversations, and testimonies gathered in the field.
          Each note is a thread in the story of transition.
        </p>

        {/* Filters: place */}
        <div className="mb-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[hsl(30_10%_55%)] mb-2">
            Filter by place
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActivePlaceId(null)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all border ${
                activePlaceId === null
                  ? 'border-[hsl(16_65%_48%)] bg-[hsl(16_65%_48%)] text-white'
                  : 'border-[hsl(30_18%_82%)] bg-white text-[hsl(20_10%_40%)] hover:border-[hsl(16_65%_48%)]'
              }`}
            >
              All places
            </button>
            {usedPlaces.map((pid) => (
              <button
                key={pid}
                type="button"
                onClick={() => setActivePlaceId(activePlaceId === pid ? null : pid)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all border ${
                  activePlaceId === pid
                    ? 'border-[hsl(16_65%_48%)] bg-[hsl(16_65%_48%)] text-white'
                    : 'border-[hsl(30_18%_82%)] bg-white text-[hsl(20_10%_40%)] hover:border-[hsl(16_65%_48%)]'
                }`}
              >
                {getPlaceName(pid)}
              </button>
            ))}
          </div>
        </div>

        {/* Filters: tags */}
        <div className="mb-8">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[hsl(30_10%_55%)] mb-2">
            Filter by tag
          </p>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <TagPill
                key={tag}
                tag={tag}
                active={activeTag === tag}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              />
            ))}
          </div>
        </div>

        {/* Feed */}
        <div>
          {filtered.map((note) => (
            <FieldNoteCard key={note.id} note={note} authorName={getAuthorName(note.author_id)} placeName={getPlaceName(note.place_id)} />
          ))}
          {filtered.length === 0 && (
            <p className="text-sm text-[hsl(20_8%_52%)] italic">
              No field notes match the current filters.
            </p>
          )}
        </div>
      </div>

      {/* Mobile FAB */}
      <CreateFieldNoteForm
        trigger={
          <button className="sm:hidden fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[hsl(16_65%_48%)] text-white shadow-lg hover:bg-[hsl(12_55%_35%)] transition-colors">
            <Plus className="h-6 w-6" />
          </button>
        }
      />
    </div>
  );
}
