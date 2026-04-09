/**
 * Signals — feed view
 *
 * News, regulatory filings, funding opportunities, and community reports
 * surfaced from external sources and tagged to relevant places.
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { slugify, placeSlug } from '@/lib/slugify';
import { Radio, MapPin, ExternalLink, Eye, EyeOff, CheckCheck } from 'lucide-react';

import { useTransitusData } from '@/contexts/TransitusDataContext';
import { SIGNAL_SOURCE_LABELS } from '@/types/transitus';
import type { Signal, SignalSource, SignalCategory } from '@/types/transitus';

// ── Helpers ──

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const CATEGORY_LABELS: Record<SignalCategory, string> = {
  permit_filing: 'Permit Filing',
  enforcement_action: 'Enforcement Action',
  hearing_notice: 'Hearing Notice',
  climate_alert: 'Climate Alert',
  funding_opportunity: 'Funding Opportunity',
  policy_change: 'Policy Change',
  community_report: 'Community Report',
  job_announcement: 'Job Announcement',
  project_update: 'Project Update',
};

const CATEGORY_COLORS: Record<SignalCategory, string> = {
  permit_filing: 'bg-slate-100 text-slate-700',
  enforcement_action: 'bg-red-100 text-red-700',
  hearing_notice: 'bg-amber-100 text-amber-700',
  climate_alert: 'bg-orange-100 text-orange-700',
  funding_opportunity: 'bg-emerald-100 text-emerald-700',
  policy_change: 'bg-blue-100 text-blue-700',
  community_report: 'bg-violet-100 text-violet-700',
  job_announcement: 'bg-teal-100 text-teal-700',
  project_update: 'bg-sky-100 text-sky-700',
};

function severityDot(severity?: Signal['severity']): string {
  switch (severity) {
    case 'urgent':
      return 'bg-[hsl(0_72%_51%)]';
    case 'notable':
      return 'bg-[hsl(36_77%_49%)]';
    default:
      return 'bg-[hsl(210_10%_58%)]';
  }
}

function severityLabel(severity?: Signal['severity']): string {
  switch (severity) {
    case 'urgent':
      return 'Urgent';
    case 'notable':
      return 'Notable';
    default:
      return 'Informational';
  }
}

// ── Components ──

function SignalCard({ signal, isRead, placeName, onToggleRead, places }: { signal: Signal; isRead: boolean; placeName: (id: string) => string; onToggleRead: () => void; places: { id: string; population_estimate?: number }[] }) {
  return (
    <div
      className={`rounded-lg bg-white p-4 border border-[hsl(30_18%_82%)] transition-shadow hover:shadow-md ${
        !isRead ? 'border-l-4 border-l-[hsl(16_65%_48%)]' : 'opacity-75'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Severity dot */}
        <span
          className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${severityDot(signal.severity)}`}
          title={severityLabel(signal.severity)}
        />

        <div className="min-w-0 flex-1">
          {/* Title */}
          <h3 className="text-sm font-medium text-[hsl(20_10%_20%)] leading-snug">
            {signal.title}
          </h3>

          {/* Summary */}
          <p className="mt-1 text-xs text-[hsl(20_8%_42%)] leading-relaxed">
            {signal.summary}
          </p>

          {/* Who's affected */}
          {(() => {
            const affectedPlaces = signal.place_ids.map(pid => places.find(p => p.id === pid)).filter(Boolean);
            const totalPop = affectedPlaces.reduce((sum, p) => sum + (p?.population_estimate || 0), 0);
            return totalPop > 0 ? (
              <p className="text-[10px] text-[hsl(16_65%_48%/0.7)] mt-1.5">
                Affects communities of {totalPop.toLocaleString()} residents
              </p>
            ) : null;
          })()}

          {/* Badges row */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-[hsl(30_20%_92%)] px-2 py-0.5 text-[10px] font-medium text-[hsl(20_10%_40%)]">
              {SIGNAL_SOURCE_LABELS[signal.source]}
            </span>
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${CATEGORY_COLORS[signal.category]}`}
            >
              {CATEGORY_LABELS[signal.category]}
            </span>
            {signal.url && (
              <a
                href={signal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[10px] text-[hsl(16_65%_48%)] hover:text-[hsl(16_65%_38%)] transition-colors"
              >
                <ExternalLink className="h-2.5 w-2.5" />
                Source
              </a>
            )}
            {/* Mark read/unread toggle */}
            <button
              type="button"
              onClick={onToggleRead}
              className="ml-auto inline-flex items-center gap-1 text-[10px] text-[hsl(20_8%_52%)] hover:text-[hsl(16_65%_48%)] transition-colors"
              title={isRead ? 'Mark as unread' : 'Mark as read'}
            >
              {isRead ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
              {isRead ? 'Unread' : 'Read'}
            </button>
          </div>

          {/* Places and date */}
          <div className="mt-2 flex flex-wrap items-center gap-3 text-[10px] text-[hsl(20_8%_52%)]">
            {signal.place_ids.map((pid) => (
              <Link
                key={pid}
                to={`/app/places/${placeSlug(places, pid)}`}
                className="flex items-center gap-1 hover:text-[hsl(16_65%_48%)] transition-colors"
              >
                <MapPin className="h-2.5 w-2.5" />
                {placeName(pid)}
              </Link>
            ))}
            <span className="ml-auto">{formatDate(signal.published_at)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main page ──

export default function Signals() {
  const { signals, places, markSignalRead, markSignalUnread, markAllSignalsRead, isSignalRead } = useTransitusData();
  const [sourceFilter, setSourceFilter] = useState<SignalSource | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<SignalCategory | null>(null);
  const [severityFilter, setSeverityFilter] = useState<Signal['severity'] | null>(null);

  const getPlaceName = (placeId: string): string => {
    const p = places.find((pl) => pl.id === placeId);
    return p ? p.name : placeId;
  };

  const allSources = Array.from(new Set(signals.map((s) => s.source))) as SignalSource[];
  const allCategories = Array.from(new Set(signals.map((s) => s.category))) as SignalCategory[];
  const severities: Signal['severity'][] = ['urgent', 'notable', 'informational'];

  const filtered = signals.filter((s) => {
    if (sourceFilter && s.source !== sourceFilter) return false;
    if (categoryFilter && s.category !== categoryFilter) return false;
    if (severityFilter && (s.severity ?? 'informational') !== severityFilter) return false;
    return true;
  }).sort(
    (a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime(),
  );

  const unreadCount = filtered.filter((s) => !isSignalRead(s.id)).length;

  return (
    <div className="min-h-screen bg-[hsl(38_30%_95%)]">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Radio className="h-4 w-4 text-[hsl(16_65%_48%)]" />
            <span className="font-sans text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
              Signals
            </span>
          </div>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllSignalsRead}
              className="inline-flex items-center gap-1.5 rounded-full bg-[hsl(16_65%_48%)] px-4 py-2 text-sm font-medium text-white hover:bg-[hsl(12_55%_35%)] transition-colors"
            >
              <CheckCheck className="h-4 w-4" />
              Mark all read
            </button>
          )}
        </div>
        <h1 className="font-serif text-3xl tracking-tight text-[hsl(20_28%_15%)] mb-2">
          Signals
        </h1>
        <p className="text-sm leading-relaxed text-[hsl(30_10%_40%)] max-w-2xl mb-1">
          Regulatory filings, funding opportunities, community reports, and news
          relevant to your tracked places.
        </p>
        {unreadCount > 0 && (
          <p className="text-xs font-medium text-[hsl(16_65%_48%)] mb-6">
            {unreadCount} unread signal{unreadCount !== 1 ? 's' : ''}
          </p>
        )}

        {/* Filters */}
        <div className="space-y-4 mb-8">
          {/* Source filter */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[hsl(30_10%_55%)] mb-2">
              Source
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSourceFilter(null)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all border ${
                  sourceFilter === null
                    ? 'border-[hsl(16_65%_48%)] bg-[hsl(16_65%_48%)] text-white'
                    : 'border-[hsl(30_18%_82%)] bg-white text-[hsl(20_10%_40%)] hover:border-[hsl(16_65%_48%)]'
                }`}
              >
                All
              </button>
              {allSources.map((src) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setSourceFilter(sourceFilter === src ? null : src)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-all border ${
                    sourceFilter === src
                      ? 'border-[hsl(16_65%_48%)] bg-[hsl(16_65%_48%)] text-white'
                      : 'border-[hsl(30_18%_82%)] bg-white text-[hsl(20_10%_40%)] hover:border-[hsl(16_65%_48%)]'
                  }`}
                >
                  {SIGNAL_SOURCE_LABELS[src]}
                </button>
              ))}
            </div>
          </div>

          {/* Category filter */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[hsl(30_10%_55%)] mb-2">
              Category
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setCategoryFilter(null)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all border ${
                  categoryFilter === null
                    ? 'border-[hsl(16_65%_48%)] bg-[hsl(16_65%_48%)] text-white'
                    : 'border-[hsl(30_18%_82%)] bg-white text-[hsl(20_10%_40%)] hover:border-[hsl(16_65%_48%)]'
                }`}
              >
                All
              </button>
              {allCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(categoryFilter === cat ? null : cat)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-all border ${
                    categoryFilter === cat
                      ? 'border-[hsl(16_65%_48%)] bg-[hsl(16_65%_48%)] text-white'
                      : 'border-[hsl(30_18%_82%)] bg-white text-[hsl(20_10%_40%)] hover:border-[hsl(16_65%_48%)]'
                  }`}
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>
          </div>

          {/* Severity filter */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[hsl(30_10%_55%)] mb-2">
              Severity
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSeverityFilter(null)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all border ${
                  severityFilter === null
                    ? 'border-[hsl(16_65%_48%)] bg-[hsl(16_65%_48%)] text-white'
                    : 'border-[hsl(30_18%_82%)] bg-white text-[hsl(20_10%_40%)] hover:border-[hsl(16_65%_48%)]'
                }`}
              >
                All
              </button>
              {severities.map((sev) => (
                <button
                  key={sev}
                  type="button"
                  onClick={() => setSeverityFilter(severityFilter === sev ? null : sev)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-all border flex items-center gap-1.5 ${
                    severityFilter === sev
                      ? 'border-[hsl(16_65%_48%)] bg-[hsl(16_65%_48%)] text-white'
                      : 'border-[hsl(30_18%_82%)] bg-white text-[hsl(20_10%_40%)] hover:border-[hsl(16_65%_48%)]'
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      severityFilter === sev ? 'bg-white' : severityDot(sev)
                    }`}
                  />
                  {severityLabel(sev)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Signal feed */}
        <div className="flex flex-col gap-3">
          {filtered.map((signal) => (
            <SignalCard
              key={signal.id}
              signal={signal}
              isRead={isSignalRead(signal.id)}
              placeName={getPlaceName}
              places={places}
              onToggleRead={() => {
                if (isSignalRead(signal.id)) {
                  markSignalUnread(signal.id);
                } else {
                  markSignalRead(signal.id);
                }
              }}
            />
          ))}
          {filtered.length === 0 && (
            <p className="text-sm text-[hsl(20_8%_52%)] italic">
              No signals match the current filters.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
