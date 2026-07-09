import type { ReviewMeta } from "@indago/hyper-down";
import type { PageContext } from "vike/types";

export default function description(pageContext: PageContext<ReviewMeta>): string {
  return pageContext.data?.description ?? "";
}
