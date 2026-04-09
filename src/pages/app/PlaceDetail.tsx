import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { MOCK_PLACES, MOCK_STAKEHOLDERS, MOCK_ORGS, MOCK_COMMITMENTS, MOCK_FIELD_NOTES, MOCK_SIGNALS, MOCK_JOURNEYS } from '@/lib/mockData';
import { fetchEJScreenData, fetchNearbyFacilities, fetchCensusProfile, fetchHazardRisks } from '@/lib/api';
import type { EJScreenResult } from '@/lib/api/ejscreen';
import type { ECHOFacility } from '@/lib/api/echo';
import type { CensusProfile } from '@/lib/api/census';
import type { HazardRisk } from '@/lib/api/noaa';
import { COMMITMENT_STATUS_LABELS, ROLE_LABELS } from '@/types/transitus';
import {
  MapPin, Users, Handshake, NotebookPen, Radio, BookOpen, Globe,
  AlertTriangle, Building2, Droplets, Wind, Thermometer, ArrowLeft, Activity,
} from 'lucide-react';

const severityColors: Record<string, string> = {
  critical: 'bg-red-100 text-red-700', high: 'bg-orange-100 text-orange-700',
  moderate: 'bg-amber-100 text-amber-700', low: 'bg-green-100 text-green-700',
};
const statusColors: Record<string, string> = {
  proposed: 'bg-blue-100 text-blue-700', acknowledged: 'bg-slate-100 text-slate-600',
  accepted: 'bg-teal-100 text-teal-700', in_motion: 'bg-green-100 text-green-700',
  delayed: 'bg-amber-100 text-amber-700', breached: 'bg-red-100 text-red-700',
  repaired: 'bg-purple-100 text-purple-700', completed: 'bg-emerald-100 text-emerald-700',
};

