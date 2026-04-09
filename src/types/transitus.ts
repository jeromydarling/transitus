/**
 * Transitus Domain Types
 *
 * Complete type system for the Transitus app, designed for Lovable/Supabase handoff.
 * Every type maps to a future database table or view.
 */

// ── Roles ──

export type TransitusRole =
  | 'steward'
  | 'field_companion'
  | 'listener'
  | 'convener'
  | 'analyst'
  | 'sponsor'
  | 'resident_witness';

export const ROLE_LABELS: Record<TransitusRole, string> = {
  steward: 'Steward',
  field_companion: 'Field Companion',
  listener: 'Listener',
  convener: 'Convener',
  analyst: 'Analyst',
  sponsor: 'Sponsor',
  resident_witness: 'Resident Witness',
};

// ── Places ──

export interface Place {
  id: string;
  name: string;
  description: string;
  place_type: PlaceType;
  geography: string; // e.g. "Chicago, IL" or "Suffolk County, MA"
  lat: number;
  lng: number;
  communities: string[];
  key_institutions: string[];
  land_use: string[];
  transition_issues: string[];
  population_estimate?: number;
  environmental_burdens: EnvironmentalBurden[];
  active_work: ActiveWork[];
  created_at: string;
  updated_at: string;
}

export type PlaceType =
  | 'neighborhood'
  | 'corridor'
  | 'watershed'
  | 'parish_territory'
  | 'utility_service_area'
  | 'port_zone'
  | 'plant_footprint'
  | 'city_initiative'
  | 'tribal_area'
  | 'custom_region';

export interface EnvironmentalBurden {
  category: 'air' | 'water' | 'land' | 'health' | 'climate' | 'infrastructure';
  name: string;
  severity: 'low' | 'moderate' | 'high' | 'critical';
  description: string;
  source?: string;
}

export interface ActiveWork {
  id: string;
  title: string;
  type: 'hearing' | 'campaign' | 'funding_ask' | 'engagement_round' | 'project_milestone' | 'coalition_meeting';
  date?: string;
  status: 'upcoming' | 'in_progress' | 'completed';
}

// ── People & Organizations ──

export interface Stakeholder {
  id: string;
  name: string;
  role: TransitusRole;
  email?: string;
  phone?: string;
  organization_id?: string;
  title?: string;
  bio?: string;
  place_ids: string[];
  tags: string[];
  last_contact?: string;
  trust_level?: 'new' | 'building' | 'established' | 'deep';
  created_at: string;
}

export interface Organization {
  id: string;
  name: string;
  org_type: OrgType;
  description: string;
  website?: string;
  place_ids: string[];
  stakeholder_ids: string[];
  tags: string[];
  created_at: string;
}

export type OrgType =
  | 'ej_group'
  | 'church'
  | 'neighborhood_association'
  | 'developer'
  | 'utility'
  | 'labor_group'
  | 'health_system'
  | 'diocese'
  | 'foundation'
  | 'government_agency'
  | 'ngo'
  | 'community_land_trust'
  | 'cooperative'
  | 'school'
  | 'other';

export interface RelationshipThread {
  id: string;
  from_stakeholder_id: string;
  to_stakeholder_id: string;
  relationship_type: 'knows' | 'trusts' | 'introduced' | 'tension' | 'ally' | 'collaborator';
  note?: string;
  created_at: string;
}

// ── Commitments ──

export interface Commitment {
  id: string;
  title: string;
  description: string;
  commitment_type: CommitmentType;
  status: CommitmentStatus;
  made_by_org_id?: string;
  made_by_stakeholder_id?: string;
  made_to_place_id?: string;
  made_to_org_id?: string;
  context: string;
  community_interpretation?: string;
  evidence: EvidenceItem[];
  renewal_date?: string;
  place_ids: string[];
  created_at: string;
  updated_at: string;
}

export type CommitmentType =
  | 'public_pledge'
  | 'legal_agreement'
  | 'cba'
  | 'shareholder_engagement'
  | 'diocesan_policy'
  | 'utility_promise'
  | 'grant_condition'
  | 'informal_promise';

export type CommitmentStatus =
  | 'proposed'
  | 'acknowledged'
  | 'accepted'
  | 'in_motion'
  | 'delayed'
  | 'breached'
  | 'repaired'
  | 'completed';

export const COMMITMENT_STATUS_LABELS: Record<CommitmentStatus, string> = {
  proposed: 'Proposed',
  acknowledged: 'Acknowledged',
  accepted: 'Accepted',
  in_motion: 'In Motion',
  delayed: 'Delayed',
  breached: 'Breached',
  repaired: 'Repaired',
  completed: 'Completed',
};

export interface EvidenceItem {
  id: string;
  type: 'meeting_note' | 'document' | 'voice_note' | 'press' | 'board_minutes' | 'photo';
  title: string;
  date: string;
  url?: string;
}

// ── Field Notes ──

export interface FieldNote {
  id: string;
  author_id: string;
  place_id: string;
  note_type: FieldNoteType;
  content: string;
  what_i_saw?: string;
  who_i_spoke_with?: string;
  what_changed?: string;
  follow_up?: string;
  tags: FieldNoteTag[];
  is_testimony: boolean;
  consent_level?: 'local_only' | 'trusted_allies' | 'institutional' | 'public';
  photos?: string[];
  voice_note_url?: string;
  lat?: number;
  lng?: number;
  created_at: string;
}

