import { usePageContext } from "vike-react/usePageContext";

import { I18N, type Locale, stripLocale } from "@/i18n";
import { absoluteAsset, absoluteUrl, SITE_URL } from "@/lib/seo";

import type { Data } from "./+data";

const SCHEMA_TYPE: Record<string, string> = {
  game: "VideoGame",
  book: "Book",
  music: "MusicRecording",
};

// Per-review Open Graph / Twitter tags + Review structured data. Mirrors
// `articles/@slug/+Head.tsx`; `itemReviewed` is only emitted when a HyperJson
// subject was resolved (movie/other reviews are MDX-only, no subject card).
export default function Head() {
  const pageContext = usePageContext();
  const review = pageContext.data as Data;

  if (!review) return null;

  const locale = (pageContext.locale ?? I18N.defaultLocale) as Locale;
  const pageUrl = absoluteUrl(locale, stripLocale(pageContext.urlPathname));
  const image = absoluteAsset(review.cover);

  const itemReviewed =
    review.subject && review.type
      ? {
          "@type": SCHEMA_TYPE[review.type] ?? "Thing",
          name: review.subject.item.title,
          ...(review.subject.item.cover && { image: review.subject.item.cover }),
        }
      : undefined;

  return (
    <>
      {/* og:url + canonical + hreflang are emitted (locale-aware) by the root +Head. */}
      <meta name="author" content="Zau Julio" />
      <meta property="og:type" content="article" />
      <meta property="og:title" content={review.title} />
      <meta property="og:description" content={review.description} />
      <meta property="og:site_name" content="Zau Julio" />
      <meta property="og:image" content={image} />
      <meta property="article:author" content="Zau Julio" />
      {review.date && <meta property="article:published_time" content={review.date} />}
      {review.tags?.map((tag) => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={review.title} />
      <meta name="twitter:description" content={review.description} />
      <meta name="twitter:creator" content="@zaujulio" />
      <meta name="twitter:image" content={image} />
      <script
        type="application/ld+json"
        // biome-ignore lint: structured data
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Review",
            name: review.title,
            reviewBody: review.description,
            ...(review.date && { datePublished: review.date, dateModified: review.date }),
            author: { "@type": "Person", name: "Zau Julio", url: SITE_URL },
            publisher: { "@type": "Person", name: "Zau Julio", url: SITE_URL },
            ...(review.cover && { image: review.cover }),
            ...(review.tags?.length && { keywords: review.tags.join(", ") }),
            ...(itemReviewed && { itemReviewed }),
            inLanguage: I18N.locales[locale].canonical,
            mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
          }),
        }}
      />
    </>
  );
}
