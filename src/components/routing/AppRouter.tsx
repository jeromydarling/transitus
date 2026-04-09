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

// App pages (lazy loaded for code splitting)
const AppHome = lazy(() => import('@/pages/app/Home'));
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
const Journal = lazy(() => import('@/pages/app/Journal'));
const CoalitionNetwork = lazy(() => import('@/pages/app/CoalitionNetwork'));
const Participation = lazy(() => import('@/pages/app/Participation'));
const CommunityBenefits = lazy(() => import('@/pages/app/CommunityBenefits'));
const StakeholderGraph = lazy(() => import('@/components/graphs/StakeholderGraph'));

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
        <Route path="graph" element={<Suspense fallback={<AppFallback />}><StakeholderGraph /></Suspense>} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
