/**
 * selectorRegistry — Authoritative registry of all data-testid values.
 *
 * WHAT: Single source of truth for UI test selectors.
 * WHERE: Referenced by QA runner, Operator Nexus guardrails, and navMap.
 * WHY: Prevents selector drift — if it's not here, it shouldn't be tested.
 */

/** Navigation selectors — maps testid to parent group testid */
export const NAV_SELECTORS: Record<string, string> = {
  // Metros
  'nav-metros': 'nav-group-metros',
  'nav-intel-feed': 'nav-group-metros',
  'nav-narratives': 'nav-group-metros',
  'nav-momentum': 'nav-group-metros',
  // Partners
  'nav-opportunities': 'nav-group-partners',
  'nav-radar': 'nav-group-partners',
  'nav-pipeline': 'nav-group-partners',
  'nav-anchors': 'nav-group-partners',
  'nav-provisions': 'nav-group-partners',
  'nav-people': 'nav-group-partners',
  'nav-find-people': 'nav-group-partners',
  'nav-graph': 'nav-group-partners',
  // Scheduling
  'nav-calendar': 'nav-group-scheduling',
  'nav-events': 'nav-group-scheduling',
  'nav-find-events': 'nav-group-scheduling',
  'nav-activities': 'nav-group-scheduling',
  // Outreach
  'nav-campaigns': 'nav-group-outreach',
  // Grants
  'nav-grants': 'nav-group-grants',
  'nav-find-grants': 'nav-group-grants',
  // Partners (moved from Community)
  'nav-volunteers': 'nav-group-partners',
  'nav-import': 'nav-group-admin',
  // Relatio
  'nav-relatio': 'nav-group-relatio',
  // Communio
  'nav-communio': 'nav-group-communio',
  // Admin
  'nav-admin': 'nav-group-admin',
  'nav-admin-activation': 'nav-group-admin',
  'nav-admin-guide': 'nav-group-admin',
  // Top-level (no parent group)
  'nav-home': '',
  'nav-testimonium': '',
  'nav-analytics': '',
  'nav-reports': '',
  'nav-settings': '',
  'nav-help': '',
};

/** All known nav group testids */
export const NAV_GROUPS = [
  'nav-group-metros',
  'nav-group-partners',
  'nav-group-scheduling',
  'nav-group-outreach',
  'nav-group-grants',
  
  'nav-group-relatio',
  'nav-group-communio',
  'nav-group-admin',
] as const;

/** Page-level root selectors */
export const PAGE_SELECTORS = {
  'testimonium-root': '/testimonium',
  'dashboard-root': '/dashboard',
  'pricing-root': '/pricing',
  'communio-root': '/communio',
  'settings-root': '/settings',
} as const;

/** Human-readable group labels */
export const GROUP_LABELS: Record<string, string> = {
  'nav-group-metros': 'Metros',
  'nav-group-partners': 'Partners',
  'nav-group-scheduling': 'Scheduling',
  'nav-group-outreach': 'Outreach',
  'nav-group-grants': 'Grants',
  
  'nav-group-relatio': 'Relatio',
  'nav-group-communio': 'Communio',
  'nav-group-admin': 'Admin',
};

/** Total selectors count for health reporting */
export function getSelectorStats() {
  return {
    navSelectors: Object.keys(NAV_SELECTORS).length,
    navGroups: NAV_GROUPS.length,
    pageSelectors: Object.keys(PAGE_SELECTORS).length,
    total: Object.keys(NAV_SELECTORS).length + NAV_GROUPS.length + Object.keys(PAGE_SELECTORS).length,
  };
}
