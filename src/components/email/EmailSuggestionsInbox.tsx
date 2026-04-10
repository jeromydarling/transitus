/**
 * EmailSuggestionsInbox — NRI Email Intelligence component.
 *
 * Shows mock email analysis results with accept/dismiss actions.
 * Each suggestion card displays type, source, detection, action, and confidence.
 */

import { useState, type ReactNode } from 'react';
import { Mail, Users, Handshake, Clock, RefreshCw, Check, X } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

// ── Types ──

type SuggestionType = 'new_contact' | 'commitment_detected' | 'follow_up' | 'status_change';
type SuggestionStatus = 'pending' | 'accepted' | 'dismissed';

interface EmailSuggestion {
  id: string;
  type: SuggestionType;
  source_email: string;
  detected: string;
  suggested_action: string;
  confidence: number;
  status: SuggestionStatus;
}

// ── Mock data ──

const INITIAL_SUGGESTIONS: EmailSuggestion[] = [
  {
    id: 'es-1',
    type: 'new_contact',
    source_email: 'Sent to navarro@chicago.gov',
    detected: 'Ald. Patricia Navarro mentioned in context of SE Side zoning hearing',
    suggested_action: 'Add as stakeholder with role: Convener',
    confidence: 0.85,
    status: 'pending',
  },
  {
    id: 'es-2',
    type: 'commitment_detected',
    source_email: 'Sent to greenroots@eastboston.org',
    detected: '"We commit to incorporating community priorities into the coastal plan"',
    suggested_action: 'Create commitment: City adopts GreenRoots priorities',
    confidence: 0.72,
    status: 'pending',
  },
  {
    id: 'es-3',
    type: 'follow_up',
    source_email: 'Sent to christina.herman@iccr.org',
    detected: 'Follow-up needed on CIIC investment screen criteria by April 30',
    suggested_action: 'Add follow-up reminder for CIIC engagement',
    confidence: 0.91,
    status: 'pending',
  },
  {
    id: 'es-4',
    type: 'status_change',
    source_email: 'Sent to maria@setaskforce.org',
    detected: 'EPA confirmed Calumet River assessment moving to Phase 2',
    suggested_action: 'Update commitment status: EPA Superfund \u2192 In Motion',
    confidence: 0.88,
    status: 'pending',
  },
];

// ── Type config ──

const TYPE_CONFIG: Record<SuggestionType, { icon: typeof Users; label: string; borderColor: string }> = {
  new_contact: {
    icon: Users,
    label: 'New Contact',
    borderColor: 'border-l-[hsl(205_60%_50%)]',
  },
  commitment_detected: {
    icon: Handshake,
    label: 'Commitment',
    borderColor: 'border-l-[hsl(152_45%_35%)]',
  },
  follow_up: {
    icon: Clock,
    label: 'Follow-up',
    borderColor: 'border-l-[hsl(36_77%_49%)]',
  },
  status_change: {
    icon: RefreshCw,
    label: 'Status Change',
    borderColor: 'border-l-[hsl(270_40%_50%)]',
  },
};

// ── Confidence bar color ──

function confidenceColor(confidence: number): string {
  if (confidence > 0.8) return 'bg-[hsl(152_45%_35%)]'; // forest green
  if (confidence > 0.6) return 'bg-[hsl(36_77%_49%)]'; // amber
  return 'bg-[hsl(16_65%_48%)]'; // terracotta
}

function confidenceLabel(confidence: number): string {
  return `${Math.round(confidence * 100)}% confidence`;
}

// ── Component ──