export default function PlaceDetail() {
  const { id } = useParams();
  const place = MOCK_PLACES.find(p => p.id === id);
  const [ejData, setEjData] = useState<EJScreenResult | null>(null);
  const [facilities, setFacilities] = useState<ECHOFacility[]>([]);
  const [census, setCensus] = useState<CensusProfile | null>(null);
  const [hazards, setHazards] = useState<HazardRisk[]>([]);

  useEffect(() => {
    if (!place) return;
    fetchEJScreenData(place.lat, place.lng).then(setEjData);
    fetchNearbyFacilities({ lat: place.lat, lng: place.lng, radius_miles: 3 }).then(setFacilities);
    fetchCensusProfile(place.lat, place.lng).then(setCensus);
    fetchHazardRisks(place.lat, place.lng).then(setHazards);
  }, [place]);

  if (!place) return <div className="p-8 text-center">Place not found.</div>;

  const stakeholders = MOCK_STAKEHOLDERS.filter(s => s.place_ids.includes(place.id));
  const orgs = MOCK_ORGS.filter(o => o.place_ids.includes(place.id));
  const commitments = MOCK_COMMITMENTS.filter(c => c.place_ids.includes(place.id));
  const notes = MOCK_FIELD_NOTES.filter(n => n.place_id === place.id);
  const signals = MOCK_SIGNALS.filter(s => s.place_ids.includes(place.id));
  const journey = MOCK_JOURNEYS.find(j => j.place_id === place.id);

  return (
    <div className="min-h-screen bg-[hsl(38_30%_95%)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <Link to="/app/places" className="inline-flex items-center gap-1.5 text-sm text-[hsl(16_65%_48%)] hover:underline mb-4">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to places
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded text-xs font-medium bg-[hsl(38_80%_55%/0.15)] text-[hsl(32_70%_45%)]">{place.place_type.replace(/_/g, ' ')}</span>
            <span className="text-sm text-[hsl(20_25%_12%/0.5)]">{place.geography}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[hsl(20_25%_12%)] mb-3">{place.name}</h1>
          <p className="font-serif-body text-base text-[hsl(20_25%_12%/0.7)] leading-relaxed max-w-3xl">{place.description}</p>
        </div>

        <div className="grid lg:grid-cols-[1fr_340px] gap-6">
          {/* Main Column */}
          <div className="space-y-6">
            {/* Map Placeholder */}
            <div className="rounded-xl overflow-hidden h-64 relative gradient-terrain">
              <div className="absolute inset-0 contour-pattern opacity-30" />
              <div className="absolute inset-0 meridian-grid opacity-20" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-[hsl(38_35%_90%)]">
                <Globe className="h-12 w-12 mb-3 opacity-50" />
                <p className="text-sm font-medium opacity-70">Map integration coming soon</p>
                <p className="text-xs opacity-50 mt-1">{place.lat.toFixed(4)}°N, {Math.abs(place.lng).toFixed(4)}°W</p>
              </div>
            </div>

            {/* Environmental Burdens */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="h-4 w-4 text-[hsl(16_65%_48%)]" />
                <span className="font-sans text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">Environmental Burdens</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {place.environmental_burdens.map((b, i) => (
                  <div key={i} className="rounded-lg bg-white p-4 border border-[hsl(30_18%_82%)]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-sans text-sm font-semibold text-[hsl(20_25%_12%)]">{b.name}</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${severityColors[b.severity]}`}>{b.severity}</span>
                    </div>
                    <p className="text-xs text-[hsl(20_25%_12%/0.6)] leading-relaxed">{b.description}</p>
                    {b.source && <p className="text-[10px] text-[hsl(20_25%_12%/0.4)] mt-2">Source: {b.source}</p>}
                  </div>
                ))}
              </div>
            </section>

            {/* EJScreen Data */}
            {ejData && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="h-4 w-4 text-[hsl(198_55%_42%)]" />
                  <span className="font-sans text-xs font-semibold uppercase tracking-widest text-[hsl(198_55%_42%)]">EPA EJScreen Indicators</span>
                </div>
                <div className="rounded-lg bg-white p-5 border border-[hsl(30_18%_82%)]">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {[ejData.pm25, ejData.diesel_pm, ejData.air_toxics_cancer_risk, ejData.traffic_proximity, ejData.rmp_proximity, ejData.hazardous_waste].map((ind) => (
                      <div key={ind.name}>
                        <p className="text-[10px] uppercase tracking-wider text-[hsl(20_25%_12%/0.45)] mb-1">{ind.name}</p>
                        <p className="text-lg font-semibold text-[hsl(20_25%_12%)]">{ind.value} <span className="text-xs font-normal text-[hsl(20_25%_12%/0.5)]">{ind.unit}</span></p>
                        <div className="flex gap-2 mt-1">
                          <span className="text-[10px] text-[hsl(20_25%_12%/0.5)]">State: {ind.percentile_state}th</span>
                          <span className="text-[10px] text-[hsl(20_25%_12%/0.5)]">National: {ind.percentile_national}th</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Census Data */}
            {census && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Users className="h-4 w-4 text-[hsl(152_40%_24%)]" />
                  <span className="font-sans text-xs font-semibold uppercase tracking-widest text-[hsl(152_40%_24%)]">Community Demographics (ACS)</span>
                </div>
                <div className="rounded-lg bg-white p-5 border border-[hsl(30_18%_82%)]">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { label: 'Population', value: census.total_population.toLocaleString() },
                      { label: 'Median Income', value: `$${census.median_household_income.toLocaleString()}` },
                      { label: 'Below Poverty', value: `${census.pct_below_poverty}%` },
                      { label: 'Hispanic', value: `${census.pct_hispanic}%` },
                      { label: 'No Vehicle', value: `${census.pct_no_vehicle}%` },
                      { label: 'Cost-Burdened Renters', value: `${census.pct_cost_burdened_renters}%` },
                      { label: 'Pre-1960 Housing', value: `${census.pct_built_before_1960}%` },
                      { label: 'Uninsured', value: `${census.pct_uninsured}%` },
                    ].map((stat) => (
                      <div key={stat.label}>
                        <p className="text-[10px] uppercase tracking-wider text-[hsl(20_25%_12%/0.45)] mb-1">{stat.label}</p>
                        <p className="text-lg font-semibold text-[hsl(20_25%_12%)]">{stat.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Hazard Risks */}
            {hazards.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Thermometer className="h-4 w-4 text-[hsl(16_65%_48%)]" />
                  <span className="font-sans text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">Climate & Hazard Risks</span>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {hazards.map((h) => (
                    <div key={h.hazard_type} className="rounded-lg bg-white p-4 border border-[hsl(30_18%_82%)]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-sans text-sm font-semibold text-[hsl(20_25%_12%)] capitalize">{h.hazard_type.replace(/_/g, ' ')}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${h.risk_level === 'very_high' ? 'bg-red-100 text-red-700' : h.risk_level === 'high' ? 'bg-orange-100 text-orange-700' : 'bg-amber-100 text-amber-700'}`}>{h.risk_level.replace(/_/g, ' ')}</span>
                      </div>
                      <p className="text-xs text-[hsl(20_25%_12%/0.6)] leading-relaxed">{h.description}</p>
                      <p className="text-[10px] text-[hsl(20_25%_12%/0.4)] mt-2">{h.projected_change}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Nearby Facilities (ECHO) */}
            {facilities.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="h-4 w-4 text-[hsl(20_25%_12%/0.6)]" />
                  <span className="font-sans text-xs font-semibold uppercase tracking-widest text-[hsl(20_25%_12%/0.6)]">Nearby Regulated Facilities (EPA ECHO)</span>
                </div>
                <div className="space-y-3">
                  {facilities.map((f) => (
                    <div key={f.registry_id} className="rounded-lg bg-white p-4 border border-[hsl(30_18%_82%)]">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-sans text-sm font-semibold text-[hsl(20_25%_12%)]">{f.facility_name}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${f.compliance_status === 'significant_violation' ? 'bg-red-100 text-red-700' : f.compliance_status === 'violation' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>{f.compliance_status.replace(/_/g, ' ')}</span>
                      </div>
                      <p className="text-xs text-[hsl(20_25%_12%/0.5)]">{f.street_address} — {f.distance_miles} mi</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {f.programs.map(p => <span key={p} className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600">{p}</span>)}
                      </div>
                      {f.top_chemicals && f.top_chemicals.length > 0 && (
                        <p className="text-[10px] text-[hsl(20_25%_12%/0.4)] mt-2">Top releases: {f.top_chemicals.join(', ')}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Active Work */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Activity className="h-4 w-4 text-[hsl(152_40%_24%)]" />
                <span className="font-sans text-xs font-semibold uppercase tracking-widest text-[hsl(152_40%_24%)]">Active Work</span>
              </div>
              <div className="space-y-2">
                {place.active_work.map((w) => (
                  <div key={w.id} className="rounded-lg bg-white px-4 py-3 border border-[hsl(30_18%_82%)] flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-[hsl(20_25%_12%)]">{w.title}</span>
                      {w.date && <span className="ml-2 text-xs text-[hsl(20_25%_12%/0.5)]">{w.date}</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600">{w.type.replace(/_/g, ' ')}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] ${w.status === 'upcoming' ? 'bg-blue-100 text-blue-700' : w.status === 'in_progress' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>{w.status.replace(/_/g, ' ')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stakeholders */}
            <div className="rounded-lg bg-white p-4 border border-[hsl(30_18%_82%)]">
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-4 w-4 text-[hsl(16_65%_48%)]" />
                <span className="font-sans text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">Stakeholders</span>
              </div>
              <div className="space-y-2">
                {stakeholders.slice(0, 6).map((s) => (
                  <Link key={s.id} to={`/app/people/${s.id}`} className="flex items-center gap-2 py-1.5 hover:bg-[hsl(38_30%_95%)] rounded px-1 -mx-1 transition-colors">
                    <div className="w-7 h-7 rounded-full bg-[hsl(16_65%_48%/0.1)] flex items-center justify-center text-[10px] font-semibold text-[hsl(16_65%_48%)]">{s.name.split(' ').map(n=>n[0]).join('')}</div>
                    <div>
                      <p className="text-sm font-medium text-[hsl(20_25%_12%)]">{s.name}</p>
                      <p className="text-[10px] text-[hsl(20_25%_12%/0.5)]">{ROLE_LABELS[s.role]}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Organizations */}
            <div className="rounded-lg bg-white p-4 border border-[hsl(30_18%_82%)]">
              <div className="flex items-center gap-2 mb-3">
                <Building2 className="h-4 w-4 text-[hsl(198_55%_42%)]" />
                <span className="font-sans text-xs font-semibold uppercase tracking-widest text-[hsl(198_55%_42%)]">Organizations</span>
              </div>
              <div className="space-y-2">
                {orgs.map((o) => (
                  <div key={o.id} className="py-1.5">
                    <p className="text-sm font-medium text-[hsl(20_25%_12%)]">{o.name}</p>
                    <p className="text-[10px] text-[hsl(20_25%_12%/0.5)]">{o.org_type.replace(/_/g, ' ')}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Commitments */}
            <div className="rounded-lg bg-white p-4 border border-[hsl(30_18%_82%)]">
              <div className="flex items-center gap-2 mb-3">
                <Handshake className="h-4 w-4 text-[hsl(152_40%_24%)]" />
                <span className="font-sans text-xs font-semibold uppercase tracking-widest text-[hsl(152_40%_24%)]">Commitments</span>
              </div>
              <div className="space-y-2">
                {commitments.map((c) => (
                  <Link key={c.id} to="/app/commitments" className="block py-1.5 hover:bg-[hsl(38_30%_95%)] rounded px-1 -mx-1 transition-colors">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-[hsl(20_25%_12%)] truncate pr-2">{c.title}</p>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] shrink-0 ${statusColors[c.status] || 'bg-slate-100 text-slate-600'}`}>{COMMITMENT_STATUS_LABELS[c.status]}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Field Notes */}
            <div className="rounded-lg bg-white p-4 border border-[hsl(30_18%_82%)]">
              <div className="flex items-center gap-2 mb-3">
                <NotebookPen className="h-4 w-4 text-[hsl(38_80%_55%)]" />
                <span className="font-sans text-xs font-semibold uppercase tracking-widest text-[hsl(38_80%_55%)]">Recent Notes</span>
              </div>
              <div className="space-y-2">
                {notes.slice(0, 3).map((n) => {
                  const author = MOCK_STAKEHOLDERS.find(s => s.id === n.author_id);
                  return (
                    <Link key={n.id} to="/app/field-notes" className="block py-1.5 hover:bg-[hsl(38_30%_95%)] rounded px-1 -mx-1 transition-colors">
                      <p className="text-xs text-[hsl(20_25%_12%/0.5)]">{author?.name} — {n.note_type.replace(/_/g, ' ')}</p>
                      <p className="text-sm text-[hsl(20_25%_12%/0.7)] line-clamp-2">{n.content.slice(0, 100)}...</p>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Journey link */}
            {journey && (
              <Link to={`/app/journeys/${journey.id}`} className="block rounded-lg bg-white p-4 border border-[hsl(30_18%_82%)] hover:border-[hsl(16_65%_48%/0.3)] transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="h-4 w-4 text-[hsl(16_65%_48%)]" />
                  <span className="font-sans text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">Journey</span>
                </div>
                <p className="text-sm font-medium text-[hsl(20_25%_12%)]">{journey.title}</p>
                <p className="text-[10px] text-[hsl(20_25%_12%/0.5)] mt-1">{journey.chapters.length} chapters</p>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
