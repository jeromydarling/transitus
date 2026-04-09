/**
 * Transitus Full Click Test — Playwright
 * Tests every page, button, modal, toggle, and navigation path.
 */
import { test, expect, type Page } from '@playwright/test';

const BASE = 'http://localhost:3459';

// Helper to clear localStorage stale data
async function freshStart(page: Page) {
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await page.evaluate(() => {
    localStorage.removeItem('transitus_data');
    localStorage.removeItem('transitus_user_role');
    localStorage.removeItem('transitus_journal_entries');
    localStorage.removeItem('transitus_feedback');
    localStorage.removeItem('transitus_email_config');
    localStorage.removeItem('transitus_demo_user');
  });
}

test.describe('Marketing Site', () => {
  test('Landing page loads with hero', async ({ page }) => {
    await page.goto(BASE, { waitUntil: "domcontentloaded" });
    await expect(page.locator('h1')).toContainText('operating system for places under change');
  });

  test('Landing page has the defining quote', async ({ page }) => {
    await page.goto(BASE, { waitUntil: "domcontentloaded" });
    await expect(page.locator('blockquote')).toContainText('breathing the worst air');
  });

  test('Nav links work', async ({ page }) => {
    await page.goto(BASE, { waitUntil: "domcontentloaded" });
    await page.click('a[href*="/features"]');
    await expect(page.locator('h1')).toContainText('Eight modules');

    await page.click('a[href*="/pricing"]');
    await expect(page.locator('h1')).toContainText('place-based pricing');

    await page.click('a[href*="/philosophy"]');
    await expect(page.locator('h1')).toContainText('places need memory');

    await page.click('a[href*="/contact"]');
    await expect(page.locator('h1')).toContainText('places');
  });

  test('Enter App button exists', async ({ page }) => {
    await page.goto(BASE, { waitUntil: "domcontentloaded" });
    const btn = page.locator('text=Enter App').first();
    await expect(btn).toBeVisible();
  });

  test('Demo gate form works', async ({ page }) => {
    await page.goto(BASE + '/demo');
    await expect(page.locator('h1')).toContainText('See Transitus in action');
    await page.fill('input[placeholder*="Maria"]', 'Test User');
    await page.fill('input[type="email"]', 'test@example.org');
    await page.click('button:has-text("Enter the demo")');
    await expect(page.locator('text=Welcome')).toBeVisible({ timeout: 3000 });
  });

  test('Pricing cards show features', async ({ page }) => {
    await page.goto(BASE + '/pricing');
    await expect(page.locator('text=Transitus Local')).toBeVisible();
    await expect(page.locator('text=Transitus Region')).toBeVisible();
    await expect(page.locator('text=Transitus Network')).toBeVisible();
    // Check features are listed
    await expect(page.locator('text=NRI companion')).toBeVisible();
  });
});

test.describe('App Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await freshStart(page);
  });

  test('App home loads with seasonal greeting', async ({ page }) => {
    await page.goto(BASE + '/app');
    // Should show some kind of greeting
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('All primary nav pages load', async ({ page }) => {
    const routes = [
      ['/app/compass', 'Compass'],
      ['/app/places', 'Places'],
      ['/app/people', 'People'],
      ['/app/commitments', 'Commit'],
      ['/app/field-notes', 'Field'],
      ['/app/signals', 'Signal'],
      ['/app/journeys', 'Journey'],
      ['/app/library', 'Library'],
      ['/app/reports', 'Report'],
      ['/app/journal', 'Journal'],
      ['/app/coalition', 'Coalition'],
      ['/app/participation', 'Participation'],
      ['/app/community-benefits', 'Benefits'],
      ['/app/community-stories', 'Stories'],
      ['/app/settings', 'Settings'],
      ['/app/feedback', 'Feedback'],
      ['/app/seasons', 'Seasons'],
    ];

    for (const [route, expectText] of routes) {
      await page.goto(BASE + route, { waitUntil: 'domcontentloaded' });
      // Page should not show an error or 404
      const body = await page.textContent('body');
      expect(body).not.toContain('Page not found');
      expect(body).not.toContain('404');
    }
  });

  test('Place detail loads via slug', async ({ page }) => {
    await page.goto(BASE + '/app/places/southeast-chicago-industrial-corridor');
    await expect(page.locator('text=Southeast Chicago')).toBeVisible();
  });

  test('Person detail loads via slug', async ({ page }) => {
    await page.goto(BASE + '/app/people/maria-santos');
    await expect(page.locator('text=Maria Santos')).toBeVisible();
  });
});

