import { useEffect } from "react";

/** Smoothly scrolls the element matching `id` into view; returns whether it existed. */
function scrollToId(id: string): boolean {
  if (!id) return false;

  const el = document.getElementById(id);
  if (!el) return false;

  el.scrollIntoView({ behavior: "smooth", block: "start" });
  return true;
}

/**
 * Scrolls to the current `window.location.hash`, retrying until the target
 * mounts and re-pinning while late-loading content settles.
 *
 * The MDX body is lazy and contains content that resizes *after* it mounts —
 * most notably mermaid diagrams, which show a tiny "Rendering diagram…"
 * placeholder and only swap in the (much taller) SVG once `import("mermaid")`
 * resolves. When such content sits above the anchor, that growth pushes the
 * heading down and drifts the scroll. So rather than disconnecting after the
 * first hit, we keep re-pinning (instantly) on DOM mutations until the user
 * scrolls or a timeout elapses.
 */
function scrollToCurrentHash(): () => void {
  const initialId = decodeURIComponent(window.location.hash.slice(1));
  if (!initialId) return () => {};

  // Genuine user input cancels re-pinning so we never fight a manual scroll.
  // Programmatic scrolling fires none of these, so the smooth scroll is safe.
  let cancelled = false;
  const stop = () => {
    cancelled = true;
  };

  // First scroll is smooth; later re-pins are instant (no animation to fight).
  scrollToId(initialId);

  const repin = () => {
    if (cancelled) return;
    document.getElementById(initialId)?.scrollIntoView({ block: "start" });
  };

  const observer = new MutationObserver(repin);
  observer.observe(document.body, { childList: true, subtree: true });

  const timer = setTimeout(() => observer.disconnect(), 5000);

  const opts = { passive: true } as const;
  window.addEventListener("wheel", stop, opts);
  window.addEventListener("touchmove", stop, opts);
  window.addEventListener("keydown", stop);

  return () => {
    clearTimeout(timer);
    observer.disconnect();
    window.removeEventListener("wheel", stop);
    window.removeEventListener("touchmove", stop);
    window.removeEventListener("keydown", stop);
  };
}

/** Capture-phase handler for in-page `#anchor` clicks. */
function onAnchorClick(e: MouseEvent): void {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return;

  const href = (e.target as HTMLElement | null)?.closest("a")?.getAttribute("href");
  if (!href?.startsWith("#")) return;

  if (!scrollToId(decodeURIComponent(href.slice(1)))) return;

  e.preventDefault();
  history.pushState(null, "", href);
}

/**
 * Hash-scroll for Vike SPA pages, which don't fire the browser's native
 * hash-scroll. Handles two cases:
 *  - Initial arrival (direct URL / F5 / SPA navigation) — scroll to the hash.
 *  - In-page TOC clicks — Vike's router intercepts `<a href>` and updates history
 *    via `pushState` (no `hashchange`/scroll), so a capture-phase listener runs
 *    before Vike's, scrolls, and syncs the URL itself.
 */
export function useHashScroll(): void {
  useEffect(() => {
    const cancelInitial = scrollToCurrentHash();

    document.addEventListener("click", onAnchorClick, true);
    return () => {
      cancelInitial();
      document.removeEventListener("click", onAnchorClick, true);
    };
  }, []);
}
