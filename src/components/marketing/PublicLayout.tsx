import { Link, Outlet, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { brand, modules } from '@/config/brand';
import { useState } from 'react';
import { footerLinks } from '@/content/marketing';
import {
  ArrowRight, Menu, X, ChevronDown,
  MapPin, Users, Handshake, NotebookPen,
  Radio, BookOpen, Library, FileText,
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
      {/* Sticky Nav */}
      <header className="sticky top-0 z-50 border-b border-[hsl(var(--marketing-border))] bg-white/92 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-serif text-2xl tracking-tight text-[hsl(var(--marketing-navy))]">
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
                    ? 'text-[hsl(var(--marketing-green))] font-medium'
                    : 'text-[hsl(var(--marketing-navy)/0.7)] hover:text-[hsl(var(--marketing-navy))]'
                }`}
              >
                Features <ChevronDown className="h-3.5 w-3.5" />
              </Link>

              {featuresOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50">
                  <div className="bg-white rounded-xl shadow-xl border border-[hsl(var(--marketing-border))] p-4 w-[340px] grid grid-cols-2 gap-1">
                    {Object.entries(modules).map(([key, mod]) => {
                      const Icon = moduleIcons[key] || MapPin;
                      return (
                        <Link
                          key={key}
                          to="/features"
                          className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg hover:bg-[hsl(var(--marketing-surface))] transition-colors"
                          onClick={() => setFeaturesOpen(false)}
                        >
                          <Icon className="h-4 w-4 mt-0.5 text-[hsl(var(--marketing-green))]" />
                          <div>
                            <div className="text-sm font-medium text-[hsl(var(--marketing-navy))]">{mod.label}</div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/pricing"
              className={`py-2 transition-colors ${
                isActive('/pricing')
                  ? 'text-[hsl(var(--marketing-green))] font-medium'
                  : 'text-[hsl(var(--marketing-navy)/0.7)] hover:text-[hsl(var(--marketing-navy))]'
              }`}
            >
              Pricing
            </Link>

            <Link
              to="/philosophy"
              className={`py-2 transition-colors ${
                isActive('/philosophy')
                  ? 'text-[hsl(var(--marketing-green))] font-medium'
                  : 'text-[hsl(var(--marketing-navy)/0.7)] hover:text-[hsl(var(--marketing-navy))]'
              }`}
            >
              Philosophy
            </Link>

            <Link
              to="/contact"
              className={`py-2 transition-colors ${
                isActive('/contact')
                  ? 'text-[hsl(var(--marketing-green))] font-medium'
                  : 'text-[hsl(var(--marketing-navy)/0.7)] hover:text-[hsl(var(--marketing-navy))]'
              }`}
            >
              Contact
            </Link>

            <Link to="/login">
              <Button
                size="sm"
                className="rounded-full bg-[hsl(var(--marketing-navy))] text-white hover:bg-[hsl(var(--marketing-navy)/0.9)] px-5 h-9 text-sm"
              >
                Log in
              </Button>
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 -mr-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-[hsl(var(--marketing-border))] bg-white">
            <div className="max-w-6xl mx-auto px-4 py-4 space-y-1">
              {[
                { to: '/features', label: 'Features' },
                { to: '/pricing', label: 'Pricing' },
                { to: '/philosophy', label: 'Philosophy' },
                { to: '/contact', label: 'Contact' },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block px-3 py-2.5 rounded-lg text-[hsl(var(--marketing-navy))] hover:bg-[hsl(var(--marketing-surface))]"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2">
                <Link to="/login" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full rounded-full bg-[hsl(var(--marketing-navy))] text-white">
                    Log in <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-white">
        {children || <Outlet />}
      </main>

      {/* Footer */}
      <footer className="border-t border-[hsl(var(--marketing-border))] bg-[hsl(var(--marketing-surface))]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 sm:gap-12">
            <div className="sm:col-span-1">
              <span className="font-serif text-xl tracking-tight text-[hsl(var(--marketing-navy))]">
                {brand.appName}
              </span>
              <p className="mt-3 text-sm text-[hsl(var(--marketing-navy)/0.6)] leading-relaxed max-w-xs">
                {brand.tagline}
              </p>
            </div>

            <div>
              <h4 className="font-sans text-xs font-semibold uppercase tracking-widest text-[hsl(var(--marketing-navy)/0.4)] mb-3">Product</h4>
              <ul className="space-y-2">
                {footerLinks.product.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="text-sm text-[hsl(var(--marketing-navy)/0.7)] hover:text-[hsl(var(--marketing-navy))] transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-sans text-xs font-semibold uppercase tracking-widest text-[hsl(var(--marketing-navy)/0.4)] mb-3">Company</h4>
              <ul className="space-y-2">
                {footerLinks.company.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="text-sm text-[hsl(var(--marketing-navy)/0.7)] hover:text-[hsl(var(--marketing-navy))] transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-sans text-xs font-semibold uppercase tracking-widest text-[hsl(var(--marketing-navy)/0.4)] mb-3">Legal</h4>
              <ul className="space-y-2">
                {footerLinks.legal.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="text-sm text-[hsl(var(--marketing-navy)/0.7)] hover:text-[hsl(var(--marketing-navy))] transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-[hsl(var(--marketing-border))]">
            <p className="text-xs text-[hsl(var(--marketing-navy)/0.4)]">
              &copy; {new Date().getFullYear()} Transitus. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
