import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { featureModules } from '@/content/features';
import {
  ArrowRight, MapPin, Users, Handshake, NotebookPen,
  Radio, BookOpen, Library, FileText, Database, Compass, Globe,
} from 'lucide-react';
import SeoHead from '@/components/seo/SeoHead';

const moduleIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  places: MapPin, stakeholders: Users, commitments: Handshake, fieldNotes: NotebookPen,
  signals: Radio, journeys: BookOpen, library: Library, reports: FileText,
};

export default function Features() {
  return (
    <div>
      <SeoHead
        title="Features — Transitus"
        description="Eight modules built for the actual work of just transition."
        canonical="/features"
      />

      {/* Hero */}
      <section className="relative overflow-hidden gradient-terrain text-[hsl(var(--transitus-sand))]">
        <div className="absolute inset-0 meridian-grid opacity-25" />
        <div className="absolute inset-0 contour-pattern opacity-20" />
        <div className="relative marketing-section text-center pb-20">
          <div className="inline-flex items-center gap-2 mb-6">
            <Compass className="h-5 w-5 text-[hsl(var(--transitus-amber))]" />
            <span className="font-sans text-xs font-semibold uppercase tracking-widest text-[hsl(var(--transitus-amber))]">The System</span>
          </div>
          <h1 className="marketing-heading text-white mb-4">Eight modules. One living record.</h1>
          <p className="marketing-subheading max-w-2xl mx-auto text-[hsl(var(--transitus-sand)/0.75)]">
            Transitus joins place intelligence, relationship memory, and narrative continuity into a single platform.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20" style={{ background: 'linear-gradient(to top, hsl(38 30% 95%), transparent)' }} />
      </section>

      <div className="h-1.5 gradient-heatmap" />

      {/* Feature Sections */}
      {featureModules.map((mod, i) => {
        const Icon = moduleIcons[mod.key] || MapPin;
        const isDark = i % 2 !== 0;
        return (
          <section
            key={mod.key}
            id={mod.key}
            className={isDark ? 'bg-[hsl(var(--transitus-earth))] text-[hsl(var(--transitus-sand))] relative' : 'bg-[hsl(var(--transitus-parchment))] relative'}
          >
            {isDark && <div className="absolute inset-0 meridian-grid opacity-10" />}
            {!isDark && <div className="absolute inset-0 contour-pattern opacity-40" />}
            <div className="relative marketing-section">
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${isDark ? 'bg-[hsl(var(--transitus-terracotta)/0.15)]' : 'bg-[hsl(var(--transitus-terracotta)/0.1)]'}`}>
                    <Icon className={`h-5 w-5 ${isDark ? 'text-[hsl(var(--transitus-terracotta))]' : 'text-[hsl(var(--transitus-terracotta))]'}`} />
                  </div>
                  <span className={`font-sans text-xs font-semibold uppercase tracking-widest ${isDark ? 'text-[hsl(var(--transitus-amber))]' : 'text-[hsl(var(--transitus-terracotta))]'}`}>
                    {mod.label}
                  </span>
                </div>

                <h2 className={`font-serif text-2xl sm:text-3xl leading-tight mb-4 ${isDark ? 'text-white' : 'text-[hsl(var(--marketing-earth))]'}`}>
                  {mod.headline}
                </h2>
                <p className={`font-serif-body text-base sm:text-lg leading-relaxed mb-8 ${isDark ? 'text-[hsl(var(--transitus-sand)/0.7)]' : 'text-[hsl(var(--marketing-earth)/0.7)]'}`}>
                  {mod.description}
                </p>

                <div className="space-y-3 mb-6">
                  {mod.details.map((detail, j) => (
                    <div key={j} className="flex items-start gap-3">
                      <div className={`shrink-0 w-1.5 h-1.5 rounded-full mt-2.5 ${isDark ? 'bg-[hsl(var(--transitus-amber))]' : 'bg-[hsl(var(--transitus-terracotta))]'}`} />
                      <p className={`text-sm leading-relaxed ${isDark ? 'text-[hsl(var(--transitus-sand)/0.6)]' : 'text-[hsl(var(--marketing-earth)/0.65)]'}`}>{detail}</p>
                    </div>
                  ))}
                </div>

                {mod.dataNote && (
                  <div className={`flex items-start gap-2.5 px-4 py-3 rounded-lg border ${isDark ? 'bg-[hsl(var(--transitus-ocean-deep)/0.2)] border-[hsl(var(--transitus-ocean)/0.2)]' : 'bg-[hsl(var(--transitus-ocean)/0.05)] border-[hsl(var(--transitus-ocean)/0.15)]'}`}>
                    <Database className={`h-4 w-4 mt-0.5 shrink-0 ${isDark ? 'text-[hsl(var(--transitus-ocean))]' : 'text-[hsl(var(--transitus-ocean))]'}`} />
                    <p className={`text-xs leading-relaxed ${isDark ? 'text-[hsl(var(--transitus-sand)/0.55)]' : 'text-[hsl(var(--marketing-earth)/0.55)]'}`}>{mod.dataNote}</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        );
      })}

      {/* CTA */}
      <section className="relative overflow-hidden gradient-terrain text-[hsl(var(--transitus-sand))]">
        <div className="absolute inset-0 meridian-grid opacity-15" />
        <div className="relative py-24 sm:py-28 text-center px-4">
          <Globe className="h-8 w-8 text-[hsl(var(--transitus-amber)/0.7)] mx-auto mb-6" />
          <h2 className="font-serif text-3xl sm:text-4xl text-white mb-4">Ready to hold the thread?</h2>
          <p className="font-serif-body text-lg text-[hsl(var(--transitus-sand)/0.65)] mb-8 max-w-lg mx-auto">
            Start with one place and see how Transitus turns scattered work into a living record.
          </p>
          <Link to="/pricing">
            <Button size="lg" className="rounded-full bg-[hsl(var(--transitus-terracotta))] text-white hover:bg-[hsl(var(--transitus-terracotta)/0.85)] px-8 h-13 text-base font-medium shadow-lg shadow-[hsl(var(--transitus-terracotta)/0.3)]">
              See pricing <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
