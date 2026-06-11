import { I18N, localeFromPath, stripLocale } from "@/i18n";

import type { PageContext } from "vike/types";

/**
 * i18n routing via locale-stripping (https://vike.dev/i18n): strip the `/pt` prefix,
 * expose the detected `locale`, and route against the prefix-free `urlLogical` so one
 * page tree serves both languages. Locale tags are derived once here and passed via
 * pageContext: `canonical` (BCP-47/DB/`hreflang`) and `displayLocale` (`Intl` tag).
 */
export function onBeforeRoute(pageContext: PageContext) {
  const { urlPathname } = pageContext;

  // `urlLogical` must keep the query: Vike re-parses `urlParsed` from it, so a
  // pathname-only value drops `?q=`/`?cuisine=`/… and breaks URL-driven loaders.
  // The hash is omitted — it never reaches the server; the browser keeps it.
  const { searchOriginal } = pageContext.urlParsed;

  const locale = localeFromPath(urlPathname);

  return {
    pageContext: {
      locale,
      canonical: I18N.locales[locale].canonical,
      displayLocale: I18N.locales[locale].display,
      // The real, locale-prefixed path (e.g. `/pt/cooking`), passed to the client
      // so navigation can rebuild URLs without dropping the `/pt` prefix.
      urlPathnameLocalized: urlPathname,
      urlLogical: `${stripLocale(urlPathname)}${searchOriginal ?? ""}`,
    },
  };
}
