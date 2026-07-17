import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { MermaidPanZoom } from "./mermaid/MermaidPanZoom";
import { useMermaidRender } from "./mermaid/use-mermaid-render";

export function ZoomableMermaid({ code }: { code: string }) {
  const { svg, error } = useMermaidRender(code);
  const [fullscreen, setFullscreen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (error) {
    return (
      <pre className="flex items-center justify-center rounded-xl bg-gray-900/80 p-4 text-sm text-red-300">
        {error}
      </pre>
    );
  }

  if (!svg) {
    return (
      <pre className="flex items-center justify-center rounded-xl bg-gray-900/80 p-4 text-sm text-gray-400">
        Rendering diagram…
      </pre>
    );
  }

  return (
    <>
      <MermaidPanZoom svg={svg} onToggleFullscreen={() => setFullscreen(true)} />
      {fullscreen &&
        mounted &&
        createPortal(
          <div className="fixed inset-0 z-50 flex flex-col bg-black/90 p-2 backdrop-blur-sm sm:p-6">
            <MermaidPanZoom svg={svg} fullscreen onToggleFullscreen={() => setFullscreen(false)} />
          </div>,
          document.body,
        )}
    </>
  );
}
