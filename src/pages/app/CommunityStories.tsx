/**
 * CommunityStories -- A page centering the human dimension.
 *
 * Stories grouped by place. Each rendered with editorial dignity --
 * like a National Geographic field report, not a database entry.
 */

import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { slugify, placeSlug } from '@/lib/slugify';
import { Heart, MapPin, Clock, Shield, User, Plus, Quote } from 'lucide-react';
import { useTransitusData } from '@/contexts/TransitusDataContext';
import { CreateCommunityStoryForm } from '@/components/forms/CreateCommunityStoryForm';
import type { CommunityStory } from '@/types/transitus';

// ── Helpers ──

const CONSENT_LABELS: Record<string, string> = {
  local_only: 'Local Only',
  trusted_allies: 'Trusted Allies',
  institutional: 'Institutional',
  public: 'Public',
};

const CONSENT_COLORS: Record<string, string> = {
  local_only: 'bg-[hsl(30_25%_90%)] text-[hsl(30_30%_35%)]',
  trusted_allies: 'bg-[hsl(210_25%_90%)] text-[hsl(210_30%_35%)]',
  institutional: 'bg-[hsl(270_20%_92%)] text-[hsl(270_25%_35%)]',
  public: 'bg-[hsl(152_25%_90%)] text-[hsl(152_35%_28%)]',
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

// ── Story Card ──

function StoryCard({
  story,
  collectorName,
}: {
  story: CommunityStory;
  collectorName: string;
}) {
  return (
    <article className="rounded-lg bg-white border border-[hsl(30_18%_82%)] p-6 space-y-4">
      {/* Person name and location */}
      <div className="space-y-1.5">
        <h3 className="font-serif text-xl font-semibold text-[hsl(20_28%_15%)]">
          {story.stakeholder_id ? (
            <Link to={`/app/people/${slugify(story.person_name)}`} className="hover:text-[hsl(16_65%_48%)] transition-colors underline decoration-[hsl(16_65%_48%/0.3)] underline-offset-2">
              {story.person_name}
            </Link>
          ) : (
            story.person_name
          )}
        </h3>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[hsl(20_10%_42%)]">
          {story.location_detail && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {story.location_detail}
            </span>
          )}
          {story.years_in_community && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {story.years_in_community} years in community
            </span>
          )}
        </div>
      </div>

      {/* Story text */}
      <p className="font-serif text-[15px] leading-[1.85] text-[hsl(20_15%_22%)]">
        {story.story}
      </p>

      {/* Direct quote */}
      {story.quote && (
        <div className="relative pl-8 py-3 border-l-3 border-l-[hsl(16_55%_65%)]" style={{ borderLeftWidth: '3px' }}>
          <span
            className="absolute left-1 -top-1 font-serif text-5xl leading-none text-[hsl(16_50%_75%)] select-none"
            aria-hidden="true"
          >
            {'\u201C'}
          </span>
          <blockquote className="font-serif text-lg italic leading-relaxed text-[hsl(20_25%_18%)]">
            {story.quote}
          </blockquote>
        </div>
      )}

      {/* Health impacts */}
      {story.health_impacts && story.health_impacts.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[hsl(20_10%_50%)]">
            Health impacts
          </p>
          <div className="flex flex-wrap gap-1.5">
            {story.health_impacts.map((impact) => (
              <span
                key={impact}
                className="inline-flex items-center rounded-full bg-[hsl(0_18%_94%)] px-2.5 py-0.5 text-[11px] font-medium text-[hsl(0_30%_42%)]"
              >
                {impact.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Family context */}
      {story.family_context && (
        <p className="text-sm text-[hsl(20_10%_38%)] italic">
          {story.family_context}
        </p>
      )}

      {/* Footer */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[hsl(30_18%_88%)]">
        <div className="flex items-center gap-3">
          {/* Consent badge */}
          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-medium ${CONSENT_COLORS[story.consent_level]}`}>
            <Shield className="h-2.5 w-2.5" />
            {CONSENT_LABELS[story.consent_level]}
          </span>

          {/* Tags */}
          {story.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full bg-[hsl(38_30%_92%)] px-2 py-0.5 text-[10px] font-medium text-[hsl(20_15%_40%)]"
            >
              {tag.replace(/_/g, ' ')}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-1.5 text-[10px] text-[hsl(20_8%_52%)]">
          <User className="h-3 w-3" />
          <span>Collected by {collectorName}</span>
          <span className="text-[hsl(30_18%_82%)]">|</span>
          <span>{formatDate(story.collected_at)}</span>
        </div>
      </div>
    </article>
  );
}

// ── Main Page ──

export default function CommunityStories() {
  const { communityStories, stakeholders, places } = useTransitusData();

  const getCollectorName = (id: string): string => {
    const s = stakeholders.find((st) => st.id === id);
    return s ? s.name : 'Field Agent';
  };

  const getPlaceName = (placeId: string): string => {
    const p = places.find((pl) => pl.id === placeId);
    return p ? p.name : placeId;
  };

  // Group stories by place
  const groupedStories = useMemo(() => {
    const groups: Record<string, CommunityStory[]> = {};
    communityStories.forEach((story) => {
      if (!groups[story.place_id]) groups[story.place_id] = [];
      groups[story.place_id].push(story);
    });
    // Sort within each group by collected_at (newest first)
    Object.values(groups).forEach((arr) =>
      arr.sort((a, b) => new Date(b.collected_at).getTime() - new Date(a.collected_at).getTime())
    );
    return groups;
  }, [communityStories]);

  const placeIds = Object.keys(groupedStories);

  return (
    <div className="min-h-screen bg-[hsl(38_30%_95%)]">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-[hsl(16_65%_48%)]" />
            <span className="font-sans text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
              Community Stories
            </span>
          </div>
          <CreateCommunityStoryForm
            trigger={
              <button className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-[hsl(16_65%_48%)] px-4 py-2 text-sm font-medium text-white hover:bg-[hsl(12_55%_35%)] transition-colors">
                <Plus className="h-4 w-4" />
                Record a Story
              </button>
            }
          />
        </div>
        <h1 className="font-serif text-3xl tracking-tight text-[hsl(20_28%_15%)] mb-2">
          Community Stories
        </h1>
        <p className="text-sm leading-relaxed text-[hsl(30_10%_40%)] max-w-2xl mb-6">
          The people at the heart of every place.
        </p>

        {/* Epigraph */}
        <div className="mb-10 pl-5 border-l-2 border-[hsl(16_45%_70%)]">
          <blockquote className="font-serif text-base italic leading-relaxed text-[hsl(20_15%_30%)]">
            "The people breathing the worst air are the ones with the least political power
            and the fewest resources to move."
          </blockquote>
        </div>

        {/* Stories grouped by place */}
        {placeIds.map((placeId) => {
          const stories = groupedStories[placeId];
          const placeName = getPlaceName(placeId);

          return (
            <div key={placeId} className="mb-10">
              {/* Place header */}
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-4 w-4 text-[hsl(152_40%_30%)]" />
                <Link
                  to={`/app/places/${placeSlug(places, placeId)}`}
                  className="font-serif text-lg font-semibold text-[hsl(20_25%_18%)] hover:text-[hsl(16_65%_48%)] transition-colors"
                >
                  {placeName}
                </Link>
                <span className="text-xs text-[hsl(20_10%_52%)]">
                  {stories.length} {stories.length === 1 ? 'story' : 'stories'}
                </span>
              </div>

              {/* Story cards */}
              <div className="space-y-5">
                {stories.map((story) => (
                  <StoryCard
                    key={story.id}
                    story={story}
                    collectorName={getCollectorName(story.collected_by)}
                  />
                ))}
              </div>
            </div>
          );
        })}

        {communityStories.length === 0 && (
          <div className="text-center py-16 space-y-4">
            <Quote className="h-12 w-12 text-[hsl(30_18%_82%)] mx-auto" />
            <p className="font-serif text-lg text-[hsl(20_10%_42%)]">
              No stories have been recorded yet.
            </p>
            <p className="text-sm text-[hsl(20_10%_52%)]">
              Go into the field. Listen. Then come back and record what you heard.
            </p>
          </div>
        )}
      </div>

      {/* Mobile FAB */}
      <CreateCommunityStoryForm
        trigger={
          <button className="sm:hidden fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[hsl(16_65%_48%)] text-white shadow-lg hover:bg-[hsl(12_55%_35%)] transition-colors">
            <Plus className="h-6 w-6" />
          </button>
        }
      />
    </div>
  );
}
