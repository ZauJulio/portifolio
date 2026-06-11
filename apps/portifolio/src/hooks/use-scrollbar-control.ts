import { useCallback, useEffect, useState } from "react";
import type {
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  RefObject,
} from "react";

/** Keyboard arrow step, as a fraction of the scrollable height. */
const KEY_STEP = 0.05;

/** Pixels the document can scroll (full height minus the viewport). */
function scrollableHeight(): number {
  return document.documentElement.scrollHeight - window.innerHeight;
}

export interface ScrollbarControl {
  isDragging: boolean;
  handleMouseDown: (e: ReactMouseEvent) => void;
  handleKeyDown: (e: ReactKeyboardEvent) => void;
}

/**
 * Drives the window scroll from the minimap track acting as a scrollbar:
 * click/drag jumps to the pointer position, arrow keys nudge by `KEY_STEP`.
 */
export function useScrollbarControl(trackRef: RefObject<HTMLElement | null>): ScrollbarControl {
  const [isDragging, setIsDragging] = useState(false);

  const scrollToClientY = useCallback(
    (clientY: number) => {
      const track = trackRef.current;
      if (!track) return;

      const rect = track.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
      window.scrollTo({ top: ratio * scrollableHeight() });
    },
    [trackRef],
  );

  const handleMouseDown = useCallback(
    (e: ReactMouseEvent) => {
      e.preventDefault();
      setIsDragging(true);
      scrollToClientY(e.clientY);
    },
    [scrollToClientY],
  );

  const handleKeyDown = useCallback((e: ReactKeyboardEvent) => {
    const step =
      e.key === "ArrowUp" || e.key === "ArrowLeft"
        ? -KEY_STEP
        : e.key === "ArrowDown" || e.key === "ArrowRight"
          ? KEY_STEP
          : 0;

    if (step === 0) return;

    e.preventDefault();
    const docHeight = scrollableHeight();
    const top = Math.max(0, Math.min(docHeight, window.scrollY + step * docHeight));
    window.scrollTo({ top, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (!isDragging) return undefined;

    const onMove = (e: MouseEvent) => {
      e.preventDefault();
      scrollToClientY(e.clientY);
    };
    const onUp = () => setIsDragging(false);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [isDragging, scrollToClientY]);

  return { isDragging, handleMouseDown, handleKeyDown };
}
