/**
 * legalPages — Content registry for Transitus™ legal foundation pages.
 *
 * WHAT: Structured, human-centered legal content for Terms, Privacy, DPA, AUP, and AI Transparency.
 * WHERE: Rendered by LegalPageLayout on /legal/* routes.
 * WHY: Legal pages should feel like a field guide, not a corporate wall.
 */

export interface LegalSection {
  id: string;
  title: string;
  body: string;
}

export interface LegalPageContent {
  title: string;
  route: string;
  lastUpdated: string;
  intro: string;
  sections: LegalSection[];
}

export const TERMS_CONTENT: LegalPageContent = {
  title: 'Terms of Use',
  route: '/legal/terms',
  lastUpdated: '2026-04-09',
  intro: 'Transitus exists to help communities track environmental justice, steward transitions, and preserve the stories of the people most affected by pollution and change. These terms explain how we work together.',
  sections: [
    { id: 'using-cros', title: 'Using Transitus', body: 'Transitus\u2122 is a stewardship platform for communities, coalitions, and the places they hold in trust. By creating an account, you agree to use it in service of environmental justice, community resilience, and just transition work \u2014 with care, honesty, and respect for the people whose stories pass through it.' },
    { id: 'your-data', title: 'Your Data Belongs To You', body: 'All data you enter into Transitus \u2014 field notes, stakeholder records, community stories, commitments, journey chapters, reflections \u2014 belongs to your organization. We are custodians, not owners. You may export your data at any time. If you leave Transitus, your data leaves with you.' },
    { id: 'accounts', title: 'Accounts & Roles', body: 'Each organization receives its own isolated workspace. User roles \u2014 Steward, Companion, Observer \u2014 determine what each person can see and do. Stewards have full access. Companions can create and view most data. Observers have read-only access. Role assignments are managed by your organization\u2019s administrators, not by Transitus.' },
    { id: 'environmental-data', title: 'Environmental Data & Place Intelligence', body: 'Transitus integrates publicly available environmental data from EPA EJScreen, EPA ECHO, NOAA, U.S. Census Bureau, USGS, NASA, and other government sources to provide place-based intelligence. This data is public and freely available; Transitus adds value by organizing it alongside your community\u2019s field work, stakeholder relationships, and commitment tracking. We do not create or sell derived environmental datasets.' },
    { id: 'community-stories', title: 'Community Stories & Testimony', body: 'When field agents collect stories from community members, Transitus enforces consent levels that you assign: Local Only (your organization only), Trusted Allies (shared with designated partners), Institutional (board and funder level), or Public (for published reports). These consent settings are enforced at the system level. Stories marked as testimony receive heightened protection and are never included in automated summaries without human review. Community members may request that their story be removed at any time.' },
    { id: 'field-notes', title: 'Field Notes & Location Data', body: 'Field notes may include geotagged observations. Location data is encrypted and visible only to team members with appropriate role access. Location data is never used for tracking, surveillance, or profiling. You may strip geolocation from any data export.' },
    { id: 'commitments', title: 'Commitments & Community Benefit Agreements', body: 'Transitus tracks commitments made by and to your organization, including public pledges, legal agreements, and community benefit agreements (CBAs). Each commitment includes a \u201ccommunity interpretation\u201d field capturing what affected stakeholders believe was promised. This institutional memory persists across leadership changes and serves accountability, not leverage.' },
    { id: 'communications', title: 'Communications & Email Intake', body: 'If you connect email, Transitus processes sent messages to surface stakeholder mentions, emerging commitments, and follow-up actions. Email content is never shared across organizations. Processing is opt-in, and you can disconnect at any time. Every suggestion requires your approval before entering your data.' },
    { id: 'ai', title: 'AI Assistance \u2014 NRI', body: 'Transitus uses NRI (Narrative Relational Intelligence) to help you understand what\u2019s shifting in your places, check on commitments, prepare for hearings, and draft reports. NRI never makes decisions for your organization. It suggests; humans decide. NRI respects community consent levels and never processes testimony without human review. See our AI Transparency page for full details.' },
    { id: 'availability', title: 'Availability', body: 'We work to keep Transitus available and reliable. Scheduled maintenance will be communicated in advance. We do not guarantee 100% uptime, but we commit to transparency about any disruptions.' },
    { id: 'respectful-use', title: 'Respectful Use', body: 'Transitus is built for organizations that serve communities under environmental and economic pressure. We ask that you use it with the same care you bring to your mission. Using Transitus to extract community stories without consent, manufacture compliance theater around CBAs, surveil individuals, or harm vulnerable communities will result in account termination.' },
    { id: 'ending', title: 'Ending Service', body: 'Either party may end the relationship at any time. Upon termination, your data will be available for export for 90 days. After that period, it will be permanently deleted from our systems.' },
    { id: 'changes', title: 'Changes', body: 'We may update these terms as Transitus evolves. Material changes will be communicated via email to account administrators at least 30 days before taking effect.' },
    { id: 'contact', title: 'Contact', body: 'Questions about these terms? Reach us at legal@transitus.app. We respond to every inquiry with the same care we put into building the platform.' },
  ],
};

