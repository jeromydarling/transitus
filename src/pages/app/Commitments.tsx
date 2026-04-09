/**
 * Commitments (Commitment Tracker) Page
 *
 * Filterable overview of all tracked commitments in the Transitus workspace.
 * Each card shows status, type, linked places, context, and community interpretation.
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Handshake, Filter, MapPin, CalendarClock, MessageSquareQuote } from 'lucide-react';
import { MOCK_COMMITMENTS, MOCK_PLACES, MOCK_ORGS } from '@/lib/mockData';
import { COMMITMENT_STATUS_LABELS } from '@/types/transitus';
import type { Commitment, CommitmentStatus } from '@/types/transitus';

// ── Helpers ──

function placeNameById(id: string): string {
  const place = MOCK_PLACES.find((p) => p.id === id);
  return place ? place.name : id;
}

function orgNameById(orgId?: string): string | undefined {
  if (!orgId) return undefined;
  const org = MOCK_ORGS.find((o) => o.id === orgId);
  return org?.name;
}

function formatDate(iso?: string): string {
  if (!iso) return 'N/A';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatCommitmentType(type: string): string {
  return type
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// ── Status badge colors ──

const STATUS_CLASSES: Record<CommitmentStatus, string> = {
  proposed: 'bg-blue-100 text-blue-700',
  acknowledged: 'bg-slate-100 text-slate-700',
  accepted: 'bg-teal-100 text-teal-700',
  in_motion: 'bg-green-100 text-green-700',
  delayed: 'bg-amber-100 text-amber-700',
  breached: 'bg-red-100 text-red-700',
  repaired: 'bg-purple-100 text-purple-700',
  completed: 'bg-emerald-100 text-emerald-700',
};

function StatusBadge({ status }: { status: CommitmentStatus }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium leading-tight ${STATUS_CLASSES[status]}`}
    >
      {COMMITMENT_STATUS_LABELS[status]}
    </span>
  );
}

function TypeBadge({ type }: { type: string }) {
  return (
    <span className="inline-block rounded-full bg-[hsl(30_18%_90%)] text-[hsl(30_18%_40%)] px-2 py-0.5 text-[11px] font-medium leading-tight">
      {formatCommitmentType(type)}
    </span>
  );
}

// ── Commitment Card ──

function CommitmentCard({ commitment }: { commitment: Commitment }) {
  const madeByOrg = orgNameById(commitment.made_by_org_id);

  return (
    <div className="rounded-lg bg-white p-4 border border-[hsl(30_18%_82%)] hover:border-[hsl(30_18%_70%)] hover:shadow-md transition-all">
      {/* Header: title + status */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-serif text-lg leading-snug tracking-tight text-[hsl(20_28%_15%)]">
          {commitment.title}
        </h3>
        <StatusBadge status={commitment.status} />
      </div>

      {/* Type badge + org */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <TypeBadge type={commitment.commitment_type} />
        {madeByOrg && (
          <span className="text-xs text-[hsl(30_10%_45%)]">by {madeByOrg}</span>
        )}
      </div>

      {/* Context excerpt */}
      <p className="text-sm leading-relaxed text-[hsl(30_10%_35%)] line-clamp-2 mb-3">
        {commitment.context}
      </p>

      {/* Community interpretation */}
      {commitment.community_interpretation && (
        <div className="mb-3 rounded-md bg-[hsl(38_30%_95%)] border border-[hsl(30_18%_88%)] px-3 py-2">
          <div className="flex items-start gap-2">
            <MessageSquareQuote className="h-3.5 w-3.5 mt-0.5 shrink-0 text-[hsl(16_65%_48%)]" />
            <p className="text-xs leading-relaxed text-[hsl(30_10%_35%)] italic">
              {commitment.community_interpretation}
            </p>
          </div>
        </div>
      )}

      {/* Linked places */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {commitment.place_ids.map((pid) => (
          <Link
            key={pid}
            to={`/app/places/${pid}`}
            className="inline-flex items-center gap-1 rounded-full bg-[hsl(152_30%_92%)] px-2.5 py-0.5 text-[11px] font-medium text-[hsl(152_45%_30%)] hover:bg-[hsl(152_30%_86%)] transition-colors"
          >
            <MapPin className="h-3 w-3" />
            {placeNameById(pid)}
          </Link>
        ))}
      </div>

      {/* Renewal date */}
      {commitment.renewal_date && (
        <div className="flex items-center gap-1.5 text-[11px] text-[hsl(30_10%_50%)]">
          <CalendarClock className="h-3 w-3" />
          <span>Renewal: {formatDate(commitment.renewal_date)}</span>
        </div>
      )}
    </div>
  );
}

// ── Main page ──

const ALL_STATUSES = Object.keys(COMMITMENT_STATUS_LABELS) as CommitmentStatus[];

export default function Commitments() {
  const [activeStatus, setActiveStatus] = useState<CommitmentStatus | null>(null);

  const filteredCommitments = useMemo(() => {
    if (!activeStatus) return MOCK_COMMITMENTS;
    return MOCK_COMMITMENTS.filter((c) => c.status === activeStatus);
  }, [activeStatus]);

  return (
    <div className="min-h-screen bg-[hsl(38_30%_95%)]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Handshake className="h-4 w-4 text-[hsl(16_65%_48%)]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[hsl(16_65%_48%)]">
              Commitment Tracker
            </span>
          </div>
          <h1 className="font-serif text-3xl tracking-tight text-[hsl(20_28%_15%)]">
            Commitments
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-[hsl(30_10%_40%)] max-w-2xl">
            Promises made to communities: public pledges, legal agreements, community benefit
            agreements, and institutional commitments. Tracked from proposal through completion
            — with the community's interpretation alongside the official record.
          </p>
        </div>

        {/* Status filter badges */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Filter className="h-3.5 w-3.5 text-[hsl(30_10%_50%)]" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[hsl(30_10%_50%)]">
              Filter by status
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveStatus(null)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                activeStatus === null
                  ? 'bg-[hsl(16_65%_48%)] text-white'
                  : 'bg-[hsl(30_18%_90%)] text-[hsl(30_18%_40%)] hover:bg-[hsl(30_18%_85%)]'
              }`}
            >
              All ({MOCK_COMMITMENTS.length})
            </button>
            {ALL_STATUSES.map((status) => {
              const count = MOCK_COMMITMENTS.filter((c) => c.status === status).length;
              if (count === 0) return null;
              return (
                <button
                  key={status}
                  onClick={() => setActiveStatus(activeStatus === status ? null : status)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    activeStatus === status
                      ? 'bg-[hsl(16_65%_48%)] text-white'
                      : 'bg-[hsl(30_18%_90%)] text-[hsl(30_18%_40%)] hover:bg-[hsl(30_18%_85%)]'
                  }`}
                >
                  {COMMITMENT_STATUS_LABELS[status]} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Results count */}
        <p className="mb-4 text-xs text-[hsl(30_10%_50%)]">
          Showing {filteredCommitments.length} of {MOCK_COMMITMENTS.length} commitments
        </p>

        {/* Commitment cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCommitments.map((c) => (
            <CommitmentCard key={c.id} commitment={c} />
          ))}
        </div>

        {filteredCommitments.length === 0 && (
          <div className="mt-8 text-center">
            <p className="text-sm text-[hsl(30_10%_50%)] italic">
              No commitments match the selected status filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
