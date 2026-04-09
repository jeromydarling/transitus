// Transitus Brand Constants
// The Operating System for Places Under Change

export const brand = {
  appName: 'Transitus',
  fullName: 'The Operating System for Places Under Change',
  assistantName: 'NRI',
  assistantFullName: 'NRI — Narrative Relational Intelligence',
  tagline: 'Relationship memory for environmental and civic transition work.',
  positioning: 'Transitus is a stewardship platform for communities, coalitions, and the places they hold in trust.',
  domain: 'transitus.app',
} as const;

export const modules = {
  places: { label: 'Places', description: 'Living civic-land profiles for neighborhoods, corridors, watersheds, and communities under change.' },
  stakeholders: { label: 'People & Organizations', description: 'Relational graph of the people and institutions shaping a place.' },
  commitments: { label: 'Commitments', description: 'Living promises, community benefit agreements, pledges, and transition plans.' },
  fieldNotes: { label: 'Field Notes', description: 'Voice notes, field logs, photos, and community testimony with consent controls.' },
  signals: { label: 'Signals', description: 'News, permits, EPA actions, hearing notices, climate alerts, and funding opportunities.' },
  journeys: { label: 'Journeys', description: 'Narrative chapters of a place, campaign, or coalition over time.' },
  library: { label: 'Library', description: 'Frameworks, templates, case studies, glossary, and formation tracks.' },
  reports: { label: 'Reports', description: 'Place briefs, engagement logs, commitment status, board memos, and investor packets.' },
} as const;

export const tiers = {
  local: {
    name: 'Transitus Local',
    tagline: '1 place, 1 table.',
    price: '$150/mo',
    includes: [
      '1 place profile',
      'Up to 5 organizations',
      'Role-based access',
      'Field notes & voice capture',
      'Commitment tracker',
      'Signal monitoring',
      'Journey chapters',
      'Basic reports',
    ],
  },
  region: {
    name: 'Transitus Region',
    tagline: 'Several places, multi-stakeholder program.',
    price: '$500\u20131,000/mo',
    includes: [
      '3\u201310 place profiles',
      'Unlimited community participants',
      'Advanced narrative tools',
      'Portfolio-by-place view',
      'Commitment tracking across places',
      'Stronger reporting & exports',
      'Program-level analytics',
      'Priority support',
    ],
  },
  network: {
    name: 'Transitus Network',
    tagline: 'Cross-region, multi-partner coalitions.',
    price: 'Custom',
    includes: [
      '10+ place profiles',
      'Network-wide pattern analytics',
      'Cross-coalition views',
      'White-label options',
      'API integrations',
      'Dedicated onboarding',
      'Data export & compliance tools',
      'Custom support agreement',
    ],
  },
} as const;

export const archetypes = {
  ej_coalition: {
    name: 'EJ Coalition',
    tagline: 'Coordinate frontline environmental justice campaigns across communities.',
  },
  faith_investor: {
    name: 'Faith-Based Investor',
    tagline: 'Connect portfolios to real places, people, and just-transition commitments.',
  },
  community_land_trust: {
    name: 'Community Land Trust',
    tagline: 'Steward land, people, and shared memory across seasons of change.',
  },
  urban_farm_network: {
    name: 'Urban Farm Network',
    tagline: 'Grow food, resilience, and relationship memory together.',
  },
  diocesan_program: {
    name: 'Diocesan Program',
    tagline: 'Align land, investment, and parish presence with care for creation.',
  },
  municipal_resilience: {
    name: 'Municipal Resilience Office',
    tagline: 'Hold the civic memory of neighborhoods under transition.',
  },
} as const;

export const roles = {
  steward: { name: 'Steward', description: 'Oversees place and program strategy' },
  fieldCompanion: { name: 'Field Companion', description: 'Conducts site visits, captures field notes' },
  listener: { name: 'Listener', description: 'Attends hearings, meetings, community sessions' },
  convener: { name: 'Convener', description: 'Brings stakeholders to the table' },
  analyst: { name: 'Analyst', description: 'Interprets signals, data, and patterns' },
  sponsor: { name: 'Sponsor', description: 'Investor, funder, or institutional backer' },
  residentWitness: { name: 'Resident Witness', description: 'Community member with lived experience' },
} as const;

export type ArchetypeKey = keyof typeof archetypes;
export type TierKey = keyof typeof tiers;
export type ModuleKey = keyof typeof modules;
export type RoleKey = keyof typeof roles;
