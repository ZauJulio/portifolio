import enGamesJson from "@content/games/en/games.json";

import { createPrerenderPaths } from "@/lib/subject-data";

export const onBeforePrerenderStart = createPrerenderPaths("/games", enGamesJson.items);
