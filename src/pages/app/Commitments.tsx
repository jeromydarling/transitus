/**
 * Commitments (Commitment Tracker) Page
 *
 * Filterable overview of all tracked commitments in the Transitus workspace.
 * Each card shows status, type, linked places, context, and community interpretation.
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { slugify, placeSlug } from '@/lib/slugify';
import { Handshake, Filter, MapPin, CalendarClock, MessageSquareQuote, Plus } from 'lucide-react';
import { useTransitusData } from '@/contexts/TransitusDataContext';
import { CreateCommitmentForm } from '@/components/forms/CreateCommitmentForm';
import { EditCommitmentStatusForm } from '@/components/forms/EditCommitmentStatusForm';
import { COMMITMENT_STATUS_LABELS } from '@/types/transitus';
import type { Commitment, CommitmentStatus, Place } from '@/types/transitus';

// ── Accompaniment language for display ──

const ACCOMPANIMENT_STATUS: Record<CommitmentStatus, string> = {
  delayed: 'Conversation needed',
  breached: 'Repair ready',
  in_motion: 'Being honored',
  proposed: 'Offered',
  acknowledged: 'Received',
  accepted: 'Embraced',
  repaired: 'Restored',
  completed: 'Fulfilled',
};

// ── Helpers ──

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

function TypeBadge({ type }: { type: string }) {
  return (
    <span className="inline-block rounded-full bg-[hsl(30_18%_90%)] text-[hsl(30_18%_40%)] px-2 py-0.5 text-[11px] font-medium leading-tight">
      {formatCommitmentType(type)}
    </span>
  );
}

// ── Commitment Card ──

function CommitmentCard({ commitment, placeNameById, orgNameById, places }: { commitment: Commitment; placeNameById: (id: string) => string; orgNameById: (orgId?: string) => string | undefined; places: Place[] }) {
  const madeByOrg = orgNameById(commitment.made_by_org_id);

  return (
    <div className="rounded-lg bg-white p-4 border border-[hsl(30_18%_82%)] hover:border-[hsl(30_18%_70%)] hover:shadow-md transition-all">
      {/* Header: title + status */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-serif text-lg leading-snug tracking-tight text-[hsl(20_28%_15%)]">
          {commitment.title}
        </h3>
        <EditCommitmentStatusForm commitmentId={commitment.id} currentStatus={commitment.status} />
      </div>

      {/* Who this commitment affects */}
      {(() => {
        const affectedPlaces = commitment.place_ids.map(pid => places.find(p => p.id === pid)).filter(Boolean);
        const totalPop = affectedPlaces.reduce((sum, p) => sum + (p?.population_estimate || 0), 0);
        return totalPop > 0 ? (
          <p className="text-xs text-[hsl(16_65%_48%/0.8)] mt-1 mb-2">
            Affects {totalPop.toLocaleString()} residents
          </p>
        ) : null;
      })()}

      {/* Type badge + org */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <TypeBadge type={commitment.commitment_type} />
        {madeByOrg && (
          <span className="text-xs text-[hsl(30_10%_45%)]">by {madeByOrg}</span>
        )}
      </div>

      {/* Community interpretation (elevated above context) */}
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

      {/* Context excerpt */}
      <p className="text-sm leading-relaxed text-[hsl(30_10%_35%)] line-clamp-2 mb-3">
        {commitment.context}
      </p>

      {/* Linked places */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {commitment.place_ids.map((pid) => (
          <Link
            key={pid}
            to={`/app/places/${placeSlug(places, pid)}`}
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
  const { commitments, canCreate, places, organizations } = useTransitusData();
  const [activeStatus, setActiveStatus] = useState<CommitmentStatus | null>(null);

  const placeNameById = (id: string): string => {
    const place = places.find((p) => p.id === id);
    return place ? place.name : id;
  };

  const orgNameById = (orgId?: string): string | undefined => {
    if (!orgId) return undefined;
    const org = organizations.find((o) => o.id === orgId);
    return org?.name;
  };

  const filteredCommitments = useMemo(() => {
    if (!activeStatus) return commitments;
    return commitments.filter((c) => c.status === activeStatus);
  }, [activeStatus, commitments]);

  return (
    <div className="min-h-screen bg-[hsl(38_30%_95%)]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Handshake className="h-4 w-4 text-[hsl(16_65%_48%)]" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[hsl(16_65%_48%)]">
                Commitment Tracker
              </span>
            </div>
            <CreateCommitmentForm
              trigger={
                <button className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-[hsl(16_65%_48%)] px-4 py-2 text-sm font-medium text-white hover:bg-[hsl(12_55%_35%)] transition-colors">
                  <Plus className="h-4 w-4" />
                  New Commitment
                </button>
              }
            />
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
              All ({commitments.length})
            </button>
            {ALL_STATUSES.map((status) => {
              const count = commitments.filter((c) => c.status === status).length;
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
                  {ACCOMPANIMENT_STATUS[status]} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Results count */}
        <p className="mb-4 text-xs text-[hsl(30_10%_50%)]">
          Showing {filteredCommitments.length} of {commitments.length} commitments
        </p>

        {/* Commitment cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCommitments.map((c) => (
            <CommitmentCard key={c.id} commitment={c} placeNameById={placeNameById} orgNameById={orgNameById} places={places} />
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

      {/* Mobile FAB */}
      <CreateCommitmentForm
        trigger={
          <button className="sm:hidden fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[hsl(16_65%_48%)] text-white shadow-lg hover:bg-[hsl(12_55%_35%)] transition-colors">
            <Plus className="h-6 w-6" />
          </button>
        }
      />
    </div>
  );
}
