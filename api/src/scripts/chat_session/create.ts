// ChatSession を作成する。指定したメールアドレスのユーザーがいなければ作成する。
// uid はランダムな UUID を割り当てる。
// 使い方: pnpm session:create <email> <label> [initialMessage]

import { randomUUID } from "node:crypto";
import { db } from "#db/index.js";
import { chatSessions, users } from "#db/schema/index.js";

async function main(): Promise<number> {
  const [rawEmail, rawLabel, initialMessage] = process.argv.slice(2);
  const email = rawEmail?.trim();
  const label = rawLabel?.trim();

  if (!email || !/^[^\s@]+@[^\s@]+$/.test(email) || !label) {
    console.error(
      "Usage: pnpm session:create <email> <label> [initialMessage]",
    );
    return 1;
  }

  const session = await db.transaction(async (tx) => {
    // 既存ユーザーでも id を返すため、何もしない更新で conflict を処理する
    const [user] = await tx
      .insert(users)
      .values({ email })
      .onConflictDoUpdate({ target: users.email, set: { email } })
      .returning({ id: users.id });
    if (!user) throw new Error(`ユーザーを取得できませんでした: ${email}`);

    const [created] = await tx
      .insert(chatSessions)
      .values({ userId: user.id, label, uid: randomUUID(), initialMessage })
      .returning({
        id: chatSessions.id,
        uid: chatSessions.uid,
        userId: chatSessions.userId,
      });
    return created;
  });

  console.log(
    `chat session created: id=${session?.id} uid=${session?.uid} user_id=${session?.userId} email=${email}`,
  );
  return 0;
}

try {
  process.exitCode = await main();
} finally {
  await db.$client.end();
}
