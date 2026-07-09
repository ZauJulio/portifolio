import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { GameCard } from "@/pages/games/components/GameCard";

import type { Game } from "@indago/hyper-json";

const game: Game = {
  id: "1",
  title: "Placeholder Game One",
  cover: "/covers/game-fallback.svg",
  status: "playing",
  platform: "PC",
  genre: "Action RPG",
  rating: 4,
};

describe("GameCard", () => {
  it("renders the game title and links to its detail route", () => {
    const { container } = render(<GameCard game={game} />);
    const detailLink = container.querySelector('a[href*="/games/1"]');
    expect(detailLink).not.toBeNull();
    expect(container.textContent).toContain("Placeholder Game One");
  });

  it("resolves the status badge for every status value", () => {
    for (const status of ["playing", "completed", "backlog", "dropped"] as const) {
      const { container, unmount } = render(<GameCard game={{ ...game, status }} />);
      expect(container.textContent).not.toContain("status.");
      unmount();
    }
  });
});
