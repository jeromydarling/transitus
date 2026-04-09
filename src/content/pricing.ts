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
    tagline: '1 place, 1 table.',
    price: '$150',
    priceSuffix: '/mo',
    annualNote: '$1,500/yr billed annually',
    includes: [
      '1 place profile with full map layers',
      'Up to 5 organizations in the workspace',
      'Role-based access for all team members',
      'Field notes with voice capture',
      'Commitment tracker',
      'Signal monitoring for your place',
      'Journey chapters',
      'Basic reports and exports',
    ],
    cta: 'Start with one place',
  },
  {
    key: 'region',
    name: 'Transitus Region',
    tagline: 'Several places, multi-stakeholder program.',
    price: '$500\u20131,000',
    priceSuffix: '/mo',
    annualNote: '$6,000\u2013$12,000/yr',
    includes: [
      '3\u201310 place profiles',
      'Unlimited community participants',
      'Advanced narrative and reporting tools',
      'Portfolio-by-place view for institutions',
      'Cross-place commitment tracking',
      'Program-level analytics',
      'Stronger export and compliance tools',
      'Priority support',
    ],
    highlighted: true,
    cta: 'Talk to us about your region',
  },
  {
    key: 'network',
    name: 'Transitus Network',
    tagline: 'Cross-region, multi-partner coalitions.',
    price: 'Custom',
    priceSuffix: '',
    includes: [
      '10+ place profiles',
      'Network-wide pattern analytics',
      'Cross-coalition views and shared dashboards',
      'White-label and branding options',
      'Full API integrations',
      'Dedicated onboarding and training',
      'Data export and compliance tools',
      'Custom support agreement',
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
];
