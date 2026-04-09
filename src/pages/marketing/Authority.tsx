/**
 * Authority — Public authority hub landing page.
 *
 * WHAT: Overview landing for the CROS Authority knowledge library.
 * WHERE: /authority (public marketing route).
 * WHY: Positions CROS as the leading voice in human-centered relational systems.
 */
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, BookOpen, Heart, Compass } from 'lucide-react';
import authorityHero from '@/assets/authority-hero.webp';
import SeoHead from '@/components/seo/SeoHead';
import SeoBreadcrumb from '@/components/seo/SeoBreadcrumb';
import SeoInternalLinks from '@/components/seo/SeoInternalLinks';
import AuthorityShareCard from '@/components/marketing/AuthorityShareCard';
import NarrativeLinks from '@/components/marketing/NarrativeLinks';
import { getAuthoritySectionsByCategory } from '@/content/authority';
import { articleSchema, breadcrumbSchema } from '@/lib/seo/seoConfig';

const serif = { fontFamily: 'Georgia, "Times New Roman", serif' };

const CATEGORY_META: Record<string, { icon: React.ComponentType<{ className?: string }>; route: string }> = {
  week: { icon: Compass, route: '/authority/weeks' },
  adoption: { icon: Heart, route: '/authority/adoption' },
  story: { icon: BookOpen, route: '/authority/stories' },
};

export default function Authority() {
  const { t } = useTranslation('marketing');
  return (
    <article>
      <SeoHead
        title="Authority Hub — CROS\u2122"
        description="The CROS Authority Hub: narrative knowledge for human-centered relational systems. Week stories, adoption guidance, and essays on mission work."
        keywords={['CROS authority', 'nonprofit knowledge', 'relational systems', 'mission leadership']}
        canonical="/authority"
        jsonLd={[
          articleSchema({ headline: 'CROS Authority Hub', description: 'Narrative knowledge for human-centered relational systems.', url: '/authority' }),
          breadcrumbSchema([{ name: 'CROS', url: '/' }, { name: 'Authority', url: '/authority' }]),
        ]}
      />

      <header className="relative overflow-hidden">
        <img src={authorityHero} alt="" aria-hidden="true" loading="eager" className="pointer-events-none absolute inset-0 w-full h-full opacity-[0.15] object-cover object-center scale-[2.4] origin-top" />
        <div className="relative max-w-[720px] mx-auto px-4 sm:px-6 pt-10 pb-12 text-center">
        <p className="text-xs font-medium uppercase tracking-wider text-[hsl(var(--marketing-blue))] mb-3">{t('authorityPage.eyebrow')}</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-[hsl(var(--marketing-navy))] mb-4" style={serif}>{t('authorityPage.heading')}</h1>
        <p className="text-base sm:text-lg text-[hsl(var(--marketing-navy)/0.6)] max-w-xl mx-auto leading-relaxed" style={serif}>
          {t('authorityPage.subheading')}
        </p>
        </div>
      </header>

      <section className="max-w-[960px] mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-16 grid gap-4 sm:grid-cols-3">
        <SeoBreadcrumb items={[{ label: 'CROS', to: '/' }, { label: 'Authority' }]} />
        {Object.entries(CATEGORY_META).map(([key, meta]) => {
          const Icon = meta.icon;
          const count = getAuthoritySectionsByCategory(key as 'week' | 'adoption' | 'story').length;
          return (
            <Link key={key} to={meta.route} className="group flex flex-col rounded-2xl border border-[hsl(var(--marketing-border))] bg-white p-6 hover:border-[hsl(var(--marketing-blue)/0.25)] hover:shadow-sm transition-all">
              <Icon className="h-5 w-5 text-[hsl(var(--marketing-blue))] mb-3" />
              <h2 className="text-base font-semibold text-[hsl(var(--marketing-navy))] mb-1" style={serif}>{t(`authorityPage.categories.${key}.label`)}</h2>
              <p className="text-sm text-[hsl(var(--marketing-navy)/0.55)] leading-relaxed mb-3">{t(`authorityPage.categories.${key}.description`)}</p>
              <span className="mt-auto inline-flex items-center gap-1 text-xs font-medium text-[hsl(var(--marketing-blue))] group-hover:underline">
                {t('authorityPage.pieceCount', { count })} <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          );
        })}
      </section>

      {/* Share card */}
      <section className="max-w-[720px] mx-auto px-4 sm:px-6 pb-8">
        <AuthorityShareCard path="/authority" title="Knowledge for Living Mission — CROS Authority Hub" />
      </section>

      {/* Soft conversion */}
      <section className="max-w-[720px] mx-auto px-4 sm:px-6 pb-12">
        <div className="bg-[hsl(var(--marketing-surface))] rounded-2xl p-8 text-center">
          <h2 className="text-lg font-semibold text-[hsl(var(--marketing-navy))] mb-3" style={serif}>{t('authorityPage.softConversion.heading')}</h2>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/archetypes" className="text-sm font-medium text-[hsl(var(--marketing-blue))] hover:underline">{t('authorityPage.softConversion.exploreArchetypes')}</Link>
            <Link to="/pricing" className="text-sm font-medium text-[hsl(var(--marketing-blue))] hover:underline">{t('authorityPage.softConversion.viewPricing')}</Link>
          </div>
        </div>
      </section>

      <div className="max-w-[720px] mx-auto px-4 sm:px-6 pb-8"><NarrativeLinks currentPath="/authority" /></div>
      <SeoInternalLinks heading={t('authorityPage.seoLinks.heading')} links={[
        { label: t('authorityPage.seoLinks.fieldJournal'), to: '/field-journal', description: t('authorityPage.seoLinks.fieldJournalDesc') },
        { label: t('authorityPage.seoLinks.lexicon'), to: '/lexicon', description: t('authorityPage.seoLinks.lexiconDesc') },
        { label: t('authorityPage.seoLinks.nri'), to: '/nri', description: t('authorityPage.seoLinks.nriDesc') },
      ]} />
    </article>
  );
}
