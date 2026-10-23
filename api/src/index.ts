import { serve } from "@hono/node-server";
import { WebSocketServer } from "ws";
import { app } from "./entrypoints/app.js";

serve(
  {
    fetch: app.fetch,
    port: 3000,
    websocket: { server: new WebSocketServer({ noServer: true }) },
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
