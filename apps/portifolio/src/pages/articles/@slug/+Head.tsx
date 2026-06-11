import { usePageContext } from "vike-react/usePageContext";

import type { Data } from "./+data";

// Per-article Open Graph / Twitter tags (ported from the React Router `meta`).
export default function Head() {
  const pageContext = usePageContext();
  const article = pageContext.data as Data;

  if (!article) return null;

  return (
    <>
      {/* og:url + canonical + hreflang are emitted (locale-aware) by the root +Head. */}
      <meta name="author" content={article.author || "Zau Julio"} />
      <meta property="og:type" content="article" />
      <meta property="og:title" content={article.title} />
      <meta property="og:description" content={article.description} />
      <meta property="og:site_name" content="Zau Julio" />
      {article.cover && <meta property="og:image" content={article.cover} />}
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="article:author" content={article.author || "Zau Julio"} />
      {article.date && <meta property="article:published_time" content={article.date} />}
      {article.tags?.map((tag) => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={article.title} />
      <meta name="twitter:description" content={article.description} />
      <meta name="twitter:creator" content="@zaujulio" />
      {article.cover && <meta name="twitter:image" content={article.cover} />}
    </>
  );
}
