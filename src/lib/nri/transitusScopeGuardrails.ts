/**
 * Transitus NRI Scope Guardrails
 *
 * Pre-screens user messages BEFORE sending to AI.
 * Blocks crisis, emotional support, off-topic, professional advice, and injection.
 * Returns gentle, warm redirects — never cold rejections.
 *
 * Adapted from CROS scopeGuardrails.ts with identical safety patterns.
 */

import type { GuardrailResult, GuardrailCategory } from '@/types/nri';

const CRISIS_PATTERNS = [
  /\b(suicid|kill\s*my\s*self|end\s*(my|it\s*all)|self[- ]?harm|want\s*to\s*die|cutting\s*myself)\b/i,
  /\b(domestic\s*violence|being\s*abused|someone\s*is\s*hurting)\b/i,
  /\b(overdos|eating\s*disorder|anorex|bulimi)\b/i,
];

const EMOTIONAL_PATTERNS = [
  /\b(i\s*feel\s*(so\s*)?(depressed|anxious|hopeless|worthless|alone))\b/i,
  /\b(need\s*(a\s*)?therapist|need\s*counseling|vent\s*to\s*you)\b/i,
  /\b(i'?m\s*(so\s*)?(sad|scared|overwhelmed|burnt?\s*out))\b/i,
];

const OFF_TOPIC_PATTERNS = [
  /\b(write\s*(me\s*)?(a\s*)?(poem|song|story|joke|essay))\b/i,
  /\b(help\s*(me\s*)?(with\s*)?(homework|code|programming|math))\b/i,
  /\b(what\s*is\s*the\s*capital\s*of|who\s*won\s*the|recipe\s*for)\b/i,
  /\b(play\s*a\s*game|tell\s*me\s*a\s*joke|roleplay)\b/i,
];

const PROFESSIONAL_PATTERNS = [
  /\b(legal\s*advice|should\s*i\s*sue|is\s*this\s*legal)\b/i,
  /\b(medical\s*advice|diagnos|should\s*i\s*take|prescription)\b/i,
  /\b(tax\s*advice|investment\s*advice|financial\s*planning)\b/i,
];

const INJECTION_PATTERNS = [
  /\b(ignore\s*(previous|all|your)\s*(instructions|rules|system))\b/i,
  /\b(jailbreak|dan\s*mode|bypass|pretend\s*you\s*are)\b/i,
  /\b(system\s*prompt|reveal\s*your|what\s*are\s*your\s*instructions)\b/i,
];

const GENTLE_RESPONSES: Record<GuardrailCategory, string> = {
  crisis: `I hear you, and what you're describing matters deeply. I'm not equipped to help with this, but people who are trained to listen are available right now.\n\n**988 Suicide & Crisis Lifeline**: Call or text **988** (available 24/7)\n**Crisis Text Line**: Text **HOME** to **741741**\n\nYou deserve real support from someone who can be fully present with you.`,

  emotional_support: `It sounds like you're carrying something heavy right now. I want to be honest — I'm built for place-based stewardship work, not emotional support, and you deserve better than what I can offer here.\n\nIf you'd like to talk to someone trained to listen, many organizations offer free and confidential support. In the meantime, I'm here for any Transitus work whenever you're ready.`,

  off_topic: `I appreciate the creative energy! I'm specifically built to help with Just Transition stewardship — places, commitments, stakeholders, field notes, and signals. I'm most useful when we're working within Transitus.\n\nWant to try one of these instead?\n• "What's shifting in my places this week?"\n• "Help me log a field note"\n• "Check on my commitments"`,

  professional_advice: `That's an important question, but it's outside what I can responsibly help with. For legal, medical, tax, or investment questions, please consult a qualified professional.\n\nWithin Transitus, I can help you track commitments, prepare briefings for meetings with advisors, or organize the context you'd want to bring to a professional consultation.`,

  prompt_injection: `I'm Transitus NRI — a stewardship companion for place-based transition work. I can help you with places, stakeholders, commitments, field notes, signals, journeys, and reports.\n\nWhat would you like to work on?`,
};

export function checkNriScope(message: string): GuardrailResult {
  const trimmed = message.trim();
  if (!trimmed) return { allowed: true };

  for (const pattern of CRISIS_PATTERNS) {
    if (pattern.test(trimmed)) {
      return { allowed: false, category: 'crisis', gentle_response: GENTLE_RESPONSES.crisis };
    }
  }
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(trimmed)) {
      return { allowed: false, category: 'prompt_injection', gentle_response: GENTLE_RESPONSES.prompt_injection };
    }
  }
  for (const pattern of EMOTIONAL_PATTERNS) {
    if (pattern.test(trimmed)) {
      return { allowed: false, category: 'emotional_support', gentle_response: GENTLE_RESPONSES.emotional_support };
    }
  }
  for (const pattern of PROFESSIONAL_PATTERNS) {
    if (pattern.test(trimmed)) {
      return { allowed: false, category: 'professional_advice', gentle_response: GENTLE_RESPONSES.professional_advice };
    }
  }
  for (const pattern of OFF_TOPIC_PATTERNS) {
    if (pattern.test(trimmed)) {
      return { allowed: false, category: 'off_topic', gentle_response: GENTLE_RESPONSES.off_topic };
    }
  }

  return { allowed: true };
}
