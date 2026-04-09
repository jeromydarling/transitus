/**
 * Transitus Mock Data — realistic Just Transition demo scenarios
 */
import type {
  Place, Stakeholder, Organization, Commitment, FieldNote,
  Signal, Journey, LibraryItem, Report, DashboardData, CommunityStory,
} from '@/types/transitus';

// ── PLACES ──
export const MOCK_PLACES: Place[] = [
  {
    id: 'place-1',
    name: 'Southeast Chicago Industrial Corridor',
    description: 'A historically industrial corridor along the Calumet River, home to steelworks, petroleum terminals, and waste facilities — now in active transition as communities organize for environmental justice and economic reinvestment.',
    place_type: 'corridor',
    geography: 'Chicago, IL',
    lat: 41.7308, lng: -87.5545,
    communities: ['South Deering', 'East Side', 'South Chicago', 'Hegewisch'],
    key_institutions: ['Southeast Environmental Task Force', 'Alliance of the Southeast', 'St. Kevin Parish', 'Calumet Area Industrial Commission'],
    land_use: ['Heavy industrial', 'Petroleum storage', 'Brownfield', 'Residential', 'Wetland'],
    transition_issues: ['Petcoke storage', 'Manganese dust', 'Scrap metal shredding relocation', 'Calumet River contamination', 'Lack of grocery access'],
    population_estimate: 48000,
    human_impact_summary: '48,000 residents \u2014 mostly low-income families and communities of color \u2014 live surrounded by active industrial operations that produce some of the worst air quality in Illinois. Children here have asthma hospitalization rates 2.5x the city average. But this is also a community that has organized for decades: SETF has been fighting for clean air since 1989, residents serve on air monitoring committees, and a coalition of faith, civic, and environmental groups is working to ensure that transition brings justice, not just change.',
    most_affected_populations: ['children_under_12', 'elderly_over_65', 'renters', 'limited_english_speakers', 'uninsured'],
    health_snapshot: 'Asthma hospitalization 2.5x city avg. Elevated lead exposure in children. Respiratory complaints increasing since new shredder operations began.',
    displacement_pressure: 'moderate',
    environmental_burdens: [
      { category: 'air', name: 'Diesel & particulate emissions', severity: 'critical', description: 'Truck traffic from industrial operations produces high PM2.5 and diesel exhaust.', source: 'EPA EJScreen' },
      { category: 'water', name: 'Calumet River contamination', severity: 'high', description: 'Legacy industrial discharge and combined sewer overflows.', source: 'EPA ECHO' },
      { category: 'land', name: 'Brownfield sites', severity: 'high', description: 'Multiple former steel and manufacturing sites require remediation.', source: 'EPA Brownfields' },
      { category: 'health', name: 'Asthma & respiratory illness', severity: 'high', description: 'Hospitalization rates 2.5x city average in adjacent census tracts.', source: 'IDPH' },
      { category: 'climate', name: 'Urban heat island', severity: 'moderate', description: 'Limited tree canopy and impervious surfaces amplify heat.', source: 'NOAA' },
    ],
    active_work: [
      { id: 'aw-1', title: 'EPA Region 5 Community Engagement Session', type: 'hearing', date: '2026-04-15', status: 'upcoming' },
      { id: 'aw-2', title: 'Calumet River Brownfield Assessment', type: 'project_milestone', status: 'in_progress' },
      { id: 'aw-3', title: 'Coalition response to Reserve Management permit', type: 'campaign', status: 'in_progress' },
    ],
    created_at: '2025-06-01T00:00:00Z', updated_at: '2026-04-01T00:00:00Z',
  },
  {
    id: 'place-2',
    name: 'East Boston Waterfront',
    description: 'A densely populated, majority-Latino neighborhood facing simultaneous pressures from Logan Airport expansion, coastal flooding, luxury development, and displacement — organized through a strong network of environmental justice groups.',
    place_type: 'neighborhood',
    geography: 'Boston, MA',
    lat: 42.3751, lng: -71.0228,
    communities: ['East Boston', 'Jeffries Point', 'Orient Heights', 'Eagle Hill'],
    key_institutions: ['GreenRoots', 'East Boston Community Development Corporation', 'Maverick Landing Community Services', 'Neighborhood of Affordable Housing'],
    land_use: ['Residential', 'Airport-adjacent', 'Waterfront', 'Mixed commercial', 'Coastal zone'],
    transition_issues: ['Airport noise & jet fuel emissions', 'Coastal flooding & sea level rise', 'Gentrification & displacement', 'Lack of open space', 'Environmental racism in siting decisions'],
    population_estimate: 45000,
    human_impact_summary: '45,000 residents \u2014 a majority-Latino immigrant community \u2014 live under the flight path of one of the nation\u2019s busiest airports. Families report headaches and sleeplessness, and children face elevated asthma rates. But East Boston is also home to GreenRoots, one of the strongest environmental justice organizations in New England, and a community leadership program that is training immigrant residents to advocate for coastal resilience and clean air in their own languages.',
    most_affected_populations: ['children_under_12', 'immigrant_families', 'renters', 'coastal_zone_residents'],
    health_snapshot: 'Pediatric asthma significantly above state average. Ultrafine particle exposure from jet fuel linked to cardiovascular and respiratory illness.',
    displacement_pressure: 'critical',
    environmental_burdens: [
      { category: 'air', name: 'Jet fuel & ultrafine particles', severity: 'critical', description: 'Proximity to Logan Airport exposes residents to aviation emissions.', source: 'EPA EJScreen' },
      { category: 'climate', name: 'Coastal flood risk', severity: 'critical', description: 'FEMA flood zone covers 40% of neighborhood. Sea level rise projections threaten critical infrastructure.', source: 'FEMA/NOAA' },
      { category: 'health', name: 'Childhood asthma', severity: 'high', description: 'Pediatric asthma rates significantly above state average.', source: 'BPHC' },
    ],
    active_work: [
      { id: 'aw-4', title: 'Resilient East Boston coastal plan', type: 'project_milestone', status: 'in_progress' },
      { id: 'aw-5', title: 'Massport Community Advisory Committee meeting', type: 'coalition_meeting', date: '2026-04-22', status: 'upcoming' },
    ],
    created_at: '2025-08-15T00:00:00Z', updated_at: '2026-03-20T00:00:00Z',
  },
  {
    id: 'place-3',
    name: 'Little Village / La Villita',
    description: 'A vibrant Mexican-American neighborhood on Chicago\'s southwest side, long burdened by the Crawford Coal Plant (now closed) and ongoing logistics/warehouse corridor expansion. Community organizing led to the plant\'s closure and continues to shape redevelopment.',
    place_type: 'neighborhood',
    geography: 'Chicago, IL',
    lat: 41.8456, lng: -87.7131,
    communities: ['Little Village', 'South Lawndale', 'North Lawndale (adjacent)'],
    key_institutions: ['Little Village Environmental Justice Organization (LVEJO)', 'Enlace Chicago', 'St. Agnes of Bohemia Parish', 'Little Village Community Council'],
    land_use: ['Residential', 'Former power plant', 'Commercial corridor (26th St)', 'Logistics', 'Parks'],
    transition_issues: ['Crawford plant redevelopment', 'Warehouse/logistics expansion', 'Diesel truck traffic', 'Open space deficit', 'Youth employment'],
    population_estimate: 73000,
    human_impact_summary: '73,000 residents \u2014 one of the most vibrant Mexican-American neighborhoods in the Midwest \u2014 lived for decades downwind of the Crawford Coal Plant. The plant is closed now, but the health legacy remains: elevated rates of respiratory illness, cancer clusters, and a generation of children who grew up breathing coal dust. The community that organized to shut the plant is now fighting to ensure redevelopment serves them, not displaces them.',
    most_affected_populations: ['children_with_respiratory_illness', 'elderly_long_term_residents', 'undocumented_families', 'workers_in_informal_economy'],
    health_snapshot: 'Decades of coal and diesel exposure produced elevated respiratory illness, cancer clusters, and cardiovascular disease. Health impacts persist years after plant closure.',
    displacement_pressure: 'high',
    environmental_burdens: [
      { category: 'air', name: 'Diesel corridor emissions', severity: 'high', description: 'I-55 logistics corridor produces heavy truck traffic through residential streets.', source: 'EPA EJScreen' },
      { category: 'land', name: 'Crawford Plant brownfield', severity: 'moderate', description: 'Former coal plant site under redevelopment — community demanding green reuse.', source: 'EPA Brownfields' },
      { category: 'health', name: 'Respiratory illness rates', severity: 'high', description: 'Decades of coal plant and diesel exposure have produced elevated respiratory illness.', source: 'CDPH' },
    ],
    active_work: [
      { id: 'aw-6', title: 'Crawford site community benefits agreement negotiation', type: 'campaign', status: 'in_progress' },
      { id: 'aw-7', title: 'La Villita Park expansion hearing', type: 'hearing', date: '2026-05-10', status: 'upcoming' },
    ],
    created_at: '2025-07-01T00:00:00Z', updated_at: '2026-04-05T00:00:00Z',
  },
];

