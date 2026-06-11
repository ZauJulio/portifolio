import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Link } from "@/components/Link";

// The locale-aware <Link>: it prepends the active locale's URL prefix for the
// non-default locale and leaves the default locale prefix-free. Rendered in
// isolation (no Vike provider), the `locale` prop drives the behavior.

describe("Link", () => {
  it("prefixes /pt for the pt locale", () => {
    const { container } = render(
      <Link to="/articles" locale="pt">
        Artigos
      </Link>,
    );
    expect(container.querySelector("a")?.getAttribute("href")).toBe("/pt/articles");
  });

  it("leaves the default (en) locale prefix-free", () => {
    const { container } = render(
      <Link to="/articles" locale="en">
        Articles
      </Link>,
    );
    expect(container.querySelector("a")?.getAttribute("href")).toBe("/articles");
  });

  it("forwards arbitrary anchor props", () => {
    const { container } = render(
      <Link to="/x" locale="en" className="nav" aria-label="x">
        x
      </Link>,
    );
    const a = container.querySelector("a");
    expect(a?.className).toBe("nav");
    expect(a?.getAttribute("aria-label")).toBe("x");
  });
});
