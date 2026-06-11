import type { RecipeMeta } from "@virtus/hyper-down";
import type { PageContext } from "vike/types";

export default function description(pageContext: PageContext<RecipeMeta>): string {
  return pageContext.data?.description ?? "";
}
