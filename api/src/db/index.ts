import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "../env.js";
import * as schema from "./schema/index.js";

if (!env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

export const db = drizzle(env.DATABASE_URL, { schema });
