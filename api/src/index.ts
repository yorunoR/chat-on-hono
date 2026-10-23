import { serve } from "@hono/node-server";
import { sql } from "drizzle-orm";
import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { WebSocketServer } from "ws";
import { admin } from "./admin/index.js";
import { db } from "./db/index.js";
import { normalChat } from "./ws/normal-chat.js";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/health/db", async (c) => {
  await db.execute(sql`select 1`);
  return c.json({ status: "ok" });
});

// drizzle-admin はリクエストボディのサイズを制限しないため前段で制限する
app.use("/admin/*", bodyLimit({ maxSize: 1024 * 1024 }));
app.route("/admin", admin.app);

app.route("/ws/normal_chat", normalChat);

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
