/**
 * PersonDetail Page
 *
 * Full profile view for a single stakeholder: bio, trust level, linked places,
 * related commitments, field notes, and tags.
 */

import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, NotebookPen, Handshake, Tag, Pencil } from 'lucide-react';
import { useTransitusData } from '@/contexts/TransitusDataContext';
import { findByIdOrSlug } from '@/lib/slugify';
import { ROLE_LABELS, COMMITMENT_STATUS_LABELS } from '@/types/transitus';
import type { TransitusRole, CommitmentStatus, FieldNoteType } from '@/types/transitus';

// ── Helpers ──

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ── Trust level visual ──

const TRUST_CONFIG: Record<string, { color: string; bg: string; label: string; width: string }> = {
  new: { color: 'text-gray-600', bg: 'bg-gray-200', label: 'New', width: 'w-1/4' },
  building: { color: 'text-amber-700', bg: 'bg-amber-200', label: 'Building', width: 'w-2/4' },
  established: { color: 'text-green-700', bg: 'bg-green-200', label: 'Established', width: 'w-3/4' },
  deep: { color: 'text-emerald-800', bg: 'bg-emerald-300', label: 'Deep', width: 'w-full' },
};

function TrustIndicator({ level }: { level?: string }) {
  if (!level) return null;
  const config = TRUST_CONFIG[level] ?? TRUST_CONFIG.new;
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-[hsl(30_10%_50%)]">
          Trust Level
        </span>
        <span className={`text-xs font-medium ${config.color}`}>{config.label}</span>
      </div>
      <div className="h-2 w-full rounded-full bg-gray-100">
        <div className={`h-2 rounded-full ${config.bg} ${config.width} transition-all`} />
      </div>
    </div>
  );
}

// ── Role badge ──

const ROLE_COLORS: Record<TransitusRole, string> = {
  steward: 'bg-indigo-100 text-indigo-700',
  field_companion: 'bg-teal-100 text-teal-700',
  listener: 'bg-violet-100 text-violet-700',
  convener: 'bg-sky-100 text-sky-700',
  analyst: 'bg-slate-100 text-slate-700',
  sponsor: 'bg-amber-100 text-amber-700',
  resident_witness: 'bg-rose-100 text-rose-700',
};

