/**
 * Grants.gov + EPA/DOE Funding API Connector
 *
 * Aggregates federal funding opportunities relevant to Just Transition work.
 *
 * @see https://www.grants.gov/web/grants/search-grants.html
 * @see https://www.epa.gov/grants
 */

export interface GrantOpportunity {
  id: string;
  opportunity_number: string;
  title: string;
  agency: string;
  agency_code: string;
  description: string;
  funding_instrument: 'grant' | 'cooperative_agreement' | 'other';
  category: GrantCategory;
  estimated_funding: number;
  award_ceiling: number;
  award_floor: number;
  close_date: string;
  posted_date: string;
  eligibility: string[];
  url: string;
  relevance_tags: string[];
}

export type GrantCategory =
  | 'environmental_justice'
  | 'climate_resilience'
  | 'clean_energy'
  | 'brownfield_remediation'
  | 'community_development'
  | 'workforce_transition'
  | 'air_quality'
  | 'water_infrastructure'
  | 'food_access'
  | 'housing';

export async function searchGrants(keywords?: string[], categories?: GrantCategory[]): Promise<GrantOpportunity[]> {
  // TODO: Wire to Grants.gov Search API + EPA Grants API
  return [
    {
      id: 'EPA-OECA-OEJ-2026-01',
      opportunity_number: 'EPA-OECA-OEJ-2026-01',
      title: 'Environmental Justice Collaborative Problem-Solving Cooperative Agreement Program',
      agency: 'Environmental Protection Agency',
      agency_code: 'EPA',
      description: 'Provides financial assistance to community-based organizations to collaborate with stakeholders to develop solutions that address environmental and public health issues.',
      funding_instrument: 'cooperative_agreement',
      category: 'environmental_justice',
      estimated_funding: 30000000,
      award_ceiling: 500000,
      award_floor: 150000,
      close_date: '2026-06-30',
      posted_date: '2026-03-01',
      eligibility: ['501(c)(3) nonprofits', 'Community-based organizations', 'Tribal organizations'],
      url: 'https://www.grants.gov/view-opportunity.html?oppId=EPA-OECA-OEJ-2026-01',
      relevance_tags: ['environmental_justice', 'community_health', 'air_quality', 'stakeholder_engagement'],
    },
    {
      id: 'DOE-OCED-2026-CEJST',
      opportunity_number: 'DOE-OCED-2026-CEJST',
      title: 'Community Energy Transition Planning Grants',
      agency: 'Department of Energy',
      agency_code: 'DOE',
      description: 'Supports communities affected by energy transition with planning, workforce development, and economic diversification grants.',
      funding_instrument: 'grant',
      category: 'workforce_transition',
      estimated_funding: 75000000,
      award_ceiling: 2000000,
      award_floor: 250000,
      close_date: '2026-08-15',
      posted_date: '2026-04-01',
      eligibility: ['Local governments', 'Tribal governments', 'Nonprofits', 'Institutions of higher education'],
      url: 'https://www.grants.gov/view-opportunity.html?oppId=DOE-OCED-2026-CEJST',
      relevance_tags: ['just_transition', 'workforce', 'energy', 'economic_development'],
    },
    {
      id: 'EPA-OBLR-2026-BR',
      opportunity_number: 'EPA-OBLR-2026-BR',
      title: 'Brownfields Multipurpose, Assessment, and Cleanup Grants',
      agency: 'Environmental Protection Agency',
      agency_code: 'EPA',
      description: 'Provides grants and technical assistance to assess, safely clean up, and sustainably reuse contaminated properties.',
      funding_instrument: 'grant',
      category: 'brownfield_remediation',
      estimated_funding: 180000000,
      award_ceiling: 5000000,
      award_floor: 200000,
      close_date: '2026-11-01',
      posted_date: '2026-07-15',
      eligibility: ['Local governments', 'Land clearance authorities', 'Regional councils', 'Tribal governments', 'Nonprofits'],
      url: 'https://www.grants.gov/view-opportunity.html?oppId=EPA-OBLR-2026-BR',
      relevance_tags: ['brownfield', 'remediation', 'land_reuse', 'community_development'],
    },
  ];
}
