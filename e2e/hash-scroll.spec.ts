import { expect, test } from "@playwright/test";

// Regression for the in-article table-of-contents scroll bug:
//   1. The PageMinimap clones the whole <article> into a scaled mirror. It used
//      to keep the cloned heading ids, duplicating every anchor. Because the
//      minimap renders before <article>, `getElementById` then targeted the
//      fixed mirror copy and the page never scrolled.
//   2. Vike intercepts `<a href="#…">` via pushState (no native hashchange), so
//      a capture-phase click listener performs the scroll + URL sync.
//
// Both are pure client behavior, so they're exercisable against the static build.

const ARTICLE = "/articles/building-a-som-from-scratch";
const ANCHOR = "numba-acceleration";

test.describe("Article TOC hash scrolling", () => {
  test("clicking a summary link scrolls to the real heading", async ({ page }) => {
    // The target heading sits ~22k px down, and `useHashScroll` scrolls with
    // `behavior: "smooth"`. The animation is rAF-driven, so its wall-clock
    // duration is unbounded under parallel-worker CPU starvation (it overran even
    // a 15s deadline in the full suite). Chromium honours `prefers-reduced-motion`,
    // which forces `scrollIntoView` to settle instantly — making the landing
    // position deterministic while exercising the exact same targeting code path.
    await page.emulateMedia({ reducedMotion: "reduce" });

    await page.goto(ARTICLE);

    // Scope to <article>: the minimap mirror also clones the TOC anchors (it
    // strips ids but keeps hrefs), and being fixed-position it would intercept
    // the click. The real summary link lives inside the article body.
    const tocLink = page.locator(`article a[href="#${ANCHOR}"]`).first();
    await expect(tocLink).toBeVisible();

    // Wait until the minimap has cloned the article — this is exactly when a
    // duplicate-id regression would manifest.
    await page
      .waitForFunction(
        () => {
          const nav = document.querySelector('nav[aria-label="Article minimap"]');
          if (!nav) return false;
          return !nav.className.includes("opacity-0");
        },
        { timeout: 10_000 },
      )
      .catch(() => {
        /* minimap is xl-only; proceed regardless */
      });

    // The heading id must be unique (the clone must not duplicate it).
    const idCount = await page.evaluate(
      (id) => document.querySelectorAll(`[id="${id}"]`).length,
      ANCHOR,
    );
    expect(idCount).toBe(1);

    expect(await page.evaluate(() => window.scrollY)).toBe(0);

    // Dispatch a real click event on the anchor (the fixed minimap overlaps the
    // link's coordinates, so a synthetic mouse click would hit the minimap).
    // The capture-phase listener handles it exactly as for a user click.
    await page.evaluate((id) => {
      document.querySelector<HTMLAnchorElement>(`article a[href="#${id}"]`)?.click();
    }, ANCHOR);

    // Under reduced motion the scroll settles instantly with the real heading at
    // the top of the viewport (it would stay at 0 if the fixed mirror copy were
    // targeted), so this resolves at once rather than racing an animation.
    await page.waitForFunction(
      (id) => {
        const el = document.getElementById(id);
        return !!el && Math.abs(el.getBoundingClientRect().top) < 120;
      },
      ANCHOR,
      { timeout: 5_000 },
    );

    await expect(page).toHaveURL(new RegExp(`#${ANCHOR}$`));
    expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(200);
  });
});
