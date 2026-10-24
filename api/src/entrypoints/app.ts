import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";
import { admin } from "../admin/index.js";
import { health } from "./routes/health.js";
import { healthDb } from "./routes/health-db.js";
import { normalChat } from "./routes/normal-chat.js";

export const app = new Hono();

app.use(logger());

// 想定外のエラーはログに残し、詳細をクライアントに返さない
app.onError((err, c) => {
  if (err instanceof HTTPException) return err.getResponse();
  console.error(err);
  return c.json({ error: "Internal Server Error" }, 500);
});

// drizzle-admin はリクエストボディのサイズを制限しないため前段で制限する
app.use("/admin/*", bodyLimit({ maxSize: 1024 * 1024 }));
app.route("/admin", admin.app);

app.route("/health", health);
app.route("/health/db", healthDb);
app.route("/ws/normal_chat", normalChat);
