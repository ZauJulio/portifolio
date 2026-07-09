import { expect, test } from "@playwright/test";

import type { Page } from "@playwright/test";

// Live full-text search. The listings are SSR (`prerender: false`), so the
// `+data` loader re-runs on the Hono production server for every query. Typing
// debounces (useSearchDebounce, 300ms) → useSearchParamsNav patches `?q=` →
// Vike re-runs the loader and the listing re-filters server-side.
//
// The search box is a controlled React input, so the query must be entered as
// real keystrokes: `.fill()` sets the DOM value without a trusted per-key input
// event, so React never sees the change and the debounce effect never fires.
//
// The onChange handler only attaches once the page hydrates, so tests must wait
// for hydration before typing — otherwise the first keystrokes land on a still-
// static input and are lost. `waitForHydration` blocks on `networkidle` (all
// client chunks fetched) and focuses the box; typing then uses a per-key delay
// so each `input` event is dispatched as a distinct, trusted event.
async function waitForHydration(page: Page) {
  await page.waitForLoadState("networkidle");
  const box = page.getByRole("textbox").first();
  await box.click();
  return box;
}

async function typeQuery(page: Page, text: string): Promise<void> {
  const box = await waitForHydration(page);
  await box.pressSequentially(text, { delay: 30 });
}

test.describe("Live search", () => {
  test("articles: a query filters the listing server-side", async ({ page }) => {
    await page.goto("/articles");
    await expect(page.getByRole("heading", { level: 1, name: "Articles" })).toBeVisible();
    // Baseline: the (non-matching) ZSOM article is in the unfiltered listing.
    await expect(page.locator('a[href*="/articles/building-a-som-from-scratch"]')).toBeVisible();

    await typeQuery(page, "hyperdown");
    await expect(page).toHaveURL(/\/articles\?q=hyperdown$/);

    // The matching article stays; the non-matching ZSOM article is filtered out.
    await expect(page.locator('a[href*="/articles/getting-started-with-indago"]')).toBeVisible();
    await expect(page.locator('a[href*="/articles/building-a-som-from-scratch"]')).toHaveCount(0);
  });

  test("articles: clearing the query restores the full listing", async ({ page }) => {
    await page.goto("/articles?q=hyperdown");
    await expect(page.locator('a[href*="/articles/getting-started-with-indago"]')).toBeVisible();
    await expect(page.locator('a[href*="/articles/building-a-som-from-scratch"]')).toHaveCount(0);

    const box = await waitForHydration(page);
    await box.selectText();
    await box.press("Backspace");
    await expect(page).not.toHaveURL(/hyperdown/);
    await expect(page.locator('a[href*="/articles/building-a-som-from-scratch"]')).toBeVisible();
  });

  test("cooking: a query patches the URL and re-runs the loader", async ({ page }) => {
    await page.goto("/cooking");
    await expect(page.getByRole("heading", { level: 1, name: "Cooking" })).toBeVisible();

    await typeQuery(page, "pasta");
    await expect(page).toHaveURL(/\/cooking\?q=pasta$/);
  });
});
