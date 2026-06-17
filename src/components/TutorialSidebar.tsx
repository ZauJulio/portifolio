import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { useTranslation } from "react-i18next";

import { Sidebar } from "@indago/hyper-down";
import { ListTreeIcon, XIcon } from "lucide-react";

import { flattenSectionIds, useActiveSection } from "@/hooks/use-active-section";

import tailwindConfig from "../../tailwind.config";

import type { SectionNode } from "@indago/hyper-down";

// The lib's default <Sidebar/> ships the structural CSS + a `--hd-sidebar-*`
// variable API; we import it and recolour it to the brand palette.
import "@indago/hyper-down/sidebar.css";

const brand = tailwindConfig.theme.extend.colors.brand;

// Recolour the lib sidebar to the brand palette (hover/active accent + muted text).
const brandTheme = {
  "--hd-sidebar-accent": brand[400],
  "--hd-sidebar-muted": "rgb(156 163 175)", // gray-400
  "--hd-sidebar-hover": `${brand[500]}1a`,
} as CSSProperties;

/**
 * Tutorial section navigator (only rendered for `tutorial`-tagged articles).
 *
 * Wraps the engine `<Sidebar/>` (collapse/expand, bold/active auto-expand, badge
 * pills, anchor deep-links) with the portfolio chrome:
 *  - a fixed left panel on desktop, with a pretty scrollbar; bold branches stay
 *    expanded even when they overflow the panel width (horizontal scroll);
 *  - **compression** — when the tree is taller than the viewport, non-bold/inactive
 *    branches collapse by default;
 *  - active-section tracking (scroll spy) to highlight the current heading;
 *  - a mobile hamburger (below the header's back arrow) opening a drawer.
 */
export function TutorialSidebar({ sections }: { sections: SectionNode[] }) {
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [compress, setCompress] = useState(false);

  const ids = useMemo(() => flattenSectionIds(sections), [sections]);
  const activeId = useActiveSection(ids);

  // Compress when the (roughly) measured tree height would exceed the viewport.
  useEffect(() => {
    const ROW = 30; // px per row, approx
    const check = () => setCompress(ids.length * ROW > window.innerHeight * 0.72);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [ids.length]);

  const onSelect = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    history.pushState(null, "", `#${id}`);
    setMobileOpen(false);
  };

  if (sections.length === 0) return null;

  const tree = (
    <Sidebar
      sections={sections}
      activeId={activeId}
      compress={compress}
      onSelect={onSelect}
      linkClassName="rounded-md"
      activeLinkClassName="bg-brand-500/10 text-brand-400"
    />
  );

  return (
    <>
      {/* Desktop: fixed left panel */}
      <nav
        aria-label={t(($) => $.articles.sectionsTitle)}
        className="hidden lg:flex fixed left-3 top-24 bottom-8 z-30 w-64 flex-col rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl shadow-black/50"
      >
        <p className="px-4 pt-4 pb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
          {t(($) => $.articles.sectionsTitle)}
        </p>
        <div className="tutorial-scroll flex-1 overflow-auto px-2 pb-4" style={brandTheme}>
          {tree}
        </div>
      </nav>

      {/* Mobile: hamburger just below the header's back arrow */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        aria-label={t(($) => $.articles.openSections)}
        className="lg:hidden fixed left-4 top-[4.5rem] z-40 inline-flex items-center justify-center size-10 rounded-lg border border-gray-800 bg-black/70 backdrop-blur-md text-gray-300 hover:text-brand-400 hover:border-brand-500/50 transition-colors"
      >
        <ListTreeIcon className="size-5" />
      </button>

      {/* Mobile: drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <button
            type="button"
            aria-label={t(($) => $.articles.closeSections)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <nav
            aria-label={t(($) => $.articles.sectionsTitle)}
            className="relative w-72 max-w-[80vw] h-full bg-gray-950 border-r border-gray-800 flex flex-col"
          >
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-800">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                {t(($) => $.articles.sectionsTitle)}
              </span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label={t(($) => $.articles.closeSections)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <XIcon className="size-5" />
              </button>
            </div>
            <div className="tutorial-scroll flex-1 overflow-auto px-2 py-3" style={brandTheme}>
              {tree}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
