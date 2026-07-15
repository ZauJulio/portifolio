import { usePageContext } from "vike-react/usePageContext";

import { I18N, type Locale, stripLocale } from "@/i18n";
import { absoluteAsset, absoluteUrl, COVER_FALLBACK, SITE_URL } from "@/lib/seo";

import type { Data } from "./+data";

// Per-article Open Graph / Twitter tags + BlogPosting structured data.
// The structured data gives each (otherwise low-priority, sitemap-only) detail
// page a strong machine-readable "this is a substantial article" signal, which
// is what nudges Google to index them rather than leaving them "Discovered –
// currently not indexed". (ported from the React Router `meta`).
export default function Head() {
  const pageContext = usePageContext();
  const article = pageContext.data as Data;

  if (!article) return null;

  const locale = (pageContext.locale ?? I18N.defaultLocale) as Locale;
  const pageUrl = absoluteUrl(locale, stripLocale(pageContext.urlPathname));
  const image = absoluteAsset(article.cover, COVER_FALLBACK.article);

  return (
    <>
      {/* og:url + canonical + hreflang are emitted (locale-aware) by the root +Head. */}
      <meta name="author" content={article.author || "Zau Julio"} />
      <meta property="og:type" content="article" />
      <meta property="og:title" content={`Zau Julio | ${article.title}`} />
      <meta property="og:description" content={article.description} />
      <meta property="og:site_name" content="Zau Julio" />
      <meta property="og:image" content={image} />
      <meta property="article:author" content={article.author || "Zau Julio"} />
      {article.date && <meta property="article:published_time" content={article.date} />}
      {article.tags?.map((tag) => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`Zau Julio | ${article.title}`} />
      <meta name="twitter:description" content={article.description} />
      <meta name="twitter:creator" content="@zaujulio" />
      <meta name="twitter:image" content={image} />
      <script
        type="application/ld+json"
        // biome-ignore lint: structured data
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: article.title,
            description: article.description,
            ...(article.date && { datePublished: article.date, dateModified: article.date }),
            author: { "@type": "Person", name: article.author || "Zau Julio", url: SITE_URL },
            publisher: { "@type": "Person", name: "Zau Julio", url: SITE_URL },
            ...(article.cover && { image: article.cover }),
            ...(article.tags?.length && { keywords: article.tags.join(", ") }),
            ...(article.repo && {
              codeRepository: article.repo,
              about: {
                "@type": "SoftwareSourceCode",
                codeRepository: article.repo,
                url: article.repo,
              },
            }),
            inLanguage: I18N.locales[locale].canonical,
            mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
          }),
        }}
      />
    </>
  );
}
