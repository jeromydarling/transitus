import { Link, Outlet, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { brand, modules } from '@/config/brand';
import { useState } from 'react';
import { footerLinks } from '@/content/marketing';
import {
  ArrowRight, Menu, X, ChevronDown, Globe,
  MapPin, Users, Handshake, NotebookPen,
  Radio, BookOpen, Library, FileText, Compass, Leaf,
} from 'lucide-react';

const moduleIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  places: MapPin,
  stakeholders: Users,
  commitments: Handshake,
  fieldNotes: NotebookPen,
  signals: Radio,
  journeys: BookOpen,
  library: Library,
  reports: FileText,
};

export default function PublicLayout({ children }: { children?: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-[hsl(var(--marketing-border))] bg-[hsl(var(--transitus-parchment)/0.95)] backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo with Globe */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-full bg-[hsl(var(--transitus-forest))] flex items-center justify-center group-hover:bg-[hsl(var(--transitus-green))] transition-colors">
              <Globe className="h-5 w-5 text-[hsl(var(--transitus-amber))]" />
            </div>
            <span className="font-serif text-[1.4rem] tracking-tight text-[hsl(var(--marketing-earth))]">
              {brand.appName}
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7 text-sm">
            <div
              className="relative"
              onMouseEnter={() => setFeaturesOpen(true)}
              onMouseLeave={() => setFeaturesOpen(false)}
            >
              <Link
                to="/features"
                className={`flex items-center gap-1 py-2 transition-colors ${
                  isActive('/features')
                    ? 'text-[hsl(var(--transitus-terracotta))] font-medium'
                    : 'text-[hsl(var(--marketing-earth)/0.65)] hover:text-[hsl(var(--marketing-earth))]'
                }`}
              >
                <Compass className="h-3.5 w-3.5" />
                Features <ChevronDown className="h-3 w-3" />
              </Link>

              {featuresOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50">
                  <div className="bg-[hsl(var(--transitus-parchment))] rounded-xl shadow-xl border border-[hsl(var(--marketing-border))] p-4 w-[380px] grid grid-cols-2 gap-1">
                    {Object.entries(modules).map(([key, mod]) => {
                      const Icon = moduleIcons[key] || MapPin;
                      return (
                        <Link
                          key={key}
                          to="/features"
                          className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg hover:bg-[hsl(var(--transitus-sand))] transition-colors"
                          onClick={() => setFeaturesOpen(false)}
                        >
                          <Icon className="h-4 w-4 mt-0.5 text-[hsl(var(--transitus-terracotta))]" />
                          <div>
                            <div className="text-sm font-medium text-[hsl(var(--marketing-earth))]">{mod.label}</div>
                            <div className="text-[10px] text-[hsl(var(--marketing-earth)/0.5)] leading-tight mt-0.5">{mod.description.split('.')[0]}</div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {[
              { to: '/pricing', label: 'Pricing', icon: Leaf },
              { to: '/philosophy', label: 'Philosophy', icon: BookOpen },
              { to: '/contact', label: 'Contact', icon: Globe },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-1.5 py-2 transition-colors ${
                  isActive(link.to)
                    ? 'text-[hsl(var(--transitus-terracotta))] font-medium'
                    : 'text-[hsl(var(--marketing-earth)/0.65)] hover:text-[hsl(var(--marketing-earth))]'
                }`}
              >
                <link.icon className="h-3.5 w-3.5" />
                {link.label}
              </Link>
            ))}

            <Link to="/login">
              <Button
                size="sm"
                className="rounded-full bg-[hsl(var(--transitus-forest))] text-[hsl(var(--transitus-sand))] hover:bg-[hsl(var(--transitus-green))] px-5 h-9 text-sm"
              >
                Log in
              </Button>
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button className="md:hidden p-2 -mr-2" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-[hsl(var(--marketing-border))] bg-[hsl(var(--transitus-parchment))]">
            <div className="max-w-6xl mx-auto px-4 py-4 space-y-1">
              {[
                { to: '/features', label: 'Features', icon: Compass },
                { to: '/pricing', label: 'Pricing', icon: Leaf },
                { to: '/philosophy', label: 'Philosophy', icon: BookOpen },
                { to: '/contact', label: 'Contact', icon: Globe },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[hsl(var(--marketing-earth))] hover:bg-[hsl(var(--transitus-sand))]"
                  onClick={() => setMobileOpen(false)}
                >
                  <link.icon className="h-4 w-4 text-[hsl(var(--transitus-terracotta))]" />
                  {link.label}
                </Link>
              ))}
              <div className="pt-3">
                <Link to="/login" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full rounded-full bg-[hsl(var(--transitus-forest))] text-[hsl(var(--transitus-sand))]">
                    Log in <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main */}
      <main className="flex-1">
        {children || <Outlet />}
      </main>

      {/* Footer — dark earth */}
      <footer className="bg-[hsl(var(--transitus-earth))] text-[hsl(var(--transitus-sand))]">
        {/* Heatmap accent strip */}
        <div className="h-1 gradient-heatmap" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 sm:gap-12">
            <div className="sm:col-span-1">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-full bg-[hsl(var(--transitus-forest))] flex items-center justify-center">
                  <Globe className="h-4 w-4 text-[hsl(var(--transitus-amber))]" />
                </div>
                <span className="font-serif text-xl tracking-tight">{brand.appName}</span>
              </div>
              <p className="text-sm text-[hsl(var(--transitus-sand)/0.55)] leading-relaxed max-w-xs">
                {brand.tagline}
              </p>
            </div>

            {[
              { title: 'Product', links: footerLinks.product },
              { title: 'Company', links: footerLinks.company },
              { title: 'Legal', links: footerLinks.legal },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-sans text-xs font-semibold uppercase tracking-widest text-[hsl(var(--transitus-terracotta)/0.7)] mb-3">
                  {col.title}
                </h4>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link.to}>
                      <Link to={link.to} className="text-sm text-[hsl(var(--transitus-sand)/0.6)] hover:text-[hsl(var(--transitus-sand))] transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-6 border-t border-[hsl(var(--transitus-clay)/0.4)]">
            <p className="text-xs text-[hsl(var(--transitus-sand)/0.35)]">
              &copy; {new Date().getFullYear()} Transitus. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
