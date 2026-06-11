import { useTranslation } from "react-i18next";

import { ExternalLinkIcon } from "lucide-react";

import { Link } from "@/components/Link";
import type { ArticleMeta } from "@/pages/articles/data";

function ArticleCard({ article }: { article: ArticleMeta }) {
  const meta = article;

  return (
    <Link
      to={`${import.meta.env.BASE_URL}articles/${meta.slug}`}
      className="group block rounded-xl border border-gray-800 bg-gray-900/30 p-6 transition-all duration-300 hover:border-brand-500/50 hover:bg-gray-800/35 hover:shadow-lg hover:shadow-brand-500/5 w-4/5 mx-auto md:w-4/5"
    >
      {meta.cover && (
        <div className="w-full max-h-[340px] overflow-hidden mb-3">
          <img src={meta.cover} alt={meta.title} className="h-full object-cover rounded-t-xl" />
        </div>
      )}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-white group-hover:text-brand-300 transition-colors">
          {meta.title}
        </h3>
        <ExternalLinkIcon className="size-4 text-gray-500 group-hover:text-brand-400 transition-colors shrink-0 mt-1" />
      </div>
      <p className="text-sm text-gray-400 mb-4 leading-relaxed line-clamp-3">{meta.description}</p>
      <div className="flex items-center gap-4 text-xs text-gray-500">
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
    </Link>
  );
}

export function ArticlesSection({ articles }: { articles: ArticleMeta[] }) {
  const { t } = useTranslation();

  return (
    <section id="articles" className="container mx-auto mt-24 mb-16 px-4 md:px-0">
      <h2 className="text-3xl md:text-4xl font-bold mb-2 text-center">
        {t(($) => $.articles.latest)}
      </h2>
      <p className="text-gray-400 text-lg mb-8 text-center">
        {t(($) => $.articles.latestDescription)}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {articles.slice(0, 4).map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </section>
  );
}
