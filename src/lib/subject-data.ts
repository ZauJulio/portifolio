import { reviewRepository } from "@hyper-down/content/review/builder";
import { render } from "vike/abort";

import type { ReviewMeta } from "@indago/hyper-down";
import type { PageContextServer } from "vike/types";

interface Identifiable {
  id: string;
}

type ItemsByLocale<T> = Record<string, T[]>;

function pickLocaleItems<T>(locale: string, itemsByLocale: ItemsByLocale<T>): T[] {
  if (itemsByLocale[locale]) return itemsByLocale[locale];

  const baseLocale = locale.split("-")[0];
  const fallbackKey = Object.keys(itemsByLocale).find((key) => key.split("-")[0] === baseLocale);
  if (fallbackKey) return itemsByLocale[fallbackKey];

  if (itemsByLocale.en) return itemsByLocale.en;

  const [firstLocale] = Object.keys(itemsByLocale);
  return firstLocale ? itemsByLocale[firstLocale] : [];
}

// Shared `+data.ts` body for the games/books/movies `@slug` detail pages:
// locale-pick the JSON item by id, then fetch its reciprocal review (if any)
// via `subjectId`. Each page's own +data.ts stays a thin call into this so
// Vike still finds a per-route `data` export.
export function createSubjectData<T extends Identifiable>(
  type: string,
  itemsByLocale: ItemsByLocale<T>,
) {
  return async function data({ canonical: locale, routeParams: { slug } }: PageContextServer) {
    const items = pickLocaleItems(locale, itemsByLocale);
    const item = items.find((i) => i.id === slug);
    if (!item) throw render(404);

    const { results } = await reviewRepository.search({
      locale,
      filters: { type, subjectId: item.id },
      pagination: { page: 1, pageSize: 1 },
    });

    return { ...item, review: results[0] as ReviewMeta | undefined };
  };
}

// Shared `+onBeforePrerenderStart.ts` body: list `${basePath}/${id}` for
// every English item (the canonical locale set used to enumerate static paths).
export function createPrerenderPaths(basePath: string, items: Identifiable[]) {
  return function onBeforePrerenderStart(): string[] {
    return items.map((item) => `${basePath}/${item.id}`);
  };
}
