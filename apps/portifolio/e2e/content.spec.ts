import { expect, test } from "@playwright/test";

// Detail pages are prerendered (SSG): the MD/MDX body is inlined into the static
// HTML at build time (HyperDown's eager content glob). These assert the rendered
// *body* — not just the title — so a broken MDX pipeline (an empty <article>)
// is caught. Counts only ever grow with the PageMinimap clone, so "at least one
// visible" stays robust whether or not the minimap mirror is present.

test.describe("Content rendering", () => {
  test("an article detail renders its MDX body", async ({ page }) => {
    await page.goto("/articles");
    await expect(page.getByRole("heading", { level: 1, name: /articles/i })).toBeVisible();

    const card = page.locator('a[href*="/articles/"]').first();
    await expect(card).toBeVisible();
    await card.click();

    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
    // The markdown body renders section sub-headings (## → <h2>) inside the article.
    await expect(page.getByRole("heading", { level: 2 }).first()).toBeVisible();
  });

  test("a recipe detail renders its MDX body", async ({ page }) => {
    await page.goto("/cooking");
    await expect(page.getByRole("heading", { level: 1, name: /cooking/i })).toBeVisible();

    const card = page.locator('a[href*="/cooking/"]').first();
    await expect(card).toBeVisible();
    await card.click();

    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
    // The recipe body renders prose inside <article> (more than just the title).
    await expect(page.locator("article p").first()).toBeVisible();
  });
});
