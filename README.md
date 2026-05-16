# 英会話アドリブドリル (ENGLISH AD-LIB DRILL)

お題に沿って英語でアドリブ回答し、AI が採点する Web トレーニングアプリ。

## ドキュメント

- [アーキテクチャ](./docs/architecture.md)
- [デプロイ](./docs/deployment.md)
- [ADR](./docs/adr/)

## 必要環境

- **Node.js 20.18+**（`pnpm dev:api` / Wrangler 3 系）
- Node 22 を使う場合は `wrangler` を 4 系に上げられます（[Wrangler の要件](https://developers.cloudflare.com/workers/wrangler/install-and-update/)）

Windows でバージョンを切り替える例（nvm-windows）:

```powershell
nvm install 20.18.0
nvm use 20.18.0
```

## 開発

```bash
pnpm install
pnpm test          # ユニットテスト
pnpm test:e2e      # Playwright E2E
pnpm dev:api       # Worker :8787
pnpm dev:web       # Vite   :5173
```

## 構成

| パス | 役割 |
|------|------|
| `apps/web` | Vite + React（Cloudflare Pages） |
| `apps/api` | Hono on Workers + Workers AI |
| `packages/domain` | エンティティ・ポート |
| `packages/application` | ユースケース |
| `prototype/` | 初期 UI プロトタイプ（参照用） |

## 技術方針

- **ホスティング**: Cloudflare Pages + Workers
- **採点 LLM**: Workers AI（無料枠中心）— [ADR-0004](./docs/adr/0004-llm-and-scoring.md)
- **音声入力**: Web Speech API（MVP）— [ADR-0005](./docs/adr/0005-speech-input.md)
- **設計**: クリーンアーキテクチャ + TDD
