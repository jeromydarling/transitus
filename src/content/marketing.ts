// Transitus marketing site copy

import { archetypes, brand } from '@/config/brand';

export const hero = {
  title: 'The operating system for places under change.',
  subtitle:
    'Relationship memory for environmental and civic transition work. A stewardship platform for communities, coalitions, and the places they hold in trust.',
  ctaPrimary: 'Start with one place',
  ctaSecondary: 'See how it works',
};

export const pillars = [
  {
    title: 'Relationship Memory',
    body: 'Every stakeholder engagement, site visit, and community meeting becomes part of a living record \u2014 so no promise is forgotten and no voice is lost.',
    icon: 'heart' as const,
  },
  {
    title: 'Place Intelligence',
    body: 'Environmental burdens, demographic context, climate risks, and community assets \u2014 layered into an atlas that makes complexity legible.',
    icon: 'map-pin' as const,
  },
  {
    title: 'Narrative Continuity',
    body: 'Scattered notes, meetings, and field observations become a coherent story of transition \u2014 so communities and institutions stop losing the thread.',
    icon: 'book-open' as const,
  },
];

export const differentiators = {
  headline: 'Not another dashboard. A living civic atlas.',
  bullets: [
    'Places, not pipelines. Every screen starts with the land and the people who live there.',
    'Commitments as living promises \u2014 not dead documents. Track who promised what, to whom, and whether it happened.',
    'Field notes that feel sacred: voice capture, geotagged testimony, consent-first community voices.',
    'Reports someone would willingly read \u2014 board-ready, grant-ready, partner-ready, and beautiful.',
  ],
};

export const philosophyPreview = {
  headline: 'Why places need memory',
  body: 'Just Transition work is full of living relationships that ordinary software flattens: communities to land, organizers to investors, workers to transition plans, and faith to action. Transitus was built around the idea that software should help teams remember people, honor places, and preserve the story of change \u2014 instead of forcing everything into pipelines and transactions.',
  cta: 'Read our philosophy',
};

export const archetypeCards = [
  { key: 'ej_coalition' as const, label: 'EJ Coalitions & Frontline Orgs' },
  { key: 'faith_investor' as const, label: 'Faith-Based & Impact Investors' },
  { key: 'community_land_trust' as const, label: 'Community Land Trusts' },
  { key: 'urban_farm_network' as const, label: 'Urban Farm Networks' },
  { key: 'diocesan_program' as const, label: 'Diocesan & Parish Programs' },
  { key: 'municipal_resilience' as const, label: 'Municipal Resilience Offices' },
];

export const footerLinks = {
  product: [
    { label: 'Features', to: '/features' },
    { label: 'Pricing', to: '/pricing' },
    { label: 'Philosophy', to: '/philosophy' },
    { label: 'Security', to: '/security' },
  ],
  company: [
    { label: 'Contact', to: '/contact' },
  ],
  legal: [
    { label: 'Terms of Service', to: '/legal/terms' },
    { label: 'Privacy Policy', to: '/legal/privacy' },
    { label: 'Data Processing', to: '/legal/data-processing' },
  ],
};
