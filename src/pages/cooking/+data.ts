import { recipeRepository } from "@hyper-down/content/recipe/builder";

import type { PageContextServer } from "vike/types";

/** Recipes shown per page in the listing. */
const RECIPES_PAGE_SIZE = 9;

export type Data = Awaited<ReturnType<typeof data>>;

/**
 * SSR/SSG: paginated, filtered, full-text recipe search + cuisine/meal/course
 * facets driven by the URL query. Under the Hono server each URL change re-runs
 * this hook server-side (live search); the static prerender renders page 1.
 */
export async function data({ canonical: locale, urlParsed: { search } }: PageContextServer) {
  // `canonical` is the canonical DB tag (`en`/`pt-BR`) the repository filters on
  // (`WHERE locale = ?`), derived once in +onBeforeRoute.
  const searchQuery = (search.q ?? "").trim();
  const page = Math.max(1, Number(search.page) || 1);

  const [page_, cuisines, mealTypes, courseTypes] = await Promise.all([
    recipeRepository.search({
      // FTS matches across every locale; `locale` scopes the returned rows to
      // the active locale (one row per slug).
      locale,
      searchQuery,
      filters: {
        cuisine: search.cuisine,
        mealType: search.mealType,
        courseType: search.courseType,
      },
      pagination: {
        page,
        pageSize: RECIPES_PAGE_SIZE,
      },
    }),
    recipeRepository.distinctValues({ column: "cuisine", sortByFrequency: true }, locale),
    recipeRepository.distinctValues({ column: "mealType", sortByFrequency: true }, locale),
    recipeRepository.distinctValues({ column: "courseType", sortByFrequency: true }, locale),
  ]);

  return {
    ...page_,
    searchQuery,
    filters: {
      cuisines: ["All", ...cuisines],
      mealTypes: ["All", ...mealTypes],
      courseTypes: ["All", ...courseTypes],
    },
    activeCuisine: search.cuisine ?? "All",
    activeMealType: search.mealType ?? "All",
    activeCourseType: search.courseType ?? "All",
  };
}
