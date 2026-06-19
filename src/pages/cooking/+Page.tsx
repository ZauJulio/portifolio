import { useTranslation } from "react-i18next";

import { ChefHatIcon, CookingPotIcon, SearchIcon } from "lucide-react";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Link } from "@/components/Link";
import { PageHeader } from "@/components/PageHeader";
import { Pagination } from "@/components/Pagination";

import { RecipeCard } from "./components/RecipeCard";
import { CookingProvider, useCooking } from "./CookingContext";

export default function CookingPage() {
  return (
    <CookingProvider>
      <CookingView />
    </CookingProvider>
  );
}

function CookingView() {
  const { t } = useTranslation();
  const { results } = useCooking();

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <PageHeader backToUrl="/" />

      <div className="max-w-7xl mx-auto px-6">
        <Breadcrumbs
          items={[
            { label: t(($) => $.common.home), href: "/" },
            { label: t(($) => $.cooking.title) },
          ]}
        />
      </div>

      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex p-4 rounded-2xl bg-linear-to-br from-red-500/10 to-rose-500/5 mb-6">
            <CookingPotIcon className="size-10 text-red-400" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t(($) => $.cooking.title)}</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            {t(($) => $.cooking.description)}
          </p>
        </div>
      </section>

      <section className="px-6 pb-8">
        <div className="max-w-7xl mx-auto flex flex-col gap-4">
          <SearchBox />
          <FacetFilters />
        </div>
      </section>

      <section className="pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((recipe) => (
                <RecipeCard key={recipe.slug} recipe={recipe} />
              ))}
            </div>
          ) : (
            <NoRecipes />
          )}
        </div>
      </section>

      <CookingPagination />
    </div>
  );
}

function SearchBox() {
  const { t } = useTranslation();
  const { searchInput, setSearchInput } = useCooking();

  return (
    <div className="relative max-w-md">
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
      <input
        type="text"
        aria-label={t(($) => $.cooking.searchPlaceholder)}
        placeholder={t(($) => $.cooking.searchPlaceholder)}
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        className="w-full bg-gray-900/50 border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-brand-500/50 transition-colors"
      />
    </div>
  );
}

function FacetFilters() {
  const { t } = useTranslation();
  const { filterRows, getFilterLink, setFilter } = useCooking();

  return (
    <>
      {filterRows.map(
        (row) =>
          row.options.length > 1 && (
            <div key={row.param} className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-gray-500 uppercase tracking-wider font-medium w-16 shrink-0">
                {row.label}
              </span>
              {row.options.map((opt) => (
                <Link
                  key={opt}
                  to={getFilterLink(row.param, opt)}
                  // Vike's link interceptor ignores `e.preventDefault()` and would
                  // navigate (scroll-to-top); `data-vike="false"` opts the chip out
                  // so the onClick `setFilter` (keepScrollPosition) is the only nav.
                  data-vike="false"
                  onClick={(e) => {
                    e.preventDefault();
                    setFilter(row.param, opt);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs transition-all duration-200 border no-underline ${
                    opt === row.active
                      ? "bg-brand-500 text-white border-brand-500 font-medium"
                      : "bg-gray-900/50 text-gray-400 border-gray-800 hover:border-brand-500/50 hover:text-white"
                  }`}
                >
                  {opt === "All" ? t(($) => $.cooking.all) : opt}
                </Link>
              ))}
            </div>
          ),
      )}
    </>
  );
}

function NoRecipes() {
  const { t } = useTranslation();

  return (
    <div className="text-center py-20">
      <div className="inline-flex p-4 rounded-2xl bg-gray-900/50 mb-4">
        <ChefHatIcon className="size-8 text-gray-600" />
      </div>
      <p className="text-gray-500 text-lg mb-2">{t(($) => $.cooking.noRecipesMatch)}</p>
      <p className="text-gray-600 text-sm max-w-md mx-auto">{t(($) => $.cooking.tryAdjusting)}</p>
    </div>
  );
}

function CookingPagination() {
  const { t } = useTranslation();
  const { totalPages, currentPage, goToPage } = useCooking();

  return (
    <Pagination
      totalPages={totalPages}
      currentPage={currentPage}
      onPageChange={goToPage}
      prevLabel={t(($) => $.cooking.prevPage)}
      nextLabel={t(($) => $.cooking.nextPage)}
    />
  );
}
