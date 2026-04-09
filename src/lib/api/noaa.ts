/**
 * NOAA Climate & Weather API Connector
 *
 * Provides weather alerts, climate normals, hazard data, and storm events.
 *
 * @see https://www.weather.gov/documentation/services-web-api
 * @see https://www.ncdc.noaa.gov/cdo-web/webservices/v2
 */

export interface NOAAAlert {
  id: string;
  event_type: string;
  headline: string;
  description: string;
  severity: 'Minor' | 'Moderate' | 'Severe' | 'Extreme';
  urgency: 'Immediate' | 'Expected' | 'Future' | 'Past';
  area_desc: string;
  onset: string;
  expires: string;
  sender: string;
}

export interface ClimateNormals {
  station_id: string;
  station_name: string;
  avg_temp_annual_f: number;
  avg_precip_annual_in: number;
  heating_degree_days: number;
  cooling_degree_days: number;
  extreme_heat_days_per_year: number; // days above 95F
  freeze_thaw_cycles: number;
  avg_first_frost: string;
  avg_last_frost: string;
}

export interface HazardRisk {
  hazard_type: 'flood' | 'heat' | 'storm' | 'wildfire' | 'drought' | 'coastal' | 'tornado' | 'winter_storm';
  risk_level: 'low' | 'moderate' | 'high' | 'very_high';
  description: string;
  historical_events_10yr: number;
  projected_change: string;
}

export async function fetchActiveAlerts(lat: number, lng: number): Promise<NOAAAlert[]> {
  // TODO: Wire to https://api.weather.gov/alerts?point={lat},{lng}
  return getMockAlerts();
}

export async function fetchClimateNormals(lat: number, lng: number): Promise<ClimateNormals> {
  // TODO: Wire to NOAA Climate Data Online API
  return {
    station_id: 'USW00094846',
    station_name: 'Chicago Midway Airport',
    avg_temp_annual_f: 50.4,
    avg_precip_annual_in: 36.9,
    heating_degree_days: 6498,
    cooling_degree_days: 830,
    extreme_heat_days_per_year: 4,
    freeze_thaw_cycles: 82,
    avg_first_frost: 'October 28',
    avg_last_frost: 'April 14',
  };
}

export async function fetchHazardRisks(lat: number, lng: number): Promise<HazardRisk[]> {
  // TODO: Wire to FEMA National Risk Index + NOAA data
  return [
    { hazard_type: 'flood', risk_level: 'high', description: 'Riverine and urban flooding risk due to proximity to Calumet River and combined sewer system.', historical_events_10yr: 8, projected_change: 'Increasing — heavier precipitation events projected' },
    { hazard_type: 'heat', risk_level: 'very_high', description: 'Urban heat island effect compounded by industrial activity and limited tree canopy.', historical_events_10yr: 12, projected_change: 'Significant increase — extreme heat days projected to triple by 2050' },
    { hazard_type: 'storm', risk_level: 'moderate', description: 'Severe thunderstorms with damaging winds and hail.', historical_events_10yr: 15, projected_change: 'Slight increase in intensity' },
    { hazard_type: 'winter_storm', risk_level: 'moderate', description: 'Heavy snow and ice storms affecting infrastructure.', historical_events_10yr: 6, projected_change: 'Variable — less frequent but potentially more intense' },
  ];
}

function getMockAlerts(): NOAAAlert[] {
  return [
    {
      id: 'NWS-IWX-2026-HeatAdvisory-001',
      event_type: 'Heat Advisory',
      headline: 'Heat Advisory in effect until 8 PM CDT Saturday',
      description: 'Heat index values up to 105 expected. The combination of hot temperatures and high humidity will create a dangerous situation.',
      severity: 'Moderate',
      urgency: 'Expected',
      area_desc: 'Cook County, IL',
      onset: '2026-07-12T12:00:00-05:00',
      expires: '2026-07-12T20:00:00-05:00',
      sender: 'NWS Chicago',
    },
  ];
}
