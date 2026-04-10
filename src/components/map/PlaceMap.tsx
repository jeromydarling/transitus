/**
 * PlaceMap — Data-driven atlas-style map visualization for a Place.
 *
 * Uses real Mapbox GL JS when VITE_MAPBOX_TOKEN is set.
 * Falls back to the CSS atlas placeholder with data-driven SVG elements.
 *
 * Every visual element represents real data:
 *  - Burden Rings: EnvironmentalBurden severity, colored and sized
 *  - Facility Markers: EPA ECHO facilities, colored by compliance
 *  - Stakeholder Pins: Connected people, positioned around the edge
 *  - Active Work Markers: Diamonds showing work items by status
 */

import { lazy, Suspense, useState, useMemo, useCallback } from 'react';
import { MapPin, Mountain, AlertTriangle, Building2, Users, Briefcase, DollarSign } from 'lucide-react';
import type { EnvironmentalBurden, ActiveWork } from '@/types/transitus';
import type { ECHOFacility } from '@/lib/api/echo';
import { hasMapboxToken } from './MapboxPlaceMap';

const MapboxPlaceMap = lazy(() => import('./MapboxPlaceMap'));

// ── Design tokens ──

const SEVERITY_COLORS: Record<EnvironmentalBurden['severity'], string> = {
  critical: '#dc2626',
  high: '#ea580c',
  moderate: '#d97706',
  low: '#16a34a',
};

const SEVERITY_RADII: Record<EnvironmentalBurden['severity'], number> = {
  critical: 38,
  high: 30,
  moderate: 22,
  low: 15,
};

const COMPLIANCE_COLORS: Record<ECHOFacility['compliance_status'], string> = {
  significant_violation: '#dc2626',
  violation: '#ea580c',
  in_compliance: '#16a34a',
};

const COMPLIANCE_LABELS: Record<ECHOFacility['compliance_status'], string> = {
  significant_violation: 'Significant Violation',
  violation: 'Violation',
  in_compliance: 'In Compliance',
};

const WORK_STATUS_COLORS: Record<ActiveWork['status'], string> = {
  upcoming: '#d97706',
  in_progress: '#c2714f',
  completed: '#2d6a4f',
};

const WORK_STATUS_LABELS: Record<ActiveWork['status'], string> = {
  upcoming: 'Upcoming',
  in_progress: 'In Progress',
  completed: 'Completed',
};

const ROLE_COLORS: Record<string, string> = {
  steward: 'hsl(152 40% 28%)',
  field_companion: 'hsl(16 65% 48%)',
  listener: 'hsl(198 55% 42%)',
  convener: 'hsl(38 80% 55%)',
  analyst: 'hsl(270 40% 50%)',
  sponsor: 'hsl(20 30% 40%)',
  resident_witness: 'hsl(340 45% 50%)',
};

type LayerName = 'Burdens' | 'Facilities' | 'People' | 'Active Work' | 'Poverty';

// ── Props ──

interface PlaceMapProps {
  lat: number;
  lng: number;
  name: string;
  environmental_burdens: EnvironmentalBurden[];
  facilities?: ECHOFacility[];
  stakeholderLocations?: { id: string; name: string; role: string; initials: string }[];
  activeWork?: ActiveWork[];
  population?: number;
  povertyRate?: number;
  medianIncome?: number;
  className?: string;
}

// ── Helpers ──

/** Derive a deterministic angle from a string (e.g. registry_id). */
function hashToAngle(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return ((hash % 360) + 360) % 360;
}

/** Map facility distance to SVG distance from center. Max display radius ~40 SVG units. */
function distanceToRadius(miles: number, maxMiles: number): number {
  const clamped = Math.min(miles, maxMiles);
  // Scale 0..maxMiles to 8..40 SVG units
  return 8 + (clamped / maxMiles) * 32;
}

/** Map total_releases_lbs to dot size. */
function releasesToSize(lbs: number | undefined): number {
  if (!lbs || lbs <= 0) return 0.8;
  if (lbs < 1000) return 0.8;
  if (lbs < 10000) return 1.1;
  if (lbs < 50000) return 1.5;
  if (lbs < 100000) return 2.0;
  return 2.5;
}

function formatLbs(lbs: number | undefined): string {
  if (!lbs) return 'N/A';
  if (lbs >= 1_000_000) return `${(lbs / 1_000_000).toFixed(1)}M lbs`;
  if (lbs >= 1_000) return `${(lbs / 1_000).toFixed(1)}K lbs`;
  return `${lbs} lbs`;
}

