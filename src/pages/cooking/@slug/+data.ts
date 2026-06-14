import { recipeRepository } from "@hyper-down/content/recipe/builder";

import type { PageContextServer } from "vike/types";

export type Data = Awaited<ReturnType<typeof data>>;

/**
 * SSR/SSG: recipe metadata for the detail page (MDX body resolved in the view),
 * plus up to three tag-ranked suggestions for the "you might also like" strip.
 */
export async function data({ canonical: locale, routeParams }: PageContextServer) {
  const recipe = await recipeRepository.getMetaBySlug(routeParams?.slug, locale);
  if (!recipe) return undefined;

  const related = recipe.tags?.length
    ? await recipeRepository.related({ slug: recipe.slug, tags: recipe.tags, locale, limit: 3 })
    : [];

  return { ...recipe, related };
}
