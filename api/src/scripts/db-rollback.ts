// 最後に適用したマイグレーションを 1 つ戻す。drizzle-kit に rollback がないため、
// drizzle/down/<tag>.sql (手書き) を実行し、drizzle.__drizzle_migrations の記録を削除する。
// 使い方: pnpm db:rollback

import { existsSync, readFileSync } from "node:fs";
import { sql } from "drizzle-orm";
import { db } from "../db/index.js";

const migrationsFolder = new URL("../../drizzle/", import.meta.url);

const journal: { entries: { when: number; tag: string }[] } = JSON.parse(
  readFileSync(new URL("meta/_journal.json", migrationsFolder), "utf8"),
);

async function main(): Promise<number> {
  const { rows: exists } = await db.execute<{ regclass: string | null }>(
    sql`select to_regclass('drizzle.__drizzle_migrations')::text as regclass`,
  );
  const { rows } = exists[0]?.regclass
    ? await db.execute<{ id: number; created_at: string }>(
        sql`select id, created_at::text from drizzle.__drizzle_migrations order by created_at desc limit 1`,
      )
    : { rows: [] };
  const last = rows[0];
  if (!last) {
    console.error("適用済みのマイグレーションがありません");
    return 1;
  }

  // drizzle-kit は適用時に journal の when を created_at に記録する
  const entry = journal.entries.find((e) => e.when === Number(last.created_at));
  if (!entry) {
    console.error(
      `created_at=${last.created_at} に対応するマイグレーションが journal にありません`,
    );
    return 1;
  }

  const downFile = new URL(`down/${entry.tag}.sql`, migrationsFolder);
  if (!existsSync(downFile)) {
    console.error(`drizzle/down/${entry.tag}.sql がありません`);
    return 1;
  }
  const downSql = readFileSync(downFile, "utf8");

  await db.transaction(async (tx) => {
    await tx.execute(sql.raw(downSql));
    await tx.execute(
      sql`delete from drizzle.__drizzle_migrations where id = ${last.id}`,
    );
  });

  console.log(`rolled back  ${entry.tag}`);
  return 0;
}

try {
  process.exitCode = await main();
} finally {
  await db.$client.end();
}
