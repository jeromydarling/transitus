import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { featureModules } from '@/content/features';
import {
  ArrowRight, MapPin, Users, Handshake, NotebookPen,
  Radio, BookOpen, Library, FileText, Database,
} from 'lucide-react';
import SeoHead from '@/components/seo/SeoHead';

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

export default function Features() {
  return (
    <div className="bg-white">
      <SeoHead
        title="Features \u2014 Transitus"
        description="Eight modules built for the actual work of just transition: Places, People, Commitments, Field Notes, Signals, Journeys, Library, and Reports."
        canonical="/features"
      />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 contour-pattern" />
        <div className="relative marketing-section text-center">
          <h1 className="marketing-heading mb-4">Eight modules. One living record.</h1>
          <p className="marketing-subheading max-w-2xl mx-auto">
            Transitus joins place intelligence, relationship memory, and narrative continuity into a single platform
            for environmental and civic transition work.
          </p>
        </div>
      </section>

      <div className="h-px bg-[hsl(var(--marketing-border))]" />

      {/* Feature Sections */}
      {featureModules.map((mod, i) => {
        const Icon = moduleIcons[mod.key] || MapPin;
        const isEven = i % 2 === 0;
        return (
          <section
            key={mod.key}
            id={mod.key}
            className={isEven ? 'bg-white' : 'bg-[hsl(var(--marketing-surface))]'}
          >
            <div className="marketing-section">
              <div className="max-w-3xl mx-auto">
                {/* Module header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[hsl(var(--marketing-green)/0.1)] flex items-center justify-center">
                    <Icon className="h-5 w-5 text-[hsl(var(--marketing-green))]" />
                  </div>
                  <span className="font-sans text-xs font-semibold uppercase tracking-widest text-[hsl(var(--marketing-green))]">
                    {mod.label}
                  </span>
                </div>

                <h2 className="font-serif text-2xl sm:text-3xl text-[hsl(var(--marketing-navy))] leading-tight mb-4">
                  {mod.headline}
                </h2>

                <p className="font-serif-body text-base sm:text-lg text-[hsl(var(--marketing-navy)/0.75)] leading-relaxed mb-8">
                  {mod.description}
                </p>

                {/* Details list */}
                <div className="space-y-3 mb-6">
                  {mod.details.map((detail, j) => (
                    <div key={j} className="flex items-start gap-3">
                      <div className="shrink-0 w-1.5 h-1.5 rounded-full bg-[hsl(var(--marketing-green))] mt-2.5" />
                      <p className="text-sm text-[hsl(var(--marketing-navy)/0.7)] leading-relaxed">{detail}</p>
                    </div>
                  ))}
                </div>

                {/* Data note */}
                {mod.dataNote && (
                  <div className="flex items-start gap-2.5 px-4 py-3 rounded-lg bg-[hsl(var(--marketing-green)/0.05)] border border-[hsl(var(--marketing-green)/0.1)]">
                    <Database className="h-4 w-4 text-[hsl(var(--marketing-green))] mt-0.5 shrink-0" />
                    <p className="text-xs text-[hsl(var(--marketing-navy)/0.6)] leading-relaxed">{mod.dataNote}</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        );
      })}

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-terrain opacity-[0.06]" />
        <div className="absolute inset-0 contour-pattern" />
        <div className="relative py-20 sm:py-28 text-center px-4">
          <h2 className="font-serif text-3xl sm:text-4xl text-[hsl(var(--marketing-navy))] mb-4">
            Ready to hold the thread?
          </h2>
          <p className="font-serif-body text-lg text-[hsl(var(--marketing-navy)/0.7)] mb-8 max-w-lg mx-auto">
            Start with one place and see how Transitus turns scattered work into a living record of transition.
          </p>
          <Link to="/pricing">
            <Button size="lg" className="rounded-full bg-[hsl(var(--marketing-navy))] text-white hover:bg-[hsl(var(--marketing-navy)/0.9)] px-8 h-12 text-base font-medium">
              See pricing <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
