import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useComposed } from "@indago/hyper-json/hooks";
import { GamepadIcon } from "lucide-react";

import { FilterRow } from "@/components/FilterRow";
import { Footer } from "@/components/Footer";
import { HeaderSearch } from "@/components/HeaderSearch";
import { HobbyHero } from "@/components/HobbyHero";
import { PageHeader } from "@/components/PageHeader";
import { Pagination } from "@/components/Pagination";
import { useLocale } from "@/i18n";

import { GameCard } from "./components/GameCard";
import { enGames, enGenres, ptBRGames, ptBRGenres } from "./data";

const PAGE_SIZE = 12;

export default function GamesPage() {
  const { locale } = useLocale();
  const { t } = useTranslation();
  const [activeGenre, setActiveGenre] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const isPtBR = locale.startsWith("pt");
  const games = isPtBR ? ptBRGames : enGames;
  const genres = isPtBR ? ptBRGenres : enGenres;

  const genreFilter = activeGenre !== "All" ? [{ key: "genre" as const, value: activeGenre }] : [];

  const {
    paginated: { items: filteredGames, totalPages },
  } = useComposed(games, {
    filters: genreFilter,
    searchQuery,
    searchFields: ["title", "platform", "genre", "description"],
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
            placeholder={t(($) => $.games.searchPlaceholder)}
          />
        }
      />

      <section className="pt-12 px-6">
        <HobbyHero
          icon={<GamepadIcon className="size-10 text-teal-400" />}
          iconWrapperClassName="bg-linear-to-br from-teal-500/10 to-cyan-500/5"
          title={t(($) => $.games.title)}
          description={t(($) => $.games.description)}
        />
      </section>

      <section className="px-6 pt-8 pb-8">
        <div className="max-w-7xl mx-auto flex flex-col gap-4">
          <FilterRow
            label={t(($) => $.games.genre)}
            options={genres}
            active={activeGenre}
            onSelect={(v) => {
              setActiveGenre(v);
              setPage(1);
            }}
          />
        </div>
      </section>

      {filteredGames.length > 0 ? (
        <>
          <section className="pb-20 px-6">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                {filteredGames.map((game) => (
                  <GameCard key={game.id} game={game} />
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
              <GamepadIcon className="size-8 text-gray-600" />
            </div>

            <p className="text-gray-500 text-lg mb-2">
              {games.length === 0 ? t(($) => $.games.empty) : t(($) => $.games.noResults)}
            </p>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
