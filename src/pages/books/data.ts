import enBooksJson from "@content/books/en/books.json";
import ptBRBooksJson from "@content/books/pt-BR/books.json";

export const enBooks = enBooksJson.items;
export const ptBRBooks = ptBRBooksJson.items;

function buildGenres(books: typeof enBooks) {
  const unique = Array.from(new Set(books.map((b) => b.genre).filter(Boolean)));
  return unique.length > 0 ? ["All", ...unique] : [];
}

export const enGenres = buildGenres(enBooks);
export const ptBRGenres = buildGenres(ptBRBooks);
