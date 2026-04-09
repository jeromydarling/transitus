/**
 * PlaceDetail — the HERO page of Transitus
 *
 * Deep view into a single place: environmental data, stakeholders,
 * commitments, field notes, signals, and the unfolding journey.
 * Fetches supplemental data from EPA EJScreen, ECHO, Census, and NOAA stubs.
 */

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  Globe,
  AlertTriangle,
  Briefcase,
  Users,
  Building2,
  Handshake,
  NotebookPen,
  Radio,
  BookOpen,
  ChevronLeft,
  ExternalLink,
  Factory,
  Thermometer,
  BarChart3,
  Shield,
  Heart,
} from 'lucide-react';

import { useTransitusData } from '@/contexts/TransitusDataContext';
import { MOCK_COMMUNITY_STORIES } from '@/lib/mockData';

import PlaceMap from '@/components/map/PlaceMap';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

import {
  fetchEJScreenData,
  fetchNearbyFacilities,
  fetchCensusProfile,
  fetchHazardRisks,
} from '@/lib/api';

import {
  ROLE_LABELS,
  COMMITMENT_STATUS_LABELS,
  SIGNAL_SOURCE_LABELS,
} from '@/types/transitus';

import type {
  Place,
  EnvironmentalBurden,
  ActiveWork,
  Stakeholder,
  Organization,
  Commitment,
  FieldNote,
  Signal,
  Journey,
  CommitmentStatus,
} from '@/types/transitus';

import type { EJScreenResult, EJScreenIndicator } from '@/lib/api/ejscreen';
import type { ECHOFacility } from '@/lib/api/echo';
import type { CensusProfile } from '@/lib/api/census';
import type { HazardRisk } from '@/lib/api/noaa';

// ── Design tokens ──

const SEVERITY_CLASSES: Record<EnvironmentalBurden['severity'], string> = {
  critical: 'bg-red-100 text-red-700',
  high: 'bg-orange-100 text-orange-700',
  moderate: 'bg-amber-100 text-amber-700',
  low: 'bg-green-100 text-green-700',
};

const HAZARD_RISK_CLASSES: Record<HazardRisk['risk_level'], string> = {
  low: 'bg-green-100 text-green-700',
  moderate: 'bg-amber-100 text-amber-700',
  high: 'bg-orange-100 text-orange-700',
  very_high: 'bg-red-100 text-red-700',
};

const COMPLIANCE_CLASSES: Record<ECHOFacility['compliance_status'], string> = {
  in_compliance: 'bg-green-100 text-green-700',
  violation: 'bg-orange-100 text-orange-700',
  significant_violation: 'bg-red-100 text-red-700',
};

const WORK_TYPE_CLASSES: Record<ActiveWork['type'], string> = {
  hearing: 'bg-purple-100 text-purple-700',
  campaign: 'bg-rose-100 text-rose-700',
  funding_ask: 'bg-emerald-100 text-emerald-700',
  engagement_round: 'bg-sky-100 text-sky-700',
  project_milestone: 'bg-indigo-100 text-indigo-700',
  coalition_meeting: 'bg-amber-100 text-amber-700',
};

const WORK_STATUS_CLASSES: Record<ActiveWork['status'], string> = {
  upcoming: 'bg-sky-50 text-sky-600',
  in_progress: 'bg-amber-50 text-amber-600',
  completed: 'bg-green-50 text-green-600',
};

// ── Helpers ──

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatNumber(n: number): string {
  return n.toLocaleString('en-US');
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n);
}

