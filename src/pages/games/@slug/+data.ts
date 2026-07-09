import enGamesJson from "@content/games/en/games.json";
import ptBRGamesJson from "@content/games/pt-BR/games.json";

import { createSubjectData } from "@/lib/subject-data";

import type { ReviewMeta } from "@indago/hyper-down";
import type { Game } from "@indago/hyper-json";

export type Data = Game & { review?: ReviewMeta };

export const data = createSubjectData<Game>("game", {
  en: enGamesJson.items,
  "pt-BR": ptBRGamesJson.items,
});
