import { CalendarIcon, ClockIcon } from "lucide-react";

import { Link } from "@/components/Link";
import { useLocale } from "@/i18n";

import { useArticles } from "../ArticlesContext";

import type { ArticleMeta } from "../data";

export function ArticleCard({ article }: { article: ArticleMeta }) {
  const { displayLocale } = useLocale();
  const { setTag } = useArticles();

  return (
    <div className="block rounded-xl border border-gray-800 bg-gray-900/50 overflow-hidden group hover:border-brand-500/50 transition-all duration-300 relative">
      <Link
        to={`${import.meta.env.BASE_URL}articles/${article.slug}`}
        className="absolute inset-0 z-0"
        aria-label={article.title}
      />
      {article.cover && (
        <div className="aspect-video overflow-hidden relative z-0 pointer-events-none">
          <img
            src={article.cover}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-6 relative z-10 pointer-events-none">
        <div className="flex items-center gap-3 mb-3 text-xs text-gray-500">
          {article.date && (
            <span className="inline-flex items-center gap-1">
              <CalendarIcon className="size-3" />
              {new Date(article.date).toLocaleDateString(displayLocale, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <ClockIcon className="size-3" />
            {article.readingTime}
          </span>
        </div>

        <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-brand-300 transition-colors">
          {article.title}
        </h3>

        <p className="text-sm text-gray-400 leading-relaxed mb-4 line-clamp-3">
          {article.description}
        </p>

        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pointer-events-auto">
            {article.tags.map((tag) => (
              <Link
                key={tag}
                to={`${import.meta.env.BASE_URL}articles?tag=${encodeURIComponent(tag)}`}
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
