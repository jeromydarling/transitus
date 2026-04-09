/**
 * CommunityPortrait -- Renders Census/demographic data as editorial prose,
 * not a data table. Designed to center the human dimension of a place.
 *
 * "These aren't statistics. They're your neighbors."
 */

import { Heart, Activity } from 'lucide-react';
import type { Place } from '@/types/transitus';
import type { CensusProfile } from '@/lib/api/census';

interface CommunityPortraitProps {
  place: Place;
  census?: CensusProfile;
}

function formatNumber(n: number): string {
  return n.toLocaleString('en-US');
}

function formatCurrency(n: number): string {
  return '$' + n.toLocaleString('en-US');
}

function buildNarrative(place: Place, census?: CensusProfile): string {
  if (!census) {
    if (place.population_estimate) {
      return `An estimated ${formatNumber(place.population_estimate)} people call this place home. Behind that number are families, workers, elders, and children whose daily lives are shaped by the environmental and economic conditions documented here.`;
    }
    return 'Demographic data is not yet available for this place. The stories told here represent real people whose lives intersect with these environmental and economic conditions.';
  }

  const parts: string[] = [];

  // Population
  parts.push(`${formatNumber(census.total_population)} people live here.`);

  // Race/ethnicity - highlight the largest group
  const demographics: { label: string; pct: number }[] = [
    { label: 'Hispanic/Latino', pct: census.pct_hispanic },
    { label: 'Black', pct: census.pct_black_alone },
    { label: 'white', pct: census.pct_white_alone },
    { label: 'Asian', pct: census.pct_asian_alone },
  ].sort((a, b) => b.pct - a.pct);

  if (demographics[0].pct > 40) {
    parts.push(`${demographics[0].pct}% are ${demographics[0].label}.`);
  }

  // Income
  const natMedian = 75000;
  const ratio = census.median_household_income / natMedian;
  if (ratio < 0.6) {
    parts.push(
      `The median household income is ${formatCurrency(census.median_household_income)} \u2014 roughly ${Math.round(ratio * 100)}% of the national median.`
    );
  } else {
    parts.push(`The median household income is ${formatCurrency(census.median_household_income)}.`);
  }

  // Housing cost burden
  if (census.pct_cost_burdened_renters > 40) {
    parts.push(
      `More than half of renters spend over 30% of their income on housing.`
    );
  } else if (census.pct_cost_burdened_renters > 30) {
    parts.push(
      `${census.pct_cost_burdened_renters}% of renters are cost-burdened, spending more than 30% of their income on housing.`
    );
  }

  // Education
  if (census.pct_less_than_hs > 20) {
    parts.push(`${census.pct_less_than_hs}% of adults don't have a high school diploma.`);
  }

  // Uninsured
  if (census.pct_uninsured > 10) {
    parts.push(`${census.pct_uninsured}% lack health insurance.`);
  }

  // Closing
  parts.push("These aren't statistics. They're your neighbors.");

  return parts.join(' ');
}

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

export function CommunityPortrait({ place, census }: CommunityPortraitProps) {
  const population = census?.total_population ?? place.population_estimate;

  return (
    <div className="rounded-lg bg-[hsl(38_35%_96%)] border border-[hsl(30_18%_82%)] border-l-4 border-l-[hsl(16_65%_48%)] p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Heart className="h-4 w-4 text-[hsl(16_65%_48%)]" />
        <span className="text-[10px] font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
          Community Portrait
        </span>
      </div>

      {/* Lead: human impact summary */}
      {place.human_impact_summary && (
        <p className="font-serif text-base leading-relaxed text-[hsl(20_25%_15%)] italic">
          {place.human_impact_summary}
        </p>
      )}

      {/* Population highlight */}
      {population && (
        <p className="font-serif text-3xl font-bold text-[hsl(20_28%_15%)] tracking-tight">
          {formatNumber(population)}
          <span className="text-sm font-normal text-[hsl(20_10%_45%)] ml-2 tracking-normal">
            people call this place home
          </span>
        </p>
      )}

      {/* Narrative paragraph */}
      <p className="font-serif text-sm leading-[1.8] text-[hsl(20_15%_25%)]">
        {buildNarrative(place, census)}
      </p>

      {/* Most affected populations */}
      {place.most_affected_populations && place.most_affected_populations.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[hsl(20_10%_45%)]">
            Most affected
          </p>
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
        </div>
      )}

      {/* Health snapshot */}
      {place.health_snapshot && (
        <div className="rounded-md bg-[hsl(0_20%_96%)] border border-[hsl(0_15%_88%)] p-3 flex gap-2.5">
          <Activity className="h-4 w-4 text-[hsl(0_40%_50%)] mt-0.5 shrink-0" />
          <p className="text-xs leading-relaxed text-[hsl(0_15%_30%)]">
            {place.health_snapshot}
          </p>
        </div>
      )}
    </div>
  );
}

export default CommunityPortrait;
