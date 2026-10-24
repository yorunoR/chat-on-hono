import { sql } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "../../db/index.js";

export const healthDb = new Hono();

// DB に接続できるかを見る
healthDb.get("/", async (c) => {
  await db.execute(sql`select 1`);
  return c.json({ status: "ok" });
});
