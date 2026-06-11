import { getSlugs } from "@/lib/content-slugs";

// Default-locale article detail URLs to prerender. The global +onBeforePrerender
// hook clones each into its `/pt` variant (https://vike.dev/i18n).
export function onBeforePrerenderStart(): string[] {
  return getSlugs("article").map((slug) => `/articles/${slug}`);
}
