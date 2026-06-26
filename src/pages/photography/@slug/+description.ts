import type { Data } from "./+data";
import type { PageContext } from "vike/types";

export default function description(pageContext: PageContext): string {
  const data = pageContext.data as Data | null;
  return data?.description ?? "";
}
