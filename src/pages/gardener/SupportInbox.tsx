/**
 * Gardener Support Inbox — View and manage user feedback submissions.
 *
 * Reads from the same localStorage key as /app/feedback.
 */

import { useState, useCallback } from 'react';
import {
  Inbox, Bug, Lightbulb, MessageSquare,
  CheckCircle2, Clock, Filter,
} from 'lucide-react';

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
  bug: { label: 'Bug', icon: Bug, color: 'hsl(0 50% 45%)' },
  feature: { label: 'Feature', icon: Lightbulb, color: 'hsl(38 80% 50%)' },
  question: { label: 'Question', icon: MessageSquare, color: 'hsl(198 55% 42%)' },
};

const STATUS_CONFIG = {
  submitted: { label: 'Submitted', icon: Clock, color: 'hsl(38 80% 50%)' },
  acknowledged: { label: 'Acknowledged', icon: CheckCircle2, color: 'hsl(152 40% 28%)' },
};

function loadFeedback(): FeedbackItem[] {
  try {
    return JSON.parse(localStorage.getItem('transitus_feedback') || '[]');
  } catch { return []; }
}

function saveFeedback(items: FeedbackItem[]) {
  localStorage.setItem('transitus_feedback', JSON.stringify(items));
}

type FilterType = 'all' | 'bug' | 'feature' | 'question';

export default function GardenerSupportInbox() {
  const [items, setItems] = useState<FeedbackItem[]>(loadFeedback);
  const [filter, setFilter] = useState<FilterType>('all');

  const toggleAcknowledge = useCallback((id: string) => {
    setItems(prev => {
      const updated = prev.map(item =>
        item.id === id
          ? { ...item, status: (item.status === 'acknowledged' ? 'submitted' : 'acknowledged') as FeedbackItem['status'] }
          : item
      );
      saveFeedback(updated);
      return updated;
    });
  }, []);

  const filteredItems = filter === 'all'
    ? items
    : items.filter(item => item.type === filter);

  const submittedCount = items.filter(i => i.status === 'submitted').length;

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Inbox className="w-5 h-5 text-[hsl(16_65%_48%)]" />
          <h2 className="font-serif text-2xl text-[hsl(20_25%_12%)]">Support Inbox</h2>
        </div>
        <p className="text-sm text-[hsl(20_25%_12%/0.5)]">
          User feedback and bug reports from the app.
          {submittedCount > 0 && (
            <span className="ml-2 text-[hsl(38_80%_50%)] font-medium">
              {submittedCount} awaiting acknowledgment.
            </span>
          )}
        </p>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-[hsl(20_25%_12%/0.3)]" />
        {(['all', 'bug', 'feature', 'question'] as FilterType[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
              filter === f
                ? 'bg-[hsl(16_65%_48%/0.1)] text-[hsl(16_65%_48%)]'
                : 'text-[hsl(20_25%_12%/0.4)] hover:text-[hsl(20_25%_12%/0.7)] hover:bg-[hsl(38_30%_95%)]'
            }`}
          >
            {f === 'all' ? 'All' : TYPE_CONFIG[f].label}
            {f !== 'all' && (
              <span className="ml-1 text-[10px]">
                ({items.filter(i => i.type === f).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Feedback list */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-xl border border-[hsl(30_18%_82%)] p-8 text-center">
          <Inbox className="w-8 h-8 text-[hsl(20_25%_12%/0.15)] mx-auto mb-3" />
          <p className="text-sm text-[hsl(20_25%_12%/0.4)]">
            {items.length === 0
              ? 'No feedback submitted yet. Feedback from /app/feedback will appear here.'
              : 'No items match this filter.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .map(item => {
              const typeConf = TYPE_CONFIG[item.type];
              const statusConf = STATUS_CONFIG[item.status];
              const TypeIcon = typeConf.icon;
              const StatusIcon = statusConf.icon;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-[hsl(30_18%_82%)] p-5 hover:border-[hsl(16_65%_48%/0.2)] transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                      style={{ backgroundColor: `${typeConf.color}10` }}
                    >
                      <TypeIcon className="w-4 h-4" style={{ color: typeConf.color }} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-semibold text-[hsl(20_25%_12%)]">{item.title}</h4>
                        <span
                          className="text-[10px] px-1.5 py-0.5 rounded-full uppercase tracking-wider font-medium shrink-0"
                          style={{
                            backgroundColor: `${typeConf.color}10`,
                            color: typeConf.color,
                          }}
                        >
                          {typeConf.label}
                        </span>
                      </div>
                      <p className="text-xs text-[hsl(20_25%_12%/0.6)] leading-relaxed mb-2">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-3 text-[10px] text-[hsl(20_25%_12%/0.4)]">
                        <span>{new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        {item.page && <span>Page: {item.page}</span>}
                      </div>
                    </div>

                    <button
                      onClick={() => toggleAcknowledge(item.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                        item.status === 'acknowledged'
                          ? 'bg-[hsl(152_40%_28%/0.08)] text-[hsl(152_40%_28%)]'
                          : 'bg-[hsl(38_30%_95%)] text-[hsl(20_25%_12%/0.5)] hover:text-[hsl(152_40%_28%)] hover:bg-[hsl(152_40%_28%/0.08)]'
                      }`}
                    >
                      <StatusIcon className="w-3.5 h-3.5" />
                      {statusConf.label}
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
