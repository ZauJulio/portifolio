import photographyEn from "@content/photography/en/photography.json";
import photographyPt from "@content/photography/pt-BR/photography.json";
import { render } from "vike/abort";

import type { Album, Photo } from "@indago/hyper-json";
import type { PageContextServer } from "vike/types";

export interface Data {
  photo: Photo;
  album: Pick<Album, "id" | "name">;
  prev: Photo | null;
  next: Photo | null;
  total: number;
  index: number;
}

export async function data({ canonical: locale, routeParams }: PageContextServer) {
  const slug = routeParams.slug as string;
  const photoId = routeParams.photoId as string;

  const lang = locale === "pt-BR" ? "pt" : "en";
  const albums = (lang === "pt" ? photographyPt.albums : photographyEn.albums) as Album[];
  const album = albums.find((a) => a.id === slug);
  if (!album) throw render(404);

  const photoIndex = album.photos.findIndex((p) => p.id === photoId);
  if (photoIndex === -1) throw render(404);

  const photo = album.photos[photoIndex] as Photo;
  const prev = photoIndex > 0 ? (album.photos[photoIndex - 1] as Photo) : null;
  const next =
    photoIndex < album.photos.length - 1 ? (album.photos[photoIndex + 1] as Photo) : null;

  return {
    photo,
    album: { id: album.id, name: album.name },
    prev,
    next,
    total: album.photos.length,
    index: photoIndex,
  };
}
