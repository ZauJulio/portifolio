import { articleRepository } from "@hyper-down/content/article/builder";
import vike from "@vikejs/hono";
import { Hono } from "hono";

// Hono host for the Vike app (https://vike.dev/hono). SSG covers most routes;
// when this server runs, Vike re-runs each page's `+data` hook server-side on
// navigation — that is the live SSR search powering the article/recipe listing
// pages before redirecting to a (prerendered) detail page.
function getApp() {
  const app = new Hono();

  // Instant page + section search for the in-article search box. Prerendered
  // detail pages have no client DB, so the box fetches this JSON endpoint.
  // Routes registered before `vike(app)` take precedence over the SSR catch-all
  // (and, on Vercel, this still resolves through the single SSR function).
  //   ?q=<query>            global: matching articles + section hits (all articles)
  //   ?q=<query>&slug=<s>   "this page" (#) mode: section hits within one article
  //   &locale=<en|pt-BR>    scope to a DB locale (omit for all)
  app.get("/api/search", async (c) => {
    const q = (c.req.query("q") ?? "").trim();
    const slug = c.req.query("slug") || undefined;
    const locale = c.req.query("locale") || undefined;

    if (!q) return c.json({ pages: [], sections: [] });

    if (slug) {
      const sections = await articleRepository.searchSections({
        searchQuery: q,
        locale,
        slug,
        limit: 30,
      });
      return c.json({ pages: [], sections });
    }

    const [pages, sections] = await Promise.all([
      articleRepository.search({ searchQuery: q, locale, pagination: { page: 1, pageSize: 6 } }),
      articleRepository.searchSections({ searchQuery: q, locale, limit: 12 }),
    ]);

    return c.json({
      pages: pages.results.map((p) => ({ slug: p.slug, title: p.title, locale: p.locale })),
      sections,
    });
  });

  vike(app);
  return app;
}

export const app = getApp();
