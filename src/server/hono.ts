import vike from "@vikejs/hono";
import { Hono } from "hono";

// Hono host for the Vike app (https://vike.dev/hono). SSG covers most routes;
// when this server runs, Vike re-runs each page's `+data` hook server-side on
// navigation — that is the live SSR search powering the article/recipe listing
// pages before redirecting to a (prerendered) detail page.
function getApp() {
  const app = new Hono();
  vike(app);
  return app;
}

export const app = getApp();
