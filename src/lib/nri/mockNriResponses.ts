/**
 * Mock NRI Response Engine
 *
 * Pre-written AI responses that demonstrate what the real LLM will produce.
 * Each response is contextual, warm, narrative, and action-oriented.
 * When Lovable wires Supabase + edge functions, these get replaced with
 * real LLM calls using the same response shape.
 */

import { MOCK_PLACES, MOCK_SIGNALS, MOCK_COMMITMENTS, MOCK_STAKEHOLDERS, MOCK_FIELD_NOTES } from '@/lib/mockData';

interface MockResponse {
  content: string;
  navigation_hint?: string;
}

const KEYWORD_RESPONSES: { pattern: RegExp; respond: () => MockResponse }[] = [
  {
    pattern: /what.*(shifting|changing|happening|new)|signals?\s*(this|last)?\s*week/i,
    respond: () => {
      const recent = MOCK_SIGNALS.slice(0, 3);
      return {
        content: `Here's what I'm noticing across your places this week:\n\n**Southeast Chicago Industrial Corridor**\n${recent.filter(s => s.place_ids.includes('place-1')).map(s => `• ${s.title}`).join('\n') || '• Calumet River cleanup assessment is progressing — EPA team scheduled site walk'}\n\n**East Boston Waterfront**\n• Massport noise mitigation commitment is in motion but no new updates since February\n• A coastal resilience hearing is on the calendar for later this month\n\n**Little Village / La Villita**\n• Crawford site CBA remains delayed — LVEJO reports key provisions still unmet\n• New EPA brownfield funding opportunity posted that could apply here\n\nThe most urgent item is probably the **RMG air monitoring commitment** in Southeast Chicago — it's approaching its review date and community members have been documenting continued dust events.\n\n→ Go to: /app/signals — See all signals`,
        navigation_hint: '→ Go to: /app/signals — See all signals',
      };
    },
  },
  {
    pattern: /log\s*(a\s*)?(site\s*visit|field\s*note|visit)/i,
    respond: () => ({
      content: `I'll help you log a field note. Let me set up the structure:\n\n**Quick Field Log**\n\n1. **Where were you?** (Which place or specific site)\n2. **What did you see?** (Conditions, activity, changes since last visit)\n3. **Who did you speak with?** (Names, roles, what they shared)\n4. **What changed?** (Anything different from previous visits)\n5. **Follow-up needed?** (Actions, people to contact, deadlines)\n\nYou can also add:\n• Photos (attach after saving)\n• Tags: air, water, labor, health, housing, energy, food, land use, permitting\n• Mark as testimony (with consent level: local only, trusted allies, institutional, or public)\n\nTell me about your visit and I'll help you structure it.\n\n→ Go to: /app/field-notes — Field Notes feed`,
      navigation_hint: '→ Go to: /app/field-notes — Field Notes feed',
    }),
  },
  {
    pattern: /commitment|promise|pledge|cba|renewal/i,
    respond: () => {
      const upcoming = MOCK_COMMITMENTS.filter(c => c.renewal_date);
      const delayed = MOCK_COMMITMENTS.filter(c => c.status === 'delayed');
      return {
        content: `Here's the state of your commitments:\n\n**Approaching renewal:**\n${upcoming.map(c => `• **${c.title}** — renewal ${c.renewal_date} (status: ${c.status})`).join('\n')}\n\n${delayed.length > 0 ? `**Showing drift (delayed):**\n${delayed.map(c => `• **${c.title}** — ${c.community_interpretation || 'Community reports provisions remain unmet'}`).join('\n')}` : ''}\n\nThe Crawford CBA is the one I'd watch most closely. LVEJO has documented specific unmet provisions (local hiring targets and green space acreage). A check-in with Antonio Lopez might surface whether negotiation is still active or has stalled.\n\nWould you like me to draft a commitment status brief for your next stakeholder meeting?\n\n→ Go to: /app/commitments — Commitment tracker`,
        navigation_hint: '→ Go to: /app/commitments — Commitment tracker',
      };
    },
  },
  {
    pattern: /who.*(quiet|silent|gone|missing|drift)|check.?in|stakeholder/i,
    respond: () => {
      const quiet = MOCK_STAKEHOLDERS.filter(s => {
        if (!s.last_contact) return true;
        const days = Math.floor((Date.now() - new Date(s.last_contact).getTime()) / 86400000);
        return days > 30;
      });
      return {
        content: `Looking at engagement patterns across your stakeholders:\n\n**Haven't been contacted in 30+ days:**\n${quiet.map(s => `• **${s.name}** (${s.role}) — last contact: ${s.last_contact || 'never recorded'}`).join('\n')}\n\nA few notes:\n\n• **Ald. Patricia Navarro** hasn't been engaged since January. Given the RMG permit situation, she may be a critical voice to reconnect with before the EPA hearing.\n• **Deandre Mitchell** at Alliance of the Southeast is also overdue — he's the housing/transit bridge to communities that the environmental work affects.\n\nNeither of these feels like neglect — more like the natural drift of a busy field season. A brief, warm check-in call (not a formal meeting) might be the right next step.\n\n→ Go to: /app/people — Stakeholder directory`,
        navigation_hint: '→ Go to: /app/people — Stakeholder directory',
      };
    },
  },
  {
    pattern: /place\s*brief|summary|what.*(happened|going on)|month\s*(in\s*review|summary)/i,
    respond: () => ({
      content: `**Southeast Chicago Industrial Corridor — Monthly Brief**\n*March 2026*\n\n---\n\n**What shifted:**\nThe EPA began its preliminary assessment of Calumet River sediment contamination — a milestone SETF has pursued for over a decade. Meanwhile, community members documented continued dust events from RMG's new shredding operations, raising questions about whether permit conditions are being met.\n\n**Commitments in motion:**\n• EPA Superfund assessment (in progress, on track)\n• RMG air monitoring (in motion, but community reports suggest inadequacy)\n\n**Stakeholder landscape:**\n• Maria Santos (SETF) and James Washington conducted 3 site visits this month\n• Christina Herman (ICCR) engaged on utility decarbonization framing\n• Ald. Navarro has been quiet — consider reconnecting before the April hearing\n\n**Community voice:**\nThree residents near 106th & Burley reported increased headaches during James Washington's March 28 site visit. This aligns with field observations of visible dust during high-wind conditions.\n\n**Next faithful steps:**\n1. Share site visit photos with SETF legal team\n2. Reconnect with Ald. Navarro before April 15 EPA hearing\n3. Check IEPA complaint log for March filings\n\n---\n\n*This brief was synthesized from 5 field notes, 4 signals, and 7 stakeholder touchpoints recorded this month.*`,
    }),
  },
  {
    pattern: /fund|grant|opportunit|epa.*grant|doe.*grant/i,
    respond: () => ({
      content: `I found 3 active funding opportunities relevant to your places:\n\n**1. EPA Environmental Justice Collaborative Problem-Solving**\n• Deadline: June 30, 2026\n• Awards: $150K–$500K\n• Fit: Strong for SETF and LVEJO — community-based orgs addressing EJ issues\n• Note: Requires stakeholder collaboration plan — your commitment tracker data would strengthen the application\n\n**2. DOE Community Energy Transition Planning Grants**\n• Deadline: August 15, 2026\n• Awards: $250K–$2M\n• Fit: Good for Southeast Chicago corridor — workforce transition + economic diversification\n• Note: Local government eligible — could partner with Ald. Navarro's office\n\n**3. EPA Brownfields Assessment & Cleanup**\n• Deadline: November 1, 2026\n• Awards: $200K–$5M\n• Fit: Direct match for Calumet River and Crawford site\n• Note: Strongest application would show community engagement history — your journey chapters document this\n\nWant me to draft alignment notes for any of these?\n\n→ Go to: /app/signals — Funding signals`,
      navigation_hint: '→ Go to: /app/signals — Funding signals',
    }),
  },
  {
    pattern: /hearing|prepare|testimony|public\s*meeting/i,
    respond: () => ({
      content: `Let me help you prepare for the upcoming hearing.\n\n**EPA Region 5 Community Engagement Session**\n📅 April 15, 2026 — Southeast Chicago\n\n**Context to bring:**\n\n*From your field notes:*\n• James Washington documented a visible dust plume during high-wind advisory on April 2\n• Three residents reported increased headaches near 106th & Burley\n• Photos from site perimeter visits (March 28, April 2)\n\n*From your commitments:*\n• RMG air monitoring commitment (in motion) — community views as insufficient\n• EPA Superfund assessment (in progress) — reference as precedent for federal attention\n\n*From your stakeholders:*\n• Maria Santos (SETF) — lead voice, 12 years of institutional knowledge\n• Christina Herman (ICCR) — can speak to investor engagement on environmental compliance\n• Residents near 106th & Burley — potential community testimony (confirm consent level)\n\n*Key questions to raise:*\n1. What enforcement mechanisms exist if RMG violates monitoring conditions?\n2. Will the Superfund assessment scope include adjacent residential areas?\n3. How will community health data factor into permitting decisions?\n\nWould you like me to draft a one-page hearing prep sheet?`,
    }),
  },
  {
    pattern: /report|draft|quarterly|board\s*memo|investor/i,
    respond: () => ({
      content: `I can help draft several report types. Which would be most useful right now?\n\n1. **Place Brief** — One-page summary of a specific place (what happened, who's involved, what's next)\n2. **Commitment Status Report** — All active commitments with status, evidence, and community interpretation\n3. **Quarter-in-Review Narrative** — Full narrative of transition work across your places this quarter\n4. **Board Memo** — Institutional-ready summary for governance audiences\n5. **Investor Engagement Packet** — For faith-based investors / CIIC / ICCR members\n6. **Community Listening Summary** — Synthesized themes from field notes and testimony\n\nEach report pulls from your existing data — field notes, signals, commitments, and stakeholder engagement. I'll compose the narrative; you review and refine.\n\nWhich one should we start with?\n\n→ Go to: /app/reports — Reports`,
      navigation_hint: '→ Go to: /app/reports — Reports',
    }),
  },
];

const DEFAULT_RESPONSE: MockResponse = {
  content: `I'm here to help with your Just Transition stewardship work. Here are some things I can help with:\n\n• **"What's shifting?"** — Signals and changes across your places\n• **"Log a site visit"** — Structure a field note from your observations\n• **"Check commitments"** — Review promise status and drift\n• **"Who's gone quiet?"** — Stakeholders needing reconnection\n• **"Place brief"** — Monthly summary for a specific place\n• **"Funding opportunities"** — Active grants relevant to your places\n• **"Prepare for a hearing"** — Context and prep for public meetings\n• **"Draft a report"** — Board memos, investor packets, narratives\n\nWhat would you like to work on?`,
};

export function getMockNriResponse(userMessage: string): MockResponse {
  for (const entry of KEYWORD_RESPONSES) {
    if (entry.pattern.test(userMessage)) {
      return entry.respond();
    }
  }
  return DEFAULT_RESPONSE;
}
