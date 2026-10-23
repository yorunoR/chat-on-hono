import { sql } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "../../db/index.js";

export const health = new Hono();

health.get("/db", async (c) => {
  await db.execute(sql`select 1`);
  return c.json({ status: "ok" });
});
