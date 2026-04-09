/**
 * PlaceMap — Atlas-style map visualization for a Place.
 *
 * Currently renders a beautiful CSS atlas placeholder with terrain gradients,
 * contour lines, coordinate display, and interactive layer toggles.
 *
 * TODO: Install mapbox-gl and react-map-gl, then uncomment:
 * import Map, { Marker, NavigationControl } from 'react-map-gl';
 * import 'mapbox-gl/dist/mapbox-gl.css';
 *
 * Then replace the placeholder div with:
 *   <Map
 *     initialViewState={{ longitude: lng, latitude: lat, zoom: 13 }}
 *     style={{ width: '100%', height: '100%' }}
 *     mapStyle={show3D ? 'mapbox://styles/mapbox/satellite-streets-v12' : 'mapbox://styles/mapbox/light-v11'}
 *     mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
 *     terrain={show3D ? { source: 'mapbox-dem', exaggeration: 1.5 } : undefined}
 *   >
 *     <NavigationControl position="top-right" />
 *     <Marker longitude={lng} latitude={lat}>
 *       <MapPin className="h-8 w-8 text-[hsl(16_65%_48%)]" />
 *     </Marker>
 *   </Map>
 */

import { useState, useMemo } from 'react';
import { MapPin, Layers, Mountain, Building2, Users, AlertTriangle } from 'lucide-react';
import type { EnvironmentalBurden } from '@/types/transitus';

// ── Design tokens ──

const SEVERITY_COLORS: Record<EnvironmentalBurden['severity'], string> = {
  critical: '#dc2626',
  high: '#ea580c',
  moderate: '#d97706',
  low: '#16a34a',
};

const SEVERITY_BG: Record<EnvironmentalBurden['severity'], string> = {
  critical: 'bg-red-100 text-red-800',
  high: 'bg-orange-100 text-orange-800',
  moderate: 'bg-amber-100 text-amber-800',
  low: 'bg-green-100 text-green-800',
};

type LayerName = 'Burdens' | 'Facilities' | 'Demographics';

const LAYER_ICONS: Record<LayerName, React.ComponentType<{ className?: string }>> = {
  Burdens: AlertTriangle,
  Facilities: Building2,
  Demographics: Users,
};

// ── Props ──

interface PlaceMapProps {
  lat: number;
  lng: number;
  name: string;
  environmental_burdens: EnvironmentalBurden[];
  facilityCount?: number;
  className?: string;
}

// ── Component ──

