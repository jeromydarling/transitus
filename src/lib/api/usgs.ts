/**
 * USGS National Map / TNMAccess API Connector
 *
 * Provides terrain, topography, hydrography, elevation, and base geospatial layers.
 *
 * @see https://www.usgs.gov/faqs/there-api-accessing-national-map-data
 * @see https://tnmaccess.nationalmap.gov/api/v1/
 */

export interface USGSProduct {
  id: string;
  title: string;
  source_id: string;
  format: string;
  date_created: string;
  extent: { min_x: number; min_y: number; max_x: number; max_y: number };
  download_url: string;
  size_bytes: number;
  dataset: USGSDataset;
}

export type USGSDataset =
  | 'National Elevation Dataset (NED) 1/3 arc-second'
  | 'National Hydrography Dataset (NHD)'
  | 'National Land Cover Database (NLCD)'
  | 'National Boundary Dataset (NBD)'
  | 'National Structures Dataset (NSD)'
  | 'National Transportation Dataset (NTD)'
  | 'USGS Topo Maps';

export interface ElevationResult {
  lat: number;
  lng: number;
  elevation_meters: number;
  elevation_feet: number;
  data_source: string;
}

/** Fetch elevation for a point */
export async function fetchElevation(lat: number, lng: number): Promise<ElevationResult> {
  // TODO: Wire to https://epqs.nationalmap.gov/v1/json?x={lng}&y={lat}&units=Meters&wkid=4326
  return {
    lat, lng,
    elevation_meters: 180,
    elevation_feet: 590,
    data_source: 'USGS 3DEP 1/3 arc-second',
  };
}

/** Search for available datasets in an area */
export async function searchProducts(bbox: { min_x: number; min_y: number; max_x: number; max_y: number }, dataset?: USGSDataset): Promise<USGSProduct[]> {
  // TODO: Wire to https://tnmaccess.nationalmap.gov/api/v1/products?bbox={bbox}&datasets={dataset}
  return [
    {
      id: 'ned13-n42w088',
      title: 'USGS NED 1/3 arc-second n42w088',
      source_id: 'ned13_n42w088_20230101',
      format: 'GeoTIFF',
      date_created: '2023-01-01',
      extent: { min_x: -88, min_y: 41, max_x: -87, max_y: 42 },
      download_url: 'https://prd-tnm.s3.amazonaws.com/StagedProducts/Elevation/13/TIFF/current/n42w088/USGS_13_n42w088.tif',
      size_bytes: 52428800,
      dataset: 'National Elevation Dataset (NED) 1/3 arc-second',
    },
  ];
}
