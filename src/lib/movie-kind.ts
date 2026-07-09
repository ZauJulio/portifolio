import { ClapperboardIcon, SparklesIcon, TvIcon } from "lucide-react";

import type { Movie } from "@indago/hyper-json";

// Icon per movie `kind` — shared by the movies listing card and the detail page
// so anime, series, and films stay visually distinct in both places.
export function movieKindIcon(kind: Movie["kind"]) {
  if (kind === "anime") return SparklesIcon;
  if (kind === "series") return TvIcon;
  return ClapperboardIcon;
}
