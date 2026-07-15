import { usePageContext } from "vike-react/usePageContext";

import { I18N, type Locale } from "@/i18n";
import { absoluteAsset, COVER_FALLBACK, SITE_URL } from "@/lib/seo";

// Category cover fallback per schema.org subject type.
const FALLBACK: Record<"Book" | "Movie" | "VideoGame", string> = {
  Book: COVER_FALLBACK.book,
  Movie: COVER_FALLBACK.movie,
  VideoGame: COVER_FALLBACK.game,
};

// Shared per-page <head> for the book / movie / game `@slug` detail pages, so
// sharing a subject link surfaces its cover art (and a rating snippet) instead
// of the site-wide avatar fallback from the root +Head. The schema.org type
// differs per subject (`Book` / `Movie` / `VideoGame`); everything else — cover,
// rating, tags — is common, so each route just picks its type.
type Subject = {
  title: string;
  cover?: string;
  description?: string;
  genre?: string;
  rating?: number;
};

export function SubjectHead({ schemaType }: { schemaType: "Book" | "Movie" | "VideoGame" }) {
  const pageContext = usePageContext();
  const subject = pageContext.data as Subject | null;

  if (!subject) return null;

  const locale = (pageContext.locale ?? I18N.defaultLocale) as Locale;
  const image = absoluteAsset(subject.cover, FALLBACK[schemaType]);

  return (
    <>
      {/* og:url + canonical + hreflang are emitted (locale-aware) by the root +Head. */}
      <meta property="og:type" content="article" />
      <meta property="og:title" content={`Zau Julio | ${subject.title}`} />
      {subject.description && <meta property="og:description" content={subject.description} />}
      <meta property="og:site_name" content="Zau Julio" />
      <meta property="og:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`Zau Julio | ${subject.title}`} />
      {subject.description && <meta name="twitter:description" content={subject.description} />}
      <meta name="twitter:creator" content="@zaujulio" />
      <meta name="twitter:image" content={image} />
      <script
        type="application/ld+json"
        // biome-ignore lint: structured data
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": schemaType,
            name: subject.title,
            ...(subject.description && { description: subject.description }),
            ...(subject.genre && { genre: subject.genre }),
            image,
            ...(typeof subject.rating === "number" && {
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: subject.rating,
                bestRating: 5,
                ratingCount: 1,
              },
            }),
            author: { "@type": "Person", name: "Zau Julio", url: SITE_URL },
            inLanguage: I18N.locales[locale].canonical,
          }),
        }}
      />
    </>
  );
}
