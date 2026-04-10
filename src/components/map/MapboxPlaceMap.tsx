/**
 * MapboxPlaceMap — Real Mapbox GL JS map with data overlays.
 * Shows facilities, burdens, stakeholders, and active work on an interactive map.
 */

import { useState, useMemo, useCallback, useRef } from 'react';
import Map, { Marker, NavigationControl, Source, Layer, Popup } from 'react-map-gl';
import type { MapRef } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin, Building2, AlertTriangle, Users, Briefcase, DollarSign } from 'lucide-react';
import type { EnvironmentalBurden, ActiveWork } from '@/types/transitus';
import type { ECHOFacility } from '@/lib/api/echo';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || '';

const SEVERITY_COLORS: Record<string, string> = {
  critical: '#dc2626', high: '#ea580c', moderate: '#d97706', low: '#16a34a',
};

const COMPLIANCE_COLORS: Record<string, string> = {
  significant_violation: '#dc2626', violation: '#ea580c', in_compliance: '#16a34a',
};

const ROLE_COLORS: Record<string, string> = {
  steward: '#2d6a4f', field_companion: '#c2553a', listener: '#3a86a8',
  convener: '#d4973b', analyst: '#7c3aed', sponsor: '#6b4a3a', resident_witness: '#c2553a',
};

const WORK_COLORS: Record<string, string> = {
  upcoming: '#d97706', in_progress: '#c2553a', completed: '#2d6a4f',
};

interface StakeholderLocation {
  id: string; name: string; role: string; initials: string;
}

interface MapboxPlaceMapProps {
  lat: number;
  lng: number;
  name: string;
  environmental_burdens: EnvironmentalBurden[];
  facilities?: ECHOFacility[];
  stakeholderLocations?: StakeholderLocation[];
  activeWork?: ActiveWork[];
  population?: number;
  povertyRate?: number;      // pct_below_poverty from Census
  medianIncome?: number;     // median_household_income from Census
  className?: string;
}

interface PopupInfo {
  lat: number; lng: number; title: string; detail: string; color: string;
}

/** Build a GeoJSON circle polygon (approximation) for a given center + radius in km. */
function geoCircle(centerLng: number, centerLat: number, radiusKm: number, points = 64) {
  const coords: [number, number][] = [];
  for (let i = 0; i <= points; i++) {
    const angle = (i / points) * 2 * Math.PI;
    const dx = radiusKm * Math.cos(angle);
    const dy = radiusKm * Math.sin(angle);
    const lat2 = centerLat + (dy / 111.32);
    const lng2 = centerLng + (dx / (111.32 * Math.cos(centerLat * Math.PI / 180)));
    coords.push([lng2, lat2]);
  }
  return coords;
}

/** Poverty rate → fill color (solid). National avg ~11.6%. */
function povertyFillColor(rate: number): string {
  if (rate >= 30) return '#991b1b';   // deep red — extreme
  if (rate >= 20) return '#dc2626';   // red — very high
  if (rate >= 15) return '#ea580c';   // orange — high
  return '#d97706';                    // amber — elevated
}

function povertyFillOpacity(rate: number): number {
  if (rate >= 30) return 0.22;
  if (rate >= 20) return 0.18;
  if (rate >= 15) return 0.14;
  return 0.10;
}

function povertyBorderColor(rate: number): string {
  if (rate >= 30) return '#991b1b';
  if (rate >= 20) return '#dc2626';
  if (rate >= 15) return '#ea580c';
  return '#d97706';
}

