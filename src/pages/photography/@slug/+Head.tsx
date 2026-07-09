import { usePageContext } from "vike-react/usePageContext";

import { I18N, type Locale } from "@/i18n";
import { absoluteAsset, COVER_FALLBACK, SITE_URL } from "@/lib/seo";

import type { Data } from "./+data";

// Per-album Open Graph / Twitter tags + ImageGallery structured data, so sharing
// a photo album link surfaces its cover photo instead of the site-wide avatar
// fallback from the root +Head. Album covers are root-relative (`/photos/…`),
// so `absoluteAsset` prepends the production origin for the crawlers.
export default function Head() {
  const pageContext = usePageContext();
  const album = pageContext.data as Data;

  if (!album) return null;

  const locale = (pageContext.locale ?? I18N.defaultLocale) as Locale;
  const image = absoluteAsset(album.cover, COVER_FALLBACK.photography);

  return (
    <>
      {/* og:url + canonical + hreflang are emitted (locale-aware) by the root +Head. */}
      <meta property="og:type" content="article" />
      <meta property="og:title" content={album.name} />
      {album.description && <meta property="og:description" content={album.description} />}
      <meta property="og:site_name" content="Zau Julio" />
      <meta property="og:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={album.name} />
      {album.description && <meta name="twitter:description" content={album.description} />}
      <meta name="twitter:creator" content="@zaujulio" />
      <meta name="twitter:image" content={image} />
      <script
        type="application/ld+json"
        // biome-ignore lint: structured data
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ImageGallery",
            name: album.name,
            ...(album.description && { description: album.description }),
            image,
            author: { "@type": "Person", name: "Zau Julio", url: SITE_URL },
            inLanguage: I18N.locales[locale].canonical,
          }),
        }}
      />
    </>
  );
}
