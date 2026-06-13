import { initReactI18next } from "react-i18next";

import i18next, { type i18n as I18nInstance, type TFunction } from "i18next";
import { usePageContext } from "vike-react/usePageContext";

import en from "./i18n/locales/en.json";
import pt from "./i18n/locales/pt.json";

/**
 * Per-locale config — the single source of truth for everything locale-shaped.
 * `canonical` is the BCP-47 tag external standards use;
 * `display` is the `Intl` tag (region on both sides, e.g. `en-US`);
 * `routePrefix` is the URL prefix (the default locale is served prefix-free).
 *  Adding a locale = one entry here.
 */
export const I18N = {
  defaultLocale: "en",
  locales: {
    en: { canonical: "en", display: "en-US", routePrefix: "" },
    pt: { canonical: "pt-BR", display: "pt-BR", routePrefix: "/pt" },
  },
} as const;

/** App-facing locales — the macro language code (no region). **/
export type Locale = keyof typeof I18N.locales;

const localeKeys = Object.keys(I18N.locales) as Locale[];

/** Derive the active locale from a request/URL pathname. */
export function localeFromPath(pathname: string): Locale {
  for (const locale of localeKeys) {
    const { routePrefix } = I18N.locales[locale];
    if (!routePrefix) continue;

    const eqPath = pathname === routePrefix;
    const startsWithPath = pathname.startsWith(`${routePrefix}/`);
    if (eqPath || startsWithPath) return locale;
  }
  return I18N.defaultLocale;
}

/** Strip the locale prefix to the logical (locale-free) path. */
export function stripLocale(pathname: string): string {
  const { routePrefix } = I18N.locales[localeFromPath(pathname)];
  if (!routePrefix) return pathname;

  return pathname.slice(routePrefix.length) || "/";
}

/** Prepend the locale prefix to a logical path (default locale stays prefix-free). */
export function withLocale(locale: Locale, path: string): string {
  const { routePrefix } = I18N.locales[locale];
  if (!routePrefix) return path;

  return path === "/" ? routePrefix : `${routePrefix}${path}`;
}

const resources = { en: { translation: en }, pt: { translation: pt } } as const;

// One i18next instance per locale, language fixed at init — SSR-safe by
// construction (no shared mutable `language`, so concurrent renders can't
// interleave). Resources inlined + Suspense off, so `t` is synchronous at render.
function createInstance(lng: Locale): I18nInstance {
  const instance = i18next.createInstance();

  void instance.use(initReactI18next).init({
    lng,
    fallbackLng: I18N.defaultLocale,
    resources,
    interpolation: { escapeValue: false }, // React already escapes — avoid double-escaping.
    returnNull: false,
    showSupportNotice: false, // silence i18next v25 Locize promo console.info
    react: { useSuspense: false },
  });

  return instance;
}

/** One ready-to-use i18next instance per locale (language fixed at init). */
export const i18nByLocale: Record<Locale, I18nInstance> = {
  en: createInstance("en"),
  pt: createInstance("pt"),
};

/** Non-hook translator for `locale`, for Vike server hooks (+title) SSR **/
export const getT = (locale: Locale): TFunction => i18nByLocale[locale].t;

/**
 * Request-scoped locale metadata from Vike's pageContext (set by +onBeforeRoute,
 * exposed via `passToClient`). The translator itself comes from `useTranslation()`
 * (react-i18next), scoped by the `<I18nextProvider>` in +Layout.
 */
export function useLocale(): {
  locale: Locale;
  canonical: string;
  displayLocale: (typeof I18N)["locales"][Locale]["display"];
} {
  const pageContext = usePageContext();
  const locale = (pageContext.locale ?? I18N.defaultLocale) as Locale;

  return {
    locale,
    canonical: pageContext.canonical ?? I18N.locales[locale].canonical,
    displayLocale: pageContext.displayLocale ?? I18N.locales[locale].display,
  };
}
