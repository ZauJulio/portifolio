import { reviewRepository } from "@hyper-down/content/review/builder";
import { render } from "vike/abort";

import { enBooks, ptBRBooks } from "@/pages/books/data";
import { enGames, ptBRGames } from "@/pages/games/data";
import { enMovies, ptBRMovies } from "@/pages/movies/data";
import { enFavorites, ptBRFavorites } from "@/pages/music/data";

import type { Book, Favorite, Game, Movie } from "@indago/hyper-json";
import type { PageContextServer } from "vike/types";

export type Data = Awaited<ReturnType<typeof data>>;
export type Subject =
  | { kind: "game"; item: Game }
  | { kind: "book"; item: Book }
  | { kind: "music"; item: Favorite }
  | { kind: "movie"; item: Movie };

function findSubject(
  locale: string,
  type: string | undefined,
  subjectId: string | undefined,
): Subject | undefined {
  if (!type || !subjectId) return undefined;

  if (type === "game") {
    const item = (locale.startsWith("pt") ? ptBRGames : enGames).find((g) => g.id === subjectId);
    return item ? { kind: "game", item } : undefined;
  }

  if (type === "book") {
    const item = (locale.startsWith("pt") ? ptBRBooks : enBooks).find((b) => b.id === subjectId);
    return item ? { kind: "book", item } : undefined;
  }

  if (type === "music") {
    const item = (locale.startsWith("pt") ? ptBRFavorites : enFavorites).find(
      (f) => f.id === subjectId,
    );
    return item ? { kind: "music", item } : undefined;
  }

  if (type === "movie") {
    const item = (locale.startsWith("pt") ? ptBRMovies : enMovies).find((m) => m.id === subjectId);
    return item ? { kind: "movie", item } : undefined;
  }

  // `other` has no backing HyperJson collection — MDX-only, no subject card.
  return undefined;
}

/**
 * SSR/SSG: review metadata for the detail page (MDX body resolved in the view),
 * plus up to three tag-ranked suggestions and the HyperJson subject card data
 * (resolved from `type` + `subjectId` against the games/books/music/movies collections).
 */
export async function data({ canonical: locale, routeParams: { slug } }: PageContextServer) {
  // `canonical` is the DB tag (`en`/`pt-BR`); the app `locale` (`en`/`pt`) never
  // matches `pt-BR` rows -- it would always fall back to English on /pt.
  const review = await reviewRepository.getMetaBySlug(slug, locale);
  if (!review) throw render(404);

  const related = review.tags?.length
    ? await reviewRepository.related({ slug: review.slug, tags: review.tags, locale, limit: 3 })
    : [];

  const subject = findSubject(locale, review.type, review.subjectId);

  return { ...review, related, subject };
}
