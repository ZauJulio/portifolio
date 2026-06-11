import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { defaultMdxComponents } from "@virtus/hyper-down";
import { describe, expect, it } from "vitest";

// The MDX component map HyperDown ships and the app renders article/recipe
// bodies with. Real rendering against happy-dom — no mocks.

const { h1: H1, p: P, strong: Strong, ul: Ul, li: Li } = defaultMdxComponents;

describe("defaultMdxComponents", () => {
  it("renders a heading with the right role and level", () => {
    render(<H1>Hello World</H1>);
    expect(screen.getByRole("heading", { level: 1, name: "Hello World" })).toBeInTheDocument();
  });

  it("renders paragraph and strong text", () => {
    render(
      <P>
        plain <Strong>bold</Strong>
      </P>,
    );
    expect(screen.getByText("plain", { exact: false })).toBeInTheDocument();
    expect(screen.getByText("bold").tagName.toLowerCase()).toBe("strong");
  });

  it("renders list items", () => {
    render(
      <Ul>
        <Li>One</Li>
        <Li>Two</Li>
      </Ul>,
    );
    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });
});
