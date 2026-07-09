import type { ReactNode } from "react";

import { StarIcon } from "lucide-react";

import { Link } from "@/components/Link";

interface MediaCardProps {
  href: string;
  cover: string;
  title: string;
  statusLabel: string;
  /** Full badge color classes, e.g. `"bg-teal-500/10 text-teal-400 border-teal-500/20"` — kept
   *  as a literal string at each call site so the Tailwind scanner can still find the classes. */
  statusClassName: string;
  metaIcon: ReactNode;
  metaText: ReactNode;
  rating?: number;
  description?: string;
}

// Shared listing-card shell for the games/books/movies hobby collections —
// cover image, title + status badge, meta line, rating, description.
export function MediaCard({
  href,
  cover,
  title,
  statusLabel,
  statusClassName,
  metaIcon,
  metaText,
  rating,
  description,
}: MediaCardProps) {
  return (
    <Link
      to={href}
      className="block rounded-xl border border-gray-800 bg-gray-900/25 overflow-hidden group hover:border-page-500/50 transition-all duration-300 no-underline"
    >
      <div className="aspect-3/4 overflow-hidden bg-gray-950">
        <img
          src={cover}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <h3 className="text-lg font-semibold text-white group-hover:text-page-300 transition-colors">
            {title}
          </h3>
          <span className={`text-xs px-2 py-0.5 rounded-full border ${statusClassName}`}>
            {statusLabel}
          </span>
        </div>

        <p className="text-xs text-gray-500 mb-2 flex items-center gap-1.5">
          {metaIcon}
          {metaText}
        </p>

        {typeof rating === "number" && (
          <p className="text-xs text-amber-400 mb-2 flex items-center gap-1">
            <StarIcon className="size-3.5 fill-amber-400" />
            {rating.toFixed(1)}
          </p>
        )}

        {description && (
          <p className="text-sm text-gray-400 leading-relaxed line-clamp-2">{description}</p>
        )}
      </div>
    </Link>
  );
}
