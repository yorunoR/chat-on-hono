import { serve } from "@hono/node-server";
import { WebSocketServer } from "ws";
import { app } from "./entrypoints/app.js";
import { env } from "./env.js";

serve(
  {
    fetch: app.fetch,
    port: env.PORT,
    websocket: { server: new WebSocketServer({ noServer: true }) },
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