export const PRIVACY_CONTENT: LegalPageContent = {
  title: 'Privacy Policy',
  route: '/legal/privacy',
  lastUpdated: '2026-04-09',
  intro: 'Transitus was built to help communities remember their stories, track environmental justice, and preserve institutional memory \u2014 not to harvest data from the people who need protection most.',
  sections: [
    { id: 'what-we-collect', title: 'What We Collect', body: 'We collect account information (name, email, organization), stewardship data you enter (stakeholders, field notes, community stories, commitments, journey chapters, signals), and minimal usage data (login frequency, feature adoption). We collect geotagged location data only when you explicitly tag field notes with coordinates. We do not collect browsing history or device fingerprints.' },
    { id: 'how-used', title: 'How Data Is Used', body: 'Your data serves one purpose: helping your organization steward places, track commitments, and preserve community voice. We use it to power place intelligence, signal monitoring, commitment tracking, and NRI narrative assistance. We never sell data. We never share individual data across organizations. Aggregated, anonymized patterns may inform ecosystem-level insights \u2014 but these never identify any person or organization.' },
    { id: 'environmental-data', title: 'Environmental & Place-Based Data', body: 'Transitus enriches your work with publicly available environmental and demographic data from EPA EJScreen, EPA ECHO, NOAA, U.S. Census Bureau, USGS, and NASA. This data is government-published and freely available. We do not treat it as personal data. We do not sell, share, or license enriched datasets. Environmental data exists to serve your organization\u2019s place-based understanding, not to create profiles of individuals.' },
    { id: 'consent-levels', title: 'Community Consent Levels', body: 'When you collect community stories, you assign a consent level that controls visibility:\n\u2022 Local Only \u2014 visible only within your organization\n\u2022 Trusted Allies \u2014 shared with partner organizations you designate\n\u2022 Institutional \u2014 shared with your board, funders, and directors\n\u2022 Public \u2014 may appear in published reports and public pages\n\nYour organization controls which consent levels are enabled. Community members may request changes at any time. Stories collected under restrictive consent will never appear under broader visibility without re-consent.' },
    { id: 'testimony', title: 'Testimony & Sensitive Stories', body: 'Field notes marked as testimony receive heightened protection. Testimony is never automatically aggregated or summarized by AI without human review. Any public use of testimony requires explicit consent verification. We maintain separate audit trails for testimony to ensure accountability.' },
    { id: 'field-notes-location', title: 'Field Notes & Location Data', body: 'Field notes may include geotagged observations (latitude/longitude). This location data is encrypted and visible only to team members with appropriate role access (Steward or Companion). Location data is never used for tracking, external mapping, or surveillance. You may strip geolocation from any data export.' },
    { id: 'voice-notes', title: 'Voice Notes & Audio', body: 'If you use voice notes, audio is transcribed using secure, encrypted services. Audio files are deleted immediately after transcription. Transcribed text is stored with the same encryption and access controls as other field notes. Transcription services do not use your audio for model training.' },
    { id: 'email-intake', title: 'Email Intake Processing', body: 'When email integration is enabled, NRI processes sent emails to detect stakeholder mentions, commitment language, and follow-up actions. Email content is never stored in full \u2014 only detected entities are saved as suggestions for your review. You approve every suggestion before it enters your data. You can disconnect email at any time.' },
    { id: 'cookies', title: 'Cookies & Minimal Analytics', body: 'Transitus uses essential cookies for authentication only. We do not use tracking pixels, advertising cookies, or third-party analytics. Feature usage measurement is aggregate and anonymous.' },
    { id: 'nri-companion', title: 'NRI Companion & Guidance', body: 'When you interact with NRI (the AI stewardship companion), your conversation is stored within your organization\u2019s workspace. NRI respects consent levels \u2014 it will not surface or summarize stories beyond their designated visibility. NRI logs are visible only to you and can be cleared at any time. Contextual guidance prompts log only shown/accepted/dismissed status, never content.' },
    { id: 'security', title: 'Data Security', body: 'All data is encrypted in transit (TLS 1.3) and at rest (AES-256). Each organization exists in an isolated tenant with row-level security. Access is controlled by role-based permissions (Steward/Companion/Observer). Community testimony has additional consent-based visibility controls. We conduct regular security reviews.' },
    { id: 'your-rights', title: 'Your Rights', body: 'You have the right to access, correct, export, or delete your data at any time. Data export is available in standard formats (CSV, JSON). Deletion requests are honored within 30 days. Community members may request removal of their stories at any time, and you must comply.' },
    { id: 'children', title: 'Children & Sensitive Data', body: 'Transitus is designed for organizational use by adults. We do not knowingly collect data from children under 16. If your organization documents environmental health impacts on children (e.g., childhood asthma rates in community stories), you are responsible for ensuring appropriate consent and privacy protections.' },
    { id: 'changes', title: 'Changes', body: 'We will notify account administrators of material privacy changes at least 30 days before they take effect. Your continued use of Transitus after changes constitutes acceptance.' },
  ],
};

