import { CalendarIcon, ClockIcon } from "lucide-react";

import { Link } from "@/components/Link";
import { useLocale } from "@/i18n";

/** Minimal shape shared by article and recipe metadata for a suggestion card. */
export interface RelatedItem {
  slug: string;
  title: string;
  description?: string;
  cover?: string;
  date?: string;
  readingTime?: string;
  tags?: string[];
}

interface RelatedContentProps {
  /** Section heading (e.g. "You might also like"). */
  title: string;
  /** URL segment under `BASE_URL`, e.g. `"articles"` or `"cooking"`. */
  basePath: string;
  /** Tag-ranked suggestions (already limited server-side). */
  items: RelatedItem[];
}

/**
 * Suggested-content strip rendered at the foot of a detail page. The items come
 * pre-ranked by tag order from HyperDown's `related()`. Layout: three cards side
 * by side on desktop, one per row (three rows) on mobile.
 */
export function RelatedContent({ title, basePath, items }: RelatedContentProps) {
  const { displayLocale } = useLocale();

  if (items.length === 0) return null;

  return (
    <section className="mt-16 pt-10 border-t border-gray-800">
      <h2 className="text-xl font-semibold text-white mb-6">{title}</h2>

      {/* 3-up on desktop; stacked (1 per row → 3 rows) on mobile. */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <Link
            key={item.slug}
            to={`${import.meta.env.BASE_URL}${basePath}/${item.slug}`}
            className="group flex flex-col rounded-xl border border-gray-800 bg-gray-900/50 overflow-hidden hover:border-brand-500/50 transition-all duration-300 no-underline"
          >
            {item.cover && (
              <div className="aspect-video overflow-hidden">
                <img
                  src={item.cover}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            )}

            <div className="p-5 flex flex-col gap-2">
              <div className="flex items-center gap-3 text-xs text-gray-500">
                {item.date && (
                  <span className="inline-flex items-center gap-1" suppressHydrationWarning>
                    <CalendarIcon className="size-3" />
                    {new Date(item.date).toLocaleDateString(displayLocale, {
                      timeZone: "UTC",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                )}
                {item.readingTime && (
                  <span className="inline-flex items-center gap-1">
                    <ClockIcon className="size-3" />
                    {item.readingTime}
                  </span>
                )}
              </div>

              <h3 className="text-base font-semibold text-white group-hover:text-brand-300 transition-colors line-clamp-2">
                {item.title}
              </h3>

              {item.description && (
                <p className="text-sm text-gray-400 leading-relaxed line-clamp-3">
                  {item.description}
                </p>
              )}

              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {item.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
