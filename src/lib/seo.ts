import { I18N, type Locale } from "@/i18n";

// Origin without a trailing slash. Driven by `VITE_SITE_URL`; falls back to the
// production origin so prerendered canonical/OG/JSON-LD URLs stay absolute even
// when the env var is unset at build time. Single source of truth for the
// production domain — keep it off the legacy `zaujulio.com.br` host, which
// 308-redirects here (a canonical pointing at a redirect blocks indexing).
export const SITE_URL = (import.meta.env.VITE_SITE_URL || "https://zaujulio.com").replace(
  /\/$/,
  "",
);

/** Absolute URL for `logicalPath` (locale-free, no query) in `locale`. */
export function absoluteUrl(locale: Locale, logicalPath: string): string {
  const prefix = I18N.locales[locale].routePrefix;
  const localized = logicalPath === "/" ? prefix || "/" : `${prefix}${logicalPath}`;
  return `${SITE_URL}${localized}`;
}

/**
 * Convert a human duration (`"1h 20min"`, `"40 min"`, `"2 h"`) to an ISO-8601
 * duration (`"PT1H20M"`) for schema.org Recipe `prepTime`/`cookTime`. Returns
 * `undefined` when nothing parses, so callers can omit the field entirely.
 */
export function toISODuration(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const hours = /(\d+)\s*h/i.exec(value)?.[1];
  const minutes = /(\d+)\s*m(?:in)?/i.exec(value)?.[1];
  if (!hours && !minutes) return undefined;
  return `PT${hours ? `${hours}H` : ""}${minutes ? `${minutes}M` : ""}`;
}
