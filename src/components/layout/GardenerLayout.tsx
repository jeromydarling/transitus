/**
 * GardenerLayout — Clean layout for the /gardener/* console routes.
 *
 * WHAT: Dark earth sidebar with flat nav, season indicator, desktop-only tool.
 * WHERE: Wraps all /gardener/* routes.
 * WHY: Replaces the complex 68-page CROS operator console with a focused,
 *      Transitus-branded Gardener Console for platform operators.
 */

import { Link, useLocation, Outlet } from 'react-router-dom';
import { TransitusDataProvider } from '@/contexts/TransitusDataContext';
import { getCurrentSeason, getDayMoment, getWeekRhythm, getNearbyMilestones } from '@/lib/transitionCalendar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Globe, Home, Building2, BarChart3, BookOpen,
  Activity, Inbox, Settings, ArrowLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Overview',       href: '/gardener',          icon: Home },
  { label: 'Tenants',        href: '/gardener/tenants',  icon: Building2 },
  { label: 'Analytics',      href: '/gardener/analytics', icon: BarChart3 },
  { label: 'Content Studio', href: '/gardener/content',  icon: BookOpen },
  { label: 'System Health',  href: '/gardener/system',   icon: Activity },
  { label: 'Support Inbox',  href: '/gardener/support',  icon: Inbox },
  { label: 'Settings',       href: '/gardener/settings', icon: Settings },
];

function isActive(pathname: string, href: string): boolean {
  if (href === '/gardener') return pathname === '/gardener' || pathname === '/gardener/';
  return pathname.startsWith(href);
}

// ── Season Indicator (reuses pattern from TransitusLayout) ──
function SeasonIndicator() {
  const season = getCurrentSeason();
  const moment = getDayMoment();
  const rhythm = getWeekRhythm();
  const milestones = getNearbyMilestones();

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full hover:bg-[hsl(30_18%_82%/0.4)] transition-colors shrink-0 cursor-default">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: season.color }} />
            <span className="text-[11px] font-medium text-[hsl(20_25%_12%/0.45)]">
              {season.label}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" align="end" className="max-w-xs p-4 bg-[hsl(20_28%_10%)] text-[hsl(38_35%_90%)] border-[hsl(38_35%_90%/0.1)]">
          <div className="space-y-2.5">
            <div>
              <p className="text-xs font-semibold" style={{ color: season.color }}>
                Current Season: {season.label}
              </p>
              <p className="text-[11px] text-[hsl(38_35%_90%/0.7)] italic">{season.posture}</p>
            </div>
            <p className="text-[11px] text-[hsl(38_35%_90%/0.55)] leading-relaxed">{season.description}</p>
            <div className="pt-1 border-t border-[hsl(38_35%_90%/0.1)]">
              <p className="text-[10px] text-[hsl(38_35%_90%/0.4)]">{moment.label} · {rhythm.focus}</p>
            </div>
            {milestones.length > 0 && (
              <div className="pt-1 border-t border-[hsl(38_35%_90%/0.1)]">
                {milestones.map(m => (
                  <p key={m.date} className="text-[10px] text-[hsl(38_80%_55%/0.8)]">{m.name}</p>
                ))}
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function GardenerLayout() {
  const location = useLocation();

  return (
    <TransitusDataProvider>
      <div className="min-h-screen bg-[hsl(38_30%_95%)] flex">
        {/* ═══ SIDEBAR ═══ */}
        <aside
          className="hidden lg:flex flex-col w-60 shrink-0 h-screen sticky top-0"
          style={{ backgroundColor: 'hsl(20 28% 10%)' }}
        >
          {/* Brand */}
          <div className="flex h-14 shrink-0 items-center gap-2.5 px-4 border-b border-[hsl(38_35%_90%/0.08)]">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'hsl(152 45% 18%)' }}
            >
              <Globe className="h-4 w-4" style={{ color: 'hsl(38 80% 55%)' }} />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-sm tracking-wide" style={{ color: 'hsl(38 35% 90%)' }}>
                Gardener Console
              </span>
              <span className="text-[10px]" style={{ color: 'hsl(38 35% 90% / 0.35)' }}>
                Transitus Platform
              </span>
            </div>
          </div>

          {/* Nav items */}
          <nav className="flex-1 overflow-y-auto px-2 py-3">
            <div className="space-y-0.5">
              {NAV_ITEMS.map(item => {
                const active = isActive(location.pathname, item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150',
                      active
                        ? 'text-[hsl(38_35%_90%)] bg-[hsl(16_65%_48%/0.15)]'
                        : 'text-[hsl(38_35%_90%/0.5)] hover:text-[hsl(38_35%_90%)] hover:bg-[hsl(38_35%_90%/0.06)]',
                    )}
                  >
                    <Icon
                      className={cn(
                        'h-[16px] w-[16px] shrink-0',
                        active ? 'text-[hsl(16_65%_48%)]' : 'text-[hsl(38_35%_90%/0.4)]',
                      )}
                    />
                    <span>{item.label}</span>
                    {active && <span className="ml-auto h-4 w-0.5 rounded-full bg-[hsl(16_65%_48%)]" />}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Back to app */}
          <div className="shrink-0 border-t border-[hsl(38_35%_90%/0.08)] px-2 py-2">
            <Link
              to="/app"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[hsl(38_35%_90%/0.4)] hover:text-[hsl(38_35%_90%)] transition-colors"
            >
              <ArrowLeft className="h-[16px] w-[16px] shrink-0" />
              <span>Back to App</span>
            </Link>
          </div>
        </aside>

        {/* ═══ MAIN CONTENT ═══ */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Top bar */}
          <header className="sticky top-0 z-30 flex h-12 shrink-0 items-center justify-between border-b border-[hsl(30_18%_82%)] bg-[hsl(38_30%_95%/0.97)] backdrop-blur-sm px-5">
            <h1 className="font-serif text-base tracking-tight text-[hsl(20_25%_12%)]">
              Gardener Console
            </h1>
            <SeasonIndicator />
          </header>

          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </TransitusDataProvider>
  );
}

export default GardenerLayout;
