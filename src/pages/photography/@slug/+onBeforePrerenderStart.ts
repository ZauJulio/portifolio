import photographyEn from "@content/photography/en/photography.json";

import type { Album } from "@indago/hyper-json";

export function onBeforePrerenderStart(): string[] {
  const albums = photographyEn.albums as Album[];
  return albums.map((album) => `/photography/${album.id}`);
}