export default function PlaceMap({
  lat,
  lng,
  name,
  environmental_burdens,
  facilityCount,
  className = '',
}: PlaceMapProps) {
  const [show3D, setShow3D] = useState(false);
  const [activeLayers, setActiveLayers] = useState<Set<LayerName>>(new Set(['Burdens']));

  const topBurden = useMemo(() => {
    const severity = ['critical', 'high', 'moderate', 'low'] as const;
    for (const level of severity) {
      const found = environmental_burdens.find((b) => b.severity === level);
      if (found) return found;
    }
    return environmental_burdens[0] ?? null;
  }, [environmental_burdens]);

  const toggleLayer = (layer: LayerName) => {
    setActiveLayers((prev) => {
      const next = new Set(prev);
      if (next.has(layer)) next.delete(layer);
      else next.add(layer);
      return next;
    });
  };

  // Generate deterministic contour rings based on coordinates
  const contourRings = useMemo(() => {
    const seed = Math.abs(lat * 1000 + lng * 100);
    return Array.from({ length: 6 }, (_, i) => ({
      cx: 40 + ((seed * (i + 1) * 7) % 30),
      cy: 30 + ((seed * (i + 2) * 11) % 40),
      rx: 15 + ((seed * (i + 3) * 3) % 25),
      ry: 10 + ((seed * (i + 1) * 5) % 20),
      rotation: (seed * (i + 4) * 13) % 360,
    }));
  }, [lat, lng]);

  // Generate grid dots for the topographic effect
  const gridDots = useMemo(() => {
    const dots: { x: number; y: number; opacity: number }[] = [];
    for (let gx = 0; gx < 20; gx++) {
      for (let gy = 0; gy < 12; gy++) {
        dots.push({
          x: gx * 5 + 2.5,
          y: gy * 8.5 + 4,
          opacity: 0.08 + Math.sin(gx * 0.7 + gy * 0.5) * 0.06,
        });
      }
    }
    return dots;
  }, []);

  return (
    <div className={`relative rounded-lg overflow-hidden border border-[hsl(30_18%_82%)] ${className}`}
         style={{ minHeight: '18rem' }}>
      {/* Terrain gradient background */}
      <div className="absolute inset-0"
           style={{
             background: show3D
               ? 'linear-gradient(135deg, hsl(152 30% 25%) 0%, hsl(30 25% 35%) 35%, hsl(16 45% 40%) 65%, hsl(20 20% 30%) 100%)'
               : 'linear-gradient(160deg, hsl(152 35% 32%) 0%, hsl(152 20% 42%) 20%, hsl(40 30% 50%) 45%, hsl(30 25% 58%) 65%, hsl(16 40% 45%) 85%, hsl(20 20% 35%) 100%)',
             transition: 'background 0.6s ease',
           }}
      />

      {/* SVG contour lines overlay */}
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
        {/* Grid dots */}
        {gridDots.map((dot, i) => (
          <circle key={`dot-${i}`} cx={dot.x} cy={dot.y} r="0.3" fill="white" opacity={dot.opacity} />
        ))}

        {/* Contour ellipses */}
        {contourRings.map((ring, i) => (
          <ellipse
            key={`contour-${i}`}
            cx={ring.cx}
            cy={ring.cy}
            rx={ring.rx}
            ry={ring.ry}
            transform={`rotate(${ring.rotation} ${ring.cx} ${ring.cy})`}
            fill="none"
            stroke="white"
            strokeWidth="0.3"
            opacity={0.15 + i * 0.03}
            strokeDasharray={i % 2 === 0 ? '2 1.5' : 'none'}
          />
        ))}

        {/* Meridian lines */}
        {Array.from({ length: 5 }, (_, i) => (
          <line
            key={`meridian-${i}`}
            x1={20 + i * 15}
            y1="0"
            x2={20 + i * 15}
            y2="100"
            stroke="white"
            strokeWidth="0.15"
            opacity="0.1"
          />
        ))}
        {Array.from({ length: 4 }, (_, i) => (
          <line
            key={`parallel-${i}`}
            x1="0"
            y1={20 + i * 20}
            x2="100"
            y2={20 + i * 20}
            stroke="white"
            strokeWidth="0.15"
            opacity="0.1"
          />
        ))}
      </svg>

      {/* Shadow gradient for depth */}
      {show3D && (
        <div className="absolute inset-0 pointer-events-none"
             style={{
               background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.15) 60%, rgba(0,0,0,0.35) 100%)',
             }}
        />
      )}

      {/* Central pin marker */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="flex flex-col items-center">
          {/* Pulse ring */}
          <div className="relative">
            <div className="absolute inset-0 -m-3 rounded-full border-2 border-white/20 animate-ping" style={{ animationDuration: '3s' }} />
            <div className="relative bg-white/15 backdrop-blur-sm rounded-full p-3 border border-white/25 shadow-lg">
              <MapPin className="h-8 w-8 text-white drop-shadow-md" />
            </div>
          </div>
          <span className="mt-2 text-sm font-serif font-medium text-white/90 drop-shadow-md tracking-wide">
            {name}
          </span>
        </div>
      </div>

      {/* Coordinate badge — bottom-left */}
      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/30 backdrop-blur-sm rounded-md px-2.5 py-1.5 border border-white/10">
        <MapPin className="h-3 w-3 text-white/60" />
        <span className="text-[11px] font-mono text-white/80 tracking-wide">
          {lat.toFixed(4)}&#176;N, {Math.abs(lng).toFixed(4)}&#176;{lng >= 0 ? 'E' : 'W'}
        </span>
      </div>

      {/* Overlay info — top-left */}
      <div className="absolute top-3 left-3 flex flex-col gap-1.5">
        {/* Facility count */}
        {typeof facilityCount === 'number' && activeLayers.has('Facilities') && (
          <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm rounded-md px-2.5 py-1.5 border border-white/10">
            <Building2 className="h-3 w-3 text-amber-300/80" />
            <span className="text-[11px] font-medium text-white/85">
              {facilityCount} nearby {facilityCount === 1 ? 'facility' : 'facilities'}
            </span>
          </div>
        )}

        {/* Top burden */}
        {topBurden && activeLayers.has('Burdens') && (
          <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm rounded-md px-2.5 py-1.5 border border-white/10">
            <AlertTriangle className="h-3 w-3" style={{ color: SEVERITY_COLORS[topBurden.severity] }} />
            <span className="text-[11px] font-medium text-white/85">
              {topBurden.name}
            </span>
            <span className={`ml-1 inline-flex items-center rounded-full px-1.5 py-0 text-[9px] font-semibold uppercase tracking-wider ${SEVERITY_BG[topBurden.severity]}`}>
              {topBurden.severity}
            </span>
          </div>
        )}

        {/* Burden count */}
        {environmental_burdens.length > 1 && activeLayers.has('Burdens') && (
          <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm rounded-md px-2.5 py-1.5 border border-white/10">
            <Layers className="h-3 w-3 text-white/60" />
            <span className="text-[11px] text-white/70">
              {environmental_burdens.length} environmental burdens tracked
            </span>
          </div>
        )}
      </div>

      {/* Controls — top-right */}
      <div className="absolute top-3 right-3 flex flex-col gap-1.5">
        {/* 3D terrain toggle */}
        <button
          onClick={() => setShow3D(!show3D)}
          className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11px] font-medium border transition-all duration-200 ${
            show3D
              ? 'bg-[hsl(16_65%_48%)]/80 text-white border-white/20 shadow-md'
              : 'bg-black/30 text-white/80 border-white/10 hover:bg-black/40'
          } backdrop-blur-sm`}
        >
          <Mountain className="h-3 w-3" />
          3D Terrain
        </button>

        {/* Layer toggles */}
        {(['Burdens', 'Facilities', 'Demographics'] as LayerName[]).map((layer) => {
          const Icon = LAYER_ICONS[layer];
          const isActive = activeLayers.has(layer);
          return (
            <button
              key={layer}
              onClick={() => toggleLayer(layer)}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11px] font-medium border transition-all duration-200 ${
                isActive
                  ? 'bg-white/20 text-white border-white/25'
                  : 'bg-black/20 text-white/50 border-white/5 hover:bg-black/30 hover:text-white/70'
              } backdrop-blur-sm`}
            >
              <Icon className="h-3 w-3" />
              {layer}
            </button>
          );
        })}
      </div>

      {/* Bottom-right: burden severity legend (shown when Burdens layer is active) */}
      {activeLayers.has('Burdens') && environmental_burdens.length > 0 && (
        <div className="absolute bottom-3 right-3 bg-black/30 backdrop-blur-sm rounded-md px-3 py-2 border border-white/10">
          <p className="text-[9px] uppercase tracking-widest text-white/50 mb-1.5 font-semibold">Burden Severity</p>
          <div className="flex items-center gap-2">
            {(['low', 'moderate', 'high', 'critical'] as const).map((level) => {
              const count = environmental_burdens.filter((b) => b.severity === level).length;
              if (count === 0) return null;
              return (
                <div key={level} className="flex items-center gap-1">
                  <span
                    className="inline-block w-2 h-2 rounded-full"
                    style={{ backgroundColor: SEVERITY_COLORS[level] }}
                  />
                  <span className="text-[10px] text-white/70 capitalize">{level}</span>
                  <span className="text-[10px] text-white/40">({count})</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
