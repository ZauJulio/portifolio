import { getT } from "@/i18n";

import type { Data } from "./+data";
import type { PageContext } from "vike/types";

export default function title(pageContext: PageContext): string {
  const data = pageContext.data as Data | null;
  if (data?.name) return `${data.name} | Photography | Zau Julio`;

  return `${getT(pageContext.locale ?? "en")(($) => $.photography.title)} | Zau Julio`;
}