// ── ORGANIZATIONS ──
export const MOCK_ORGS: Organization[] = [
  { id: 'org-1', name: 'Southeast Environmental Task Force (SETF)', org_type: 'ej_group', description: 'Community-based organization fighting for environmental justice in Southeast Chicago since 1989.', website: 'https://setaskforce.org', place_ids: ['place-1'], stakeholder_ids: ['s-1', 's-2'], tags: ['ej', 'advocacy', 'community_organizing'], created_at: '2025-06-01T00:00:00Z' },
  { id: 'org-2', name: 'GreenRoots', org_type: 'ej_group', description: 'Environmental justice organization in East Boston, combining youth leadership, community organizing, and waterfront stewardship.', website: 'https://www.greenrootschelsea.org', place_ids: ['place-2'], stakeholder_ids: ['s-3', 's-4'], tags: ['ej', 'youth', 'coastal', 'organizing'], created_at: '2025-08-01T00:00:00Z' },
  { id: 'org-3', name: 'Catholic Impact Investing Collaborative (CIIC)', org_type: 'foundation', description: 'Catholic investors seeking to align capital with communities through Just Transition and impact investing.', website: 'https://catholicimpact.org', place_ids: ['place-1', 'place-3'], stakeholder_ids: ['s-5', 's-6'], tags: ['faith', 'investment', 'just_transition'], created_at: '2025-06-01T00:00:00Z' },
  { id: 'org-4', name: 'Little Village Environmental Justice Organization (LVEJO)', org_type: 'ej_group', description: 'Led the campaign to close Crawford Coal Plant and now fighting for equitable redevelopment.', website: 'https://lvejo.org', place_ids: ['place-3'], stakeholder_ids: ['s-7', 's-8'], tags: ['ej', 'coal', 'redevelopment', 'community_power'], created_at: '2025-07-01T00:00:00Z' },
  { id: 'org-5', name: 'Alliance of the Southeast', org_type: 'neighborhood_association', description: 'Multi-issue community organization serving Southeast Side neighborhoods.', place_ids: ['place-1'], stakeholder_ids: ['s-9'], tags: ['housing', 'community', 'multi-issue'], created_at: '2025-06-15T00:00:00Z' },
  { id: 'org-6', name: 'Interfaith Center on Corporate Responsibility (ICCR)', org_type: 'ngo', description: 'Coalition of faith-based investors engaging corporations on environmental justice and Just Transition.', website: 'https://www.iccr.org', place_ids: ['place-1', 'place-2', 'place-3'], stakeholder_ids: ['s-6'], tags: ['faith', 'shareholder_advocacy', 'corporate_engagement'], created_at: '2025-06-01T00:00:00Z' },
  { id: 'org-7', name: 'Archdiocese of Chicago — Office of Human Dignity', org_type: 'diocese', description: 'Diocesan office connecting parishes with environmental justice and care for creation initiatives.', place_ids: ['place-1', 'place-3'], stakeholder_ids: ['s-10'], tags: ['faith', 'cst', 'laudato_si'], created_at: '2025-09-01T00:00:00Z' },
];

