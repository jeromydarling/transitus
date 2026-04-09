import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// Marketing layout + pages (public)
import PublicLayout from '@/components/marketing/PublicLayout';
import Landing from '@/pages/marketing/Landing';
import Features from '@/pages/marketing/Features';
import Pricing from '@/pages/marketing/Pricing';
import Philosophy from '@/pages/marketing/Manifesto';
import Contact from '@/pages/marketing/Contact';
import Security from '@/pages/marketing/Security';
import LegalTerms from '@/pages/marketing/legal/LegalTerms';
import LegalPrivacy from '@/pages/marketing/legal/LegalPrivacy';
import LegalDPA from '@/pages/marketing/legal/LegalDPA';
import LegalAcceptableUse from '@/pages/marketing/legal/LegalAcceptableUse';
import LegalAITransparency from '@/pages/marketing/legal/LegalAITransparency';

// Auth pages
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import NotFound from '@/pages/NotFound';

// App layout
import { TransitusLayout } from '@/components/layout/TransitusLayout';

// Gardener layout
import { GardenerLayout } from '@/components/layout/GardenerLayout';

// App pages (lazy loaded for code splitting)
const AppHome = lazy(() => import('@/pages/app/Home'));
const AppCompass = lazy(() => import('@/pages/app/Compass'));
const Places = lazy(() => import('@/pages/app/Places'));
const PlaceDetail = lazy(() => import('@/pages/app/PlaceDetail'));
const People = lazy(() => import('@/pages/app/People'));
const PersonDetail = lazy(() => import('@/pages/app/PersonDetail'));
const Commitments = lazy(() => import('@/pages/app/Commitments'));
const FieldNotes = lazy(() => import('@/pages/app/FieldNotes'));
const Signals = lazy(() => import('@/pages/app/Signals'));
const Journeys = lazy(() => import('@/pages/app/Journeys'));
const JourneyDetail = lazy(() => import('@/pages/app/JourneyDetail'));
const AppLibrary = lazy(() => import('@/pages/app/Library'));
const Reports = lazy(() => import('@/pages/app/Reports'));
const AppFeedback = lazy(() => import('@/pages/app/Feedback'));
const Seasons = lazy(() => import('@/pages/app/Seasons'));
const AppSettings = lazy(() => import('@/pages/app/Settings'));
const Journal = lazy(() => import('@/pages/app/Journal'));
const CoalitionNetwork = lazy(() => import('@/pages/app/CoalitionNetwork'));
const Participation = lazy(() => import('@/pages/app/Participation'));
const CommunityBenefits = lazy(() => import('@/pages/app/CommunityBenefits'));
const CommunityStories = lazy(() => import('@/pages/app/CommunityStories'));
const StakeholderGraph = lazy(() => import('@/components/graphs/StakeholderGraph'));

// Gardener pages (lazy loaded)
const GardenerOverview = lazy(() => import('@/pages/gardener/Overview'));
const GardenerTenants = lazy(() => import('@/pages/gardener/Tenants'));
const GardenerAnalytics = lazy(() => import('@/pages/gardener/Analytics'));
const GardenerContentStudio = lazy(() => import('@/pages/gardener/ContentStudio'));
const GardenerSystemHealth = lazy(() => import('@/pages/gardener/SystemHealth'));
const GardenerSupportInbox = lazy(() => import('@/pages/gardener/SupportInbox'));
const GardenerSettings = lazy(() => import('@/pages/gardener/GardenerSettings'));

function AppFallback() {
  return (
    <div className="p-6 space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-full max-w-lg" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
      </div>
    </div>
  );
}

