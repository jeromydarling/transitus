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

/** Fetch satellite imagery for a location */
export async function fetchEarthImagery(lat: number, lng: number, date?: string): Promise<NASAEarthImagery> {
  // TODO: Wire to https://api.nasa.gov/planetary/earth/imagery?lon={lng}&lat={lat}&date={date}&api_key=DEMO_KEY
  return {
    id: `earth-${lat}-${lng}`,
    date: date || '2025-09-15',
    url: `https://api.nasa.gov/planetary/earth/imagery?lon=${lng}&lat=${lat}&date=2025-09-15&dim=0.1&api_key=DEMO_KEY`,
    cloud_score: 12,
    lat, lng,
    caption: 'Landsat 8 satellite imagery of the area.',
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
