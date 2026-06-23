import enChannelsJson from "@content/music/en/channels.json";
import enFavoritesJson from "@content/music/en/favorites.json";
import enPlaylistsJson from "@content/music/en/playlists.json";
import ptBRPlaylistsJson from "@content/music/pt-BR/playlists.json";

import type { Channel, Favorite, Playlist } from "@indago/hyper-json";

type MusicData<T> = { $schema: string; items: T[] };

export const enPlaylists = (enPlaylistsJson as unknown as MusicData<Playlist>).items;
export const enFavorites = (enFavoritesJson as unknown as MusicData<Favorite>).items;
export const ptBRPlaylists = (ptBRPlaylistsJson as unknown as MusicData<Playlist>).items;
export const ptBRFavorites = enFavorites;

// Channels are single-locale: only the URL is stored, name + avatar come from
// the YouTube Data API at runtime, so the same list serves both locales.
export const channels = (enChannelsJson as unknown as MusicData<Channel>).items;

const allPlaylists = [...enPlaylists, ...ptBRPlaylists];
const allFavorites = [...enFavorites, ...ptBRFavorites];

const allGenres = Array.from(
  new Set([
    ...allPlaylists.map((p) => p.genre).filter(Boolean),
    ...allFavorites.map((f) => f.genre).filter(Boolean),
  ] as string[]),
);

export const genres = allGenres.length > 0 ? ["All", ...allGenres] : [];
