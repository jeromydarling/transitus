/**
 * Competitor Comparisons — Content for /compare/:slug SEO landing pages.
 *
 * WHAT: Structured content for Transitus vs specific competitor comparison pages.
 * WHERE: Powers CompareCompetitorPage at /compare/:slug.
 * WHY: SEO authority through competitor-specific comparison content with calm, non-attacking tone.
 */

export interface CompetitorSection {
  heading: string;
  body?: string;
  bullets?: string[];
  /** Two-column layout: left = competitor, right = Transitus */
  columns?: { competitor: string[]; cros: string[] };
  closingLine?: string;
}

export interface CompetitorComparison {
  slug: string;
  seoTitle: string;
  metaDescription: string;
  keywords: string[];
  heroHeadline: string;
  heroSubheadline: string[];
  heroCta: string;
  sections: CompetitorSection[];
  finalCta: {
    lines: string[];
    buttonLabel: string;
    buttonTo: string;
  };
  /** Optional "works with" list for the mission-layer page */
  worksWith?: string[];
}

export const competitorComparisons: CompetitorComparison[] = [
  // ─── PAGE 1: Transitus vs Bloomerang ───
  {
    slug: 'cros-vs-bloomerang',
    seoTitle: 'Transitus vs Bloomerang: Donor CRM or Relationship Operating System?',
    metaDescription:
      'Comparing Transitus™ and Bloomerang? Discover whether your nonprofit needs donor infrastructure or a relational operating system built for community work.',
    keywords: [
      'Transitus vs Bloomerang',
      'Bloomerang alternative',
      'nonprofit CRM comparison',
      'donor CRM vs relationship OS',
      'Bloomerang competitor',
    ],
    heroHeadline: 'Donor CRM or Relationship Operating System?',
    heroSubheadline: [
      'Bloomerang optimizes fundraising.',
      'Transitus™ preserves relational continuity.',
    ],
    heroCta: 'See Which Fits Your Mission →',
    sections: [
      {
        heading: 'What Bloomerang Was Built For',
        body: 'Bloomerang is a donor-focused CRM built to improve retention and fundraising performance. It excels at:',
        bullets: [
          'Gift tracking',
          'Recurring donations',
          'Pledge management',
          'Tax receipting',
          'Campaign segmentation',
          'Lapsed donor detection',
          'Revenue reporting dashboards',
        ],
        closingLine:
          'If your organization\'s operational center is donor revenue, Bloomerang is purpose-built for that.',
      },
      {
        heading: 'What Transitus™ Was Built For',
        body: 'Transitus™ is a The Operating System for Places Under Change built for organizations whose work is relational before it is transactional. It centers:',
        bullets: [
          'Journey Chapters',
          'Reflections',
          'Visit logs (mobile-first)',
          'Volunteer management',
          'Community awareness',
          'Narrative reporting',
          'NRI™ (Narrative Relational Intelligence)',
        ],
        closingLine:
          'If your work depends on presence, accompaniment, and continuity of care, Transitus was designed for that reality.',
      },
      {
        heading: 'Architectural Difference',
        columns: {
          competitor: ['Donor records', 'Giving history', 'Campaign performance'],
          cros: ['People', 'Partners', 'Journey Chapters', 'Reflections', 'Community signals'],
        },
        closingLine: 'One measures transactions. The other preserves relationship memory.',
      },
      {
        heading: 'Where Bloomerang Clearly Wins',
        body: 'Choose Bloomerang if:',
        bullets: [
          'Fundraising drives your operations',
          'You need built-in donation forms and tax receipts',
          'Your development team works desk-based',
          'Revenue dashboards are central to leadership conversations',
        ],
      },
      {
        heading: 'Where Transitus Clearly Wins',
        body: 'Choose Transitus if:',
        bullets: [
          'You accompany people long-term',
          'Staff turnover erodes context',
          'Field visits matter',
          'Volunteers are mission partners',
          'You need narrative board reporting',
          'Your mission is presence, not pipeline',
        ],
      },
      {
        heading: 'Can You Use Both?',
        body: 'Yes. Many organizations use Bloomerang for fundraising infrastructure and Transitus for relational memory and field work.',
        closingLine: 'Transitus Bridge™ allows layering or gradual migration.',
      },
    ],
    finalCta: {
      lines: ['Your donors deserve infrastructure.', 'Your people deserve memory.'],
      buttonLabel: 'Schedule a 20-Minute Architecture Call →',
      buttonTo: '/contact',
    },
  },

  // ─── PAGE 2: Transitus vs Salesforce ───
  {
    slug: 'cros-vs-salesforce',
    seoTitle: 'Transitus vs Salesforce Nonprofit Cloud: Enterprise CRM or Relational OS?',
    metaDescription:
      'Comparing Transitus™ and Salesforce Nonprofit Cloud? See whether your nonprofit needs enterprise fundraising infrastructure or a relational operating system.',
    keywords: [
      'Transitus vs Salesforce',
      'Salesforce Nonprofit alternative',
      'Salesforce nonprofit CRM comparison',
      'relational OS vs enterprise CRM',
    ],
    heroHeadline: 'Enterprise Power Isn\'t the Same as Relational Clarity.',
    heroSubheadline: ['Salesforce manages scale.', 'Transitus™ protects presence.'],
    heroCta: 'See the Difference →',
    sections: [
      {
        heading: 'What Salesforce Was Built For',
        body: 'Salesforce began as enterprise sales software. Salesforce Nonprofit Cloud adapts that enterprise engine for:',
        bullets: [
          'Major gift portfolios',
          'Complex campaign tracking',
          'Advanced segmentation',
          'Multi-department reporting',
          'Marketing automation',
          'Deep integrations',
        ],
        closingLine:
          'It is extraordinarily powerful — and extraordinarily configurable. This often requires CRM administrators, consultants, custom object configuration, and ongoing maintenance. For large-scale fundraising organizations, this investment makes sense.',
      },
      {
        heading: 'What Transitus Was Built For',
        body: 'Transitus was built from lived ministry and field work outward. It assumes relationships are longitudinal, context matters, volunteers are central, staff turnover is real, and story must be preserved. It centers:',
        bullets: [
          'Journey Chapters',
          'Reflections',
          'Visit logs',
          'Volunteer roles',
          'Community signals',
          'Narrative intelligence',
        ],
        closingLine: 'No configuration cycles required.',
      },
      {
        heading: 'Architecture',
        columns: {
          competitor: ['Accounts', 'Opportunities', 'Campaigns', 'Custom Objects'],
          cros: ['People', 'Partners', 'Journey Chapters', 'Presence', 'Community Awareness'],
        },
        closingLine: 'Salesforce is enterprise infrastructure. Transitus is relational infrastructure.',
      },
      {
        heading: 'Where Salesforce Wins',
        body: 'Choose Salesforce if:',
        bullets: [
          'You manage large fundraising portfolios',
          'You need complex reporting layers',
          'You budget for consultants',
          'You have a CRM admin',
        ],
      },
      {
        heading: 'Where Transitus Wins',
        body: 'Choose Transitus if:',
        bullets: [
          'Your mission is relational before transactional',
          'Field workers resist enterprise interfaces',
          'You need rapid adoption',
          'Narrative matters more than dashboards',
        ],
      },
      {
        heading: 'Layer or Replace?',
        body: 'Transitus can replace Salesforce in relational-first organizations, layer above Salesforce for field teams, or bridge during migration.',
        closingLine: 'Transitus Bridge™ supports two-way sync and transition.',
      },
    ],
    finalCta: {
      lines: [
        'If revenue leakage is your risk, Salesforce protects you.',
        'If relational drift is your risk, Transitus protects you.',
      ],
      buttonLabel: 'Book an Architecture Walkthrough →',
      buttonTo: '/contact',
    },
  },

  // ─── PAGE 3: Transitus vs HubSpot ───
  {
    slug: 'cros-vs-hubspot',
    seoTitle: 'Transitus vs HubSpot for Nonprofits: Marketing CRM or Relational OS?',
    metaDescription:
      'Comparing Transitus™ and HubSpot? Discover whether your nonprofit needs marketing automation or a relational operating system built for mission work.',
    keywords: [
      'Transitus vs HubSpot',
      'HubSpot nonprofit alternative',
      'marketing CRM vs relationship OS',
      'HubSpot competitor nonprofit',
    ],
    heroHeadline: 'Marketing Automation Isn\'t Relationship Memory.',
    heroSubheadline: ['HubSpot accelerates campaigns.', 'Transitus™ sustains community.'],
    heroCta: 'Compare the Approaches →',
    sections: [
      {
        heading: 'What HubSpot Was Built For',
        body: 'HubSpot began as marketing automation software. It excels at:',
        bullets: [
          'Email campaigns',
          'Lead scoring',
          'Marketing funnels',
          'Website forms',
          'Content analytics',
          'Sales pipeline management',
        ],
        closingLine: 'HubSpot optimizes growth.',
      },
      {
        heading: 'What Transitus Was Built For',
        body: 'Transitus optimizes continuity. It centers:',
        bullets: [
          'Reflections',
          'Journey Chapters',
          'Volunteer engagement',
          'Visit logs',
          'Community intelligence',
          'Narrative reporting',
        ],
        closingLine: 'HubSpot asks: How do we convert? Transitus asks: How do we accompany?',
      },
      {
        heading: 'Where HubSpot Wins',
        body: 'Choose HubSpot if:',
        bullets: [
          'You run heavy digital campaigns',
          'You depend on inbound marketing',
          'Growth funnels drive strategy',
          'Marketing automation is core',
        ],
      },
      {
        heading: 'Where Transitus Wins',
        body: 'Choose Transitus if:',
        bullets: [
          'Your mission happens offline',
          'Field work drives impact',
          'You measure success in presence',
          'You need human continuity over time',
        ],
      },
      {
        heading: 'Using Both',
        body: 'Many organizations use HubSpot for marketing and Transitus for field and relational memory.',
        closingLine: 'Transitus Bridge™ enables integration.',
      },
    ],
    finalCta: {
      lines: ['Growth matters.', 'So does memory.'],
      buttonLabel: 'See How Transitus Layers →',
      buttonTo: '/contact',
    },
  },

  // ─── PAGE 4: Mission Layer ───
  {
    slug: 'cros-mission-layer-crm',
    seoTitle: 'The Relational Layer Above Your Nonprofit CRM | Transitus™',
    metaDescription:
      'Already using Salesforce, Bloomerang, HubSpot, or Planning Center? Add Transitus™ as your relational and narrative intelligence layer.',
    keywords: [
      'CRM relational layer',
      'nonprofit CRM add-on',
      'relational intelligence layer',
      'Transitus mission layer',
      'CRM narrative layer',
    ],
    heroHeadline: 'Your CRM Tracks Donations.\nWho Tracks the Story?',
    heroSubheadline: ['Transitus™ is the relational intelligence layer above your existing CRM.'],
    heroCta: 'See What Transitus Adds →',
    worksWith: [
      'Salesforce',
      'Bloomerang',
      'HubSpot',
      'Planning Center',
      'Dynamics',
      'Blackbaud',
      'Monday',
    ],
    sections: [
      {
        heading: 'The Hidden Gap',
        body: 'Traditional CRMs track gifts, campaigns, segments, and reports. They do not protect:',
        bullets: [
          'Relationship continuity',
          'Field context',
          'Volunteer memory',
          'Community awareness',
        ],
      },
      {
        heading: 'What Transitus Adds',
        body: 'Transitus adds the relational layer your CRM was never designed to hold:',
        bullets: [
          'Journey Chapters',
          'Reflections',
          'Visit logging',
          'Volunteer system',
          'Narrative reporting',
          'Drift detection (NRI™)',
          'Community signals (Signum™)',
        ],
      },
      {
        heading: 'When to Layer',
        body: 'Layer Transitus if:',
        bullets: [
          'Your donor CRM is stable',
          'Your field team lacks memory tools',
          'You don\'t want rip-and-replace',
        ],
      },
      {
        heading: 'When to Consolidate',
        body: 'Consolidate into Transitus if:',
        bullets: [
          'Fundraising is light',
          'You want simpler architecture',
          'Relationship continuity is primary',
        ],
      },
    ],
    finalCta: {
      lines: ['Add the relational layer your CRM was never designed to hold.'],
      buttonLabel: 'Book a Mission Architecture Call →',
      buttonTo: '/contact',
    },
  },
];
