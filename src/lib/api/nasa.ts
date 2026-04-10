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

/** Fetch satellite imagery URL for a location.
 * The returned URL works directly as an <img> src — no CORS issues.
 * NASA's Earth Imagery API returns a JPEG redirect for Landsat imagery.
 */
export async function fetchEarthImagery(lat: number, lng: number, date?: string): Promise<NASAEarthImagery> {
  const apiKey = import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY';
  const d = date || '2024-06-15';
  // Use the imagery URL directly — works as an <img> src (browser follows redirect)
  // dim=0.15 gives ~15km field of view which is good for neighborhoods
  const url = `https://api.nasa.gov/planetary/earth/imagery?lon=${lng}&lat=${lat}&date=${d}&dim=0.15&api_key=${apiKey}`;
  return { id: `earth-${lat}-${lng}`, date: d, url, lat, lng, caption: 'Landsat satellite imagery' };
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
