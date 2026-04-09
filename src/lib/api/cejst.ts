/**
 * CEJST (Climate & Economic Justice Screening Tool) / Justice40 API Connector
 *
 * The Climate & Economic Justice Screening Tool identifies disadvantaged
 * communities across 8 burden categories (climate, energy, health, housing,
 * legacy pollution, transportation, water, workforce) using census tract data.
 *
 * @see https://screeningtool.geoplatform.gov/
 * @see https://github.com/usds/justice40-tool
 */

export interface CEJSTClimateBurden {
  loss_rate_percentile: number;
  expected_agriculture_loss_percentile: number;
  expected_building_loss_percentile: number;
  expected_population_loss_percentile: number;
  is_exceeded: boolean;
}

export interface CEJSTEnergyBurden {
  energy_cost_percentile: number;
  pm25_percentile: number;
  is_exceeded: boolean;
}

export interface CEJSTHealthBurden {
  asthma_percentile: number;
  diabetes_percentile: number;
  heart_disease_percentile: number;
  low_life_expectancy_percentile: number;
  is_exceeded: boolean;
}

export interface CEJSTHousingBurden {
  historic_underinvestment_percentile: number;
  housing_cost_percentile: number;
  lack_of_green_space_percentile: number;
  lack_of_indoor_plumbing_percentile: number;
  lead_paint_percentile: number;
  is_exceeded: boolean;
}

export interface CEJSTLegacyPollutionBurden {
  abandoned_mine_proximity: number;
  formerly_used_defense_sites: number;
  proximity_to_hazardous_waste: number;
  proximity_to_superfund: number;
  proximity_to_rmp: number;
  is_exceeded: boolean;
}

export interface CEJSTTransportationBurden {
  diesel_pm_percentile: number;
  traffic_proximity_percentile: number;
  dot_travel_barriers_percentile: number;
  is_exceeded: boolean;
}

export interface CEJSTWaterBurden {
  underground_storage_tanks_percentile: number;
  wastewater_discharge_percentile: number;
  is_exceeded: boolean;
}

export interface CEJSTWorkforceBurden {
  linguistic_isolation_percentile: number;
  low_median_income_percentile: number;
  poverty_percentile: number;
  unemployment_percentile: number;
  is_exceeded: boolean;
}

export interface CEJSTTract {
  census_tract_id: string;
  state: string;
  county: string;
  is_disadvantaged: boolean;
  total_threshold_criteria_exceeded: number;

  climate: CEJSTClimateBurden;
  energy: CEJSTEnergyBurden;
  health: CEJSTHealthBurden;
  housing: CEJSTHousingBurden;
  legacy_pollution: CEJSTLegacyPollutionBurden;
  transportation: CEJSTTransportationBurden;
  water: CEJSTWaterBurden;
  workforce: CEJSTWorkforceBurden;
}

/** Fetch CEJST screening data for a geographic point */
export async function fetchCEJSTData(lat: number, lng: number): Promise<CEJSTTract> {
  // TODO: Wire to real CEJST API
  // Real endpoint: https://screeningtool.geoplatform.gov/cejst/api/v1/tracts?lat={lat}&lng={lng}
  // Also: GitHub source at https://github.com/usds/justice40-tool
  return getMockCEJSTData(lat, lng);
}

function getMockCEJSTData(_lat: number, _lng: number): CEJSTTract {
  // Southeast Chicago census tract — IS disadvantaged, 5/8 categories exceeded
  return {
    census_tract_id: '17031810600',
    state: 'Illinois',
    county: 'Cook County',
    is_disadvantaged: true,
    total_threshold_criteria_exceeded: 5,

    climate: {
      loss_rate_percentile: 72,
      expected_agriculture_loss_percentile: 38,
      expected_building_loss_percentile: 81,
      expected_population_loss_percentile: 77,
      is_exceeded: true,
    },
    energy: {
      energy_cost_percentile: 88,
      pm25_percentile: 91,
      is_exceeded: true,
    },
    health: {
      asthma_percentile: 93,
      diabetes_percentile: 85,
      heart_disease_percentile: 79,
      low_life_expectancy_percentile: 82,
      is_exceeded: true,
    },
    housing: {
      historic_underinvestment_percentile: 86,
      housing_cost_percentile: 62,
      lack_of_green_space_percentile: 74,
      lack_of_indoor_plumbing_percentile: 45,
      lead_paint_percentile: 78,
      is_exceeded: false,
    },
    legacy_pollution: {
      abandoned_mine_proximity: 0,
      formerly_used_defense_sites: 0.12,
      proximity_to_hazardous_waste: 0.95,
      proximity_to_superfund: 0.78,
      proximity_to_rmp: 0.88,
      is_exceeded: true,
    },
    transportation: {
      diesel_pm_percentile: 92,
      traffic_proximity_percentile: 87,
      dot_travel_barriers_percentile: 76,
      is_exceeded: true,
    },
    water: {
      underground_storage_tanks_percentile: 68,
      wastewater_discharge_percentile: 55,
      is_exceeded: false,
    },
    workforce: {
      linguistic_isolation_percentile: 71,
      low_median_income_percentile: 64,
      poverty_percentile: 58,
      unemployment_percentile: 62,
      is_exceeded: false,
    },
  };
}
