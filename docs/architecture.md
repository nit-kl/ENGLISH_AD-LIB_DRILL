# アーキテクチャ概要

## 目的

英会話アドリブドリルを **Web単体** で提供する。フロントは Cloudflare Pages、API は Cloudflare Workers に分離する。

## レイヤ構成（クリーンアーキテクチャ）

```text
┌─────────────────────────────────────────────────────────┐
│  apps/web (Presentation)                                 │
│  React UI · ルーティング · Web Speech API               │
└───────────────────────────┬─────────────────────────────┘
                            │ HTTPS (JSON)
┌───────────────────────────▼─────────────────────────────┐
│  apps/api (Infrastructure / Interface Adapters)          │
│  Hono · CORS · Workers AI · リクエスト検証               │
└───────────────────────────┬─────────────────────────────┘
                            │ implements ports
┌───────────────────────────▼─────────────────────────────┐
│  packages/application (Use Cases)                        │
│  SubmitAnswer · 検定集計 など                              │
└───────────────────────────┬─────────────────────────────┘
                            │ depends on
┌───────────────────────────▼─────────────────────────────┐
│  packages/domain (Entities · Ports)                      │
│  Question · ScoreFeedback · Grade · ScoringService       │
└─────────────────────────────────────────────────────────┘
```

## 依存ルール

| レイヤ | 依存してよい相手 |
|--------|------------------|
| domain | なし（標準ライブラリのみ） |
| application | domain |
| api / web | application, domain |

**domain はフレームワーク・Cloudflare・React に依存しない。**

## リポジトリ構成

```text
apps/
  web/          # Vite + React SPA → Cloudflare Pages
  api/          # Cloudflare Worker (Hono)
packages/
  domain/       # エンティティ・値オブジェクト・ポート
  application/  # ユースケース
docs/
  architecture.md
  adr/
prototype/      # 参照用プロトタイプ（本番コードからは参照しない）
```

## 外部サービス（Cloudflare）

| 用途 | サービス |
|------|----------|
| 静的ホスティング | Pages |
| REST API | Workers |
| 英語採点 LLM | Workers AI（無料枠 10,000 Neurons/日） |
| （将来）音声 STT フォールバック | Workers AI Whisper |

詳細は [ADR-0004](./adr/0004-llm-and-scoring.md)・[ADR-0005](./adr/0005-speech-input.md) を参照。

## テスト戦略

- **domain / application**: Vitest、ユニットテストのみ（高速・オフライン）
- **api**: ユースケースは Fake `ScoringService` でテスト。Worker 統合は後続
- **web**: コンポーネントテストは React Testing Library（段階的に追加）

TDD: ユースケースの振る舞いをテストで定義 → 実装 → リファクタ。
