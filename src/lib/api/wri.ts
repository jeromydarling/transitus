/**
 * WRI (World Resources Institute) Community Benefits Framework Database Connector
 *
 * Provides access to Community Benefit Agreements (CBAs), Host Community Agreements,
 * Project Labor Agreements, and other negotiated frameworks between developers
 * and impacted communities.
 *
 * @see https://www.wri.org/
 * @see https://datasets.wri.org/
 */

export interface CommunityBenefitAgreement {
  id: string;
  project_name: string;
  location: string;
  state: string;
  agreement_type: 'CBA' | 'HCA' | 'PWA' | 'Community_Agreement' | 'Good_Neighbor_Agreement';
  sector: 'energy' | 'infrastructure' | 'development' | 'mining' | 'manufacturing';
  year_signed: number;
  parties: string[];
  key_provisions: string[];
  enforcement_mechanism?: string;
  status: 'active' | 'completed' | 'disputed' | 'expired';
  source_url?: string;
}

export interface WRISearchParams {
  state?: string;
  sector?: string;
  agreement_type?: string;
  status?: string;
}

/** Search community benefit agreements */
export async function searchCommunityBenefitAgreements(params?: WRISearchParams): Promise<CommunityBenefitAgreement[]> {
  // TODO: Wire to real WRI CKAN API
  // Real endpoint: https://datasets.wri.org/api/3/action/package_search?q=community+benefits
  return getMockCBAs(params);
}

function getMockCBAs(_params?: WRISearchParams): CommunityBenefitAgreement[] {
  return [
    {
      id: 'wri-cba-001',
      project_name: 'Lincoln Yards Community Benefits Agreement',
      location: 'Chicago, IL',
      state: 'IL',
      agreement_type: 'CBA',
      sector: 'development',
      year_signed: 2024,
      parties: [
        'Lincoln Yards Community Advisory Council',
        'Sterling Bay',
        'City of Chicago',
      ],
      key_provisions: [
        'Affordable housing set-aside (20% of units at 60% AMI)',
        'Local hiring requirement (50% of construction jobs)',
        '$10M community investment fund',
        'Environmental remediation of former industrial sites',
        'Public park and open space commitments',
      ],
      enforcement_mechanism: 'Independent compliance monitor appointed by City Council',
      status: 'active',
      source_url: 'https://www.chicago.gov/city/en/depts/dcd/supp_info/lincoln-yards.html',
    },
    {
      id: 'wri-cba-002',
      project_name: 'Vineyard Wind Community Benefits Agreement',
      location: 'Martha\'s Vineyard / Barnstable County, MA',
      state: 'MA',
      agreement_type: 'HCA',
      sector: 'energy',
      year_signed: 2021,
      parties: [
        'Vineyard Wind LLC',
        'Town of Barnstable',
        'Martha\'s Vineyard Commission',
        'Massachusetts Fishermen\'s Partnership',
      ],
      key_provisions: [
        '$16M host community payments over project life',
        'Workforce training for offshore wind careers',
        'Fisheries compensation fund ($5.4M)',
        'Visual impact mitigation measures',
        'Decommissioning bond requirement',
      ],
      enforcement_mechanism: 'Binding arbitration clause with annual compliance reporting',
      status: 'active',
      source_url: 'https://www.vineyardwind.com/community-benefits',
    },
    {
      id: 'wri-cba-003',
      project_name: 'Barre Town Solar Community Benefits Agreement',
      location: 'Barre, VT',
      state: 'VT',
      agreement_type: 'Good_Neighbor_Agreement',
      sector: 'energy',
      year_signed: 2022,
      parties: [
        'Green Mountain Solar LLC',
        'Town of Barre',
        'Barre Area Development Corporation',
      ],
      key_provisions: [
        'Annual community benefit payments ($15,000/year)',
        'Pollinator-friendly ground cover under panels',
        'Community solar subscription discount (15% off retail rate)',
        'Agricultural co-use provisions for sheep grazing',
        'Decommissioning escrow account',
      ],
      enforcement_mechanism: 'Town selectboard review with annual public hearing',
      status: 'active',
      source_url: 'https://barretown.org/energy-committee',
    },
    {
      id: 'wri-cba-004',
      project_name: 'Thacker Pass Lithium Mine Community Agreement',
      location: 'Humboldt County, NV',
      state: 'NV',
      agreement_type: 'Community_Agreement',
      sector: 'mining',
      year_signed: 2023,
      parties: [
        'Lithium Americas Corp',
        'Humboldt County Commission',
        'Fort McDermitt Paiute and Shoshone Tribe',
      ],
      key_provisions: [
        'Tribal cultural resource protection plan',
        'Water monitoring and mitigation ($8M fund)',
        'Local hiring preference (60% Humboldt County residents)',
        'Road infrastructure improvements',
        'Reclamation bond ($50M)',
      ],
      enforcement_mechanism: 'Joint oversight committee with quarterly public reporting',
      status: 'disputed',
      source_url: 'https://lithiumamericas.com/thacker-pass/',
    },
  ];
}
