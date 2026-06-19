import { useEffect, type RefObject } from "react";

/**
 * Desktop-only `Ctrl`/`⌘` + `.` affordance for a search input.
 *
 * Registers a window-level shortcut that focuses (and selects) the given input,
 * and renders a small, low-contrast key hint pinned center-right inside the
 * input. The hint is hidden below `lg` — phones have no physical keyboard, so
 * the shortcut is a desktop-only nicety.
 */
export function SearchHint({ inputRef }: { inputRef: RefObject<HTMLInputElement | null> }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "." && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        const el = inputRef.current;
        el?.focus();
        el?.select();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [inputRef]);

  return (
    <span
      aria-hidden
      className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-1 text-[10px] text-gray-400 opacity-40 lg:flex"
    >
      <kbd className="rounded border border-gray-700 bg-gray-800/60 px-1.5 py-0.5 font-sans leading-none">
        Ctrl
      </kbd>
      <span>+</span>
      <kbd className="rounded border border-gray-700 bg-gray-800/60 px-1.5 py-0.5 font-sans leading-none">
        .
      </kbd>
    </span>
  );
}
