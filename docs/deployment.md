# デプロイ手順（Cloudflare）

## 前提

- Cloudflare アカウント
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) ログイン済み
- **Node.js 20.18+**（本リポジトリは Wrangler `3.114.x` を使用。Wrangler 4 は Node 22 必須）

## API（Workers）

```bash
cd apps/api
pnpm deploy
```

- Workers AI が有効なアカウントであること
- `wrangler.toml` の `SCORING_MODEL` を必要に応じて変更

本番 CORS: `wrangler secret put ALLOWED_ORIGIN` で Pages の URL を設定（例 `https://english-adlib.pages.dev`）

## Web（Pages）

1. Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect Git
2. ビルド設定:
   - **Root directory**: `apps/web`
   - **Build command**: `pnpm install && pnpm build`
   - **Build output**: `dist`
3. 環境変数:
   - `VITE_API_BASE_URL` = Worker の URL（末尾スラッシュなし）

## ローカル開発

ターミナル1:

```bash
pnpm install
pnpm dev:api
```

ターミナル2:

```bash
pnpm dev:web
```

- Web: http://localhost:5173
- API: http://127.0.0.1:8787（Vite プロキシ経由で `/api`）

## Neuron 使用量

採点1回あたりおおよそ 15〜25 Neurons（モデル・回答長による）。無料枠 10,000 Neurons/日。詳細は [ADR-0004](./adr/0004-llm-and-scoring.md)。

## CI / デプロイ（GitHub Actions）

`main` への push で `.github/workflows/ci.yml` が実行されます。

### 必要な Secrets

| Secret | 用途 |
|--------|------|
| `CLOUDFLARE_API_TOKEN` | Workers / Pages デプロイ |
| `CLOUDFLARE_ACCOUNT_ID` | アカウント ID |
| `VITE_API_BASE_URL` | 本番 Web から参照する Worker URL |

### ローカル E2E

```bash
pnpm test:e2e
```

（Vite dev server を自動起動し、API は Playwright でモック）
