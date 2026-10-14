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
