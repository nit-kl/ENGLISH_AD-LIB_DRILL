# ADR-0002: モノレポとクリーンアーキテクチャ

## ステータス

Accepted

## コンテキスト

- プロトタイプは単一 JSX ファイル（725行）で、採点・UI・データが混在
- Cloudflare ではフロント（Pages）と API（Workers）を分離する
- テスト駆動でコアロジックを保証したい

## 決定

1. **pnpm workspaces** のモノレポ
2. **`packages/domain`**: エンティティ・値オブジェクト・ポート（インターフェース）
3. **`packages/application`**: ユースケース（オーケストレーション）
4. **`apps/api`**: Worker 上のアダプタ（HTTP, Workers AI）
5. **`apps/web`**: React プレゼンテーション
6. 開発は **TDD**（domain → application の順でテスト先行）

## 代替案

| 案 | 却下理由 |
|----|----------|
| 単一 Worker + Vite 統合プラグイン | ユーザー要件「SPA + 別API」に合わない |
| ドメインを Worker 内に直書き | テスト困難・フロントと型共有しづらい |

## 結果

- 採点ロジックの契約をポートで固定し、LLM 実装を差し替え可能
- フロントは API URL のみ環境依存
