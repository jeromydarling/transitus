import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, MapPin } from 'lucide-react';
import SeoHead from '@/components/seo/SeoHead';

export default function Contact() {
  return (
    <div className="bg-white">
      <SeoHead
        title="Contact \u2014 Transitus"
        description="Get in touch about Transitus. Whether you're exploring a pilot, applying for charter pricing, or have questions about how Transitus fits your work."
        canonical="/contact"
      />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 contour-pattern" />
        <div className="relative marketing-section text-center">
          <h1 className="marketing-heading mb-4">Let's talk about your places</h1>
          <p className="marketing-subheading max-w-xl mx-auto">
            Whether you're exploring a pilot, applying for charter pricing, or wondering how Transitus fits
            your coalition's work {'\u2014'} we'd love to hear from you.
          </p>
        </div>
      </section>

      <div className="h-px bg-[hsl(var(--marketing-border))]" />

      <section className="marketing-section">
        <div className="max-w-xl mx-auto">
          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm text-[hsl(var(--marketing-navy))]">Name</Label>
                <Input id="name" placeholder="Your name" className="rounded-lg" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="org" className="text-sm text-[hsl(var(--marketing-navy))]">Organization</Label>
                <Input id="org" placeholder="Your organization" className="rounded-lg" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm text-[hsl(var(--marketing-navy))]">Email</Label>
              <Input id="email" type="email" placeholder="you@example.org" className="rounded-lg" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-sm text-[hsl(var(--marketing-navy))]">Message</Label>
              <Textarea
                id="message"
                placeholder="Tell us about the places you're working in, the coalitions you're part of, or what you're hoping to build..."
                rows={5}
                className="rounded-lg resize-none"
              />
            </div>

            <Button
              type="submit"
              className="rounded-full bg-[hsl(var(--marketing-navy))] text-white hover:bg-[hsl(var(--marketing-navy)/0.9)] px-8 h-11"
            >
              Send message
            </Button>
          </form>

          <div className="mt-12 pt-8 border-t border-[hsl(var(--marketing-border))]">
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-[hsl(var(--marketing-green))] mt-1" />
                <div>
                  <p className="text-sm font-medium text-[hsl(var(--marketing-navy))]">Email us</p>
                  <p className="text-sm text-[hsl(var(--marketing-navy)/0.6)]">hello@transitus.app</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-[hsl(var(--marketing-green))] mt-1" />
                <div>
                  <p className="text-sm font-medium text-[hsl(var(--marketing-navy))]">Based in</p>
                  <p className="text-sm text-[hsl(var(--marketing-navy)/0.6)]">The places that need us</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
