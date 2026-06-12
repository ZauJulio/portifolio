import { contentModules } from "@hyper-down/default";
import { createContentResolver } from "@muttum/hyper-down";

// Server-side: run in `+data.ts` using `recipeRepository`

/** @returns A promise that resolves to the recipe's content, which is a React component.
 * The content is loaded lazily, so this function can be used in a React component's `useEffect`
 * or similar hook to fetch the recipe content when needed. */
export const getRecipeContent = createContentResolver(contentModules["recipe"]);
