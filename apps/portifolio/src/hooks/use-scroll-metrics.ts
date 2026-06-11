import { useCallback, useEffect, useRef, useState } from "react";
import type { RefObject } from "react";

export interface ScrollMetrics {
  /** 0–1 progress through the scrollable document. */
  scrollProgress: number;
  /** Viewport height as a fraction of the full document height (0–1). */
  viewportRatio: number;
  /** Current pixel height of the minimap track. */
  trackHeight: number;
  /** Recomputes the metrics; safe to call on any layout-changing event. */
  measure: () => void;
}

/** Tracks document scroll position + the track's height, rAF-throttled to avoid layout thrash. */
export function useScrollMetrics(trackRef: RefObject<HTMLElement | null>): ScrollMetrics {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [viewportRatio, setViewportRatio] = useState(0.1);
  const [trackHeight, setTrackHeight] = useState(0);
  const rafId = useRef(0);

  const measure = useCallback(() => {
    if (rafId.current) return;

    rafId.current = requestAnimationFrame(() => {
      rafId.current = 0;
      if (trackRef.current) setTrackHeight(trackRef.current.clientHeight);

      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;

      setScrollProgress(window.scrollY / docHeight);
      setViewportRatio(Math.min(window.innerHeight / document.documentElement.scrollHeight, 1));
    });
  }, [trackRef]);

  useEffect(() => {
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    measure();

    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
      if (rafId.current) cancelAnimationFrame(rafId.current);
      rafId.current = 0;
    };
  }, [measure]);

  return { scrollProgress, viewportRatio, trackHeight, measure };
}
