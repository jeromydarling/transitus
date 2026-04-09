/**
 * TransitusLayout — App shell for the Transitus stewardship platform.
 *
 * Desktop: fixed left sidebar with all 9 nav items.
 * Mobile: bottom tab bar (5 primary items) + "More" drawer for remaining.
 * Designed to feel like a native app on mobile for field agents.
 */

import { useState, useCallback, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { NRILauncher } from '@/components/nri/NRILauncher';
import { TransitusDataProvider } from '@/contexts/TransitusDataContext';
import { getCurrentSeason, getDayMoment, getWeekRhythm, getNearbyMilestones } from '@/lib/transitionCalendar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Home, MapPin, Users, Handshake, NotebookPen,
  Radio, BookOpen, Library, FileText, Globe,
  ArrowLeft, Menu, X, MoreHorizontal, ChevronRight,
  PenLine, Network, Heart, Target, Search, Quote,
  Compass, Settings, MessageSquare,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  shortLabel: string;
  href: string;
  icon: React.ElementType;
}

export interface TransitusLayoutProps {
  title?: string;
  children?: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Home',          shortLabel: 'Home',     href: '/app',              icon: Home },
  { label: 'Compass',       shortLabel: 'Compass',  href: '/app/compass',      icon: Compass },
  { label: 'Places',        shortLabel: 'Places',   href: '/app/places',       icon: MapPin },
  { label: 'People & Orgs', shortLabel: 'People',   href: '/app/people',       icon: Users },
  { label: 'Commitments',   shortLabel: 'Commits',  href: '/app/commitments',  icon: Handshake },
  { label: 'Field Notes',   shortLabel: 'Notes',    href: '/app/field-notes',  icon: NotebookPen },
  { label: 'Signals',       shortLabel: 'Signals',  href: '/app/signals',      icon: Radio },
  { label: 'Journeys',      shortLabel: 'Journeys', href: '/app/journeys',     icon: BookOpen },
  { label: 'Library',       shortLabel: 'Library',  href: '/app/library',      icon: Library },
  { label: 'Reports',       shortLabel: 'Reports',  href: '/app/reports',      icon: FileText },
  { label: 'Journal',       shortLabel: 'Journal',  href: '/app/journal',      icon: PenLine },
  { label: 'Coalition',     shortLabel: 'Coalition', href: '/app/coalition',    icon: Network },
  { label: 'Participation', shortLabel: 'Engage',   href: '/app/participation', icon: Heart },
  { label: 'Benefits',      shortLabel: 'Benefits', href: '/app/community-benefits', icon: Target },
  { label: 'Stories',       shortLabel: 'Stories',  href: '/app/community-stories',  icon: Quote },
  { label: 'Settings',      shortLabel: 'Settings', href: '/app/settings',  icon: Settings },
  { label: 'Feedback',      shortLabel: 'Feedback', href: '/app/feedback',  icon: MessageSquare },
];

// Bottom tab bar shows first 4 + More
const PRIMARY_TAB_COUNT = 4;
const PRIMARY_TABS = NAV_ITEMS.slice(0, PRIMARY_TAB_COUNT);
const MORE_ITEMS = NAV_ITEMS.slice(PRIMARY_TAB_COUNT);

function titleFromPathname(pathname: string): string {
  const match = NAV_ITEMS.find((item) =>
    item.href === '/app'
      ? pathname === '/app' || pathname === '/app/'
      : pathname.startsWith(item.href),
  );
  return match?.label ?? 'Transitus';
}

function isActive(pathname: string, href: string): boolean {
  if (href === '/app') return pathname === '/app' || pathname === '/app/';
  return pathname.startsWith(href);
}

function isInMoreSection(pathname: string): boolean {
  return MORE_ITEMS.some(item => isActive(pathname, item.href));
}

