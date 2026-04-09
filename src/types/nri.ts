/**
 * NRI (Narrative Relational Intelligence) — Transitus AI Layer
 *
 * The AI assistant for Just Transition stewardship work.
 * Adapted from CROS NRI with place-based, transition-focused domain.
 *
 * Core functions:
 * - Recognize: detect signals of change, drift, and opportunity in places
 * - Synthesize: fold scattered notes, signals, and commitments into narratives
 * - Prioritize: suggest the next faithful step for stewards and field companions
 *
 * Subsystems (carried from CROS, domain-adapted):
 * - Signum: friction/engagement signal detection
 * - Lumen: foresight/pattern detection across places
 * - Praeceptum: deterministic adaptive prompt memory (no AI — pure math)
 * - Compass: 4-direction suggestion engine
 */

// ── Chat Types ──

export interface NRIChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  context?: NRIMessageContext;
  navigation_hint?: string; // e.g. "→ Go to: /app/places/place-1 — Southeast Chicago"
}

export interface NRIMessageContext {
  place_id?: string;
  stakeholder_id?: string;
  commitment_id?: string;
  signal_id?: string;
  page_route?: string;
}

export interface NRIChatSession {
  id: string;
  messages: NRIChatMessage[];
  created_at: string;
  updated_at: string;
}

// ── Compass Types ──

export type CompassDirection = 'north' | 'east' | 'south' | 'west';

export interface CompassNudge {
  id: string;
  direction: CompassDirection;
  title: string;
  body: string;
  action_label?: string;
  action_route?: string;
  priority: 'low' | 'medium' | 'high';
  dismissed: boolean;
  created_at: string;
}

/**
 * Transitus Compass Directions (adapted from CROS):
 *
 * North = Place Intelligence (what's shifting in the land and data)
 * East  = Transition Progress (are commitments moving, are journeys advancing)
 * South = Community Presence (who needs attention, who's gone quiet)
 * West  = Stewardship & Repair (what needs mending, what needs rest)
 */
export const COMPASS_LABELS: Record<CompassDirection, { label: string; description: string }> = {
  north: { label: 'Place', description: 'What\'s shifting in your places — new signals, environmental changes, data updates' },
  east: { label: 'Transition', description: 'Are commitments moving? Are journeys advancing? What\'s stalled?' },
  south: { label: 'Community', description: 'Who needs attention — quiet stakeholders, missed meetings, new voices' },
  west: { label: 'Stewardship', description: 'What needs mending, reviewing, or rest — overdue renewals, broken promises, your own capacity' },
};

// ── Scope Guardrails ──

export type GuardrailCategory = 'crisis' | 'emotional_support' | 'off_topic' | 'professional_advice' | 'prompt_injection';

export interface GuardrailResult {
  allowed: boolean;
  category?: GuardrailCategory;
  gentle_response?: string;
}

// ── Quick Prompts ──

export interface QuickPrompt {
  id: string;
  label: string;
  prompt: string;
  icon: string; // Lucide icon name
  context?: 'place' | 'commitment' | 'stakeholder' | 'general';
}

export const TRANSITUS_QUICK_PROMPTS: QuickPrompt[] = [
  { id: 'qp-1', label: 'What\'s shifting?', prompt: 'What signals and changes have happened across my places this week?', icon: 'Radio', context: 'general' },
  { id: 'qp-2', label: 'Log a site visit', prompt: 'Help me log a field note from a site visit I just completed.', icon: 'NotebookPen', context: 'general' },
  { id: 'qp-3', label: 'Check commitments', prompt: 'Which commitments are approaching their renewal date or showing signs of drift?', icon: 'Handshake', context: 'general' },
  { id: 'qp-4', label: 'Who\'s gone quiet?', prompt: 'Which stakeholders haven\'t been engaged recently? Who might need a check-in?', icon: 'Users', context: 'general' },
  { id: 'qp-5', label: 'Place brief', prompt: 'Generate a brief summary of what\'s happened in this place over the past month.', icon: 'MapPin', context: 'place' },
  { id: 'qp-6', label: 'Funding opportunities', prompt: 'What active grant or funding opportunities are relevant to my places?', icon: 'Leaf', context: 'general' },
  { id: 'qp-7', label: 'Prepare for a hearing', prompt: 'Help me prepare for an upcoming public hearing. What context should I bring?', icon: 'FileText', context: 'general' },
  { id: 'qp-8', label: 'Draft a report', prompt: 'Help me draft a quarterly narrative for stakeholders about this place.', icon: 'BookOpen', context: 'place' },
];
