import { useEffect, useState } from "react";

import type { SectionNode } from "@indago/hyper-down";

/**
 * Returns the id of the heading currently nearest the top of the viewport, from
 * the given ordered `ids`. Drives the tutorial sidebar's active highlight. Uses a
 * passive scroll listener (cheap; the work is a bounded `getBoundingClientRect`
 * sweep) and re-binds when the id set changes (SPA navigation between tutorials).
 */
export function useActiveSection(ids: string[]): string {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (ids.length === 0) return;

    const compute = () => {
      const triggerOffset = 120;

      // At the very top → first section; near the bottom → last section.
      if (window.scrollY < 80) {
        setActiveId(ids[0]);
        return;
      }
      const nearBottom =
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 80;
      if (nearBottom) {
        setActiveId(ids[ids.length - 1]);
        return;
      }

      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= triggerOffset) current = id;
      }
      setActiveId(current);
    };

    window.addEventListener("scroll", compute, { passive: true });
    compute();
    return () => window.removeEventListener("scroll", compute);
  }, [ids]);

  return activeId;
}

/** Flattens a section tree into a depth-first ordered list of anchor ids. */
export function flattenSectionIds(sections: SectionNode[]): string[] {
  const out: string[] = [];
  const walk = (nodes: SectionNode[]) => {
    for (const n of nodes) {
      out.push(n.id);
      walk(n.children);
    }
  };
  walk(sections);
  return out;
}
