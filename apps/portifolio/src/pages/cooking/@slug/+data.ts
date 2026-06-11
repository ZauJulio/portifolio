import { recipeRepository } from "@hyper-down/content/recipe/builder";

import type { PageContextServer } from "vike/types";

export type Data = Awaited<ReturnType<typeof data>>;

/** SSR/SSG: recipe metadata for the detail page (MDX body resolved in the view). */
export async function data(pageContext: PageContextServer) {
  return await recipeRepository.getMetaBySlug(pageContext.routeParams?.slug, pageContext.locale);
}
