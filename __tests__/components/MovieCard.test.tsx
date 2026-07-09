import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MovieCard } from "@/pages/movies/components/MovieCard";

import type { Movie } from "@indago/hyper-json";

const movie: Movie = {
  id: "1",
  title: "Placeholder Movie One",
  cover: "/covers/movie-fallback.svg",
  kind: "movie",
  status: "watching",
  genre: "Science Fiction",
  year: 2024,
  rating: 4,
};

describe("MovieCard", () => {
  it("renders the movie title and links to its detail route", () => {
    const { container } = render(<MovieCard movie={movie} />);
    const detailLink = container.querySelector('a[href*="/movies/1"]');
    expect(detailLink).not.toBeNull();
    expect(container.textContent).toContain("Placeholder Movie One");
  });

  it("resolves the status badge for every status value", () => {
    for (const status of ["watching", "completed", "backlog", "dropped"] as const) {
      const { container, unmount } = render(<MovieCard movie={{ ...movie, status }} />);
      expect(container.textContent).not.toContain("status.");
      unmount();
    }
  });

  it("resolves the kind label for both movie and series", () => {
    for (const kind of ["movie", "series"] as const) {
      const { container, unmount } = render(<MovieCard movie={{ ...movie, kind }} />);
      expect(container.textContent).not.toContain("kind.");
      unmount();
    }
  });
});
