import { useRef } from "react";
import type { RefObject } from "react";

import { useDomMirror } from "@/hooks/use-dom-mirror";
import { useScrollMetrics } from "@/hooks/use-scroll-metrics";
import { useScrollbarControl } from "@/hooks/use-scrollbar-control";

import tailwindConfig from "../../tailwind.config";

const brand500 = tailwindConfig.theme.extend.colors.brand[500];

/** Width of the minimap track in pixels. */
const TRACK_WIDTH = 120;
/** Scale factor for the mirrored content (896px = max-w-4xl). */
const SCALE = TRACK_WIDTH / 896;

export function PageMinimap({ contentRef }: { contentRef: RefObject<HTMLElement | null> }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const mirrorRef = useRef<HTMLDivElement>(null);

  const { scrollProgress, viewportRatio, trackHeight, measure } = useScrollMetrics(trackRef);
  const { ready: contentReady, height: contentHeight } = useDomMirror(
    contentRef,
    mirrorRef,
    measure,
  );
  const { isDragging, handleMouseDown, handleKeyDown } = useScrollbarControl(trackRef);

  // Mirror scroll offset: shift the scaled mirror up as the page scrolls.
  const scaledHeight = contentHeight * SCALE;
  const mirrorOffset = -Math.max(0, scaledHeight - trackHeight) * scrollProgress;

  // Viewport slider position + size, as percentages of the track.
  const sliderHeightPercent = Math.max(viewportRatio * 100, 2);
  const sliderTopPercent = scrollProgress * (100 - sliderHeightPercent);

  return (
    <nav
      // Anchored below the header/cover (top-28) and only as tall as the scaled
      // article (capped to the viewport) — short articles leave no empty track.
      style={{ height: contentHeight > 0 ? `${scaledHeight}px` : undefined }}
      className={`fixed right-4 top-28 max-h-[calc(100vh-9rem)] z-40 hidden xl:block transition-opacity duration-300 ${contentReady ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      aria-label="Article minimap"
    >
      <div
        ref={trackRef}
        // overflow-anchor:none stops the browser anchoring scroll inside the
        // mirror as its contents re-render.
        className="relative h-full rounded-2xl select-none overflow-hidden bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50 [overflow-anchor:none]"
        style={{ width: `${TRACK_WIDTH}px`, cursor: isDragging ? "grabbing" : "pointer" }}
        onMouseDown={handleMouseDown}
        onKeyDown={handleKeyDown}
        role="scrollbar"
        aria-controls="main"
        aria-orientation="vertical"
        aria-valuenow={Math.round(scrollProgress * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        tabIndex={0}
      >
        <MinimapMirror
          mirrorRef={mirrorRef}
          mirrorOffset={mirrorOffset}
          scaledHeight={scaledHeight}
          hasContent={contentHeight > 0}
          contentWidth={contentRef.current?.scrollWidth || 896}
        />
        <ViewportSlider
          topPercent={sliderTopPercent}
          heightPercent={sliderHeightPercent}
          isDragging={isDragging}
        />
      </div>
    </nav>
  );
}

/** Scaled, non-interactive mirror of the article. */
function MinimapMirror({
  mirrorRef,
  mirrorOffset,
  scaledHeight,
  hasContent,
  contentWidth,
}: {
  mirrorRef: RefObject<HTMLDivElement | null>;
  mirrorOffset: number;
  scaledHeight: number;
  hasContent: boolean;
  contentWidth: number;
}) {
  return (
    <div
      className="absolute left-0 pointer-events-none [overflow-anchor:none]"
      style={{
        top: `${mirrorOffset}px`,
        width: `${(hasContent ? 1 / SCALE : 1) * TRACK_WIDTH}px`,
        height: `${scaledHeight}px`,
        transform: `scale(${SCALE})`,
        transformOrigin: "top left",
        opacity: 0.55,
        filter: "saturate(0.5)",
      }}
    >
      <div ref={mirrorRef} style={{ width: `${contentWidth}px`, pointerEvents: "none" }} />
    </div>
  );
}

/** Translucent band showing the current viewport within the article. */
function ViewportSlider({
  topPercent,
  heightPercent,
  isDragging,
}: {
  topPercent: number;
  heightPercent: number;
  isDragging: boolean;
}) {
  return (
    <div
      className="absolute left-0 right-0 rounded-sm transition-[top] pointer-events-none"
      style={{
        top: `${topPercent}%`,
        height: `${heightPercent}%`,
        background: isDragging ? `${brand500}2e` : `${brand500}1a`,
        borderLeft: `2px solid ${brand500}99`,
        borderRight: `1px solid ${brand500}26`,
        boxShadow: `0 0 8px ${brand500}14`,
        transitionDuration: isDragging ? "0ms" : "60ms",
      }}
    />
  );
}
