import { reviewRepository } from "@hyper-down/content/review/builder";

import type { PageContextServer } from "vike/types";

const REVIEWS_PAGE_SIZE = 9;
const SORTABLE_COLUMNS = new Set(["date", "title"] as const);

export type SortKey = typeof SORTABLE_COLUMNS extends Set<infer U> ? U : never;
export type Data = Awaited<ReturnType<typeof data>>;

/**
 * SSR/SSG: paginated, filtered, full-text review search driven by the URL query.
 * Mirrors `articles/+data.ts` — see its comments for the live-search rationale.
 */
export async function data({ canonical: locale, urlParsed: { search } }: PageContextServer) {
  const searchQuery = (search.q ?? "").trim();
  const activeTag = search.tag ?? null;

  const page = Math.max(1, Number(search.page) || 1);

  const sort = search.sort as SortKey | undefined;
  const sortBy = sort && SORTABLE_COLUMNS.has(sort) ? sort : "date";
  const sortDir = search.sortDir === "asc" ? "asc" : "desc";

  const [page_, tags] = await Promise.all([
    reviewRepository.search({
      locale,
      searchQuery,
      filters: activeTag ? { tag: activeTag } : {},
      sort: { sortBy, sortDir },
      pagination: { page, pageSize: REVIEWS_PAGE_SIZE },
    }),
    reviewRepository.distinctValues(
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
