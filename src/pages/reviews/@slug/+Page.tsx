import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { MdxRender } from "@indago/hyper-down";
import { ArrowLeftIcon, CalendarIcon, StarIcon } from "lucide-react";
import { useData } from "vike-react/useData";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CoverImage } from "@/components/CoverImage";
import { Link } from "@/components/Link";
import { mdxComponents } from "@/components/mdx/mdx-components";
import { PageHeader } from "@/components/PageHeader";
import { RelatedContent } from "@/components/RelatedContent";
import { useReadingState } from "@/hooks/use-reading-state";
import { useLocale } from "@/i18n";

import { getReviewContent } from "../data";
import { SubjectCard } from "./components/SubjectCard";

// Code styling is only needed where MDX bodies render — importing it here
// (not in +Layout) keeps the stylesheet off every other page's critical path.
import "highlight.js/styles/github-dark.css";

import type { Data } from "./+data";
import type { TFunction } from "i18next";

export default function ReviewPage() {
  const { displayLocale } = useLocale();
  const { t } = useTranslation();

  const review = useData<Data>();
  const { markRead } = useReadingState();

  // Mark the review read once it is opened (dims its card in the listing).
  useEffect(() => {
    if (review?.slug) markRead("review", review.slug);
  }, [markRead, review?.slug]);

  if (!review) return <ReviewNotFound t={t} />;

  const Content = getReviewContent(review.slug, review.locale);

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <PageHeader backToUrl={`${import.meta.env.BASE_URL}reviews`} />

      <div className="max-w-4xl mx-auto px-6">
        <Breadcrumbs
          items={[
            { label: t(($) => $.common.home), href: "/" },
            { label: t(($) => $.reviews.title), href: "/reviews" },
            { label: review.title },
          ]}
        />
      </div>

      {review.cover ? (
        <CoverImage src={review.cover} alt={review.title} />
      ) : (
        <div className="w-full max-h-100 overflow-hidden rounded-xl bg-black/40">
          <img
            src={`${import.meta.env.BASE_URL}covers/article-fallback.svg`}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="py-4">
        <article className="bg-[#101010]/35 border border-[#101010] rounded-2xl max-w-4xl mx-auto px-6 py-12">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{review.title}</h1>

            <p className="text-lg text-gray-400 leading-relaxed mb-6">{review.description}</p>

            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 pb-6 border-b border-gray-800">
              {review.date && (
                <span className="inline-flex items-center gap-1.5" suppressHydrationWarning>
                  <CalendarIcon className="size-4" />
                  {new Date(review.date).toLocaleDateString(displayLocale, {
                    timeZone: "UTC",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              )}
              {review.kind && (
                <span className="inline-flex items-center gap-1.5">
                  <StarIcon className="size-4" />
                  {t(($) => $.reviews.kind[review.kind as NonNullable<typeof review.kind>])}
                </span>
              )}
            </div>
          </div>

          {review.subject && <SubjectCard subject={review.subject} />}

          <div className="prose prose-invert prose-ul:list-disc prose-ol:list-decimal prose-li:marker:text-brand-400 max-w-none">
            <MdxRender
              content={Content}
              components={[mdxComponents]}
              fallback={<ContentSkeleton />}
              empty={
                <div className="text-gray-400">
                  {t(($) => $.reviews.contentNotFound) || "Content not available"}
                </div>
              }
            />
          </div>

          {review.tags && review.tags.length > 0 && (
            <div className="mt-12 pt-6 border-t border-gray-800">
              <div className="flex flex-wrap gap-2">
                {review.tags.map((tag) => (
                  <Link
                    key={tag}
                    to={`${import.meta.env.BASE_URL}reviews?tag=${encodeURIComponent(tag)}`}
                    className="text-xs px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 hover:bg-brand-500/20 transition-colors no-underline"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>

        {review.related.length > 0 && (
          <div className="flex flex-col gap-y-8 mt-8 max-w-4xl mx-auto px-6 pb-16">
            <div className="border-t border-gray-800 w-full" />
            <RelatedContent
              title={t(($) => $.reviews.relatedTitle)}
              basePath="reviews"
              items={review.related}
            />
          </div>
        )}
      </div>
    </div>
  );
}

const ContentSkeleton = () => (
  <div className="animate-pulse space-y-4 my-8">
    <div className="h-4 bg-gray-800 rounded w-3/4" />
    <div className="h-4 bg-gray-800 rounded w-full" />
    <div className="h-4 bg-gray-800 rounded w-5/6" />
  </div>
);

const ReviewNotFound = ({ t }: { t: TFunction }) => (
  <div className="min-h-screen bg-black text-white font-sans flex items-center justify-center">
    <div className="text-center">
      <StarIcon className="size-12 text-gray-600 mx-auto mb-4" />
      <h1 className="text-2xl font-bold mb-2">{t(($) => $.reviews.notFound)}</h1>
      <p className="text-gray-400 mb-6">{t(($) => $.reviews.notFoundDesc)}</p>

      <Link
        to={`${import.meta.env.BASE_URL}reviews`}
        className="inline-flex items-center gap-2 text-brand-300 hover:text-brand-500 transition-colors no-underline"
      >
        <ArrowLeftIcon className="size-4" />
      </Link>
    </div>
  </div>
);
