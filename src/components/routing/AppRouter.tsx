import { Routes, Route, Navigate } from 'react-router-dom';

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

        {/* Legal pages */}
        <Route path="/legal/terms" element={<LegalTerms />} />
        <Route path="/legal/privacy" element={<LegalPrivacy />} />
        <Route path="/legal/data-processing" element={<LegalDPA />} />
        <Route path="/legal/acceptable-use" element={<LegalAcceptableUse />} />
        <Route path="/legal/ai-transparency" element={<LegalAITransparency />} />

        {/* Legacy CROS routes redirect to home */}
        <Route path="/manifesto" element={<Navigate to="/philosophy" replace />} />
        <Route path="/cros" element={<Navigate to="/features" replace />} />
        <Route path="/nri" element={<Navigate to="/features" replace />} />
      </Route>

      {/* Auth routes (stubbed for now) */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
