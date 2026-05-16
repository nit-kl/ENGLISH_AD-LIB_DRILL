# 英会話アドリブドリル (ENGLISH AD-LIB DRILL)

お題に沿って英語でアドリブ回答し、AI が採点する Web トレーニングアプリ。

## ドキュメント

- [アーキテクチャ](./docs/architecture.md)
- [デプロイ](./docs/deployment.md)
- [ADR](./docs/adr/)

## 必要環境

- **Node.js 24 LTS**（開発環境の基準: **v24.15.0**。Wrangler 4 対応）
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)（`apps/api` に同梱）
- バージョン指定: リポジトリルートの `.nvmrc`（`24`）/ `.node-version`（`24.15.0`）

### Windows で Node を入れる

**推奨: winget**

```powershell
winget install OpenJS.NodeJS.LTS
```

インストール後、PowerShell をいったん閉じて開き直し:

```powershell
node -v   # v24.15.0 など v24.x であること
```

`--version 22.x.x` などは winget のカタログに無いことがあります。LTS チャンネルは **v24 系** です。

**その他**

- [nodejs.org](https://nodejs.org/) から LTS インストーラー
- 複数バージョン管理: [nvm-windows](https://github.com/coreybutler/nvm-windows/releases) → `nvm install 24` / `nvm use 24`

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
