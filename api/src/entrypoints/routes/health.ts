import { Hono } from "hono";

export const health = new Hono();

// プロセスが応答できるかだけを見る (DB には触れない)
health.get("/", (c) => c.json({ status: "ok" }));
