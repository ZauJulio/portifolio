import { getT } from "@/i18n";

import type { PageContext } from "vike/types";

export default function title(pageContext: PageContext): string {
  const movie = pageContext.data as { title?: string } | null;
  if (movie?.title) return `Zau Julio | ${movie.title}`;

  return `Zau Julio | ${getT(pageContext.locale ?? "en")(($) => $.movies.title)}`;
}
