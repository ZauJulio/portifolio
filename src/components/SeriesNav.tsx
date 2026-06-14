import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

import { Link } from "@/components/Link";

/** One end of the series chain — the slug to link to and the title to show. */
export interface SeriesLink {
  slug: string;
  title: string;
}

interface SeriesNavProps {
  /** URL segment under `BASE_URL`, e.g. `"articles"`. */
  basePath: string;
  prev?: SeriesLink;
  next?: SeriesLink;
  prevLabel: string;
  nextLabel: string;
}

/**
 * Previous/next pager for an article series — the rendered form of the optional
 * `prev`/`next` frontmatter slugs (a doubly-linked list). Renders nothing when
 * the article belongs to no series.
 */
export function SeriesNav({ basePath, prev, next, prevLabel, nextLabel }: SeriesNavProps) {
  if (!prev && !next) return null;

  return (
    <nav className="pt-6 border-t border-gray-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
      {prev ? (
        <Link
          to={`${import.meta.env.BASE_URL}${basePath}/${prev.slug}`}
          className="group flex flex-col gap-1 rounded-xl border border-gray-800 bg-gray-900/50 p-4 hover:border-brand-500/50 transition-colors no-underline sm:col-start-1"
        >
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
          className="group flex flex-col gap-1 rounded-xl border border-gray-800 bg-gray-900/50 p-4 text-right hover:border-brand-500/50 transition-colors no-underline sm:col-start-2"
        >
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
