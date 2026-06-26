import enPlaylistsJson from "@content/music/en/playlists.json";

import type { Playlist } from "@indago/hyper-json";

type MusicData = { $schema: string; items: Playlist[] };

export function onBeforePrerenderStart(): string[] {
  const playlists = (enPlaylistsJson as unknown as MusicData).items;
  return playlists.map((p) => `/music/${p.id}`);
}
