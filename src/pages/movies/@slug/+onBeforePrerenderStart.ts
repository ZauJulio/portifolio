import enMoviesJson from "@content/movies/en/movies.json";

import { createPrerenderPaths } from "@/lib/subject-data";

export const onBeforePrerenderStart = createPrerenderPaths("/movies", enMoviesJson.items);
