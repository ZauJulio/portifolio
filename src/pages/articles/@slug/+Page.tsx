import { useRef } from "react";
import { useTranslation } from "react-i18next";

import { MdxRender } from "@indago/hyper-down";
import {
  ArrowLeftIcon,
  CalendarIcon,
  ClockIcon,
  ExternalLinkIcon,
  NewspaperIcon,
} from "lucide-react";
import { useData } from "vike-react/useData";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CoverImage } from "@/components/CoverImage";
import { Link } from "@/components/Link";
import { PageHeader } from "@/components/PageHeader";
import { PageMinimap } from "@/components/PageMinimap";
import { RelatedContent } from "@/components/RelatedContent";
import { SeriesNav } from "@/components/SeriesNav";
import { useHashScroll } from "@/hooks/use-hash-scroll";
import { useLocale } from "@/i18n";

import { getArticleContent } from "../data";

// Code/math styling is only needed where MDX bodies render — importing it here
// (not in +Layout) keeps both stylesheets off every other page's critical path.
import "highlight.js/styles/github-dark.css";
import "katex/dist/katex.min.css";

import type { Data } from "./+data";
import type { TFunction } from "i18next";

export default function ArticlePage() {
  const { displayLocale } = useLocale();
  const { t } = useTranslation();

  const articleRef = useRef<HTMLElement>(null);

  useHashScroll();

  const article = useData<Data>();
  if (!article) return <ArticleNotFound t={t} />;

  const readTime = article.readingTime;
  const Content = getArticleContent(article.slug, article.locale);

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Header */}
      <PageHeader
        backToUrl={`${import.meta.env.BASE_URL}articles`}
        backToLabel={t(($) => $.articles.backTo)}
        rightElement={
          <>
            <NewspaperIcon className="size-5 text-brand-400" />
            <span className="font-semibold text-white">{t(($) => $.articles.article)}</span>
          </>
        }
      />

      {/* Breadcrumbs */}
      <div className="max-w-4xl mx-auto px-6">
        <Breadcrumbs
          items={[
            { label: t(($) => $.common.home), href: "/" },
            { label: t(($) => $.articles.title), href: "/articles" },
            { label: article.title },
          ]}
        />
      </div>

      <PageMinimap contentRef={articleRef} />

      {/* Cover Image */}
      {article.cover && <CoverImage src={article.cover} alt={article.title} />}

      {/* Article Content */}
      <article ref={articleRef} className="max-w-4xl mx-auto px-6 py-12">
        {/* Meta Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{article.title}</h1>

          <p className="text-lg text-gray-400 leading-relaxed mb-6">{article.description}</p>

          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 pb-6 border-b border-gray-800">
            {article.author && (
              <span className="text-gray-400">
                by <strong className="text-white">{article.author}</strong>
              </span>
            )}
            {article.date && (
              <span className="inline-flex items-center gap-1.5" suppressHydrationWarning>
                <CalendarIcon className="size-4" />
                {new Date(article.date).toLocaleDateString(displayLocale, {
                  timeZone: "UTC",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <ClockIcon className="size-4" />
              {readTime}
            </span>
            {article.canonical && (
              <a
                href={article.canonical}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-brand-300 hover:text-brand-500 transition-colors no-underline"
              >
                <ExternalLinkIcon className="size-4" />
                {t(($) => $.articles.originallyPublished)}
              </a>
            )}
          </div>
        </div>

        {/* MDX Body */}
        <div className="prose prose-invert prose-ul:list-disc prose-ol:list-decimal prose-li:marker:text-brand-400 max-w-none">
          <MdxRender
            content={Content}
            fallback={<ContentSkeleton />}
            empty={
              <div className="text-gray-400">
                {t(($) => $.articles.contentNotFound) || "Content not available"}
              </div>
            }
          />
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mt-12 pt-6 border-t border-gray-800">
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <Link
                  key={tag}
                  to={`${import.meta.env.BASE_URL}articles?tag=${encodeURIComponent(tag)}`}
                  className="text-xs px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 hover:bg-brand-500/20 transition-colors no-underline"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* Series pager + suggested content — kept outside <article> so the
          PageMinimap mirror (a clone of the article element) never duplicates them. */}
      <div className="max-w-4xl mx-auto px-6 pb-16">
        <SeriesNav
          basePath="articles"
          prev={
            article.prevMeta
              ? { slug: article.prevMeta.slug, title: article.prevMeta.title }
              : undefined
          }
          next={
            article.nextMeta
              ? { slug: article.nextMeta.slug, title: article.nextMeta.title }
              : undefined
          }
          prevLabel={t(($) => $.articles.seriesPrevious)}
          nextLabel={t(($) => $.articles.seriesNext)}
        />
        <RelatedContent
          title={t(($) => $.articles.relatedTitle)}
          basePath="articles"
          items={article.related}
        />
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

const ArticleNotFound = ({ t }: { t: TFunction }) => (
  <div className="min-h-screen bg-black text-white font-sans flex items-center justify-center">
    <div className="text-center">
      <NewspaperIcon className="size-12 text-gray-600 mx-auto mb-4" />
      <h1 className="text-2xl font-bold mb-2">{t(($) => $.articles.notFound)}</h1>
      <p className="text-gray-400 mb-6">{t(($) => $.articles.notFoundDesc)}</p>

      <Link
        to={`${import.meta.env.BASE_URL}articles`}
        className="inline-flex items-center gap-2 text-brand-300 hover:text-brand-500 transition-colors no-underline"
      >
        <ArrowLeftIcon className="size-4" />
        {t(($) => $.articles.backTo)}
      </Link>
    </div>
  </div>
);
