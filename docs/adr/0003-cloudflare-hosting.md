# ADR-0003: Cloudflare ホスティング構成

## ステータス

Accepted

## コンテキスト

- ホスティングは Cloudflare 上のサービスに限定
- フロントは Vite + SPA、API は別デプロイ

## 決定

| コンポーネント | 配置 | ビルド成果物 |
|----------------|------|--------------|
| `apps/web` | **Cloudflare Pages** | `dist/` 静的ファイル |
| `apps/api` | **Cloudflare Workers** | Wrangler バンドル |

### 通信

- 本番: Pages のオリジンから Worker の URL へ `fetch`（CORS 許可）
- ローカル: `web` は Vite dev server、`api` は `wrangler dev`（別ポート）
- 環境変数 `VITE_API_BASE_URL` で API ベース URL を注入

### 認証

- MVP では匿名利用（認証なし）
- 将来必要なら Cloudflare Access または Workers KV にセッション

## 代替案

| 案 | 却下理由 |
|----|----------|
| Vercel / Netlify | Cloudflare 前提の要件 |
| Worker だけで HTML 配信 | SPA 分離方針と不一致 |

## 結果

- Pages の CDN + Worker のエッジ API でグローバル配信
- 無料枠内で MVP 運用可能（Workers / Pages Free）

## 参照

- [Tutorial - React SPA with an API](https://developers.cloudflare.com/workers/vite-plugin/tutorial/)（統合構成の参考。本プロジェクトは分離構成を採用）
