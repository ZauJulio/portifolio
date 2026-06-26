import enPlaylistsJson from "@content/music/en/playlists.json";
import ptBRPlaylistsJson from "@content/music/pt-BR/playlists.json";
import { render } from "vike/abort";

import type { Playlist } from "@indago/hyper-json";
import type { PageContextServer } from "vike/types";

type MusicData = { $schema: string; items: Playlist[] };

export type Data = Playlist;

export async function data({ canonical: locale, routeParams: { slug } }: PageContextServer) {
  const raw = locale.startsWith("pt") ? ptBRPlaylistsJson : enPlaylistsJson;
  const playlists = (raw as unknown as MusicData).items;
  const playlist = playlists.find((p) => p.id === slug);
  if (!playlist) throw render(404);
  return playlist;
}
