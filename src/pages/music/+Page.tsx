import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useComposed } from "@indago/hyper-json/hooks";
import { Disc3Icon, Music2Icon, SearchIcon } from "lucide-react";

import { FilterRow } from "@/components/FilterRow";
import { Footer } from "@/components/Footer";
import { YouTubeMusicIcon } from "@/components/icons/YouTubeMusicIcon";
import { PageHeader } from "@/components/PageHeader";
import { Pagination } from "@/components/Pagination";
import { useLocale } from "@/i18n";

import { ChannelCard } from "./components/ChannelCard";
import { FavoriteTrack } from "./components/FavoriteTrack";
import { PlaylistCard } from "./components/PlaylistCard";
import { channels, enFavorites, enPlaylists, genres, ptBRFavorites, ptBRPlaylists } from "./data";
import { useYouTubeChannels } from "./hooks/useYouTubeChannels";

import type { Favorite } from "@indago/hyper-json";

const PAGE_SIZE = 6;

export default function MusicPage() {
  const { locale } = useLocale();
  const { t } = useTranslation();
  const [activeGenre, setActiveGenre] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [playlistPage, setPlaylistPage] = useState(1);
  const [favoritePage, setFavoritePage] = useState(1);

  const isPtBR = locale.startsWith("pt");
  const playlists = isPtBR ? ptBRPlaylists : enPlaylists;
  const favorites = isPtBR ? ptBRFavorites : enFavorites;

  const hasContent = playlists.length > 0 || favorites.length > 0;

  const genreFilter = activeGenre !== "All" ? [{ key: "genre" as const, value: activeGenre }] : [];

  const {
    paginated: { items: pagedPlaylists, totalPages: playlistPages },
  } = useComposed(playlists, {
    filters: genreFilter,
    searchQuery,
    searchFields: ["title", "description", "genre"],
    page: playlistPage,
    perPage: PAGE_SIZE,
  });

  const {
    paginated: { items: pagedFavorites, totalPages: favoritePages },
  } = useComposed(favorites, {
    filters: genreFilter,
    searchQuery,
    searchFields: ["title", "artist", "album", "genre"],
    page: favoritePage,
    perPage: PAGE_SIZE,
  });

  const { channels: resolvedChannels, loading: channelsLoading } = useYouTubeChannels(
    channels,
    locale,
  );

  const resetPages = () => {
    setPlaylistPage(1);
    setFavoritePage(1);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <PageHeader backToUrl="/" />

      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex p-4 rounded-2xl bg-linear-to-br from-violet-500/10 to-purple-500/5 mb-6">
            <Music2Icon className="size-10 text-violet-400" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t(($) => $.music.title)}</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            {t(($) => $.music.description)}
          </p>

          <div className="flex items-center justify-center mt-6">
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
                resetPages();
              }}
              className="w-full bg-gray-900/50 border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-brand-500/50 transition-colors"
            />
          </div>

          <FilterRow
            label={t(($) => $.music.genre)}
            options={genres}
            active={activeGenre}
            onSelect={(v) => {
              setActiveGenre(v);
              resetPages();
            }}
          />
        </div>
      </section>

      {hasContent ? (
        <>
          {pagedPlaylists.length > 0 && (
            <>
              <section className="pb-16 px-6">
                <div className="max-w-7xl mx-auto">
                  <h2 className="text-2xl font-bold mb-8">{t(($) => $.music.playlists)}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {pagedPlaylists.map((playlist) => (
                      <PlaylistCard key={playlist.id} playlist={playlist} />
                    ))}
                  </div>
                </div>
              </section>

              <Pagination
                totalPages={playlistPages}
                currentPage={playlistPage}
                onPageChange={setPlaylistPage}
                prevLabel={t(($) => $.cooking.prevPage)}
                nextLabel={t(($) => $.cooking.nextPage)}
              />
            </>
          )}

          {pagedFavorites.length > 0 && (
            <>
              <section className="pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                  <h2 className="text-2xl font-bold mb-8">{t(($) => $.music.favorites)}</h2>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {pagedFavorites.map((track) => (
                      <FavoriteTrack key={track.id} track={track as Favorite} />
                    ))}
                  </div>
                </div>
              </section>

              <Pagination
                totalPages={favoritePages}
                currentPage={favoritePage}
                onPageChange={setFavoritePage}
                prevLabel={t(($) => $.cooking.prevPage)}
                nextLabel={t(($) => $.cooking.nextPage)}
              />
            </>
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

      {resolvedChannels.length > 0 && (
        <section className="pb-24 px-6 border-t border-gray-900/80 pt-16">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-2">{t(($) => $.music.channels)}</h2>
            <p className="text-gray-400 text-sm mb-8 max-w-2xl">
              {t(($) => $.music.channelsDescription)}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {resolvedChannels.map((channel) => (
                <ChannelCard key={channel.id} channel={channel} loading={channelsLoading} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
