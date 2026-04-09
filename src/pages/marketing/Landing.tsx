import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { hero, pillars, differentiators, archetypeCards, philosophyPreview } from '@/content/marketing';
import { featureModules } from '@/content/features';
import { pricingTiers } from '@/content/pricing';
import { archetypes } from '@/config/brand';
import {
  ArrowRight, Heart, MapPin, BookOpen, Check, Globe,
  Users, Handshake, NotebookPen, Radio, Library, FileText,
  Mountain, Waves, TreePine, Compass, Layers, Eye, Leaf,
  Building2, Landmark, Sprout, Scale, Church, Calendar,
} from 'lucide-react';
import type { ArchetypeKey } from '@/config/brand';
import SeoHead from '@/components/seo/SeoHead';

const pillarIcons = [Heart, MapPin, BookOpen];
const moduleIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  places: MapPin, stakeholders: Users, commitments: Handshake, fieldNotes: NotebookPen,
  signals: Radio, journeys: BookOpen, library: Library, reports: FileText,
};
const archetypeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  ej_coalition: Scale, faith_investor: Landmark, community_land_trust: Sprout,
  urban_farm_network: Leaf, diocesan_program: Church, municipal_resilience: Building2,
};

export default function Landing() {
  return (
    <div>
      <SeoHead
        title="Transitus — The Operating System for Places Under Change"
        description="Relationship memory for environmental and civic transition work."
        keywords={['just transition', 'environmental justice', 'place-based', 'Transitus']}
        canonical="/"
      />

      {/* HERO — Dark terrain, dramatic */}
      <section className="relative overflow-hidden gradient-terrain text-[hsl(var(--transitus-sand))]">
        <div className="absolute inset-0 opacity-30 contour-pattern" />
        <div className="absolute inset-0 meridian-grid opacity-40" />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 40%, hsl(38 80% 55% / 0.08) 0%, transparent 70%)' }} />
        <div className="relative max-w-[820px] mx-auto px-4 sm:px-6 pt-24 sm:pt-36 pb-24 sm:pb-36 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[hsl(var(--transitus-amber)/0.25)] bg-[hsl(var(--transitus-amber)/0.08)] mb-8">
            <Globe className="h-4 w-4 text-[hsl(var(--transitus-amber))]" />
            <span className="text-xs font-medium tracking-wider uppercase text-[hsl(var(--transitus-amber))]">Stewardship Platform</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-[3.75rem] leading-[1.06] tracking-tight mb-6 text-white">{hero.title}</h1>
          <p className="font-serif-body text-lg sm:text-xl text-[hsl(var(--transitus-sand)/0.8)] max-w-2xl mx-auto leading-relaxed mb-10">{hero.subtitle}</p>
          <blockquote className="mt-8 max-w-xl mx-auto font-serif-body text-base italic text-[hsl(var(--transitus-sand)/0.7)] border-l-2 border-[hsl(var(--transitus-terracotta)/0.4)] pl-4">
            "The people breathing the worst air are the ones with the least political power and the fewest resources to move."
          </blockquote>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link to="/pricing">
              <Button size="lg" className="rounded-full bg-[hsl(var(--transitus-terracotta))] text-white hover:bg-[hsl(var(--transitus-terracotta)/0.85)] px-8 h-13 text-base font-medium shadow-lg shadow-[hsl(var(--transitus-terracotta)/0.3)]">
                {hero.ctaPrimary} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/features">
              <Button variant="outline" size="lg" className="rounded-full border-[hsl(var(--transitus-sand)/0.25)] text-[hsl(var(--transitus-sand))] hover:bg-[hsl(var(--transitus-sand)/0.08)] px-8 h-13 text-base bg-transparent">
                <Compass className="mr-2 h-4 w-4" /> {hero.ctaSecondary}
              </Button>
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24" style={{ background: 'linear-gradient(to top, hsl(38 30% 95%), transparent)' }} />
      </section>

      <div className="h-1.5 gradient-heatmap" />

      {/* THREE PILLARS */}
      <section className="bg-[hsl(var(--transitus-parchment))]">
        <div className="marketing-section">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4">
              <Layers className="h-5 w-5 text-[hsl(var(--transitus-terracotta))]" />
              <span className="font-sans text-xs font-semibold uppercase tracking-widest text-[hsl(var(--transitus-terracotta))]">Three layers, joined</span>
            </div>
            <h2 className="marketing-heading text-[hsl(var(--marketing-earth))] mb-4">Place. Relationship. Story.</h2>
            <p className="marketing-subheading text-[hsl(var(--marketing-earth)/0.65)]">Three layers that most tools keep separate. Transitus joins them.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {pillars.map((pillar, i) => {
              const Icon = pillarIcons[i];
              const colors = [
                'from-[hsl(var(--transitus-forest))] to-[hsl(var(--transitus-green))]',
                'from-[hsl(var(--transitus-ocean-deep))] to-[hsl(var(--transitus-ocean))]',
                'from-[hsl(var(--transitus-terracotta-deep))] to-[hsl(var(--transitus-terracotta))]',
              ];
              return (
                <div key={pillar.title} className="editorial-card text-center group">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${colors[i]} mb-5 shadow-md group-hover:scale-105 transition-transform`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-serif text-xl text-[hsl(var(--marketing-earth))] mb-3">{pillar.title}</h3>
                  <p className="font-serif-body text-sm text-[hsl(var(--marketing-earth)/0.6)] leading-relaxed">{pillar.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8 MODULES — dark earth */}
      <section className="bg-[hsl(var(--transitus-earth))] text-[hsl(var(--transitus-sand))] relative">
        <div className="absolute inset-0 meridian-grid opacity-20" />
        <div className="absolute inset-0 contour-pattern opacity-20" />
        <div className="relative marketing-section">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4">
              <Compass className="h-5 w-5 text-[hsl(var(--transitus-amber))]" />
              <span className="font-sans text-xs font-semibold uppercase tracking-widest text-[hsl(var(--transitus-amber))]">The System</span>
            </div>
            <h2 className="marketing-heading text-white mb-4">What Transitus holds</h2>
            <p className="marketing-subheading text-[hsl(var(--transitus-sand)/0.65)]">Eight modules built for the actual work of just transition.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featureModules.map((mod) => {
              const Icon = moduleIcons[mod.key] || MapPin;
              return (
                <Link key={mod.key} to="/features" className="editorial-card-dark group">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-10 h-10 rounded-xl bg-[hsl(var(--transitus-terracotta)/0.15)] flex items-center justify-center group-hover:bg-[hsl(var(--transitus-terracotta)/0.25)] transition-colors">
                      <Icon className="h-5 w-5 text-[hsl(var(--transitus-terracotta))]" />
                    </div>
                    <div>
                      <h3 className="font-sans text-sm font-semibold text-[hsl(var(--transitus-sand))] mb-1 group-hover:text-[hsl(var(--transitus-amber))] transition-colors">{mod.label}</h3>
                      <p className="text-xs text-[hsl(var(--transitus-sand)/0.5)] leading-relaxed">{mod.headline.replace(/\.$/, '')}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* DIFFERENTIATORS */}
      <section className="bg-[hsl(var(--transitus-parchment))] relative overflow-hidden">
        <div className="absolute inset-0 contour-pattern" />
        <div className="relative marketing-section">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="h-5 w-5 text-[hsl(var(--transitus-ocean))]" />
              <span className="font-sans text-xs font-semibold uppercase tracking-widest text-[hsl(var(--transitus-ocean))]">A Different Kind of Tool</span>
            </div>
            <h2 className="marketing-heading text-[hsl(var(--marketing-earth))] mb-10">{differentiators.headline}</h2>
            <div className="space-y-5">
              {differentiators.bullets.map((bullet, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-white/60 border border-[hsl(var(--marketing-border)/0.5)]">
                  <div className="shrink-0 w-8 h-8 rounded-lg bg-[hsl(var(--transitus-forest)/0.1)] flex items-center justify-center mt-0.5">
                    <Check className="h-4 w-4 text-[hsl(var(--transitus-forest))]" />
                  </div>
                  <p className="font-serif-body text-base text-[hsl(var(--marketing-earth)/0.75)] leading-relaxed">{bullet}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ARCHETYPES — dark terrain */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-terrain opacity-90" />
        <div className="absolute inset-0 meridian-grid opacity-15" />
        <div className="relative marketing-section text-[hsl(var(--transitus-sand))]">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4">
              <Mountain className="h-5 w-5 text-[hsl(var(--transitus-amber))]" />
              <span className="font-sans text-xs font-semibold uppercase tracking-widest text-[hsl(var(--transitus-amber))]">Who This Is For</span>
            </div>
            <h2 className="marketing-heading text-white mb-4">The people holding the middle</h2>
            <p className="marketing-subheading text-[hsl(var(--transitus-sand)/0.7)]">The stewards, organizers, investors, and communities doing the hard relational work of transition.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {archetypeCards.map((card) => {
              const arch = archetypes[card.key as ArchetypeKey];
              const Icon = archetypeIcons[card.key] || Globe;
              return (
                <div key={card.key} className="editorial-card-dark group">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-10 h-10 rounded-xl bg-[hsl(var(--transitus-amber)/0.12)] flex items-center justify-center">
                      <Icon className="h-5 w-5 text-[hsl(var(--transitus-amber))]" />
                    </div>
                    <div>
                      <h3 className="font-sans text-sm font-semibold text-[hsl(var(--transitus-sand))] mb-1.5 group-hover:text-[hsl(var(--transitus-amber))] transition-colors">{arch.name}</h3>
                      <p className="font-serif-body text-xs text-[hsl(var(--transitus-sand)/0.55)] leading-relaxed">{arch.tagline}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PHILOSOPHY PREVIEW */}
      <section className="bg-[hsl(var(--transitus-parchment))] relative overflow-hidden">
        <div className="absolute inset-0 contour-pattern opacity-70" />
        <div className="relative marketing-section">
          <div className="max-w-2xl mx-auto text-center">
            <TreePine className="h-8 w-8 text-[hsl(var(--transitus-forest))] mx-auto mb-6" />
            <h2 className="font-serif text-3xl sm:text-4xl text-[hsl(var(--marketing-earth))] mb-6 leading-tight">{philosophyPreview.headline}</h2>
            <p className="font-serif-body text-base sm:text-lg text-[hsl(var(--marketing-earth)/0.65)] leading-relaxed mb-8">{philosophyPreview.body}</p>
            <Link to="/philosophy">
              <Button variant="outline" className="rounded-full border-[hsl(var(--transitus-forest)/0.3)] text-[hsl(var(--transitus-forest))] hover:bg-[hsl(var(--transitus-forest)/0.05)] px-6">
                <BookOpen className="mr-2 h-4 w-4" /> {philosophyPreview.cta}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* SEASONAL RHYTHM */}
      <section className="bg-[hsl(var(--transitus-earth))] text-[hsl(var(--transitus-sand))] relative">
        <div className="absolute inset-0 meridian-grid opacity-15" />
        <div className="relative marketing-section">
          <div className="max-w-3xl mx-auto text-center">
            <Calendar className="h-8 w-8 text-[hsl(var(--transitus-amber))] mx-auto mb-6" />
            <h2 className="marketing-heading text-white mb-4">Built for the rhythm of real work</h2>
            <p className="marketing-subheading text-[hsl(var(--transitus-sand)/0.7)] mb-8">
              Just Transition doesn't follow sprints. It follows seasons — preparation, reckoning, breakthrough, and the long faithful labor that connects them. Transitus knows which season you're in and adjusts its posture to match.
            </p>
            <div className="grid sm:grid-cols-4 gap-4 text-left">
              {([
                ['Preparation', 'The year turns. Review what was promised. Prepare for the work ahead.'],
                ['Reckoning', 'Face what\u2019s broken honestly. Which commitments were breached? What needs repair?'],
                ['Breakthrough', 'Something shifted that nobody expected. New life from what looked dead.'],
                ['The Long Work', 'The majority of the year. Daily faithfulness, accompaniment, and patience.'],
              ] as const).map(([name, desc]) => (
                <div key={name} className="editorial-card-dark p-4">
                  <h3 className="text-sm font-semibold text-[hsl(var(--transitus-amber))]">{name}</h3>
                  <p className="text-xs text-[hsl(var(--transitus-sand)/0.5)] mt-1">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* THE REAL COST — comparison section */}
      <section className="bg-[hsl(var(--transitus-parchment))] relative overflow-hidden">
        <div className="absolute inset-0 contour-pattern opacity-40" />
        <div className="relative marketing-section">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Eye className="h-8 w-8 text-[hsl(var(--transitus-terracotta))] mx-auto mb-5" />
              <h2 className="marketing-heading text-[hsl(var(--marketing-earth))] mb-4">What your team is doing now costs more than you think</h2>
              <p className="marketing-subheading text-[hsl(var(--marketing-earth)/0.6)] max-w-2xl mx-auto">
                Most environmental justice organizations piece together 5–8 tools to do what Transitus does in one place. Here's what that actually costs in time, money, and lost institutional memory.
              </p>
            </div>

            {/* Comparison Table */}
            <div className="rounded-xl border border-[hsl(30_18%_82%)] overflow-hidden mb-10">
              {/* Header */}
              <div className="grid grid-cols-3 bg-[hsl(var(--transitus-earth))] text-[hsl(var(--transitus-sand))]">
                <div className="p-4 text-xs font-semibold uppercase tracking-widest">What you need</div>
                <div className="p-4 text-xs font-semibold uppercase tracking-widest text-center border-l border-[hsl(38_35%_90%/0.1)]">Current patchwork</div>
                <div className="p-4 text-xs font-semibold uppercase tracking-widest text-center border-l border-[hsl(38_35%_90%/0.1)]" style={{ color: 'hsl(38 80% 55%)' }}>Transitus</div>
              </div>
              {/* Rows */}
              {[
                ['Stakeholder tracking', 'Spreadsheets + email threads', 'Built in'],
                ['Environmental data', 'EJScreen + manual research', 'Auto-layered on every place'],
                ['Commitment tracking', 'Shared docs + meeting notes', 'Living status with community voice'],
                ['Field documentation', 'Text messages + notebooks', 'Geotagged notes with consent'],
                ['Signal monitoring', 'Google Alerts + RSS + manual', 'EPA, NOAA, permits in one feed'],
                ['Narrative reports', 'Hours of manual writing', 'Generated from your field data'],
                ['Community stories', 'Scattered across drives', 'Consent-managed, place-linked'],
                ['Institutional memory', 'Lost when people leave', 'Preserved across leadership changes'],
              ].map(([need, current, transitus], i) => (
                <div key={i} className={`grid grid-cols-3 ${i % 2 === 0 ? 'bg-white' : 'bg-[hsl(38_30%_97%)]'}`}>
                  <div className="p-3.5 text-sm font-medium text-[hsl(var(--marketing-earth))]">{need}</div>
                  <div className="p-3.5 text-sm text-[hsl(var(--marketing-earth)/0.5)] text-center border-l border-[hsl(30_18%_82%/0.5)]">{current}</div>
                  <div className="p-3.5 text-sm font-medium text-[hsl(var(--transitus-forest))] text-center border-l border-[hsl(30_18%_82%/0.5)]">{transitus}</div>
                </div>
              ))}
            </div>

            {/* Time/money comparison */}
            <div className="grid sm:grid-cols-3 gap-5 mb-10">
              <div className="rounded-xl bg-white border border-[hsl(30_18%_82%)] p-5 text-center">
                <p className="font-serif text-3xl text-[hsl(0_50%_45%)] mb-1">15–20 hrs</p>
                <p className="text-xs text-[hsl(var(--marketing-earth)/0.5)]">per week managing scattered tools</p>
                <div className="mt-3 h-px bg-[hsl(30_18%_82%)]" />
                <p className="mt-3 font-serif text-3xl text-[hsl(var(--transitus-forest))]">3–5 hrs</p>
                <p className="text-xs text-[hsl(var(--marketing-earth)/0.5)]">with Transitus</p>
              </div>
              <div className="rounded-xl bg-white border border-[hsl(30_18%_82%)] p-5 text-center">
                <p className="font-serif text-3xl text-[hsl(0_50%_45%)] mb-1">$800+</p>
                <p className="text-xs text-[hsl(var(--marketing-earth)/0.5)]">per month in tool subscriptions</p>
                <div className="mt-3 h-px bg-[hsl(30_18%_82%)]" />
                <p className="mt-3 font-serif text-3xl text-[hsl(var(--transitus-forest))]">$150</p>
                <p className="text-xs text-[hsl(var(--marketing-earth)/0.5)]">per month, everything included</p>
              </div>
              <div className="rounded-xl bg-white border border-[hsl(30_18%_82%)] p-5 text-center">
                <p className="font-serif text-3xl text-[hsl(0_50%_45%)] mb-1">100%</p>
                <p className="text-xs text-[hsl(var(--marketing-earth)/0.5)]">of memory lost when staff turns over</p>
                <div className="mt-3 h-px bg-[hsl(30_18%_82%)]" />
                <p className="mt-3 font-serif text-3xl text-[hsl(var(--transitus-forest))]">0%</p>
                <p className="text-xs text-[hsl(var(--marketing-earth)/0.5)]">Transitus remembers everything</p>
              </div>
            </div>

            {/* The real cost callout */}
            <div className="rounded-xl bg-[hsl(var(--transitus-earth))] text-[hsl(var(--transitus-sand))] p-6 sm:p-8 text-center">
              <p className="font-serif-body text-base sm:text-lg leading-relaxed text-[hsl(var(--transitus-sand)/0.8)] max-w-2xl mx-auto">
                The most expensive tool is the one that <span className="text-[hsl(var(--transitus-amber))] font-medium">loses your community's story</span> when a staff member moves on.
                The second most expensive is the one that <span className="text-[hsl(var(--transitus-amber))] font-medium">makes your team spend more time managing software than accompanying people</span>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING PREVIEW */}
      <section className="bg-[hsl(var(--transitus-sand))]">
        <div className="marketing-section">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <div className="inline-flex items-center gap-2 mb-4">
              <Leaf className="h-5 w-5 text-[hsl(var(--transitus-forest))]" />
              <span className="font-sans text-xs font-semibold uppercase tracking-widest text-[hsl(var(--transitus-forest))]">Pricing</span>
            </div>
            <h2 className="marketing-heading text-[hsl(var(--marketing-earth))] mb-4">Simple, place-based pricing</h2>
            <p className="marketing-subheading text-[hsl(var(--marketing-earth)/0.6)]">Pay by the places you steward, not the seats you fill.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto pt-4">
            {pricingTiers.map((tier) => (
              <div key={tier.key} className={`relative rounded-lg bg-card p-6 shadow-sm border border-border/60 transition-all duration-300 hover:shadow-lg text-center pt-8 ${tier.highlighted ? 'ring-2 ring-[hsl(var(--transitus-terracotta))] border-[hsl(var(--transitus-terracotta)/0.3)]' : ''}`}>
                {tier.highlighted && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-[hsl(var(--transitus-terracotta))] text-white text-xs font-semibold whitespace-nowrap shadow-md z-10">
                    Most popular
                  </div>
                )}
                <h3 className="font-sans text-base font-semibold text-[hsl(var(--marketing-earth))] mb-1">{tier.name}</h3>
                <p className="text-xs text-[hsl(var(--marketing-earth)/0.45)] mb-3">{tier.tagline}</p>
                <div className="mb-4">
                  <span className="font-serif text-3xl text-[hsl(var(--marketing-earth))]">{tier.price}</span>
                  <span className="text-sm text-[hsl(var(--marketing-earth)/0.45)]">{tier.priceSuffix}</span>
                </div>
                {/* Top 4 features */}
                <ul className="text-left mb-5 space-y-1.5 px-2">
                  {tier.includes.slice(0, 4).map((feat, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-[hsl(var(--marketing-earth)/0.6)]">
                      <Check className="h-3.5 w-3.5 text-[hsl(var(--transitus-forest))] shrink-0 mt-0.5" />
                      {feat}
                    </li>
                  ))}
                  {tier.includes.length > 4 && (
                    <li className="text-[10px] text-[hsl(var(--marketing-earth)/0.4)] pl-5">
                      +{tier.includes.length - 4} more features
                    </li>
                  )}
                </ul>
                <Link to="/pricing">
                  <Button variant={tier.key === 'network' ? 'outline' : 'default'} className={`rounded-full w-full text-sm ${tier.highlighted ? 'bg-[hsl(var(--transitus-forest))] text-white hover:bg-[hsl(var(--transitus-green))]' : tier.key === 'network' ? 'border-[hsl(var(--marketing-earth)/0.2)] text-[hsl(var(--marketing-earth))]' : 'bg-[hsl(var(--transitus-terracotta))] text-white hover:bg-[hsl(var(--transitus-terracotta)/0.85)]'}`}>{tier.key === 'network' ? tier.cta : 'Sign up now'}</Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA — dramatic dark terrain */}
      <section className="relative overflow-hidden gradient-terrain text-[hsl(var(--transitus-sand))]">
        <div className="absolute inset-0 meridian-grid opacity-15" />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 50% 60% at 50% 50%, hsl(var(--transitus-terracotta) / 0.08) 0%, transparent 70%)' }} />
        <div className="relative py-24 sm:py-32 text-center px-4">
          <Waves className="h-8 w-8 text-[hsl(var(--transitus-amber)/0.7)] mx-auto mb-6" />
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white mb-5 leading-tight">Every place deserves memory.</h2>
          <p className="font-serif-body text-lg text-[hsl(var(--transitus-sand)/0.65)] mb-10 max-w-lg mx-auto leading-relaxed">Start with one place. See what becomes possible when communities stop losing the thread.</p>
          <Link to="/pricing">
            <Button size="lg" className="rounded-full bg-[hsl(var(--transitus-terracotta))] text-white hover:bg-[hsl(var(--transitus-terracotta)/0.85)] px-8 h-13 text-base font-medium shadow-lg shadow-[hsl(var(--transitus-terracotta)/0.3)]">
              Start with one place <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