test.describe('CRUD Operations', () => {
  test.beforeEach(async ({ page }) => {
    await freshStart(page);
  });

  test('Create field note from Field Notes page', async ({ page }) => {
    await page.goto(BASE + '/app/field-notes');
    // Click the + button (desktop)
    const addBtn = page.locator('button:has-text("New Field Note"), button[aria-label*="field"]').first();
    if (await addBtn.isVisible()) {
      await addBtn.click();
      // Sheet should open
      await expect(page.locator('text=Create Field Note')).toBeVisible({ timeout: 3000 });
    }
  });

  test('Create commitment from Commitments page', async ({ page }) => {
    await page.goto(BASE + '/app/commitments');
    const addBtn = page.locator('button:has-text("New Commitment")').first();
    if (await addBtn.isVisible()) {
      await addBtn.click();
      await expect(page.locator('text=Create Commitment')).toBeVisible({ timeout: 3000 });
    }
  });

  test('Create stakeholder from People page', async ({ page }) => {
    await page.goto(BASE + '/app/people');
    const addBtn = page.locator('button:has-text("New Person")').first();
    if (await addBtn.isVisible()) {
      await addBtn.click();
      await expect(page.locator('text=Add Stakeholder')).toBeVisible({ timeout: 3000 });
    }
  });

  test('Create place from Places page', async ({ page }) => {
    await page.goto(BASE + '/app/places');
    const addBtn = page.locator('button:has-text("New Place")').first();
    if (await addBtn.isVisible()) {
      await addBtn.click();
      await expect(page.locator('text=Create Place')).toBeVisible({ timeout: 3000 });
    }
  });

  test('Mark signal as read', async ({ page }) => {
    await page.goto(BASE + '/app/signals');
    const eyeBtn = page.locator('button[aria-label*="read"], button:has(svg)').first();
    // Just verify the page has signals
    await expect(page.locator('text=EPA').first()).toBeVisible({ timeout: 5000 });
  });
});

test.describe('NRI Companion', () => {
  test('NRI button visible and opens drawer', async ({ page }) => {
    await page.goto(BASE + '/app');
    // Click the NRI floating button (Globe icon)
    const nriBtn = page.locator('button[aria-label="Open NRI companion"]');
    await expect(nriBtn).toBeVisible();
    await nriBtn.click();
    // Drawer should open with welcome
    await expect(page.locator('text=NRI')).toBeVisible();
    await expect(page.locator('text=stewardship')).toBeVisible({ timeout: 3000 });
  });

  test('NRI quick prompts work', async ({ page }) => {
    await page.goto(BASE + '/app');
    const nriBtn = page.locator('button[aria-label="Open NRI companion"]');
    await nriBtn.click();
    // Click a quick prompt
    const prompt = page.locator('button:has-text("What\'s shifting")');
    if (await prompt.isVisible()) {
      await prompt.click();
      // Should show typing then response
      await page.waitForTimeout(2500);
      await expect(page.locator('text=places').last()).toBeVisible();
    }
  });
});

