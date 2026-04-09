/**
 * EPA ECHO (Enforcement and Compliance History Online) API Connector
 *
 * Provides facility-level data on permits, inspections, violations, enforcement actions,
 * and emissions for regulated facilities near communities.
 *
 * @see https://www.epa.gov/data/application-programming-interface-api
 * @see https://echo.epa.gov/tools/web-services
 */

export interface ECHOFacility {
  registry_id: string;
  facility_name: string;
  street_address: string;
  city: string;
  state: string;
  zip: string;
  lat: number;
  lng: number;
  facility_type: string[];
  naics_codes: string[];
  sic_codes: string[];
  programs: ('CAA' | 'CWA' | 'RCRA' | 'SDWA' | 'TRI' | 'NPDES')[];

  // Compliance
  compliance_status: 'in_compliance' | 'violation' | 'significant_violation';
  quarters_in_violation_last_3yr: number;
  last_inspection_date?: string;
  inspection_count_5yr: number;

  // Enforcement
  enforcement_actions_5yr: number;
  penalties_5yr: number; // USD
  last_enforcement_date?: string;

  // Emissions (from TRI)
  total_releases_lbs?: number;
  air_releases_lbs?: number;
  water_releases_lbs?: number;
  land_releases_lbs?: number;
  top_chemicals?: string[];

  distance_miles: number;
}

export interface ECHOSearchParams {
  lat: number;
  lng: number;
  radius_miles: number;
  program?: string;
  compliance_status?: string;
}

/** Search for regulated facilities near a location */
export async function fetchNearbyFacilities(params: ECHOSearchParams): Promise<ECHOFacility[]> {
  // TODO: Wire to EPA ECHO API
  // Real endpoint: https://echodata.epa.gov/echo/echo_rest_services.get_facilities?output=JSON&p_lat={lat}&p_long={lng}&p_radius={radius}
  return getMockFacilities(params);
}

function getMockFacilities(params: ECHOSearchParams): ECHOFacility[] {
  return [
    {
      registry_id: 'ILD006287801',
      facility_name: 'General Iron Industries (former)',
      street_address: '1909 N Clifton Ave',
      city: 'Chicago', state: 'IL', zip: '60614',
      lat: 41.8567, lng: -87.6488,
      facility_type: ['Scrap Metal Recycler', 'Metal Shredding'],
      naics_codes: ['423930'], sic_codes: ['5093'],
      programs: ['CAA', 'RCRA'],
      compliance_status: 'significant_violation',
      quarters_in_violation_last_3yr: 8,
      last_inspection_date: '2024-03-15',
      inspection_count_5yr: 12,
      enforcement_actions_5yr: 3,
      penalties_5yr: 425000,
      last_enforcement_date: '2023-11-20',
      total_releases_lbs: 180000,
      air_releases_lbs: 45000,
      water_releases_lbs: 2000,
      land_releases_lbs: 133000,
      top_chemicals: ['Lead', 'Manganese', 'Particulate Matter', 'Zinc'],
      distance_miles: 1.2,
    },
    {
      registry_id: 'ILD098760345',
      facility_name: 'Southeast Side Petroleum Terminal',
      street_address: '10600 S Burley Ave',
      city: 'Chicago', state: 'IL', zip: '60617',
      lat: 41.7052, lng: -87.5376,
      facility_type: ['Petroleum Bulk Terminal'],
      naics_codes: ['424710'], sic_codes: ['5171'],
      programs: ['CAA', 'CWA', 'RCRA', 'TRI'],
      compliance_status: 'violation',
      quarters_in_violation_last_3yr: 3,
      last_inspection_date: '2024-06-10',
      inspection_count_5yr: 6,
      enforcement_actions_5yr: 1,
      penalties_5yr: 75000,
      last_enforcement_date: '2024-01-15',
      total_releases_lbs: 52000,
      air_releases_lbs: 48000,
      water_releases_lbs: 4000,
      land_releases_lbs: 0,
      top_chemicals: ['Benzene', 'Toluene', 'Xylene', 'Naphthalene'],
      distance_miles: 0.8,
    },
    {
      registry_id: 'ILD004523109',
      facility_name: 'Midwest Generation Crawford Station (decommissioned)',
      street_address: '3501 S Pulaski Rd',
      city: 'Chicago', state: 'IL', zip: '60623',
      lat: 41.8296, lng: -87.7256,
      facility_type: ['Coal-Fired Power Plant (Former)'],
      naics_codes: ['221112'], sic_codes: ['4911'],
      programs: ['CAA', 'CWA', 'TRI'],
      compliance_status: 'in_compliance',
      quarters_in_violation_last_3yr: 0,
      last_inspection_date: '2023-09-22',
      inspection_count_5yr: 3,
      enforcement_actions_5yr: 0,
      penalties_5yr: 0,
      total_releases_lbs: 0,
      air_releases_lbs: 0,
      top_chemicals: [],
      distance_miles: 2.1,
    },
  ];
}
