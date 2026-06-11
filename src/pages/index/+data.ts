import { articleRepository } from "@hyper-down/content/article/builder";

import type { PageContextServer } from "vike/types";

export type Data = Awaited<ReturnType<typeof data>>;

/** SSR/SSG: the latest articles for the home "Latest articles" section. */
export async function data({ locale }: PageContextServer) {
  const { results } = await articleRepository.search({
    locale,
    sort: { sortBy: "date", sortDir: "desc" },
    pagination: { page: 1, pageSize: 4 },
  });

  return { articles: results };
}
