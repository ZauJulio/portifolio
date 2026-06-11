import { app } from "./src/server/hono";

import type { Server } from "vike/types";

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// https://vike.dev/server
export default {
  fetch: app.fetch,
  prod: {
    port,
  },
} satisfies Server;
