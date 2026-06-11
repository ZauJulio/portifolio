import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useComposed } from "@virtus/hyper-json/hooks";
import {
  ArrowLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Disc3Icon,
  Music2Icon,
  SearchIcon,
} from "lucide-react";

import { YouTubeMusicIcon } from "@/components/icons/YouTubeMusicIcon";
import { Link } from "@/components/Link";
import { useLocale } from "@/i18n";

import { FavoriteTrack } from "./components/FavoriteTrack";
import { FilterRow } from "./components/FilterRow";
import { PlaylistCard } from "./components/PlaylistCard";
import { PlaylistModal } from "./components/PlaylistModal";
import { enFavorites, enPlaylists, genres, ptBRFavorites, ptBRPlaylists } from "./data";

import type { Playlist } from "@virtus/hyper-json";
import type { Favorite } from "@virtus/hyper-json";

const PAGE_SIZE = 6;

export default function MusicPage() {
  const { locale } = useLocale();
  const { t } = useTranslation();
  const [activeGenre, setActiveGenre] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);

  const isPtBR = locale.startsWith("pt");
  const playlists = isPtBR ? ptBRPlaylists : enPlaylists;
  const favorites = isPtBR ? ptBRFavorites : enFavorites;

  const hasContent = playlists.length > 0 || favorites.length > 0;

  const genreFilter = activeGenre !== "All" ? [{ key: "genre" as const, value: activeGenre }] : [];

  const {
    paginated: { items: pagedPlaylists },
  } = useComposed(playlists, {
    filters: genreFilter,
    searchQuery,
    searchFields: ["title", "description", "genre"],
  });

  const {
    paginated: { items: pagedFavorites, totalPages: favPages, page: favPage },
  } = useComposed(favorites, {
    filters: genreFilter,
    searchQuery,
    searchFields: ["title", "artist", "album", "genre"],
    page: page,
    perPage: PAGE_SIZE,
  });

  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(favPages, p + 1));

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-brand-300 transition-colors no-underline text-sm"
          >
            <ArrowLeftIcon className="size-4" />
            {t(($) => $.common.backToPortfolio)}
          </Link>

          <div className="flex items-center gap-2">
            <Music2Icon className="size-5 text-violet-400" />
            <span className="font-semibold text-white">{t(($) => $.music.title)}</span>
          </div>
        </div>
      </header>

      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex p-4 rounded-2xl bg-linear-to-br from-violet-500/10 to-purple-500/5 mb-6">
            <Music2Icon className="size-10 text-violet-400" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t(($) => $.music.title)}</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            {t(($) => $.music.description)}
          </p>

          <div className="flex items-center justify-center gap-4 mt-6">
            <span className="inline-flex items-center gap-1.5 text-sm text-red-400 bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/20">
              <YouTubeMusicIcon className="size-4" /> YouTube Music
            </span>
          </div>
        </div>
      </section>

      <section className="px-6 pb-8">
        <div className="max-w-7xl mx-auto flex flex-col gap-4">
          <div className="relative max-w-md">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
            <input
              type="text"
              aria-label={t(($) => $.music.searchPlaceholder)}
              placeholder={t(($) => $.music.searchPlaceholder)}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full bg-gray-900/50 border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-brand-500/50 transition-colors"
            />
          </div>

          {genres.length > 1 && (
            <FilterRow
              label={t(($) => $.music.genre)}
              options={genres}
              active={activeGenre}
              onSelect={(v) => {
                setActiveGenre(v);
                setPage(1);
              }}
            />
          )}
        </div>
      </section>

      {hasContent ? (
        <>
          {pagedPlaylists.length > 0 && (
            <section className="pb-16 px-6">
              <div className="max-w-7xl mx-auto">
                <h2 className="text-2xl font-bold mb-8">{t(($) => $.music.playlists)}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pagedPlaylists.map((playlist) => (
                    <PlaylistCard
                      key={playlist.id}
                      playlist={playlist}
                      onClick={() => setSelectedPlaylist(playlist)}
                    />
                  ))}
                </div>
              </div>
            </section>
          )}

          {pagedFavorites.length > 0 && (
            <section className="pb-20 px-6">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold mb-8">{t(($) => $.music.favorites)}</h2>
                <div className="space-y-3">
                  {pagedFavorites.map((track) => (
                    <FavoriteTrack key={track.id} track={track as Favorite} />
                  ))}
                </div>
              </div>

              {favPages > 1 && (
                <div className="max-w-4xl mx-auto mt-8 flex items-center justify-center gap-4">
                  <button
                    type="button"
                    disabled={favPage <= 1}
                    onClick={handlePrev}
                    className="inline-flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-800 text-sm text-gray-400 hover:text-white hover:border-gray-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeftIcon className="size-4" />
                    {t(($) => $.cooking.prevPage)}
                  </button>

                  <div className="flex items-center gap-2">
                    {Array.from({ length: favPages }, (_, i) => i + 1).map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setPage(n)}
                        className={`size-8 rounded-lg text-sm transition-colors ${
                          n === favPage
                            ? "bg-brand-500 text-white"
                            : "text-gray-500 hover:text-white hover:bg-gray-800"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    disabled={favPage >= favPages}
                    onClick={handleNext}
                    className="inline-flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-800 text-sm text-gray-400 hover:text-white hover:border-gray-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {t(($) => $.cooking.nextPage)}
                    <ChevronRightIcon className="size-4" />
                  </button>
                </div>
              )}
            </section>
          )}

          {pagedPlaylists.length === 0 && pagedFavorites.length === 0 && (
            <section className="pb-20 px-6">
              <div className="text-center py-12">
                <div className="inline-flex p-4 rounded-2xl bg-gray-900/50 mb-4">
                  <Disc3Icon className="size-8 text-gray-600" />
                </div>
                <p className="text-gray-500 text-lg mb-2">{t(($) => $.music.noResults)}</p>
              </div>
            </section>
          )}
        </>
      ) : (
        <section className="pb-20 px-6">
          <div className="text-center py-12">
            <div className="inline-flex p-4 rounded-2xl bg-gray-900/50 mb-4">
              <Disc3Icon className="size-8 text-gray-600" />
            </div>
            <p className="text-gray-500 text-lg mb-2">{t(($) => $.music.empty)}</p>
          </div>
        </section>
      )}

      {selectedPlaylist && (
        <PlaylistModal playlist={selectedPlaylist} onClose={() => setSelectedPlaylist(null)} />
      )}
    </div>
  );
}
