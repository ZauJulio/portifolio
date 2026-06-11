import { articleRepository } from "@hyper-down/content/article/builder";

import type { PageContextServer } from "vike/types";

const ARTICLES_PAGE_SIZE = 9;
const SORTABLE_COLUMNS = new Set(["date", "title"] as const);

export type SortKey = typeof SORTABLE_COLUMNS extends Set<infer U> ? U : never;
export type Data = Awaited<ReturnType<typeof data>>;

/**
 * SSR/SSG: paginated, filtered, full-text article search driven by the URL query.
 * Under the Hono server each URL change re-runs this hook server-side (live
 * search); the static prerender renders the default page-1 listing.
 */
export async function data({ canonical: locale, urlParsed: { search } }: PageContextServer) {
  const searchQuery = (search.q ?? "").trim();
  const activeTag = search.tag ?? null;

  const page = Math.max(1, Number(search.page) || 1);

  const sort = search.sort as SortKey | undefined;
  const sortBy = sort && SORTABLE_COLUMNS.has(sort) ? sort : "date";
  const sortDir = search.sortDir === "asc" ? "asc" : "desc";

  const [page_, tags] = await Promise.all([
    articleRepository.search({
      // FTS matches across every locale; `locale` scopes the returned rows to
      // the active locale (one row per slug).
      locale,
      searchQuery,
      filters: activeTag ? { tag: activeTag } : {},
      sort: { sortBy, sortDir },
      pagination: { page, pageSize: ARTICLES_PAGE_SIZE },
    }),
    articleRepository.distinctValues(
      {
        isJson: true,
        column: "tags",
        sortByFrequency: true,
      },
      locale,
    ),
  ]);

  return { ...page_, tags, searchQuery, activeTag, sortBy, sortDir };
}
