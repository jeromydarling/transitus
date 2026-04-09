/**
 * NRDC CARTO Data Connector
 *
 * The Natural Resources Defense Council publishes 29 datasets on CARTO
 * covering pollution, climate, health, energy, water, and environmental justice
 * indicators at census tract and county levels.
 *
 * @see https://nrdcmaps.carto.com/
 * @see https://www.nrdc.org/resources/data-tools
 */

export interface NRDCDataset {
  table_name: string;
  title: string;
  description: string;
  category: 'pollution' | 'climate' | 'health' | 'energy' | 'water' | 'justice';
  record_count?: number;
  last_updated?: string;
}

export interface NRDCPollutionRecord {
  geoid: string;
  state: string;
  county: string;
  pm25_risk: number;
  cancer_risk: number;
  diesel_pm: number;
  respiratory_hazard: number;
  lead_paint_pct: number;
  superfund_proximity: number;
  demographic_index: number;
  minority_pct: number;
  poverty_pct: number;
}

/** List available NRDC CARTO datasets */
export async function listNRDCDatasets(): Promise<NRDCDataset[]> {
  // TODO: Wire to real NRDC CARTO API
  // Real endpoint: https://nrdcmaps.carto.com/api/v2/sql?q=SELECT * FROM CDB_UserTables()
  return getMockDatasets();
}

/** Fetch pollution records for a given state or county */
export async function fetchNRDCPollutionData(state: string, county?: string): Promise<NRDCPollutionRecord[]> {
  // TODO: Wire to real NRDC CARTO API
  // Real endpoint: https://nrdcmaps.carto.com/api/v2/sql?q=SELECT * FROM {table} WHERE state='{state}' LIMIT 100
  return getMockPollutionData(state, county);
}

function getMockDatasets(): NRDCDataset[] {
  return [
    {
      table_name: 'nrdc_ej_pollution_burden',
      title: 'Pollution Burden by Census Tract',
      description: 'Composite pollution burden scores combining PM2.5, ozone, diesel PM, toxic releases, and proximity to hazardous facilities.',
      category: 'pollution',
      record_count: 74134,
      last_updated: '2024-08-15',
    },
    {
      table_name: 'nrdc_cancer_risk_nata',
      title: 'Cancer Risk from Air Toxics (NATA)',
      description: 'Lifetime cancer risk from inhalation of air toxics based on EPA National Air Toxics Assessment data.',
      category: 'health',
      record_count: 74134,
      last_updated: '2024-06-22',
    },
    {
      table_name: 'nrdc_climate_vulnerability',
      title: 'Climate Vulnerability Index',
      description: 'Community vulnerability to climate hazards including heat, flooding, wildfire, and drought exposure combined with adaptive capacity indicators.',
      category: 'climate',
      record_count: 74134,
      last_updated: '2024-09-01',
    },
    {
      table_name: 'nrdc_energy_burden',
      title: 'Energy Burden by Census Tract',
      description: 'Percentage of household income spent on energy costs, with breakdowns by housing type and fuel source.',
      category: 'energy',
      record_count: 74134,
      last_updated: '2024-07-10',
    },
    {
      table_name: 'nrdc_drinking_water_violations',
      title: 'Drinking Water Violations',
      description: 'Safe Drinking Water Act violations by water system, including health-based violations, monitoring failures, and enforcement actions.',
      category: 'water',
      record_count: 152847,
      last_updated: '2024-10-05',
    },
    {
      table_name: 'nrdc_ej_screening_indicators',
      title: 'Environmental Justice Screening Indicators',
      description: 'Combined environmental and demographic indicators for EJ screening, similar to EJScreen methodology with additional NRDC-specific metrics.',
      category: 'justice',
      record_count: 74134,
      last_updated: '2024-08-30',
    },
    {
      table_name: 'nrdc_superfund_proximity',
      title: 'Superfund Site Proximity',
      description: 'Census tract proximity to NPL Superfund sites with population-weighted distance calculations.',
      category: 'pollution',
      record_count: 74134,
      last_updated: '2024-05-18',
    },
    {
      table_name: 'nrdc_flood_risk_equity',
      title: 'Flood Risk and Equity',
      description: 'Flood risk exposure overlaid with socioeconomic vulnerability, including FEMA flood zone analysis and repetitive loss properties.',
      category: 'climate',
      record_count: 74134,
      last_updated: '2024-09-20',
    },
    {
      table_name: 'nrdc_diesel_pm_exposure',
      title: 'Diesel Particulate Matter Exposure',
      description: 'Diesel PM concentration estimates from mobile and stationary sources at census tract level.',
      category: 'pollution',
      record_count: 74134,
      last_updated: '2024-07-28',
    },
    {
      table_name: 'nrdc_lead_exposure_risk',
      title: 'Lead Exposure Risk Index',
      description: 'Composite lead exposure risk from paint, water, soil, and industrial sources by census tract.',
      category: 'health',
      record_count: 74134,
      last_updated: '2024-06-14',
    },
  ];
}

function getMockPollutionData(_state: string, _county?: string): NRDCPollutionRecord[] {
  // Sample records for Chicago-area census tracts (Cook County, IL)
  return [
    {
      geoid: '17031810600',
      state: 'Illinois',
      county: 'Cook County',
      pm25_risk: 12.4,
      cancer_risk: 42,
      diesel_pm: 0.95,
      respiratory_hazard: 1.8,
      lead_paint_pct: 0.52,
      superfund_proximity: 0.78,
      demographic_index: 82,
      minority_pct: 91,
      poverty_pct: 38,
    },
    {
      geoid: '17031842200',
      state: 'Illinois',
      county: 'Cook County',
      pm25_risk: 11.8,
      cancer_risk: 38,
      diesel_pm: 0.87,
      respiratory_hazard: 1.5,
      lead_paint_pct: 0.61,
      superfund_proximity: 0.45,
      demographic_index: 75,
      minority_pct: 85,
      poverty_pct: 33,
    },
    {
      geoid: '17031840300',
      state: 'Illinois',
      county: 'Cook County',
      pm25_risk: 13.1,
      cancer_risk: 47,
      diesel_pm: 1.12,
      respiratory_hazard: 2.1,
      lead_paint_pct: 0.44,
      superfund_proximity: 0.92,
      demographic_index: 88,
      minority_pct: 94,
      poverty_pct: 42,
    },
    {
      geoid: '17031610000',
      state: 'Illinois',
      county: 'Cook County',
      pm25_risk: 10.9,
      cancer_risk: 35,
      diesel_pm: 0.72,
      respiratory_hazard: 1.3,
      lead_paint_pct: 0.38,
      superfund_proximity: 0.31,
      demographic_index: 68,
      minority_pct: 78,
      poverty_pct: 28,
    },
  ];
}
