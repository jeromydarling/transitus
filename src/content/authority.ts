/**
 * authority — Content registry for the CROS™ Authority Hub.
 *
 * WHAT: Curated narrative content positioning CROS as the leading voice in human-centered relational systems.
 * WHERE: Rendered on /authority/* public routes.
 * WHY: Builds long-form SEO authority through pastoral storytelling.
 */

export interface AuthoritySection {
  slug: string;
  category: 'week' | 'adoption' | 'story';
  archetype: string;
  roleFocus: string;
  title: string;
  description: string;
  body: string;
}

export const AUTHORITY_SECTIONS: AuthoritySection[] = [
  {
    slug: 'catholic-outreach-week',
    category: 'week',
    archetype: 'church',
    roleFocus: 'shepherd',
    title: 'A Week in Catholic Outreach',
    description: 'How relational ministry unfolds when visits, reflections, and community signals work together.',
    body: `Monday begins with a review. Father Miguel opens CROS and reads through the weekend's reflections — communion visitors noting quiet homes, lively conversations, a family asking about baptism preparation.

By Tuesday, he's drafting a follow-up list. Not from a CRM pipeline. From the stories his visitors told. Mrs. Fernandez seemed withdrawn. The Nguyens asked about the school fair. David noticed the lights were off at the Morales home.

Wednesday is for visits. Miguel takes the Morales visit himself. Thursday, Sister Catherine handles the east-side rounds. By Friday, the parish secretary has entered three new reflections and processed two provisioning requests — communion supplies for the homebound route.

Saturday is quiet. Sunday, the visitors go out again. And the cycle renews — not because a dashboard demands it, but because presence has its own rhythm.`,
  },
  {
    slug: 'workforce-adoption-guide',
    category: 'adoption',
    archetype: 'workforce',
    roleFocus: 'leader',
    title: 'Adopting CROS in Workforce Development',
    description: 'Non-technical guidance for leaders bringing CROS into employment programs.',
    body: `Adopting any new system in workforce development is complicated. Teams are stretched. Participants need immediate attention. The idea of "learning new software" feels like a luxury no one has time for.

CROS was designed for this reality. It doesn't ask for comprehensive data entry. It asks for noticing.

Start with reflections. After each participant meeting, write one sentence about what you observed. Not a case note. Not a compliance form. Just: "Marcus seemed excited about the welding track today." Over time, these reflections build a narrative layer that case notes never capture.

Next, customize your journey stages. The default labels may not fit. "Intake → Assessment → Training → Placement" is fine for reporting. But "Welcome → Understanding → Building Together → Stepping Forward" might be truer to your mission. CROS lets your language shape your system.

The rest — drift detection, signals, provisioning — comes naturally. The foundation is the reflection habit. Everything else grows from there.`,
  },
  {
    slug: 'why-not-a-crm',
    category: 'story',
    archetype: 'nonprofit',
    roleFocus: 'leader',
    title: 'Why CROS Is Not a CRM',
    description: 'A narrative essay on the difference between tracking transactions and remembering people.',
    body: `CRMs were built to manage customers. The acronym says it all: Customer Relationship Management. The relationship exists in service of the transaction.

CROS inverts this. The relationship is the point. There is no transaction to optimize. There is no pipeline to close. There is only the ongoing, evolving, sometimes messy, always sacred reality of people in community.

When a nonprofit director opens a CRM, they see a funnel. Leads at the top, conversions at the bottom. The visual grammar says: move people through.

When a CROS user opens their dashboard, they see reflections. Stories. Signals. Journey chapters. The visual grammar says: notice what's happening.

This is not a semantic difference. It shapes every interaction. When your system measures "days since last contact," it creates urgency. When your system notices "reflections this week," it creates awareness. Urgency exhausts. Awareness sustains.

CROS was built for organizations that are tired of being measured and ready to be remembered.`,
  },
  {
    slug: 'digital-inclusion-week',
    category: 'week',
    archetype: 'digital_inclusion',
    roleFocus: 'companion',
    title: 'A Week in Digital Inclusion',
    description: 'How a digital equity team uses CROS to track device distribution, training sessions, and community engagement.',
    body: `Monday: The steward reviews the Prōvīsiō queue. Four laptops need deployment to the south side community center. Three households have requested hotspot devices.

Tuesday: Companions run a digital literacy workshop at the library. Twelve participants attend. Three are new — the companion logs brief reflections for each.

Wednesday: Follow-up visits. A companion checks in with Mrs. Johnson, who received a tablet last month. She's using video calling to talk to her grandchildren. The companion writes: "Dorothy's face lights up when she talks about the video calls. This is why we do this."

Thursday: The steward processes a provisioning request from a school partner. Five Chromebooks for a homework club. Journey stage: Building Together.

Friday: Team reflection meeting. The shepherd reads the week's entries aloud. Everyone notices: the south side is growing. More families, more requests, more stories. A momentum signal, witnessed by humans.`,
  },
  {
    slug: 'leadership-adoption-principles',
    category: 'adoption',
    archetype: 'church',
    roleFocus: 'leader',
    title: 'Five Principles for Leadership Adoption',
    description: 'How leaders can model the adoption behaviors that make CROS come alive.',
    body: `1. Write the first reflection yourself. Don't ask your team to do something you haven't done. Open CROS, think about a conversation you had this week, and write one sentence. Your team will follow.

2. Name your journey stages together. Don't accept the defaults without discussion. The naming process is itself a mission-alignment exercise. It reveals how your team thinks about the people you serve.

3. Celebrate quiet dashboards. When your dashboard has no urgent signals, that means your team is in rhythm. Say so out loud. "Nothing urgent today" is a success worth naming.

4. Read reflections weekly. Not to monitor your team — to learn from them. Your visitors and companions see things you don't. Their reflections are a gift. Treat them that way.

5. Trust the slow build. CROS doesn't deliver ROI in week one. It builds narrative depth over months. The organizations that thrive with CROS are the ones willing to let the story unfold at its own pace.`,
  },
];

/** Get authority section by slug. */
export function getAuthoritySection(slug: string): AuthoritySection | undefined {
  return AUTHORITY_SECTIONS.find((s) => s.slug === slug);
}

/** Get sections by category. */
export function getAuthoritySectionsByCategory(category: AuthoritySection['category']): AuthoritySection[] {
  return AUTHORITY_SECTIONS.filter((s) => s.category === category);
}
