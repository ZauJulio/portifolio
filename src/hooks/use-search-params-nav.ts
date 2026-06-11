import { useCallback } from "react";

import { usePageContext } from "vike-react/usePageContext";
import { navigate } from "vike/client/router";

/** A patch over the URL query; a `null`/`undefined`/`""` value removes the key. */
export type SearchParamsPatch = Record<string, string | null | undefined>;

/** Applies `patch` to `current` and serializes to a `?…` string (nullish/empty keys dropped). */
function buildQuery(current: Record<string, string>, patch: SearchParamsPatch): string {
  const merged: Record<string, string> = { ...current };

  for (const [key, value] of Object.entries(patch)) {
    if (value) merged[key] = value;
    else delete merged[key];
  }

  const qs = Object.entries(merged)
    .filter(([, value]) => value !== "")
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join("&");

  return qs ? `?${qs}` : "";
}

/**
 * URL-query helpers backed by Vike's `pageContext.urlParsed.search`
 * (https://vike.dev/pageContext#urlParsed) — no `URLSearchParams` needed.
 *
 * Mutating the query triggers a server-side `+data` re-run (live SSR search
 * under the Hono server; the static prerender renders the default listing).
 */
export function useSearchParamsNav() {
  const pageContext = usePageContext();
  const params = pageContext.urlParsed.search;

  /** Navigates to the current page with the query patched. */
  const setParams = useCallback(
    (patch: SearchParamsPatch, opts?: { replace?: boolean }) => {
      // `urlPathnameLocalized` keeps the locale prefix (set by `+onBeforeRoute`);
      // the stripped `urlPathname` would bounce visitors to the default-locale site.
      const href = `${pageContext.urlPathnameLocalized}${buildQuery(params, patch)}`;

      void navigate(href, {
        overwriteLastHistoryEntry: opts?.replace,
        keepScrollPosition: true,
      });
    },
    [pageContext.urlPathnameLocalized, params],
  );

  /** Builds an href for `pathname` with the current query patched (for `<Link>`). */
  const buildHref = useCallback(
    (pathname: string, patch: SearchParamsPatch) => `${pathname}${buildQuery(params, patch)}`,
    [params],
  );

  return { params, setParams, buildHref };
}