export const DPA_CONTENT: LegalPageContent = {
  title: 'Data Processing Addendum',
  route: '/legal/data-processing',
  lastUpdated: '2026-04-09',
  intro: 'This addendum clarifies how data flows between your organization and Transitus \u2014 who controls what, and what protections are in place.',
  sections: [
    { id: 'ownership', title: 'Data Ownership', body: 'Your organization (the \u201cController\u201d) owns all data entered into Transitus. Transitus (the \u201cProcessor\u201d) processes this data solely on your behalf, according to your instructions, and for the purposes you define. We do not process your data for our own purposes beyond providing the service.' },
    { id: 'scope', title: 'Processing Scope', body: 'Transitus processes: stakeholder and organization records, field notes (including geotagged observations), community stories (with consent-level enforcement), commitments and community benefit agreements, signals and environmental data enrichment, journey chapters and narrative content, and email intake when enabled. Processing activities include storage, retrieval, NRI narrative intelligence generation, consent-based filtering, and signal aggregation.' },
    { id: 'environmental-processing', title: 'Environmental Data Processing', body: 'Public environmental data from EPA, NOAA, Census Bureau, and USGS is not personal data and is not subject to this addendum. However, when Transitus enriches your organizational data with this public information, the enriched datasets are processed under your control. Transitus does not access or store public data except to serve your organization\u2019s authorized places.' },
    { id: 'ai-processing', title: 'AI Processing & Tenant Isolation', body: 'NRI (Narrative Relational Intelligence) generates insights from your field notes, stakeholder data, and signals. All AI processing occurs within your tenant\u2019s isolated environment. No tenant\u2019s data is used to train models serving other tenants. AI outputs remain within your organization unless you export or publish them. You may disable NRI at any time.' },
    { id: 'consent-processing', title: 'Consent-Based Processing', body: 'Community stories are processed according to their assigned consent level. Stories marked \u201clocal only\u201d are processed only within your organization. Processing never exceeds the consent granted by the community member. Testimony flagged content receives heightened processing controls.' },
    { id: 'security-practices', title: 'Security Practices', body: 'We implement: encryption at rest (AES-256) and in transit (TLS 1.3), row-level security isolation between tenants, role-based access controls (Steward/Companion/Observer), consent-level enforcement for community stories, regular security audits, and automated monitoring for unauthorized access.' },
    { id: 'retention', title: 'Data Retention & Export', body: 'Active data is retained for the duration of your subscription. Upon termination, data is available for export for 90 days, then permanently deleted. Backup copies are purged within 30 days of primary deletion. Voice note audio files are deleted immediately after transcription.' },
    { id: 'subprocessors', title: 'Subprocessors', body: 'Transitus uses the following subprocessors: cloud infrastructure (Supabase/hosting), payment processing, email delivery, voice transcription services, and mapping/GIS services (Mapbox). We maintain a current list and will notify you of changes with 30 days\u2019 notice.' },
    { id: 'incidents', title: 'Incident Communication', body: 'In the event of a data breach, we will notify affected organizations within 72 hours of discovery. Notifications will include the nature of the breach, affected data categories (including whether community stories or testimony were involved), remediation steps taken, and recommended actions.' },
  ],
};

