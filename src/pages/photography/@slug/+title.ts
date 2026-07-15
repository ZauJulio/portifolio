import { getT } from "@/i18n";

import type { Data } from "./+data";
import type { PageContext } from "vike/types";

export default function title(pageContext: PageContext): string {
  const data = pageContext.data as Data | null;
  if (data?.name) return `Zau Julio | ${data.name} | Photography`;

  return `Zau Julio | ${getT(pageContext.locale ?? "en")(($) => $.photography.title)}`;
}
