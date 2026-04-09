/**
 * NRIChatDrawer — Transitus field companion chat interface.
 *
 * Slide-out panel for conversing with NRI about places, commitments,
 * stakeholders, signals, and transition work. Includes scope guardrails,
 * quick prompts, and navigation hints.
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  X, Send, Globe, MapPin, Handshake, Users, Radio,
  NotebookPen, BookOpen, FileText, Leaf, Sparkles, ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { checkNriScope } from '@/lib/nri/transitusScopeGuardrails';
import { getMockNriResponse } from '@/lib/nri/mockNriResponses';
import { TRANSITUS_QUICK_PROMPTS } from '@/types/nri';
import type { NRIChatMessage } from '@/types/nri';
import { useTransitusData } from '@/contexts/TransitusDataContext';
import { getCurrentSeason, getDayMoment } from '@/lib/transitionCalendar';

const ICON_MAP: Record<string, React.ElementType> = {
  Radio, NotebookPen, Handshake, Users, MapPin, Leaf, FileText, BookOpen, Sparkles,
};

interface NRIChatDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function NRIChatDrawer({ open, onClose }: NRIChatDrawerProps) {
  const { nriMessages, addNriMessage } = useTransitusData();

  const season = getCurrentSeason();
  const dayMoment = getDayMoment();

  const welcomeContent = `${dayMoment.greeting} It's ${season.label} — a season of ${season.posture.toLowerCase()}.\n\n${season.description}\n\nHow can I help with your stewardship work today?`;

  const WELCOME_MSG: NRIChatMessage = {
    id: 'welcome',
    role: 'assistant',
    content: welcomeContent,
    timestamp: new Date().toISOString(),
  };

  const messages = nriMessages.length > 0 ? nriMessages : [WELCOME_MSG];
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    // Add user message
    const userMsg: NRIChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: new Date().toISOString(),
      context: { page_route: location.pathname },
    };
    addNriMessage(userMsg);
    setInput('');

    // Check scope guardrails
    const guardrail = checkNriScope(trimmed);
    if (!guardrail.allowed) {
      const blockedMsg: NRIChatMessage = {
        id: `msg-${Date.now()}-blocked`,
        role: 'assistant',
        content: guardrail.gentle_response || 'I can\'t help with that, but I\'m here for your stewardship work.',
        timestamp: new Date().toISOString(),
      };
      addNriMessage(blockedMsg);
      return;
    }

    // Simulate typing delay
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));

    // Get mock response
    const response = getMockNriResponse(trimmed);
    const assistantMsg: NRIChatMessage = {
      id: `msg-${Date.now()}-response`,
      role: 'assistant',
      content: response.content,
      timestamp: new Date().toISOString(),
      navigation_hint: response.navigation_hint,
    };

    setIsTyping(false);
    addNriMessage(assistantMsg);
  }, [location.pathname]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleNavigationHint = (hint: string) => {
    const match = hint.match(/→ Go to: (\S+)/);
    if (match) {
      navigate(match[1]);
      onClose();
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    sendMessage(prompt);
  };

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      )}

      {/* Drawer */}
      <div
        className={cn(
          'fixed right-0 top-0 z-50 h-full w-full sm:w-[440px] flex flex-col transition-transform duration-300 ease-out shadow-2xl',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
        style={{ backgroundColor: 'hsl(38 30% 95%)' }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[hsl(30_18%_82%)]" style={{ backgroundColor: 'hsl(20 28% 10%)' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'hsl(152 45% 18%)' }}>
            <Globe className="h-4 w-4" style={{ color: 'hsl(38 80% 55%)' }} />
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-semibold" style={{ color: 'hsl(38 35% 90%)' }}>NRI</h2>
            <p className="text-[10px]" style={{ color: 'hsl(38 35% 90% / 0.5)' }}>Stewardship Companion</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[hsl(38_35%_90%/0.1)] transition-colors" style={{ color: 'hsl(38 35% 90% / 0.6)' }}>
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 px-4 py-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                <div
                  className={cn(
                    'max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
                    msg.role === 'user'
                      ? 'bg-[hsl(20_28%_10%)] text-[hsl(38_35%_90%)] rounded-br-md'
                      : 'bg-white border border-[hsl(30_18%_82%)] text-[hsl(20_25%_12%)] rounded-bl-md',
                  )}
                >
                  <div className="whitespace-pre-wrap font-serif-body text-[13px] leading-[1.7]">{msg.content}</div>
                  {msg.navigation_hint && (
                    <button
                      onClick={() => handleNavigationHint(msg.navigation_hint!)}
                      className="mt-2 text-xs text-[hsl(16_65%_48%)] hover:underline flex items-center gap-1"
                    >
                      <MapPin className="h-3 w-3" /> {msg.navigation_hint.replace('→ Go to: ', '').split(' — ')[1] || 'Navigate'}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-[hsl(30_18%_82%)] rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[hsl(20_25%_12%/0.3)] animate-pulse" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-[hsl(20_25%_12%/0.3)] animate-pulse" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-[hsl(20_25%_12%/0.3)] animate-pulse" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick prompts (show when few messages) */}
          {messages.length <= 2 && !isTyping && (
            <div className="mt-6 space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[hsl(20_25%_12%/0.35)] px-1">Suggested</p>
              <div className="grid grid-cols-2 gap-2">
                {TRANSITUS_QUICK_PROMPTS.filter(p => p.context === 'general').slice(0, 6).map((qp) => {
                  const Icon = ICON_MAP[qp.icon] || Sparkles;
                  return (
                    <button
                      key={qp.id}
                      onClick={() => handleQuickPrompt(qp.prompt)}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-[hsl(30_18%_82%)] bg-white text-left text-xs text-[hsl(20_25%_12%/0.7)] hover:border-[hsl(16_65%_48%/0.3)] hover:text-[hsl(20_25%_12%)] transition-all active:scale-[0.98]"
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0 text-[hsl(16_65%_48%)]" />
                      <span>{qp.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </ScrollArea>

        {/* Input */}
        <form onSubmit={handleSubmit} className="border-t border-[hsl(30_18%_82%)] bg-white p-3">
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your places, commitments, signals..."
              rows={1}
              className="flex-1 resize-none rounded-xl border border-[hsl(30_18%_82%)] bg-[hsl(38_30%_95%)] px-3 py-2.5 text-sm text-[hsl(20_25%_12%)] placeholder:text-[hsl(20_25%_12%/0.35)] focus:outline-none focus:border-[hsl(16_65%_48%/0.5)] transition-colors"
              style={{ minHeight: '40px', maxHeight: '120px' }}
              onInput={(e) => {
                const el = e.target as HTMLTextAreaElement;
                el.style.height = 'auto';
                el.style.height = Math.min(el.scrollHeight, 120) + 'px';
              }}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isTyping}
              className="h-10 w-10 rounded-xl bg-[hsl(16_65%_48%)] hover:bg-[hsl(16_65%_48%/0.85)] text-white shrink-0 disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