// ── STAKEHOLDERS ──
export const MOCK_STAKEHOLDERS: Stakeholder[] = [
  { id: 's-1', name: 'Maria Santos', role: 'steward', organization_id: 'org-1', title: 'Executive Director', bio: 'Has led SETF for 12 years. Deep knowledge of every industrial site on the Southeast Side.', place_ids: ['place-1'], tags: ['leadership', 'policy'], trust_level: 'deep', last_contact: '2026-04-02', created_at: '2025-06-01T00:00:00Z' },
  { id: 's-2', name: 'James Washington', role: 'field_companion', organization_id: 'org-1', title: 'Community Organizer', bio: 'Born and raised in South Deering. Conducts site visits and documents conditions.', place_ids: ['place-1'], tags: ['field_work', 'documentation'], trust_level: 'established', last_contact: '2026-03-28', created_at: '2025-06-15T00:00:00Z' },
  { id: 's-3', name: 'Rosa Velasquez', role: 'convener', organization_id: 'org-2', title: 'Director of Programs', bio: 'Connects airport-affected communities with policymakers and researchers.', place_ids: ['place-2'], tags: ['convening', 'bilingual'], trust_level: 'deep', last_contact: '2026-04-01', created_at: '2025-08-01T00:00:00Z' },
  { id: 's-4', name: 'Destiny Okafor', role: 'resident_witness', organization_id: 'org-2', title: 'Youth Leader', bio: '19 years old. Grew up under the flight path. Testimony was key in the Massport noise study.', place_ids: ['place-2'], tags: ['youth', 'testimony', 'health'], trust_level: 'building', last_contact: '2026-03-15', created_at: '2025-09-01T00:00:00Z' },
  { id: 's-5', name: 'Fr. Thomas Brennan', role: 'sponsor', organization_id: 'org-3', title: 'Program Director, CIIC', bio: 'Bridges Catholic social teaching with impact investing strategy.', place_ids: ['place-1', 'place-3'], tags: ['faith', 'investment', 'cst'], trust_level: 'established', last_contact: '2026-03-20', created_at: '2025-06-01T00:00:00Z' },
  { id: 's-6', name: 'Christina Herman', role: 'analyst', organization_id: 'org-6', title: 'Climate Program Director, ICCR', bio: 'Leads investor engagement on utility decarbonization and Just Transition.', place_ids: ['place-1', 'place-2'], tags: ['shareholder_advocacy', 'utilities', 'climate'], trust_level: 'established', last_contact: '2026-03-25', created_at: '2025-07-01T00:00:00Z' },
  { id: 's-7', name: 'Antonio Lopez', role: 'steward', organization_id: 'org-4', title: 'Director', bio: 'Led the decade-long campaign to close Crawford Coal Plant. Now focused on equitable redevelopment.', place_ids: ['place-3'], tags: ['leadership', 'coal', 'redevelopment'], trust_level: 'deep', last_contact: '2026-04-03', created_at: '2025-07-01T00:00:00Z' },
  { id: 's-8', name: 'Elena Ramirez', role: 'listener', organization_id: 'org-4', title: 'Community Health Worker', bio: 'Documents health impacts of decades of coal and diesel exposure in La Villita.', place_ids: ['place-3'], tags: ['health', 'testimony', 'bilingual'], trust_level: 'established', last_contact: '2026-03-30', created_at: '2025-08-01T00:00:00Z' },
  { id: 's-9', name: 'Deandre Mitchell', role: 'convener', organization_id: 'org-5', title: 'Lead Organizer', bio: 'Focuses on housing and transit equity in Southeast Side neighborhoods.', place_ids: ['place-1'], tags: ['housing', 'transit', 'organizing'], trust_level: 'building', last_contact: '2026-02-28', created_at: '2025-06-15T00:00:00Z' },
  { id: 's-10', name: 'Sr. Margaret Keane', role: 'listener', organization_id: 'org-7', title: 'Program Coordinator', bio: 'Connects parishes with EJ communities. Facilitates listening sessions.', place_ids: ['place-1', 'place-3'], tags: ['faith', 'listening', 'parishes'], trust_level: 'established', last_contact: '2026-03-18', created_at: '2025-09-01T00:00:00Z' },
  { id: 's-11', name: 'Ald. Patricia Navarro', role: 'convener', title: 'Alderperson, 10th Ward', bio: 'Represents Southeast Chicago. Key liaison between community and city permitting.', place_ids: ['place-1'], tags: ['elected', 'permitting', 'policy'], trust_level: 'building', last_contact: '2026-01-15', created_at: '2025-10-01T00:00:00Z' },
  { id: 's-12', name: 'Jake Barnett', role: 'sponsor', organization_id: 'org-6', title: 'Director, Sustainable Investment Services, Wespath', bio: 'Approaches Just Transition from both top-down investor engagement and bottom-up community listening.', place_ids: ['place-1', 'place-2', 'place-3'], tags: ['investment', 'pension', 'transition'], trust_level: 'established', last_contact: '2026-03-05', created_at: '2025-06-01T00:00:00Z' },
];

