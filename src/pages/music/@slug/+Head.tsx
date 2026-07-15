import { usePageContext } from "vike-react/usePageContext";

import { I18N, type Locale } from "@/i18n";
import { absoluteAsset, COVER_FALLBACK, SITE_URL } from "@/lib/seo";

import type { Data } from "./+data";

// Per-playlist Open Graph / Twitter tags + MusicPlaylist structured data, so
// sharing a playlist link surfaces its cover art (a YouTube thumbnail) instead
// of the site-wide avatar fallback from the root +Head.
export default function Head() {
  const pageContext = usePageContext();
  const playlist = pageContext.data as Data;

  if (!playlist) return null;

  const locale = (pageContext.locale ?? I18N.defaultLocale) as Locale;
  const image = absoluteAsset(playlist.cover, COVER_FALLBACK.music);

  return (
    <>
      {/* og:url + canonical + hreflang are emitted (locale-aware) by the root +Head. */}
      <meta property="og:type" content="music.playlist" />
      <meta property="og:title" content={`Zau Julio | ${playlist.title}`} />
      {playlist.description && <meta property="og:description" content={playlist.description} />}
      <meta property="og:site_name" content="Zau Julio" />
      <meta property="og:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`Zau Julio | ${playlist.title}`} />
      {playlist.description && <meta name="twitter:description" content={playlist.description} />}
      <meta name="twitter:creator" content="@zaujulio" />
      <meta name="twitter:image" content={image} />
      <script
        type="application/ld+json"
        // biome-ignore lint: structured data
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MusicPlaylist",
            name: playlist.title,
            ...(playlist.description && { description: playlist.description }),
            ...(playlist.genre && { genre: playlist.genre }),
            ...(playlist.trackCount && { numTracks: playlist.trackCount }),
            image,
            author: { "@type": "Person", name: "Zau Julio", url: SITE_URL },
            inLanguage: I18N.locales[locale].canonical,
          }),
        }}
      />
    </>
  );
}