function formatWorkType(type: ActiveWork['type']): string {
  return type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

// ── Component ──

export default function PlaceMap({
  lat,
  lng,
  name,
  environmental_burdens,
  facilities = [],
  stakeholderLocations = [],
  activeWork = [],
  population,
  povertyRate,
  medianIncome,
  className = '',
}: PlaceMapProps) {
  // Use real Mapbox when token is available
  if (hasMapboxToken()) {
    return (
      <Suspense fallback={<div className={`rounded-lg bg-[hsl(30_18%_82%/0.3)] animate-pulse ${className}`} style={{ minHeight: '300px' }} />}>
        <MapboxPlaceMap
          lat={lat} lng={lng} name={name}
          environmental_burdens={environmental_burdens}
          facilities={facilities}
          stakeholderLocations={stakeholderLocations}
          activeWork={activeWork}
          population={population}
          povertyRate={povertyRate}
          medianIncome={medianIncome}
          className={className}
        />
      </Suspense>
    );
  }

  // CSS atlas fallback
  const [show3D, setShow3D] = useState(false);
  const [activeLayers, setActiveLayers] = useState<Set<LayerName>>(
    new Set(['Burdens', 'Facilities', 'People', 'Active Work', 'Poverty']),
  );
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);

  const toggleLayer = useCallback((layer: LayerName) => {
    setActiveLayers((prev) => {
      const next = new Set(prev);
      if (next.has(layer)) next.delete(layer);
      else next.add(layer);
      return next;
    });
  }, []);

  const showTooltip = useCallback((e: React.MouseEvent<SVGElement>, text: string) => {
    const svg = (e.currentTarget as SVGElement).closest('svg');
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    setTooltip({
      text,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top - 10,
    });
  }, []);

  const hideTooltip = useCallback(() => setTooltip(null), []);

  // Center of the SVG viewBox
  const CX = 50;
  const CY = 50;

  // Compute max facility distance for scaling
  const maxFacilityDist = useMemo(() => {
    if (facilities.length === 0) return 3;
    return Math.max(...facilities.map((f) => f.distance_miles), 1);
  }, [facilities]);

  // Burden rings: sorted by severity so largest (critical) renders first (behind)
  const sortedBurdens = useMemo(() => {
    const order: EnvironmentalBurden['severity'][] = ['critical', 'high', 'moderate', 'low'];
    return [...environmental_burdens].sort(
      (a, b) => order.indexOf(a.severity) - order.indexOf(b.severity),
    );
  }, [environmental_burdens]);

  // Facility positions
  const facilityPositions = useMemo(() => {
    return facilities.map((f) => {
      const angle = (hashToAngle(f.registry_id) * Math.PI) / 180;
      const r = distanceToRadius(f.distance_miles, maxFacilityDist);
      return {
        facility: f,
        x: CX + r * Math.cos(angle),
        y: CY + r * Math.sin(angle),
        size: releasesToSize(f.total_releases_lbs),
      };
    });
  }, [facilities, maxFacilityDist]);

  // Stakeholder positions: evenly around the outer edge
  const stakeholderPositions = useMemo(() => {
    const edgeR = 44;
    return stakeholderLocations.map((s, i) => {
      const angle = (2 * Math.PI * i) / Math.max(stakeholderLocations.length, 1) - Math.PI / 2;
      return {
        ...s,
        x: CX + edgeR * Math.cos(angle),
        y: CY + edgeR * Math.sin(angle),
      };
    });
  }, [stakeholderLocations]);

  // Active work positions: clustered in a ring just outside burden rings
  const workPositions = useMemo(() => {
    const workR = 35;
    return activeWork.map((w, i) => {
      const angle = (2 * Math.PI * i) / Math.max(activeWork.length, 1) + Math.PI / 4;
      return {
        ...w,
        x: CX + workR * Math.cos(angle),
        y: CY + workR * Math.sin(angle),
      };
    });
  }, [activeWork]);

  return (
    <div
      className={`relative rounded-lg overflow-hidden border border-[hsl(30_18%_82%)] ${className}`}
      style={{ minHeight: '18rem' }}
    >
      {/* Terrain gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: show3D
            ? 'linear-gradient(135deg, hsl(152 30% 25%) 0%, hsl(30 25% 35%) 35%, hsl(16 45% 40%) 65%, hsl(20 20% 30%) 100%)'
            : 'linear-gradient(160deg, hsl(152 35% 32%) 0%, hsl(152 20% 42%) 20%, hsl(40 30% 50%) 45%, hsl(30 25% 58%) 65%, hsl(16 40% 45%) 85%, hsl(20 20% 35%) 100%)',
          transition: 'background 0.6s ease',
        }}
      />

      {/* SVG data layer */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Grid lines — 1-mile scale reference */}
        {(() => {
          // Grid spacing = SVG units per mile based on facility scale
          const spacing = maxFacilityDist > 0 ? 32 / maxFacilityDist : 16;
          const lines: React.ReactNode[] = [];
          // Vertical lines
          for (let i = -4; i <= 4; i++) {
            const x = CX + i * spacing;
            if (x < 0 || x > 100) continue;
            lines.push(
              <line
                key={`gv-${i}`}
                x1={x}
                y1={0}
                x2={x}
                y2={100}
                stroke="white"
                strokeWidth="0.15"
                opacity="0.12"
              />,
            );
          }
          // Horizontal lines
          for (let i = -4; i <= 4; i++) {
            const y = CY + i * spacing;
            if (y < 0 || y > 100) continue;
            lines.push(
              <line
                key={`gh-${i}`}
                x1={0}
                y1={y}
                x2={100}
                y2={y}
                stroke="white"
                strokeWidth="0.15"
                opacity="0.12"
              />,
            );
          }
          // Scale label on the first grid line right of center
          if (spacing > 4) {
            lines.push(
              <text
                key="scale-label"
                x={CX + spacing + 0.5}
                y={CY - 0.5}
                fontSize="2.2"
                fill="white"
                opacity="0.4"
                fontFamily="sans-serif"
              >
                ~1 mi
              </text>,
            );
          }
          return lines;
        })()}

        {/* Poverty dot-density — each dot ≈ 25 people below poverty line */}
        {activeLayers.has('Poverty') && povertyRate != null && population != null && (() => {
          const peopleInPov = Math.round(population * povertyRate / 100);
          const totalDots = Math.min(200, Math.round(peopleInPov / 25));
          const dots: React.ReactNode[] = [];
          let seed = 71;
          const rand = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };

          for (let i = 0; i < totalDots; i++) {
            // Uniform distribution across the community — not center-biased
            const angle = rand() * 2 * Math.PI;
            const radius = Math.sqrt(rand()) * 38;
            const x = CX + radius * Math.cos(angle);
            const y = CY + radius * Math.sin(angle) * 0.7;
            dots.push(
              <circle
                key={`pov-${i}`}
                cx={x} cy={y} r={1}
                fill="#7c3aed"
                opacity={0.5}
                stroke="#5b21b6"
                strokeWidth="0.2"
                strokeOpacity={0.3}
              />
            );
          }
          return dots;
        })()}

        {/* Burden Rings */}
        {activeLayers.has('Burdens') &&
          sortedBurdens.map((burden, i) => {
            const r = SEVERITY_RADII[burden.severity];
            const color = SEVERITY_COLORS[burden.severity];
            // Slight offset per-ring so overlapping rings are distinguishable
            const offset = i * 0.4;
            return (
              <ellipse
                key={`burden-${i}`}
                cx={CX + offset}
                cy={CY + offset * 0.5}
                rx={r}
                ry={r * 0.7}
                fill="none"
                stroke={color}
                strokeWidth="0.6"
                opacity={0.55}
                strokeDasharray={burden.severity === 'critical' ? 'none' : '2 1'}
                style={{ cursor: 'pointer' }}
                onMouseMove={(e) =>
                  showTooltip(
                    e,
                    `${burden.name} (${burden.severity}): ${burden.description}`,
                  )
                }
                onMouseLeave={hideTooltip}
              />
            );
          })}

        {/* Facility Markers */}
        {activeLayers.has('Facilities') &&
          facilityPositions.map((fp, i) => {
            const f = fp.facility;
            const color = COMPLIANCE_COLORS[f.compliance_status];
            const chemicals = f.top_chemicals?.slice(0, 3).join(', ') || 'None listed';
            const ttText = `${f.facility_name}\n${COMPLIANCE_LABELS[f.compliance_status]} | ${formatLbs(f.total_releases_lbs)}\nTop chemicals: ${chemicals}\nDistance: ${f.distance_miles.toFixed(1)} mi`;
            return (
              <circle
                key={`fac-${i}`}
                cx={fp.x}
                cy={fp.y}
                r={fp.size}
                fill={color}
                stroke="white"
                strokeWidth="0.25"
                opacity={0.85}
                style={{ cursor: 'pointer' }}
                onMouseMove={(e) => showTooltip(e, ttText)}
                onMouseLeave={hideTooltip}
              />
            );
          })}

        {/* Active Work Markers (diamonds) */}
        {activeLayers.has('Active Work') &&
          workPositions.map((wp, i) => {
            const color = WORK_STATUS_COLORS[wp.status];
            const d = 1.8; // half-size of diamond
            const points = `${wp.x},${wp.y - d} ${wp.x + d},${wp.y} ${wp.x},${wp.y + d} ${wp.x - d},${wp.y}`;
            const ttText = `${wp.title}\n${formatWorkType(wp.type)} - ${WORK_STATUS_LABELS[wp.status]}`;
            return (
              <polygon
                key={`work-${i}`}
                points={points}
                fill={color}
                stroke="white"
                strokeWidth="0.25"
                opacity={0.9}
                style={{ cursor: 'pointer' }}
                onMouseMove={(e) => showTooltip(e, ttText)}
                onMouseLeave={hideTooltip}
              />
            );
          })}

        {/* Stakeholder Pins */}
        {activeLayers.has('People') &&
          stakeholderPositions.map((sp, i) => {
            const color = ROLE_COLORS[sp.role] || 'hsl(20 12% 46%)';
            const ttText = `${sp.name}\nRole: ${sp.role.replace(/_/g, ' ')}`;
            return (
              <g key={`stake-${i}`}>
                <circle
                  cx={sp.x}
                  cy={sp.y}
                  r={2.2}
                  fill={color}
                  stroke="white"
                  strokeWidth="0.3"
                  opacity={0.9}
                  style={{ cursor: 'pointer' }}
                  onMouseMove={(e) => showTooltip(e, ttText)}
                  onMouseLeave={hideTooltip}
                />
                <text
                  x={sp.x}
                  y={sp.y + 0.6}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="1.8"
                  fontWeight="600"
                  fill="white"
                  style={{ pointerEvents: 'none' }}
                >
                  {sp.initials}
                </text>
              </g>
            );
          })}
      </svg>

      {/* Shadow gradient for depth */}
      {show3D && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.15) 60%, rgba(0,0,0,0.35) 100%)',
          }}
        />
      )}

      {/* Central pin marker */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div
              className="absolute inset-0 -m-3 rounded-full border-2 border-white/20 animate-ping"
              style={{ animationDuration: '3s' }}
            />
            <div className="relative bg-white/15 backdrop-blur-sm rounded-full p-3 border border-white/25 shadow-lg">
              <MapPin className="h-8 w-8 text-white drop-shadow-md" />
            </div>
          </div>
          <span className="mt-2 text-sm font-serif font-medium text-white/90 drop-shadow-md tracking-wide">
            {name}
          </span>
          {population != null && population > 0 && (
            <span className="text-[10px] text-white/60 drop-shadow-sm">
              Pop. ~{population.toLocaleString()}
            </span>
          )}
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute z-50 pointer-events-none bg-black/80 backdrop-blur-sm text-white text-[10px] leading-snug rounded-md px-2.5 py-1.5 border border-white/10 max-w-[220px] whitespace-pre-line"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: 'translate(-50%, -100%)',
          }}
        >
          {tooltip.text}
        </div>
      )}

      {/* Coordinate badge — bottom-left */}
      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/30 backdrop-blur-sm rounded-md px-2.5 py-1.5 border border-white/10">
        <MapPin className="h-3 w-3 text-white/60" />
        <span className="text-[11px] font-mono text-white/80 tracking-wide">
          {lat.toFixed(4)}&#176;N, {Math.abs(lng).toFixed(4)}&#176;
          {lng >= 0 ? 'E' : 'W'}
        </span>
      </div>

      {/* Environmental burden gradient bar */}
      {activeLayers.has('Burdens') && environmental_burdens.length > 0 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/10">
          <p className="text-[9px] font-semibold uppercase tracking-widest text-white/50 mb-1.5 text-center">Environmental Burden Index</p>
          <div className="w-56 h-2.5 rounded-full overflow-hidden" style={{
            background: 'linear-gradient(to right, #16a34a, #65a30d, #d97706, #ea580c, #dc2626, #991b1b)',
          }} />
          <div className="flex justify-between mt-1">
            <span className="text-[8px] text-white/50">Low</span>
            <span className="text-[8px] text-white/50">Moderate</span>
            <span className="text-[8px] text-white/50">High</span>
            <span className="text-[8px] text-white/50">Critical</span>
          </div>
        </div>
      )}

      {/* Poverty legend — top-left */}
      {activeLayers.has('Poverty') && povertyRate != null && population != null && (
        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm rounded-lg px-2.5 py-1.5 border border-white/15 shadow-lg">
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-2 h-2 rounded-full bg-[#7c3aed]/80" />
            <span className="text-[9px] text-white/50 font-medium">1 dot ≈ 25 people below poverty line</span>
          </div>
          <p className="text-xs font-semibold text-white">
            {Math.round(population * povertyRate / 100).toLocaleString()} people ({povertyRate}%)
          </p>
          {medianIncome != null && (
            <p className="text-[9px] text-white/40 mt-0.5">Median income: ${medianIncome.toLocaleString()}</p>
          )}
        </div>
      )}

      {/* Layer control panel — top-right */}
      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md rounded-xl border border-white/15 shadow-xl overflow-hidden" style={{ minWidth: 175 }}>
        <div className="px-3 py-1.5 border-b border-white/10">
          <p className="text-[9px] font-semibold uppercase tracking-widest text-white/50">Map Layers</p>
        </div>
        {/* 3D terrain */}
        <button onClick={() => setShow3D(!show3D)}
          className="w-full flex items-center gap-2.5 px-3 py-2 transition-all hover:bg-white/5 text-left border-b border-white/5"
        >
          <div className={`flex items-center justify-center w-7 h-7 rounded-lg transition-all ${show3D ? 'bg-white/20' : 'bg-white/5'}`}>
            <Mountain className="h-3.5 w-3.5" style={{ color: show3D ? '#c2553a' : 'rgba(255,255,255,0.3)' }} />
          </div>
          <div className="flex-1">
            <p className={`text-xs font-medium leading-tight ${show3D ? 'text-white' : 'text-white/40'}`}>3D Terrain</p>
          </div>
          <div className={`w-3 h-3 rounded-full border-2 transition-all ${show3D ? 'border-white/60 bg-white/30' : 'border-white/15'}`} />
        </button>
        {/* Layer rows */}
        {([
          { key: 'Poverty' as LayerName, icon: DollarSign, label: 'Poverty', stat: population && povertyRate ? `${Math.round(population * povertyRate / 100).toLocaleString()} people · ${povertyRate}%` : null, color: '#7c3aed', show: povertyRate != null },
          { key: 'Burdens' as LayerName, icon: AlertTriangle, label: 'Env. Burdens', stat: `${environmental_burdens.length} identified`, color: '#dc2626', show: environmental_burdens.length > 0 },
          { key: 'Facilities' as LayerName, icon: Building2, label: 'Facilities', stat: `${facilities.length} EPA-tracked`, color: '#ea580c', show: facilities.length > 0 },
          { key: 'People' as LayerName, icon: Users, label: 'Stakeholders', stat: `${stakeholderLocations.length} connected`, color: '#2d6a4f', show: stakeholderLocations.length > 0 },
          { key: 'Active Work' as LayerName, icon: Briefcase, label: 'Active Work', stat: `${activeWork.length} items`, color: '#c2553a', show: activeWork.length > 0 },
        ]).filter(l => l.show).map(l => {
          const active = activeLayers.has(l.key);
          return (
            <button key={l.key} onClick={() => toggleLayer(l.key)}
              className="w-full flex items-center gap-2.5 px-3 py-2 transition-all hover:bg-white/5 text-left border-b border-white/5 last:border-b-0"
            >
              <div className={`flex items-center justify-center w-7 h-7 rounded-lg transition-all ${active ? 'bg-white/20' : 'bg-white/5'}`}>
                <l.icon className="h-3.5 w-3.5" style={{ color: active ? l.color : 'rgba(255,255,255,0.3)' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-medium leading-tight transition-colors ${active ? 'text-white' : 'text-white/40'}`}>{l.label}</p>
                {l.stat && <p className={`text-[9px] leading-tight mt-0.5 transition-colors ${active ? 'text-white/50' : 'text-white/20'}`}>{l.stat}</p>}
              </div>
              <div className={`w-3 h-3 rounded-full border-2 transition-all ${active ? 'border-white/60 bg-white/30' : 'border-white/15'}`} />
            </button>
          );
        })}
        {/* Dot legend when poverty active */}
        {activeLayers.has('Poverty') && povertyRate != null && (
          <div className="px-3 py-1.5 border-t border-white/10 bg-white/5">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#7c3aed]/80" />
              <span className="text-[9px] text-white/50">1 dot ≈ 25 people below poverty line</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
