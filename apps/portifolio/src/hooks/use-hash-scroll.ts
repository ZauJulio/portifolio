import { useEffect } from "react";

/** Smoothly scrolls the element matching `id` into view; returns whether it existed. */
function scrollToId(id: string): boolean {
  if (!id) return false;

  const el = document.getElementById(id);
  if (!el) return false;

  el.scrollIntoView({ behavior: "smooth", block: "start" });
  return true;
}

/** Scrolls to the current `window.location.hash`, retrying until the target mounts. */
function scrollToCurrentHash(): () => void {
  const initialId = decodeURIComponent(window.location.hash.slice(1));
  if (!initialId || scrollToId(initialId)) return () => {};

  // The MDX body is lazy, so the anchor may not exist yet — watch for it.
  const observer = new MutationObserver(() => {
    if (scrollToId(initialId)) observer.disconnect();
  });

  observer.observe(document.body, { childList: true, subtree: true });
  const timer = setTimeout(() => observer.disconnect(), 3000);

  return () => {
    clearTimeout(timer);
    observer.disconnect();
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
