import { getT } from "@/i18n";

import type { PageContext } from "vike/types";

export default function title(pageContext: PageContext): string {
  const game = pageContext.data as { title?: string } | null;
  if (game?.title) return `Zau Julio | ${game.title}`;

  return `Zau Julio | ${getT(pageContext.locale ?? "en")(($) => $.games.title)}`;
}
