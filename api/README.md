# api

Hono + Drizzle ORM + PostgreSQL で構成した API サーバーです。`/admin` で管理画面 (drizzle-admin) を提供します。

詳細は [docs/](./docs/README.md) を参照してください。

## 起動方法

環境変数の設定とコンテナの起動は、リポジトリルートの [README.md](../README.md) を参照してください。以下はコンテナの起動後に、リポジトリルートで実行します。

### 1. マイグレーションを適用

```sh
docker compose exec api pnpm db:migrate
```

### 2. 管理者ユーザーを作成

```sh
docker compose exec api pnpm admin:create admin@example.com
```

パスワードを入力後、http://localhost:3000/admin にメールアドレスとパスワードでログインできます。

## 動作確認

### ヘルスチェック

```sh
curl http://localhost:3000/health     # {"status":"ok"}
curl http://localhost:3000/health/db  # {"status":"ok"}
```

### チャット

チャットセッションを作成し、表示された `uid` を指定してメッセージを送ります (`OPENAI_API_KEY` が必要)。ユーザーがいなければ同時に作成されます。

```sh
docker compose exec api pnpm session:create user@example.com テスト
# chat session created: id=1 uid=<uid> ...
docker compose exec api pnpm session:normal-chat <uid> こんにちは
```

回答は分割して届き、受信したメッセージ (`recv: {"message":{...}}`) が順に表示されます。`{"done":true}` を受け取ると切断して終了します。
