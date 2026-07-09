import { getSlugs } from "@/lib/content-slugs";

// Default-locale review detail URLs to prerender. The global +onBeforePrerender
// hook clones each into its `/pt` variant (https://vike.dev/i18n).
export function onBeforePrerenderStart(): string[] {
  return getSlugs("review").map((slug) => `/reviews/${slug}`);
}
