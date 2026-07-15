import type { Data } from "./+data";
import type { PageContext } from "vike/types";

export default function title(pageContext: PageContext): string {
  const data = pageContext.data as Data | null;
  if (data?.photo?.title) return `Zau Julio | ${data.photo.title} | ${data.album.name}`;

  return "Zau Julio | Photography";
}
