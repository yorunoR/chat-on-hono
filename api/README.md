# api

Hono + Drizzle ORM + PostgreSQL で構成した API サーバーです。`/admin` で管理画面 (drizzle-admin) を提供します。

詳細は [docs/](./docs/README.md) を参照してください。

## 起動方法

以下はリポジトリルートで実行します。

### 1. 環境変数を設定

```sh
cp .env.api.local.sample .env.api.local
```

`.env.api.local` の `ADMIN_SECRET` に 32 文字以上のランダムな値を設定します。

```sh
openssl rand -base64 48
```

### 2. コンテナを起動

```sh
make build
make up
```

`api` コンテナで `pnpm install` と `pnpm dev` が実行され、http://localhost:3000 で起動します。

### 3. マイグレーションを適用

```sh
docker compose exec api pnpm db:migrate
```

### 4. 管理者ユーザーを作成

```sh
docker compose exec api pnpm admin:create admin@example.com
```

パスワードを入力後、http://localhost:3000/admin にメールアドレスとパスワードでログインできます。

## 動作確認

```sh
curl http://localhost:3000/health     # {"status":"ok"}
curl http://localhost:3000/health/db  # {"status":"ok"}
```
