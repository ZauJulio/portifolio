import enPlaylistsJson from "@content/music/en/playlists.json";
import photographyPt from "@content/photography/pt-BR/photography.json";

import { getSlugs } from "@/lib/content-slugs";

import type { Album, Playlist } from "@indago/hyper-json";

// SSG for the Portuguese (`/pt`) variants (https://vike.dev/i18n).
//
// Vike auto-prerender's the default-locale param-less SSG pages (/, /music, …) and
// the @slug pages emit their default-locale detail URLs. This hook — attached to
// a SINGLE page so it runs exactly once (a root-level global hook is inherited by
// every page and would duplicate URLs) — adds every `/pt`-prefixed URL. The
// `onBeforeRoute` locale-strip routes each back to the shared page tree.
export function onBeforePrerenderStart(): string[] {
  // The `/articles` and `/cooking` listings are SSR (`prerender: false`) in both
  // locales — the Hono server renders them on request — so they're omitted here;
  // only the SSG `/pt` pages are listed. `onBeforeRoute` locale-strip routes each back
  // to the shared page tree.
  const staticPtUrls = ["/pt", "/pt/music", "/pt/photography", "/pt/links"];

  const articlePtUrls = getSlugs("article").map((slug) => `/pt/articles/${slug}`);
  const recipePtUrls = getSlugs("recipe").map((slug) => `/pt/cooking/${slug}`);

  const ptAlbums = photographyPt.albums as Album[];
  const photographyAlbumPtUrls = ptAlbums.map((album) => `/pt/photography/${album.id}`);
  const photographyPhotoPtUrls = ptAlbums.flatMap((album) =>
    album.photos.map((photo) => `/pt/photography/${album.id}/${photo.id}`),
  );

  const enPlaylists = (enPlaylistsJson as unknown as { $schema: string; items: Playlist[] }).items;
  const musicPtUrls = enPlaylists.map((p) => `/pt/music/${p.id}`);

  return [
    ...staticPtUrls,
    ...articlePtUrls,
    ...recipePtUrls,
    ...photographyAlbumPtUrls,
    ...photographyPhotoPtUrls,
    ...musicPtUrls,
  ];
}
