/**
 * Gardener Content Studio — Library management, content gaps, and SEO health.
 */

import { useState } from 'react';
import { useTransitusData } from '@/contexts/TransitusDataContext';
import {
  BookOpen, Search, AlertTriangle, CheckCircle2,
  ExternalLink, FileText, Tag,
} from 'lucide-react';

const CATEGORY_LABELS: Record<string, string> = {
  just_transition: 'Just Transition',
  environmental_justice: 'Environmental Justice',
  stakeholder_engagement: 'Stakeholder Engagement',
  community_benefits: 'Community Benefits',
  labor_standards: 'Labor Standards',
  fiduciary_stewardship: 'Fiduciary Stewardship',
  faith_rooted: 'Faith-Rooted',
};

const ALL_CATEGORIES = Object.keys(CATEGORY_LABELS);

// Mock SEO checks
const SEO_CHECKS = [
  { label: 'Meta descriptions on all pages', status: 'pass' as const },
  { label: 'Open Graph tags present', status: 'pass' as const },
  { label: 'Canonical URLs set', status: 'pass' as const },
  { label: 'Structured data (JSON-LD)', status: 'warn' as const, note: 'Missing on 2 marketing pages' },
  { label: 'Image alt text coverage', status: 'pass' as const },
  { label: 'Sitemap.xml generated', status: 'warn' as const, note: 'Not yet implemented' },
];

function SectionHeader({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Icon className="w-4 h-4 text-[hsl(16_65%_48%)]" />
      <h3 className="text-xs font-semibold text-[hsl(20_25%_12%)] uppercase tracking-wider">{label}</h3>
    </div>
  );
}

export default function GardenerContentStudio() {
  const { library } = useTransitusData();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLibrary = searchQuery
    ? library.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : library;

  // Identify content gaps — categories with no library items
  const categoryCounts = ALL_CATEGORIES.map(cat => ({
    category: cat,
    label: CATEGORY_LABELS[cat],
    count: library.filter(item => item.category === cat).length,
  }));
  const contentGaps = categoryCounts.filter(c => c.count === 0);

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <BookOpen className="w-5 h-5 text-[hsl(16_65%_48%)]" />
          <h2 className="font-serif text-2xl text-[hsl(20_25%_12%)]">Content Studio</h2>
        </div>
        <p className="text-sm text-[hsl(20_25%_12%/0.5)]">
          Library management, content health, and SEO oversight.
        </p>
      </div>

      {/* Library items */}
      <div className="bg-white rounded-xl border border-[hsl(30_18%_82%)] p-5">
        <SectionHeader icon={BookOpen} label={`Library Items (${library.length})`} />

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(20_25%_12%/0.3)]" />
          <input
            type="text"
            placeholder="Search library items..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-[hsl(30_18%_82%)] bg-[hsl(38_30%_95%)] text-[hsl(20_25%_12%)] placeholder:text-[hsl(20_25%_12%/0.3)] focus:outline-none focus:border-[hsl(16_65%_48%/0.4)]"
          />
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredLibrary.length === 0 ? (
            <p className="text-sm text-[hsl(20_25%_12%/0.4)] italic py-4 text-center">
              {searchQuery ? 'No items match your search.' : 'No library items yet.'}
            </p>
          ) : (
            filteredLibrary.map(item => (
              <div
                key={item.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-[hsl(38_30%_95%)] transition-colors group"
              >
                <FileText className="w-4 h-4 mt-0.5 text-[hsl(20_25%_12%/0.3)] shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-[hsl(20_25%_12%)] truncate">{item.title}</p>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[hsl(38_30%_95%)] text-[hsl(20_25%_12%/0.5)] uppercase tracking-wider shrink-0">
                      {item.item_type.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-[hsl(20_25%_12%/0.5)] truncate mt-0.5">{item.description}</p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <Tag className="w-3 h-3 text-[hsl(20_25%_12%/0.25)]" />
                    {item.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="text-[10px] text-[hsl(20_25%_12%/0.4)]">{tag}</span>
                    ))}
                    {item.tags.length > 3 && (
                      <span className="text-[10px] text-[hsl(20_25%_12%/0.3)]">+{item.tags.length - 3}</span>
                    )}
                  </div>
                </div>
                <button className="text-[10px] text-[hsl(16_65%_48%)] opacity-0 group-hover:opacity-100 transition-opacity shrink-0 flex items-center gap-1 mt-0.5">
                  <ExternalLink className="w-3 h-3" />
                  Edit
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Marketing content overview */}
      <div className="bg-white rounded-xl border border-[hsl(30_18%_82%)] p-5">
        <SectionHeader icon={FileText} label="Category Distribution" />
        <div className="space-y-2">
          {categoryCounts.map(({ category, label, count }) => (
            <div key={category} className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-[hsl(38_30%_95%)] transition-colors">
              <span className="text-sm text-[hsl(20_25%_12%)] flex-1">{label}</span>
              <span className={`text-sm font-semibold ${count === 0 ? 'text-[hsl(0_50%_45%)]' : 'text-[hsl(20_25%_12%)]'}`}>
                {count}
              </span>
              {count === 0 && (
                <AlertTriangle className="w-3.5 h-3.5 text-[hsl(38_80%_50%)]" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content gaps */}
      {contentGaps.length > 0 && (
        <div className="bg-[hsl(38_80%_55%/0.06)] border border-[hsl(38_80%_55%/0.15)] rounded-xl p-5">
          <SectionHeader icon={AlertTriangle} label="Content Gaps" />
          <p className="text-sm text-[hsl(20_25%_12%/0.6)] mb-3">
            These categories have no library items. Consider creating content for them.
          </p>
          <div className="flex flex-wrap gap-2">
            {contentGaps.map(gap => (
              <span
                key={gap.category}
                className="text-xs px-3 py-1.5 rounded-full bg-white border border-[hsl(38_80%_55%/0.2)] text-[hsl(20_25%_12%/0.7)] font-medium"
              >
                {gap.label}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* SEO health check */}
      <div className="bg-white rounded-xl border border-[hsl(30_18%_82%)] p-5">
        <SectionHeader icon={Search} label="SEO Health Check" />
        <div className="space-y-2">
          {SEO_CHECKS.map(check => (
            <div key={check.label} className="flex items-center gap-3 py-2 px-3 rounded-lg">
              {check.status === 'pass' ? (
                <CheckCircle2 className="w-4 h-4 text-[hsl(152_40%_28%)] shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-[hsl(38_80%_50%)] shrink-0" />
              )}
              <span className="text-sm text-[hsl(20_25%_12%)] flex-1">{check.label}</span>
              {check.note && (
                <span className="text-[10px] text-[hsl(38_80%_50%)]">{check.note}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
