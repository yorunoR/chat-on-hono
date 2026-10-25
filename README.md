# chat-on-hono

Hono + Drizzle ORM + PostgreSQL で構成したチャットサービスの API サーバーです。

- `api/`: API サーバー。詳細は [api/README.md](./api/README.md) と [api/docs/](./api/docs/README.md) を参照してください。
- `web/`: チャットのフロントエンド (Vue)。詳細は [web/README.md](./web/README.md) を参照してください。
- `chat-on-fastapi/`: 参照用のリポジトリ (git サブモジュール)。
- `containers/`, `compose.yaml`, `Makefile`, `db/init/`: Docker Compose による開発環境。

開発環境は `api` (API サーバー)、`web` (フロントエンド)、`db` (PostgreSQL)、`ai` (AI エージェント作業用) の 4 つのコンテナで構成されます。AI エージェントは `ai` コンテナ内で動き、専用の DB (`api_ai`) にのみ接続します。

## 起動方法

以下はリポジトリルートで実行します。

### 1. サブモジュールを取得

```sh
git submodule update --init
```

### 2. 環境変数を設定

```sh
cp .env.api.local.sample .env.api.local
cp .env.ai.local.sample .env.ai.local
```

- `.env.api.local` の `ADMIN_SECRET` に 32 文字以上のランダムな値 (例: `openssl rand -base64 48`) を設定します。
- チャットを使う場合は、`.env.api.local` の `OPENAI_API_KEY` を設定します。
- AI エージェントを API キーで使う場合は、`.env.ai.local` の `ANTHROPIC_API_KEY` を設定します。

### 3. コンテナを起動

```sh
make build
make up
```

`api` コンテナで `pnpm install` と `pnpm dev` が実行され、http://localhost:3000 で API サーバーが起動します。続けて [api/README.md](./api/README.md) の手順でマイグレーションの適用と管理者ユーザーの作成を行います。

`web` コンテナでも `pnpm install` と `pnpm dev` が実行され、http://localhost:5173 でフロントエンドが開きます。使い方は [web/README.md](./web/README.md) を参照してください。

### 4. AI エージェントを使う

別のターミナルで実行します。

```sh
make cl  # ai コンテナで Claude Code を起動
make b   # ai コンテナのシェルに入る
```

`docker compose` を直接使う場合は、`Makefile` と同様に `HOST_UID` / `HOST_GID` を export してください。
