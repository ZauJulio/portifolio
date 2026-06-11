import { expect, test } from "@playwright/test";

// Regression: in-page refinements and the language switch must NOT jump to the
// top. Vike's client router intercepts every <a> click and — ignoring
// `e.preventDefault()` — scrolls to top (verified: a facet link without the
// opt-out resets scrollY 169→0). The fix:
//
//   • Filter chips carry `data-vike="false"` so Vike ignores the click; their
//     onClick then drives useSearchParamsNav.setParams (keepScrollPosition).
//   • The language switcher passes keepScrollPosition to navigate().
//
// The language-switch case is asserted behaviorally (content length is stable,
// so the offset is preserved exactly). The filter cases are asserted
// structurally — the prerendered SSG site can't re-run `+data` client-side, so
// a filtered listing renders a different height and the offset legitimately
// clamps, which would make a runtime scroll assertion flaky. The data-vike
// attribute is the deterministic, environment-independent guard. (Runtime scroll
// preservation for filters was verified manually on the dev server.)

test.describe("scroll position is preserved", () => {
  test.use({ viewport: { width: 1024, height: 500 } });

  test("articles: tag chips opt out of Vike's scroll-to-top link interception", async ({
    page,
  }) => {
    await page.goto("/articles");
    await expect(page.getByRole("heading", { level: 1, name: "Articles" })).toBeVisible();

    // Every tag filter link (chips + per-card tags) must carry data-vike="false".
    const tagLinks = page.locator('a[href^="/articles?tag="]');
    const count = await tagLinks.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      await expect(tagLinks.nth(i)).toHaveAttribute("data-vike", "false");
    }
  });

  test("cooking: facet chips opt out of Vike's scroll-to-top link interception", async ({
    page,
  }) => {
    await page.goto("/cooking");
    await expect(page.getByRole("heading", { level: 1, name: "Cooking" })).toBeVisible();

    // Cuisine/meal/course facet links (chips + per-card badges) must opt out.
    const facetLinks = page.locator(
      'a[href*="cuisine="], a[href*="mealType="], a[href*="courseType="]',
    );
    const count = await facetLinks.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      await expect(facetLinks.nth(i)).toHaveAttribute("data-vike", "false");
    }
  });

  test("switching language keeps the scroll offset on an article", async ({ page }) => {
    await page.goto("/articles/building-a-som-from-scratch");
    // The PageMinimap clones the <article>, so there are two h1s — take the first.
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
    // `scroll-behavior: smooth` (root.css) would animate an erroneous scroll-to-top
    // over time; force `auto` so a regression lands at 0 immediately.
    await page.addStyleTag({ content: "html{scroll-behavior:auto !important}" });

    await page.evaluate(() => window.scrollTo({ top: 1500, behavior: "instant" }));
    const before = await page.evaluate(() => Math.round(window.scrollY));
    expect(before).toBeGreaterThan(200);

    await page.getByRole("button", { name: /switch to pt/i }).click();
    await expect(page).toHaveURL(/\/pt\/articles\/building-a-som-from-scratch/);

    await page.waitForTimeout(500);
    const after = await page.evaluate(() => Math.round(window.scrollY));
    expect(Math.abs(after - before)).toBeLessThan(30);
  });
});
