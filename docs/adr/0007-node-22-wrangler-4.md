# ADR-0007: Node 24 LTS と Wrangler 4

## ステータス

Accepted（2026-05: Node 24 LTS に更新）

## コンテキスト

- 当初 Node 20 環境のため Wrangler `3.114.17` に固定していた
- Wrangler 4 は Node 22 以上必須
- Windows では `winget install OpenJS.NodeJS.LTS` が **Node 24.15.0**（現行 LTS）を配布。22 系は winget に無い場合がある

## 決定

1. **Node.js**: 開発基準 **v24.15.0**（`engines.node` は `>=24.0.0`）
2. **バージョンファイル**: `.nvmrc` → `24`、`.node-version` → `24.15.0`
3. **インストール**: Windows は `winget install OpenJS.NodeJS.LTS` を推奨
4. **Wrangler**: `apps/api` で `^4.16.1`（4 系）
5. **CI**: GitHub Actions の `node-version` を `24`

## 結果

- チームのローカル環境と CI を LTS チャンネルで揃えられる
- Node 22 のみ必須ではないが、22 以上なら動作する（推奨は 24 LTS）

## 代替案

- Node 22 を `.nvmrc` に固定（却下: winget LTS が 24 のため齟齬が出る）
- Node 20 + Wrangler 3（却下）