function formatWorkType(type: ActiveWork['type']): string {
  return type
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatHazardType(type: HazardRisk['hazard_type']): string {
  return type
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatRiskLevel(level: HazardRisk['risk_level']): string {
  return level
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatComplianceStatus(
  status: ECHOFacility['compliance_status'],
): string {
  return status
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function statusBadgeClasses(status: CommitmentStatus): string {
  const base =
    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium';
  switch (status) {
    case 'proposed':
      return `${base} bg-[hsl(205_70%_93%)] text-[hsl(205_70%_35%)]`;
    case 'acknowledged':
      return `${base} bg-[hsl(220_40%_92%)] text-[hsl(220_40%_40%)]`;
    case 'accepted':
      return `${base} bg-[hsl(180_40%_90%)] text-[hsl(180_40%_32%)]`;
    case 'in_motion':
      return `${base} bg-[hsl(152_50%_90%)] text-[hsl(152_50%_28%)]`;
    case 'delayed':
      return `${base} bg-[hsl(16_65%_92%)] text-[hsl(16_65%_38%)]`;
    case 'breached':
      return `${base} bg-[hsl(0_60%_92%)] text-[hsl(0_60%_38%)]`;
    case 'repaired':
      return `${base} bg-[hsl(270_40%_92%)] text-[hsl(270_40%_38%)]`;
    case 'completed':
      return `${base} bg-[hsl(160_30%_90%)] text-[hsl(160_30%_32%)]`;
    default:
      return `${base} bg-gray-100 text-gray-600`;
  }
}

function placeTypeBadgeLabel(type: Place['place_type']): string {
  return type
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// stakeholderNameById is now passed as a closure from the component

// ── Shared section header ──

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

// ── Sidebar sub-components ──

function SidebarStakeholders({
  stakeholders,
}: {
  stakeholders: Stakeholder[];
}) {
  if (stakeholders.length === 0) return null;
  return (
    <div>
      <SectionHeader icon={Users} label="Stakeholders" />
      <div className="flex flex-col gap-2">
        {stakeholders.map((s) => (
          <div
            key={s.id}
            className="rounded-lg bg-white p-3 border border-[hsl(30_18%_82%)]"
          >
            <p className="text-sm font-medium text-[hsl(20_10%_20%)]">
              {s.name}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              <span className="inline-flex items-center rounded-full bg-[hsl(30_20%_92%)] px-2 py-0.5 text-[10px] font-medium text-[hsl(20_10%_40%)]">
                {ROLE_LABELS[s.role]}
              </span>
              {s.trust_level && (
                <span className="inline-flex items-center rounded-full bg-[hsl(152_30%_92%)] px-2 py-0.5 text-[10px] font-medium text-[hsl(152_45%_30%)]">
                  {s.trust_level}
                </span>
              )}
            </div>
            {s.title && (
              <p className="mt-1 text-[11px] text-[hsl(20_8%_48%)]">
                {s.title}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function SidebarOrganizations({ orgs }: { orgs: Organization[] }) {
  if (orgs.length === 0) return null;
  return (
    <div>
      <SectionHeader icon={Building2} label="Organizations" />
      <div className="flex flex-col gap-2">
        {orgs.map((org) => (
          <div
            key={org.id}
            className="rounded-lg bg-white p-3 border border-[hsl(30_18%_82%)]"
          >
            <p className="text-sm font-medium text-[hsl(20_10%_20%)]">
              {org.name}
            </p>
            <span className="inline-flex items-center rounded-full bg-[hsl(30_20%_92%)] mt-1 px-2 py-0.5 text-[10px] font-medium text-[hsl(20_10%_40%)]">
              {org.org_type.replace(/_/g, ' ')}
            </span>
            {org.website && (
              <a
                href={org.website}
                target="_blank"
                rel="noreferrer"
                className="mt-1 flex items-center gap-1 text-[11px] text-[hsl(16_65%_48%)] hover:text-[hsl(16_65%_38%)]"
              >
                <ExternalLink className="h-2.5 w-2.5" />
                Website
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function SidebarCommitments({
  commitments,
}: {
  commitments: Commitment[];
}) {
  if (commitments.length === 0) return null;
  return (
    <div>
      <SectionHeader icon={Handshake} label="Commitments" />
      <div className="flex flex-col gap-2">
        {commitments.map((c) => (
          <div
            key={c.id}
            className="rounded-lg bg-white p-3 border border-[hsl(30_18%_82%)]"
          >
            <p className="text-sm font-medium text-[hsl(20_10%_20%)] leading-snug">
              {c.title}
            </p>
            <div className="mt-1.5 flex items-center gap-2">
              <span className={statusBadgeClasses(c.status)}>
                {COMMITMENT_STATUS_LABELS[c.status]}
              </span>
            </div>
            {c.renewal_date && (
              <p className="mt-1 text-[10px] text-[hsl(20_8%_52%)]">
                Review: {formatDate(c.renewal_date)}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function SidebarFieldNotes({ notes, stakeholderNameById }: { notes: FieldNote[]; stakeholderNameById: (id: string) => string }) {
  if (notes.length === 0) return null;
  return (
    <div>
      <SectionHeader icon={NotebookPen} label="Field Notes" />
      <div className="flex flex-col gap-2">
        {notes.slice(0, 4).map((n) => (
          <div
            key={n.id}
            className="rounded-lg bg-white p-3 border border-[hsl(30_18%_82%)]"
          >
            <p className="text-xs text-[hsl(20_10%_25%)] line-clamp-3 leading-relaxed">
              {n.content}
            </p>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-[10px] font-medium text-[hsl(20_10%_35%)]">
                {stakeholderNameById(n.author_id)}
              </span>
              <span className="text-[10px] text-[hsl(20_8%_52%)]">
                {formatDate(n.created_at)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SidebarSignals({ signals }: { signals: Signal[] }) {
  if (signals.length === 0) return null;
  return (
    <div>
      <SectionHeader icon={Radio} label="Signals" />
      <div className="flex flex-col gap-2">
        {signals.slice(0, 4).map((s) => (
          <div
            key={s.id}
            className="rounded-lg bg-white p-3 border border-[hsl(30_18%_82%)]"
          >
            <p className="text-sm font-medium text-[hsl(20_10%_20%)] leading-snug">
              {s.title}
            </p>
            <div className="mt-1 flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-[hsl(30_20%_92%)] px-2 py-0.5 text-[10px] font-medium text-[hsl(20_10%_40%)]">
                {SIGNAL_SOURCE_LABELS[s.source]}
              </span>
              <span className="text-[10px] text-[hsl(20_8%_52%)]">
                {formatDate(s.published_at)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SidebarJourney({ journey }: { journey: Journey }) {
  return (
    <div>
      <SectionHeader icon={BookOpen} label="Journey" />
      <Link
        to={`/app/journeys/${journey.id}`}
        className="block rounded-lg bg-white p-4 border border-[hsl(30_18%_82%)] hover:shadow-md transition-shadow"
      >
        <p className="text-sm font-medium text-[hsl(20_10%_20%)]">
          {journey.title}
        </p>
        <p className="mt-1 text-xs text-[hsl(20_8%_48%)] line-clamp-2">
          {journey.description}
        </p>
        <p className="mt-2 text-[10px] font-medium text-[hsl(16_65%_48%)]">
          {journey.chapters.length} chapter
          {journey.chapters.length !== 1 ? 's' : ''}
        </p>
      </Link>
    </div>
  );
}

// ── EJScreen data grid ──

const LAYMAN_NAMES: Record<string, string> = {
  'PM2.5': 'Air particle pollution',
  'Diesel PM': 'Diesel exhaust',
  'Ozone': 'Ozone pollution',
  'Air Toxics Cancer Risk': 'Cancer risk from air toxics',
  'Air Toxics Respiratory HI': 'Respiratory risk from air toxics',
  'Traffic Proximity': 'Traffic pollution',
  'Lead Paint': 'Lead exposure risk',
  'Superfund Proximity': 'Superfund site proximity',
  'RMP Facility Proximity': 'Chemical accident risk',
  'Hazardous Waste': 'Hazardous waste proximity',
  'Wastewater Discharge': 'Wastewater pollution',
  'Underground Storage Tanks': 'Underground tank contamination risk',
};

function getLaymanDescription(indicator: EJScreenIndicator): string {
  const pct = indicator.percentile_state;
  const severity = pct >= 90 ? 'significantly worse' : pct >= 75 ? 'worse' : pct >= 50 ? 'somewhat higher' : 'similar to or better';

  const descriptions: Record<string, string> = {
    'PM2.5': `Fine particle air pollution here is ${severity} than ${pct}% of communities in the state. Fine particles cause asthma attacks, heart disease, and premature death.`,
    'Diesel PM': `Diesel exhaust from trucks and equipment is ${severity} than ${pct}% of the state. Children and elderly residents are most vulnerable.`,
    'Ozone': `Ground-level ozone here is ${severity} than ${pct}% of communities in the state. Ozone triggers asthma and damages lungs, especially on hot days.`,
    'Air Toxics Cancer Risk': `Cancer risk from air pollution is ${severity} than ${pct}% of the state. Long-term exposure to these toxics increases lifetime cancer risk.`,
    'Air Toxics Respiratory HI': `Respiratory risk from air toxics is ${severity} than ${pct}% of the state. These pollutants irritate airways and worsen lung disease.`,
    'Traffic Proximity': `Traffic-related air pollution (from nearby highways and truck routes) is ${severity} than ${pct}% of the state. Families near major roads face higher asthma rates.`,
    'Lead Paint': `${Math.round(indicator.value * 100)}% of homes were built before lead paint was banned. Children in older housing face ongoing lead exposure risk.`,
    'Superfund Proximity': `This area's proximity to Superfund toxic cleanup sites is ${severity} than ${pct}% of communities in the state.`,
    'RMP Facility Proximity': `This neighborhood is closer to chemical facilities with accident risk than ${pct}% of communities in the state. An industrial accident here could affect nearby residents.`,
    'Hazardous Waste': `Proximity to hazardous waste facilities is ${severity} than ${pct}% of the state. These facilities handle materials that can contaminate soil and groundwater.`,
    'Wastewater Discharge': `Wastewater pollution in nearby waterways is ${severity} than ${pct}% of the state. Discharge contains chemicals that affect water quality and aquatic life.`,
    'Underground Storage Tanks': `Proximity to underground storage tanks (which can leak fuel and chemicals) is ${severity} than ${pct}% of the state.`,
  };
  return descriptions[indicator.name] || `This measure is at the ${pct}th percentile for the state.`;
}

function EJScreenIndicatorRow({
  indicator,
  laymanMode,
}: {
  indicator: EJScreenIndicator;
  laymanMode: boolean;
}) {
  if (laymanMode) {
    const laymanName = LAYMAN_NAMES[indicator.name] || indicator.name;
    return (
      <div className="py-3 border-b border-[hsl(30_18%_90%)] last:border-0 space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-[hsl(20_10%_20%)]">{laymanName}</span>
          <span className="text-xs font-medium text-[hsl(20_10%_35%)] tabular-nums">
            {indicator.percentile_state}th percentile
          </span>
        </div>
        {/* Severity bar */}
        <div className="w-full h-1.5 rounded-full bg-[hsl(30_18%_90%)] overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${indicator.percentile_state}%`,
              backgroundColor: indicator.percentile_state >= 90 ? 'hsl(0 60% 50%)' : indicator.percentile_state >= 75 ? 'hsl(25 80% 50%)' : indicator.percentile_state >= 50 ? 'hsl(45 80% 50%)' : 'hsl(152 40% 45%)',
            }}
          />
        </div>
        <p className="text-xs text-[hsl(20_8%_42%)] leading-relaxed">
          {getLaymanDescription(indicator)}
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between py-2 border-b border-[hsl(30_18%_90%)] last:border-0">
      <span className="text-sm text-[hsl(20_10%_25%)]">{indicator.name}</span>
      <div className="flex items-center gap-4 text-right">
        <span className="text-sm font-medium text-[hsl(20_10%_15%)] tabular-nums">
          {indicator.value} {indicator.unit}
        </span>
        <div className="flex items-center gap-2 text-[11px] text-[hsl(20_8%_48%)]">
          <span title="State percentile">
            State:{' '}
            <span className="font-medium text-[hsl(20_10%_25%)]">
              {indicator.percentile_state}th
            </span>
          </span>
          <span title="National percentile">
            Nat'l:{' '}
            <span className="font-medium text-[hsl(20_10%_25%)]">
              {indicator.percentile_national}th
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Main page component ──

export default function PlaceDetail() {
  const { id } = useParams<{ id: string }>();
  const { places, stakeholders, organizations, commitments, fieldNotes, signals, journeys } = useTransitusData();
  const place = places.find((p) => p.id === id);

  // EJScreen layman mode toggle
  const [laymanMode, setLaymanMode] = React.useState(true);

  // API state
  const [ejData, setEjData] = React.useState<EJScreenResult | null>(null);
  const [facilities, setFacilities] = React.useState<ECHOFacility[]>([]);
  const [census, setCensus] = React.useState<CensusProfile | null>(null);
  const [hazards, setHazards] = React.useState<HazardRisk[]>([]);

  // Fetch API data when place loads
  React.useEffect(() => {
    if (!place) return;

    fetchEJScreenData(place.lat, place.lng).then(setEjData);
    fetchNearbyFacilities({
      lat: place.lat,
      lng: place.lng,
      radius_miles: 3,
    }).then(setFacilities);
    fetchCensusProfile(place.lat, place.lng).then(setCensus);
    fetchHazardRisks(place.lat, place.lng).then(setHazards);
  }, [place]);

  // 404 handling
  if (!place) {
    return (
      <div className="min-h-screen bg-[hsl(38_30%_95%)] flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-2xl text-[hsl(20_10%_20%)] mb-2">
            Place not found
          </h1>
          <p className="text-sm text-[hsl(20_8%_48%)] mb-4">
            The place you are looking for does not exist.
          </p>
          <Link
            to="/app/places"
            className="text-sm font-medium text-[hsl(16_65%_48%)] hover:text-[hsl(16_65%_38%)]"
          >
            Back to Places
          </Link>
        </div>
      </div>
    );
  }

  const stakeholderNameById = (sid: string): string => {
    const s = stakeholders.find((st) => st.id === sid);
    return s?.name ?? sid;
  };

  // Derived data for sidebar
  const linkedStakeholders = stakeholders.filter((s) =>
    s.place_ids.includes(place.id),
  );
  const linkedOrgs = organizations.filter((o) =>
    o.place_ids.includes(place.id),
  );
  const linkedCommitments = commitments.filter((c) =>
    c.place_ids.includes(place.id),
  );
  const linkedNotes = fieldNotes.filter(
    (n) => n.place_id === place.id,
  );
  const linkedSignals = signals.filter((s) =>
    s.place_ids.includes(place.id),
  );
  const linkedJourney = journeys.find(
    (j) => j.place_id === place.id,
  );

  // EJScreen indicators for the data grid
  const ejIndicators: EJScreenIndicator[] = ejData
    ? [
        ejData.pm25,
        ejData.ozone,
        ejData.diesel_pm,
        ejData.air_toxics_cancer_risk,
        ejData.air_toxics_respiratory,
        ejData.traffic_proximity,
        ejData.lead_paint,
        ejData.superfund_proximity,
        ejData.rmp_proximity,
        ejData.hazardous_waste,
        ejData.wastewater_discharge,
        ejData.ust_proximity,
      ]
    : [];

  return (
    <div className="min-h-screen bg-[hsl(38_30%_95%)]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          to="/app/places"
          className="inline-flex items-center gap-1 text-sm text-[hsl(16_65%_48%)] hover:text-[hsl(16_65%_38%)] transition-colors mb-6"
        >
          <ChevronLeft className="h-4 w-4" />
          All Places
        </Link>

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ── Main column ── */}
          <div className="flex-1 min-w-0 space-y-8">
            {/* Place header */}
            <header>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-[hsl(152_45%_30%)]" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[hsl(30_10%_50%)]">
                  Place
                </span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl tracking-tight text-[hsl(20_28%_15%)]">
                {place.name}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1.5 text-sm text-[hsl(30_10%_40%)]">
                  <Globe className="h-4 w-4" />
                  {place.geography}
                </span>
                <span className="inline-flex items-center rounded-full bg-[hsl(30_18%_90%)] text-[hsl(30_18%_40%)] px-2.5 py-0.5 text-[11px] font-medium">
                  {placeTypeBadgeLabel(place.place_type)}
                </span>
                {place.population_estimate && (
                  <span className="text-sm text-[hsl(30_10%_45%)]">
                    Pop. ~{formatNumber(place.population_estimate)}
                  </span>
                )}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-[hsl(30_10%_35%)] max-w-3xl">
                {place.description}
              </p>
            </header>

            {/* ── Human Impact ── */}
            {place.human_impact_summary && (
              <section className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <Heart className="h-4 w-4 text-[hsl(16_65%_48%)]" />
                  <span className="font-sans text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">Who Lives Here</span>
                </div>
                <div className="rounded-xl bg-white border-l-4 border-[hsl(16_65%_48%)] border-r border-t border-b border-r-[hsl(30_18%_82%)] border-t-[hsl(30_18%_82%)] border-b-[hsl(30_18%_82%)] p-5">
                  {place.population_estimate && (
                    <p className="font-serif text-2xl text-[hsl(20_25%_12%)] mb-2">{place.population_estimate.toLocaleString()} people live here.</p>
                  )}
                  <p className="font-serif-body text-sm text-[hsl(20_25%_12%/0.75)] leading-relaxed mb-3">{place.human_impact_summary}</p>
                  {place.health_snapshot && (
                    <div className="rounded-lg bg-[hsl(0_50%_97%)] border border-[hsl(0_40%_90%)] p-3 mt-3">
                      <p className="text-xs font-semibold text-[hsl(0_50%_40%)] mb-1">Health Impact</p>
                      <p className="text-xs text-[hsl(0_40%_30%)]">{place.health_snapshot}</p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Place Map */}
            <PlaceMap
              lat={place.lat}
              lng={place.lng}
              name={place.name}
              environmental_burdens={place.environmental_burdens}
              facilityCount={facilities.length}
              className="h-64 sm:h-72"
            />

            {/* Environmental Burdens */}
            <section>
              <SectionHeader
                icon={AlertTriangle}
                label="Environmental Burdens"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {place.environmental_burdens.map((burden, i) => (
                  <div
                    key={i}
                    className="rounded-lg bg-white p-4 border border-[hsl(30_18%_82%)]"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="text-sm font-medium text-[hsl(20_10%_20%)] leading-snug">
                        {burden.name}
                      </h4>
                      <span
                        className={`shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${SEVERITY_CLASSES[burden.severity]}`}
                      >
                        {burden.severity}
                      </span>
                    </div>
                    <p className="text-xs text-[hsl(20_8%_40%)] leading-relaxed">
                      {burden.description}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="inline-flex items-center rounded-full bg-[hsl(30_18%_90%)] px-2 py-0.5 text-[10px] font-medium text-[hsl(30_18%_40%)]">
                        {burden.category}
                      </span>
                      {burden.source && (
                        <span className="text-[10px] text-[hsl(20_8%_52%)]">
                          Source: {burden.source}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Active Work */}
            {place.active_work.length > 0 && (
              <section>
                <SectionHeader icon={Briefcase} label="Active Work" />
                <div className="flex flex-col gap-2">
                  {place.active_work.map((work) => (
                    <div
                      key={work.id}
                      className="flex items-center justify-between gap-4 rounded-lg bg-white px-4 py-3 border border-[hsl(30_18%_82%)]"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-[hsl(20_10%_20%)]">
                          {work.title}
                        </p>
                        {work.date && (
                          <p className="mt-0.5 text-[11px] text-[hsl(20_8%_48%)]">
                            {formatDate(work.date)}
                          </p>
                        )}
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${WORK_TYPE_CLASSES[work.type]}`}
                        >
                          {formatWorkType(work.type)}
                        </span>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${WORK_STATUS_CLASSES[work.status]}`}
                        >
                          {work.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* EJScreen Data */}
            {ejData && (
              <section>
                <SectionHeader icon={BarChart3} label="EJScreen Data" />
                <div className="rounded-lg bg-white border border-[hsl(30_18%_82%)] overflow-hidden">
                  {/* Demographics summary row */}
                  <div className="px-4 py-3 bg-[hsl(30_20%_96%)] border-b border-[hsl(30_18%_90%)]">
                    <div className="flex flex-wrap gap-4 text-xs">
                      <span>
                        Demographic Index:{' '}
                        <span className="font-semibold text-[hsl(20_10%_15%)]">
                          {ejData.demographic_index}
                        </span>
                      </span>
                      <span>
                        Minority:{' '}
                        <span className="font-semibold text-[hsl(20_10%_15%)]">
                          {ejData.percent_minority}%
                        </span>
                      </span>
                      <span>
                        Low Income:{' '}
                        <span className="font-semibold text-[hsl(20_10%_15%)]">
                          {ejData.percent_low_income}%
                        </span>
                      </span>
                      <span>
                        &lt; HS Education:{' '}
                        <span className="font-semibold text-[hsl(20_10%_15%)]">
                          {ejData.percent_less_than_hs}%
                        </span>
                      </span>
                      <span>
                        Limited English:{' '}
                        <span className="font-semibold text-[hsl(20_10%_15%)]">
                          {ejData.percent_linguistically_isolated}%
                        </span>
                      </span>
                    </div>
                  </div>
                  {/* Indicator rows */}
                  <div className="px-4">
                    {ejIndicators.map((indicator, i) => (
                      <EJScreenIndicatorRow key={i} indicator={indicator} />
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Census Data */}
            {census && (
              <section>
                <SectionHeader icon={Users} label="Census Data" />
                <div className="rounded-lg bg-white border border-[hsl(30_18%_82%)] overflow-hidden">
                  <div className="px-4 py-3 bg-[hsl(30_20%_96%)] border-b border-[hsl(30_18%_90%)]">
                    <p className="text-xs text-[hsl(20_8%_48%)]">
                      {census.geo_name} — ACS {census.vintage} estimates
                    </p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-[hsl(30_18%_90%)]">
                    {[
                      {
                        label: 'Population',
                        value: formatNumber(census.total_population),
                      },
                      {
                        label: 'Median Household Income',
                        value: formatCurrency(
                          census.median_household_income,
                        ),
                      },
                      {
                        label: 'Poverty Rate',
                        value: `${census.pct_below_poverty}%`,
                      },
                      {
                        label: 'Below 200% Poverty',
                        value: `${census.pct_below_200pct_poverty}%`,
                      },
                      {
                        label: 'Unemployment',
                        value: `${census.unemployment_rate}%`,
                      },
                      {
                        label: 'Uninsured',
                        value: `${census.pct_uninsured}%`,
                      },
                      {
                        label: 'Renter Occupied',
                        value: `${census.pct_renter_occupied}%`,
                      },
                      {
                        label: 'Median Rent',
                        value: formatCurrency(census.median_rent),
                      },
                      {
                        label: 'Cost-Burdened Renters',
                        value: `${census.pct_cost_burdened_renters}%`,
                      },
                      {
                        label: 'No Vehicle',
                        value: `${census.pct_no_vehicle}%`,
                      },
                      {
                        label: 'Hispanic',
                        value: `${census.pct_hispanic}%`,
                      },
                      {
                        label: 'Black',
                        value: `${census.pct_black_alone}%`,
                      },
                      {
                        label: 'White',
                        value: `${census.pct_white_alone}%`,
                      },
                      {
                        label: 'Limited English',
                        value: `${census.pct_limited_english}%`,
                      },
                      {
                        label: 'Pre-1960 Housing',
                        value: `${census.pct_built_before_1960}%`,
                      },
                    ].map((item) => (
                      <div key={item.label} className="bg-white px-4 py-3">
                        <p className="text-[10px] font-medium uppercase tracking-wider text-[hsl(20_8%_52%)]">
                          {item.label}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-[hsl(20_10%_15%)] tabular-nums">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Hazard Risks */}
            {hazards.length > 0 && (
              <section>
                <SectionHeader icon={Thermometer} label="Hazard Risks" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {hazards.map((hazard, i) => (
                    <div
                      key={i}
                      className="rounded-lg bg-white p-4 border border-[hsl(30_18%_82%)]"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="text-sm font-medium text-[hsl(20_10%_20%)]">
                          {formatHazardType(hazard.hazard_type)}
                        </h4>
                        <span
                          className={`shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${HAZARD_RISK_CLASSES[hazard.risk_level]}`}
                        >
                          {formatRiskLevel(hazard.risk_level)}
                        </span>
                      </div>
                      <p className="text-xs text-[hsl(20_8%_40%)] leading-relaxed">
                        {hazard.description}
                      </p>
                      <div className="mt-2 flex items-center gap-3 text-[10px] text-[hsl(20_8%_52%)]">
                        <span>
                          {hazard.historical_events_10yr} events (10yr)
                        </span>
                        <span className="italic">
                          {hazard.projected_change}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Nearby Facilities (EPA ECHO) */}
            {facilities.length > 0 && (
              <section>
                <SectionHeader
                  icon={Factory}
                  label="Nearby Facilities"
                />
                <div className="flex flex-col gap-3">
                  {facilities.map((f) => (
                    <div
                      key={f.registry_id}
                      className="rounded-lg bg-white p-4 border border-[hsl(30_18%_82%)]"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-medium text-[hsl(20_10%_20%)]">
                            {f.facility_name}
                          </h4>
                          <p className="text-[11px] text-[hsl(20_8%_48%)]">
                            {f.street_address}, {f.city}, {f.state}{' '}
                            {f.zip}
                          </p>
                        </div>
                        <div className="shrink-0 flex items-center gap-2">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${COMPLIANCE_CLASSES[f.compliance_status]}`}
                          >
                            {formatComplianceStatus(
                              f.compliance_status,
                            )}
                          </span>
                          <span className="text-[10px] text-[hsl(20_8%_52%)]">
                            {f.distance_miles} mi
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {f.programs.map((prog) => (
                          <span
                            key={prog}
                            className="inline-flex items-center rounded-full bg-[hsl(30_18%_90%)] px-2 py-0.5 text-[10px] font-medium text-[hsl(30_18%_40%)]"
                          >
                            {prog}
                          </span>
                        ))}
                        {f.facility_type.map((ft) => (
                          <span
                            key={ft}
                            className="inline-flex items-center rounded-full bg-[hsl(30_20%_92%)] px-2 py-0.5 text-[10px] font-medium text-[hsl(20_10%_40%)]"
                          >
                            {ft}
                          </span>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
                        <div>
                          <p className="text-[hsl(20_8%_52%)]">
                            Inspections (5yr)
                          </p>
                          <p className="font-medium text-[hsl(20_10%_20%)]">
                            {f.inspection_count_5yr}
                          </p>
                        </div>
                        <div>
                          <p className="text-[hsl(20_8%_52%)]">
                            Violations (3yr qtrs)
                          </p>
                          <p className="font-medium text-[hsl(20_10%_20%)]">
                            {f.quarters_in_violation_last_3yr}
                          </p>
                        </div>
                        <div>
                          <p className="text-[hsl(20_8%_52%)]">
                            Enforcement (5yr)
                          </p>
                          <p className="font-medium text-[hsl(20_10%_20%)]">
                            {f.enforcement_actions_5yr}
                          </p>
                        </div>
                        <div>
                          <p className="text-[hsl(20_8%_52%)]">
                            Penalties (5yr)
                          </p>
                          <p className="font-medium text-[hsl(20_10%_20%)]">
                            {f.penalties_5yr > 0
                              ? formatCurrency(f.penalties_5yr)
                              : '--'}
                          </p>
                        </div>
                      </div>

                      {f.top_chemicals &&
                        f.top_chemicals.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {f.top_chemicals.map((chem) => (
                              <span
                                key={chem}
                                className="inline-flex items-center rounded bg-red-50 px-1.5 py-0.5 text-[10px] text-red-600"
                              >
                                {chem}
                              </span>
                            ))}
                          </div>
                        )}

                      {f.total_releases_lbs != null &&
                        f.total_releases_lbs > 0 && (
                          <div className="mt-2 flex items-center gap-3 text-[10px] text-[hsl(20_8%_52%)]">
                            <span>
                              Total releases:{' '}
                              <span className="font-medium text-[hsl(20_10%_25%)]">
                                {formatNumber(
                                  f.total_releases_lbs,
                                )}{' '}
                                lbs
                              </span>
                            </span>
                            {f.air_releases_lbs != null &&
                              f.air_releases_lbs > 0 && (
                                <span>
                                  Air:{' '}
                                  {formatNumber(
                                    f.air_releases_lbs,
                                  )}{' '}
                                  lbs
                                </span>
                              )}
                            {f.water_releases_lbs != null &&
                              f.water_releases_lbs > 0 && (
                                <span>
                                  Water:{' '}
                                  {formatNumber(
                                    f.water_releases_lbs,
                                  )}{' '}
                                  lbs
                                </span>
                              )}
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* ── Sidebar ── */}
          <aside className="w-full lg:w-80 shrink-0 space-y-8">
            <SidebarStakeholders stakeholders={linkedStakeholders} />
            <SidebarOrganizations orgs={linkedOrgs} />
            <SidebarCommitments commitments={linkedCommitments} />
            <SidebarFieldNotes notes={linkedNotes} stakeholderNameById={stakeholderNameById} />
            <SidebarSignals signals={linkedSignals} />
            {linkedJourney && (
              <SidebarJourney journey={linkedJourney} />
            )}

            {/* Community Voices */}
            {(() => {
              const placeStories = MOCK_COMMUNITY_STORIES.filter(
                (s) => s.place_id === place.id && s.consent_level === 'public'
              );
              if (placeStories.length === 0) return null;
              return (
                <div>
                  <SectionHeader icon={Heart} label="Community Voices" />
                  <div className="flex flex-col gap-3">
                    {placeStories.slice(0, 3).map((story) => (
                      <div
                        key={story.id}
                        className="rounded-lg bg-white p-4 border border-[hsl(30_18%_82%)]"
                      >
                        <blockquote className="font-serif-body text-sm italic text-[hsl(20_25%_12%/0.8)] leading-relaxed border-l-[3px] border-[hsl(16_65%_48%/0.4)] pl-3 mb-2">
                          "{story.quote}"
                        </blockquote>
                        <p className="text-[11px] text-[hsl(20_25%_12%/0.55)]">
                          <span className="font-medium text-[hsl(20_25%_12%)]">{story.person_name}</span>
                          {story.location_detail && ` — ${story.location_detail}`}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </aside>
        </div>
      </div>
    </div>
  );
}