// ── COMMITMENTS ──
export const MOCK_COMMITMENTS: Commitment[] = [
  { id: 'c-1', title: 'Reserve Management Group relocation air monitoring', description: 'RMG committed to fund independent air quality monitoring during scrap shredding operations at the new SE Side facility.', commitment_type: 'legal_agreement', status: 'in_motion', made_by_org_id: undefined, made_to_place_id: 'place-1', context: 'Part of City permit conditions after community pressure.', community_interpretation: 'Community views this as insufficient — they wanted denial of the permit, not monitoring.', evidence: [{ id: 'e-1', type: 'document', title: 'City of Chicago permit conditions', date: '2025-11-15' }], renewal_date: '2026-06-01', place_ids: ['place-1'], created_at: '2025-11-15T00:00:00Z', updated_at: '2026-03-01T00:00:00Z' },
  { id: 'c-2', title: 'Crawford site community benefits agreement', description: 'Developer Hilco committed to community hiring, green space, and pollution controls for the Crawford redevelopment.', commitment_type: 'cba', status: 'delayed', made_by_org_id: undefined, made_to_place_id: 'place-3', context: 'Negotiated after 3 years of LVEJO organizing.', community_interpretation: 'LVEJO reports key provisions (local hiring targets, green space acreage) remain unmet.', evidence: [{ id: 'e-2', type: 'meeting_note', title: 'CBA negotiation session #12', date: '2025-09-10' }], renewal_date: '2026-09-01', place_ids: ['place-3'], created_at: '2025-09-10T00:00:00Z', updated_at: '2026-03-15T00:00:00Z' },
  { id: 'c-3', title: 'Massport noise mitigation program expansion', description: 'Massport pledged to expand sound insulation program to 800 additional East Boston homes.', commitment_type: 'public_pledge', status: 'in_motion', made_to_place_id: 'place-2', context: 'Response to community pressure and FAA Part 150 study.', evidence: [{ id: 'e-3', type: 'press', title: 'Boston Globe: Massport expands noise program', date: '2025-12-01' }], place_ids: ['place-2'], created_at: '2025-12-01T00:00:00Z', updated_at: '2026-02-15T00:00:00Z' },
  { id: 'c-4', title: 'CIIC Just Transition investment screen adoption', description: 'CIIC members committed to applying Just Transition criteria to portfolio analysis for energy holdings.', commitment_type: 'shareholder_engagement', status: 'accepted', made_by_org_id: 'org-3', context: 'Adopted at CIIC annual gathering after presentation by ICCR.', evidence: [{ id: 'e-4', type: 'meeting_note', title: 'CIIC Annual Gathering notes', date: '2026-01-20' }], place_ids: ['place-1', 'place-2', 'place-3'], created_at: '2026-01-20T00:00:00Z', updated_at: '2026-01-20T00:00:00Z' },
  { id: 'c-5', title: 'Calumet River cleanup — EPA Superfund assessment', description: 'EPA committed to completing preliminary assessment of Calumet River sediment contamination.', commitment_type: 'grant_condition', status: 'in_motion', made_to_place_id: 'place-1', context: 'Long-sought by SETF. Assessment funded through IIJA Superfund allocation.', evidence: [{ id: 'e-5', type: 'document', title: 'EPA PA/SI work plan', date: '2026-02-01' }], place_ids: ['place-1'], created_at: '2026-02-01T00:00:00Z', updated_at: '2026-03-20T00:00:00Z' },
  { id: 'c-6', title: 'GreenRoots coastal resilience plan adoption', description: 'City of Boston committed to incorporating GreenRoots community priorities into the East Boston coastal resilience plan.', commitment_type: 'public_pledge', status: 'acknowledged', made_to_place_id: 'place-2', context: 'After years of advocacy, city planning formally recognized community-defined priorities.', evidence: [], place_ids: ['place-2'], created_at: '2026-03-01T00:00:00Z', updated_at: '2026-03-01T00:00:00Z' },
  { id: 'c-7', title: 'Archdiocese Laudato Si\' action plan — Southeast parishes', description: 'Archdiocese of Chicago committed to a Laudato Si\' action plan connecting Southeast Side parishes with environmental justice work.', commitment_type: 'diocesan_policy', status: 'proposed', made_by_org_id: 'org-7', context: 'Proposed by Sr. Margaret Keane\'s office; awaiting chancery approval.', evidence: [], place_ids: ['place-1'], created_at: '2026-03-15T00:00:00Z', updated_at: '2026-03-15T00:00:00Z' },
];

// ── FIELD NOTES ──
export const MOCK_FIELD_NOTES: FieldNote[] = [
  { id: 'fn-1', author_id: 's-2', place_id: 'place-1', note_type: 'site_visit', content: 'Visited the RMG facility perimeter. Visible dust plume at 2:15 PM despite wind advisory. Took photos from 106th and Burley. Three residents stopped to talk — all mentioned increased headaches this month.', what_i_saw: 'Active dust plume from shredder operation during high-wind advisory', who_i_spoke_with: 'Three residents near 106th & Burley', what_changed: 'Dust appears more frequent since new shredder operations began', follow_up: 'Share photos with SETF legal team. Check IEPA complaint log.', tags: ['air', 'health'], is_testimony: false, created_at: '2026-04-02T14:30:00Z' },
  { id: 'fn-2', author_id: 's-4', place_id: 'place-2', note_type: 'community_meeting', content: 'Testified at Massport Community Advisory Committee. Shared my story of growing up under the flight path — nosebleeds, headaches, inability to sleep. Committee members listened but no concrete commitments made.', is_testimony: true, consent_level: 'public', tags: ['air', 'health'], created_at: '2026-03-22T19:00:00Z' },
  { id: 'fn-3', author_id: 's-8', place_id: 'place-3', note_type: 'household_interview', content: 'Spoke with Señora Gutierrez on 26th Street. She remembers when the Crawford plant smoke was so thick you could taste it. Her grandson has asthma. She wants the new development to include a health clinic.', who_i_spoke_with: 'Resident, 26th Street', is_testimony: true, consent_level: 'trusted_allies', tags: ['health', 'housing', 'culture'], created_at: '2026-03-30T10:00:00Z' },
  { id: 'fn-4', author_id: 's-10', place_id: 'place-1', note_type: 'listening_session', content: 'Facilitated a listening session at St. Kevin Parish with 18 parishioners. Main concerns: truck traffic on residential streets, loss of young families, desire for green space. Several mentioned feeling abandoned by the city.', who_i_spoke_with: '18 parishioners at St. Kevin', what_changed: 'First time several attendees had connected their health issues to nearby industrial operations', follow_up: 'Connect interested parishioners with SETF. Plan follow-up in 3 weeks.', tags: ['faith', 'health', 'housing'], is_testimony: false, created_at: '2026-03-18T18:30:00Z' },
  { id: 'fn-5', author_id: 's-3', place_id: 'place-2', note_type: 'corridor_observation', content: 'Walked the waterfront from Piers Park to LoPresti Park. Noticed new luxury condo construction at 3 sites. Talked to a fisherman who\'s been coming to the pier for 30 years — says the neighborhood is unrecognizable. "They\'re building for people who aren\'t from here."', what_i_saw: 'Three active luxury construction sites on waterfront', who_i_spoke_with: 'Long-time local fisherman', tags: ['housing', 'displacement', 'culture'], is_testimony: false, created_at: '2026-04-01T09:00:00Z' },
  { id: 'fn-6', author_id: 's-1', place_id: 'place-1', note_type: 'utility_meeting', content: 'Met with ComEd representatives about the proposed substation expansion at 100th & Torrence. They claim community benefit, but residents weren\'t consulted before site selection. Pushed for environmental review and community engagement timeline.', who_i_spoke_with: 'ComEd regional planning team (3 representatives)', follow_up: 'Request formal community engagement plan. Brief coalition partners.', tags: ['energy', 'permitting'], is_testimony: false, created_at: '2026-03-25T14:00:00Z' },
];

