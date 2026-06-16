import { contentModules, type ContentType } from "@hyper-down/default";

// Build-time helper: enumerate the slugs of an MD/MDX content collection from
// the generated module map, used by the @slug pages' onBeforePrerenderStart
// hooks to list the detail URLs to statically render.
//
// Deriving from `contentModules` (rather than scanning `content/` on disk) is
// load-bearing for drafts: codegen negates draft files out of this exact glob,
// so a draft is never enumerated — no prerendered detail page, no leaked URL.
export function getSlugs(type: ContentType): string[] {
  const modules = contentModules[type] as Record<string, unknown> | undefined;
  if (!modules) return [];

  const slugs = new Set<string>();
  for (const path of Object.keys(modules)) {
    const match = path.match(/([^/]+)\.mdx?$/i);
    if (match) slugs.add(match[1]);
  }

  return Array.from(slugs);
}
