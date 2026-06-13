import { articleRepository } from "@hyper-down/content/article/builder";

import type { PageContextServer } from "vike/types";

export type Data = Awaited<ReturnType<typeof data>>;

/** SSR/SSG: the latest articles for the home "Latest articles" section. */
export async function data({ canonical: locale }: PageContextServer) {
  const { results } = await articleRepository.search({
    // The content DB is keyed by the BCP-47 `canonical` locale (`en` / `pt-BR`),
    // not the app locale (`en` / `pt`) — `pt` matches no rows and empties the
    // section on `/pt`. Mirror the articles listing loader, which uses `canonical`.
    locale,
    sort: { sortBy: "date", sortDir: "desc" },
    pagination: { page: 1, pageSize: 4 },
  });

  return { articles: results };
}
