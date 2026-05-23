# アーキテクチャ概要

## 目的

英会話アドリブドリルを **Web単体** で提供する。フロントは Cloudflare Pages、API は Cloudflare Workers に分離する。

## レイヤ構成（クリーンアーキテクチャ）

```text
┌─────────────────────────────────────────────────────────┐
│  apps/web                                                │
│  presentation/ · application/ · infrastructure/          │
└───────────────────────────┬─────────────────────────────┘
                            │ HTTPS (JSON)
┌───────────────────────────▼─────────────────────────────┐
│  apps/api (Infrastructure / Interface Adapters)          │
│  Hono · CORS · Workers AI · LLM パース                   │
└───────────────────────────┬─────────────────────────────┘
                            │ implements ports
┌───────────────────────────▼─────────────────────────────┐
│  packages/application (Use Cases)                        │
│  SubmitAnswer · ListStages · 採点後処理                    │
└───────────────────────────┬─────────────────────────────┘
                            │ depends on
┌───────────────────────────▼─────────────────────────────┐
│  packages/domain (Entities · Ports · Business Rules)     │
│  Question · ScoreFeedback · ScoringService · StageRepo   │
└───────────────────────────▲─────────────────────────────┘
                            │ types only
┌───────────────────────────┴─────────────────────────────┐
│  packages/content (Static Stage / Question Data)         │
└─────────────────────────────────────────────────────────┘
```

## 依存ルール

| レイヤ | 依存してよい相手 |
|--------|------------------|
| domain | なし（標準ライブラリのみ） |
| content | domain（型のみ） |
| application | domain |
| api / web | application, domain, content |

**domain はフレームワーク・Cloudflare・React に依存しない。**

## 責務の所在

| 処理 | レイヤ |
|------|--------|
| ステージ・問題データ | `packages/content` |
| 採点後処理（floor / sceneUpdate 品質） | `packages/application`（SubmitAnswerUseCase） |
| 中間ターンの相手返答 | `packages/application`（SubmitConversationTurnUseCase） + `apps/api`（WorkersAiCounterpartReplyService） |
| LLM 呼び出し・JSON パース | `apps/api`（Workers AI → Gemini フォールバック、[ADR-0008](./adr/0008-gemini-ai-fallback.md)） |
| HTTP 通信 | `apps/web/infrastructure`（scoring-api-client） |
| 画面遷移・タイマー | `apps/web/application`（useGameFlow） |
| UI テーマ（Tailwind colorClass） | `apps/web/presentation/config` |

## 会話ターン（ステージ難易度）

| ステージ | 採点までの学習者発話回数 |
|----------|--------------------------|
| 初級 | 1（従来どおり） |
| 中級 | 2 |
| 上級 | 3 |
| 超人級 | 4 |

中間ターンは `POST /api/conversation/turn` で相手役の返答を取得し、最終ターンで `POST /api/score` に全発話を渡して採点する。

## リポジトリ構成

```text
apps/
  web/
    src/application/     # useGameFlow, game-flow 純関数
    src/presentation/    # React UI
    src/infrastructure/  # scoring-api-client
  api/                   # Cloudflare Worker (Hono)
packages/
  content/               # 静的ステージ・問題データ
  domain/                # エンティティ・ポート・ビジネスルール
  application/           # ユースケース
docs/
  architecture.md
  adr/
prototype/               # 参照用プロトタイプ（本番コードからは参照しない）
```

## 外部サービス（Cloudflare）

| 用途 | サービス |
|------|----------|
| 静的ホスティング | Pages |
| REST API | Workers |
| 英語採点 LLM | Workers AI（無料枠 10,000 Neurons/日） |
| 音声 STT フォールバック | Workers AI Whisper |

詳細は [ADR-0004](./adr/0004-llm-and-scoring.md)・[ADR-0005](./adr/0005-speech-input.md) を参照。

## テスト戦略

- **content**: データ整合性（全問 modelAnswer、getQuestionById）
- **domain / application**: Vitest、ユニットテスト（テストファイル名 = モジュール名）
- **api**: LLM アダプター・JSON パース（`apps/api/src/lib/llm/`）
- **web**: game-flow 純関数 + scoring-api-client + RTL コンポーネントテスト
- **e2e**: Playwright で主要ユーザージャーニー（API はモック）

TDD: ユースケースの振る舞いをテストで定義 → 実装 → リファクタ。
