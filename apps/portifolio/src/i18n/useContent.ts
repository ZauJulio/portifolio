import { localeFromPath, useLocale, type Locale } from "@/i18n";

/** Derive the app locale from an incoming request URL. */
export function getLangFromRequest(request: Request): Locale {
  return localeFromPath(new URL(request.url).pathname);
}

export function useContent() {
  const { locale } = useLocale();

  return {
    lang: locale,
    isEnglish: locale === "en",
    isPortuguese: locale === "pt",
  };
}
