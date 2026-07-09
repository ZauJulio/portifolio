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

// Sitewide `og:image` fallback — the square brand logo (400×400). The default
// when a page passes no category-specific fallback of its own.
export const OG_FALLBACK_IMAGE = `${SITE_URL}/logo.png`;

// Per-category share/cover fallback icons (the same `/covers/*-fallback.svg`
// the detail pages already render as their `<img>` placeholder), so a coverless
// item shares its category glyph instead of the generic brand logo. Pass one as
// the `fallback` arg of `absoluteAsset`.
export const COVER_FALLBACK = {
  article: "/covers/article-fallback.svg",
  recipe: "/covers/recipe-fallback.svg",
  music: "/covers/music-fallback.svg",
  photography: "/covers/photography-fallback.svg",
  book: "/covers/book-fallback.svg",
  movie: "/covers/movie-fallback.svg",
  game: "/covers/game-fallback.svg",
} as const;

/**
 * Absolutize a cover/asset reference for use as an `og:image` — crawlers
 * (Facebook, WhatsApp, X) require an absolute URL. Root-relative paths
 * (`/covers/foo.jpg`) get the production origin prepended; already-absolute
 * `http(s)` URLs (e.g. YouTube thumbnails) pass through untouched.
 *
 * When the cover is missing, returns `fallback` (itself absolutized) — pass a
 * `COVER_FALLBACK.*` category icon for a share card that reflects the content
 * type, or omit it to get the brand logo. Never returns empty, so a share card
 * is never blank.
 */
export function absoluteAsset(
  cover: string | undefined,
  fallback: string = OG_FALLBACK_IMAGE,
): string {
  const value = cover || fallback;
  if (/^https?:\/\//i.test(value)) return value;
  return `${SITE_URL}${value.startsWith("/") ? "" : "/"}${value}`;
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
