import { getT } from "@/i18n";

import type { PageContext } from "vike/types";

export default function title(pageContext: PageContext): string {
  const book = pageContext.data as { title?: string } | null;
  if (book?.title) return `Zau Julio | ${book.title}`;

  return `Zau Julio | ${getT(pageContext.locale ?? "en")(($) => $.books.title)}`;
}
