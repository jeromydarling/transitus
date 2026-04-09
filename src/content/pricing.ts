// Transitus pricing configuration

export type PricingTier = {
  key: string;
  name: string;
  tagline: string;
  price: string;
  priceSuffix: string;
  annualNote?: string;
  includes: string[];
  highlighted?: boolean;
  cta: string;
};

export const pricingTiers: PricingTier[] = [
  {
    key: 'local',
    name: 'Transitus Local',
    tagline: 'One place. Full stewardship.',
    price: '$150',
    priceSuffix: '/mo',
    annualNote: '$1,500/yr billed annually',
    includes: [
      '1 place profile with environmental data layers',
      'Up to 5 organizations in the workspace',
      'Unlimited stakeholders and community stories',
      'Field notes with voice capture and geotagging',
      'Commitment tracker with status lifecycle',
      'Signal monitoring (EPA, permits, news)',
      'Journey chapters and narrative timeline',
      'NRI companion (AI stewardship assistant)',
      'Compass Walk weekly rhythm',
      'Basic reports and PDF export',
      'Community stories with consent management',
      'Steward\u2019s Journal for private reflection',
    ],
    cta: 'Start with one place',
  },
  {
    key: 'region',
    name: 'Transitus Region',
    tagline: 'Multiple places. Coalition power.',
    price: '$500\u20131,000',
    priceSuffix: '/mo',
    annualNote: '$6,000\u2013$12,000/yr',
    includes: [
      'Everything in Local, plus:',
      '3\u201310 place profiles with cross-place views',
      'Unlimited community participants and organizations',
      'Coalition Network for cross-org collaboration',
      'Advanced narrative and Transition Witness reports',
      'Portfolio-by-place view for institutional partners',
      'Community Benefits progress tracker',
      'Cross-place commitment and signal correlation',
      'Email integration with NRI analysis',
      'Grant and funding opportunity matching',
      'Program-level analytics and dashboards',
      'Priority support and onboarding',
    ],
    highlighted: true,
    cta: 'Talk to us about your region',
  },
  {
    key: 'network',
    name: 'Transitus Network',
    tagline: 'National coalitions. Shared intelligence.',
    price: 'Custom',
    priceSuffix: '',
    includes: [
      'Everything in Region, plus:',
      '10+ place profiles across geographies',
      'Network-wide pattern analytics',
      'Cross-coalition shared dashboards',
      'Stakeholder relationship graph visualization',
      'Full EPA/NOAA/Census API integrations',
      'White-label and custom branding',
      'Dedicated onboarding, training, and account manager',
      'Data export, compliance tools, and audit trail',
      'NRI knowledge base customization',
      'Custom n8n automation workflows',
      'SLA and custom support agreement',
    ],
    cta: 'Contact us',
  },
];

export const pricingFAQ = [
  {
    question: 'What counts as a "place"?',
    answer: 'A place is any geographic area your team is tracking: a neighborhood, industrial corridor, watershed, parish territory, utility service area, city initiative, or tribal area. You define the boundaries.',
  },
  {
    question: 'Can community partners use Transitus for free?',
    answer: 'Yes. When an institutional payer (diocese, foundation, investor) funds a Region or Network workspace, Local workspaces for EJ and community partners can be included at no additional cost.',
  },
  {
    question: 'Is there a pilot or charter program?',
    answer: 'Yes. Our charter cohort (first 10 places) receives 50% off for 2\u20133 years in exchange for deep co-design, case studies, and permission to publish anonymized stories of transition.',
  },
  {
    question: 'How is Transitus different from a CRM or GIS tool?',
    answer: 'CRMs flatten relationships into records. GIS tools show maps without memory. Transitus joins relationship memory, place intelligence, and narrative continuity into a single platform \u2014 so communities and institutions stop losing the thread.',
  },
  {
    question: 'What does NRI do?',
    answer: 'NRI (Narrative Relational Intelligence) is your AI stewardship companion. It helps you understand what\u2019s shifting in your places, check on commitments, prepare for hearings, and draft reports \u2014 all grounded in your data and community stories. NRI never decides; it suggests.',
  },
];
