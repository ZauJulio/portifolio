import { useTranslation } from "react-i18next";

import { ArrowRightIcon, ExternalLinkIcon } from "lucide-react";

import { Link } from "@/components/Link";
import { MobileCarousel } from "@/components/MobileCarousel";
import type { ArticleMeta } from "@/pages/articles/data";

function ArticleCard({ article }: { article: ArticleMeta }) {
  const meta = article;

  return (
    <Link
      to={`${import.meta.env.BASE_URL}articles/${meta.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-800 bg-gray-900/30 transition-all duration-300 hover:border-brand-500/50 hover:bg-gray-800/35 hover:shadow-lg hover:shadow-brand-500/5"
    >
      {meta.cover && (
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={meta.cover}
            alt={meta.title}
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-white group-hover:text-brand-300 transition-colors">
            {meta.title}
          </h3>
          <ExternalLinkIcon className="size-4 text-gray-500 group-hover:text-brand-400 transition-colors shrink-0 mt-1" />
        </div>
        <p className="text-sm text-gray-400 mb-4 leading-relaxed line-clamp-3">
          {meta.description}
        </p>
        <div className="flex items-center gap-4 text-xs text-gray-500 mt-auto">
          <span>{meta.author}</span>
          <span>{meta.readingTime}</span>
          <span>{meta.date}</span>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {(meta.tags || []).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 border border-gray-700"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

function SeeAllCard() {
  const { t } = useTranslation();

  return (
    <Link
      to={`${import.meta.env.BASE_URL}articles`}
      className="group flex h-full min-h-65 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-gray-700 bg-gray-900/20 p-6 text-center transition-all duration-300 hover:border-brand-500/60 hover:bg-gray-800/35"
    >
      <span className="flex size-12 items-center justify-center rounded-full bg-brand-500/10 text-brand-400 transition-colors group-hover:bg-brand-500/20">
        <ArrowRightIcon className="size-6" />
      </span>
      <span className="text-lg font-semibold text-white">{t(($) => $.articles.seeAll)}</span>
      <span className="text-sm text-gray-400">{t(($) => $.articles.title)}</span>
    </Link>
  );
}

export function ArticlesSection({ articles }: { articles: ArticleMeta[] }) {
  const { t } = useTranslation();
  const featured = articles.slice(0, 4);

  return (
    <section id="articles" className="container mx-auto mt-24 mb-16 px-4 md:px-0">
      <h2 className="text-3xl md:text-4xl font-bold mb-2 text-center">
        {t(($) => $.articles.latest)}
      </h2>
      <p className="text-gray-400 text-lg mb-8 text-center">
        {t(($) => $.articles.latestDescription)}
      </p>

      {/* Desktop: grid */}
      <div className="hidden md:grid grid-cols-2 gap-8">
        {featured.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>

      {/* Mobile: carousel with a trailing "see all" card */}
      <MobileCarousel ariaLabel={t(($) => $.articles.latest)} itemClassName="w-[82%]">
        {featured.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
        <SeeAllCard />
      </MobileCarousel>
    </section>
  );
}
