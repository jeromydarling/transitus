import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, TreePine, Heart, MapPin, BookOpen, Compass, Eye, Leaf } from 'lucide-react';
import SeoHead from '@/components/seo/SeoHead';

export default function Philosophy() {
  return (
    <div>
      <SeoHead title="Philosophy — Transitus" description="Why places need memory." canonical="/philosophy" />

      {/* Hero */}
      <section className="relative overflow-hidden gradient-terrain text-[hsl(var(--transitus-sand))]">
        <div className="absolute inset-0 contour-pattern opacity-25" />
        <div className="absolute inset-0 meridian-grid opacity-20" />
        <div className="relative marketing-section text-center pb-20">
          <TreePine className="h-8 w-8 text-[hsl(var(--transitus-amber))] mx-auto mb-6" />
          <h1 className="marketing-heading text-white mb-6">Why places need memory</h1>
          <p className="marketing-subheading max-w-2xl mx-auto text-[hsl(var(--transitus-sand)/0.75)]">
            A design philosophy rooted in dignity, place, and the belief that transition work
            deserves better than spreadsheets and scattered notes.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20" style={{ background: 'linear-gradient(to top, hsl(38 30% 95%), transparent)' }} />
      </section>

      <div className="h-1.5 gradient-heatmap" />

      {/* Content */}
      <section className="bg-[hsl(var(--transitus-parchment))] relative">
        <div className="absolute inset-0 contour-pattern opacity-40" />
        <div className="relative marketing-section">
          <article className="max-w-2xl mx-auto space-y-14">

            <div>
              <div className="flex items-center gap-2 mb-4">
                <Eye className="h-5 w-5 text-[hsl(var(--transitus-terracotta))]" />
                <span className="font-sans text-xs font-semibold uppercase tracking-widest text-[hsl(var(--transitus-terracotta))]">The Problem</span>
              </div>
              <h2 className="font-serif text-2xl text-[hsl(var(--marketing-earth))] mb-4">Software flattens what matters most</h2>
              <div className="space-y-4 font-serif-body text-base text-[hsl(var(--marketing-earth)/0.7)] leading-relaxed">
                <p>Environmental justice work is full of living relationships that ordinary software flattens: communities to land, organizers to investors, workers to transition plans, faith to action.</p>
                <p>Most tools treat these as records in a database. A contact with a tag. A task with a due date. But the relationships that carry transition work forward are richer than any record can hold.</p>
                <p>Transitus was built around a different idea: that software should help teams remember people, honor places, and preserve the story of change.</p>
              </div>
            </div>

            <div className="h-px bg-[hsl(var(--marketing-border))]" />

            <div>
              <div className="flex items-center gap-2 mb-4">
                <Compass className="h-5 w-5 text-[hsl(var(--transitus-ocean))]" />
                <span className="font-sans text-xs font-semibold uppercase tracking-widest text-[hsl(var(--transitus-ocean))]">Three Layers</span>
              </div>
              <h2 className="font-serif text-2xl text-[hsl(var(--marketing-earth))] mb-6">Three things most tools keep separate</h2>
              <div className="space-y-6">
                {[
                  { icon: Heart, label: 'Relationship Memory', color: 'transitus-forest', text: 'Every stakeholder engagement, site visit, and community meeting becomes part of a living record. No promise is forgotten. No voice is lost.' },
                  { icon: MapPin, label: 'Place Intelligence', color: 'transitus-ocean', text: 'Environmental burdens, demographic context, climate risks, and community assets \u2014 layered into a civic atlas that makes complexity legible.' },
                  { icon: BookOpen, label: 'Narrative Continuity', color: 'transitus-terracotta', text: 'Scattered notes, meetings, and field observations become a coherent story. Leadership turns over; the memory stays.' },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-4 p-5 rounded-xl bg-white/60 border border-[hsl(var(--marketing-border)/0.5)]">
                    <div className={`shrink-0 w-10 h-10 rounded-xl bg-[hsl(var(--${item.color})/0.1)] flex items-center justify-center`}>
                      <item.icon className={`h-5 w-5 text-[hsl(var(--${item.color}))]`} />
                    </div>
                    <div>
                      <h3 className="font-sans text-sm font-semibold text-[hsl(var(--marketing-earth))] mb-1">{item.label}</h3>
                      <p className="font-serif-body text-sm text-[hsl(var(--marketing-earth)/0.65)] leading-relaxed">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-px bg-[hsl(var(--marketing-border))]" />

            <div>
              <div className="flex items-center gap-2 mb-4">
                <Leaf className="h-5 w-5 text-[hsl(var(--transitus-forest))]" />
                <span className="font-sans text-xs font-semibold uppercase tracking-widest text-[hsl(var(--transitus-forest))]">Principles</span>
              </div>
              <h2 className="font-serif text-2xl text-[hsl(var(--marketing-earth))] mb-4">Design principles</h2>
              <div className="space-y-4 font-serif-body text-base text-[hsl(var(--marketing-earth)/0.7)] leading-relaxed">
                <p><strong className="text-[hsl(var(--marketing-earth))]">Every screen should be printable.</strong> If a Place page can become a PDF someone would willingly read, the design is working.</p>
                <p><strong className="text-[hsl(var(--marketing-earth))]">Typography carries authority.</strong> Large editorial serif for significance. Clear sans for action. Body text that invites reading, not scanning.</p>
                <p><strong className="text-[hsl(var(--marketing-earth))]">Maps are first-class citizens.</strong> A Place page should feel like an atlas spread: terrain, burdens, history, voices, and commitments composed beautifully.</p>
                <p><strong className="text-[hsl(var(--marketing-earth))]">Awareness over alerts.</strong> Transitus does not bark. It gently surfaces what is shifting and trusts users to respond with discernment.</p>
              </div>
            </div>

            <div className="h-px bg-[hsl(var(--marketing-border))]" />

            <div>
              <h2 className="font-serif text-2xl text-[hsl(var(--marketing-earth))] mb-4">The philosophical roots</h2>
              <div className="space-y-4 font-serif-body text-base text-[hsl(var(--marketing-earth)/0.7)] leading-relaxed">
                <p>Transitus is rooted in principles many traditions share: the dignity of every person, the common good, subsidiarity, solidarity, and care for creation.</p>
                <p>When a tool asks "who was in the room \u2014 and who was left out?" the grammar itself carries the philosophy. When a commitment tracker asks what affected communities think a promise means, the system quietly encodes justice.</p>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden gradient-terrain text-[hsl(var(--transitus-sand))]">
        <div className="absolute inset-0 meridian-grid opacity-15" />
        <div className="relative marketing-section text-center">
          <h2 className="font-serif text-2xl sm:text-3xl text-white mb-4">Built for the work that matters most</h2>
          <p className="font-serif-body text-base text-[hsl(var(--transitus-sand)/0.65)] mb-8 max-w-lg mx-auto leading-relaxed">
            Start with one place. Let the memory build. See what becomes possible.
          </p>
          <Link to="/pricing">
            <Button size="lg" className="rounded-full bg-[hsl(var(--transitus-terracotta))] text-white hover:bg-[hsl(var(--transitus-terracotta)/0.85)] px-8 h-12 text-base font-medium shadow-lg">
              See pricing <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
