/**
 * NAV_ITEM_TO_GROUP — maps sidebar nav testids to their collapsible parent group.
 * Must stay in sync with the app's sidebar structure.
 *
 * Group trigger testid pattern: [data-testid="nav-group-{group}-trigger"]
 * Group content testid pattern: [data-testid="nav-group-{group}-content"]
 *
 * Current sidebar groups (Sidebar.tsx):
 *   Metros → nav-group-metros
 *   Partners → nav-group-partners
 *   Scheduling → nav-group-scheduling
 *   Outreach → nav-group-outreach
 *   Grants → nav-group-grants
 *   Relatio → nav-group-relatio
 *   Communio → nav-group-communio
 *   Admin → nav-group-admin
 */
export const NAV_ITEM_TO_GROUP: Record<string, string> = {
  // Metros group
  'nav-metros': 'nav-group-metros',
  'nav-intel-feed': 'nav-group-metros',
  'nav-narratives': 'nav-group-metros',
  'nav-momentum': 'nav-group-metros',

  // Partners group
  'nav-opportunities': 'nav-group-partners',
  'nav-radar': 'nav-group-partners',
  'nav-pipeline': 'nav-group-partners',
  'nav-anchors': 'nav-group-partners',
  'nav-provisions': 'nav-group-partners',
  'nav-people': 'nav-group-partners',
  'nav-find-people': 'nav-group-partners',
  'nav-graph': 'nav-group-partners',
  'nav-volunteers': 'nav-group-partners',

  // Scheduling group
  'nav-calendar': 'nav-group-scheduling',
  'nav-events': 'nav-group-scheduling',
  'nav-find-events': 'nav-group-scheduling',
  'nav-activities': 'nav-group-scheduling',
  'nav-projects': 'nav-group-scheduling',

  // Outreach group
  'nav-campaigns': 'nav-group-outreach',

  // Grants group
  'nav-grants': 'nav-group-grants',
  'nav-find-grants': 'nav-group-grants',

  // Relatio group
  'nav-relatio': 'nav-group-relatio',

  // Communio group
  'nav-communio': 'nav-group-communio',
  'nav-caregiver-network': 'nav-group-communio',

  // Admin group
  'nav-admin': 'nav-group-admin',
  'nav-admin-activation': 'nav-group-admin',
  'nav-admin-guide': 'nav-group-admin',
  'nav-import': 'nav-group-admin',  // Import Center is under Admin

  // Top-level items (no parent group)
  'nav-home': '',
  'nav-testimonium': '',
  'nav-analytics': '',      // Intelligence page uses testId "nav-analytics"
  'nav-intelligence': '',   // alias — tests may use either
  'nav-reports': '',
  'nav-settings': '',
  'nav-help': '',
};
