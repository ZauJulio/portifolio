// Per-page Open Graph / Twitter tags for the Links page (ported from the
// React Router `meta` export).
export default function Head() {
  return (
    <>
      {/* og:url + canonical + hreflang are emitted (locale-aware) by the root +Head. */}
      <meta property="og:title" content="@ZauJulio — Links" />
      <meta property="og:description" content="Software Developer — All my links in one place." />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="https://zaujulio.vercel.app/logo.png" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="@ZauJulio — Links" />
      <meta name="twitter:description" content="Software Developer — All my links in one place." />
      <meta name="twitter:image" content="https://zaujulio.vercel.app/logo.png" />
    </>
  );
}