export type FieldNoteType =
  | 'site_visit'
  | 'listening_session'
  | 'community_meeting'
  | 'prayer_vigil'
  | 'utility_meeting'
  | 'household_interview'
  | 'corridor_observation'
  | 'quick_note';

export type FieldNoteTag =
  | 'air' | 'water' | 'labor' | 'health' | 'housing'
  | 'energy' | 'food' | 'land_use' | 'permitting' | 'safety'
  | 'faith' | 'culture' | 'displacement' | 'jobs';

export const FIELD_NOTE_TAG_LABELS: Record<FieldNoteTag, string> = {
  air: 'Air Quality', water: 'Water', labor: 'Labor', health: 'Health',
  housing: 'Housing', energy: 'Energy', food: 'Food', land_use: 'Land Use',
  permitting: 'Permitting', safety: 'Public Safety', faith: 'Faith',
  culture: 'Culture', displacement: 'Displacement', jobs: 'Jobs',
};

// ── Signals ──

export interface Signal {
  id: string;
  title: string;
  summary: string;
  source: SignalSource;
  category: SignalCategory;
  place_ids: string[];
  url?: string;
  published_at: string;
  severity?: 'informational' | 'notable' | 'urgent';
  is_read: boolean;
  created_at: string;
}

export type SignalSource =
  | 'news'
  | 'epa'
  | 'state_agency'
  | 'utility_commission'
  | 'public_hearing'
  | 'grants_gov'
  | 'noaa'
  | 'community'
  | 'legislation'
  | 'ngo_update';

export type SignalCategory =
  | 'permit_filing'
  | 'enforcement_action'
  | 'hearing_notice'
  | 'climate_alert'
  | 'funding_opportunity'
  | 'policy_change'
  | 'community_report'
  | 'job_announcement'
  | 'project_update';

export const SIGNAL_SOURCE_LABELS: Record<SignalSource, string> = {
  news: 'News', epa: 'EPA', state_agency: 'State Agency',
  utility_commission: 'Utility Commission', public_hearing: 'Public Hearing',
  grants_gov: 'Grants.gov', noaa: 'NOAA', community: 'Community',
  legislation: 'Legislation', ngo_update: 'NGO Update',
};

// ── Journeys ──

export interface Journey {
  id: string;
  title: string;
  journey_type: JourneyType;
  place_id: string;
  description: string;
  chapters: JourneyChapter[];
  stakeholder_ids: string[];
  commitment_ids: string[];
  tensions: string[];
  open_questions: string[];
  started_at: string;
  updated_at: string;
}

export type JourneyType =
  | 'plant_closure'
  | 'utility_decarbonization'
  | 'brownfield_redevelopment'
  | 'parish_land_discernment'
  | 'community_solar'
  | 'neighborhood_resilience'
  | 'logistics_corridor'
  | 'investment_engagement'
  | 'food_sovereignty'
  | 'housing_transition';

export interface JourneyChapter {
  id: string;
  title: string;
  chapter_type: ChapterType;
  narrative: string;
  date_range: string;
  linked_note_ids: string[];
  linked_commitment_ids: string[];
  linked_signal_ids: string[];
  what_changed?: string;
}

export type ChapterType =
  | 'recognition'
  | 'listening'
  | 'coalition_building'
  | 'negotiation'
  | 'transition'
  | 'repair'
  | 'stewardship';

export const CHAPTER_TYPE_LABELS: Record<ChapterType, string> = {
  recognition: 'Recognition',
  listening: 'Listening',
  coalition_building: 'Coalition Building',
  negotiation: 'Negotiation',
  transition: 'Transition',
  repair: 'Repair',
  stewardship: 'Stewardship',
};

// ── Library ──

export interface LibraryItem {
  id: string;
  title: string;
  category: LibraryCategory;
  item_type: 'framework' | 'template' | 'case_study' | 'glossary_entry' | 'playbook' | 'reading';
  description: string;
  content: string;
  tags: string[];
  formation_track?: FormationTrack;
  created_at: string;
}

export type LibraryCategory =
  | 'just_transition'
  | 'environmental_justice'
  | 'stakeholder_engagement'
  | 'community_benefits'
  | 'labor_standards'
  | 'fiduciary_stewardship'
  | 'faith_rooted';

export type FormationTrack =
  | 'beginner'
  | 'organizer'
  | 'investor'
  | 'faith_rooted_leader'
  | 'coalition_convener';

// ── Reports ──

export interface Report {
  id: string;
  title: string;
  report_type: ReportType;
  place_id?: string;
  generated_at: string;
  content_summary: string;
  sections: ReportSection[];
}

export type ReportType =
  | 'place_brief'
  | 'stakeholder_engagement_log'
  | 'commitment_status'
  | 'quarter_in_review'
  | 'community_listening_summary'
  | 'transition_readiness'
  | 'ej_snapshot'
  | 'board_memo'
  | 'investor_packet'
  | 'public_story';

export interface ReportSection {
  title: string;
  content: string;
  type: 'narrative' | 'data' | 'testimony' | 'map' | 'timeline' | 'commitments';
}

// ── Dashboard ──

export interface DashboardData {
  places_count: number;
  active_commitments: number;
  recent_signals: Signal[];
  upcoming_renewals: Commitment[];
  recent_field_notes: FieldNote[];
  quiet_stakeholders: Stakeholder[];
  weekly_brief: string;
}