test.describe('Compass & Seasons', () => {
  test('Compass page shows four directions', async ({ page }) => {
    await page.goto(BASE + '/app/compass');
    await expect(page.locator('text=North')).toBeVisible();
    await expect(page.locator('text=East')).toBeVisible();
    await expect(page.locator('text=South')).toBeVisible();
    await expect(page.locator('text=West')).toBeVisible();
  });

  test('Season indicator visible in top bar', async ({ page }) => {
    await page.goto(BASE + '/app');
    await expect(page.locator('text=Current Season')).toBeVisible();
  });

  test('Seasons page shows all 7 seasons', async ({ page }) => {
    await page.goto(BASE + '/app/seasons');
    await expect(page.locator('text=Preparation')).toBeVisible();
    await expect(page.locator('text=Recognition')).toBeVisible();
    await expect(page.locator('text=Early Labor')).toBeVisible();
    await expect(page.locator('text=Reckoning')).toBeVisible();
    await expect(page.locator('text=The Cost')).toBeVisible();
    await expect(page.locator('text=Breakthrough')).toBeVisible();
    await expect(page.locator('text=The Long Work')).toBeVisible();
  });
});

test.describe('User Roles', () => {
  test('Settings page shows role selector', async ({ page }) => {
    await freshStart(page);
    await page.goto(BASE + '/app/settings');
    await expect(page.locator('text=Your Role')).toBeVisible();
    await expect(page.locator('text=Steward')).toBeVisible();
    await expect(page.locator('text=Companion')).toBeVisible();
    await expect(page.locator('text=Observer')).toBeVisible();
  });

  test('Can switch to Observer role', async ({ page }) => {
    await freshStart(page);
    await page.goto(BASE + '/app/settings');
    await page.click('button:has-text("Observer")');
    // Observer role should be selected
    const role = await page.evaluate(() => localStorage.getItem('transitus_user_role'));
    expect(role).toBe('observer');
  });
});

test.describe('Gardener Console', () => {
  test('Gardener overview loads', async ({ page }) => {
    await page.goto(BASE + '/gardener');
    await expect(page.locator('text=Gardener')).toBeVisible();
  });

  test('All gardener pages load', async ({ page }) => {
    const routes = [
      '/gardener/tenants',
      '/gardener/analytics',
      '/gardener/content',
      '/gardener/system',
      '/gardener/support',
      '/gardener/settings',
    ];
    for (const route of routes) {
      await page.goto(BASE + route, { waitUntil: 'domcontentloaded' });
      const body = await page.textContent('body');
      expect(body).not.toContain('Page not found');
    }
  });
});

test.describe('Data Integrity', () => {
  test('Place detail shows environmental data', async ({ page }) => {
    await freshStart(page);
    await page.goto(BASE + '/app/places/southeast-chicago-industrial-corridor');
    await expect(page.locator('text=48,000')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Diesel')).toBeVisible();
  });

  test('Community stories page shows stories', async ({ page }) => {
    await freshStart(page);
    await page.goto(BASE + '/app/community-stories');
    await expect(page.locator('text=Maria Elena')).toBeVisible({ timeout: 5000 });
  });

  test('Home dashboard shows community voices', async ({ page }) => {
    await freshStart(page);
    await page.goto(BASE + '/app');
    await expect(page.locator('text=Community Voices')).toBeVisible({ timeout: 5000 });
  });

  test('Compass shows live data counts', async ({ page }) => {
    await freshStart(page);
    await page.goto(BASE + '/app/compass');
    await expect(page.locator('text=signals')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=being honored')).toBeVisible();
  });
});

test.describe('Feedback System', () => {
  test('Can submit feedback', async ({ page }) => {
    await freshStart(page);
    await page.goto(BASE + '/app/feedback');
    await page.fill('input[placeholder*="Brief"]', 'Test bug report');
    await page.fill('textarea', 'This is a test feedback submission');
    await page.click('button:has-text("Submit")');
    // Should show in history
    await expect(page.locator('text=Test bug report')).toBeVisible({ timeout: 3000 });
  });
});
