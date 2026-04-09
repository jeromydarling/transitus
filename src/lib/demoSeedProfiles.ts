/**
 * demoSeedProfiles — Deterministic scenario library for Demo Lab seeding.
 *
 * WHAT: Story-consistent, versioned data profiles for demo tenants.
 * WHERE: Used by demo-tenant-seed edge function and Demo Lab UI.
 * WHY: Reproducible, realistic demo data without external generators.
 */

export interface SeedProfile {
  key: 'small' | 'medium' | 'large';
  label: string;
  description: string;
  metros: number;
  organizations: number;
  contacts: number;
  events: number;
  activities: number;
  reflections: number;
  localPulseSources: number;
  provisions: number;
  volunteers: number;
  grants: number;
  anchors: number;
}

export const SEED_PROFILES: Record<string, SeedProfile> = {
  small: {
    key: 'small',
    label: 'Small Community',
    description: '12 orgs, 40 contacts, 3 metros — light activity history',
    metros: 3,
    organizations: 12,
    contacts: 40,
    events: 6,
    activities: 24,
    reflections: 8,
    localPulseSources: 4,
    provisions: 3,
    volunteers: 5,
    grants: 2,
    anchors: 1,
  },
  medium: {
    key: 'medium',
    label: 'Growing Network',
    description: '60 orgs, 300 contacts — realistic event cadence + reflections',
    metros: 6,
    organizations: 60,
    contacts: 300,
    events: 24,
    activities: 120,
    reflections: 40,
    localPulseSources: 12,
    provisions: 10,
    volunteers: 20,
    grants: 6,
    anchors: 4,
  },
  large: {
    key: 'large',
    label: 'Migration-Heavy',
    description: '200 orgs, 1200 contacts — dense activity logs for stress testing',
    metros: 12,
    organizations: 200,
    contacts: 1200,
    events: 60,
    activities: 500,
    reflections: 100,
    localPulseSources: 30,
    provisions: 25,
    volunteers: 50,
    grants: 12,
    anchors: 8,
  },
};

// ── Deterministic name pools ──

export const METRO_NAMES = [
  'Austin', 'Denver', 'Portland', 'Minneapolis', 'Detroit',
  'Nashville', 'Charlotte', 'Pittsburgh', 'Columbus', 'Indianapolis',
  'Phoenix', 'Seattle', 'Atlanta', 'Tampa', 'Kansas City',
  'Milwaukee', 'Raleigh', 'Memphis', 'Louisville', 'Richmond',
];

export const ORG_NAMES = [
  'Community First Alliance', 'Digital Bridge Foundation', 'Tech for All',
  'Neighborhood Connect', 'Metro Impact Partners', 'Future Ready Coalition',
  'Access Point Network', 'Civic Lab', 'Together Forward', 'Unity Project',
  'Pathways Hub', 'Bridge Builders', 'Community Compass', 'NextStep Foundation',
  'Open Door Initiative', 'Roots & Routes', 'Connected Communities', 'Uplift Partners',
  'Harbor House', 'Crossroads Collective', 'Thrive Alliance', 'Hope Network',
  'Rising Tide Foundation', 'Common Ground', 'Beacon Partners',
  'Sunrise Community Center', 'Prairie Wind Collective', 'Lakeside Outreach',
  'Mountain View Alliance', 'Riverside Initiative', 'Heartland Coalition',
  'Northern Light Foundation', 'Summit Partners', 'Valley Forge Network',
  'Coastal Impact Group', 'Pinewood Community Trust', 'Greenfield Cooperative',
  'Stonegate Foundation', 'Eastside Empowerment', 'Westbrook Initiative',
];

export const FIRST_NAMES = [
  'Maria', 'James', 'Fatima', 'David', 'Keiko', 'Robert', 'Aisha', 'Michael',
  'Priya', 'Thomas', 'Elena', 'Carlos', 'Mei', 'Joseph', 'Amara', 'Daniel',
  'Sofia', 'William', 'Yuki', 'Patrick', 'Zara', 'Samuel', 'Leila', 'Anthony',
];

export const LAST_NAMES = [
  'Johnson', 'Garcia', 'Patel', 'Williams', 'Chen', 'Brown', 'Kim', 'Davis',
  'Martinez', 'Lee', 'Wilson', 'Anderson', 'Taylor', 'Thomas', 'Moore', 'Jackson',
  'White', 'Harris', 'Clark', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen',
];

export const STAGES = [
  'Found', 'Contacted', 'Discovery Scheduled', 'Discovery Held',
  'Proposal Sent', 'Committed', 'Stable Producer',
];

export const EVENT_NAMES = [
  'Community Roundtable', 'Digital Inclusion Summit', 'Partner Breakfast',
  'Quarterly Review', 'Leadership Forum', 'Town Hall', 'Volunteer Appreciation',
  'Strategy Session', 'Neighborhood Walk', 'Annual Gathering',
  'Tech Access Workshop', 'Youth Empowerment Day', 'Health Fair',
];

export const TITLES = [
  'Executive Director', 'Director', 'Manager', 'Coordinator', 'VP',
  'Program Lead', 'Outreach Specialist', 'Community Liaison', 'Board Chair',
];

export const ACTIVITY_TYPES = [
  'call', 'email', 'meeting', 'event', 'site_visit', 'follow_up',
];

export const REFLECTION_PROMPTS = [
  'First impression of the partnership potential',
  'Key takeaway from the discovery meeting',
  'Observed growing community engagement',
  'Notable shift in organizational priorities',
  'Promising alignment with metro goals',
  'Relationship deepening over time',
  'Quiet progress worth noting',
  'Leadership transition observations',
];

export const GRANT_NAMES = [
  'Digital Inclusion Innovation Fund', 'Community Resilience Grant',
  'Workforce Development Partnership', 'Neighborhood Revitalization Award',
  'Youth Empowerment Initiative', 'Health Equity Access Fund',
  'Small Business Recovery Grant', 'Environmental Justice Fund',
  'Arts & Culture Community Grant', 'Housing Stability Program',
  'Education Access Initiative', 'Senior Services Support Fund',
];

export const FUNDER_NAMES = [
  'Local Community Foundation', 'National Endowment for Progress',
  'Metro Area United Way', 'State Department of Commerce',
  'Federal Housing Authority', 'Regional Arts Council',
  'Corporate Giving Alliance', 'Family Foundation Trust',
];
