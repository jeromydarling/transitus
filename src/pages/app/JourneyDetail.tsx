/**
 * Journey Detail — single journey view
 *
 * Shows the full narrative arc of a transition journey: title, type, place,
 * description, tensions, open questions, and a vertical chapter timeline.
 */

import { useParams, Link } from 'react-router-dom';
import { slugify, placeSlug } from '@/lib/slugify';
import { BookOpen, MapPin, AlertTriangle, HelpCircle } from 'lucide-react';

import { useTransitusData } from '@/contexts/TransitusDataContext';
import { CHAPTER_TYPE_LABELS } from '@/types/transitus';
import type { JourneyType, ChapterType, JourneyChapter } from '@/types/transitus';

// ── Helpers ──

const JOURNEY_TYPE_LABELS: Record<JourneyType, string> = {
  plant_closure: 'Plant Closure',
  utility_decarbonization: 'Utility Decarbonization',
  brownfield_redevelopment: 'Brownfield Redevelopment',
  parish_land_discernment: 'Parish Land Discernment',
  community_solar: 'Community Solar',
  neighborhood_resilience: 'Neighborhood Resilience',
  logistics_corridor: 'Logistics Corridor',
  investment_engagement: 'Investment Engagement',
  food_sovereignty: 'Food Sovereignty',
  housing_transition: 'Housing Transition',
};

const CHAPTER_TYPE_COLORS: Record<ChapterType, string> = {
  recognition: 'bg-amber-100 text-amber-800 border-amber-300',
  listening: 'bg-sky-100 text-sky-800 border-sky-300',
  coalition_building: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  negotiation: 'bg-orange-100 text-orange-800 border-orange-300',
  transition: 'bg-green-100 text-green-800 border-green-300',
  repair: 'bg-purple-100 text-purple-800 border-purple-300',
  stewardship: 'bg-emerald-100 text-emerald-800 border-emerald-300',
};

const CHAPTER_TIMELINE_DOT: Record<ChapterType, string> = {
  recognition: 'bg-amber-400 ring-amber-200',
  listening: 'bg-sky-500 ring-sky-200',
  coalition_building: 'bg-emerald-700 ring-emerald-200',
  negotiation: 'bg-[hsl(16_65%_48%)] ring-orange-200',
  transition: 'bg-green-500 ring-green-200',
  repair: 'bg-purple-500 ring-purple-200',
  stewardship: 'bg-emerald-500 ring-emerald-200',
};

// placeName is resolved from context in the main component

// ── Components ──

