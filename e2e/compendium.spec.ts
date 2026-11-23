import { expect, test } from '@playwright/test';

test('loads a compendium section and opens an entry card', async ({ page }) => {
  await page.goto('/postac/rasy');
  await expect(page.getByRole('heading', { name: 'Postać' })).toBeVisible();
  await page.getByRole('link', { name: 'Człowiek', exact: true }).click();
  await expect(page).toHaveURL(/\/karta\/race\//);
  await expect(page.locator('app-entity-card')).toBeVisible();
});

test('searches the rules index and navigates to the matching entry', async ({ page }) => {
  await page.goto('/');
  const search = page.getByRole('searchbox').first();
  await search.fill('człowiek');
  await search.press('Enter');

  await expect(page).toHaveURL(/\/szukaj\?q=cz/);
  const result = page.getByRole('link', { name: /człowiek/i }).first();
  await expect(result).toBeVisible();
  await result.click();
  await expect(page).toHaveURL(/\/karta\//);
  await expect(page.locator('app-entity-card')).toBeVisible();
});

test('shows the inconsistency section and preserves the route on direct navigation', async ({
  page,
}) => {
  await page.goto('/niespojnosci');
  await expect(page.getByRole('heading', { name: 'Niespójności' })).toBeVisible();
  await expect(page.locator('main')).toContainText(/niespójno/i);
});

test('renders the navigation at a mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Menu' })).toBeVisible();
  await page.getByRole('button', { name: 'Menu' }).click();
  await expect(page.getByRole('navigation', { name: 'Nawigacja mobilna' })).toBeVisible();
});

test('persists a favorite after navigation and reload', async ({ page }) => {
  await page.goto('/postac/rasy');
  await page.getByRole('link', { name: 'Człowiek', exact: true }).first().click();
  await page.getByRole('button', { name: 'Dodaj do ulubionych' }).first().click();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Usuń z ulubionych' }).first()).toBeVisible();
});


test('rules card preserves line breaks', async ({ page }) => {
  await page.goto('/karta/combat/tereny_specjalne');
  const whiteSpace = await page
    .locator('.rule__definition')
    .evaluate((el) => getComputedStyle(el).whiteSpace);
  expect(whiteSpace).toBe('pre-line');
});


test('search does not show meta inconsistencies', async ({ page }) => {
  await page.goto('/szukaj?q=morale');
  await expect(page.getByRole('link', { name: /^Morale$/ }).first()).toBeVisible();
  await expect(page.getByText('Niespójności · Niespójność')).toHaveCount(0);
});


test('footer shows source version and revision', async ({ page }) => {
  await page.goto('/');
  const footer = page.locator('footer');
  await expect(footer).toContainText('0.1.24');
  await expect(footer).toContainText('8956f4d');
});


test('long rules card fits a mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/karta/combat/tereny_specjalne');
  await expect(page.locator('app-rule-card')).toBeVisible();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth + 1,
  );
  expect(overflow).toBe(false);
});


test('legacy combat card url redirects', async ({ page }) => {
  await page.goto('/karta/combat/stamina_mana');
  await expect(page).toHaveURL(/\/karta\/combat\/stamina_mana_walka$/);
  await expect(page.locator('app-rule-card')).toBeVisible();
});
