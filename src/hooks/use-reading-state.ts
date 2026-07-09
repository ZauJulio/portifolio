import { useCallback, useEffect, useState } from "react";

// Tracks which articles/recipes the visitor has already opened, in localStorage,
// so listing cards can be dimmed ("already read"). Read state is per-browser and
// has no SSR equivalent, so the set starts empty on the server and is hydrated
// after mount — cards render at full opacity first, then dim, avoiding a
// hydration mismatch.

const STORAGE_KEY = "portifolio:reading";

export type ReadableType = "article" | "recipe" | "review";

const keyOf = (type: ReadableType, slug: string) => `${type}:${slug}`;

function load(): Set<string> {
  if (typeof window === "undefined") return new Set();

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const list = raw ? (JSON.parse(raw) as unknown) : [];

    return new Set(
      Array.isArray(list) ? list.filter((x): x is string => typeof x === "string") : [],
    );
  } catch {
    return new Set();
  }
}

function persist(set: Set<string>): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
  } catch {
    // Quota / disabled storage — read state is best-effort, never fatal.
  }
}

/**
 * Read-tracking for content listings/detail pages.
 *
 * - `isRead(type, slug)` — whether the item has been opened (always `false` until
 *   the post-mount hydration runs, so SSR/CSR markup matches).
 * - `markRead(type, slug)` — record an item as read (call on a detail page mount).
 */
export function useReadingState() {
  const [readSet, setReadSet] = useState<Set<string>>(() => new Set());

  // Cross-tab + initial hydration: load once, and stay in sync if another tab writes.
  useEffect(() => {
    setReadSet(load());

    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setReadSet(load());
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const markRead = useCallback((type: ReadableType, slug: string) => {
    setReadSet((prev) => {
      if (prev.has(keyOf(type, slug))) return prev;

      const next = new Set(prev).add(keyOf(type, slug));
      persist(next);

      return next;
    });
  }, []);

  const isRead = useCallback(
    (type: ReadableType, slug: string) => readSet.has(keyOf(type, slug)),
    [readSet],
  );

  return { isRead, markRead, readSet };
}
