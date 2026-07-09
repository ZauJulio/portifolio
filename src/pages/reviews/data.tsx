import { contentModules } from "@hyper-down/default";
import { createContentResolver, type ReviewMeta } from "@indago/hyper-down";

export type { ReviewMeta };

// Server-side run in `+data.ts` using `reviewRepository`

/** @returns A promise that resolves to the review's content, which is a React component.
 * The content is loaded lazily, so this function can be used in a React component's `useEffect`
 * or similar hook to fetch the review content when needed. */
export const getReviewContent = createContentResolver(contentModules["review"]);