// ── SIGNALS ──
export const MOCK_SIGNALS: Signal[] = [
  { id: 'sig-1', title: 'EPA announces $180M in Brownfields grants for FY2026', summary: 'New round of brownfield assessment and cleanup grants. Southeast Chicago eligible.', source: 'epa', category: 'funding_opportunity', place_ids: ['place-1', 'place-3'], url: 'https://www.epa.gov/brownfields', published_at: '2026-04-01T00:00:00Z', severity: 'notable', is_read: false, created_at: '2026-04-01T00:00:00Z' },
  { id: 'sig-2', title: 'City Council hearing on Southeast Side industrial zoning', summary: 'Committee on Zoning scheduled hearing on proposed changes to M2/M3 industrial districts.', source: 'public_hearing', category: 'hearing_notice', place_ids: ['place-1'], published_at: '2026-04-10T00:00:00Z', severity: 'urgent', is_read: false, created_at: '2026-04-05T00:00:00Z' },
  { id: 'sig-3', title: 'Heat advisory: extreme heat expected through weekend', summary: 'Heat index values up to 105°F. Urban heat island effects will be worst in industrial corridors.', source: 'noaa', category: 'climate_alert', place_ids: ['place-1', 'place-3'], published_at: '2026-04-08T00:00:00Z', severity: 'urgent', is_read: true, created_at: '2026-04-08T00:00:00Z' },
  { id: 'sig-4', title: 'Massport releases updated noise contour maps', summary: 'New maps show expanded noise impact zones affecting additional East Boston blocks.', source: 'state_agency', category: 'project_update', place_ids: ['place-2'], published_at: '2026-03-28T00:00:00Z', severity: 'notable', is_read: true, created_at: '2026-03-28T00:00:00Z' },
  { id: 'sig-5', title: 'DOE Community Energy Transition grants: $75M available', summary: 'New grant program for communities affected by energy transition.', source: 'grants_gov', category: 'funding_opportunity', place_ids: ['place-1', 'place-2', 'place-3'], published_at: '2026-04-01T00:00:00Z', severity: 'notable', is_read: false, created_at: '2026-04-01T00:00:00Z' },
  { id: 'sig-6', title: 'IEPA violation notice: particulate emissions at SE Side terminal', summary: 'Illinois EPA issued violation notice for repeated PM2.5 exceedances at petroleum terminal.', source: 'state_agency', category: 'enforcement_action', place_ids: ['place-1'], published_at: '2026-03-20T00:00:00Z', severity: 'urgent', is_read: true, created_at: '2026-03-20T00:00:00Z' },
  { id: 'sig-7', title: 'Boston Climate Ready: updated sea level rise projections', summary: 'New projections show 40-inch rise possible by 2070. East Boston among most vulnerable neighborhoods.', source: 'news', category: 'climate_alert', place_ids: ['place-2'], url: 'https://www.boston.gov/climate-ready', published_at: '2026-03-15T00:00:00Z', severity: 'notable', is_read: true, created_at: '2026-03-15T00:00:00Z' },
  { id: 'sig-8', title: 'Crawford redevelopment: Hilco submits revised site plan', summary: 'Updated plans reduce green space by 15% from CBA targets. LVEJO demands public review.', source: 'community', category: 'project_update', place_ids: ['place-3'], published_at: '2026-04-03T00:00:00Z', severity: 'urgent', is_read: false, created_at: '2026-04-03T00:00:00Z' },
];

