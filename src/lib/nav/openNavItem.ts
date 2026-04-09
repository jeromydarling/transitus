/**
 * openNavItem — Programmatic sidebar navigation helper.
 *
 * WHAT: Expands a collapsible nav group then navigates to the target route.
 * WHERE: Used by Companion Mode CTAs to navigate users to sidebar items.
 * WHY: Some nav items are inside collapsed groups; we must expand first.
 */

const NAV_ITEM_TO_GROUP: Record<string, string> = {
  'nav-metros': 'nav-group-metros',
  'nav-intel-feed': 'nav-group-metros',
  'nav-narratives': 'nav-group-metros',
  'nav-momentum': 'nav-group-metros',
  'nav-opportunities': 'nav-group-partners',
  'nav-radar': 'nav-group-partners',
  'nav-pipeline': 'nav-group-partners',
  'nav-anchors': 'nav-group-partners',
  'nav-provisions': 'nav-group-partners',
  'nav-people': 'nav-group-partners',
  'nav-find-people': 'nav-group-partners',
  'nav-graph': 'nav-group-partners',
  'nav-calendar': 'nav-group-scheduling',
  'nav-events': 'nav-group-scheduling',
  'nav-find-events': 'nav-group-scheduling',
  'nav-activities': 'nav-group-scheduling',
  'nav-projects': 'nav-group-scheduling',
  'nav-campaigns': 'nav-group-outreach',
  'nav-grants': 'nav-group-grants',
  'nav-find-grants': 'nav-group-grants',
  'nav-volunteers': 'nav-group-partners',
  'nav-import': 'nav-group-admin',
  'nav-relatio': 'nav-group-relatio',
  'nav-communio': 'nav-group-communio',
  'nav-admin': 'nav-group-admin',
  'nav-admin-activation': 'nav-group-admin',
  'nav-admin-guide': 'nav-group-admin',
};

/**
 * Expand a sidebar group by clicking its trigger element.
 * Gracefully no-ops if already open or not found.
 */
function expandGroup(groupId: string): void {
  if (!groupId) return;

  const content = document.querySelector(`[data-testid="${groupId}-content"][data-state="open"]`);
  if (content) return; // already open

  const trigger = document.querySelector<HTMLElement>(`[data-testid="${groupId}-trigger"]`);
  if (trigger) trigger.click();
}

/**
 * Navigate to a sidebar item, expanding its group if needed.
 * Returns the path for router navigation.
 */
export function openNavItem(navTestId: string): void {
  const groupId = NAV_ITEM_TO_GROUP[navTestId] || '';
  if (groupId) expandGroup(groupId);

  // Small delay to allow group animation
  setTimeout(() => {
    const item = document.querySelector<HTMLElement>(`[data-testid="${navTestId}"]`);
    if (item) item.click();
  }, 150);
}
