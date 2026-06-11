import { contentModules } from "@hyper-down/default";
import { createContentResolver, type ArticleMeta } from "@virtus/hyper-down";

export type { ArticleMeta };

// Server-side run in `+data.ts` using `articleRepository`

/** @returns A promise that resolves to the article's content, which is a React component.
 * The content is loaded lazily, so this function can be used in a React component's `useEffect`
 * or similar hook to fetch the article content when needed. */
export const getArticleContent = createContentResolver(contentModules["article"]);
