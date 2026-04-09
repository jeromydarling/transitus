/**
 * Seasons Guide — A page explaining all 7 seasons of transition work.
 *
 * Rooted in the transition calendar, this page helps stewards understand
 * the natural rhythm of the work and find their current season.
 */

import { Calendar } from 'lucide-react';
import {
  getCurrentSeason,
  SEASONS,
  type TransitionSeason,
  type SeasonInfo,
} from '@/lib/transitionCalendar';

// ── Season timing labels ──

const SEASON_TIMING: Record<TransitionSeason, string> = {
  preparation: 'Late November \u2013 December',
  recognition: 'Late December \u2013 Early January',
  early_labor: 'Mid January \u2013 Late February',
  reckoning: 'Late February \u2013 Mid April',
  the_cost: 'Mid April (Holy Week)',
  breakthrough: 'Easter \u2013 Late May',
  the_long_work: 'Late May \u2013 Late November',
};

const COMPASS_LABELS: Record<string, string> = {
  north: 'North \u2014 Vision & Direction',
  east: 'East \u2014 Truth & Reckoning',
  south: 'South \u2014 Presence & Faithfulness',
  west: 'West \u2014 Rest & Reflection',
};

// ── Season Card ──

function SeasonCard({
  season,
  info,
  isCurrent,
}: {
  season: TransitionSeason;
  info: Omit<SeasonInfo, 'season'>;
  isCurrent: boolean;
}) {
  return (
    <article
      className={`rounded-lg border p-6 space-y-4 transition-all ${
        isCurrent
          ? 'bg-white border-2 shadow-md'
          : 'bg-white border-[hsl(30_18%_82%)]'
      }`}
      style={isCurrent ? { borderColor: info.color } : undefined}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3
            className="font-serif text-xl font-semibold"
            style={{ color: info.color }}
          >
            {info.label}
          </h3>
          <p className="text-sm italic text-[hsl(20_10%_42%)] mt-0.5">
            {info.posture}
          </p>
        </div>
        {isCurrent && (
          <span
            className="shrink-0 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white"
            style={{ backgroundColor: info.color }}
          >
            Current
          </span>
        )}
      </div>

      <p className="text-sm leading-relaxed text-[hsl(20_15%_22%)]">
        {info.description}
      </p>

      <div className="grid sm:grid-cols-2 gap-4 text-xs">
        <div>
          <p className="font-semibold uppercase tracking-widest text-[10px] text-[hsl(20_10%_50%)] mb-1">
            Compass Emphasis
          </p>
          <p className="text-[hsl(20_10%_30%)]">
            {COMPASS_LABELS[info.compassEmphasis]}
          </p>
        </div>
        <div>
          <p className="font-semibold uppercase tracking-widest text-[10px] text-[hsl(20_10%_50%)] mb-1">
            Approximate Timing
          </p>
          <p className="text-[hsl(20_10%_30%)]">{SEASON_TIMING[season]}</p>
        </div>
      </div>

      <div className="pt-3 border-t border-[hsl(30_18%_90%)]">
        <p className="font-semibold uppercase tracking-widest text-[10px] text-[hsl(20_10%_50%)] mb-1">
          Journal Prompt
        </p>
        <p className="text-sm italic text-[hsl(20_15%_30%)] leading-relaxed">
          {info.journalPrompt}
        </p>
      </div>

      <div>
        <p className="font-semibold uppercase tracking-widest text-[10px] text-[hsl(20_10%_50%)] mb-1">
          Weekly Focus
        </p>
        <p className="text-sm text-[hsl(20_10%_30%)] leading-relaxed">
          {info.weeklyFocus}
        </p>
      </div>
    </article>
  );
}

// ── Main Page ──

const SEASON_ORDER: TransitionSeason[] = [
  'preparation',
  'recognition',
  'early_labor',
  'reckoning',
  'the_cost',
  'breakthrough',
  'the_long_work',
];

export default function Seasons() {
  const current = getCurrentSeason();

  return (
    <div className="min-h-screen bg-[hsl(38_30%_95%)]">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-2 mb-1">
          <Calendar className="h-4 w-4 text-[hsl(16_65%_48%)]" />
          <span className="font-sans text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
            The Seasons of Transition
          </span>
        </div>
        <h1 className="font-serif text-3xl tracking-tight text-[hsl(20_28%_15%)] mb-4">
          The Seasons of Transition
        </h1>

        {/* Intro */}
        <p className="text-sm leading-relaxed text-[hsl(30_10%_40%)] max-w-2xl mb-10">
          The work of Just Transition follows a natural rhythm — seasons of
          preparation, reckoning, breakthrough, and long faithful labor.
          Understanding which season you're in helps you hold the right posture
          for the work ahead.
        </p>

        {/* Current season first */}
        <div className="mb-10">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[hsl(20_10%_50%)] mb-3">
            You are here
          </p>
          <SeasonCard
            season={current.season}
            info={SEASONS[current.season]}
            isCurrent={true}
          />
        </div>

        {/* All seasons */}
        <div className="space-y-5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[hsl(20_10%_50%)]">
            All Seasons
          </p>
          {SEASON_ORDER.map((season) => (
            <SeasonCard
              key={season}
              season={season}
              info={SEASONS[season]}
              isCurrent={season === current.season}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
