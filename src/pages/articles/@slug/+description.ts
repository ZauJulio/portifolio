import type { ArticleMeta } from "@indago/hyper-down";
import type { PageContext } from "vike/types";

export default function description(pageContext: PageContext<ArticleMeta>): string {
  return pageContext.data?.description ?? "";
}
