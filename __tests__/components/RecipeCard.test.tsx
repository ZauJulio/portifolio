import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { RecipeCard } from "@/pages/cooking/components/RecipeCard";

import type { RecipeMeta } from "@indago/hyper-down";

// The card reads `setFilter` from CookingContext (facet badges patch the query);
// stub it so the card renders without the Vike-backed provider.
vi.mock("@/pages/cooking/CookingContext", () => ({
  useCooking: () => ({ setFilter: () => {} }),
}));

// Regression: the card once wrapped the whole tile in a <Link> AND nested
// facet <Link>s inside it — invalid `<a>`-in-`<a>` markup that broke hydration
// on /cooking. Vike's <Link> renders a plain <a> (clicks are intercepted by the
// client router), so no router provider is needed.

const recipe = {
  slug: "slow-fermentation-pizza",
  title: "Slow Fermentation Pizza",
  description: "A 48h cold-fermented Neapolitan dough.",
  cover: "/cover.jpg",
  cuisine: "Italian",
  mealType: "Dinner",
  courseType: "Main",
  prepTime: "30m",
  servings: 4,
  tags: ["pizza", "dough"],
} as unknown as RecipeMeta;

describe("RecipeCard", () => {
  it("never nests an <a> inside another <a>", () => {
    const { container } = render(<RecipeCard recipe={recipe} />);
    expect(container.querySelectorAll("a a")).toHaveLength(0);
  });

  it("renders the recipe title and links to its detail route", () => {
    const { container } = render(<RecipeCard recipe={recipe} />);
    const detailLink = container.querySelector('a[href*="/cooking/slow-fermentation-pizza"]');
    expect(detailLink).not.toBeNull();
    expect(container.textContent).toContain("Slow Fermentation Pizza");
  });
});
