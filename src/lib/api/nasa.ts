/**
 * NASA Open APIs Connector
 *
 * Earth imagery, satellite data, and earth observation content.
 *
 * @see https://api.nasa.gov
 * @see https://data.nasa.gov/dataset/earth-imagery-api
 * @see https://www.earthdata.nasa.gov/engage/open-data-services-software/earthdata-developer-portal/gibs-api
 */

export interface NASAEarthImagery {
  id: string;
  date: string;
  url: string;
  cloud_score?: number;
  lat: number;
  lng: number;
  caption: string;
}

export interface GIBSLayer {
  layer_id: string;
  title: string;
  description: string;
  temporal: boolean;
  date_range?: { start: string; end: string };
  projection: string;
  format: 'image/jpeg' | 'image/png' | 'application/vnd.mapbox-vector-tile';
}

/** Fetch satellite imagery for a location — tries multiple dates for coverage */
export async function fetchEarthImagery(lat: number, lng: number, date?: string): Promise<NASAEarthImagery> {
  const apiKey = import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY';
  // Try multiple dates for better coverage (some dates have cloud cover or no imagery)
  const dates = date ? [date] : ['2024-06-15', '2024-03-15', '2023-09-15', '2023-06-15'];

  for (const d of dates) {
    try {
      // First check if imagery exists via the assets endpoint
      const assetsUrl = `https://api.nasa.gov/planetary/earth/assets?lon=${lng}&lat=${lat}&date=${d}&dim=0.1&api_key=${apiKey}`;
      const res = await fetch(assetsUrl, { signal: AbortSignal.timeout(5000) });
      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          // Assets endpoint found imagery — use the direct imagery URL
          const imgUrl = `https://api.nasa.gov/planetary/earth/imagery?lon=${lng}&lat=${lat}&date=${d}&dim=0.15&api_key=${apiKey}`;
          return { id: `earth-${lat}-${lng}`, date: data.date || d, url: imgUrl, lat, lng, caption: 'Landsat satellite imagery' };
        }
      }
    } catch {
      // Try next date
    }
  }

  // Fallback: return the URL anyway (might work, might not)
  const d = dates[0];
  return {
    id: `earth-${lat}-${lng}`,
    date: d,
    url: `https://api.nasa.gov/planetary/earth/imagery?lon=${lng}&lat=${lat}&date=${d}&dim=0.15&api_key=${apiKey}`,
    lat, lng,
    caption: 'Landsat satellite imagery',
  };
}

/** Available GIBS layers for map overlays */
export function getAvailableGIBSLayers(): GIBSLayer[] {
  return [
    {
      layer_id: 'MODIS_Terra_CorrectedReflectance_TrueColor',
      title: 'True Color (MODIS Terra)',
      description: 'Daily true color satellite imagery from MODIS on Terra.',
      temporal: true,
      date_range: { start: '2000-02-24', end: 'present' },
      projection: 'EPSG:3857',
      format: 'image/jpeg',
    },
    {
      layer_id: 'VIIRS_NOAA20_CorrectedReflectance_TrueColor',
      title: 'True Color (VIIRS NOAA-20)',
      description: 'Daily true color from VIIRS sensor on NOAA-20.',
      temporal: true,
      date_range: { start: '2018-01-01', end: 'present' },
      projection: 'EPSG:3857',
      format: 'image/jpeg',
    },
    {
      layer_id: 'MODIS_Terra_Land_Surface_Temp_Day',
      title: 'Land Surface Temperature (Day)',
      description: 'Daytime land surface temperature from MODIS.',
      temporal: true,
      projection: 'EPSG:3857',
      format: 'image/png',
    },
    {
      layer_id: 'MODIS_Combined_MAIAC_L2G_AerosolOpticalDepth',
      title: 'Aerosol Optical Depth',
      description: 'Atmospheric aerosol concentration — useful for air quality context.',
      temporal: true,
      projection: 'EPSG:3857',
      format: 'image/png',
    },
  ];
}
