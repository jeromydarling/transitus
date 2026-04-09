import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import SeoHead from '@/components/seo/SeoHead';

export default function Philosophy() {
  return (
    <div className="bg-white">
      <SeoHead
        title="Philosophy \u2014 Transitus"
        description="Why places need memory. The design philosophy behind Transitus: relationship memory, place intelligence, and narrative continuity for just transition work."
        canonical="/philosophy"
      />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-terrain opacity-[0.05]" />
        <div className="absolute inset-0 contour-pattern" />
        <div className="relative marketing-section text-center">
          <h1 className="marketing-heading mb-6">Why places need memory</h1>
          <p className="marketing-subheading max-w-2xl mx-auto">
            A design philosophy rooted in dignity, place, and the belief that transition work
            deserves better tools than spreadsheets and scattered notes.
          </p>
        </div>
      </section>

      <div className="h-px bg-[hsl(var(--marketing-border))]" />

      {/* Main Content */}
      <section className="marketing-section">
        <article className="max-w-2xl mx-auto space-y-12">

          {/* Section 1 */}
          <div>
            <h2 className="font-serif text-2xl text-[hsl(var(--marketing-navy))] mb-4">
              Software flattens what matters most
            </h2>
            <div className="space-y-4 font-serif-body text-base text-[hsl(var(--marketing-navy)/0.75)] leading-relaxed">
              <p>
                Environmental justice work is full of living relationships that ordinary software flattens:
                communities to land, organizers to investors, workers to transition plans, faith to action,
                and seasonal decisions to local conditions.
              </p>
              <p>
                Most tools treat these as records in a database. A contact with a tag. A task with a due date.
                A permit number. A meeting logged. But the relationships that carry transition work forward
                are richer than any record can hold.
              </p>
              <p>
                Transitus was built around a different idea: that software should help teams remember people,
                honor places, and preserve the story of change {'\u2014'} instead of forcing everything into
                pipelines and transactions.
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-[hsl(var(--marketing-border))]" />

          {/* Section 2 */}
          <div>
            <h2 className="font-serif text-2xl text-[hsl(var(--marketing-navy))] mb-4">
              Three things most tools keep separate
            </h2>
            <div className="space-y-6">
              <div className="pl-5 border-l-2 border-[hsl(var(--marketing-green)/0.3)]">
                <h3 className="font-sans text-sm font-semibold text-[hsl(var(--marketing-green))] uppercase tracking-wider mb-2">
                  Relationship Memory
                </h3>
                <p className="font-serif-body text-base text-[hsl(var(--marketing-navy)/0.75)] leading-relaxed">
                  Every stakeholder engagement, site visit, and community meeting becomes part of a living record.
                  No promise is forgotten. No voice is lost. No relationship falls through the cracks when a staff
                  member moves on.
                </p>
              </div>
              <div className="pl-5 border-l-2 border-[hsl(var(--transitus-atlas)/0.3)]">
                <h3 className="font-sans text-sm font-semibold text-[hsl(var(--transitus-atlas))] uppercase tracking-wider mb-2">
                  Place Intelligence
                </h3>
                <p className="font-serif-body text-base text-[hsl(var(--marketing-navy)/0.75)] leading-relaxed">
                  Environmental burdens, demographic context, climate risks, and community assets {'\u2014'}
                  layered into a civic atlas that makes complexity legible. Not just data, but data anchored to
                  land and people, presented with the dignity both deserve.
                </p>
              </div>
              <div className="pl-5 border-l-2 border-[hsl(var(--transitus-umber)/0.3)]">
                <h3 className="font-sans text-sm font-semibold text-[hsl(var(--transitus-umber))] uppercase tracking-wider mb-2">
                  Narrative Continuity
                </h3>
                <p className="font-serif-body text-base text-[hsl(var(--marketing-navy)/0.75)] leading-relaxed">
                  Scattered notes, meetings, and field observations become a coherent story of transition.
                  Communities and institutions stop losing the thread. Leadership turns over; the memory stays.
                </p>
              </div>
            </div>
          </div>

          <div className="h-px bg-[hsl(var(--marketing-border))]" />

          {/* Section 3 */}
          <div>
            <h2 className="font-serif text-2xl text-[hsl(var(--marketing-navy))] mb-4">
              Design principles
            </h2>
            <div className="space-y-4 font-serif-body text-base text-[hsl(var(--marketing-navy)/0.75)] leading-relaxed">
              <p>
                <strong className="text-[hsl(var(--marketing-navy))]">Every screen should be printable.</strong>{' '}
                If a Place page, a Journey chapter, or a commitment report can become a PDF someone would willingly
                read, the design is working. If it looks like enterprise software, it isn't.
              </p>
              <p>
                <strong className="text-[hsl(var(--marketing-navy))]">Typography carries authority.</strong>{' '}
                Data becomes legible through composition, not decoration. Large editorial serif for moments of
                significance. Clear, warm sans-serif for navigation and action. Body text that invites reading,
                not scanning.
              </p>
              <p>
                <strong className="text-[hsl(var(--marketing-navy))]">Maps are first-class citizens.</strong>{' '}
                Not widgets in a corner. A Place page should feel like an atlas spread: terrain, burdens, history,
                voices, and commitments composed into something beautiful enough to frame.
              </p>
              <p>
                <strong className="text-[hsl(var(--marketing-navy))]">Awareness over alerts.</strong>{' '}
                Transitus does not bark. It does not create urgency where there is none. It gently surfaces what is
                shifting, who has gone quiet, and what remains unfinished {'\u2014'} and trusts users to respond with
                discernment rather than panic.
              </p>
            </div>
          </div>

          <div className="h-px bg-[hsl(var(--marketing-border))]" />

          {/* Section 4 */}
          <div>
            <h2 className="font-serif text-2xl text-[hsl(var(--marketing-navy))] mb-4">
              The philosophical roots
            </h2>
            <div className="space-y-4 font-serif-body text-base text-[hsl(var(--marketing-navy)/0.75)] leading-relaxed">
              <p>
                Transitus is philosophically rooted in principles that many traditions share but few software
                products embody: the dignity of every person, the common good, subsidiarity (decisions closest to
                the people affected), solidarity across difference, and care for creation as a moral imperative.
              </p>
              <p>
                You don't need to name these principles to feel them. When a tool asks "who was in the room {'\u2014'}
                and who was left out?" instead of "how many contacts were logged," the grammar itself carries the
                philosophy. When a commitment tracker asks "what do affected communities think this promise means?"
                alongside "what was formally agreed," the system quietly encodes justice.
              </p>
              <p>
                That is the Transitus difference: not features alone, but a grammar of civic care embedded in
                every screen, every question, every default.
              </p>
            </div>
          </div>
        </article>
      </section>

      {/* CTA */}
      <section className="bg-[hsl(var(--marketing-surface))]">
        <div className="marketing-section text-center">
          <h2 className="font-serif text-2xl sm:text-3xl text-[hsl(var(--marketing-navy))] mb-4">
            Built for the work that matters most
          </h2>
          <p className="font-serif-body text-base text-[hsl(var(--marketing-navy)/0.7)] mb-8 max-w-lg mx-auto leading-relaxed">
            Start with one place. Let the memory build. See what becomes possible.
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