// ── JOURNEYS ──
export const MOCK_JOURNEYS: Journey[] = [
  {
    id: 'j-1', title: 'The Southeast Side Industrial Transition', journey_type: 'plant_closure', place_id: 'place-1',
    description: 'The decades-long story of Southeast Chicago\'s industrial corridor — from steel mills to petcoke piles to the fight for environmental justice and equitable reinvestment.',
    stakeholder_ids: ['s-1', 's-2', 's-9', 's-5', 's-11'],
    commitment_ids: ['c-1', 'c-5'],
    tensions: ['Industrial jobs vs. environmental health', 'City economic development priorities vs. community self-determination', 'Speed of transition vs. thoroughness of cleanup'],
    open_questions: ['Will the Calumet River Superfund assessment lead to full remediation?', 'Can community benefits be enforced without a binding CBA?', 'How will displaced workers from closing facilities be supported?'],
    chapters: [
      { id: 'ch-1', title: 'The Steel Era Ends', chapter_type: 'recognition', narrative: 'By 2000, the last major steel operations had closed, leaving behind contaminated land, displaced workers, and a community identity shaped by a century of industry.', date_range: '1980–2005', linked_note_ids: [], linked_commitment_ids: [], linked_signal_ids: [], what_changed: 'The economic base collapsed. Environmental contamination remained.' },
      { id: 'ch-2', title: 'Petcoke and Manganese', chapter_type: 'listening', narrative: 'New industrial tenants — petcoke storage, manganese processing, scrap shredding — brought new burdens. SETF began systematic documentation of community health impacts.', date_range: '2010–2018', linked_note_ids: [], linked_commitment_ids: [], linked_signal_ids: [], what_changed: 'Community organized. SETF became the institutional memory.' },
      { id: 'ch-3', title: 'Organizing for Accountability', chapter_type: 'coalition_building', narrative: 'Coalition expanded to include faith communities, investors (CIIC), and policy allies. First successful enforcement actions against petcoke operators.', date_range: '2018–2024', linked_note_ids: ['fn-6'], linked_commitment_ids: ['c-1'], linked_signal_ids: ['sig-6'], what_changed: 'Political leverage increased. City began acknowledging cumulative burden.' },
      { id: 'ch-4', title: 'The Current Chapter', chapter_type: 'negotiation', narrative: 'Multiple active fronts: RMG shredder monitoring, Calumet Superfund assessment, ComEd substation siting, and emerging brownfield redevelopment opportunities.', date_range: '2024–present', linked_note_ids: ['fn-1', 'fn-4'], linked_commitment_ids: ['c-1', 'c-5', 'c-7'], linked_signal_ids: ['sig-1', 'sig-2', 'sig-6'], what_changed: 'Federal resources arriving. Question is whether community will control the narrative.' },
    ],
    started_at: '2025-06-01T00:00:00Z', updated_at: '2026-04-05T00:00:00Z',
  },
  {
    id: 'j-2', title: 'Crawford Coal Plant: From Closure to Redevelopment', journey_type: 'brownfield_redevelopment', place_id: 'place-3',
    description: 'The story of how a community shut down a coal plant and now fights for a redevelopment that serves the people who bore the burden.',
    stakeholder_ids: ['s-7', 's-8', 's-5', 's-10'],
    commitment_ids: ['c-2'],
    tensions: ['Developer profit motive vs. community health needs', 'Jobs promised vs. jobs delivered', 'Speed of development vs. environmental thoroughness'],
    open_questions: ['Will Hilco honor the CBA green space commitments?', 'What will the long-term health monitoring program look like?', 'Can the site become a model for equitable brownfield redevelopment?'],
    chapters: [
      { id: 'ch-5', title: 'A Century of Coal', chapter_type: 'recognition', narrative: 'Crawford Generating Station operated from 1924 to 2012, burning coal in a neighborhood where children played in its shadow.', date_range: '1924–2012', linked_note_ids: [], linked_commitment_ids: [], linked_signal_ids: [] },
      { id: 'ch-6', title: 'The Campaign', chapter_type: 'coalition_building', narrative: 'LVEJO led a decade-long grassroots campaign connecting health data, community testimony, and policy advocacy to force the plant\'s closure.', date_range: '2002–2012', linked_note_ids: ['fn-3'], linked_commitment_ids: [], linked_signal_ids: [] },
      { id: 'ch-7', title: 'Redevelopment Battles', chapter_type: 'negotiation', narrative: 'Hilco acquired the site for a massive logistics warehouse. LVEJO fought for and won a CBA — but enforcement has been contentious.', date_range: '2018–present', linked_note_ids: ['fn-3'], linked_commitment_ids: ['c-2'], linked_signal_ids: ['sig-8'], what_changed: 'CBA signed but key provisions unmet. Community trust in developer is eroding.' },
    ],
    started_at: '2025-07-01T00:00:00Z', updated_at: '2026-04-03T00:00:00Z',
  },
];

// ── LIBRARY ──
export const MOCK_LIBRARY: LibraryItem[] = [
  { id: 'lib-1', title: 'What Is Just Transition?', category: 'just_transition', item_type: 'framework', description: 'A foundational overview of the Just Transition framework — from its roots in labor and environmental justice movements to its current application.', content: 'Just Transition lies at the intersection of environmental justice, labor, and human rights movements...', tags: ['beginner', 'framework'], formation_track: 'beginner', created_at: '2025-06-01T00:00:00Z' },
  { id: 'lib-2', title: 'Listening Session Facilitation Guide', category: 'stakeholder_engagement', item_type: 'template', description: 'A step-by-step guide for facilitating community listening sessions that center affected voices.', content: 'Preparation: 1. Identify and personally invite community members...', tags: ['template', 'engagement', 'facilitation'], formation_track: 'organizer', created_at: '2025-07-01T00:00:00Z' },
  { id: 'lib-3', title: 'Investor Expectations for Just Transition', category: 'fiduciary_stewardship', item_type: 'framework', description: 'Based on ICCR and Harvard IRI work — a set of questions and expectations investors can bring to energy utility engagements.', content: 'Investors should ask: 1. Has the company identified communities most affected...', tags: ['investor', 'framework', 'utilities'], formation_track: 'investor', created_at: '2025-08-01T00:00:00Z' },
  { id: 'lib-4', title: 'Community Benefits Agreement Template', category: 'community_benefits', item_type: 'template', description: 'A starting template for CBAs that encodes community priorities: local hiring, environmental monitoring, green space, and accountability mechanisms.', content: 'Section 1: Parties and Purpose...', tags: ['template', 'legal', 'cba'], formation_track: 'organizer', created_at: '2025-09-01T00:00:00Z' },
  { id: 'lib-5', title: 'Care for Creation: CST and Environmental Stewardship', category: 'faith_rooted', item_type: 'reading', description: 'An accessible introduction to Catholic Social Teaching principles as they apply to environmental justice and transition work.', content: 'The principle of the universal destination of goods tells us that the earth\'s resources...', tags: ['faith', 'cst', 'laudato_si'], formation_track: 'faith_rooted_leader', created_at: '2025-10-01T00:00:00Z' },
  { id: 'lib-6', title: 'Southeast Chicago: A Case Study in Community Power', category: 'environmental_justice', item_type: 'case_study', description: 'How SETF and allies turned decades of industrial burden into a platform for environmental justice and equitable reinvestment.', content: 'For over a century, the Southeast Side of Chicago was defined by steel...', tags: ['case_study', 'chicago', 'ej'], created_at: '2025-11-01T00:00:00Z' },
];

