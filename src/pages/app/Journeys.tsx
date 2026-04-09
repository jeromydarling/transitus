/**
 * Journeys — card list view
 *
 * Each Journey is the long-arc narrative of a place's transition.
 * Cards show title, journey type, place, description, chapter count,
 * and a horizontal chapter timeline.
 */

import { Link } from 'react-router-dom';
import { BookOpen, MapPin } from 'lucide-react';

import { MOCK_JOURNEYS, MOCK_PLACES } from '@/lib/mockData';
import { CHAPTER_TYPE_LABELS } from '@/types/transitus';
import type { Journey, JourneyType, ChapterType } from '@/types/transitus';

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

const CHAPTER_COLORS: Record<ChapterType, string> = {
  recognition: 'bg-amber-400',
  listening: 'bg-sky-500',
  coalition_building: 'bg-emerald-700',
  negotiation: 'bg-[hsl(16_65%_48%)]',
  transition: 'bg-green-500',
  repair: 'bg-purple-500',
  stewardship: 'bg-emerald-500',
};

const CHAPTER_DOT_RING: Record<ChapterType, string> = {
  recognition: 'ring-amber-200',
  listening: 'ring-sky-200',
  coalition_building: 'ring-emerald-200',
  negotiation: 'ring-orange-200',
  transition: 'ring-green-200',
  repair: 'ring-purple-200',
  stewardship: 'ring-emerald-200',
};

function placeName(placeId: string): string {
  const p = MOCK_PLACES.find((pl) => pl.id === placeId);
  return p ? p.name : placeId;
}

// ── Components ──

function ChapterTimeline({ journey }: { journey: Journey }) {
  return (
    <div className="flex items-center gap-0">
      {journey.chapters.map((ch, idx) => (
        <div key={ch.id} className="flex items-center">
          {/* Connecting line (before dot, except first) */}
          {idx > 0 && (
            <div className="h-px w-6 bg-[hsl(30_18%_82%)]" />
          )}
          {/* Dot + label */}
          <div className="flex flex-col items-center gap-1">
            <div
              className={`h-3 w-3 rounded-full ${CHAPTER_COLORS[ch.chapter_type]} ring-2 ${CHAPTER_DOT_RING[ch.chapter_type]}`}
              title={ch.title}
            />
            <span className="text-[9px] leading-tight text-[hsl(20_8%_50%)] text-center max-w-[64px] truncate">
              {CHAPTER_TYPE_LABELS[ch.chapter_type]}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function JourneyCard({ journey }: { journey: Journey }) {
  return (
    <Link
      to={`/app/journeys/${journey.id}`}
      className="block rounded-lg bg-white p-4 border border-[hsl(30_18%_82%)] hover:border-[hsl(30_18%_70%)] hover:shadow-md transition-all group"
    >
      {/* Journey type badge */}
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <span className="inline-flex items-center rounded-full bg-[hsl(30_20%_92%)] px-2 py-0.5 text-[10px] font-medium text-[hsl(20_10%_40%)]">
          {JOURNEY_TYPE_LABELS[journey.journey_type]}
        </span>
        <span className="flex items-center gap-1 text-[10px] text-[hsl(20_8%_52%)]">
          <MapPin className="h-2.5 w-2.5" />
          {placeName(journey.place_id)}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-serif text-xl leading-snug tracking-tight text-[hsl(20_28%_15%)] group-hover:text-[hsl(16_65%_48%)] transition-colors mb-2">
        {journey.title}
      </h3>

      {/* Description */}
      <p className="text-sm leading-relaxed text-[hsl(20_10%_35%)] line-clamp-2 mb-4">
        {journey.description}
      </p>

      {/* Chapter count */}
      <p className="text-[10px] font-semibold uppercase tracking-widest text-[hsl(30_10%_55%)] mb-2">
        {journey.chapters.length} Chapter{journey.chapters.length !== 1 ? 's' : ''}
      </p>

      {/* Chapter timeline */}
      <ChapterTimeline journey={journey} />
    </Link>
  );
}

// ── Main page ──

export default function Journeys() {
  const sorted = [...MOCK_JOURNEYS].sort(
    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
  );

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
        <h1 className="font-serif text-3xl tracking-tight text-[hsl(20_28%_15%)] mb-2">
          Journeys
        </h1>
        <p className="text-sm leading-relaxed text-[hsl(30_10%_40%)] max-w-2xl mb-8">
          Long-arc narratives of transition — from recognition through repair
          and stewardship. Each journey tells the unfolding story of a place
          and its people.
        </p>

        {/* Journey cards */}
        <div className="flex flex-col gap-4">
          {sorted.map((journey) => (
            <JourneyCard key={journey.id} journey={journey} />
          ))}
          {sorted.length === 0 && (
            <p className="text-sm text-[hsl(20_8%_52%)] italic">
              No journeys recorded yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
