import { usePageContext } from "vike-react/usePageContext";

import { I18N } from "@/i18n";
import { absoluteAsset, COVER_FALLBACK, SITE_URL, toISODuration } from "@/lib/seo";

import type { Data } from "./+data";

// Per-recipe Open Graph / Twitter tags + Recipe structured data. The schema.org
// Recipe markup gives each sitemap-only detail page a strong "this is a real
// recipe" signal for indexing (and makes it eligible for recipe rich results
// once a cover image is set). (ported from the React Router `meta`).
export default function Head() {
  const pageContext = usePageContext();
  const data = pageContext.data as Data;

  if (!data) return null;

  const image = absoluteAsset(data.cover, COVER_FALLBACK.recipe);

  return (
    <>
      {/* og:url + canonical + hreflang are emitted (locale-aware) by the root +Head. */}
      <meta property="og:type" content="article" />
      <meta property="og:title" content={`Zau Julio | ${data.title}`} />
      <meta property="og:description" content={data.description} />
      <meta property="og:site_name" content="Zau Julio" />
      <meta property="og:image" content={image} />
      {data.tags?.map((tag) => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`Zau Julio | ${data.title}`} />
      <meta name="twitter:description" content={data.description} />
      <meta name="twitter:creator" content="@zaujulio" />
      <meta name="twitter:image" content={image} />
      <script
        type="application/ld+json"
        // biome-ignore lint: structured data
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Recipe",
            name: data.title,
            description: data.description,
            author: { "@type": "Person", name: "Zau Julio", url: SITE_URL },
            ...(data.date && { datePublished: data.date }),
            ...(data.cover && { image: data.cover }),
            ...(data.cuisine && { recipeCuisine: data.cuisine }),
            ...(data.courseType && { recipeCategory: data.courseType }),
            ...(data.servings && { recipeYield: data.servings }),
            ...(toISODuration(data.prepTime) && { prepTime: toISODuration(data.prepTime) }),
            ...(toISODuration(data.cookTime) && { cookTime: toISODuration(data.cookTime) }),
            ...(data.tags?.length && { keywords: data.tags.join(", ") }),
            inLanguage: I18N.locales[pageContext.locale ?? I18N.defaultLocale].canonical,
          }),
        }}
      />
    </>
  );
}