export function AppRouter() {
  return (
    <Routes>
      {/* Root: marketing landing */}
      <Route path="/" element={<PublicLayout><Landing /></PublicLayout>} />

      {/* Public marketing routes */}
      <Route element={<PublicLayout />}>
        <Route path="/features" element={<Features />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/philosophy" element={<Philosophy />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/security" element={<Security />} />
        <Route path="/legal/terms" element={<LegalTerms />} />
        <Route path="/legal/privacy" element={<LegalPrivacy />} />
        <Route path="/legal/data-processing" element={<LegalDPA />} />
        <Route path="/legal/acceptable-use" element={<LegalAcceptableUse />} />
        <Route path="/legal/ai-transparency" element={<LegalAITransparency />} />
        <Route path="/manifesto" element={<Navigate to="/philosophy" replace />} />
        <Route path="/cros" element={<Navigate to="/features" replace />} />
        <Route path="/nri" element={<Navigate to="/features" replace />} />
      </Route>

      {/* Auth routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* ═══ Transitus App ═══ */}
      <Route path="/app" element={<TransitusLayout />}>
        <Route index element={<Suspense fallback={<AppFallback />}><AppHome /></Suspense>} />
        <Route path="compass" element={<Suspense fallback={<AppFallback />}><AppCompass /></Suspense>} />
        <Route path="places" element={<Suspense fallback={<AppFallback />}><Places /></Suspense>} />
        <Route path="places/:id" element={<Suspense fallback={<AppFallback />}><PlaceDetail /></Suspense>} />
        <Route path="people" element={<Suspense fallback={<AppFallback />}><People /></Suspense>} />
        <Route path="people/:id" element={<Suspense fallback={<AppFallback />}><PersonDetail /></Suspense>} />
        <Route path="commitments" element={<Suspense fallback={<AppFallback />}><Commitments /></Suspense>} />
        <Route path="field-notes" element={<Suspense fallback={<AppFallback />}><FieldNotes /></Suspense>} />
        <Route path="signals" element={<Suspense fallback={<AppFallback />}><Signals /></Suspense>} />
        <Route path="journeys" element={<Suspense fallback={<AppFallback />}><Journeys /></Suspense>} />
        <Route path="journeys/:id" element={<Suspense fallback={<AppFallback />}><JourneyDetail /></Suspense>} />
        <Route path="library" element={<Suspense fallback={<AppFallback />}><AppLibrary /></Suspense>} />
        <Route path="reports" element={<Suspense fallback={<AppFallback />}><Reports /></Suspense>} />
        <Route path="journal" element={<Suspense fallback={<AppFallback />}><Journal /></Suspense>} />
        <Route path="coalition" element={<Suspense fallback={<AppFallback />}><CoalitionNetwork /></Suspense>} />
        <Route path="participation" element={<Suspense fallback={<AppFallback />}><Participation /></Suspense>} />
        <Route path="community-benefits" element={<Suspense fallback={<AppFallback />}><CommunityBenefits /></Suspense>} />
        <Route path="community-stories" element={<Suspense fallback={<AppFallback />}><CommunityStories /></Suspense>} />
        <Route path="graph" element={<Suspense fallback={<AppFallback />}><StakeholderGraph /></Suspense>} />
        <Route path="feedback" element={<Suspense fallback={<AppFallback />}><AppFeedback /></Suspense>} />
        <Route path="seasons" element={<Suspense fallback={<AppFallback />}><Seasons /></Suspense>} />
        <Route path="settings" element={<Suspense fallback={<AppFallback />}><AppSettings /></Suspense>} />
      </Route>

      {/* ═══ Gardener Console ═══ */}
      <Route path="/gardener" element={<GardenerLayout />}>
        <Route index element={<Suspense fallback={<AppFallback />}><GardenerOverview /></Suspense>} />
        <Route path="tenants" element={<Suspense fallback={<AppFallback />}><GardenerTenants /></Suspense>} />
        <Route path="analytics" element={<Suspense fallback={<AppFallback />}><GardenerAnalytics /></Suspense>} />
        <Route path="content" element={<Suspense fallback={<AppFallback />}><GardenerContentStudio /></Suspense>} />
        <Route path="system" element={<Suspense fallback={<AppFallback />}><GardenerSystemHealth /></Suspense>} />
        <Route path="support" element={<Suspense fallback={<AppFallback />}><GardenerSupportInbox /></Suspense>} />
        <Route path="settings" element={<Suspense fallback={<AppFallback />}><GardenerSettings /></Suspense>} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
