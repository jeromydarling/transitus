import { useGlobalAnalytics } from '@/hooks/useGlobalAnalytics';

/**
 * Invisible component that activates global side-effects (analytics, etc.)
 * Renders nothing — mount once inside the provider tree.
 */
export function GlobalEffects() {
  useGlobalAnalytics();
  return null;
}
