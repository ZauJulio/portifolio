import { recipeRepository } from "@hyper-down/content/recipe/builder";
import { render } from "vike/abort";

import type { PageContextServer } from "vike/types";

export type Data = Awaited<ReturnType<typeof data>>;

/**
 * SSR/SSG: recipe metadata for the detail page (MDX body resolved in the view),
 * plus up to three tag-ranked suggestions for the "you might also like" strip.
 */
export async function data({ canonical: locale, routeParams }: PageContextServer) {
  const recipe = await recipeRepository.getMetaBySlug(routeParams?.slug, locale);
  // A missing slug — including a draft, which is excluded from the DB — must
  // return a real 404, not a soft 200 "not found" view. A 200 would emit a
  // self-referential canonical + JSON-LD for an unpublished URL, leaving it
  // indexable; `render(404)` renders the _error page with the right status.
  if (!recipe) throw render(404);

  const related = recipe.tags?.length
    ? await recipeRepository.related({ slug: recipe.slug, tags: recipe.tags, locale, limit: 3 })
    : [];

  return { ...recipe, related };
}
