import { getT } from "@/i18n";

import type { PageContext } from "vike/types";

export default function title(pageContext: PageContext): string {
  const playlist = pageContext.data as { title?: string } | null;
  if (playlist?.title) return `Zau Julio | ${playlist.title}`;

  return `Zau Julio | ${getT(pageContext.locale ?? "en")(($) => $.music.title)}`;
}
