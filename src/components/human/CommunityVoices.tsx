/**
 * CommunityVoices -- Elevated testimony/quote component that surfaces
 * community stories. Designed for dignity: large pull-quote styling,
 * consent-aware display, earth tones throughout.
 */

import { Shield, MapPin, Clock, User } from 'lucide-react';
import { useTransitusData } from '@/contexts/TransitusDataContext';

interface CommunityVoicesProps {
  placeId: string;
  limit?: number;
}

const CONSENT_LABELS: Record<string, string> = {
  local_only: 'Local Only',
  trusted_allies: 'Trusted Allies',
  institutional: 'Institutional',
  public: 'Public',
};

const CONSENT_DISPLAY_THRESHOLD = ['public', 'institutional', 'trusted_allies'];

export function CommunityVoices({ placeId, limit }: CommunityVoicesProps) {
  const { communityStories, stakeholders } = useTransitusData();

  // Only show stories with appropriate consent levels
  const stories = communityStories
    .filter((s) => s.place_id === placeId && CONSENT_DISPLAY_THRESHOLD.includes(s.consent_level))
    .slice(0, limit);

  const getCollectorName = (id: string): string => {
    const s = stakeholders.find((st) => st.id === id);
    return s ? s.name : 'Field Agent';
  };

  if (stories.length === 0) {
    return null;
  }

  return (
    <div className="space-y-5">
      {/* Section header */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
          Community Voices
        </span>
      </div>

      {stories.map((story) => (
        <div
          key={story.id}
          className="rounded-lg bg-[hsl(38_35%_97%)] border border-[hsl(30_18%_82%)] p-5 space-y-4"
        >
          {/* Pull quote */}
          {story.quote && (
            <div className="relative pl-6">
              {/* Oversized quotation mark */}
              <span
                className="absolute left-0 -top-2 font-serif text-5xl leading-none text-[hsl(16_55%_70%)] select-none"
                aria-hidden="true"
              >
                {'\u201C'}
              </span>
              <blockquote className="font-serif text-lg italic leading-relaxed text-[hsl(20_25%_15%)]">
                {story.quote}
              </blockquote>
            </div>
          )}

          {/* Person info */}
          <div className="space-y-1">
            <p className="font-serif text-base font-semibold text-[hsl(20_28%_15%)]">
              {story.person_name}
            </p>

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

            {story.family_context && (
              <p className="text-xs text-[hsl(20_10%_42%)] italic">
                {story.family_context}
              </p>
            )}
          </div>

          {/* Health impacts */}
          {story.health_impacts && story.health_impacts.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {story.health_impacts.map((impact) => (
                <span
                  key={impact}
                  className="inline-flex items-center rounded-full bg-[hsl(0_18%_94%)] px-2 py-0.5 text-[10px] font-medium text-[hsl(0_30%_42%)]"
                >
                  {impact.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          )}

          {/* Footer: consent + collector */}
          <div className="flex items-center justify-between pt-2 border-t border-[hsl(30_18%_88%)]">
            <span className="flex items-center gap-1 text-[10px] text-[hsl(20_8%_52%)]">
              <Shield className="h-3 w-3" />
              {CONSENT_LABELS[story.consent_level]}
            </span>
            <span className="flex items-center gap-1 text-[10px] text-[hsl(20_8%_52%)]">
              <User className="h-3 w-3" />
              Collected by {getCollectorName(story.collected_by)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CommunityVoices;
