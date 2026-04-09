/**
 * Library — knowledge base view
 *
 * Frameworks, templates, case studies, playbooks, and readings
 * grouped by category with optional formation track filtering.
 */

import { useState } from 'react';
import { Library as LibraryIcon } from 'lucide-react';

import { MOCK_LIBRARY } from '@/lib/mockData';
import { useTransitusData } from '@/contexts/TransitusDataContext';
import type { LibraryItem, LibraryCategory, FormationTrack } from '@/types/transitus';

// ── Helpers ──

const CATEGORY_LABELS: Record<LibraryCategory, string> = {
  just_transition: 'Just Transition',
  environmental_justice: 'Environmental Justice',
  stakeholder_engagement: 'Stakeholder Engagement',
  community_benefits: 'Community Benefits',
  labor_standards: 'Labor Standards',
  fiduciary_stewardship: 'Fiduciary Stewardship',
  faith_rooted: 'Faith-Rooted',
};

const FORMATION_TRACK_LABELS: Record<FormationTrack, string> = {
  beginner: 'Beginner',
  organizer: 'Organizer',
  investor: 'Investor',
  faith_rooted_leader: 'Faith-Rooted Leader',
  coalition_convener: 'Coalition Convener',
};

const FORMATION_TRACK_COLORS: Record<FormationTrack, string> = {
  beginner: 'bg-sky-100 text-sky-700',
  organizer: 'bg-emerald-100 text-emerald-700',
  investor: 'bg-amber-100 text-amber-700',
  faith_rooted_leader: 'bg-violet-100 text-violet-700',
  coalition_convener: 'bg-teal-100 text-teal-700',
};

const ITEM_TYPE_LABELS: Record<LibraryItem['item_type'], string> = {
  framework: 'Framework',
  template: 'Template',
  case_study: 'Case Study',
  glossary_entry: 'Glossary',
  playbook: 'Playbook',
  reading: 'Reading',
};

// ── Components ──

function LibraryItemCard({ item }: { item: LibraryItem }) {
  return (
    <div className="rounded-lg bg-white p-4 border border-[hsl(30_18%_82%)]">
      {/* Badge row */}
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <span className="inline-flex items-center rounded-full bg-[hsl(30_20%_92%)] px-2 py-0.5 text-[10px] font-medium text-[hsl(20_10%_40%)]">
          {ITEM_TYPE_LABELS[item.item_type]}
        </span>
        {item.formation_track && (
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${FORMATION_TRACK_COLORS[item.formation_track]}`}
          >
            {FORMATION_TRACK_LABELS[item.formation_track]}
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold text-[hsl(20_10%_20%)] mb-1">
        {item.title}
      </h3>

      {/* Description */}
      <p className="text-xs leading-relaxed text-[hsl(20_8%_42%)] mb-3">
        {item.description}
      </p>

      {/* Tags */}
      {item.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full bg-[hsl(38_30%_92%)] px-2 py-0.5 text-[10px] font-medium text-[hsl(20_10%_45%)]"
            >
              {tag.replace(/_/g, ' ')}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main page ──

export default function AppLibrary() {
  const [categoryFilter, setCategoryFilter] = useState<LibraryCategory | null>(null);
  const [trackFilter, setTrackFilter] = useState<FormationTrack | null>(null);

  const allCategories = Array.from(
    new Set(MOCK_LIBRARY.map((item) => item.category)),
  ) as LibraryCategory[];

  const allTracks = Array.from(
    new Set(MOCK_LIBRARY.map((item) => item.formation_track).filter(Boolean)),
  ) as FormationTrack[];

  const filtered = MOCK_LIBRARY.filter((item) => {
    if (categoryFilter && item.category !== categoryFilter) return false;
    if (trackFilter && item.formation_track !== trackFilter) return false;
    return true;
  });

  // Group filtered items by category
  const grouped = filtered.reduce<Record<string, LibraryItem[]>>((acc, item) => {
    const key = item.category;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  const groupedEntries = Object.entries(grouped) as [LibraryCategory, LibraryItem[]][];

  return (
    <div className="min-h-screen bg-[hsl(38_30%_95%)]">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex items-center gap-2 mb-1">
          <LibraryIcon className="h-4 w-4 text-[hsl(16_65%_48%)]" />
          <span className="font-sans text-xs font-semibold uppercase tracking-widest text-[hsl(16_65%_48%)]">
            Library
          </span>
        </div>
        <h1 className="font-serif text-3xl tracking-tight text-[hsl(20_28%_15%)] mb-2">
          Library
        </h1>
        <p className="text-sm leading-relaxed text-[hsl(30_10%_40%)] max-w-2xl mb-6">
          Frameworks, templates, case studies, and readings for Just Transition
          work. Curated for formation and practice.
        </p>

        {/* Filters */}
        <div className="space-y-4 mb-8">
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

          {/* Formation track filter */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[hsl(30_10%_55%)] mb-2">
              Formation Track
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setTrackFilter(null)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all border ${
                  trackFilter === null
                    ? 'border-[hsl(16_65%_48%)] bg-[hsl(16_65%_48%)] text-white'
                    : 'border-[hsl(30_18%_82%)] bg-white text-[hsl(20_10%_40%)] hover:border-[hsl(16_65%_48%)]'
                }`}
              >
                All
              </button>
              {allTracks.map((track) => (
                <button
                  key={track}
                  type="button"
                  onClick={() => setTrackFilter(trackFilter === track ? null : track)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-all border ${
                    trackFilter === track
                      ? 'border-[hsl(16_65%_48%)] bg-[hsl(16_65%_48%)] text-white'
                      : 'border-[hsl(30_18%_82%)] bg-white text-[hsl(20_10%_40%)] hover:border-[hsl(16_65%_48%)]'
                  }`}
                >
                  {FORMATION_TRACK_LABELS[track]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Library items grouped by category */}
        {groupedEntries.length > 0 ? (
          <div className="space-y-8">
            {groupedEntries.map(([category, items]) => (
              <div key={category}>
                <h2 className="text-xs font-semibold uppercase tracking-widest text-[hsl(30_10%_50%)] mb-3">
                  {CATEGORY_LABELS[category]}
                </h2>
                <div className="flex flex-col gap-3">
                  {items.map((item) => (
                    <LibraryItemCard key={item.id} item={item} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[hsl(20_8%_52%)] italic">
            No library items match the current filters.
          </p>
        )}
      </div>
    </div>
  );
}
