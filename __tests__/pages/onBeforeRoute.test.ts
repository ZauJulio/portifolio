import { describe, expect, it } from "vitest";

import { onBeforeRoute } from "@/pages/+onBeforeRoute";

import type { PageContext } from "vike/types";

// Regression: `urlLogical` must carry the query string, not just the pathname —
// Vike re-parses `pageContext.urlParsed` from it, so a pathname-only value
// silently drops `?q=`/`?cuisine=` and breaks every URL-driven loader. (The
// hash is deliberately not carried: it never reaches the server.)

function ctx(urlPathname: string, searchOriginal: string | null): PageContext {
  return {
    urlPathname,
    urlParsed: { searchOriginal },
  } as unknown as PageContext;
}

describe("onBeforeRoute (i18n locale-stripping)", () => {
  it("strips the /pt prefix and preserves the query string", () => {
    const { pageContext } = onBeforeRoute(ctx("/pt/cooking", "?cuisine=Italiana"));
    expect(pageContext.locale).toBe("pt");
    expect(pageContext.urlLogical).toBe("/cooking?cuisine=Italiana");
    // Region-qualified tags are derived once here and passed via pageContext.
    expect(pageContext.canonical).toBe("pt-BR");
    expect(pageContext.displayLocale).toBe("pt-BR");
  });

  it("keeps the query for the default (prefix-free) locale", () => {
    const { pageContext } = onBeforeRoute(ctx("/articles", "?q=som&sort=title"));
    expect(pageContext.locale).toBe("en");
    expect(pageContext.urlLogical).toBe("/articles?q=som&sort=title");
    // `en` is canonical `en` but its Intl display tag carries the region (`en-US`).
    expect(pageContext.canonical).toBe("en");
    expect(pageContext.displayLocale).toBe("en-US");
  });

  it("strips the prefix on detail routes (no query)", () => {
    const { pageContext } = onBeforeRoute(ctx("/pt/articles/my-post", null));
    expect(pageContext.locale).toBe("pt");
    expect(pageContext.urlLogical).toBe("/articles/my-post");
  });

  it("maps the bare /pt root to / ", () => {
    const { pageContext } = onBeforeRoute(ctx("/pt", null));
    expect(pageContext.locale).toBe("pt");
    expect(pageContext.urlLogical).toBe("/");
  });
});
