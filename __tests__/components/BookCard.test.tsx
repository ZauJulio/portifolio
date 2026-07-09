import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { BookCard } from "@/pages/books/components/BookCard";

import type { Book } from "@indago/hyper-json";

const book: Book = {
  id: "1",
  title: "Placeholder Book One",
  author: "Jane Doe",
  cover: "/covers/book-fallback.svg",
  status: "reading",
  genre: "Fiction",
  rating: 4,
};

describe("BookCard", () => {
  it("renders the book title and links to its detail route", () => {
    const { container } = render(<BookCard book={book} />);
    const detailLink = container.querySelector('a[href*="/books/1"]');
    expect(detailLink).not.toBeNull();
    expect(container.textContent).toContain("Placeholder Book One");
  });

  it("resolves the status badge for every status value", () => {
    for (const status of ["reading", "finished", "want-to-read", "dropped"] as const) {
      const { container, unmount } = render(<BookCard book={{ ...book, status }} />);
      expect(container.textContent).not.toContain("status.");
      unmount();
    }
  });
});
