import { getT } from "@/i18n";

import type { PageContext } from "vike/types";

// Computed page title (https://vike.dev/title) — must live in its own +title file
// because it's a function of pageContext.data (not serializable in +config).
export default function title(pageContext: PageContext): string {
  const article = pageContext.data as { title?: string } | null;
  if (article?.title) return `Zau Julio | ${article.title}`;

  return `Zau Julio | ${getT(pageContext.locale ?? "en")(($) => $.articles.notFound)}`;
}
