import { articleRepository } from "@hyper-down/content/article/builder";
import { render } from "vike/abort";

import type { PageContextServer } from "vike/types";

export type Data = Awaited<ReturnType<typeof data>>;

/**
 * SSR/SSG: article metadata for the detail page (MDX body resolved in the view),
 * plus the series neighbours (`prev`/`next` frontmatter slugs) and up to three
 * tag-ranked suggestions for the "you might also like" strip.
 */
export async function data({ canonical: locale, routeParams: { slug } }: PageContextServer) {
  // `canonical` is the DB tag (`en`/`pt-BR`); the app `locale` (`en`/`pt`) never
  // matches `pt-BR` rows -- it would always fall back to English on /pt.
  const article = await articleRepository.getMetaBySlug(slug, locale);
  // A missing slug — including a draft, which is excluded from the DB — must
  // return a real 404, not a soft 200 "not found" view. A 200 would emit a
  // self-referential canonical + JSON-LD for an unpublished URL, leaving it
  // indexable; `render(404)` renders the _error page with the right status.
  if (!article) throw render(404);

  const [related, prevMeta, nextMeta] = await Promise.all([
    article.tags?.length
      ? articleRepository.related({ slug: article.slug, tags: article.tags, locale, limit: 3 })
      : [],
    article.prev ? articleRepository.getMetaBySlug(article.prev, locale) : undefined,
    article.next ? articleRepository.getMetaBySlug(article.next, locale) : undefined,
  ]);

  return { ...article, related, prevMeta, nextMeta };
}
