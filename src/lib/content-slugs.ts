import { readdirSync } from "node:fs";
import { resolve } from "node:path";

import type { ContentType } from "@hyper-down/default";

// Build-time helper: enumerate the slugs of an MD/MDX content collection
// (mirrors the React Router `getMarkdownSlugs`). Used by the @slug pages'
// onBeforePrerenderStart hooks to list the detail URLs to statically render.
//
// Resolve from `process.cwd()` (the app dir during `vike build`) rather than
// `import.meta.url`: Vike bundles these hooks into `dist/server/`, so a path
// relative to the module would point inside the build output, not `content/`.
const contentDir = resolve(process.cwd(), "content");

export function getSlugs(type: ContentType): string[] {
  const dir = resolve(contentDir, type);
  const slugs = new Set<string>();

  let locales: string[];

  try {
    locales = readdirSync(dir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);
  } catch {
    return [];
  }

  for (const locale of locales) {
    let files: string[];

    try {
      files = readdirSync(resolve(dir, locale));
    } catch {
      continue;
    }

    for (const file of files) {
      if (/\.mdx?$/i.test(file)) slugs.add(file.replace(/\.mdx?$/i, ""));
    }
  }

  return Array.from(slugs);
}
