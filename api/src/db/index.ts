import type { NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import { drizzle } from "drizzle-orm/node-postgres";
import type { PgDatabase } from "drizzle-orm/pg-core";
import { env } from "#env.js";
import * as schema from "./schema/index.js";

if (!env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

export const db = drizzle(env.DATABASE_URL, { schema });

/** `db` とトランザクション (`tx`) のどちらも受け取れる型 */
export type Executor = PgDatabase<NodePgQueryResultHKT, typeof schema>;
