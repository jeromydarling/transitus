/**
 * Feedback / Bug Report page for Transitus app.
 * Local-state version — stores feedback in localStorage for Lovable handoff.
 */

import { useState } from 'react';
import { Bug, Lightbulb, MessageSquare, Send, CheckCircle2, Clock, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface FeedbackItem {
  id: string;
  type: 'bug' | 'feature' | 'question';
  title: string;
  description: string;
  page?: string;
  status: 'submitted' | 'acknowledged';
  created_at: string;
}

const TYPE_CONFIG = {
  bug: { label: 'Bug Report', icon: Bug, color: 'hsl(0 50% 45%)' },
  feature: { label: 'Feature Request', icon: Lightbulb, color: 'hsl(38 80% 50%)' },
  question: { label: 'Question', icon: MessageSquare, color: 'hsl(198 55% 42%)' },
};

function loadFeedback(): FeedbackItem[] {
  try {
    return JSON.parse(localStorage.getItem('transitus_feedback') || '[]');
  } catch { return []; }
}

function saveFeedback(items: FeedbackItem[]) {
  localStorage.setItem('transitus_feedback', JSON.stringify(items));
}

export default function AppFeedback() {
  const [items, setItems] = useState<FeedbackItem[]>(loadFeedback);
  const [type, setType] = useState<'bug' | 'feature' | 'question'>('bug');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const submit = () => {
    if (!title.trim()) return;
    const item: FeedbackItem = {
      id: `fb-${Date.now()}`,
      type,
      title: title.trim(),
      description: description.trim(),
      page: window.location.pathname,
      status: 'submitted',
      created_at: new Date().toISOString(),
    };
    const updated = [item, ...items];
    setItems(updated);
    saveFeedback(updated);
    setTitle('');
    setDescription('');
    toast.success('Received. Thank you for helping improve Transitus.');
  };

  const remove = (id: string) => {
    const updated = items.filter(i => i.id !== id);
    setItems(updated);
    saveFeedback(updated);
  };

  return (
    <div className="min-h-screen bg-[hsl(38_30%_95%)]">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <div className="flex items-center gap-2 mb-2">
          <MessageSquare className="h-4 w-4 text-[hsl(16_65%_48%)]" />
          <span className="font-sans text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">Feedback</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl text-[hsl(20_25%_12%)] mb-2">Help improve Transitus</h1>
        <p className="text-sm text-[hsl(20_25%_12%/0.55)] mb-8">Report a bug, suggest a feature, or ask a question. Your feedback shapes the platform.</p>

        {/* Type selector */}
        <div className="flex gap-2 mb-5">
          {(Object.entries(TYPE_CONFIG) as [string, typeof TYPE_CONFIG.bug][]).map(([key, cfg]) => {
            const Icon = cfg.icon;
            const active = type === key;
            return (
              <button
                key={key}
                onClick={() => setType(key as 'bug' | 'feature' | 'question')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${active ? 'bg-white border-2 shadow-sm' : 'bg-transparent border-2 border-transparent hover:bg-white/50'}`}
                style={active ? { borderColor: cfg.color, color: cfg.color } : { color: 'hsl(20 25% 12% / 0.5)' }}
              >
                <Icon className="h-4 w-4" />
                {cfg.label}
              </button>
            );
          })}
        </div>

        {/* Form */}
        <div className="rounded-xl bg-white border border-[hsl(30_18%_82%)] p-5 mb-8 space-y-4">
          <div>
            <Label className="text-sm text-[hsl(20_25%_12%)]">Title</Label>
            <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Brief description of the issue or idea" className="mt-1" />
          </div>
          <div>
            <Label className="text-sm text-[hsl(20_25%_12%)]">Details</Label>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="What happened? What did you expect? Any steps to reproduce?" rows={4} className="mt-1 resize-none" />
          </div>
          <Button onClick={submit} disabled={!title.trim()} className="rounded-full bg-[hsl(16_65%_48%)] text-white hover:bg-[hsl(16_65%_48%/0.85)]">
            <Send className="h-4 w-4 mr-2" /> Submit
          </Button>
        </div>

        {/* History */}
        {items.length > 0 && (
          <div>
            <h2 className="font-sans text-xs font-semibold uppercase tracking-widest text-[hsl(20_25%_12%/0.4)] mb-3">Your submissions</h2>
            <div className="space-y-3">
              {items.map(item => {
                const cfg = TYPE_CONFIG[item.type];
                const Icon = cfg.icon;
                return (
                  <div key={item.id} className="rounded-lg bg-white border border-[hsl(30_18%_82%)] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <Icon className="h-4 w-4 mt-0.5 shrink-0" style={{ color: cfg.color }} />
                        <div>
                          <p className="text-sm font-medium text-[hsl(20_25%_12%)]">{item.title}</p>
                          {item.description && <p className="text-xs text-[hsl(20_25%_12%/0.55)] mt-1 line-clamp-2">{item.description}</p>}
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-[10px]" style={{ borderColor: cfg.color, color: cfg.color }}>{cfg.label}</Badge>
                            <span className="text-[10px] text-[hsl(20_25%_12%/0.35)]">{new Date(item.created_at).toLocaleDateString()}</span>
                            {item.status === 'submitted' && <span className="flex items-center gap-1 text-[10px] text-[hsl(38_80%_50%)]"><Clock className="h-3 w-3" />Submitted</span>}
                            {item.status === 'acknowledged' && <span className="flex items-center gap-1 text-[10px] text-[hsl(152_40%_28%)]"><CheckCircle2 className="h-3 w-3" />Acknowledged</span>}
                          </div>
                        </div>
                      </div>
                      <button onClick={() => remove(item.id)} className="p-1 rounded hover:bg-[hsl(30_18%_82%/0.5)] text-[hsl(20_25%_12%/0.3)] hover:text-[hsl(0_50%_45%)] transition-colors">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
