import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { pricingTiers, pricingFAQ } from '@/content/pricing';
import { ArrowRight, Check, Leaf, Globe, Sparkles } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import SeoHead from '@/components/seo/SeoHead';

export default function Pricing() {
  return (
    <div>
      <SeoHead title="Pricing — Transitus" description="Simple, place-based pricing." canonical="/pricing" />

      {/* Hero */}
      <section className="relative overflow-hidden gradient-terrain text-[hsl(var(--transitus-sand))]">
        <div className="absolute inset-0 meridian-grid opacity-25" />
        <div className="relative marketing-section text-center pb-20">
          <div className="inline-flex items-center gap-2 mb-6">
            <Leaf className="h-5 w-5 text-[hsl(var(--transitus-amber))]" />
            <span className="font-sans text-xs font-semibold uppercase tracking-widest text-[hsl(var(--transitus-amber))]">Pricing</span>
          </div>
          <h1 className="marketing-heading text-white mb-4">Simple, place-based pricing</h1>
          <p className="marketing-subheading max-w-xl mx-auto text-[hsl(var(--transitus-sand)/0.75)]">
            Pay by the places you steward, not the seats you fill.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20" style={{ background: 'linear-gradient(to top, hsl(38 35% 90%), transparent)' }} />
      </section>

      <div className="h-1.5 gradient-heatmap" />

      {/* Pricing Cards */}
      <section className="bg-[hsl(var(--transitus-sand))]">
        <div className="marketing-section">
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingTiers.map((tier) => (
              <div key={tier.key} className={`editorial-card flex flex-col pt-8 ${tier.highlighted ? 'ring-2 ring-[hsl(var(--transitus-terracotta))] border-[hsl(var(--transitus-terracotta)/0.3)] relative' : ''}`}>
                {tier.highlighted && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 rounded-full bg-[hsl(var(--transitus-terracotta))] text-white text-xs font-semibold whitespace-nowrap shadow-sm">Most popular</div>}
                <div className="text-center mb-6">
                  <h2 className="font-sans text-base font-semibold text-[hsl(var(--marketing-earth))] mb-1">{tier.name}</h2>
                  <p className="text-xs text-[hsl(var(--marketing-earth)/0.5)] mb-4">{tier.tagline}</p>
                  <div className="mb-1">
                    <span className="font-serif text-4xl text-[hsl(var(--marketing-earth))]">{tier.price}</span>
                    {tier.priceSuffix && <span className="text-sm text-[hsl(var(--marketing-earth)/0.5)]">{tier.priceSuffix}</span>}
                  </div>
                  {tier.annualNote && <p className="text-xs text-[hsl(var(--marketing-earth)/0.4)]">{tier.annualNote}</p>}
                </div>
                <ul className="space-y-2.5 flex-1 mb-6">
                  {tier.includes.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 text-[hsl(var(--transitus-forest))] mt-0.5 shrink-0" />
                      <span className="text-sm text-[hsl(var(--marketing-earth)/0.65)]">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/contact" className="mt-auto">
                  <Button className={`rounded-full w-full ${tier.highlighted ? 'bg-[hsl(var(--transitus-forest))] text-white hover:bg-[hsl(var(--transitus-green))]' : 'border-[hsl(var(--marketing-earth)/0.2)] text-[hsl(var(--marketing-earth))] bg-transparent hover:bg-[hsl(var(--transitus-sand))]'}`} variant={tier.highlighted ? 'default' : 'outline'}>
                    {tier.cta} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Charter Cohort */}
      <section className="bg-[hsl(var(--transitus-earth))] text-[hsl(var(--transitus-sand))] relative">
        <div className="absolute inset-0 meridian-grid opacity-10" />
        <div className="relative marketing-section">
          <div className="max-w-2xl mx-auto text-center">
            <Sparkles className="h-7 w-7 text-[hsl(var(--transitus-amber))] mx-auto mb-5" />
            <h2 className="font-serif text-2xl sm:text-3xl text-white mb-4">Charter cohort: 50% off for co-designers</h2>
            <p className="font-serif-body text-base text-[hsl(var(--transitus-sand)/0.65)] leading-relaxed mb-6">
              The first 10 places get charter pricing: 50% off for 2{'\u2013'}3 years in exchange for deep co-design and case studies.
            </p>
            <Link to="/contact">
              <Button variant="outline" className="rounded-full border-[hsl(var(--transitus-amber)/0.3)] text-[hsl(var(--transitus-amber))] hover:bg-[hsl(var(--transitus-amber)/0.08)] px-6 bg-transparent">
                Apply for charter pricing <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[hsl(var(--transitus-parchment))] relative">
        <div className="absolute inset-0 contour-pattern opacity-40" />
        <div className="relative marketing-section">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-serif text-2xl text-[hsl(var(--marketing-earth))] text-center mb-10">Common questions</h2>
            <Accordion type="single" collapsible className="space-y-2">
              {pricingFAQ.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border border-[hsl(var(--marketing-border))] rounded-lg px-5 bg-white/70">
                  <AccordionTrigger className="text-sm font-medium text-[hsl(var(--marketing-earth))] hover:no-underline py-4">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-sm text-[hsl(var(--marketing-earth)/0.65)] leading-relaxed pb-4">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </div>
  );
}