export default function EmailSuggestionsInbox({ sectionHeader }: { sectionHeader?: ReactNode }) {
  const [suggestions, setSuggestions] = useState<EmailSuggestion[]>(INITIAL_SUGGESTIONS);

  const pendingSuggestions = suggestions.filter((s) => s.status === 'pending');

  const handleAccept = (id: string) => {
    setSuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'accepted' as const } : s)),
    );
    toast.success('Suggestion applied');
  };

  const handleDismiss = (id: string) => {
    setSuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'dismissed' as const } : s)),
    );
  };

  if (pendingSuggestions.length === 0) return null;

  return (
    <section className="mb-10">
      {sectionHeader}
    <div>
      {/* Card header */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <Mail className="h-4 w-4 text-[hsl(16_65%_48%)]" />
          <h2 className="font-serif text-lg tracking-tight text-[hsl(20_28%_15%)]">
            NRI Email Intelligence
          </h2>
        </div>
        <p className="text-xs text-[hsl(20_8%_52%)]">
          From your sent emails in the last 24 hours
        </p>
      </div>

      {/* Suggestion cards */}
      <div className="space-y-3">
        {suggestions.map((suggestion) => {
          if (suggestion.status === 'dismissed') return null;

          const config = TYPE_CONFIG[suggestion.type];
          const Icon = config.icon;
          const isAccepted = suggestion.status === 'accepted';

          return (
            <div
              key={suggestion.id}
              className={`rounded-lg bg-white p-4 border border-[hsl(30_18%_82%)] border-l-[3px] ${config.borderColor} transition-all ${
                isAccepted ? 'opacity-60' : ''
              }`}
            >
              {/* Type badge */}
              <div className="flex items-center gap-2 mb-2">
                <Icon className="h-3.5 w-3.5 text-[hsl(30_10%_45%)]" />
                <span className="inline-flex items-center rounded-full bg-[hsl(30_18%_90%)] text-[hsl(30_18%_40%)] px-2 py-0.5 text-[10px] font-medium">
                  {config.label}
                </span>
                {isAccepted && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[hsl(152_30%_92%)] text-[hsl(152_45%_30%)] px-2 py-0.5 text-[10px] font-medium">
                    <Check className="h-2.5 w-2.5" /> Applied
                  </span>
                )}
              </div>

              {/* Source email */}
              <p className="text-[11px] text-[hsl(20_8%_52%)] mb-1">
                {suggestion.source_email}
              </p>

              {/* What NRI detected */}
              <p className="text-sm font-medium text-[hsl(20_10%_20%)] leading-snug mb-1">
                {suggestion.detected}
              </p>

              {/* Suggested action */}
              <p className="text-xs text-[hsl(30_10%_40%)] mb-3">
                {suggestion.suggested_action}
              </p>

              {/* Confidence bar */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex-1 h-1.5 rounded-full bg-[hsl(30_18%_90%)] overflow-hidden">
                  <div
                    className={`h-full rounded-full ${confidenceColor(suggestion.confidence)} transition-all`}
                    style={{ width: `${suggestion.confidence * 100}%` }}
                  />
                </div>
                <span className="text-[10px] text-[hsl(20_8%_52%)] shrink-0">
                  {confidenceLabel(suggestion.confidence)}
                </span>
              </div>

              {/* Actions */}
              {!isAccepted && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAccept(suggestion.id)}
                    className="inline-flex items-center gap-1 rounded-full bg-[hsl(152_45%_35%)] px-3 py-1.5 text-xs font-medium text-white hover:bg-[hsl(152_45%_28%)] transition-colors"
                  >
                    <Check className="h-3 w-3" />
                    Accept
                  </button>
                  <button
                    onClick={() => handleDismiss(suggestion.id)}
                    className="inline-flex items-center gap-1 rounded-full border border-[hsl(30_18%_82%)] px-3 py-1.5 text-xs font-medium text-[hsl(30_10%_45%)] hover:bg-[hsl(30_18%_90%)] transition-colors"
                  >
                    <X className="h-3 w-3" />
                    Dismiss
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
    </section>
  );
}

/** Returns the count of pending suggestions (for conditional rendering) */
export function hasPendingSuggestions(): boolean {
  return INITIAL_SUGGESTIONS.length > 0;
}