function RoleBadge({ role }: { role: TransitusRole }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${ROLE_COLORS[role]}`}>
      {ROLE_LABELS[role]}
    </span>
  );
}

// ── Commitment status badge ──

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

// ── Field note type labels ──

const FIELD_NOTE_TYPE_LABELS: Record<FieldNoteType, string> = {
  site_visit: 'Site Visit',
  listening_session: 'Listening Session',
  community_meeting: 'Community Meeting',
  prayer_vigil: 'Prayer Vigil',
  utility_meeting: 'Utility Meeting',
  household_interview: 'Household Interview',
  corridor_observation: 'Corridor Observation',
  quick_note: 'Quick Note',
};

// ── Main page ──

export default function PersonDetail() {
  const { id } = useParams<{ id: string }>();
  const { stakeholders, organizations, places, commitments, fieldNotes } = useTransitusData();

  const stakeholder = findByIdOrSlug(stakeholders, id || '');

  const orgNameById = (orgId?: string): string | undefined => {
    if (!orgId) return undefined;
    const org = organizations.find((o) => o.id === orgId);
    return org?.name;
  };

  const placeNameById = (placeId: string): string => {
    const place = places.find((p) => p.id === placeId);
    return place ? place.name : placeId;
  };

  if (!stakeholder) {
    return (
      <div className="min-h-screen bg-[hsl(38_30%_95%)]">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            to="/app/people"
            className="inline-flex items-center gap-1.5 text-sm text-[hsl(16_65%_48%)] hover:text-[hsl(16_65%_38%)] transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to directory
          </Link>
          <p className="text-sm text-[hsl(30_10%_45%)] italic">Stakeholder not found.</p>
        </div>
      </div>
    );
  }

  const orgName = orgNameById(stakeholder.organization_id);

  // Related commitments: commitments whose place_ids overlap with stakeholder's place_ids
  const relatedCommitments = commitments.filter((c) =>
    c.place_ids.some((pid) => stakeholder.place_ids.includes(pid)),
  );

  // Related field notes: notes where author_id matches
  const relatedFieldNotes = fieldNotes.filter(
    (fn) => fn.author_id === stakeholder.id,
  );

  return (
    <div className="min-h-screen bg-[hsl(38_30%_95%)]">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          to="/app/people"
          className="inline-flex items-center gap-1.5 text-sm text-[hsl(16_65%_48%)] hover:text-[hsl(16_65%_38%)] transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to directory
        </Link>

        {/* Header card */}
        <div className="rounded-lg bg-white p-6 border border-[hsl(30_18%_82%)] mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="font-serif text-3xl tracking-tight text-[hsl(20_28%_15%)]">
                {stakeholder.name}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <RoleBadge role={stakeholder.role} />
                {orgName && (
                  <span className="text-sm text-[hsl(30_10%_45%)]">{orgName}</span>
                )}
              </div>
              {stakeholder.title && (
                <p className="mt-1 text-sm text-[hsl(30_10%_40%)]">{stakeholder.title}</p>
              )}
            </div>
            {/* Edit placeholder button */}
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full border border-[hsl(16_65%_48%)] px-4 py-2 text-sm font-medium text-[hsl(16_65%_48%)] hover:bg-[hsl(16_65%_48%)] hover:text-white transition-colors self-start"
              onClick={() => { /* placeholder for edit form */ }}
            >
              <Pencil className="h-4 w-4" />
              Edit
            </button>
          </div>

          {stakeholder.bio && (
            <p className="text-sm leading-relaxed text-[hsl(30_10%_35%)] mb-4">
              {stakeholder.bio}
            </p>
          )}

          {/* Trust indicator */}
          <div className="max-w-xs mb-4">
            <TrustIndicator level={stakeholder.trust_level} />
          </div>

          {/* Last contact */}
          {stakeholder.last_contact && (
            <p className="text-xs text-[hsl(30_10%_50%)]">
              Last contact: {formatDate(stakeholder.last_contact)}
            </p>
          )}
        </div>

        {/* Linked places */}
        {stakeholder.place_ids.length > 0 && (
          <div className="rounded-lg bg-white p-4 border border-[hsl(30_18%_82%)] mb-6">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-4 w-4 text-[hsl(16_65%_48%)]" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[hsl(16_65%_48%)]">
                Linked Places
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {stakeholder.place_ids.map((pid) => (
                <Link
                  key={pid}
                  to={`/app/places/${placeSlug(places, pid)}`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[hsl(152_30%_92%)] px-3 py-1 text-xs font-medium text-[hsl(152_45%_30%)] hover:bg-[hsl(152_30%_86%)] transition-colors"
                >
                  <MapPin className="h-3 w-3" />
                  {placeNameById(pid)}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Related Commitments */}
        {relatedCommitments.length > 0 && (
          <div className="rounded-lg bg-white p-4 border border-[hsl(30_18%_82%)] mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Handshake className="h-4 w-4 text-[hsl(16_65%_48%)]" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[hsl(16_65%_48%)]">
                Related Commitments
              </span>
            </div>
            <div className="space-y-2">
              {relatedCommitments.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between gap-3 rounded-md border border-[hsl(30_18%_88%)] px-3 py-2"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[hsl(20_10%_20%)] truncate">
                      {c.title}
                    </p>
                    <p className="text-xs text-[hsl(30_10%_50%)] mt-0.5 flex items-center gap-1">
                      <MapPin className="h-2.5 w-2.5" />
                      {c.place_ids.map((pid) => placeNameById(pid)).join(', ')}
                    </p>
                  </div>
                  <span className={`shrink-0 inline-block rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_CLASSES[c.status]}`}>
                    {COMMITMENT_STATUS_LABELS[c.status]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Field Notes */}
        {relatedFieldNotes.length > 0 && (
          <div className="rounded-lg bg-white p-4 border border-[hsl(30_18%_82%)] mb-6">
            <div className="flex items-center gap-2 mb-3">
              <NotebookPen className="h-4 w-4 text-[hsl(16_65%_48%)]" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[hsl(16_65%_48%)]">
                Field Notes
              </span>
            </div>
            <div className="space-y-3">
              {relatedFieldNotes.map((fn) => (
                <div
                  key={fn.id}
                  className="rounded-md border border-[hsl(30_18%_88%)] p-3"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center rounded-full bg-[hsl(30_20%_92%)] px-2 py-0.5 text-[10px] font-medium text-[hsl(20_10%_40%)]">
                      {FIELD_NOTE_TYPE_LABELS[fn.note_type]}
                    </span>
                    <span className="text-[10px] text-[hsl(20_8%_52%)] flex items-center gap-1">
                      <MapPin className="h-2.5 w-2.5" />
                      {placeNameById(fn.place_id)}
                    </span>
                    <span className="ml-auto text-[10px] text-[hsl(20_8%_52%)]">
                      {formatDate(fn.created_at)}
                    </span>
                  </div>
                  <p className="text-sm text-[hsl(20_10%_25%)] leading-relaxed line-clamp-3">
                    {fn.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {stakeholder.tags.length > 0 && (
          <div className="rounded-lg bg-white p-4 border border-[hsl(30_18%_82%)] mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="h-4 w-4 text-[hsl(16_65%_48%)]" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[hsl(16_65%_48%)]">
                Tags
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {stakeholder.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block rounded-full bg-[hsl(30_18%_90%)] px-2.5 py-0.5 text-[11px] font-medium text-[hsl(30_18%_40%)]"
                >
                  {tag.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
