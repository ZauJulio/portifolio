import { useEffect } from "react";

// ─── Umami Analytics ─────────────────────────────────────────
// Privacy-focused, cookie-less analytics. Loaded client-side, in production
// only, and tolerant of failure: if the script is blocked (ad-block / CSP /
// network) the error is swallowed so it never breaks render or pollutes the
// console. It is intentionally NOT pre-rendered into the static HTML.
const UMAMI_SRC = "https://cloud.umami.is/script.js";
const UMAMI_WEBSITE_ID = "70a4d918-b144-4d4f-96b3-abfa2248242e";

export function Analytics() {
  useEffect(() => {
    // Skip during local development to keep the console clean.
    if (!import.meta.env.PROD) return undefined;
    // Avoid injecting twice on client-side navigation's / fast refresh.
    if (document.querySelector(`script[data-website-id="${UMAMI_WEBSITE_ID}"]`)) {
      return undefined;
    }

    const script = document.createElement("script");
    script.defer = true;
    script.src = UMAMI_SRC;
    script.dataset.websiteId = UMAMI_WEBSITE_ID;
    // Analytics must never be fatal: drop the node if it fails to load.
    script.addEventListener("error", () => script.remove());
    document.head.appendChild(script);

    return () => script.remove();
  }, []);

  return null;
}
