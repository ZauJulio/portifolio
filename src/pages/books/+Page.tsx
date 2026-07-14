import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useComposed } from "@indago/hyper-json/hooks";
import { BookOpenIcon } from "lucide-react";

import { FilterRow } from "@/components/FilterRow";
import { HeaderSearch } from "@/components/HeaderSearch";
import { HobbyHero } from "@/components/HobbyHero";
import { PageHeader } from "@/components/PageHeader";
import { Pagination } from "@/components/Pagination";
import { useLocale } from "@/i18n";

import { BookCard } from "./components/BookCard";
import { enBooks, enGenres, ptBRBooks, ptBRGenres } from "./data";

const PAGE_SIZE = 12;

export default function BooksPage() {
  const { locale } = useLocale();
  const { t } = useTranslation();
  const [activeGenre, setActiveGenre] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const isPtBR = locale.startsWith("pt");
  const books = isPtBR ? ptBRBooks : enBooks;
  const genres = isPtBR ? ptBRGenres : enGenres;

  const genreFilter = activeGenre !== "All" ? [{ key: "genre" as const, value: activeGenre }] : [];

  const {
    paginated: { items: filteredBooks, totalPages },
  } = useComposed(books, {
    filters: genreFilter,
    searchQuery,
    searchFields: ["title", "author", "genre", "description"],
    page,
    perPage: PAGE_SIZE,
  });

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <PageHeader
        backToUrl="/"
        centerElement={
          <HeaderSearch
            value={searchQuery}
            onChange={(v) => {
              setSearchQuery(v);
              setPage(1);
            }}
            placeholder={t(($) => $.books.searchPlaceholder)}
          />
        }
      />

      <section className="pt-12 px-6">
        <HobbyHero
          icon={<BookOpenIcon className="size-10 text-amber-400" />}
          iconWrapperClassName="bg-linear-to-br from-amber-500/10 to-orange-500/5"
          title={t(($) => $.books.title)}
          description={t(($) => $.books.description)}
        />
      </section>

      <section className="px-6 pt-8 pb-8">
        <div className="max-w-7xl mx-auto flex flex-col gap-4">
          <FilterRow
            label={t(($) => $.books.genre)}
            options={genres}
            active={activeGenre}
            onSelect={(v) => {
              setActiveGenre(v);
              setPage(1);
            }}
          />
        </div>
      </section>

      {filteredBooks.length > 0 ? (
        <>
          <section className="pb-20 px-6">
            <div className="max-w-7xl mx-auto">
              <div className="hobby-grid grid items-start grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-4">
                {filteredBooks.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            </div>
          </section>

          <Pagination
            totalPages={totalPages}
            currentPage={page}
            onPageChange={setPage}
            prevLabel={t(($) => $.cooking.prevPage)}
            nextLabel={t(($) => $.cooking.nextPage)}
          />
        </>
      ) : (
        <section className="pb-20 px-6">
          <div className="text-center py-12">
            <div className="inline-flex p-4 rounded-2xl bg-gray-900/50 mb-4">
              <BookOpenIcon className="size-8 text-gray-600" />
            </div>

            <p className="text-gray-500 text-lg mb-2">
              {books.length === 0 ? t(($) => $.books.empty) : t(($) => $.books.noResults)}
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