// ── REPORTS ──
export const MOCK_REPORTS: Report[] = [
  { id: 'r-1', title: 'Southeast Chicago — Place Brief', report_type: 'place_brief', place_id: 'place-1', generated_at: '2026-04-01T00:00:00Z', content_summary: 'Comprehensive overview of the Southeast Chicago Industrial Corridor including environmental burdens, active stakeholders, commitments, and transition progress.', sections: [
    { title: 'Place Overview', content: 'The Southeast Chicago Industrial Corridor stretches along the Calumet River...', type: 'narrative' },
    { title: 'Environmental Burden Summary', content: 'Five critical burdens identified through EPA EJScreen and community documentation...', type: 'data' },
    { title: 'Active Commitments', content: '3 active commitments tracked. 1 in motion, 1 proposed, 1 from federal agency...', type: 'commitments' },
    { title: 'Community Voices', content: '"They\'re building for people who aren\'t from here." — Long-time resident', type: 'testimony' },
  ]},
  { id: 'r-2', title: 'Q1 2026 — Quarter in Review', report_type: 'quarter_in_review', generated_at: '2026-04-01T00:00:00Z', content_summary: 'Summary of transition activity across all tracked places for Q1 2026.', sections: [
    { title: 'Executive Summary', content: 'Three places actively tracked. 7 commitments monitored...', type: 'narrative' },
    { title: 'Signals Summary', content: '12 signals captured in Q1. 3 rated urgent...', type: 'data' },
    { title: 'Field Activity', content: '6 field notes captured across 3 places by 5 team members...', type: 'narrative' },
  ]},
  { id: 'r-3', title: 'Commitment Status Report — All Places', report_type: 'commitment_status', generated_at: '2026-04-05T00:00:00Z', content_summary: 'Status of all tracked commitments across the Transitus workspace.', sections: [
    { title: 'Overview', content: '7 commitments tracked. 2 in motion, 1 delayed, 1 accepted, 1 acknowledged, 1 proposed, 1 complete analogue pending.', type: 'commitments' },
    { title: 'Attention Required', content: 'Crawford CBA (delayed) — Hilco submitted revised plans reducing green space below CBA threshold...', type: 'narrative' },
  ]},
];

// ── DASHBOARD ──
export const MOCK_DASHBOARD: DashboardData = {
  places_count: 3,
  active_commitments: 5,
  recent_signals: MOCK_SIGNALS.filter(s => !s.is_read).slice(0, 4),
  upcoming_renewals: MOCK_COMMITMENTS.filter(c => c.renewal_date),
  recent_field_notes: MOCK_FIELD_NOTES.slice(0, 3),
  quiet_stakeholders: MOCK_STAKEHOLDERS.filter(s => s.last_contact && s.last_contact < '2026-02-01'),
  weekly_brief: 'This week: EPA brownfield grants opened (3 places eligible). City Council hearing on SE Side zoning scheduled for Thursday. Heat advisory in effect — check on field companions. Crawford CBA tensions rising after Hilco plan revision.',
};

// ── COMMUNITY STORIES ──
// The families and individuals at the heart of every place.
// These are the people field agents meet, the stories they carry into hearings,
// the names that make data human.

