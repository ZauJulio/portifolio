import { useEffect, useMemo, useRef, useState } from "react";
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

// Recolour the lib sidebar to the brand palette (hover accent + muted text).
// Active rows use a very-low-contrast gray (see `activeLinkClassName`).
const brandTheme = {
  "--hd-sidebar-accent": brand[400],
  "--hd-sidebar-muted": "rgb(156 163 175)", // gray-400
  "--hd-sidebar-hover": "rgb(255 255 255 / 0.04)",
} as CSSProperties;

/**
 * Tutorial section navigator (only rendered for `tutorial`-tagged articles).
 *
 * Wraps the engine `<Sidebar/>` (whole-row collapse/expand with a chevron icon,
 * bold/active auto-expand, badge pills, ellipsis on long titles, anchor links)
 * with the portfolio chrome:
 *  - a borderless sticky desktop panel (placed after the cover in the page flow,
 *    so it starts below the cover and then sticks under the top bar);
 *  - **compression** — when the tree is taller than the viewport, non-bold/inactive
 *    branches collapse by default;
 *  - active-section tracking (scroll spy) highlighting the current heading in a
 *    faint gray;
 *  - a mobile hamburger (below the top bar) opening a full-width drawer.
 */
export function TutorialSidebar({ sections }: { sections: SectionNode[] }) {
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [compress, setCompress] = useState(false);
  // The hamburger only appears once the cover has scrolled away. This component
  // renders in page flow right below the cover, so a sentinel at its top crossing
  // the top bar means the cover is gone.
  const [pastCover, setPastCover] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const ids = useMemo(() => flattenSectionIds(sections), [sections]);
  const activeId = useActiveSection(ids);

  // Reveal the hamburger when the sentinel is scrolled above the top bar (80px).
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setPastCover(entry.boundingClientRect.top < 80),
      { rootMargin: "-80px 0px 0px 0px", threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Compress when the (roughly) measured tree height would exceed the viewport.
  useEffect(() => {
    const ROW = 30; // px per row, approx
    const check = () => setCompress(ids.length * ROW > window.innerHeight * 0.72);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [ids.length]);

  // Lock background scroll while the mobile drawer is open (also removes the
  // scrollbar gutter, so the drawer truly fills the width).
  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

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
      activeLinkClassName="bg-white/[0.04]"
    />
  );

  const heading = (
    <p className="px-2 py-4 pb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
      {t(($) => $.articles.sectionsTitle)}
    </p>
  );

  return (
    <>
      {/* Sentinel at the top of the content region — drives the hamburger reveal. */}
      <div ref={sentinelRef} aria-hidden="true" className="absolute h-0 w-0" />

      {/* Desktop: borderless sticky panel. In page flow after the cover, so it
          starts below the cover, then sticks under the top bar while scrolling. */}
      <aside
        aria-label={t(($) => $.articles.sectionsTitle)}
        style={brandTheme}
        className="hidden lg:block shrink-0 w-60 self-start sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto overflow-x-hidden tutorial-scroll pr-2"
      >
        {heading}
        {tree}
      </aside>

      {/* Mobile: hamburger just below the top bar — only after the cover scrolls away. */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        aria-label={t(($) => $.articles.openSections)}
        aria-hidden={!pastCover}
        tabIndex={pastCover ? 0 : -1}
        className={`lg:hidden fixed left-4 top-20 z-30 inline-flex items-center justify-center size-10 rounded-lg border border-gray-800 bg-black/70 backdrop-blur-md text-gray-300 hover:text-brand-400 hover:border-brand-500/50 transition-all ${
          pastCover ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <ListTreeIcon className="size-5" />
      </button>

      {/* Mobile: full-width drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 opacity-98">
          <nav
            aria-label={t(($) => $.articles.sectionsTitle)}
            style={brandTheme}
            className="absolute inset-0 w-full bg-gray-950 flex flex-col"
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
            <div className="tutorial-scroll flex-1 overflow-y-auto overflow-x-hidden px-2 py-3">
              {tree}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
