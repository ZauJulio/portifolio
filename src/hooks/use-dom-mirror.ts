import { useEffect, useState } from "react";
import type { RefObject } from "react";

/** Debounce window (ms) for re-cloning the source into the mirror. */
const CLONE_DEBOUNCE_MS = 200;

/** Renders a static, non-interactive clone of `source` inside `mirror`. */
function cloneInto(source: HTMLElement, mirror: HTMLElement): void {
  const clone = source.cloneNode(true) as HTMLElement;

  for (const el of Array.from(clone.querySelectorAll("iframe, video, .mirror-exclude"))) {
    el.remove();
  }

  // Strip every id: the clone duplicates the source's anchors, and a mirror
  // rendered earlier in the DOM would hijack `getElementById`/hash navigation.
  clone.removeAttribute("id");
  for (const el of Array.from(clone.querySelectorAll("[id]"))) el.removeAttribute("id");

  clone.style.pointerEvents = "none";
  clone.style.userSelect = "none";
  clone.style.width = `${source.scrollWidth}px`;
  clone.style.padding = "0";
  clone.style.margin = "0";

  mirror.replaceChildren(clone);
}

export interface DomMirror {
  /** True once the first clone has been rendered. */
  ready: boolean;
  /** Current scroll height of the source element, in pixels. */
  height: number;
}

/**
 * Mirrors `sourceRef`'s subtree into `mirrorRef`, re-cloning on resize/mutation
 * (debounced) and tracking its height. Add `.mirror-exclude` to skip a node.
 *
 * @param onResize - fires after each measured size change.
 * @returns `ready` (first clone rendered) and `height` (source scrollHeight, px).
 */
export function useDomMirror<S extends HTMLElement, M extends HTMLElement>(
  sourceRef: RefObject<S | null>,
  mirrorRef: RefObject<M | null>,
  onResize?: () => void,
): DomMirror {
  const [ready, setReady] = useState(false);
  const [height, setHeight] = useState(1);

  useEffect(() => {
    const source = sourceRef.current;
    if (!source) return undefined;

    const observer = new ResizeObserver(() => {
      setHeight(source.scrollHeight);
      onResize?.();
    });
    observer.observe(source);
    setHeight(source.scrollHeight);

    return () => observer.disconnect();
  }, [sourceRef, onResize]);

  useEffect(() => {
    const source = sourceRef.current;
    if (!source) return undefined;

    let timer: ReturnType<typeof setTimeout> | undefined;
    const scheduleClone = () => {
      if (timer) clearTimeout(timer);

      timer = setTimeout(() => {
        if (!mirrorRef.current) return;

        cloneInto(source, mirrorRef.current);
        setReady(true);
        setHeight(source.scrollHeight);
      }, CLONE_DEBOUNCE_MS);
    };

    const observer = new MutationObserver(scheduleClone);
    observer.observe(source, { childList: true, subtree: true, attributes: false });
    scheduleClone();

    return () => {
      observer.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, [sourceRef, mirrorRef]);

  return { ready, height };
}
