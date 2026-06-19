import { useRef } from "react";
import { useTranslation } from "react-i18next";

import { NewspaperIcon, SearchIcon } from "lucide-react";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Link } from "@/components/Link";
import { PageHeader } from "@/components/PageHeader";
import { Pagination } from "@/components/Pagination";
import { SearchHint } from "@/components/SearchHint";

import { ArticlesProvider, useArticles } from "./ArticlesContext";
import { ArticleCard } from "./components/ArticleCard";
import { EmptyArticlesState } from "./components/EmptyArticlesState";

export default function ArticlesPage() {
  return (
    <ArticlesProvider>
      <ArticlesView />
    </ArticlesProvider>
  );
}

function ArticlesView() {
  const { t } = useTranslation();
  const { results, totalCount, activeTag } = useArticles();

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <PageHeader backToUrl="/" />

      {/* Match the detail page's breadcrumb width (max-w-4xl) so the trail keeps
          the same left position when navigating from the listing into an article. */}
      <div className="max-w-4xl mx-auto px-6">
        <Breadcrumbs
          items={[
            { label: t(($) => $.common.home), href: "/" },
            { label: t(($) => $.articles.title) },
          ]}
        />
      </div>

      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex p-4 rounded-2xl bg-linear-to-br from-brand-500/10 to-brand-500/5 mb-6">
            <NewspaperIcon className="size-10 text-brand-400" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t(($) => $.articles.title)}</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            {t(($) => $.articles.description)}
          </p>
        </div>
      </section>

      <section className="px-6 pb-8">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-4">
          <SearchBox />
          <TagFilters />
          {totalCount > 0 && <SortControls />}
        </div>
      </section>

      <section className="pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          ) : (
            <EmptyArticlesState activeTag={activeTag} />
          )}
        </div>
      </section>

      <ArticlesPagination />
    </div>
  );
}

function SearchBox() {
  const { t } = useTranslation();
  const { searchInput, setSearchInput } = useArticles();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative w-full max-w-md">
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
      <input
        ref={inputRef}
        type="text"
        aria-label={`${t(($) => $.articles.title)}...`}
        placeholder={`${t(($) => $.articles.title)}...`}
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        className="w-full bg-gray-900/50 border border-gray-800 rounded-lg pl-10 pr-4 lg:pr-20 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-brand-500/50 transition-colors"
      />
      <SearchHint inputRef={inputRef} />
    </div>
  );
}

const tagClass = (active: boolean) =>
  `px-4 py-2 rounded-full text-sm transition-all duration-200 border no-underline ${
    active
      ? "bg-brand-500 text-white border-brand-500 font-medium"
      : "bg-gray-900/50 text-gray-400 border-gray-800 hover:border-brand-500/50 hover:text-white"
  }`;

function TagFilters() {
  const { t } = useTranslation();
  const { tags, activeTag, tagsToShow, canShowMoreTags, showMoreTags, setTag } = useArticles();

  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap justify-center gap-2">
      <Link
        to={`${import.meta.env.BASE_URL}articles`}
        // Opt out of Vike's link interception (which ignores preventDefault and
        // scrolls to top) so the onClick setTag (keepScrollPosition) is the only nav.
        data-vike="false"
        onClick={(e) => {
          e.preventDefault();
          setTag(null);
        }}
        className={tagClass(activeTag === null)}
      >
        {t(($) => $.cooking.all)}
      </Link>

      {tagsToShow.map((tag) => (
        <Link
          key={tag}
          to={`${import.meta.env.BASE_URL}articles?tag=${encodeURIComponent(tag)}`}
          data-vike="false"
          onClick={(e) => {
            e.preventDefault();
            setTag(tag);
          }}
          className={tagClass(tag === activeTag)}
        >
          {tag}
        </Link>
      ))}

      {canShowMoreTags && (
        <button
          type="button"
          onClick={showMoreTags}
          className="px-4 py-2 rounded-full text-sm transition-all duration-200 border no-underline bg-gray-900/50 text-brand-400 border-gray-800 hover:border-brand-500/50 hover:text-brand-300 cursor-pointer"
        >
          + {t(($) => $.common.loadMore) || "Mais"}
        </button>
      )}
    </div>
  );
}

function SortControls() {
  const { t } = useTranslation();
  const { sortBy, sortDir, toggleSort } = useArticles();

  const sortClass = (active: boolean) =>
    `px-3 py-1 rounded-full border transition-colors ${
      active
        ? "border-brand-500/50 text-brand-400 bg-brand-500/10"
        : "border-gray-800 hover:border-gray-700"
    }`;

  const arrow = (key: "date" | "title") =>
    sortBy === key ? (sortDir === "desc" ? " ↓" : " ↑") : "";

  return (
    <div className="flex items-center gap-4 text-sm text-gray-500">
      <span className="text-xs text-gray-600 uppercase tracking-wider">
        {t(($) => $.articles.sortBy)}
      </span>
      <button
        type="button"
        onClick={() => toggleSort("date")}
        className={sortClass(sortBy === "date")}
      >
        {t(($) => $.articles.sortDate)}
        {arrow("date")}
      </button>
      <button
        type="button"
        onClick={() => toggleSort("title")}
        className={sortClass(sortBy === "title")}
      >
        {t(($) => $.articles.sortTitle)}
        {arrow("title")}
      </button>
    </div>
  );
}

function ArticlesPagination() {
  const { t } = useTranslation();
  const { totalPages, currentPage, goToPage } = useArticles();

  return (
    <Pagination
      totalPages={totalPages}
      currentPage={currentPage}
      onPageChange={goToPage}
      prevLabel={t(($) => $.articles.prevPage)}
      nextLabel={t(($) => $.articles.nextPage)}
    />
  );
}
