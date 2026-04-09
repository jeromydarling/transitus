// Transitus feature content — 8 core modules

export type FeatureModule = {
  key: string;
  label: string;
  headline: string;
  description: string;
  details: string[];
  dataNote?: string;
};

export const featureModules: FeatureModule[] = [
  {
    key: 'places',
    label: 'Places',
    headline: 'The heart of the app: living civic-land profiles.',
    description: 'Each Place page represents a neighborhood, corridor, watershed, parish territory, or community under change \u2014 rendered as a living atlas spread, not a database record.',
    details: [
      'Place overview: geography, communities, key institutions, land use, current transition issues.',
      'Map layers: environmental burdens, demographic vulnerability, climate risk, critical infrastructure, and community assets.',
      'Place memory: what has happened here, who has shown up, what has been promised, what people are worried about.',
      'Active work: hearings, campaigns, funding asks, engagement rounds, project milestones.',
    ],
    dataNote: 'Powered by EPA EJScreen, ECHO, NOAA, Census/ACS, USGS National Map, and local GIS data.',
  },
  {
    key: 'stakeholders',
    label: 'People & Organizations',
    headline: 'A relational graph, not a contact list.',
    description: 'Every person and institution shaping a place \u2014 tracked not as rows in a database, but as participants in a shared story of change.',
    details: [
      'People: organizers, residents, faith leaders, utility contacts, fund managers, union reps, agency staff, local electeds.',
      'Organizations: churches, EJ groups, neighborhood associations, developers, utilities, labor groups, foundations.',
      'Relationship threads: who knows whom, who trusts whom, where there is tension or drift.',
      'Role system: steward, field companion, listener, convener, analyst, sponsor, resident witness.',
    ],
  },
  {
    key: 'commitments',
    label: 'Commitments',
    headline: 'Living promises, not dead documents.',
    description: 'Just Transition work constantly produces promises: community benefits, cleanup timelines, wage standards, consultation pledges. Transitus treats these as living moral and civic objects.',
    details: [
      'Who made it, to whom, in what context, with what evidence.',
      'Types: public pledge, legal agreement, CBA, shareholder engagement ask, grant condition.',
      'Status lifecycle: proposed, acknowledged, accepted, in motion, delayed, breached, repaired, completed.',
      'Community interpretation: what affected stakeholders think this commitment means.',
      'Renewal rhythm: dates to revisit, reassess, escalate, or publicly report.',
    ],
  },
  {
    key: 'fieldNotes',
    label: 'Field Notes',
    headline: 'Sacred, frictionless field capture.',
    description: 'Most Just Transition work still lives in notebooks, text chains, and meeting debriefs that never become shared institutional memory. Field Notes changes that.',
    details: [
      'Voice note capture with transcription.',
      'Quick field log: what I saw, who I spoke with, what changed, what needs follow-up.',
      'Photo and document attachment with geotagging.',
      'Community testimony entries with consent controls.',
      'Structured tags: air, water, labor, health, housing, energy, food, land use, permitting.',
    ],
  },
  {
    key: 'signals',
    label: 'Signals',
    headline: 'Know what\u2019s shifting without drowning in alerts.',
    description: 'Signals monitors the civic, environmental, and regulatory landscape around your places \u2014 and surfaces what matters with editorial calm instead of an alert storm.',
    details: [
      'News and public notices relevant to a place.',
      'Permit filings and utility commission dockets.',
      'EPA / state enforcement actions.',
      'Public hearing notices and climate hazard alerts.',
      'Philanthropic opportunities and federal funding notices.',
      'Community-collected signals from your own team.',
    ],
    dataNote: 'Aggregated from RSS/news, EPA APIs, NOAA, Grants.gov, and community input.',
  },
  {
    key: 'journeys',
    label: 'Journeys',
    headline: 'The living story of a place over time.',
    description: 'A Journey is the narrative arc of a place, campaign, initiative, or conflict \u2014 told in chapters that preserve what happened, why it mattered, and what remains unfinished.',
    details: [
      'Chapter types: recognition, listening, coalition-building, negotiation, transition, repair, stewardship.',
      'Notes, commitments, stakeholders, signals, and reports linked together.',
      'Tensions and open questions preserved alongside progress.',
      '"What changed?" summaries generated monthly or quarterly.',
    ],
  },
  {
    key: 'library',
    label: 'Library',
    headline: 'From confusion to grounded action.',
    description: 'Half resource center, half formation center. The place where practitioners move from uncertainty to clarity \u2014 with frameworks, templates, and real case studies.',
    details: [
      'Frameworks: Just Transition, environmental justice, stakeholder engagement, community benefits, fiduciary stewardship.',
      'Templates: listening session guides, investor questions, commitment language, board memos, covenant drafts.',
      'Case studies: places that navigated transitions well or poorly.',
      'Formation tracks: beginner, organizer, investor, faith-rooted leader, coalition convener.',
    ],
  },
  {
    key: 'reports',
    label: 'Reports',
    headline: 'Board-ready, grant-ready, partner-ready, and beautiful.',
    description: 'Faith-based institutions, foundations, and coalitions all need reports \u2014 and they currently rebuild them manually from scattered notes and public data. Transitus turns daily work into polished output.',
    details: [
      'Place brief and environmental justice snapshot.',
      'Stakeholder engagement log and commitment status report.',
      'Quarter-in-review narrative and community listening summary.',
      'Board memo and investor engagement packet.',
      'Public-facing story with redaction controls.',
    ],
  },
];

export const manifestoSection = {
  title: 'Place. Relationship. Story.',
  intro: 'Most software for civic and environmental work starts with data.\n\nTransitus starts with the places and people that data is supposed to serve.',
  summary:
    'Places hold the memory.\nRelationships carry the work.\nStories make the change legible.',
  columns: [
    {
      label: 'PLACE',
      name: 'Place Intelligence',
      body: 'See a community as it truly is: land, burdens, assets, history, and the people who call it home.',
      to: '/features',
    },
    {
      label: 'RELATIONSHIP',
      name: 'Stakeholder Memory',
      body: 'Hold relationships at the center. A system built around presence, trust, and shared accountability.',
      to: '/features',
    },
    {
      label: 'STORY',
      name: 'Narrative Continuity',
      body: 'Turn scattered meetings, field notes, and signals into a coherent story of transition that outlasts any single leader.',
      to: '/features',
    },
  ],
};
