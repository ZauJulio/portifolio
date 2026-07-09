import { useTranslation } from "react-i18next";

import { CalendarIcon } from "lucide-react";

import { Link } from "@/components/Link";
import { useReadingState } from "@/hooks/use-reading-state";
import { useLocale } from "@/i18n";

import { useReviews } from "../ReviewsContext";

import type { ReviewMeta } from "../data";

export function ReviewCard({ review }: { review: ReviewMeta }) {
  const { t } = useTranslation();
  const { displayLocale } = useLocale();
  const { setTag } = useReviews();
  const { isRead } = useReadingState();

  // Already-read reviews are dimmed (and recover full opacity on hover).
  const read = isRead("review", review.slug);

  return (
    <div
      className={`block rounded-xl border border-gray-800 bg-gray-900/50 overflow-hidden group hover:border-brand-500/50 transition-all duration-300 relative hover:opacity-100 ${
        read ? "opacity-55" : ""
      }`}
    >
      <Link
        to={`${import.meta.env.BASE_URL}reviews/${review.slug}`}
        className="absolute inset-0 z-0"
        aria-label={review.title}
      />
      {review.cover && (
        <div className="aspect-video overflow-hidden relative z-0 pointer-events-none">
          <img
            src={review.cover}
            alt={review.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-6 relative z-10 pointer-events-none">
        <div className="flex items-center gap-3 mb-3 text-xs text-gray-500">
          {review.date && (
            <span className="inline-flex items-center gap-1">
              <CalendarIcon className="size-3" />
              {new Date(review.date).toLocaleDateString(displayLocale, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          )}
          {review.type && (
            <span className="px-2 py-0.5 rounded-full bg-gray-800 text-gray-400">
              {t(($) => $.reviews.type[review.type as NonNullable<typeof review.type>])}
            </span>
          )}
        </div>

        <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-brand-300 transition-colors">
          {review.title}
        </h3>

        <p className="text-sm text-gray-400 leading-relaxed mb-4 line-clamp-3">
          {review.description}
        </p>

        {review.tags && review.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pointer-events-auto">
            {review.tags.map((tag) => (
              <Link
                key={tag}
                to={`${import.meta.env.BASE_URL}reviews?tag=${encodeURIComponent(tag)}`}
                // Opt out of Vike's link interception (scroll-to-top) — setTag
                // (keepScrollPosition) handles the in-place refinement.
                data-vike="false"
                onClick={(e) => {
                  e.preventDefault();
                  setTag(tag);
                }}
                className="text-xs px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 hover:bg-brand-500/20 transition-colors relative z-20"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
