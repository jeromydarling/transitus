/**
 * Gardener Overview — Dashboard showing platform pulse and entity counts.
 */

import { useTransitusData } from '@/contexts/TransitusDataContext';
import { getCurrentSeason, getDayMoment, getWeekRhythm } from '@/lib/transitionCalendar';
import { Link } from 'react-router-dom';
import {
  MapPin, Users, Handshake, NotebookPen, Radio, Quote,
  Building2, BarChart3, BookOpen, Activity, Inbox, Settings,
  ArrowRight, Heart,
} from 'lucide-react';

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
}

function StatCard({ icon: Icon, label, value, color }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-[hsl(30_18%_82%)] p-4 flex items-center gap-4">
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <div>
        <p className="text-2xl font-semibold text-[hsl(20_25%_12%)]">{value}</p>
        <p className="text-xs text-[hsl(20_25%_12%/0.5)] uppercase tracking-wider font-medium">{label}</p>
      </div>
    </div>
  );
}

interface QuickLinkProps {
  icon: React.ElementType;
  label: string;
  href: string;
  description: string;
}

function QuickLink({ icon: Icon, label, href, description }: QuickLinkProps) {
  return (
    <Link
      to={href}
      className="bg-white rounded-xl border border-[hsl(30_18%_82%)] p-4 hover:border-[hsl(16_65%_48%/0.3)] hover:shadow-sm transition-all group"
    >
      <div className="flex items-center gap-3 mb-2">
        <Icon className="w-4 h-4 text-[hsl(16_65%_48%)]" />
        <span className="text-sm font-semibold text-[hsl(20_25%_12%)]">{label}</span>
        <ArrowRight className="w-3.5 h-3.5 ml-auto text-[hsl(20_25%_12%/0.2)] group-hover:text-[hsl(16_65%_48%)] transition-colors" />
      </div>
      <p className="text-xs text-[hsl(20_25%_12%/0.5)] leading-relaxed">{description}</p>
    </Link>
  );
}

export default function GardenerOverview() {
  const { places, stakeholders, commitments, fieldNotes, signals, communityStories } = useTransitusData();
  const season = getCurrentSeason();
  const moment = getDayMoment();
  const rhythm = getWeekRhythm();

  const totalEntities = places.length + stakeholders.length + commitments.length +
    fieldNotes.length + signals.length + communityStories.length;

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-8">
      {/* Page header */}
      <div>
        <h2 className="font-serif text-2xl text-[hsl(20_25%_12%)] mb-1">Overview</h2>
        <p className="text-sm text-[hsl(20_25%_12%/0.5)]">
          {moment.greeting} Platform pulse and entity summary.
        </p>
      </div>

      {/* Season + Rhythm bar */}
      <div className="bg-white rounded-xl border border-[hsl(30_18%_82%)] p-5">
        <div className="flex items-center gap-3 mb-3">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: season.color }} />
          <h3 className="text-sm font-semibold text-[hsl(20_25%_12%)] uppercase tracking-wider">
            Current Season
          </h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-lg font-serif text-[hsl(20_25%_12%)]" style={{ color: season.color }}>
              {season.label}
            </p>
            <p className="text-xs text-[hsl(20_25%_12%/0.5)] italic mt-0.5">{season.posture}</p>
          </div>
          <div>
            <p className="text-xs text-[hsl(20_25%_12%/0.4)] uppercase tracking-wider font-medium mb-0.5">
              Time of Day
            </p>
            <p className="text-sm text-[hsl(20_25%_12%)]">{moment.label}</p>
          </div>
          <div>
            <p className="text-xs text-[hsl(20_25%_12%/0.4)] uppercase tracking-wider font-medium mb-0.5">
              Weekly Focus
            </p>
            <p className="text-sm text-[hsl(20_25%_12%)]">{rhythm.focus}</p>
          </div>
        </div>
      </div>

      {/* Entity counts */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-4 h-4 text-[hsl(16_65%_48%)]" />
          <h3 className="text-xs font-semibold text-[hsl(20_25%_12%)] uppercase tracking-wider">
            Entity Counts
          </h3>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard icon={MapPin} label="Places" value={places.length} color="hsl(16 65% 48%)" />
          <StatCard icon={Users} label="Stakeholders" value={stakeholders.length} color="hsl(152 40% 28%)" />
          <StatCard icon={Handshake} label="Commitments" value={commitments.length} color="hsl(38 80% 50%)" />
          <StatCard icon={NotebookPen} label="Field Notes" value={fieldNotes.length} color="hsl(270 30% 40%)" />
          <StatCard icon={Radio} label="Signals" value={signals.length} color="hsl(198 55% 42%)" />
          <StatCard icon={Quote} label="Community Stories" value={communityStories.length} color="hsl(0 25% 30%)" />
        </div>
      </div>

      {/* Platform pulse */}
      <div className="bg-white rounded-xl border border-[hsl(30_18%_82%)] p-5">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="w-4 h-4 text-[hsl(152_40%_28%)]" />
          <h3 className="text-xs font-semibold text-[hsl(20_25%_12%)] uppercase tracking-wider">
            Platform Pulse
          </h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="text-center p-3 rounded-lg bg-[hsl(38_30%_95%)]">
            <p className="text-2xl font-semibold text-[hsl(20_25%_12%)]">{totalEntities}</p>
            <p className="text-[10px] text-[hsl(20_25%_12%/0.4)] uppercase tracking-wider">Total Records</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-[hsl(38_30%_95%)]">
            <p className="text-2xl font-semibold text-[hsl(152_40%_28%)]">
              {places.length > 0 ? 'Healthy' : 'Empty'}
            </p>
            <p className="text-[10px] text-[hsl(20_25%_12%/0.4)] uppercase tracking-wider">Data Health</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-[hsl(38_30%_95%)]">
            <p className="text-2xl font-semibold text-[hsl(38_80%_50%)]">
              {commitments.filter(c => c.status === 'active').length}
            </p>
            <p className="text-[10px] text-[hsl(20_25%_12%/0.4)] uppercase tracking-wider">Active Commitments</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-[hsl(38_30%_95%)]">
            <p className="text-2xl font-semibold text-[hsl(198_55%_42%)]">
              {signals.filter(s => s.category === 'funding_opportunity').length}
            </p>
            <p className="text-[10px] text-[hsl(20_25%_12%/0.4)] uppercase tracking-wider">Open Opportunities</p>
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <ArrowRight className="w-4 h-4 text-[hsl(16_65%_48%)]" />
          <h3 className="text-xs font-semibold text-[hsl(20_25%_12%)] uppercase tracking-wider">
            Quick Links
          </h3>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <QuickLink icon={Building2} label="Tenants" href="/gardener/tenants" description="Manage multi-tenant organizations and coalitions." />
          <QuickLink icon={BarChart3} label="Analytics" href="/gardener/analytics" description="Platform-wide data analysis and engagement metrics." />
          <QuickLink icon={BookOpen} label="Content Studio" href="/gardener/content" description="Library items, SEO health, and content gaps." />
          <QuickLink icon={Activity} label="System Health" href="/gardener/system" description="API connector status, storage, and data integrity." />
          <QuickLink icon={Inbox} label="Support Inbox" href="/gardener/support" description="Review and acknowledge user feedback submissions." />
          <QuickLink icon={Settings} label="Settings" href="/gardener/settings" description="Platform configuration, tone charter, and data management." />
        </div>
      </div>
    </div>
  );
}
