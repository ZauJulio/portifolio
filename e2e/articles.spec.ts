import { expect, test } from "@playwright/test";

// Articles listing → detail navigation, against the pre-rendered (SSG) site
// served by server/static.ts (see playwright.config.ts webServer).

test.describe("Articles", () => {
  test("lists articles and opens a detail page", async ({ page }) => {
    await page.goto("/articles");

    await expect(page.getByRole("heading", { level: 1, name: /articles/i })).toBeVisible();

    const firstCard = page.locator('a[href*="/articles/"]').first();
    await expect(firstCard).toBeVisible();
    await firstCard.click();

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("link", { name: /back to articles/i })).toBeVisible();
  });

  test("serves the pre-rendered listing for a query URL", async ({ page }) => {
    // Live full-text search is SSR-only; the static preview serves the
    // pre-rendered page-1 listing, so we assert it still renders.
    await page.goto("/articles?q=som");
    await expect(page.locator('a[href*="/articles/"]').first()).toBeVisible();
  });
});
