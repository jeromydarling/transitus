import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { pricingTiers, pricingFAQ } from '@/content/pricing';
import { ArrowRight, Check } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import SeoHead from '@/components/seo/SeoHead';

export default function Pricing() {
  return (
    <div className="bg-white">
      <SeoHead
        title="Pricing \u2014 Transitus"
        description="Simple, place-based pricing. Pay by the places you steward, not the seats you fill. Starting at $150/month."
        canonical="/pricing"
      />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 contour-pattern" />
        <div className="relative marketing-section text-center">
          <h1 className="marketing-heading mb-4">Simple, place-based pricing</h1>
          <p className="marketing-subheading max-w-xl mx-auto">
            Pay by the places you steward, not the seats you fill. Community partners can join at low or no cost.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="bg-[hsl(var(--marketing-surface))]">
        <div className="marketing-section">
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingTiers.map((tier) => (
              <div
                key={tier.key}
                className={`editorial-card flex flex-col ${
                  tier.highlighted
                    ? 'ring-2 ring-[hsl(var(--marketing-green))] border-[hsl(var(--marketing-green)/0.3)] relative'
                    : ''
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[hsl(var(--marketing-green))] text-white text-xs font-medium">
                    Most popular
                  </div>
                )}

                <div className="text-center mb-6">
                  <h2 className="font-sans text-base font-semibold text-[hsl(var(--marketing-navy))] mb-1">{tier.name}</h2>
                  <p className="text-xs text-[hsl(var(--marketing-navy)/0.5)] mb-4">{tier.tagline}</p>
                  <div className="mb-1">
                    <span className="font-serif text-4xl text-[hsl(var(--marketing-navy))]">{tier.price}</span>
                    {tier.priceSuffix && (
                      <span className="text-sm text-[hsl(var(--marketing-navy)/0.5)]">{tier.priceSuffix}</span>
                    )}
                  </div>
                  {tier.annualNote && (
                    <p className="text-xs text-[hsl(var(--marketing-navy)/0.4)]">{tier.annualNote}</p>
                  )}
                </div>

                <ul className="space-y-2.5 flex-1 mb-6">
                  {tier.includes.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 text-[hsl(var(--marketing-green))] mt-0.5 shrink-0" />
                      <span className="text-sm text-[hsl(var(--marketing-navy)/0.7)]">{item}</span>
                    </li>
                  ))}
                </ul>

                <Link to="/contact" className="mt-auto">
                  <Button
                    className={`rounded-full w-full ${
                      tier.highlighted
                        ? 'bg-[hsl(var(--marketing-navy))] text-white hover:bg-[hsl(var(--marketing-navy)/0.9)]'
                        : 'border-[hsl(var(--marketing-navy)/0.2)] text-[hsl(var(--marketing-navy))] bg-transparent hover:bg-[hsl(var(--marketing-surface))]'
                    }`}
                    variant={tier.highlighted ? 'default' : 'outline'}
                  >
                    {tier.cta} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Charter Cohort */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-terrain opacity-[0.04]" />
        <div className="relative marketing-section">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-2xl sm:text-3xl text-[hsl(var(--marketing-navy))] mb-4">
              Charter cohort: 50% off for co-designers
            </h2>
            <p className="font-serif-body text-base text-[hsl(var(--marketing-navy)/0.7)] leading-relaxed mb-6">
              The first 10 places get charter pricing: 50% off for 2{'\u2013'}3 years in exchange for deep co-design,
              case studies, and permission to publish anonymized stories of transition. Help us build the tool
              your community actually needs.
            </p>
            <Link to="/contact">
              <Button variant="outline" className="rounded-full border-[hsl(var(--marketing-navy)/0.2)] text-[hsl(var(--marketing-navy))] px-6">
                Apply for charter pricing <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[hsl(var(--marketing-surface))]">
        <div className="marketing-section">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-serif text-2xl text-[hsl(var(--marketing-navy))] text-center mb-10">
              Common questions
            </h2>
            <Accordion type="single" collapsible className="space-y-2">
              {pricingFAQ.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border border-[hsl(var(--marketing-border))] rounded-lg px-5 bg-white">
                  <AccordionTrigger className="text-sm font-medium text-[hsl(var(--marketing-navy))] hover:no-underline py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-[hsl(var(--marketing-navy)/0.7)] leading-relaxed pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </div>
  );
}
