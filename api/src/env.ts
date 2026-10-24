// アプリが読む環境変数の一覧 (drizzle.config.ts は drizzle-kit が単独で読み込むため除く)。
// 必須チェックは使う側で行う (DB だけを使うスクリプトが ADMIN_SECRET を要求しないように)。
export const env = {
  DATABASE_URL: process.env.DATABASE_URL,
  ADMIN_SECRET: process.env.ADMIN_SECRET,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  PORT: Number(process.env.PORT ?? 3000),
  SAVE_PROMPT_TEMPLATE:
    process.env.SAVE_PROMPT_TEMPLATE?.toLowerCase() === "true",
  WS_TIMEOUT_SECONDS: Number(process.env.WS_TIMEOUT_SECONDS ?? 300),
  BACKGROUND_TASK_SHUTDOWN_TIMEOUT_SECONDS: Number(
    process.env.BACKGROUND_TASK_SHUTDOWN_TIMEOUT_SECONDS ?? 30,
  ),
};
