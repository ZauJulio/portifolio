import enBooksJson from "@content/books/en/books.json";
import ptBRBooksJson from "@content/books/pt-BR/books.json";

import { createSubjectData } from "@/lib/subject-data";

import type { ReviewMeta } from "@indago/hyper-down";
import type { Book } from "@indago/hyper-json";

export type Data = Book & { review?: ReviewMeta };

export const data = createSubjectData<Book>("book", {
  en: enBooksJson.items,
  "pt-BR": ptBRBooksJson.items,
});
