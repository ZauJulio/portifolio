import { useTranslation } from "react-i18next";

import { MdxRender } from "@indago/hyper-down";
import { MessageSquareIcon } from "lucide-react";

import { mdxComponents } from "@/components/mdx/mdx-components";
import { useLocale } from "@/i18n";
import { getReviewContent } from "@/pages/reviews/data";

import type { ReviewMeta } from "@indago/hyper-down";

/** Renders a review's MDX body inline on its subject's own page (game/book),
 *  instead of just linking out to `/reviews/<slug>`. */
export function ReviewSection({ review }: { review?: ReviewMeta }) {
  const { displayLocale } = useLocale();
  const { t } = useTranslation();

  if (!review) return null;

  const Content = getReviewContent(review.slug, review.locale);

  return (
    <div className="mt-10 pt-8 border-t border-gray-800">
      <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
        <MessageSquareIcon className="size-4" />
        <span>{t(($) => $.reviews.kind[review.kind as NonNullable<typeof review.kind>])}</span>
        {review.date && (
          <span suppressHydrationWarning>
            &bull;{" "}
            {new Date(review.date).toLocaleDateString(displayLocale, {
              timeZone: "UTC",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        )}
      </div>

      <div className="prose prose-invert prose-ul:list-disc prose-ol:list-decimal prose-li:marker:text-brand-400 max-w-none">
        <MdxRender
          content={Content}
          components={[mdxComponents]}
          fallback={<ContentSkeleton />}
          empty={<div className="text-gray-400">{t(($) => $.reviews.contentNotFound)}</div>}
        />
      </div>
    </div>
  );
}

const ContentSkeleton = () => (
  <div className="animate-pulse space-y-4 my-4">
    <div className="h-4 bg-gray-800 rounded w-3/4" />
    <div className="h-4 bg-gray-800 rounded w-full" />
    <div className="h-4 bg-gray-800 rounded w-5/6" />
  </div>
);
