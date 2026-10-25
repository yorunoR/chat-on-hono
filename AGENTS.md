# AGENTS.md

## リポジトリ

- `api/`: Hono + Drizzle ORM + PostgreSQL の API サーバー。詳細は `api/docs/README.md` から読む。
- `chat-on-fastapi/`: git サブモジュール (別リポジトリ)。
- `containers/`, `compose.yaml`, `Makefile`, `db/init/`: 開発環境。

## 作業環境

- AI エージェントは `ai` コンテナ内で動く。DB は AI 専用の `api_ai` にのみ接続でき、`api_dev` / `api_test` には接続できない。
- `api/` の変更後は `api/` で `pnpm lint` と `pnpm type` を通す。

## ルール

- マイグレーション (`pnpm db:generate`、`drizzle/down/` の SQL) は依頼されたときだけ作る。スキーマを変更しても自分からは生成しない。
- `api/` を変更したら `api/docs/` を確認し、必要なら同じ変更内で更新する。起動手順が変わったら、ルートの `README.md` (環境変数の設定・コンテナの起動) と `api/README.md` (コンテナ起動後の手順) も更新する。
- ドキュメントには、コードを見ればわかる内容 (カラム定義、設定値、コマンド一覧など) は書き写さない。理由・意図、手順、複数ファイルにまたがる規約など、コードから読み取りにくいことだけを書く。
- コミットメッセージは `changelog.config.js` (git-cz) の形式 `{emoji}{type}: {subject}` に従う (例: `🎸 feat: messages テーブル`)。
