// マイグレーションの適用状況を表示する。drizzle-kit に status コマンドがないため、
// drizzle/meta/_journal.json と DB の drizzle.__drizzle_migrations を突き合わせる。
// 使い方: pnpm db:status

import { readFileSync } from "node:fs";
import { sql } from "drizzle-orm";
import { db } from "#db/index.js";

const journal: { entries: { when: number; tag: string }[] } = JSON.parse(
  readFileSync(
    new URL("../../../drizzle/meta/_journal.json", import.meta.url),
    "utf8",
  ),
);

async function fetchAppliedWhens(): Promise<Set<number>> {
  // 一度もマイグレーションしていない DB には記録用テーブルがない
  const { rows: exists } = await db.execute<{ regclass: string | null }>(
    sql`select to_regclass('drizzle.__drizzle_migrations')::text as regclass`,
  );
  if (!exists[0]?.regclass) return new Set();
  const { rows } = await db.execute<{ created_at: string }>(
    sql`select created_at::text from drizzle.__drizzle_migrations`,
  );
  return new Set(rows.map((r) => Number(r.created_at)));
}

try {
  // drizzle-kit は適用時に journal の when を created_at に記録する
  const applied = await fetchAppliedWhens();
  for (const { when, tag } of journal.entries) {
    console.log(`${applied.has(when) ? "applied" : "pending"}  ${tag}`);
  }
} finally {
  await db.$client.end();
}