export const ACCEPTABLE_USE_CONTENT: LegalPageContent = {
  title: 'Acceptable Use',
  route: '/legal/acceptable-use',
  lastUpdated: '2026-04-09',
  intro: 'Transitus is built to support stewardship, not surveillance. To share power, not extract stories.',
  sections: [
    { id: 'respectful', title: 'Respectful Use', body: 'Use Transitus to strengthen community power, track environmental accountability, and honor the dignity of the people and places your organization serves. The platform is designed for just transition work \u2014 treat it, and the people within it, accordingly.' },
    { id: 'ej-framing', title: 'Environmental Justice & Community Power', body: 'Transitus is built for environmental justice work. Use it to track accountability, share power, and strengthen community leadership. Do not use Transitus to extract stories without consent, manufacture compliance around community benefit agreements, or build institutional pressure on communities that are already under environmental stress. CBAs and commitments are for mutual accountability, not corporate compliance theater.' },
    { id: 'testimony-consent', title: 'Community Stories & Testimony', body: 'When collecting stories from community members, explicitly explain what you will do with their words and who will see them. Honor consent levels strictly. One-party consent for recording is not the same as consent to store and share in Transitus. Community members may request that their story be removed at any time, and you must comply within 30 days.' },
    { id: 'location-responsibility', title: 'Location Data Responsibility', body: 'Geotagged field notes create a record of where people and observations are located. Do not use location data to track, surveil, or profile individuals. Do not share location data outside your organization without explicit consent. Do not use location history to predict behavior or assess risk.' },
    { id: 'no-harassment', title: 'No Harassment or Exploitation', body: 'Transitus must never be used to harass, stalk, intimidate, or exploit any person. This includes using stakeholder data to pressure, manipulate, or coerce individuals or communities. If we become aware of such use, we will terminate access immediately.' },
    { id: 'prohibited', title: 'Prohibited Uses', body: 'You may not use Transitus to: (1) build predictive risk profiles of individuals, families, or communities; (2) score or rank people by \u201cvalue\u201d or \u201cimpact potential\u201d; (3) conduct surveillance of individuals or communities; (4) extract and sell community data; (5) make automated decisions that affect individuals\u2019 access to services or benefits; (6) use location data for tracking or profiling; (7) ignore community consent settings to make broader use of stories or testimony.' },
    { id: 'protection', title: 'Protection of Vulnerable Communities', body: 'Many communities served through Transitus are already under environmental, economic, and health stress. Extra care must be taken with their data. The people breathing the worst air are the ones with the least political power \u2014 your responsibility is to amplify their voice, not extract their story. Transitus enforces tenant isolation and consent levels to support this, but organizational responsibility is paramount.' },
  ],
};