function SeasonIndicator() {
  const season = getCurrentSeason();
  const moment = getDayMoment();
  const rhythm = getWeekRhythm();
  const milestones = getNearbyMilestones();

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            to="/app/compass"
            className="flex items-center gap-2 px-2.5 py-1 rounded-full hover:bg-[hsl(30_18%_82%/0.4)] transition-colors shrink-0"
          >
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: season.color }}
            />
            <span className="text-[11px] font-medium text-[hsl(20_25%_12%/0.45)] hidden sm:inline">
              Current Season: {season.label}
            </span>
          </Link>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          align="end"
          className="max-w-xs p-4 bg-[hsl(20_28%_10%)] text-[hsl(38_35%_90%)] border-[hsl(38_35%_90%/0.1)]"
        >
          <div className="space-y-2.5">
            <div>
              <p className="text-xs font-semibold" style={{ color: season.color }}>
                Current Season: {season.label}
              </p>
              <p className="text-[11px] text-[hsl(38_35%_90%/0.7)] italic">
                {season.posture}
              </p>
            </div>
            <p className="text-[11px] text-[hsl(38_35%_90%/0.55)] leading-relaxed">
              {season.description}
            </p>
            <div className="pt-1 border-t border-[hsl(38_35%_90%/0.1)]">
              <p className="text-[10px] text-[hsl(38_35%_90%/0.4)]">
                {moment.label} · {rhythm.focus}
              </p>
            </div>
            {milestones.length > 0 && (
              <div className="pt-1 border-t border-[hsl(38_35%_90%/0.1)]">
                {milestones.map(m => (
                  <p key={m.date} className="text-[10px] text-[hsl(38_80%_55%/0.8)]">
                    {m.name}
                  </p>
                ))}
              </div>
            )}
            <div className="pt-1 border-t border-[hsl(38_35%_90%/0.1)]">
              <Link
                to="/app/seasons"
                className="text-[10px] font-medium text-[hsl(var(--transitus-amber))] hover:underline"
              >
                Learn about the seasons →
              </Link>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function TransitusLayout({ title, children }: TransitusLayoutProps) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const resolvedTitle = title ?? titleFromPathname(location.pathname);

  useEffect(() => { setSidebarOpen(false); setMoreOpen(false); }, [location.pathname]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') { setSidebarOpen(false); setMoreOpen(false); }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  return (
    <TransitusDataProvider>
    <div className="min-h-screen bg-[hsl(38_30%_95%)]">
      {/* ── Mobile overlay backdrop ── */}
      {(sidebarOpen || moreOpen) && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => { closeSidebar(); setMoreOpen(false); }}
        />
      )}

      {/* ══════════════════════════════════════════════════════════════════
          DESKTOP SIDEBAR (lg+)
          ══════════════════════════════════════════════════════════════════ */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 flex h-screen w-64 flex-col transition-transform duration-300',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0',
        )}
        style={{ backgroundColor: 'hsl(20 28% 10%)' }}
      >
        {/* Brand */}
        <div className="flex h-16 shrink-0 items-center gap-3 px-5">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'hsl(152 45% 18%)' }}>
            <Globe className="h-4.5 w-4.5" style={{ color: 'hsl(38 80% 55%)' }} />
          </div>
          <span className="font-serif text-xl tracking-wide" style={{ color: 'hsl(38 35% 90%)' }}>
            Transitus
          </span>
          <button onClick={closeSidebar} className="ml-auto p-1.5 lg:hidden" style={{ color: 'hsl(38 35% 90% / 0.6)' }}>
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-3">
          {NAV_ITEMS.map((item) => {
            const active = isActive(location.pathname, item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={closeSidebar}
                className={cn(
                  'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
                  active
                    ? 'text-[hsl(38_35%_90%)] bg-[hsl(16_65%_48%/0.15)]'
                    : 'text-[hsl(38_35%_90%/0.55)] hover:text-[hsl(38_35%_90%)] hover:bg-[hsl(38_35%_90%/0.06)]',
                )}
              >
                <Icon className={cn('h-[18px] w-[18px] shrink-0', active ? 'text-[hsl(16_65%_48%)]' : 'text-[hsl(38_35%_90%/0.5)]')} />
                <span>{item.label}</span>
                {active && <span className="ml-auto h-5 w-0.5 rounded-full bg-[hsl(16_65%_48%)]" />}
              </Link>
            );
          })}
        </nav>

        {/* Back to site */}
        <div className="shrink-0 border-t border-[hsl(38_35%_90%/0.08)] px-3 py-3">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[hsl(38_35%_90%/0.5)] hover:text-[hsl(38_35%_90%)] transition-colors"
          >
            <ArrowLeft className="h-[18px] w-[18px] shrink-0" />
            <span>Back to Site</span>
          </Link>
        </div>
      </aside>

      {/* ══════════════════════════════════════════════════════════════════
          MAIN CONTENT
          ══════════════════════════════════════════════════════════════════ */}
      <div className="flex min-h-screen flex-col lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-[hsl(30_18%_82%)] bg-[hsl(38_30%_95%/0.97)] backdrop-blur-sm px-4 lg:px-6">
          <button
            className="shrink-0 p-2 -ml-2 rounded-lg hover:bg-[hsl(30_18%_82%/0.5)] transition-colors lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5 text-[hsl(20_25%_12%/0.7)]" />
          </button>
          <h1 className="font-serif text-lg tracking-tight text-[hsl(20_25%_12%)] flex-1">{resolvedTitle}</h1>

          {/* Seasonal indicator */}
          <SeasonIndicator />
        </header>

        {/* Page content — bottom padding on mobile for tab bar */}
        <main className="flex-1 overflow-auto pb-20 lg:pb-0">
          {children}
          <Outlet />
        </main>

        {/* NRI Companion */}
        <NRILauncher />
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          MOBILE BOTTOM TAB BAR (< lg)
          ══════════════════════════════════════════════════════════════════ */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 lg:hidden border-t border-[hsl(30_18%_82%)] bg-white/95 backdrop-blur-md"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="flex items-stretch">
          {PRIMARY_TABS.map((item) => {
            const active = isActive(location.pathname, item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex-1 flex flex-col items-center justify-center gap-0.5 py-2 min-h-[56px] transition-colors active:bg-[hsl(30_18%_82%/0.3)]',
                  active ? 'text-[hsl(16_65%_48%)]' : 'text-[hsl(20_25%_12%/0.4)]',
                )}
              >
                <Icon className={cn('h-5 w-5', active && 'text-[hsl(16_65%_48%)]')} />
                <span className={cn('text-[10px] font-medium', active && 'font-semibold')}>{item.shortLabel}</span>
                {active && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-[hsl(16_65%_48%)]" />}
              </Link>
            );
          })}

          {/* More button */}
          <button
            onClick={() => setMoreOpen(!moreOpen)}
            className={cn(
              'flex-1 flex flex-col items-center justify-center gap-0.5 py-2 min-h-[56px] transition-colors active:bg-[hsl(30_18%_82%/0.3)]',
              (moreOpen || isInMoreSection(location.pathname)) ? 'text-[hsl(16_65%_48%)]' : 'text-[hsl(20_25%_12%/0.4)]',
            )}
          >
            <MoreHorizontal className="h-5 w-5" />
            <span className="text-[10px] font-medium">More</span>
          </button>
        </div>
      </nav>

      {/* ── "More" bottom sheet ── */}
      {moreOpen && (
        <div
          className="fixed bottom-0 left-0 right-0 z-50 lg:hidden animate-slide-up"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
          <div className="mx-2 mb-2 rounded-2xl bg-white shadow-2xl border border-[hsl(30_18%_82%)] overflow-hidden">
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-[hsl(30_18%_82%)]" />
            </div>

            <div className="px-2 pb-3">
              {MORE_ITEMS.map((item) => {
                const active = isActive(location.pathname, item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setMoreOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium transition-colors active:bg-[hsl(38_30%_95%)]',
                      active ? 'text-[hsl(16_65%_48%)] bg-[hsl(16_65%_48%/0.06)]' : 'text-[hsl(20_25%_12%)]',
                    )}
                  >
                    <Icon className={cn('h-5 w-5', active ? 'text-[hsl(16_65%_48%)]' : 'text-[hsl(20_25%_12%/0.4)]')} />
                    <span className="flex-1">{item.label}</span>
                    <ChevronRight className="h-4 w-4 text-[hsl(20_25%_12%/0.25)]" />
                  </Link>
                );
              })}

              <div className="mt-1 pt-2 border-t border-[hsl(30_18%_82%/0.5)]">
                <Link
                  to="/"
                  onClick={() => setMoreOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium text-[hsl(20_25%_12%/0.5)] active:bg-[hsl(38_30%_95%)]"
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span>Back to Marketing Site</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </TransitusDataProvider>
  );
}

export default TransitusLayout;
