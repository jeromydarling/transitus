/**
 * TransitusLayout — Main app layout for the Transitus Just Transition
 * stewardship platform.
 *
 * WHAT: Dark earth-toned sidebar with 9 nav items + top bar showing page title.
 * WHERE: Wraps all /app/* routes.
 * WHY: Provides a grounded, place-based visual language for stewardship navigation.
 *
 * Design tokens:
 *   --transitus-earth:      20 25% 12%
 *   --transitus-terracotta: 16 65% 48%
 *   --transitus-amber:      38 80% 55%
 *   --transitus-sand:       38 35% 90%
 *   --transitus-parchment:  38 30% 95%
 */

import { useState, useCallback, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import {
  Home,
  MapPin,
  Users,
  Handshake,
  NotebookPen,
  Radio,
  BookOpen,
  Library,
  FileText,
  Globe,
  ArrowLeft,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

export interface TransitusLayoutProps {
  /** Page title displayed in the top bar. */
  title?: string;
  /** Optional children rendered alongside the Outlet. */
  children?: React.ReactNode;
}

// ---------------------------------------------------------------------------
// Navigation definition
// ---------------------------------------------------------------------------

const NAV_ITEMS: NavItem[] = [
  { label: 'Home',         href: '/app',             icon: Home },
  { label: 'Places',       href: '/app/places',      icon: MapPin },
  { label: 'People & Orgs', href: '/app/people',     icon: Users },
  { label: 'Commitments',  href: '/app/commitments',  icon: Handshake },
  { label: 'Field Notes',  href: '/app/field-notes',  icon: NotebookPen },
  { label: 'Signals',      href: '/app/signals',      icon: Radio },
  { label: 'Journeys',     href: '/app/journeys',     icon: BookOpen },
  { label: 'Library',      href: '/app/library',      icon: Library },
  { label: 'Reports',      href: '/app/reports',      icon: FileText },
];

// ---------------------------------------------------------------------------
// Route-to-title mapping (fallback when no explicit title prop is provided)
// ---------------------------------------------------------------------------

function titleFromPathname(pathname: string): string {
  const match = NAV_ITEMS.find((item) =>
    item.href === '/app'
      ? pathname === '/app' || pathname === '/app/'
      : pathname.startsWith(item.href),
  );
  return match?.label ?? 'Transitus';
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** True when `pathname` matches `href` exactly (Home) or as a prefix (others). */
function isActive(pathname: string, href: string): boolean {
  if (href === '/app') {
    return pathname === '/app' || pathname === '/app/';
  }
  return pathname.startsWith(href);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function TransitusLayout({ title, children }: TransitusLayoutProps) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const resolvedTitle = title ?? titleFromPathname(location.pathname);

  // Close mobile sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Close mobile sidebar on Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && sidebarOpen) {
        setSidebarOpen(false);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [sidebarOpen]);

  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'hsl(38 30% 95%)' }}>
      {/* ----------------------------------------------------------------- */}
      {/* Mobile overlay backdrop                                           */}
      {/* ----------------------------------------------------------------- */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* ----------------------------------------------------------------- */}
      {/* Sidebar                                                           */}
      {/* ----------------------------------------------------------------- */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 flex h-screen w-64 flex-col overflow-hidden transition-transform duration-300',
          // Mobile: slide in/out
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          // Desktop: always visible
          'lg:translate-x-0',
        )}
        style={{ backgroundColor: 'hsl(20 28% 10%)' }}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* ----- Brand ----- */}
        <div className="flex h-16 shrink-0 items-center gap-3 px-5">
          <Globe
            className="h-7 w-7 shrink-0"
            style={{ color: 'hsl(16 65% 48%)' }}
          />
          <span
            className="font-serif text-xl tracking-wide"
            style={{ color: 'hsl(38 35% 90%)' }}
          >
            Transitus
          </span>

          {/* Mobile close */}
          <button
            onClick={closeSidebar}
            className="ml-auto rounded-md p-1.5 transition-colors lg:hidden"
            style={{ color: 'hsl(38 35% 90% / 0.6)' }}
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ----- Nav items ----- */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {NAV_ITEMS.map((item) => {
            const active = isActive(location.pathname, item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={closeSidebar}
                className={cn(
                  'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                )}
                style={{
                  color: active
                    ? 'hsl(38 35% 90%)'
                    : 'hsl(38 35% 90% / 0.6)',
                  backgroundColor: active
                    ? 'hsl(16 65% 48% / 0.15)'
                    : undefined,
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.color = 'hsl(38 35% 90%)';
                    e.currentTarget.style.backgroundColor =
                      'hsl(38 35% 90% / 0.06)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.color = 'hsl(38 35% 90% / 0.6)';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
                aria-current={active ? 'page' : undefined}
              >
                <Icon
                  className="h-5 w-5 shrink-0"
                  style={{
                    color: active
                      ? 'hsl(16 65% 48%)'
                      : 'hsl(38 35% 90% / 0.6)',
                  }}
                />
                <span>{item.label}</span>
                {/* Active indicator bar */}
                {active && (
                  <span
                    className="ml-auto h-5 w-0.5 rounded-full"
                    style={{ backgroundColor: 'hsl(16 65% 48%)' }}
                    aria-hidden="true"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* ----- Back to site ----- */}
        <div className="shrink-0 border-t px-3 py-4" style={{ borderColor: 'hsl(38 35% 90% / 0.1)' }}>
          <Link
            to="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
            style={{ color: 'hsl(38 35% 90% / 0.6)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'hsl(38 35% 90%)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'hsl(38 35% 90% / 0.6)';
            }}
          >
            <ArrowLeft className="h-5 w-5 shrink-0" />
            <span>Back to Site</span>
          </Link>
        </div>
      </aside>

      {/* ----------------------------------------------------------------- */}
      {/* Main content area                                                 */}
      {/* ----------------------------------------------------------------- */}
      <div className="flex min-h-screen flex-col transition-all duration-300 lg:pl-64">
        {/* ----- Top bar ----- */}
        <header
          className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-4 border-b px-4 md:px-6"
          style={{
            backgroundColor: 'hsl(38 30% 95%)',
            borderColor: 'hsl(38 35% 90%)',
          }}
        >
          {/* Mobile hamburger */}
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <h1
            className="font-serif text-lg font-medium tracking-tight md:text-xl"
            style={{ color: 'hsl(20 25% 12%)' }}
          >
            {resolvedTitle}
          </h1>
        </header>

        {/* ----- Page content ----- */}
        <main
          id="main-content"
          className="flex-1 overflow-auto p-4 md:p-6 lg:p-8"
          role="main"
        >
          {children}
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default TransitusLayout;