export const MOCK_COMMUNITY_STORIES: CommunityStory[] = [
  {
    id: 'cs-1',
    person_name: 'Maria Elena Rodriguez',
    location_detail: '106th and Burley Ave',
    place_id: 'place-1',
    story: 'Maria Elena has lived on the Southeast Side for 31 years. She raised three children in her house near 106th and Burley. Her youngest grandson, Diego, has severe asthma. On days when the shredder runs and the wind shifts east, she keeps him inside with the windows sealed. She bought an air purifier with money she saved for three months. "I shouldn\u2019t have to choose between paying the electric bill and letting my grandson breathe," she says.',
    health_impacts: ['childhood_asthma', 'headaches', 'respiratory_irritation'],
    years_in_community: 31,
    family_context: 'Grandmother raising grandson. Three adult children, two still in the neighborhood.',
    quote: 'I shouldn\u2019t have to choose between paying the electric bill and letting my grandson breathe.',
    consent_level: 'public',
    collected_by: 's-2',
    collected_at: '2026-03-28T15:00:00Z',
    tags: ['air', 'health', 'housing', 'children'],
  },
  {
    id: 'cs-2',
    person_name: 'Tomasz and Ewa Kowalski',
    location_detail: '10800 block of S. Avenue O',
    place_id: 'place-1',
    story: 'Tomasz worked at the steel mills for 22 years before they closed. He and Ewa bought their home in 1994 and have paid it off. The petroleum terminal 800 feet from their back fence now operates around the clock. The smell wakes them some nights. But they\u2019re not going anywhere. Tomasz joined SETF\u2019s air monitoring committee last year \u2014 he says his steelwork discipline helps him be precise about what he\u2019s documenting. "We built our life here," Ewa says. "This is our home. So we\u2019re going to fix it, not flee it."',
    health_impacts: ['sleep_disruption', 'nausea', 'anxiety'],
    years_in_community: 30,
    family_context: 'Retired steelworker and his wife. Two adult children who moved away.',
    quote: 'We built our life here. This is our home. So we\u2019re going to fix it, not flee it.',
    consent_level: 'institutional',
    collected_by: 's-2',
    collected_at: '2026-03-15T10:30:00Z',
    tags: ['air', 'housing', 'displacement', 'jobs', 'health'],
  },
  {
    id: 'cs-3',
    person_name: 'Destiny Okafor',
    stakeholder_id: 's-4',
    location_detail: 'Orient Heights, East Boston',
    place_id: 'place-2',
    story: 'Destiny is 19 and has lived in East Boston her entire life. She grew up directly under Logan Airport\u2019s flight path. As a child she had chronic nosebleeds and headaches that doctors attributed to ultrafine particle exposure. She testified at the Massport Community Advisory Committee at age 17 \u2014 the youngest person to ever address the body. "I learned to sleep with earplugs when I was six," she says. "That\u2019s not normal for a kid. None of this is normal."',
    health_impacts: ['chronic_nosebleeds', 'headaches', 'sleep_disruption', 'anxiety'],
    years_in_community: 19,
    family_context: 'Lives with her mother and younger brother. Father works two jobs.',
    quote: 'I learned to sleep with earplugs when I was six. That\u2019s not normal for a kid. None of this is normal.',
    consent_level: 'public',
    collected_by: 's-3',
    collected_at: '2026-03-22T19:30:00Z',
    tags: ['air', 'health', 'children', 'housing'],
  },
  {
    id: 'cs-4',
    person_name: 'The Reyes Family',
    location_detail: 'Spaulding Ave, Little Village',
    place_id: 'place-3',
    story: 'Four generations of the Reyes family have lived within a mile of the Crawford Coal Plant. Grandmother Lucia remembers when the coal dust would coat the windowsills by afternoon. Her daughter Carmen had chronic bronchitis. Her granddaughter Sofia was born premature \u2014 doctors said environmental factors were likely involved. The plant closed in 2012, and Sofia still uses an inhaler. But Sofia is also studying environmental science at UIC. "My abuela tells me stories about what the air used to look like," Sofia says. "I\u2019m going to make sure my kids only know it as history."',
    health_impacts: ['chronic_bronchitis', 'premature_birth', 'asthma', 'lead_exposure'],
    years_in_community: 68,
    family_context: 'Four-generation family. Grandmother, mother, adult daughter studying environmental science, two grandchildren.',
    quote: 'My abuela tells me stories about what the air used to look like. I\u2019m going to make sure my kids only know it as history.',
    consent_level: 'public',
    collected_by: 's-8',
    collected_at: '2026-02-14T11:00:00Z',
    tags: ['air', 'health', 'children', 'land_use', 'jobs'],
  },
  {
    id: 'cs-5',
    person_name: 'Ahmed and Fatima Hassan',
    location_detail: 'Jeffries Point, East Boston',
    place_id: 'place-2',
    story: 'Ahmed and Fatima immigrated from Somalia 8 years ago. They chose East Boston because of the Somali community and affordable rents. Their apartment has flooded three times, and their rent has doubled. But Fatima joined GreenRoots\u2019 community leadership program last spring. She now translates flood preparedness materials into Somali and helps her neighbors understand their rights as tenants. "We came here to build a life," she says. "The flooding and the noise are real. But so is the community. We\u2019re learning to protect each other."',
    health_impacts: ['mold_exposure', 'stress', 'respiratory_illness'],
    years_in_community: 8,
    family_context: 'Immigrant family. Father works at Logan Airport. Mother leads Somali tenant outreach. Three school-age children.',
    quote: 'We came here to build a life. The flooding and the noise are real. But so is the community. We\u2019re learning to protect each other.',
    consent_level: 'trusted_allies',
    collected_by: 's-3',
    collected_at: '2026-01-20T14:00:00Z',
    tags: ['housing', 'displacement', 'health', 'culture'],
  },
  {
    id: 'cs-6',
    person_name: 'Rev. Daniel Okonkwo',
    location_detail: 'St. Kevin Parish, South Deering',
    place_id: 'place-1',
    story: 'Reverend Okonkwo has served St. Kevin\u2019s for 9 years. He knows every family on the block. He\u2019s buried people who died too young, and he\u2019s baptized their grandchildren in the same week. After each funeral, the parish gathers. They cook. They tell stories. They organize. "I\u2019ve done 14 funerals this year," he says. "Eight were under 70. But I\u2019ve also seen 14 families decide that grief is not the end of the story. That\u2019s what this parish does \u2014 we turn mourning into motion."',
    health_impacts: ['cancer', 'premature_death'],
    years_in_community: 9,
    family_context: 'Parish priest serving a congregation of 400+ families.',
    quote: 'I\u2019ve seen 14 families decide that grief is not the end of the story. That\u2019s what this parish does \u2014 we turn mourning into motion.',
    consent_level: 'public',
    collected_by: 's-10',
    collected_at: '2026-03-10T09:00:00Z',
    tags: ['health', 'faith', 'air', 'land_use'],
  },
  {
    id: 'cs-7',
    person_name: 'Lupita Mendoza',
    location_detail: '26th Street corridor, Little Village',
    place_id: 'place-3',
    story: 'Lupita runs a taqueria on 26th Street. She\u2019s watched the neighborhood change for 20 years \u2014 and she\u2019s stayed through every chapter. She employs six people from the block. When the coal plant closed, her customers celebrated in her restaurant. Now logistics traffic has increased, and she\u2019s working with LVEJO to map the truck routes and propose alternatives. "This neighborhood taught me everything," she says. "My food, my business, my family \u2014 all from here. So when something threatens it, I don\u2019t leave. I organize."',
    health_impacts: ['diesel_exposure', 'noise_pollution'],
    years_in_community: 20,
    family_context: 'Small business owner. Employs 6 people from the neighborhood.',
    quote: 'This neighborhood taught me everything. My food, my business, my family \u2014 all from here. So when something threatens it, I don\u2019t leave. I organize.',
    consent_level: 'public',
    collected_by: 's-7',
    collected_at: '2026-02-28T16:00:00Z',
    tags: ['air', 'jobs', 'land_use', 'children'],
  },
];
