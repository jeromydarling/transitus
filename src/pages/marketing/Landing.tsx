import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { hero, pillars, differentiators, archetypeCards, philosophyPreview } from '@/content/marketing';
import { featureModules } from '@/content/features';
import { pricingTiers } from '@/content/pricing';
import { archetypes } from '@/config/brand';
import {
  ArrowRight, Heart, MapPin, BookOpen, Check,
  Users, Handshake, NotebookPen, Radio, Library, FileText,
} from 'lucide-react';
import type { ArchetypeKey } from '@/config/brand';
import SeoHead from '@/components/seo/SeoHead';

const pillarIcons = [Heart, MapPin, BookOpen];

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

export default function Landing() {
  return (
    <div className="bg-white">
      <SeoHead
        title="Transitus \u2014 The Operating System for Places Under Change"
        description="Relationship memory for environmental and civic transition work. A stewardship platform for communities, coalitions, and the places they hold in trust."
        keywords={['just transition', 'environmental justice', 'place-based', 'relationship memory', 'civic technology', 'Transitus']}
        canonical="/"
      />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-terrain opacity-[0.06]" />
        <div className="absolute inset-0 contour-pattern" />
        <div className="relative max-w-[780px] mx-auto px-4 sm:px-6 pt-20 sm:pt-32 pb-20 sm:pb-28 text-center">
          <h1 className="font-serif text-4xl sm:text-5xl md:text-[3.5rem] text-[hsl(var(--marketing-navy))] leading-[1.08] tracking-tight mb-6">
            {hero.title}
          </h1>
          <p className="font-serif-body text-lg sm:text-xl text-[hsl(var(--marketing-navy)/0.8)] max-w-2xl mx-auto mb-4 leading-relaxed">
            {hero.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-10">
            <Link to="/pricing">
              <Button size="lg" className="rounded-full bg-[hsl(var(--marketing-navy))] text-white hover:bg-[hsl(var(--marketing-navy)/0.9)] px-8 h-12 text-base font-medium">
                {hero.ctaPrimary} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/features">
              <Button variant="outline" size="lg" className="rounded-full border-[hsl(var(--marketing-navy)/0.2)] text-[hsl(var(--marketing-navy))] hover:bg-[hsl(var(--marketing-surface))] px-8 h-12 text-base">
                {hero.ctaSecondary}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <div className="h-1 gradient-heatmap opacity-40" />

      {/* Three Pillars */}
      <section className="marketing-section">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <h2 className="marketing-heading mb-4">Place. Relationship. Story.</h2>
          <p className="marketing-subheading">Three layers that most tools keep separate. Transitus joins them.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 sm:gap-10">
          {pillars.map((pillar, i) => {
            const Icon = pillarIcons[i];
            return (
              <div key={pillar.title} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[hsl(var(--marketing-green)/0.1)] mb-5">
                  <Icon className="h-5 w-5 text-[hsl(var(--marketing-green))]" />
                </div>
                <h3 className="font-serif text-xl text-[hsl(var(--marketing-navy))] mb-3">{pillar.title}</h3>
                <p className="font-serif-body text-[hsl(var(--marketing-navy)/0.7)] leading-relaxed">{pillar.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 8 Modules */}
      <section className="bg-[hsl(var(--marketing-surface))] relative">
        <div className="absolute inset-0 dot-grid opacity-50" />
        <div className="relative marketing-section">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <h2 className="marketing-heading mb-4">What Transitus holds</h2>
            <p className="marketing-subheading">Eight modules built for the actual work of just transition.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featureModules.map((mod) => {
              const Icon = moduleIcons[mod.key] || MapPin;
              return (
                <Link key={mod.key} to="/features" className="editorial-card group hover:border-[hsl(var(--marketing-green)/0.3)]">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-9 h-9 rounded-lg bg-[hsl(var(--marketing-green)/0.08)] flex items-center justify-center">
                      <Icon className="h-4 w-4 text-[hsl(var(--marketing-green))]" />
                    </div>
                    <div>
                      <h3 className="font-sans text-sm font-semibold text-[hsl(var(--marketing-navy))] mb-1 group-hover:text-[hsl(var(--marketing-green))] transition-colors">
                        {mod.label}
                      </h3>
                      <p className="text-xs text-[hsl(var(--marketing-navy)/0.6)] leading-relaxed">
                        {mod.headline.replace(/\.$/, '')}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Differentiators */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 contour-pattern opacity-50" />
        <div className="relative marketing-section">
          <div className="max-w-3xl mx-auto">
            <h2 className="marketing-heading text-center mb-10">{differentiators.headline}</h2>
            <div className="space-y-5">
              {differentiators.bullets.map((bullet, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-[hsl(var(--marketing-green)/0.12)] flex items-center justify-center mt-0.5">
                    <Check className="h-3.5 w-3.5 text-[hsl(var(--marketing-green))]" />
                  </div>
                  <p className="font-serif-body text-base sm:text-lg text-[hsl(var(--marketing-navy)/0.8)] leading-relaxed">{bullet}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Archetypes */}
      <section className="bg-[hsl(var(--marketing-surface))]">
        <div className="marketing-section">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <h2 className="marketing-heading mb-4">Who this is for</h2>
            <p className="marketing-subheading">Not environmentalists in general. The people holding the middle.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {archetypeCards.map((card) => {
              const arch = archetypes[card.key as ArchetypeKey];
              return (
                <div key={card.key} className="editorial-card">
                  <h3 className="font-sans text-sm font-semibold text-[hsl(var(--marketing-navy))] mb-2">{arch.name}</h3>
                  <p className="font-serif-body text-sm text-[hsl(var(--marketing-navy)/0.65)] leading-relaxed">{arch.tagline}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Philosophy Preview */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-terrain opacity-[0.03]" />
        <div className="relative marketing-section">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="marketing-heading mb-6">{philosophyPreview.headline}</h2>
            <p className="font-serif-body text-base sm:text-lg text-[hsl(var(--marketing-navy)/0.75)] leading-relaxed mb-8">
              {philosophyPreview.body}
            </p>
            <Link to="/philosophy">
              <Button variant="outline" className="rounded-full border-[hsl(var(--marketing-navy)/0.2)] text-[hsl(var(--marketing-navy))] hover:bg-[hsl(var(--marketing-surface))] px-6">
                {philosophyPreview.cta} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="bg-[hsl(var(--marketing-surface))]">
        <div className="marketing-section">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <h2 className="marketing-heading mb-4">Simple, place-based pricing</h2>
            <p className="marketing-subheading">Pay by the places you steward, not the seats you fill.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {pricingTiers.map((tier) => (
              <div key={tier.key} className={`editorial-card text-center ${tier.highlighted ? 'ring-2 ring-[hsl(var(--marketing-green))] border-[hsl(var(--marketing-green)/0.3)]' : ''}`}>
                <h3 className="font-sans text-sm font-semibold text-[hsl(var(--marketing-navy))] mb-1">{tier.name}</h3>
                <p className="text-xs text-[hsl(var(--marketing-navy)/0.5)] mb-4">{tier.tagline}</p>
                <div className="mb-4">
                  <span className="font-serif text-3xl text-[hsl(var(--marketing-navy))]">{tier.price}</span>
                  <span className="text-sm text-[hsl(var(--marketing-navy)/0.5)]">{tier.priceSuffix}</span>
                </div>
                <Link to="/pricing">
                  <Button
                    variant={tier.highlighted ? 'default' : 'outline'}
                    className={`rounded-full w-full text-sm ${tier.highlighted ? 'bg-[hsl(var(--marketing-navy))] text-white hover:bg-[hsl(var(--marketing-navy)/0.9)]' : 'border-[hsl(var(--marketing-navy)/0.2)] text-[hsl(var(--marketing-navy))]'}`}
                  >
                    {tier.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-terrain opacity-[0.08]" />
        <div className="absolute inset-0 contour-pattern" />
        <div className="relative py-20 sm:py-28 text-center px-4">
          <h2 className="font-serif text-3xl sm:text-4xl text-[hsl(var(--marketing-navy))] mb-4">Every place deserves memory.</h2>
          <p className="font-serif-body text-lg text-[hsl(var(--marketing-navy)/0.7)] mb-8 max-w-lg mx-auto">
            Start with one place. See what becomes possible when communities stop losing the thread.
          </p>
          <Link to="/pricing">
            <Button size="lg" className="rounded-full bg-[hsl(var(--marketing-navy))] text-white hover:bg-[hsl(var(--marketing-navy)/0.9)] px-8 h-12 text-base font-medium">
              Start with one place <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
