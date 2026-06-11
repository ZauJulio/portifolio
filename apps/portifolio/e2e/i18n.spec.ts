import { expect, test } from "@playwright/test";

// i18n routing on the pre-rendered site: the default locale is prefix-free and
// pt-BR lives under /pt. Locale-aware <Link>s keep the visitor on the same
// language by prefixing their hrefs.

test.describe("i18n routing", () => {
  test("serves the Portuguese articles listing under /pt", async ({ page }) => {
    await page.goto("/pt/articles");

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    // Cards on the /pt listing link to /pt-prefixed detail routes.
    const ptCard = page.locator('a[href*="/pt/articles/"]').first();
    await expect(ptCard).toBeVisible();
  });

  test("the language switcher keeps the visitor on the same page", async ({ page }) => {
    await page.goto("/articles");

    await page.getByRole("button", { name: /switch to pt/i }).click();

    await expect(page).toHaveURL(/\/pt\/articles\/?$/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
});

// Regression: the active locale must survive the full /pt → /pt/cooking →
// /pt/cooking?cuisine=Italiana flow — across direct navigation, internal links,
// query refinements (useSearchParamsNav must rebuild from the locale-prefixed
// path, not the stripped one) and a hard reload (F5). The localized <h1> text
// ("Culinária"/"Artigos" vs "Cooking"/"Articles") is the language assertion.
test.describe("locale persists across the navigation flow (cooking)", () => {
  test("pt-BR: direct nav, internal links and F5 keep /pt and Portuguese", async ({ page }) => {
    // 1. Direct nav to the pt home → its hobby links are /pt-prefixed.
    await page.goto("/pt");
    const cookingCard = page.locator('a[href="/pt/cooking"]').first();
    await expect(cookingCard).toBeVisible();

    // 2. Internal link → /pt/cooking, rendered in Portuguese.
    await cookingCard.click();
    await expect(page).toHaveURL(/\/pt\/cooking\/?$/);
    await expect(page.getByRole("heading", { level: 1, name: "Culinária" })).toBeVisible();

    // 3. Cuisine facet chip → /pt/cooking?cuisine=Italiana. The chip (first in DOM,
    //    before the results) drives useSearchParamsNav, which must rebuild from the
    //    /pt-prefixed path (else it bounces to the default-locale site).
    await page.locator('a[href="/pt/cooking?cuisine=Italiana"]').first().click();
    await expect(page).toHaveURL(/\/pt\/cooking\?cuisine=Italiana$/);
    await expect(page.getByRole("heading", { level: 1, name: "Culinária" })).toBeVisible();

    // 4. F5: the locale-stripping route + the query both survive a hard reload.
    await page.reload();
    await expect(page).toHaveURL(/\/pt\/cooking\?cuisine=Italiana$/);
    await expect(page.getByRole("heading", { level: 1, name: "Culinária" })).toBeVisible();
  });

  test("en (default): /cooking?cuisine=Italian stays prefix-free through F5", async ({ page }) => {
    await page.goto("/cooking?cuisine=Italian");
    await expect(page).not.toHaveURL(/\/pt\//);
    await expect(page.getByRole("heading", { level: 1, name: "Cooking" })).toBeVisible();

    await page.reload();
    await expect(page).toHaveURL(/\/cooking\?cuisine=Italian$/);
    await expect(page).not.toHaveURL(/\/pt\//);
    await expect(page.getByRole("heading", { level: 1, name: "Cooking" })).toBeVisible();
  });
});

test.describe("locale persists across the navigation flow (articles)", () => {
  test("pt-BR: direct nav and F5 on a query URL keep /pt and Portuguese", async ({ page }) => {
    await page.goto("/pt/articles?q=som");
    await expect(page).toHaveURL(/\/pt\/articles\?q=som$/);
    await expect(page.getByRole("heading", { level: 1, name: "Artigos" })).toBeVisible();

    await page.reload();
    await expect(page).toHaveURL(/\/pt\/articles\?q=som$/);
    await expect(page.getByRole("heading", { level: 1, name: "Artigos" })).toBeVisible();
  });

  test("en (default): /articles?q=som stays prefix-free through F5", async ({ page }) => {
    await page.goto("/articles?q=som");
    await expect(page).not.toHaveURL(/\/pt\//);
    await expect(page.getByRole("heading", { level: 1, name: "Articles" })).toBeVisible();

    await page.reload();
    await expect(page).toHaveURL(/\/articles\?q=som$/);
    await expect(page.getByRole("heading", { level: 1, name: "Articles" })).toBeVisible();
  });
});
