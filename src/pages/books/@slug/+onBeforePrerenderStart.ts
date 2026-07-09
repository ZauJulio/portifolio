import enBooksJson from "@content/books/en/books.json";

import { createPrerenderPaths } from "@/lib/subject-data";

export const onBeforePrerenderStart = createPrerenderPaths("/books", enBooksJson.items);
