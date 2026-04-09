/**
 * People (Stakeholder Directory) Page
 *
 * Filterable, searchable grid of all stakeholders in the Transitus workspace.
 * Each card links to a full PersonDetail view.
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Users, Search, Filter, MapPin, Plus } from 'lucide-react';
import { useTransitusData } from '@/contexts/TransitusDataContext';
import { CreateStakeholderForm } from '@/components/forms/CreateStakeholderForm';
import { CreateOrganizationForm } from '@/components/forms/CreateOrganizationForm';
import { ROLE_LABELS } from '@/types/transitus';
import type { Stakeholder, TransitusRole } from '@/types/transitus';

// ── Helpers ──

function formatDate(iso?: string): string {
  if (!iso) return 'N/A';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ── Trust level indicator ──

const TRUST_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  new: { bg: 'bg-gray-200', text: 'text-gray-600', label: 'New' },
  building: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Building' },
  established: { bg: 'bg-green-100', text: 'text-green-700', label: 'Established' },
  deep: { bg: 'bg-emerald-200', text: 'text-emerald-800', label: 'Deep' },
};

function TrustBadge({ level }: { level?: string }) {
  if (!level) return null;
  const style = TRUST_STYLES[level] ?? TRUST_STYLES.new;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${style.bg} ${style.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${style.text === 'text-gray-600' ? 'bg-gray-400' : style.text === 'text-amber-700' ? 'bg-amber-500' : style.text === 'text-green-700' ? 'bg-green-500' : 'bg-emerald-600'}`} />
      {style.label}
    </span>
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
    <span className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-medium leading-tight ${ROLE_COLORS[role]}`}>
      {ROLE_LABELS[role]}
    </span>
  );
}

// ── Stakeholder Card ──

function StakeholderCard({ stakeholder, orgName }: { stakeholder: Stakeholder; orgName?: string }) {
  return (
    <Link
      to={`/app/people/${stakeholder.id}`}
      className="block rounded-lg bg-white p-4 border border-[hsl(30_18%_82%)] hover:border-[hsl(30_18%_70%)] hover:shadow-md transition-all group"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="min-w-0 flex-1">
          <h3 className="font-serif text-lg leading-snug tracking-tight group-hover:text-[hsl(152_45%_30%)] transition-colors">
            {stakeholder.name}
          </h3>
          {stakeholder.title && (
            <p className="text-xs text-[hsl(30_10%_45%)] mt-0.5 truncate">{stakeholder.title}</p>
          )}
        </div>
        <TrustBadge level={stakeholder.trust_level} />
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-3">
        <RoleBadge role={stakeholder.role} />
        {orgName && (
          <span className="text-xs text-[hsl(30_10%_45%)] truncate max-w-[200px]">
            {orgName}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between text-[11px] text-[hsl(30_10%_50%)]">
        <span className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {stakeholder.place_ids.length} place{stakeholder.place_ids.length !== 1 ? 's' : ''}
        </span>
        <span>Last contact: {formatDate(stakeholder.last_contact)}</span>
      </div>
    </Link>
  );
}

// ── Main page ──

const ALL_ROLES = Object.keys(ROLE_LABELS) as TransitusRole[];

export default function People() {
  const { stakeholders, organizations } = useTransitusData();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRole, setActiveRole] = useState<TransitusRole | null>(null);

  const orgNameById = (orgId?: string): string | undefined => {
    if (!orgId) return undefined;
    const org = organizations.find((o) => o.id === orgId);
    return org?.name;
  };

  const filteredStakeholders = useMemo(() => {
    let results = stakeholders;

    if (activeRole) {
      results = results.filter((s) => s.role === activeRole);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter((s) => s.name.toLowerCase().includes(q));
    }

    return results;
  }, [searchQuery, activeRole, stakeholders]);

  return (
    <div className="min-h-screen bg-[hsl(38_30%_95%)]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-[hsl(16_65%_48%)]" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[hsl(16_65%_48%)]">
                Stakeholder Directory
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <CreateStakeholderForm
                trigger={
                  <button className="inline-flex items-center gap-1.5 rounded-full bg-[hsl(16_65%_48%)] px-4 py-2 text-sm font-medium text-white hover:bg-[hsl(12_55%_35%)] transition-colors">
                    <Plus className="h-4 w-4" />
                    New Person
                  </button>
                }
              />
              <CreateOrganizationForm
                trigger={
                  <button className="inline-flex items-center gap-1.5 rounded-full border border-[hsl(16_65%_48%)] px-4 py-2 text-sm font-medium text-[hsl(16_65%_48%)] hover:bg-[hsl(16_65%_48%)] hover:text-white transition-colors">
                    <Plus className="h-4 w-4" />
                    New Organization
                  </button>
                }
              />
            </div>
          </div>
          <h1 className="font-serif text-3xl tracking-tight text-[hsl(20_28%_15%)]">
            People &amp; Organizations
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-[hsl(30_10%_40%)] max-w-2xl">
            The people at the center of transition work: community leaders, field companions,
            listeners, investors, and the residents whose testimony shapes the story.
          </p>
        </div>

        {/* Search bar */}
        <div className="mb-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(30_10%_55%)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name..."
              className="w-full rounded-lg border border-[hsl(30_18%_82%)] bg-white py-2 pl-10 pr-4 text-sm text-[hsl(20_10%_20%)] placeholder:text-[hsl(30_10%_60%)] focus:border-[hsl(16_65%_48%)] focus:outline-none focus:ring-1 focus:ring-[hsl(16_65%_48%)]"
            />
          </div>
        </div>

        {/* Role filter badges */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Filter className="h-3.5 w-3.5 text-[hsl(30_10%_50%)]" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[hsl(30_10%_50%)]">
              Filter by role
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveRole(null)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                activeRole === null
                  ? 'bg-[hsl(16_65%_48%)] text-white'
                  : 'bg-[hsl(30_18%_90%)] text-[hsl(30_18%_40%)] hover:bg-[hsl(30_18%_85%)]'
              }`}
            >
              All ({stakeholders.length})
            </button>
            {ALL_ROLES.map((role) => {
              const count = stakeholders.filter((s) => s.role === role).length;
              if (count === 0) return null;
              return (
                <button
                  key={role}
                  onClick={() => setActiveRole(activeRole === role ? null : role)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    activeRole === role
                      ? 'bg-[hsl(16_65%_48%)] text-white'
                      : 'bg-[hsl(30_18%_90%)] text-[hsl(30_18%_40%)] hover:bg-[hsl(30_18%_85%)]'
                  }`}
                >
                  {ROLE_LABELS[role]} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Results count */}
        <p className="mb-4 text-xs text-[hsl(30_10%_50%)]">
          Showing {filteredStakeholders.length} of {stakeholders.length} stakeholders
        </p>

        {/* Stakeholder cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStakeholders.map((s) => (
            <StakeholderCard key={s.id} stakeholder={s} orgName={orgNameById(s.organization_id)} />
          ))}
        </div>

        {filteredStakeholders.length === 0 && (
          <div className="mt-8 text-center">
            <p className="text-sm text-[hsl(30_10%_50%)] italic">
              No stakeholders match your current filters.
            </p>
          </div>
        )}
      </div>

      {/* Mobile FAB */}
      <CreateStakeholderForm
        trigger={
          <button className="sm:hidden fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[hsl(16_65%_48%)] text-white shadow-lg hover:bg-[hsl(12_55%_35%)] transition-colors">
            <Plus className="h-6 w-6" />
          </button>
        }
      />
    </div>
  );
}
