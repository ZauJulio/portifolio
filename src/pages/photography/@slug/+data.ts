import photographyEn from "@content/photography/en/photography.json";
import photographyPt from "@content/photography/pt-BR/photography.json";
import { render } from "vike/abort";

import type { Album } from "@indago/hyper-json";
import type { PageContextServer } from "vike/types";

export type Data = Album;

export async function data({ canonical: locale, routeParams: { slug } }: PageContextServer) {
  const lang = locale === "pt-BR" ? "pt" : "en";
  const albums = (lang === "pt" ? photographyPt.albums : photographyEn.albums) as Album[];
  const album = albums.find((a) => a.id === slug);
  if (!album) throw render(404);
  return album;
}
