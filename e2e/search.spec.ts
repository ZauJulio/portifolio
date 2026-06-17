import { expect, test } from "@playwright/test";

// Live full-text search. The listings are SSR (`prerender: false`), so the
// `+data` loader re-runs on the Hono production server for every query. Typing
// debounces (useSearchDebounce, 300ms) → useSearchParamsNav patches `?q=` →
// Vike re-runs the loader and the listing re-filters server-side.

test.describe("Live search", () => {
  test("articles: a query filters the listing server-side", async ({ page }) => {
    await page.goto("/articles");
    await expect(page.getByRole("heading", { level: 1, name: "Articles" })).toBeVisible();
    // Baseline: the (non-matching) ZSOM article is in the unfiltered listing.
    await expect(page.locator('a[href*="/articles/building-a-som-from-scratch"]')).toBeVisible();

    await page.getByRole("textbox").first().fill("hyperdown");
    await expect(page).toHaveURL(/\/articles\?q=hyperdown$/);

    // The matching article stays; the non-matching ZSOM article is filtered out.
    await expect(page.locator('a[href*="/articles/what-is-indago"]')).toBeVisible();
    await expect(page.locator('a[href*="/articles/building-a-som-from-scratch"]')).toHaveCount(0);
  });

  test("articles: clearing the query restores the full listing", async ({ page }) => {
    await page.goto("/articles?q=hyperdown");
    await expect(page.locator('a[href*="/articles/what-is-indago"]')).toBeVisible();
    await expect(page.locator('a[href*="/articles/building-a-som-from-scratch"]')).toHaveCount(0);

    await page.getByRole("textbox").first().fill("");
    await expect(page).not.toHaveURL(/hyperdown/);
    await expect(page.locator('a[href*="/articles/building-a-som-from-scratch"]')).toBeVisible();
  });

  test("cooking: a query patches the URL and re-runs the loader", async ({ page }) => {
    await page.goto("/cooking");
    await expect(page.getByRole("heading", { level: 1, name: "Cooking" })).toBeVisible();

    await page.getByRole("textbox").first().fill("pasta");
    await expect(page).toHaveURL(/\/cooking\?q=pasta$/);
  });
});
