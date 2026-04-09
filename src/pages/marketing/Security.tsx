import { Shield, Lock, Eye, Database, FileText, RefreshCw } from 'lucide-react';
import SeoHead from '@/components/seo/SeoHead';

const securityItems = [
  {
    icon: Lock,
    title: 'Encryption at rest and in transit',
    description: 'All data is encrypted using AES-256 at rest and TLS 1.3 in transit. Field notes, community testimony, and sensitive stakeholder data are protected at every layer.',
  },
  {
    icon: Shield,
    title: 'Role-based access control',
    description: 'Stewards, field companions, listeners, analysts, and sponsors each see only what their role requires. Community testimony has additional consent-based visibility controls.',
  },
  {
    icon: Eye,
    title: 'Consent-first community data',
    description: 'Community voices are never shared without explicit consent. Stories and testimony have layered privacy: local only, trusted allies, or abstracted for institutional view.',
  },
  {
    icon: Database,
    title: 'Data sovereignty',
    description: 'Your place data, stakeholder records, and field notes belong to your organization. Full export at any time, in standard formats.',
  },
  {
    icon: FileText,
    title: 'Audit trail',
    description: 'Every commitment update, stakeholder edit, and report generation is logged. Institutional accountability requires institutional memory.',
  },
  {
    icon: RefreshCw,
    title: 'Regular security reviews',
    description: 'Continuous vulnerability scanning, dependency auditing, and periodic third-party security assessments. We take the stewardship of your data as seriously as you take the stewardship of your places.',
  },
];

export default function Security() {
  return (
    <div className="bg-white">
      <SeoHead
        title="Security \u2014 Transitus"
        description="How Transitus protects your place data, stakeholder relationships, and community testimony. Built with consent-first principles and institutional-grade security."
        canonical="/security"
      />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 contour-pattern" />
        <div className="relative marketing-section text-center">
          <h1 className="marketing-heading mb-4">Security & trust</h1>
          <p className="marketing-subheading max-w-xl mx-auto">
            Transition work involves vulnerable communities, sensitive relationships, and promises that matter.
            Transitus is built to honor that trust.
          </p>
        </div>
      </section>

      <div className="h-px bg-[hsl(var(--marketing-border))]" />

      <section className="marketing-section">
        <div className="max-w-3xl mx-auto grid sm:grid-cols-2 gap-8">
          {securityItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-[hsl(var(--marketing-green)/0.08)] flex items-center justify-center">
                    <Icon className="h-4 w-4 text-[hsl(var(--marketing-green))]" />
                  </div>
                  <h3 className="font-sans text-sm font-semibold text-[hsl(var(--marketing-navy))]">
                    {item.title}
                  </h3>
                </div>
                <p className="font-serif-body text-sm text-[hsl(var(--marketing-navy)/0.65)] leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
