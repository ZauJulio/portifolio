import { expect, test } from "@playwright/test";

// Cooking (recipes) listing → detail navigation, against the pre-rendered site.

test.describe("Recipes", () => {
  test("lists recipes and opens a detail page", async ({ page }) => {
    await page.goto("/cooking");

    await expect(page.getByRole("heading", { level: 1, name: /cooking/i })).toBeVisible();

    const firstCard = page.locator('a[href*="/cooking/"]').first();
    await expect(firstCard).toBeVisible();
    await firstCard.click();

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("link", { name: /back to/i })).toBeVisible();
  });
});
