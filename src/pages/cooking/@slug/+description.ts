import type { RecipeMeta } from "@indago/hyper-down";
import type { PageContext } from "vike/types";

export default function description(pageContext: PageContext<RecipeMeta>): string {
  return pageContext.data?.description ?? "";
}
