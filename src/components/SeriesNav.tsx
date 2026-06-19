import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

import { Link } from "@/components/Link";

/** One end of the series chain — the slug to link to, the title, and an optional cover. */
export interface SeriesLink {
  slug: string;
  title: string;
  /** Cover image URL — surfaced as a hover preview above the card. */
  cover?: string;
}

interface SeriesNavProps {
  /** URL segment under `BASE_URL`, e.g. `"articles"`. */
  basePath: string;
  prev?: SeriesLink;
  next?: SeriesLink;
  prevLabel: string;
  nextLabel: string;
}

/** A floating cover preview shown above its card on hover (over everything else). */
function CoverPreview({ cover, alt }: { cover: string; alt: string }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-full z-100 mb-2 opacity-0 translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0"
    >
      <img
        src={cover}
        alt={alt}
        loading="lazy"
        className="h-32 w-full rounded-xl border border-gray-700 object-cover shadow-2xl shadow-black/60"
      />
    </span>
  );
}

/**
 * Previous/next pager for an article series — the rendered form of the optional
 * `prev`/`next` frontmatter slugs (a doubly-linked list). Renders nothing when
 * the article belongs to no series. On hover, a card floats its cover above
 * itself (high z-index) so the reader previews where the link leads.
 */
export function SeriesNav({ basePath, prev, next, prevLabel, nextLabel }: SeriesNavProps) {
  if (!prev && !next) return null;

  return (
    <nav className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {prev ? (
        <Link
          to={`${import.meta.env.BASE_URL}${basePath}/${prev.slug}`}
          className="group relative flex flex-col gap-1 rounded-xl border border-gray-800 bg-gray-900/50 p-4 hover:border-brand-500/50 transition-colors no-underline sm:col-start-1"
        >
          {prev.cover && <CoverPreview cover={prev.cover} alt={prev.title} />}
          <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
            <ArrowLeftIcon className="size-3.5" />
            {prevLabel}
          </span>
          <span className="text-sm font-medium text-white group-hover:text-brand-300 transition-colors line-clamp-1">
            {prev.title}
          </span>
        </Link>
      ) : (
        <span className="hidden sm:block" />
      )}

      {next ? (
        <Link
          to={`${import.meta.env.BASE_URL}${basePath}/${next.slug}`}
          className="group relative flex flex-col gap-1 rounded-xl border border-gray-800 bg-gray-900/50 p-4 text-right hover:border-brand-500/50 transition-colors no-underline sm:col-start-2"
        >
          {next.cover && <CoverPreview cover={next.cover} alt={next.title} />}
          <span className="inline-flex items-center justify-end gap-1.5 text-xs text-gray-500">
            {nextLabel}
            <ArrowRightIcon className="size-3.5" />
          </span>
          <span className="text-sm font-medium text-white group-hover:text-brand-300 transition-colors line-clamp-1">
            {next.title}
          </span>
        </Link>
      ) : (
        <span className="hidden sm:block" />
      )}
    </nav>
  );
}
