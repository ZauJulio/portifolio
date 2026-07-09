import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { Subject } from "@/pages/reviews/@slug/+data";
import { SubjectCard } from "@/pages/reviews/@slug/components/SubjectCard";

describe("SubjectCard", () => {
  it("renders a game subject linking to its games detail route", () => {
    const subject: Subject = {
      kind: "game",
      item: {
        id: "1",
        title: "Placeholder Game One",
        cover: "/covers/game-fallback.svg",
        status: "playing",
        platform: "PC",
        genre: "Action RPG",
        rating: 4,
      },
    };

    const { container } = render(<SubjectCard subject={subject} />);
    expect(container.querySelector('a[href*="/games/1"]')).not.toBeNull();
    expect(container.textContent).toContain("Placeholder Game One");
    expect(container.textContent).toContain("PC");
    expect(container.textContent).toContain("4 / 5");
  });

  it("renders a book subject linking to its books detail route", () => {
    const subject: Subject = {
      kind: "book",
      item: {
        id: "1",
        title: "Placeholder Book One",
        cover: "/covers/book-fallback.svg",
        status: "reading",
        author: "Jane Doe",
        genre: "Fiction",
      },
    };

    const { container } = render(<SubjectCard subject={subject} />);
    expect(container.querySelector('a[href*="/books/1"]')).not.toBeNull();
    expect(container.textContent).toContain("Jane Doe");
  });

  it("renders a movie subject linking to its movies detail route", () => {
    const subject: Subject = {
      kind: "movie",
      item: {
        id: "1",
        title: "Placeholder Movie One",
        cover: "/covers/movie-fallback.svg",
        kind: "movie",
        status: "watching",
        genre: "Science Fiction",
        year: 2024,
        rating: 4.5,
      },
    };

    const { container } = render(<SubjectCard subject={subject} />);
    expect(container.querySelector('a[href*="/movies/1"]')).not.toBeNull();
    expect(container.textContent).toContain("Placeholder Movie One");
    expect(container.textContent).toContain("2024");
    expect(container.textContent).toContain("4.5 / 5");
  });

  it("renders a music subject without a rating line", () => {
    const subject: Subject = {
      kind: "music",
      item: {
        id: "1",
        title: "Shinunoga E-Wa",
        artist: "Fujii Kaze",
        genre: "J-Pop / J-Rock",
        youtubeId: "3zh9Wb1KuW8",
      },
    };

    const { container } = render(<SubjectCard subject={subject} />);
    expect(container.textContent).toContain("Fujii Kaze");
    expect(container.textContent).not.toContain("/ 5");
  });
});
