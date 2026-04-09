/**
 * Reports — expandable card view
 *
 * Generated reports and briefs with expandable section details.
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, MapPin, ChevronDown, ChevronRight } from 'lucide-react';

import { MOCK_REPORTS, MOCK_PLACES } from '@/lib/mockData';
import { useTransitusData } from '@/contexts/TransitusDataContext';
import type { Report, ReportType, ReportSection } from '@/types/transitus';

// ── Helpers ──

const REPORT_TYPE_LABELS: Record<ReportType, string> = {
  place_brief: 'Place Brief',
  stakeholder_engagement_log: 'Stakeholder Engagement Log',
  commitment_status: 'Commitment Status',
  quarter_in_review: 'Quarter in Review',
  community_listening_summary: 'Community Listening Summary',
  transition_readiness: 'Transition Readiness',
  ej_snapshot: 'EJ Snapshot',
  board_memo: 'Board Memo',
  investor_packet: 'Investor Packet',
  public_story: 'Public Story',
};

const SECTION_TYPE_COLORS: Record<ReportSection['type'], string> = {
  narrative: 'bg-[hsl(30_20%_92%)] text-[hsl(20_10%_40%)]',
  data: 'bg-sky-100 text-sky-700',
  testimony: 'bg-violet-100 text-violet-700',
  map: 'bg-emerald-100 text-emerald-700',
  timeline: 'bg-amber-100 text-amber-700',
  commitments: 'bg-orange-100 text-orange-700',
};

function placeName(placeId: string): string {
  const p = MOCK_PLACES.find((pl) => pl.id === placeId);
  return p ? p.name : placeId;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ── Components ──

function ReportCard({ report }: { report: Report }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-lg bg-white border border-[hsl(30_18%_82%)] transition-shadow hover:shadow-md">
      {/* Card header — clickable to expand */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-4"
      >
        {/* Badge row */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="inline-flex items-center rounded-full bg-[hsl(30_20%_92%)] px-2 py-0.5 text-[10px] font-medium text-[hsl(20_10%_40%)]">
            {REPORT_TYPE_LABELS[report.report_type]}
          </span>
          {report.place_id && (
            <span className="flex items-center gap-1 text-[10px] text-[hsl(20_8%_52%)]">
              <MapPin className="h-2.5 w-2.5" />
              {placeName(report.place_id)}
            </span>
          )}
          <span className="text-[10px] text-[hsl(20_8%_52%)] ml-auto">
            {formatDate(report.generated_at)}
          </span>
        </div>

        {/* Title */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-[hsl(20_10%_20%)]">
            {report.title}
          </h3>
          {expanded ? (
            <ChevronDown className="h-4 w-4 shrink-0 text-[hsl(20_8%_52%)]" />
          ) : (
            <ChevronRight className="h-4 w-4 shrink-0 text-[hsl(20_8%_52%)]" />
          )}
        </div>

        {/* Summary */}
        <p className="mt-1 text-xs leading-relaxed text-[hsl(20_8%_42%)]">
          {report.content_summary}
        </p>

        {/* Section count */}
        <p className="mt-2 text-[10px] text-[hsl(20_8%_52%)]">
          {report.sections.length} section{report.sections.length !== 1 ? 's' : ''}
        </p>
      </button>

      {/* Expanded sections */}
      {expanded && (
        <div className="border-t border-[hsl(30_18%_82%)] px-4 py-3 space-y-3">
          {report.sections.map((section, idx) => (
            <div key={idx} className="rounded-md bg-[hsl(38_30%_97%)] border border-[hsl(30_18%_90%)] p-3">
              {/* Section header */}
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-medium ${SECTION_TYPE_COLORS[section.type]}`}
                >
                  {section.type.replace(/_/g, ' ')}
                </span>
                <h4 className="text-xs font-semibold text-[hsl(20_10%_25%)]">
                  {section.title}
                </h4>
              </div>

              {/* Section content */}
              <p className="text-xs leading-relaxed text-[hsl(20_10%_40%)]">
                {section.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main page ──

export default function Reports() {
  const sorted = [...MOCK_REPORTS].sort(
    (a, b) => new Date(b.generated_at).getTime() - new Date(a.generated_at).getTime(),
  );

  return (
    <div className="min-h-screen bg-[hsl(38_30%_95%)]">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex items-center gap-2 mb-1">
          <FileText className="h-4 w-4 text-[hsl(16_65%_48%)]" />
          <span className="font-sans text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
            Reports
          </span>
        </div>
        <h1 className="font-serif text-3xl tracking-tight text-[hsl(20_28%_15%)] mb-2">
          Reports
        </h1>
        <p className="text-sm leading-relaxed text-[hsl(30_10%_40%)] max-w-2xl mb-8">
          Generated briefs, status reports, and narratives. Expand any report
          to view its sections.
        </p>

        {/* Report cards */}
        <div className="flex flex-col gap-4">
          {sorted.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
          {sorted.length === 0 && (
            <p className="text-sm text-[hsl(20_8%_52%)] italic">
              No reports generated yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
