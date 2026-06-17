// Default <head> tags rendered into every page's HTML (https://vike.dev/Head).
// `title` + `description` come from +config; this adds the SEO/OG/Twitter tags,
// the favicon, the JSON-LD structured data, and the per-page SEO URLs:
// canonical, og:url and the hreflang alternates (en / pt-BR / x-default).

import { usePageContext } from "vike-react/usePageContext";

import { I18N, stripLocale, type Locale } from "@/i18n";

// Origin without a trailing slash. Driven by `VITE_SITE_URL`; falls back to the
// production origin so prerendered canonical/hreflang URLs stay absolute even
// when the env var is unset at build time (relative hreflang hurts SEO).
const SITE_URL = (import.meta.env.VITE_SITE_URL || "https://zaujulio.com.br").replace(/\/$/, "");
const SITE_TITLE = "Zau Julio | Software Engineer";
const SITE_DESCRIPTION =
  "Software Engineer specializing in full-stack development, machine learning, and creative side projects. Explore my work, articles, and hobbies.";

const LOCALES = Object.keys(I18N.locales) as Locale[];

/** Absolute URL for `path` (locale-free logical path) in `locale`. */
function absoluteUrl(locale: Locale, path: string): string {
  const prefix = I18N.locales[locale].routePrefix;
  const localized = path === "/" ? prefix || "/" : `${prefix}${path}`;
  return `${SITE_URL}${localized}`;
}

export default function HeadDefault() {
  const pageContext = usePageContext();
  const locale = (pageContext.locale ?? I18N.defaultLocale) as Locale;

  // A 404 — including any draft slug, which resolves here via `render(404)` —
  // must not advertise itself as an indexable, canonical URL. Mark it `noindex`
  // and drop the self-referential canonical + hreflang alternates so an
  // unpublished URL carries no positive indexing signal (belt-and-suspenders
  // on top of the 404 status itself).
  const isNotFound = pageContext.is404 === true;

  // Locale-free logical pathname (no query) — the base for every alternate URL.
  const logicalPath = stripLocale(pageContext.urlPathname);
  const canonical = absoluteUrl(locale, logicalPath);

  return (
    <>
      <meta name="author" content="Zau Julio" />
      <meta name="robots" content={isNotFound ? "noindex, follow" : "index, follow"} />
      <meta name="theme-color" content="#000000" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={SITE_TITLE} />
      <meta property="og:description" content={SITE_DESCRIPTION} />
      <meta property="og:site_name" content="Zau Julio" />
      <meta property="og:locale" content={locale === "pt" ? "pt_BR" : "en_US"} />
      <meta property="og:image" content="https://zaujulio.com.br/avatar.png" />
      <meta property="og:image:width" content="400" />
      <meta property="og:image:height" content="400" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={SITE_TITLE} />
      <meta name="twitter:description" content={SITE_DESCRIPTION} />
      <meta name="twitter:creator" content="@zaujulio" />
      <meta name="google-site-verification" content="5C13FbkQmK0v7ZlaO_Q0UBHyFpFAGR_3V4Stn_7yVF0" />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

      {/* Per-page canonical + hreflang alternates (region tags via I18N.canonical).
          Skipped on 404s so an unpublished/missing URL never claims a canonical. */}
      {!isNotFound && (
        <>
          <link rel="canonical" href={canonical} />
          {LOCALES.map((l) => (
            <link
              key={l}
              rel="alternate"
              hrefLang={I18N.locales[l].canonical}
              href={absoluteUrl(l, logicalPath)}
            />
          ))}
          <link
            rel="alternate"
            hrefLang="x-default"
            href={absoluteUrl(I18N.defaultLocale, logicalPath)}
          />
        </>
      )}

      <script
        type="application/ld+json"
        // biome-ignore lint: structured data
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Zau Julio",
            url: SITE_URL,
            jobTitle: "Software Engineer",
            email: "zaujulio.dev@gmail.com",
            sameAs: ["https://github.com/ZauJulio", "https://linkedin.com/in/zaujulio"],
            knowsAbout: [
              "Software Engineering",
              "Full-Stack Development",
              "Machine Learning",
              "TypeScript",
              "Python",
              "C#",
              ".NET",
              "React",
            ],
          }),
        }}
      />
    </>
  );
}
