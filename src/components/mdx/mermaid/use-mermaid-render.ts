import { useEffect, useId, useState } from "react";

let mermaidInitialized = false;

export function useMermaidRender(code: string) {
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const renderId = `mermaid-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    let cancelled = false;

    import("mermaid")
      .then(({ default: mermaid }) => {
        if (!mermaidInitialized) {
          mermaid.initialize({ startOnLoad: false, theme: "dark" });
          mermaidInitialized = true;
        }

        return mermaid.render(renderId, code);
      })
      .then(({ svg: rendered }) => {
        if (!cancelled) setSvg(rendered);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "mermaid render error");
      });

    return () => {
      cancelled = true;
    };
  }, [code, renderId]);

  return { svg, error };
}