function ChapterCard({ chapter }: { chapter: JourneyChapter }) {
  const linkedTotal =
    chapter.linked_note_ids.length +
    chapter.linked_commitment_ids.length +
    chapter.linked_signal_ids.length;

  return (
    <div className="rounded-lg bg-white p-4 border border-[hsl(30_18%_82%)]">
      {/* Badge row */}
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <span
          className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${CHAPTER_TYPE_COLORS[chapter.chapter_type]}`}
        >
          {CHAPTER_TYPE_LABELS[chapter.chapter_type]}
        </span>
        <span className="text-[10px] text-[hsl(20_8%_52%)]">
          {chapter.date_range}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold text-[hsl(20_10%_20%)] mb-2">
        {chapter.title}
      </h3>

      {/* Narrative */}
      <p className="text-sm leading-relaxed text-[hsl(20_10%_35%)] mb-3">
        {chapter.narrative}
      </p>

      {/* What changed */}
      {chapter.what_changed && (
        <div className="rounded-md bg-[hsl(38_30%_95%)] border border-[hsl(30_18%_82%)] p-3 mb-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[hsl(30_10%_55%)] mb-1">
            What Changed
          </p>
          <p className="text-xs leading-relaxed text-[hsl(20_10%_35%)]">
            {chapter.what_changed}
          </p>
        </div>
      )}

      {/* Linked artifact counts */}
      {linkedTotal > 0 && (
        <div className="flex flex-wrap gap-3 text-[10px] text-[hsl(20_8%_52%)]">
          {chapter.linked_note_ids.length > 0 && (
            <span>{chapter.linked_note_ids.length} note{chapter.linked_note_ids.length !== 1 ? 's' : ''}</span>
          )}
          {chapter.linked_commitment_ids.length > 0 && (
            <span>{chapter.linked_commitment_ids.length} commitment{chapter.linked_commitment_ids.length !== 1 ? 's' : ''}</span>
          )}
          {chapter.linked_signal_ids.length > 0 && (
            <span>{chapter.linked_signal_ids.length} signal{chapter.linked_signal_ids.length !== 1 ? 's' : ''}</span>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main page ──

export default function JourneyDetail() {
  const { id } = useParams<{ id: string }>();
  const { journeys, places } = useTransitusData();

  const placeName = (placeId: string): string => {
    const p = places.find((pl) => pl.id === placeId);
    return p ? p.name : placeId;
  };

  const journey = journeys.find((j) => j.id === id);

  if (!journey) {
    return (
      <div className="min-h-screen bg-[hsl(38_30%_95%)] flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-2xl text-[hsl(20_28%_15%)] mb-2">Journey not found</h1>
          <Link
            to="/app/journeys"
            className="text-sm text-[hsl(16_65%_48%)] hover:text-[hsl(16_65%_38%)] transition-colors"
          >
            Back to Journeys
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(38_30%_95%)]">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex items-center gap-2 mb-1">
          <BookOpen className="h-4 w-4 text-[hsl(16_65%_48%)]" />
          <span className="font-sans text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
            Journeys
          </span>
        </div>

        {/* Back link */}
        <Link
          to="/app/journeys"
          className="inline-block text-xs text-[hsl(20_8%_52%)] hover:text-[hsl(16_65%_48%)] transition-colors mb-4"
        >
          &larr; All Journeys
        </Link>

        {/* Journey header */}
        <div className="mb-8">
          {/* Type badge + place */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center rounded-full bg-[hsl(30_20%_92%)] px-2 py-0.5 text-[10px] font-medium text-[hsl(20_10%_40%)]">
              {JOURNEY_TYPE_LABELS[journey.journey_type]}
            </span>
            <Link
              to={`/app/places/${placeSlug(places, journey.place_id)}`}
              className="flex items-center gap-1 text-xs text-[hsl(20_8%_42%)] hover:text-[hsl(16_65%_48%)] transition-colors"
            >
              <MapPin className="h-3 w-3" />
              {placeName(journey.place_id)}
            </Link>
          </div>

          {/* Title */}
          <h1 className="font-serif text-3xl tracking-tight text-[hsl(20_28%_15%)] mb-3">
            {journey.title}
          </h1>

          {/* Description */}
          <p className="text-sm leading-relaxed text-[hsl(20_10%_35%)] max-w-2xl">
            {journey.description}
          </p>
        </div>

        {/* Tensions */}
        {journey.tensions.length > 0 && (
          <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-700">
                Tensions
              </p>
            </div>
            <ul className="space-y-1.5">
              {journey.tensions.map((t, idx) => (
                <li key={idx} className="text-sm leading-relaxed text-amber-900">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Open questions */}
        {journey.open_questions.length > 0 && (
          <div className="mb-8 rounded-lg border border-sky-200 bg-sky-50 p-4">
            <div className="flex items-center gap-2 mb-2">
              <HelpCircle className="h-4 w-4 text-sky-600" />
              <p className="text-xs font-semibold uppercase tracking-widest text-sky-700">
                Open Questions
              </p>
            </div>
            <ul className="space-y-1.5">
              {journey.open_questions.map((q, idx) => (
                <li key={idx} className="text-sm leading-relaxed text-sky-900">
                  {q}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Chapter timeline */}
        <div className="mb-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[hsl(30_10%_55%)] mb-4">
            Chapter Timeline
          </p>
        </div>

        <div>
          {journey.chapters.map((ch, idx) => (
            <div key={ch.id} className="relative flex gap-4">
              {/* Vertical timeline spine */}
              <div className="flex flex-col items-center">
                <div
                  className={`mt-1 h-3.5 w-3.5 rounded-full ring-2 ${CHAPTER_TIMELINE_DOT[ch.chapter_type]}`}
                />
                {idx < journey.chapters.length - 1 && (
                  <div className="flex-1 w-px bg-[hsl(30_18%_82%)]" />
                )}
              </div>

              {/* Chapter card */}
              <div className="mb-6 flex-1">
                <ChapterCard chapter={ch} />
              </div>
            </div>
          ))}
        </div>

        {journey.chapters.length === 0 && (
          <p className="text-sm text-[hsl(20_8%_52%)] italic">
            No chapters have been recorded for this journey yet.
          </p>
        )}
      </div>
    </div>
  );
}
