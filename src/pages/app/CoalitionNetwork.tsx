/**
 * Coalition Network — Cross-organization collaboration view.
 *
 * The Communio adaptation. Shows organizations grouped by type,
 * shared signals, and cross-place stakeholders.
 */

import { useMemo } from 'react';
import { Users, MapPin, ExternalLink, Radio, Globe } from 'lucide-react';
import { useTransitusData } from '@/contexts/TransitusDataContext';
import type { Organization, OrgType } from '@/types/transitus';
import { SIGNAL_SOURCE_LABELS } from '@/types/transitus';

// ── Helpers ──

const ORG_TYPE_LABELS: Record<OrgType, string> = {
  ej_group: 'Environmental Justice Group',
  church: 'Church',
  neighborhood_association: 'Neighborhood Association',
  developer: 'Developer',
  utility: 'Utility',
  labor_group: 'Labor Group',
  health_system: 'Health System',
  diocese: 'Diocese',
  foundation: 'Foundation',
  government_agency: 'Government Agency',
  ngo: 'NGO',
  community_land_trust: 'Community Land Trust',
  cooperative: 'Cooperative',
  school: 'School',
  other: 'Other',
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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

export default function CoalitionNetwork() {
  const { organizations, stakeholders, signals, places } = useTransitusData();

  const placeNameById = (id: string): string => {
    const place = places.find((p) => p.id === id);
    return place ? place.name : id;
  };

  // Group organizations by org_type
  const orgsByType = useMemo(() => {
    const groups = new Map<OrgType, Organization[]>();
    organizations.forEach((org) => {
      const existing = groups.get(org.org_type) || [];
      existing.push(org);
      groups.set(org.org_type, existing);
    });
    return groups;
  }, [organizations]);

  // Shared signals: signals that affect multiple places
  const sharedSignals = useMemo(() => {
    return signals.filter((s) => s.place_ids.length > 1);
  }, [signals]);

  // Cross-place stakeholders: stakeholders linked to 2+ places
  const crossPlaceStakeholders = useMemo(() => {
    return stakeholders.filter((s) => s.place_ids.length >= 2);
  }, [stakeholders]);

  return (
    <div className="min-h-screen bg-[hsl(38_30%_95%)]">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        {/* ── Header ── */}
        <header className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <Users className="h-4 w-4 text-[hsl(16_65%_48%)]" />
            <span className="font-sans text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
              Coalition Network
            </span>
          </div>
          <h1 className="font-serif text-2xl font-normal text-[hsl(20_10%_18%)] sm:text-3xl">
            Organizations and alliances
          </h1>
          <p className="mt-2 text-sm text-[hsl(20_8%_40%)] leading-relaxed max-w-2xl">
            The web of organizations working across your places — and the signals and
            people that connect them.
          </p>
        </header>

        {/* ── Organizations by type ── */}
        {Array.from(orgsByType.entries()).map(([orgType, orgs]) => (
          <section key={orgType} className="mb-10">
            <SectionHeader icon={Globe} label={ORG_TYPE_LABELS[orgType]} />
            <div className="grid gap-3 sm:grid-cols-2">
              {orgs.map((org) => (
                <div
                  key={org.id}
                  className="rounded-lg bg-white p-4 border border-[hsl(30_18%_82%)] hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-medium text-[hsl(20_10%_20%)] leading-snug">
                      {org.name}
                    </h3>
                    {org.website && (
                      <a
                        href={org.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 text-[hsl(16_65%_48%)] hover:text-[hsl(16_65%_38%)] transition-colors"
                        title="Visit website"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                  <p className="mt-1.5 text-xs text-[hsl(20_8%_48%)] line-clamp-2 leading-relaxed">
                    {org.description}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {/* Place badges */}
                    {org.place_ids.map((pid) => (
                      <span
                        key={pid}
                        className="inline-flex items-center gap-1 rounded-full bg-[hsl(30_20%_92%)] px-2 py-0.5 text-[10px] font-medium text-[hsl(20_10%_40%)]"
                      >
                        <MapPin className="h-2.5 w-2.5" />
                        {placeNameById(pid).length > 24
                          ? placeNameById(pid).slice(0, 24) + '\u2026'
                          : placeNameById(pid)}
                      </span>
                    ))}

                    {/* Stakeholder count */}
                    <span className="inline-flex items-center gap-1 text-[10px] text-[hsl(20_8%_52%)]">
                      <Users className="h-2.5 w-2.5" />
                      {org.stakeholder_ids.length}{' '}
                      {org.stakeholder_ids.length === 1 ? 'person' : 'people'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* ── Shared signals ── */}
        <section className="mb-10">
          <SectionHeader icon={Radio} label="Shared Signals" />
          <p className="text-xs text-[hsl(20_8%_48%)] mb-3 -mt-2">
            Signals that affect more than one place — potential coalition rallying points.
          </p>

          {sharedSignals.length === 0 && (
            <p className="text-sm text-[hsl(20_8%_52%)] italic">
              No cross-place signals at this time.
            </p>
          )}

          <div className="flex flex-col gap-2">
            {sharedSignals.map((signal) => (
              <div
                key={signal.id}
                className="rounded-lg bg-white p-4 border border-[hsl(30_18%_82%)] hover:shadow-sm transition-shadow"
              >
                <p className="text-sm font-medium text-[hsl(20_10%_20%)] leading-snug">
                  {signal.title}
                </p>
                <p className="mt-1 text-xs text-[hsl(20_8%_48%)] line-clamp-2">
                  {signal.summary}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-[hsl(30_20%_92%)] px-2 py-0.5 text-[10px] font-medium text-[hsl(20_10%_40%)]">
                    {SIGNAL_SOURCE_LABELS[signal.source]}
                  </span>
                  {signal.place_ids.map((pid) => (
                    <span
                      key={pid}
                      className="inline-flex items-center gap-1 text-[10px] text-[hsl(20_8%_52%)]"
                    >
                      <MapPin className="h-2.5 w-2.5" />
                      {placeNameById(pid).length > 24
                        ? placeNameById(pid).slice(0, 24) + '\u2026'
                        : placeNameById(pid)}
                    </span>
                  ))}
                  <span className="text-[10px] text-[hsl(20_8%_58%)]">
                    {formatDate(signal.published_at)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Cross-place stakeholders ── */}
        <section className="mb-10">
          <SectionHeader icon={Users} label="Cross-Place Stakeholders" />
          <p className="text-xs text-[hsl(20_8%_48%)] mb-3 -mt-2">
            People connected to two or more places — bridges in the coalition.
          </p>

          {crossPlaceStakeholders.length === 0 && (
            <p className="text-sm text-[hsl(20_8%_52%)] italic">
              No cross-place stakeholders identified yet.
            </p>
          )}

          <div className="flex flex-col gap-2">
            {crossPlaceStakeholders.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between gap-3 rounded-lg bg-white px-4 py-3 border border-[hsl(30_18%_82%)] hover:shadow-sm transition-shadow"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[hsl(20_10%_20%)]">{s.name}</p>
                  <p className="text-xs text-[hsl(20_8%_48%)]">
                    {s.title || s.role}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-1 justify-end">
                  {s.place_ids.map((pid) => (
                    <span
                      key={pid}
                      className="inline-flex items-center gap-1 rounded-full bg-[hsl(30_20%_92%)] px-2 py-0.5 text-[10px] font-medium text-[hsl(20_10%_40%)]"
                    >
                      <MapPin className="h-2.5 w-2.5" />
                      {placeNameById(pid).length > 20
                        ? placeNameById(pid).slice(0, 20) + '\u2026'
                        : placeNameById(pid)}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
