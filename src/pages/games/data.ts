import enGamesJson from "@content/games/en/games.json";
import ptBRGamesJson from "@content/games/pt-BR/games.json";

export const enGames = enGamesJson.items;
export const ptBRGames = ptBRGamesJson.items;

function buildGenres(games: typeof enGames) {
  const unique = Array.from(new Set(games.map((g) => g.genre).filter(Boolean)));
  return unique.length > 0 ? ["All", ...unique] : [];
}

export const enGenres = buildGenres(enGames);
export const ptBRGenres = buildGenres(ptBRGames);
