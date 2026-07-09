import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ReviewCard } from "@/pages/reviews/components/ReviewCard";

import type { ReviewMeta } from "@indago/hyper-down";

// The card reads `setTag` from ReviewsContext (tag badges patch the query)
// and `displayLocale` via `useLocale` (which needs Vike's PageContext);
// stub both so the card renders without the surrounding providers.
vi.mock("@/pages/reviews/ReviewsContext", () => ({
  useReviews: () => ({ setTag: () => {} }),
}));
vi.mock("vike-react/usePageContext", () => ({
  usePageContext: () => ({ locale: "en" }),
}));

const review = {
  slug: "placeholder-game-one-review",
  title: "Placeholder Game One: A Solid Action RPG",
  description: "Placeholder review content.",
  cover: "",
  date: "2026-06-30",
  type: "game",
  kind: "review",
  tags: ["Action RPG", "Review"],
} as unknown as ReviewMeta;

describe("ReviewCard", () => {
  it("never nests an <a> inside another <a>", () => {
    const { container } = render(<ReviewCard review={review} />);
    expect(container.querySelectorAll("a a")).toHaveLength(0);
  });

  it("renders the review title and links to its detail route", () => {
    const { container } = render(<ReviewCard review={review} />);
    const detailLink = container.querySelector('a[href*="/reviews/placeholder-game-one-review"]');
    expect(detailLink).not.toBeNull();
    expect(container.textContent).toContain("Placeholder Game One: A Solid Action RPG");
  });

  it("resolves the type badge instead of leaking a raw key path", () => {
    const { container } = render(<ReviewCard review={review} />);
    expect(container.textContent).not.toContain("type.");
  });
});
