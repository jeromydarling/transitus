/**
 * AuthorityCategory — Dynamic page for authority content by category.
 *
 * WHAT: Lists authority sections filtered by category (weeks/adoption/stories).
 * WHERE: /authority/weeks, /authority/adoption, /authority/stories.
 * WHY: Deep SEO pages for each content type.
 */
import { useParams, Navigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import SeoHead from '@/components/seo/SeoHead';
import SeoBreadcrumb from '@/components/seo/SeoBreadcrumb';
import NarrativeLinks from '@/components/marketing/NarrativeLinks';
import AuthorityShareCard from '@/components/marketing/AuthorityShareCard';
import { getAuthoritySectionsByCategory, type AuthoritySection } from '@/content/authority';
import { articleSchema, breadcrumbSchema } from '@/lib/seo/seoConfig';

const serif = { fontFamily: 'Georgia, "Times New Roman", serif' };

const CATEGORY_INFO: Record<string, { categoryKey: AuthoritySection['category'] }> = {
  weeks: { categoryKey: 'week' },
  adoption: { categoryKey: 'adoption' },
  stories: { categoryKey: 'story' },
};

export default function AuthorityCategory() {
  const { t } = useTranslation('marketing');
  const { category } = useParams<{ category: string }>();
  const info = category ? CATEGORY_INFO[category] : undefined;
  if (!info) return <Navigate to="/authority" replace />;

  const sections = getAuthoritySectionsByCategory(info.categoryKey);

  return (
    <article>
      <SeoHead title={`${t(`authorityCategoryPage.categories.${category}.label`)} — CROS Authority`} description={t(`authorityCategoryPage.categories.${category}.description`)} canonical={`/authority/${category}`}
        jsonLd={[articleSchema({ headline: t(`authorityCategoryPage.categories.${category}.label`), description: t(`authorityCategoryPage.categories.${category}.description`), url: `/authority/${category}` }),
          breadcrumbSchema([{ name: 'CROS', url: '/' }, { name: 'Authority', url: '/authority' }, { name: t(`authorityCategoryPage.categories.${category}.label`), url: `/authority/${category}` }])]} />

      <header className="max-w-[720px] mx-auto px-4 sm:px-6 pt-8 pb-8">
        <Link to="/authority" className="inline-flex items-center gap-1.5 text-xs text-[hsl(var(--marketing-navy)/0.45)] hover:text-[hsl(var(--marketing-navy))] mb-6 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> {t('authorityCategoryPage.backLink')}
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-[hsl(var(--marketing-navy))] mb-3" style={serif}>{t(`authorityCategoryPage.categories.${category}.label`)}</h1>
        <p className="text-base text-[hsl(var(--marketing-navy)/0.6)] leading-relaxed" style={serif}>{t(`authorityCategoryPage.categories.${category}.description`)}</p>
      </header>

      <section className="max-w-[720px] mx-auto px-4 sm:px-6 pb-16 space-y-10">
        <SeoBreadcrumb items={[{ label: 'CROS', to: '/' }, { label: 'Authority', to: '/authority' }, { label: t(`authorityCategoryPage.categories.${category}.label`) }]} />
        {sections.map((s) => {
          const paragraphs = s.body.split('\n\n').filter(Boolean);
          return (
            <div key={s.slug} className="border-b border-[hsl(var(--marketing-border))] pb-10 last:border-0">
              <h2 className="text-xl font-semibold text-[hsl(var(--marketing-navy))] mb-2" style={serif}>{s.title}</h2>
              <p className="text-xs text-[hsl(var(--marketing-navy)/0.4)] mb-4">{s.archetype} &middot; {s.roleFocus}</p>
              {paragraphs.map((p, i) => (
                <p key={i} className="text-[15px] text-[hsl(var(--marketing-navy)/0.7)] leading-[1.85] mb-4" style={serif}>{p}</p>
              ))}
            </div>
          );
        })}
      </section>

      {/* Share card */}
      <section className="max-w-[720px] mx-auto px-4 sm:px-6 pb-8">
        <AuthorityShareCard path={`/authority/${category}`} title={`${t(`authorityCategoryPage.categories.${category}.label`)} — CROS Authority`} />
      </section>

      {/* Soft conversion */}
      <section className="max-w-[720px] mx-auto px-4 sm:px-6 pb-12">
        <div className="bg-[hsl(var(--marketing-surface))] rounded-2xl p-8 text-center">
          <h2 className="text-lg font-semibold text-[hsl(var(--marketing-navy))] mb-3" style={serif}>{t('authorityCategoryPage.softConversion.heading')}</h2>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/archetypes" className="text-sm font-medium text-[hsl(var(--marketing-blue))] hover:underline">{t('authorityCategoryPage.softConversion.exploreArchetypes')}</Link>
            <Link to="/pricing" className="text-sm font-medium text-[hsl(var(--marketing-blue))] hover:underline">{t('authorityCategoryPage.softConversion.viewPricing')}</Link>
          </div>
        </div>
      </section>

      <div className="max-w-[720px] mx-auto px-4 sm:px-6 pb-8"><NarrativeLinks currentPath={`/authority/${category}`} /></div>
    </article>
  );
}
