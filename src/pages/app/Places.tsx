/**
 * Places List Page
 *
 * Grid overview of all tracked places in the Transitus workspace.
 * Each card links to the full PlaceDetail page.
 */

import { Link } from 'react-router-dom';
import { slugify } from '@/lib/slugify';
import { MapPin, Globe, Briefcase, Plus } from 'lucide-react';
import { useTransitusData } from '@/contexts/TransitusDataContext';
import { CreatePlaceForm } from '@/components/forms/CreatePlaceForm';
import StaticMap from '@/components/ui/StaticMap';
import type { EnvironmentalBurden, Place } from '@/types/transitus';

// ── Severity badge styles ──

const SEVERITY_CLASSES: Record<EnvironmentalBurden['severity'], string> = {
  critical: 'bg-red-100 text-red-700',
  high: 'bg-orange-100 text-orange-700',
  moderate: 'bg-amber-100 text-amber-700',
  low: 'bg-green-100 text-green-700',
};

function SeverityBadge({ severity }: { severity: EnvironmentalBurden['severity'] }) {
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-medium leading-tight ${SEVERITY_CLASSES[severity]}`}
    >
      {severity}
    </span>
  );
}

function PlaceTypeBadge({ type }: { type: Place['place_type'] }) {
  const label = type
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
  return (
    <span className="inline-block rounded-full bg-[hsl(30_18%_90%)] text-[hsl(30_18%_40%)] px-2 py-0.5 text-[11px] font-medium leading-tight">
      {label}
    </span>
  );
}

function PlaceCard({ place }: { place: Place }) {
  const topBurdens = place.environmental_burdens.slice(0, 3);
  const activeCount = place.active_work.filter(
    (w) => w.status !== 'completed',
  ).length;

  return (
    <Link
      to={`/app/places/${slugify(place.name)}`}
      className="block rounded-lg bg-white border border-[hsl(30_18%_82%)] hover:border-[hsl(30_18%_70%)] hover:shadow-md transition-all group overflow-hidden"
    >
      {/* Map thumbnail */}
      <StaticMap
        lat={place.lat}
        lng={place.lng}
        zoom={13}
        width={400}
        height={200}
        style="transitu/cmns7i5r4000001si3upk9hai"
        className="w-full"
      />

      {/* Header */}
      <div className="p-4">
      <div className="flex items-start gap-3 mb-3">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[hsl(152_30%_92%)] text-[hsl(152_45%_30%)]">
          <MapPin className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-serif text-lg leading-snug tracking-tight group-hover:text-[hsl(152_45%_30%)] transition-colors">
            {place.name}
          </h3>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-[hsl(30_10%_45%)]">
            <span className="flex items-center gap-1">
              <Globe className="h-3.5 w-3.5" />
              {place.geography}
            </span>
            <PlaceTypeBadge type={place.place_type} />
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm leading-relaxed text-[hsl(30_10%_35%)] line-clamp-2 mb-3">
        {place.description}
      </p>

      {/* Who lives here */}
      {place.human_impact_summary && (
        <p className="text-xs text-[hsl(20_25%_12%/0.55)] italic mt-2 line-clamp-2 border-l-2 border-[hsl(16_65%_48%/0.3)] pl-2">
          {place.human_impact_summary.split('.')[0]}.
        </p>
      )}
      {place.population_estimate && (
        <p className="text-xs font-medium text-[hsl(20_25%_12%/0.6)] mt-1">
          {place.population_estimate.toLocaleString()} residents
        </p>
      )}

      {/* Environmental burdens */}
      {topBurdens.length > 0 && (
        <div className="mb-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[hsl(30_10%_55%)] mb-1.5">
            Top Burdens
          </p>
          <div className="flex flex-wrap gap-1.5">
            {topBurdens.map((b, i) => (
              <span
                key={i}
                className="flex items-center gap-1.5 text-xs text-[hsl(30_10%_35%)]"
              >
                <SeverityBadge severity={b.severity} />
                <span className="truncate max-w-[160px]">{b.name}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Active work count */}
      {activeCount > 0 && (
        <div className="flex items-center gap-1.5 text-xs text-[hsl(30_10%_50%)]">
          <Briefcase className="h-3.5 w-3.5" />
          <span>
            {activeCount} active work item{activeCount !== 1 ? 's' : ''}
          </span>
        </div>
      )}
      </div>
    </Link>
  );
}

// ── Main page ──

export default function Places() {
  const { places } = useTransitusData();

  return (
    <div className="min-h-screen bg-[hsl(38_30%_95%)]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[hsl(152_45%_30%)]" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[hsl(30_10%_50%)]">
                Places
              </span>
            </div>
            <CreatePlaceForm
              trigger={
                <button className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-[hsl(16_65%_48%)] px-4 py-2 text-sm font-medium text-white hover:bg-[hsl(12_55%_35%)] transition-colors">
                  <Plus className="h-4 w-4" />
                  New Place
                </button>
              }
            />
          </div>
          <h1 className="font-serif text-3xl tracking-tight text-[hsl(20_28%_15%)]">
            Tracked Places
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-[hsl(30_10%_40%)] max-w-2xl">
            Communities, corridors, and territories where transition work is
            underway. Each place holds the full picture: environmental burdens,
            stakeholders, commitments, and the unfolding story of change.
          </p>
        </div>

        {/* Place cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {places.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      </div>

      {/* Mobile FAB */}
      <CreatePlaceForm
        trigger={
          <button className="sm:hidden fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[hsl(16_65%_48%)] text-white shadow-lg hover:bg-[hsl(12_55%_35%)] transition-colors">
            <Plus className="h-6 w-6" />
          </button>
        }
      />
    </div>
  );
}
