import enMoviesJson from "@content/movies/en/movies.json";
import ptBRMoviesJson from "@content/movies/pt-BR/movies.json";

export const enMovies = enMoviesJson.items;
export const ptBRMovies = ptBRMoviesJson.items;

function buildGenres(movies: typeof enMovies) {
  const unique = Array.from(new Set(movies.map((m) => m.genre).filter(Boolean)));
  return unique.length > 0 ? ["All", ...unique] : [];
}

export const enGenres = buildGenres(enMovies);
export const ptBRGenres = buildGenres(ptBRMovies);
