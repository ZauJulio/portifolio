import type { Data } from "./+data";
import type { PageContext } from "vike/types";

export default function title(pageContext: PageContext): string {
  const data = pageContext.data as Data | null;
  if (data?.photo?.title) return `${data.photo.title} | ${data.album.name} | Zau Julio`;

  return "Photography | Zau Julio";
}
