import { useEffect, useId, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { FileTextIcon, HashIcon, SearchIcon } from "lucide-react";

import { Link } from "@/components/Link";

import type { SectionHit } from "@indago/hyper-down";

interface PageHit {
  slug: string;
  title: string;
  locale: string;
}

interface SearchResponse {
  pages: PageHit[];
  sections: SectionHit[];
}

const EMPTY: SearchResponse = { pages: [], sections: [] };

/**
 * In-article search box, shown on every article detail page.
 *
 * - Plain text → searches **all** articles (pages + section hits) via `/api/search`.
 * - A leading `#` → searches **only the current page's** sections; while the `#`
 *   mode is active the input border turns dashed and drops ~5% contrast.
 *
 * Detail pages are prerendered with no client DB, so results come from the Hono
 * `/api/search` JSON endpoint. Current-page section hits scroll in place (the
 * article's capture-phase hash handler); everything else links out.
 */
export function ArticleSearch({ currentSlug, locale }: { currentSlug: string; locale: string }) {
  const { t } = useTranslation();
  const listId = useId();

  const [value, setValue] = useState("");
  const [results, setResults] = useState<SearchResponse>(EMPTY);
  const [open, setOpen] = useState(false);
  // Index of the keyboard-highlighted row across the flat [pages, sections] list
  // (-1 = nothing highlighted). Arrow keys move it; Enter activates it.
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const isCurrentMode = value.startsWith("#");
  const query = (isCurrentMode ? value.slice(1) : value).trim();

  const resultCount = results.pages.length + results.sections.length;

  // Reset the highlight whenever the result set changes.
  useEffect(() => {
    setActiveIndex(-1);
  }, [resultCount, query]);

  // Move the keyboard highlight and keep the active row in view.
  const move = (delta: number) => {
    if (resultCount === 0) return;
    setActiveIndex((prev) => {
      const next = (prev + delta + resultCount) % resultCount;
      containerRef.current
        ?.querySelector(`[data-index="${next}"]`)
        ?.scrollIntoView({ block: "nearest" });
      return next;
    });
  };

  // Enter activates the highlighted row by clicking it — reusing the row's own
  // Link/anchor handler (SPA nav for pages, in-place hash scroll for sections).
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
    if (!open || resultCount === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      move(1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      move(-1);
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      containerRef.current?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`)?.click();
    }
  };

  // Debounced fetch; aborts the in-flight request when the query changes.
  useEffect(() => {
    if (!query) {
      setResults(EMPTY);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      const params = new URLSearchParams({ q: query, locale });
      if (isCurrentMode) params.set("slug", currentSlug);

      try {
        const res = await fetch(`/api/search?${params}`, { signal: controller.signal });
        if (res.ok) setResults((await res.json()) as SearchResponse);
      } catch {
        // Aborted or offline — keep the previous results.
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, isCurrentMode, currentSlug, locale]);

  // Close the dropdown on an outside click.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const hasResults = results.pages.length > 0 || results.sections.length > 0;
  const showDropdown = open && query.length > 0;

  return (
    <div
      ref={containerRef}
      className="w-full overflow-visible absolute inset-x-0 top-1/2 -translate-y-1/2 lg:static lg:max-w-md lg:translate-y-0"
    >
      <div className="relative">
        {isCurrentMode ? (
          <HashIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-brand-400/90" />
        ) : (
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
        )}
        <input
          type="text"
          aria-label={t(($) => $.articles.searchPlaceholder)}
          placeholder={t(($) => $.articles.searchPlaceholder)}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          // `#` mode: dashed border + ~5% less contrast than the solid focus border.
          className={`w-full bg-gray-900/50 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none transition-colors border ${
            isCurrentMode
              ? "border-dashed border-brand-500/45 text-white/95"
              : "border-gray-800 focus:border-brand-500/50"
          }`}
        />
      </div>

      {showDropdown && (
        <div
          id={listId}
          className="absolute z-50 mt-2 w-full rounded-xl border border-gray-800 bg-gray-950/95 backdrop-blur-md shadow-2xl shadow-black/50 overflow-hidden max-h-[60vh] overflow-y-auto"
        >
          {!hasResults ? (
            <p className="px-4 py-3 text-sm text-gray-500">
              {t(($) => $.articles.searchNoResults)}
            </p>
          ) : (
            <>
              {results.pages.length > 0 && (
                <SearchGroup label={t(($) => $.articles.searchArticles)}>
                  {results.pages.map((p, i) => (
                    <Link
                      key={p.slug}
                      id={`${listId}-${i}`}
                      data-index={i}
                      to={`${import.meta.env.BASE_URL}articles/${p.slug}`}
                      className={`flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors no-underline ${
                        activeIndex === i
                          ? "bg-brand-500/10 text-white"
                          : "text-gray-300 hover:bg-brand-500/10 hover:text-white"
                      }`}
                      onClick={() => setOpen(false)}
                    >
                      <FileTextIcon className="size-4 text-gray-500 shrink-0" />
                      <span className="truncate">{p.title}</span>
                    </Link>
                  ))}
                </SearchGroup>
              )}

              {results.sections.length > 0 && (
                <SearchGroup
                  label={
                    isCurrentMode
                      ? t(($) => $.articles.searchInThisPage)
                      : t(($) => $.articles.searchSections)
                  }
                >
                  {results.sections.map((s, i) => {
                    const index = results.pages.length + i;
                    return (
                      <SectionResult
                        key={`${s.slug}#${s.headingId}`}
                        hit={s}
                        currentSlug={currentSlug}
                        index={index}
                        domId={`${listId}-${index}`}
                        active={activeIndex === index}
                        onNavigate={() => setOpen(false)}
                      />
                    );
                  })}
                </SearchGroup>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function SearchGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="py-1.5 border-b border-gray-800/60 last:border-b-0">
      <p className="px-4 py-1 text-[0.65rem] uppercase tracking-wider text-gray-600">{label}</p>
      {children}
    </div>
  );
}

/** A section hit: scrolls in place when it belongs to the current article, else links out. */
function SectionResult({
  hit,
  currentSlug,
  index,
  domId,
  active,
  onNavigate,
}: {
  hit: SectionHit;
  currentSlug: string;
  index: number;
  domId: string;
  active: boolean;
  onNavigate: () => void;
}) {
  const indent = { paddingLeft: `${1 + (hit.level - 1) * 0.75}rem` };
  const inner = (
    <>
      <HashIcon className="size-3.5 text-gray-600 shrink-0" />
      <span className="truncate">{hit.title}</span>
    </>
  );
  const className = `flex items-center gap-2 pr-4 py-2 text-sm transition-colors no-underline ${
    active ? "bg-brand-500/10 text-white" : "text-gray-400 hover:bg-brand-500/10 hover:text-white"
  }`;

  if (hit.slug === currentSlug) {
    return (
      <a
        id={domId}
        data-index={index}
        href={`#${hit.headingId}`}
        className={className}
        style={indent}
        onClick={onNavigate}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link
      id={domId}
      data-index={index}
      to={`${import.meta.env.BASE_URL}articles/${hit.slug}#${hit.headingId}`}
      className={className}
      style={indent}
      onClick={onNavigate}
    >
      {inner}
    </Link>
  );
}
