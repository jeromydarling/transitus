/**
 * HumanImpactBanner -- Full-width banner for Place detail pages showing
 * the human cost. Not alarm-red -- more like a field journal entry about
 * what you witnessed. Warm but urgent.
 */

import { Users, Activity, TrendingUp } from 'lucide-react';
import type { Place } from '@/types/transitus';

interface HumanImpactBannerProps {
  place: Place;
}

const DISPLACEMENT_LABELS: Record<string, { label: string; className: string }> = {
  low: { label: 'Low displacement pressure', className: 'bg-[hsl(152_30%_92%)] text-[hsl(152_40%_28%)]' },
  moderate: { label: 'Moderate displacement pressure', className: 'bg-[hsl(38_40%_90%)] text-[hsl(30_40%_30%)]' },
  high: { label: 'High displacement pressure', className: 'bg-[hsl(16_45%_90%)] text-[hsl(16_55%_32%)]' },
  critical: { label: 'Critical displacement pressure', className: 'bg-[hsl(0_35%_90%)] text-[hsl(0_45%_30%)]' },
};

const POPULATION_LABEL_MAP: Record<string, string> = {
  children_under_12: 'Children under 12',
  elderly_over_65: 'Elderly over 65',
  renters: 'Renters',
  limited_english_speakers: 'Limited English speakers',
  uninsured: 'Uninsured',
  immigrant_families: 'Immigrant families',
  coastal_zone_residents: 'Coastal zone residents',
  children_with_respiratory_illness: 'Children w/ respiratory illness',
  elderly_long_term_residents: 'Elderly long-term residents',
  undocumented_families: 'Undocumented families',
  workers_in_informal_economy: 'Informal economy workers',
};

export function HumanImpactBanner({ place }: HumanImpactBannerProps) {
  const hasContent = place.human_impact_summary || place.population_estimate || place.health_snapshot || place.displacement_pressure;

  if (!hasContent) return null;

  return (
    <div className="w-full rounded-lg bg-[hsl(38_30%_96%)] border border-[hsl(30_18%_82%)] border-l-4 border-l-[hsl(16_55%_45%)] p-5 space-y-4">
      {/* Human impact summary */}
      {place.human_impact_summary && (
        <p className="font-serif text-base leading-[1.75] text-[hsl(20_25%_15%)]">
          {place.human_impact_summary}
        </p>
      )}

      {/* Stats row */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Population */}
        {place.population_estimate && (
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-[hsl(16_55%_45%)]" />
            <span className="font-serif text-2xl font-bold text-[hsl(20_28%_15%)]">
              {place.population_estimate.toLocaleString('en-US')}
            </span>
            <span className="text-xs text-[hsl(20_10%_42%)]">residents</span>
          </div>
        )}

        {/* Displacement pressure */}
        {place.displacement_pressure && (
          <div className="flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-[hsl(16_55%_45%)]" />
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${DISPLACEMENT_LABELS[place.displacement_pressure].className}`}
            >
              {DISPLACEMENT_LABELS[place.displacement_pressure].label}
            </span>
          </div>
        )}
      </div>

      {/* Health snapshot */}
      {place.health_snapshot && (
        <div className="flex gap-2.5 rounded-md bg-[hsl(0_18%_96%)] border border-[hsl(0_12%_90%)] p-3">
          <Activity className="h-4 w-4 text-[hsl(0_35%_50%)] mt-0.5 shrink-0" />
          <p className="text-xs leading-relaxed text-[hsl(0_12%_30%)]">
            {place.health_snapshot}
          </p>
        </div>
      )}

      {/* Most affected populations */}
      {place.most_affected_populations && place.most_affected_populations.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {place.most_affected_populations.map((pop) => (
            <span
              key={pop}
              className="inline-flex items-center rounded-full bg-[hsl(16_50%_92%)] px-2.5 py-0.5 text-[11px] font-medium text-[hsl(16_55%_35%)]"
            >
              {POPULATION_LABEL_MAP[pop] || pop.replace(/_/g, ' ')}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default HumanImpactBanner;
