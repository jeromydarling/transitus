/**
 * TransitusLayout — App shell with grouped sidebar nav and bottom tab bar.
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
  ArrowLeft, Menu, X, MoreHorizontal, ChevronRight, ChevronDown,
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

interface NavGroup {
  label: string;
  items: NavItem[];
}

export interface TransitusLayoutProps {
  title?: string;
  children?: React.ReactNode;
}

// Primary items (always visible in sidebar + bottom tab)
const PRIMARY_ITEMS: NavItem[] = [
  { label: 'Home',          shortLabel: 'Home',     href: '/app',              icon: Home },
  { label: 'Compass',       shortLabel: 'Compass',  href: '/app/compass',      icon: Compass },
  { label: 'Places',        shortLabel: 'Places',   href: '/app/places',       icon: MapPin },
  { label: 'People & Orgs', shortLabel: 'People',   href: '/app/people',       icon: Users },
  { label: 'Commitments',   shortLabel: 'Commits',  href: '/app/commitments',  icon: Handshake },
];

// Grouped sections (collapsible in sidebar, in "More" on mobile)
const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Field Work',
    items: [
      { label: 'Field Notes',   shortLabel: 'Notes',    href: '/app/field-notes',  icon: NotebookPen },
      { label: 'Signals',       shortLabel: 'Signals',  href: '/app/signals',      icon: Radio },
      { label: 'Journeys',      shortLabel: 'Journeys', href: '/app/journeys',     icon: BookOpen },
      { label: 'Stories',       shortLabel: 'Stories',  href: '/app/community-stories', icon: Quote },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { label: 'Library',       shortLabel: 'Library',  href: '/app/library',      icon: Library },
      { label: 'Reports',       shortLabel: 'Reports',  href: '/app/reports',      icon: FileText },
      { label: 'Coalition',     shortLabel: 'Coalition', href: '/app/coalition',   icon: Network },
      { label: 'Benefits',      shortLabel: 'Benefits', href: '/app/community-benefits', icon: Target },
      { label: 'Participation', shortLabel: 'Engage',   href: '/app/participation', icon: Heart },
    ],
  },
  {
    label: 'Personal',
    items: [
      { label: 'Journal',       shortLabel: 'Journal',  href: '/app/journal',      icon: PenLine },
      { label: 'Settings',      shortLabel: 'Settings', href: '/app/settings',     icon: Settings },
      { label: 'Feedback',      shortLabel: 'Feedback', href: '/app/feedback',     icon: MessageSquare },
    ],
  },
];

const ALL_ITEMS = [...PRIMARY_ITEMS, ...NAV_GROUPS.flatMap(g => g.items)];
const MOBILE_TAB_COUNT = 4;
const MOBILE_TABS = PRIMARY_ITEMS.slice(0, MOBILE_TAB_COUNT);

function titleFromPathname(pathname: string): string {
  const match = ALL_ITEMS.find((item) =>
    item.href === '/app' ? pathname === '/app' || pathname === '/app/' : pathname.startsWith(item.href),
  );
  return match?.label ?? 'Transitus';
}

function isActive(pathname: string, href: string): boolean {
  if (href === '/app') return pathname === '/app' || pathname === '/app/';
  return pathname.startsWith(href);
}

function isInMoreSection(pathname: string): boolean {
  return NAV_GROUPS.flatMap(g => g.items).some(item => isActive(pathname, item.href)) ||
    PRIMARY_ITEMS.slice(MOBILE_TAB_COUNT).some(item => isActive(pathname, item.href));
}

// ── Season Indicator ──
function SeasonIndicator() {
  const season = getCurrentSeason();
  const moment = getDayMoment();
  const rhythm = getWeekRhythm();
  const milestones = getNearbyMilestones();

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link to="/app/compass" className="flex items-center gap-2 px-2.5 py-1 rounded-full hover:bg-[hsl(30_18%_82%/0.4)] transition-colors shrink-0">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: season.color }} />
            <span className="text-[11px] font-medium text-[hsl(20_25%_12%/0.45)] hidden sm:inline">Current Season: {season.label}</span>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="bottom" align="end" className="max-w-xs p-4 bg-[hsl(20_28%_10%)] text-[hsl(38_35%_90%)] border-[hsl(38_35%_90%/0.1)]">
          <div className="space-y-2.5">
            <div>
              <p className="text-xs font-semibold" style={{ color: season.color }}>Current Season: {season.label}</p>
              <p className="text-[11px] text-[hsl(38_35%_90%/0.7)] italic">{season.posture}</p>
            </div>
            <p className="text-[11px] text-[hsl(38_35%_90%/0.55)] leading-relaxed">{season.description}</p>
            <div className="pt-1 border-t border-[hsl(38_35%_90%/0.1)]">
              <p className="text-[10px] text-[hsl(38_35%_90%/0.4)]">{moment.label} · {rhythm.focus}</p>
            </div>
            {milestones.length > 0 && (
              <div className="pt-1 border-t border-[hsl(38_35%_90%/0.1)]">
                {milestones.map(m => <p key={m.date} className="text-[10px] text-[hsl(38_80%_55%/0.8)]">{m.name}</p>)}
              </div>
            )}
            <Link to="/app/seasons" className="block text-[10px] text-[hsl(16_65%_48%)] hover:underline pt-1">Learn about the seasons →</Link>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// ── Sidebar Nav Group ──
function SidebarGroup({ group, pathname, onNavigate }: { group: NavGroup; pathname: string; onNavigate: () => void }) {
  const hasActive = group.items.some(item => isActive(pathname, item.href));
  const [open, setOpen] = useState(hasActive);

  return (
    <div className="mb-1">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-[hsl(38_35%_90%/0.3)] hover:text-[hsl(38_35%_90%/0.5)] transition-colors"
      >
        {group.label}
        <ChevronDown className={cn('h-3 w-3 transition-transform', open ? 'rotate-0' : '-rotate-90')} />
      </button>
      {open && (
        <div className="space-y-0.5">
          {group.items.map(item => {
            const active = isActive(pathname, item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href} to={item.href} onClick={onNavigate}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150',
                  active ? 'text-[hsl(38_35%_90%)] bg-[hsl(16_65%_48%/0.15)]' : 'text-[hsl(38_35%_90%/0.5)] hover:text-[hsl(38_35%_90%)] hover:bg-[hsl(38_35%_90%/0.06)]',
                )}
              >
                <Icon className={cn('h-[16px] w-[16px] shrink-0', active ? 'text-[hsl(16_65%_48%)]' : 'text-[hsl(38_35%_90%/0.4)]')} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Main Layout ──
export function TransitusLayout({ title, children }: TransitusLayoutProps) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const resolvedTitle = title ?? titleFromPathname(location.pathname);

  useEffect(() => { setSidebarOpen(false); setMoreOpen(false); }, [location.pathname]);
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) { if (e.key === 'Escape') { setSidebarOpen(false); setMoreOpen(false); } }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  return (
    <TransitusDataProvider>
    <div className="min-h-screen bg-[hsl(38_30%_95%)]">
      {/* Overlays */}
      {(sidebarOpen || moreOpen) && (
        <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden" onClick={() => { closeSidebar(); setMoreOpen(false); }} />
      )}

      {/* ═══ DESKTOP SIDEBAR ═══ */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 flex h-screen w-60 flex-col transition-transform duration-300',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full', 'lg:translate-x-0',
        )}
        style={{ backgroundColor: 'hsl(20 28% 10%)' }}
      >
        {/* Brand */}
        <div className="flex h-14 shrink-0 items-center gap-2.5 px-4">
          <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: 'hsl(152 45% 18%)' }}>
            <Globe className="h-4 w-4" style={{ color: 'hsl(38 80% 55%)' }} />
          </div>
          <span className="font-serif text-lg tracking-wide" style={{ color: 'hsl(38 35% 90%)' }}>Transitus</span>
          <button onClick={closeSidebar} className="ml-auto p-1 lg:hidden" style={{ color: 'hsl(38 35% 90% / 0.5)' }}><X className="h-4 w-4" /></button>
        </div>

        {/* Primary nav */}
        <nav className="flex-1 overflow-y-auto px-2 py-2">
          <div className="space-y-0.5 mb-3">
            {PRIMARY_ITEMS.map(item => {
              const active = isActive(location.pathname, item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href} to={item.href} onClick={closeSidebar}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150',
                    active ? 'text-[hsl(38_35%_90%)] bg-[hsl(16_65%_48%/0.15)]' : 'text-[hsl(38_35%_90%/0.5)] hover:text-[hsl(38_35%_90%)] hover:bg-[hsl(38_35%_90%/0.06)]',
                  )}
                >
                  <Icon className={cn('h-[16px] w-[16px] shrink-0', active ? 'text-[hsl(16_65%_48%)]' : 'text-[hsl(38_35%_90%/0.4)]')} />
                  <span>{item.label}</span>
                  {active && <span className="ml-auto h-4 w-0.5 rounded-full bg-[hsl(16_65%_48%)]" />}
                </Link>
              );
            })}
          </div>

          {/* Grouped sections */}
          {NAV_GROUPS.map(group => (
            <SidebarGroup key={group.label} group={group} pathname={location.pathname} onNavigate={closeSidebar} />
          ))}
        </nav>

        {/* Back to site */}
        <div className="shrink-0 border-t border-[hsl(38_35%_90%/0.08)] px-2 py-2">
          <Link to="/" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[hsl(38_35%_90%/0.4)] hover:text-[hsl(38_35%_90%)] transition-colors">
            <ArrowLeft className="h-[16px] w-[16px] shrink-0" /><span>Back to Site</span>
          </Link>
        </div>
      </aside>

      {/* ═══ MAIN CONTENT ═══ */}
      <div className="flex min-h-screen flex-col lg:pl-60">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-12 shrink-0 items-center gap-3 border-b border-[hsl(30_18%_82%)] bg-[hsl(38_30%_95%/0.97)] backdrop-blur-sm px-4 lg:px-5">
          <button className="shrink-0 p-1.5 -ml-1 rounded-lg hover:bg-[hsl(30_18%_82%/0.5)] transition-colors lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5 text-[hsl(20_25%_12%/0.6)]" />
          </button>
          <h1 className="font-serif text-base tracking-tight text-[hsl(20_25%_12%)] flex-1">{resolvedTitle}</h1>
          <SeasonIndicator />
        </header>

        <main className="flex-1 overflow-auto pb-20 lg:pb-0">
          {children}
          <Outlet />
        </main>
        <NRILauncher />
      </div>

      {/* ═══ MOBILE BOTTOM TAB BAR ═══ */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden border-t border-[hsl(30_18%_82%)] bg-white/95 backdrop-blur-md" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        <div className="flex items-stretch">
          {MOBILE_TABS.map(item => {
            const active = isActive(location.pathname, item.href);
            const Icon = item.icon;
            return (
              <Link key={item.href} to={item.href} className={cn(
                'flex-1 flex flex-col items-center justify-center gap-0.5 py-2 min-h-[52px] transition-colors active:bg-[hsl(30_18%_82%/0.3)]',
                active ? 'text-[hsl(16_65%_48%)]' : 'text-[hsl(20_25%_12%/0.35)]',
              )}>
                <Icon className={cn('h-5 w-5', active && 'text-[hsl(16_65%_48%)]')} />
                <span className={cn('text-[10px] font-medium', active && 'font-semibold')}>{item.shortLabel}</span>
              </Link>
            );
          })}
          <button onClick={() => setMoreOpen(!moreOpen)} className={cn(
            'flex-1 flex flex-col items-center justify-center gap-0.5 py-2 min-h-[52px] transition-colors active:bg-[hsl(30_18%_82%/0.3)]',
            (moreOpen || isInMoreSection(location.pathname)) ? 'text-[hsl(16_65%_48%)]' : 'text-[hsl(20_25%_12%/0.35)]',
          )}>
            <MoreHorizontal className="h-5 w-5" /><span className="text-[10px] font-medium">More</span>
          </button>
        </div>
      </nav>

      {/* ═══ More bottom sheet ═══ */}
      {moreOpen && (
        <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden animate-slide-up" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
          <div className="mx-2 mb-2 rounded-2xl bg-white shadow-2xl border border-[hsl(30_18%_82%)] overflow-hidden max-h-[70vh] overflow-y-auto">
            <div className="flex justify-center pt-3 pb-1"><div className="w-10 h-1 rounded-full bg-[hsl(30_18%_82%)]" /></div>
            <div className="px-2 pb-3">
              {/* Remaining primary items (Commitments if not in tab) */}
              {PRIMARY_ITEMS.slice(MOBILE_TAB_COUNT).map(item => {
                const active = isActive(location.pathname, item.href);
                const Icon = item.icon;
                return (
                  <Link key={item.href} to={item.href} onClick={() => setMoreOpen(false)}
                    className={cn('flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors active:bg-[hsl(38_30%_95%)]',
                      active ? 'text-[hsl(16_65%_48%)] bg-[hsl(16_65%_48%/0.06)]' : 'text-[hsl(20_25%_12%)]')}>
                    <Icon className={cn('h-5 w-5', active ? 'text-[hsl(16_65%_48%)]' : 'text-[hsl(20_25%_12%/0.35)]')} />
                    <span className="flex-1">{item.label}</span>
                    <ChevronRight className="h-4 w-4 text-[hsl(20_25%_12%/0.2)]" />
                  </Link>
                );
              })}

              {/* Grouped sections */}
              {NAV_GROUPS.map(group => (
                <div key={group.label} className="mt-2 pt-2 border-t border-[hsl(30_18%_82%/0.5)]">
                  <p className="px-4 py-1 text-[10px] font-semibold uppercase tracking-widest text-[hsl(20_25%_12%/0.3)]">{group.label}</p>
                  {group.items.map(item => {
                    const active = isActive(location.pathname, item.href);
                    const Icon = item.icon;
                    return (
                      <Link key={item.href} to={item.href} onClick={() => setMoreOpen(false)}
                        className={cn('flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors active:bg-[hsl(38_30%_95%)]',
                          active ? 'text-[hsl(16_65%_48%)] bg-[hsl(16_65%_48%/0.06)]' : 'text-[hsl(20_25%_12%)]')}>
                        <Icon className={cn('h-5 w-5', active ? 'text-[hsl(16_65%_48%)]' : 'text-[hsl(20_25%_12%/0.35)]')} />
                        <span className="flex-1">{item.label}</span>
                        <ChevronRight className="h-4 w-4 text-[hsl(20_25%_12%/0.2)]" />
                      </Link>
                    );
                  })}
                </div>
              ))}

              <div className="mt-2 pt-2 border-t border-[hsl(30_18%_82%/0.5)]">
                <Link to="/" onClick={() => setMoreOpen(false)} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[hsl(20_25%_12%/0.4)] active:bg-[hsl(38_30%_95%)]">
                  <ArrowLeft className="h-5 w-5" /><span>Back to Marketing Site</span>
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
