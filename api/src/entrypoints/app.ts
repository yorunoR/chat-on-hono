import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { admin } from "../admin/index.js";
import { health } from "./routes/health.js";
import { normalChat } from "./routes/normal-chat.js";
import { root } from "./routes/root.js";

export const app = new Hono();

// drizzle-admin はリクエストボディのサイズを制限しないため前段で制限する
app.use("/admin/*", bodyLimit({ maxSize: 1024 * 1024 }));
app.route("/admin", admin.app);

app.route("/", root);
app.route("/health", health);
app.route("/ws/normal_chat", normalChat);