export default function MapboxPlaceMap({
  lat, lng, name, environmental_burdens, facilities = [],
  stakeholderLocations = [], activeWork = [], population,
  povertyRate, medianIncome, className = '',
}: MapboxPlaceMapProps) {
  const [popup, setPopup] = useState<PopupInfo | null>(null);
  const [mapStyle, setMapStyle] = useState<'mineral' | 'atlas' | 'classic' | 'bw' | 'satellite' | 'dark'>('classic');
  const [showLayers, setShowLayers] = useState({ facilities: true, burdens: true, people: true, work: true, poverty: true });

  const styleConfig: Record<string, { url: string; pitch: number; label: string }> = {
    mineral: { url: 'mapbox://styles/mapbox/cjtep62gq54l21frr1whf27ak', pitch: 0, label: 'Mineral' },
    atlas: { url: 'mapbox://styles/transitu/cmns6pcce006u01s788y95ct8', pitch: 45, label: 'Atlas 3D' },
    classic: { url: 'mapbox://styles/transitu/cmns7i5r4000001si3upk9hai', pitch: 0, label: 'Classic' },
    bw: { url: 'mapbox://styles/transitu/cmns7lexz003h01s73cazcfqq', pitch: 0, label: 'B&W' },
    satellite: { url: 'mapbox://styles/mapbox/satellite-streets-v12', pitch: 45, label: 'Satellite' },
    dark: { url: 'mapbox://styles/mapbox/navigation-night-v1', pitch: 45, label: 'Night' },
  };

  // Facility GeoJSON for circle layer
  const facilityGeoJson = useMemo(() => ({
    type: 'FeatureCollection' as const,
    features: facilities.map(f => ({
      type: 'Feature' as const,
      geometry: { type: 'Point' as const, coordinates: [f.lng, f.lat] },
      properties: {
        name: f.facility_name,
        compliance: f.compliance_status,
        color: COMPLIANCE_COLORS[f.compliance_status] || '#888',
        radius: Math.max(8, Math.min(22, Math.sqrt((f.total_releases_lbs || 0) / 500))),
      },
    })),
  }), [facilities]);

  // Spread stakeholders in a circle around the center
  const stakeholderPositions = useMemo(() =>
    stakeholderLocations.map((s, i) => {
      const angle = (2 * Math.PI * i) / stakeholderLocations.length - Math.PI / 2;
      const offsetLat = 0.005 * Math.sin(angle);
      const offsetLng = 0.005 * Math.cos(angle);
      return { ...s, lat: lat + offsetLat, lng: lng + offsetLng };
    }),
  [stakeholderLocations, lat, lng]);

  // Spread active work in a smaller circle
  const workPositions = useMemo(() =>
    activeWork.map((w, i) => {
      const angle = (2 * Math.PI * i) / activeWork.length;
      const offsetLat = 0.003 * Math.sin(angle);
      const offsetLng = 0.003 * Math.cos(angle);
      return { ...w, lat: lat + offsetLat, lng: lng + offsetLng };
    }),
  [activeWork, lat, lng]);

  // Burden heatmap — concentric circles representing pollution intensity
  const burdenHeatmapGeoJson = useMemo(() => {
    if (!environmental_burdens.length) return null;
    const severityWeight: Record<string, number> = { critical: 1.0, high: 0.7, moderate: 0.4, low: 0.2 };
    // Create concentric points spreading outward to simulate a heatmap
    const features: any[] = [];
    environmental_burdens.forEach((b, i) => {
      const weight = severityWeight[b.severity] || 0.3;
      const angle = (2 * Math.PI * i) / environmental_burdens.length;
      // Multiple rings per burden for heatmap density
      for (let ring = 0; ring < 5; ring++) {
        const dist = 0.002 + ring * 0.001;
        const jitter = (Math.random() - 0.5) * 0.001;
        features.push({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [lng + dist * Math.cos(angle) + jitter, lat + dist * Math.sin(angle) + jitter],
          },
          properties: { weight, severity: b.severity },
        });
      }
    });
    return { type: 'FeatureCollection', features };
  }, [environmental_burdens, lat, lng]);

  // Poverty zone — census-tract–sized circle showing poverty rate
  const povertyGeoJson = useMemo(() => {
    if (povertyRate == null) return null;
    // ~1.5km radius approximates a census tract in a dense urban area
    const coords = geoCircle(lng, lat, 1.5);
    return {
      type: 'FeatureCollection' as const,
      features: [{
        type: 'Feature' as const,
        geometry: { type: 'Polygon' as const, coordinates: [coords] },
        properties: { rate: povertyRate },
      }],
    };
  }, [lat, lng, povertyRate]);

  const mapRef = useRef<MapRef>(null);

  const onMapLoad = useCallback(() => {}, []);

  const toggleLayer = (key: keyof typeof showLayers) => {
    setShowLayers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className={`relative rounded-lg overflow-hidden border border-[hsl(30_18%_82%)] ${className}`} style={{ minHeight: '300px' }}>
      <Map
        ref={mapRef}
        initialViewState={{ longitude: lng, latitude: lat, zoom: 15, pitch: styleConfig[mapStyle].pitch, bearing: styleConfig[mapStyle].pitch > 0 ? -15 : 0 }}
        style={{ width: '100%', height: '100%' }}
        mapStyle={styleConfig[mapStyle].url}
        mapboxAccessToken={MAPBOX_TOKEN}
        attributionControl={false}
        onClick={() => setPopup(null)}
        onLoad={onMapLoad}
      >
        <NavigationControl position="top-right" showCompass={false} />

        {/* Facility circles layer */}
        {showLayers.facilities && facilityGeoJson.features.length > 0 && (
          <Source id="facilities" type="geojson" data={facilityGeoJson}>
            <Layer
              id="facility-circles"
              type="circle"
              paint={{
                'circle-radius': ['get', 'radius'],
                'circle-color': ['get', 'color'],
                'circle-opacity': 0.5,
                'circle-stroke-width': 2,
                'circle-stroke-color': '#fff',
                'circle-stroke-opacity': 0.8,
              }}
            />
          </Source>
        )}

        {/* Pollution heatmap overlay from burden data */}
        {showLayers.burdens && burdenHeatmapGeoJson && (
          <Source id="burden-heatmap" type="geojson" data={burdenHeatmapGeoJson}>
            <Layer
              id="burden-heatmap-layer"
              type="heatmap"
              paint={{
                'heatmap-weight': ['get', 'weight'],
                'heatmap-intensity': 1.5,
                'heatmap-radius': 60,
                'heatmap-opacity': 0.65,
                'heatmap-color': [
                  'interpolate', ['linear'], ['heatmap-density'],
                  0, 'rgba(0,0,0,0)',
                  0.2, 'rgba(214,158,46,0.3)',
                  0.4, 'rgba(234,88,12,0.4)',
                  0.6, 'rgba(220,38,38,0.5)',
                  0.8, 'rgba(185,28,28,0.6)',
                  1.0, 'rgba(127,29,29,0.7)',
                ],
              }}
            />
          </Source>
        )}

        {/* Poverty zone overlay */}
        {showLayers.poverty && povertyGeoJson && povertyRate != null && (
          <>
            <Source id="poverty-zone" type="geojson" data={povertyGeoJson}>
              <Layer
                id="poverty-fill"
                type="fill"
                paint={{
                  'fill-color': povertyFillColor(povertyRate),
                  'fill-opacity': povertyFillOpacity(povertyRate),
                }}
              />
              <Layer
                id="poverty-outline"
                type="line"
                paint={{
                  'line-color': povertyBorderColor(povertyRate),
                  'line-width': 2.5,
                  'line-opacity': 0.7,
                  'line-dasharray': [4, 3],
                }}
              />
            </Source>
            {/* Poverty data callout — positioned NE of center */}
            <Marker longitude={lng + 0.004} latitude={lat + 0.004} anchor="bottom-left">
              <div className="bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/15 shadow-lg max-w-[160px]">
                <p className="text-[9px] uppercase tracking-widest text-white/50 font-semibold mb-1">Poverty Rate</p>
                <p className="text-lg font-bold text-white leading-none">{povertyRate}%</p>
                <p className="text-[10px] text-white/50 mt-0.5">below poverty line</p>
                {medianIncome != null && (
                  <p className="text-[10px] text-white/60 mt-1 border-t border-white/10 pt-1">
                    Median income: <span className="text-white/80 font-medium">${medianIncome.toLocaleString()}</span>
                  </p>
                )}
                <p className="text-[9px] text-white/40 mt-1">
                  National avg: 11.6%
                </p>
              </div>
            </Marker>
          </>
        )}

        {/* Burden radius rings as circle markers */}
        {showLayers.burdens && environmental_burdens.map((b, i) => {
          const severity = b.severity;
          const radius = severity === 'critical' ? 0.008 : severity === 'high' ? 0.006 : severity === 'moderate' ? 0.004 : 0.002;
          const angle = (2 * Math.PI * i) / environmental_burdens.length;
          return (
            <Marker key={`burden-${i}`} longitude={lng + radius * Math.cos(angle) * 0.3} latitude={lat + radius * Math.sin(angle) * 0.3} anchor="center">
              <div
                className="rounded-full border-2 cursor-pointer"
                style={{
                  width: severity === 'critical' ? 28 : severity === 'high' ? 22 : severity === 'moderate' ? 18 : 14,
                  height: severity === 'critical' ? 28 : severity === 'high' ? 22 : severity === 'moderate' ? 18 : 14,
                  backgroundColor: SEVERITY_COLORS[severity] + '30',
                  borderColor: SEVERITY_COLORS[severity],
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setPopup({
                    lat: lat + radius * Math.sin(angle) * 0.3,
                    lng: lng + radius * Math.cos(angle) * 0.3,
                    title: b.name, detail: `${b.severity} · ${b.description}`,
                    color: SEVERITY_COLORS[severity],
                  });
                }}
              />
            </Marker>
          );
        })}

        {/* Facility markers with click */}
        {showLayers.facilities && facilities.map(f => (
          <Marker key={f.registry_id} longitude={f.lng} latitude={f.lat} anchor="center">
            <div
              className="cursor-pointer p-1 rounded-full bg-white/80 shadow-sm"
              onClick={(e) => {
                e.stopPropagation();
                setPopup({
                  lat: f.lat, lng: f.lng, title: f.facility_name,
                  detail: `${f.compliance_status.replace(/_/g, ' ')} · ${(f.total_releases_lbs || 0).toLocaleString()} lbs${f.top_chemicals?.length ? ' · ' + f.top_chemicals.slice(0, 2).join(', ') : ''}`,
                  color: COMPLIANCE_COLORS[f.compliance_status] || '#888',
                });
              }}
            >
              <Building2 className="h-4 w-4" style={{ color: COMPLIANCE_COLORS[f.compliance_status] || '#888' }} />
            </div>
          </Marker>
        ))}

        {/* Stakeholder pins */}
        {showLayers.people && stakeholderPositions.map(s => (
          <Marker key={s.id} longitude={s.lng} latitude={s.lat} anchor="center">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold text-white border-2 border-white shadow-md cursor-pointer"
              style={{ backgroundColor: ROLE_COLORS[s.role] || '#6b4a3a' }}
              onClick={(e) => {
                e.stopPropagation();
                setPopup({ lat: s.lat, lng: s.lng, title: s.name, detail: s.role.replace(/_/g, ' '), color: ROLE_COLORS[s.role] || '#6b4a3a' });
              }}
            >
              {s.initials}
            </div>
          </Marker>
        ))}

        {/* Active work markers */}
        {showLayers.work && workPositions.map(w => (
          <Marker key={w.id} longitude={w.lng} latitude={w.lat} anchor="center">
            <div
              className="w-5 h-5 rotate-45 rounded-sm border-2 border-white shadow-sm cursor-pointer"
              style={{ backgroundColor: WORK_COLORS[w.status] || '#888' }}
              onClick={(e) => {
                e.stopPropagation();
                setPopup({ lat: w.lat, lng: w.lng, title: w.title, detail: `${w.type.replace(/_/g, ' ')} · ${w.status}`, color: WORK_COLORS[w.status] || '#888' });
              }}
            />
          </Marker>
        ))}

        {/* Center pin — pulsing */}
        <Marker longitude={lng} latitude={lat} anchor="center">
          <div className="relative flex items-center justify-center">
            {/* Pulse rings */}
            <div className="absolute w-16 h-16 rounded-full border-2 border-[hsl(16_65%_48%/0.3)] animate-ping" style={{ animationDuration: '3s' }} />
            <div className="absolute w-10 h-10 rounded-full border border-[hsl(16_65%_48%/0.2)] animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }} />
            {/* Pin */}
            <div className="relative bg-[hsl(16_65%_48%)] rounded-full p-2.5 shadow-lg border-2 border-white z-10">
              <MapPin className="h-5 w-5 text-white" />
            </div>
          </div>
        </Marker>

        {/* Popup */}
        {popup && (
          <Popup longitude={popup.lng} latitude={popup.lat} anchor="bottom" onClose={() => setPopup(null)}
            closeButton closeOnClick={false}
            className="[&_.mapboxgl-popup-content]:rounded-lg [&_.mapboxgl-popup-content]:p-3 [&_.mapboxgl-popup-content]:shadow-lg [&_.mapboxgl-popup-content]:max-w-[240px]"
          >
            <p className="text-xs font-semibold text-[hsl(20_25%_12%)]" style={{ borderLeft: `3px solid ${popup.color}`, paddingLeft: 8 }}>{popup.title}</p>
            <p className="text-[10px] text-[hsl(20_25%_12%/0.6)] mt-1 ml-[11px]">{popup.detail}</p>
          </Popup>
        )}
      </Map>

      {/* Place name + population overlay */}
      <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/10">
        <p className="text-sm font-serif text-white/95">{name}</p>
        {population && <p className="text-[10px] text-white/60">{population.toLocaleString()} residents</p>}
      </div>

      {/* Map style toggle */}
      <div className="absolute top-3 left-3 flex gap-1">
        {(Object.keys(styleConfig) as (keyof typeof styleConfig)[]).map(s => (
          <button key={s} onClick={() => setMapStyle(s)}
            className={`px-2 py-1 rounded text-[10px] font-medium transition-all ${mapStyle === s ? 'bg-white text-[hsl(20_25%_12%)] shadow-sm' : 'bg-black/30 text-white/70 hover:bg-black/50'}`}
          >{styleConfig[s].label}</button>
        ))}
      </div>

      {/* Layer toggles */}
      <div className="absolute bottom-3 right-3 flex flex-col gap-1">
        {([
          { key: 'poverty' as const, label: 'Poverty', icon: DollarSign, count: povertyRate != null ? 1 : 0 },
          { key: 'burdens' as const, label: 'Burdens', icon: AlertTriangle, count: environmental_burdens.length },
          { key: 'facilities' as const, label: 'Facilities', icon: Building2, count: facilities.length },
          { key: 'people' as const, label: 'People', icon: Users, count: stakeholderLocations.length },
          { key: 'work' as const, label: 'Work', icon: Briefcase, count: activeWork.length },
        ]).filter(l => l.count > 0).map(l => (
          <button key={l.key} onClick={() => toggleLayer(l.key)}
            className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-medium transition-all ${showLayers[l.key] ? 'bg-white/90 text-[hsl(20_25%_12%)] shadow-sm' : 'bg-black/30 text-white/50'}`}
          >
            <l.icon className="h-3 w-3" />
            {l.label}{l.key === 'poverty' && povertyRate != null ? ` ${povertyRate}%` : ` (${l.count})`}
          </button>
        ))}
      </div>
    </div>
  );
}

export function hasMapboxToken(): boolean {
  return !!MAPBOX_TOKEN;
}