export const AI_TRANSPARENCY_CONTENT: LegalPageContent = {
  title: 'AI Transparency \u2014 NRI\u2122',
  route: '/legal/ai-transparency',
  lastUpdated: '2026-04-09',
  intro: 'NRI (Narrative Relational Intelligence) helps organize the story of your places and the people who shape them. It does not replace human discernment.',
  sections: [
    { id: 'what-ai-does', title: 'What NRI Does', body: 'NRI assists with:\n\u2022 Signal synthesis \u2014 connecting EPA notices, news, and community observations into a coherent picture of what\u2019s shifting in your places\n\u2022 Commitment monitoring \u2014 flagging when promises are approaching renewal, drifting, or being honored\n\u2022 Stakeholder awareness \u2014 noticing when relationships have gone quiet or when new voices emerge\n\u2022 Narrative summaries \u2014 generating monthly place briefs, board memos, and quarterly reports from your field data\n\u2022 Hearing preparation \u2014 assembling context from field notes, commitments, and stakeholder history\n\nEvery NRI output includes the human evidence that triggered it. Nothing is hidden.' },
    { id: 'consent-respect', title: 'How NRI Respects Consent', body: 'NRI operates within your organization\u2019s consent boundaries. Stories marked \u201clocal only\u201d are processed for internal insights but never appear in shared summaries or reports. Testimony is never automatically aggregated \u2014 any use of testimony in NRI-generated content requires human review. You can view, accept, modify, or delete any NRI output. You can disable NRI entirely from Settings.' },
    { id: 'what-ai-never-does', title: 'What NRI Cannot Do', body: 'NRI cannot and will not:\n\u2022 Score the \u201cvalue\u201d or \u201cmerit\u201d of any relationship or community\n\u2022 Predict whether someone will \u201csucceed\u201d or \u201cfail\u201d\n\u2022 Assess risk levels for individuals or families\n\u2022 Make environmental or health compliance decisions\n\u2022 Recommend removing someone from your network\n\u2022 Share insights across tenants\n\u2022 Use field notes to build behavioral profiles\n\u2022 Make any decision that affects an individual\u2019s access to services' },
    { id: 'environmental-patterns', title: 'Environmental Pattern Recognition', body: 'NRI can surface connections between environmental signals and your field observations. For example: \u201cMultiple field notes mention respiratory concerns in this neighborhood, and EPA\u2019s EJScreen flags this area as high-burden for air quality.\u201d NRI does not make environmental compliance determinations. It helps you see patterns. Human judgment remains yours.' },
    { id: 'human-oversight', title: 'Human Oversight', body: 'Every NRI suggestion can be accepted, modified, or dismissed. No automated action is taken without human review. Summaries, signals, and narrative suggestions are always presented as observations \u2014 \u201cwe\u2019re noticing\u201d rather than \u201cyou must.\u201d The human in the loop is not optional. It is the entire point.' },
    { id: 'nri-vs-automation', title: 'NRI vs Automation', body: 'NRI is not automation. Automation executes predefined rules. NRI witnesses patterns across field notes, signals, commitments, and community stories \u2014 all entered by humans, all interpreted by humans. The \u201cintelligence\u201d in NRI belongs to the relationships and places, not the algorithm. NRI assists the organization of that intelligence. It does not generate it.' },
    { id: 'data-boundaries', title: 'Data Boundaries', body: 'NRI operates under strict boundaries:\n\u2022 Tenant isolation is absolute \u2014 no model learns from one organization\u2019s data to serve another\n\u2022 Your data is never used to train external AI models\n\u2022 Email content processed for intake is never stored beyond detected entities (names, commitments, follow-ups)\n\u2022 Community stories at restricted consent levels are processed for internal insights only\n\u2022 Aggregated ecosystem insights use anonymized data reviewed by humans before publication\n\u2022 You may disable NRI, clear chat history, and opt out of all AI features at any time' },
  ],
};

export const ALL_LEGAL_PAGES = [
  TERMS_CONTENT,
  PRIVACY_CONTENT,
  DPA_CONTENT,
  ACCEPTABLE_USE_CONTENT,
  AI_TRANSPARENCY_CONTENT,
];
