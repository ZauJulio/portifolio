import enMoviesJson from "@content/movies/en/movies.json";
import ptBRMoviesJson from "@content/movies/pt-BR/movies.json";

import { createSubjectData } from "@/lib/subject-data";

import type { ReviewMeta } from "@indago/hyper-down";
import type { Movie } from "@indago/hyper-json";

export type Data = Movie & { review?: ReviewMeta };

export const data = createSubjectData<Movie>("movie", {
  en: enMoviesJson.items,
  "pt-BR": ptBRMoviesJson.items,
});
