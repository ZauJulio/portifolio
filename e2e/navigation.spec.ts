import { expect, test } from "@playwright/test";

// Home (SSG) → content sections and back. The home hobby cards link into the
// content sections; every listing's header links back to the portfolio home.

test.describe("Navigation", () => {
  test("home renders and the cooking hobby links to /cooking", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Zaú Júlio/);

    const cookingLink = page.locator('a[href="/cooking"]').first();
    await expect(cookingLink).toBeVisible();
    await cookingLink.click();

    await expect(page).toHaveURL(/\/cooking\/?$/);
    await expect(page.getByRole("heading", { level: 1, name: "Cooking" })).toBeVisible();
  });

  test("a listing links back to the portfolio home", async ({ page }) => {
    await page.goto("/articles");
    await expect(page.getByRole("heading", { level: 1, name: "Articles" })).toBeVisible();

    await page.getByRole("link", { name: /back to portfolio/i }).click();
    await expect(page).toHaveURL(/\/$/);
  });

  test("the breadcrumb home link returns to the portfolio root", async ({ page }) => {
    await page.goto("/articles");
    await page
      .getByRole("navigation", { name: /breadcrumb/i })
      .getByRole("link", { name: /home/i })
      .click();
    await expect(page).toHaveURL(/\/$/);
  });
});
