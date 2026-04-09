/**
 * MapboxPlaceMap — Real Mapbox GL JS map for Place pages.
 * Falls back to the CSS atlas placeholder when no Mapbox token is configured.
 */

import { useState, useCallback, useMemo } from 'react';
import Map, { Marker, NavigationControl, Source, Layer, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin, Building2, AlertTriangle } from 'lucide-react';
import type { EnvironmentalBurden, ActiveWork } from '@/types/transitus';
import type { ECHOFacility } from '@/lib/api/echo';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || '';

const SEVERITY_COLORS: Record<string, string> = {
  critical: '#dc2626',
  high: '#ea580c',
  moderate: '#d97706',
  low: '#16a34a',
};

const COMPLIANCE_COLORS: Record<string, string> = {
  significant_violation: '#dc2626',
  violation: '#ea580c',
  in_compliance: '#16a34a',
};

interface MapboxPlaceMapProps {
  lat: number;
  lng: number;
  name: string;
  environmental_burdens: EnvironmentalBurden[];
  facilities?: ECHOFacility[];
  population?: number;
  className?: string;
}

interface PopupInfo {
  lat: number;
  lng: number;
  title: string;
  detail: string;
  color: string;
}

export default function MapboxPlaceMap({
  lat, lng, name, environmental_burdens, facilities = [], population, className = '',
}: MapboxPlaceMapProps) {
  const [popup, setPopup] = useState<PopupInfo | null>(null);
  const [mapStyle, setMapStyle] = useState<'light' | 'satellite' | 'dark'>('light');

  const styles: Record<string, string> = {
    light: 'mapbox://styles/mapbox/light-v11',
    satellite: 'mapbox://styles/mapbox/satellite-streets-v12',
    dark: 'mapbox://styles/mapbox/dark-v11',
  };

  // Build facility GeoJSON
  const facilityGeoJson = useMemo(() => ({
    type: 'FeatureCollection' as const,
    features: facilities.map(f => ({
      type: 'Feature' as const,
      geometry: { type: 'Point' as const, coordinates: [f.lng, f.lat] },
      properties: {
        name: f.facility_name,
        compliance: f.compliance_status,
        releases: f.total_releases_lbs || 0,
        chemicals: (f.top_chemicals || []).join(', '),
        color: COMPLIANCE_COLORS[f.compliance_status] || '#888',
        radius: Math.max(6, Math.min(20, Math.sqrt((f.total_releases_lbs || 0) / 1000))),
      },
    })),
  }), [facilities]);

  return (
    <div className={`relative rounded-lg overflow-hidden border border-[hsl(30_18%_82%)] ${className}`} style={{ minHeight: '300px' }}>
      <Map
        initialViewState={{
          longitude: lng,
          latitude: lat,
          zoom: 13,
          pitch: 0,
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle={styles[mapStyle]}
        mapboxAccessToken={MAPBOX_TOKEN}
        attributionControl={false}
      >
        <NavigationControl position="top-right" />

        {/* Facility circles */}
        {facilityGeoJson.features.length > 0 && (
          <Source id="facilities" type="geojson" data={facilityGeoJson}>
            <Layer
              id="facility-circles"
              type="circle"
              paint={{
                'circle-radius': ['get', 'radius'],
                'circle-color': ['get', 'color'],
                'circle-opacity': 0.6,
                'circle-stroke-width': 1.5,
                'circle-stroke-color': '#fff',
              }}
            />
          </Source>
        )}

        {/* Center marker */}
        <Marker longitude={lng} latitude={lat} anchor="bottom">
          <div className="flex flex-col items-center">
            <div className="bg-[hsl(16_65%_48%)] rounded-full p-2 shadow-lg border-2 border-white">
              <MapPin className="h-5 w-5 text-white" />
            </div>
          </div>
        </Marker>

        {/* Facility markers with click */}
        {facilities.map(f => (
          <Marker
            key={f.registry_id}
            longitude={f.lng}
            latitude={f.lat}
            anchor="center"
            onClick={e => {
              e.originalEvent.stopPropagation();
              setPopup({
                lat: f.lat, lng: f.lng,
                title: f.facility_name,
                detail: `${f.compliance_status.replace(/_/g, ' ')} · ${(f.total_releases_lbs || 0).toLocaleString()} lbs released${f.top_chemicals?.length ? ' · ' + f.top_chemicals.slice(0, 3).join(', ') : ''}`,
                color: COMPLIANCE_COLORS[f.compliance_status] || '#888',
              });
            }}
          >
            <div className="cursor-pointer">
              <Building2 className="h-4 w-4" style={{ color: COMPLIANCE_COLORS[f.compliance_status] || '#888' }} />
            </div>
          </Marker>
        ))}

        {/* Popup */}
        {popup && (
          <Popup
            longitude={popup.lng}
            latitude={popup.lat}
            anchor="bottom"
            onClose={() => setPopup(null)}
            closeButton={true}
            closeOnClick={false}
            className="[&_.mapboxgl-popup-content]:rounded-lg [&_.mapboxgl-popup-content]:p-3 [&_.mapboxgl-popup-content]:shadow-lg"
          >
            <div>
              <p className="text-xs font-semibold text-[hsl(20_25%_12%)]" style={{ borderLeft: `3px solid ${popup.color}`, paddingLeft: '8px' }}>
                {popup.title}
              </p>
              <p className="text-[10px] text-[hsl(20_25%_12%/0.6)] mt-1 ml-[11px]">{popup.detail}</p>
            </div>
          </Popup>
        )}
      </Map>

      {/* Place name overlay */}
      <div className="absolute bottom-3 left-3 bg-black/40 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/10">
        <p className="text-sm font-serif text-white/90">{name}</p>
        {population && <p className="text-[10px] text-white/60">{population.toLocaleString()} residents</p>}
      </div>

      {/* Coordinate badge */}
      <div className="absolute bottom-3 right-3 bg-black/30 backdrop-blur-sm rounded px-2 py-1 border border-white/10">
        <span className="text-[10px] font-mono text-white/70">
          {lat.toFixed(4)}°N, {Math.abs(lng).toFixed(4)}°{lng >= 0 ? 'E' : 'W'}
        </span>
      </div>

      {/* Map style toggle */}
      <div className="absolute top-3 left-3 flex gap-1">
        {(['light', 'satellite', 'dark'] as const).map(s => (
          <button
            key={s}
            onClick={() => setMapStyle(s)}
            className={`px-2 py-1 rounded text-[10px] font-medium transition-all ${
              mapStyle === s
                ? 'bg-white text-[hsl(20_25%_12%)] shadow-sm'
                : 'bg-black/30 text-white/70 hover:bg-black/50'
            }`}
          >
            {s === 'light' ? 'Atlas' : s === 'satellite' ? 'Satellite' : 'Dark'}
          </button>
        ))}
      </div>

      {/* Burden legend */}
      {environmental_burdens.length > 0 && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-black/30 backdrop-blur-sm rounded px-3 py-1.5 border border-white/10 flex gap-3">
          {environmental_burdens.slice(0, 3).map((b, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: SEVERITY_COLORS[b.severity] }} />
              <span className="text-[9px] text-white/70">{b.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Check if Mapbox token is available.
 */
export function hasMapboxToken(): boolean {
  return !!MAPBOX_TOKEN;
}
