/**
 * EmailSuggestionsInbox — NRI Email Intelligence in compact 4-column cards.
 * Paginated. Accept/Dismiss actions. Hides when all handled.
 */

import { useState, type ReactNode } from 'react';
import { Mail, Users, Handshake, Clock, RefreshCw, Check, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

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

const INITIAL_SUGGESTIONS: EmailSuggestion[] = [
  { id: 'es-1', type: 'new_contact', source_email: 'navarro@chicago.gov', detected: 'Ald. Navarro — SE Side zoning hearing', suggested_action: 'Add as stakeholder (Convener)', confidence: 0.85, status: 'pending' },
  { id: 'es-2', type: 'commitment_detected', source_email: 'greenroots@eastboston.org', detected: '"Commit to incorporating community priorities"', suggested_action: 'Create commitment', confidence: 0.72, status: 'pending' },
  { id: 'es-3', type: 'follow_up', source_email: 'christina.herman@iccr.org', detected: 'CIIC investment screen — due April 30', suggested_action: 'Add follow-up reminder', confidence: 0.91, status: 'pending' },
  { id: 'es-4', type: 'status_change', source_email: 'maria@setaskforce.org', detected: 'EPA Calumet assessment → Phase 2', suggested_action: 'Update: Superfund → In Motion', confidence: 0.88, status: 'pending' },
  { id: 'es-5', type: 'new_contact', source_email: 'lopez@lvejo.org', detected: 'Antonio Lopez — Crawford CBA negotiation', suggested_action: 'Update stakeholder tags', confidence: 0.79, status: 'pending' },
  { id: 'es-6', type: 'follow_up', source_email: 'jake.barnett@wespath.org', detected: 'Investment screen review meeting next week', suggested_action: 'Add calendar event', confidence: 0.82, status: 'pending' },
  { id: 'es-7', type: 'commitment_detected', source_email: 'epa-region5@epa.gov', detected: '"Assessment scope includes residential areas"', suggested_action: 'Update commitment scope', confidence: 0.67, status: 'pending' },
  { id: 'es-8', type: 'status_change', source_email: 'massport-community@massport.com', detected: 'Noise program expanded to 800 homes', suggested_action: 'Update: Massport → In Motion', confidence: 0.84, status: 'pending' },
];

const TYPE_CONFIG: Record<SuggestionType, { icon: typeof Users; label: string; color: string }> = {
  new_contact: { icon: Users, label: 'Contact', color: 'hsl(205 60% 50%)' },
  commitment_detected: { icon: Handshake, label: 'Commitment', color: 'hsl(152 45% 35%)' },
  follow_up: { icon: Clock, label: 'Follow-up', color: 'hsl(36 77% 49%)' },
  status_change: { icon: RefreshCw, label: 'Status', color: 'hsl(270 40% 50%)' },
};

const PER_PAGE = 4;

export default function EmailSuggestionsInbox({ sectionHeader }: { sectionHeader?: ReactNode }) {
  const [suggestions, setSuggestions] = useState<EmailSuggestion[]>(INITIAL_SUGGESTIONS);
  const [page, setPage] = useState(0);

  const visible = suggestions.filter(s => s.status !== 'dismissed');
  const pending = visible.filter(s => s.status === 'pending');
  const totalPages = Math.ceil(visible.length / PER_PAGE);
  const pageItems = visible.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

  const handleAccept = (id: string) => {
    setSuggestions(prev => prev.map(s => s.id === id ? { ...s, status: 'accepted' as const } : s));
    toast.success('Suggestion applied');
  };

  const handleDismiss = (id: string) => {
    setSuggestions(prev => prev.map(s => s.id === id ? { ...s, status: 'dismissed' as const } : s));
  };

  if (pending.length === 0 && visible.filter(s => s.status === 'accepted').length === 0) return null;

  return (
    <section className="mb-10">
      {sectionHeader}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-[hsl(16_65%_48%)]" />
              <h2 className="font-serif text-lg tracking-tight text-[hsl(20_28%_15%)]">NRI Email Intelligence</h2>
            </div>
            <p className="text-[10px] text-[hsl(20_8%_52%)] mt-0.5">From your sent emails in the last 24 hours · {pending.length} pending</p>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="p-1 rounded hover:bg-[hsl(30_18%_82%/0.5)] disabled:opacity-30 transition-colors">
                <ChevronLeft className="h-4 w-4 text-[hsl(20_25%_12%/0.5)]" />
              </button>
              <span className="text-[10px] text-[hsl(20_8%_52%)] min-w-[40px] text-center">{page + 1} / {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} className="p-1 rounded hover:bg-[hsl(30_18%_82%/0.5)] disabled:opacity-30 transition-colors">
                <ChevronRight className="h-4 w-4 text-[hsl(20_25%_12%/0.5)]" />
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {pageItems.map(s => {
            const cfg = TYPE_CONFIG[s.type];
            const Icon = cfg.icon;
            const accepted = s.status === 'accepted';
            return (
              <div key={s.id} className={`rounded-lg bg-white border border-[hsl(30_18%_82%)] overflow-hidden transition-all ${accepted ? 'opacity-50' : ''}`}>
                {/* Type header */}
                <div className="px-3 py-1.5 flex items-center gap-1.5" style={{ backgroundColor: cfg.color }}>
                  <Icon className="h-3 w-3 text-white" />
                  <span className="text-[9px] font-semibold uppercase tracking-wider text-white">{cfg.label}</span>
                  {accepted && <Check className="h-3 w-3 text-white ml-auto" />}
                </div>
                <div className="p-3">
                  <p className="text-[10px] text-[hsl(20_8%_52%)] mb-1">{s.source_email}</p>
                  <p className="text-xs font-medium text-[hsl(20_10%_20%)] leading-snug mb-1 line-clamp-2">{s.detected}</p>
                  <p className="text-[10px] text-[hsl(30_10%_40%)] mb-2 line-clamp-1">{s.suggested_action}</p>
                  {/* Confidence */}
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="flex-1 h-1 rounded-full bg-[hsl(30_18%_90%)] overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${s.confidence * 100}%`, backgroundColor: s.confidence > 0.8 ? 'hsl(152 45% 35%)' : s.confidence > 0.6 ? 'hsl(36 77% 49%)' : 'hsl(16 65% 48%)' }} />
                    </div>
                    <span className="text-[9px] text-[hsl(20_8%_52%)]">{Math.round(s.confidence * 100)}%</span>
                  </div>
                  {/* Actions */}
                  {!accepted && (
                    <div className="flex gap-1.5">
                      <button onClick={() => handleAccept(s.id)} className="flex-1 flex items-center justify-center gap-1 rounded-md bg-[hsl(152_40%_28%)] text-white py-1 text-[10px] font-medium hover:bg-[hsl(152_40%_24%)] transition-colors">
                        <Check className="h-3 w-3" /> Accept
                      </button>
                      <button onClick={() => handleDismiss(s.id)} className="flex items-center justify-center rounded-md border border-[hsl(30_18%_82%)] text-[hsl(20_8%_52%)] px-2 py-1 hover:bg-[hsl(30_18%_95%)] transition-colors">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
