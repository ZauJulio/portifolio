import { usePageContext } from "vike-react/usePageContext";

import type { Data } from "./+data";

// Per-recipe Open Graph / Twitter tags (ported from the React Router `meta`).
export default function Head() {
  const pageContext = usePageContext();

  const data = pageContext.data as Data;

  if (!data) return null;

  return (
    <>
      {/* og:url + canonical + hreflang are emitted (locale-aware) by the root +Head. */}
      <meta property="og:type" content="article" />
      <meta property="og:title" content={data.title} />
      <meta property="og:description" content={data.description} />
      <meta property="og:site_name" content="Zau Julio" />
      {data.cover && <meta property="og:image" content={data.cover} />}
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      {data.tags?.map((tag) => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={data.title} />
      <meta name="twitter:description" content={data.description} />
      <meta name="twitter:creator" content="@zaujulio" />
      {data.cover && <meta name="twitter:image" content={data.cover} />}
    </>
  );
}
