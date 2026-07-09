import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useComposed } from "@indago/hyper-json/hooks";
import { ClapperboardIcon } from "lucide-react";

import { FilterRow } from "@/components/FilterRow";
import { Footer } from "@/components/Footer";
import { HeaderSearch } from "@/components/HeaderSearch";
import { HobbyHero } from "@/components/HobbyHero";
import { PageHeader } from "@/components/PageHeader";
import { Pagination } from "@/components/Pagination";
import { useLocale } from "@/i18n";

import { MovieCard } from "./components/MovieCard";
import { enGenres, enMovies, ptBRGenres, ptBRMovies } from "./data";

const kinds = ["All", "movie", "series", "anime"] as const;
const PAGE_SIZE = 12;

export default function MoviesPage() {
  const { locale } = useLocale();
  const { t } = useTranslation();
  const [activeGenre, setActiveGenre] = useState("All");
  const [activeKind, setActiveKind] = useState<(typeof kinds)[number]>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const isPtBR = locale.startsWith("pt");
  const movies = isPtBR ? ptBRMovies : enMovies;
  const genres = isPtBR ? ptBRGenres : enGenres;

  const filters = [
    ...(activeGenre !== "All" ? [{ key: "genre" as const, value: activeGenre }] : []),
    ...(activeKind !== "All" ? [{ key: "kind" as const, value: activeKind }] : []),
  ];

  const {
    paginated: { items: filteredMovies, totalPages },
  } = useComposed(movies, {
    filters,
    searchQuery,
    searchFields: ["title", "genre", "description"],
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
            placeholder={t(($) => $.movies.searchPlaceholder)}
          />
        }
      />

      <section className="pt-12 px-6">
        <HobbyHero
          icon={<ClapperboardIcon className="size-10 text-violet-400" />}
          iconWrapperClassName="bg-linear-to-br from-violet-500/10 to-purple-500/5"
          title={t(($) => $.movies.title)}
          description={t(($) => $.movies.description)}
        />
      </section>

      <section className="px-6 pt-8 pb-8">
        <div className="max-w-7xl mx-auto flex flex-col gap-4">
          <FilterRow
            label={t(($) => $.movies.type)}
            options={[...kinds]}
            active={activeKind}
            onSelect={(v) => {
              setActiveKind(v as (typeof kinds)[number]);
              setPage(1);
            }}
            getLabel={(opt) =>
              opt === "All"
                ? t(($) => $.common.all)
                : t(($) => $.movies.kind[opt as "movie" | "series" | "anime"])
            }
          />

          <FilterRow
            label={t(($) => $.movies.genre)}
            options={genres}
            active={activeGenre}
            onSelect={(v) => {
              setActiveGenre(v);
              setPage(1);
            }}
          />
        </div>
      </section>

      {filteredMovies.length > 0 ? (
        <>
          <section className="pb-20 px-6">
            <div className="max-w-7xl mx-auto">
              <div className="hobby-grid grid items-start grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-4">
                {filteredMovies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
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
              <ClapperboardIcon className="size-8 text-gray-600" />
            </div>
            <p className="text-gray-500 text-lg mb-2">
              {movies.length === 0 ? t(($) => $.movies.empty) : t(($) => $.movies.noResults)}
            </p>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
