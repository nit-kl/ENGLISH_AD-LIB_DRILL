# ADR-0004: LLM 採点戦略（ほぼ無料運用）

## ステータス

Accepted

## コンテキスト

- 当初「ローカル LLM（Ollama）」を想定していたが、**ホスティングは Cloudflare のみ**
- Edge で GPU を自前運用することはできない
- プロトタイプの採点は乱数モックであり、本番では LLM による構造化評価が必要

## 調査結果（2026年5月時点）

### Cloudflare Workers AI

- **無料枠**: 10,000 Neurons / 日（UTC 0時リセット）
- **有料**: Workers Paid で超過分 $0.011 / 1,000 Neurons
- 採点1回あたりの目安（`@cf/meta/llama-3.2-1b-instruct`、入力~600 + 出力~700 トークン）: **おおよそ 15〜25 Neurons**
- 1日あたり **数百回規模の採点** が無料枠内に収まる想定（MVP・個人利用に十分）

### 真のローカル LLM（Ollama 等）

- PC 上では無料だが、**Cloudflare から直接は到達できない**
- 自宅サーバー + Cloudflare Tunnel で Worker から叩く構成は可能だが、常時起動・セキュリティ・レイテンシの運用負荷が大きい
- **本番のデフォルトには採用しない**（開発者のローカル検証用オプションとしてドキュメントのみ）

### その他

- OpenAI / Anthropic API: 品質は高いが従量課金で「ほぼ無料」から外れる
- ブラウザ内 LLM（WebLLM）: 端末スペック依存・初回ダウンロード大・採点品質の一貫性に課題

## 決定

1. **本番採点**: Cloudflare **Workers AI**
2. **MVP 推奨モデル**: `@cf/meta/llama-3.2-1b-instruct`（Neuron 単価が低い）
3. **品質不足時の段階的昇格**: `@cf/meta/llama-3.2-3b-instruct` または `@cf/ibm-granite/granite-4.0-h-micro`（要 Neuron 見積もり）
4. **ポート**: `ScoringService` インターフェースで抽象化し、テストは `FakeScoringService`、本番は `WorkersAiScoringService`
5. **プロンプト出力**: JSON 固定（fluency, grammar, vocabulary, relevance, goodPoints, improvements, modelAnswer, total）
6. **Neuron 超過時**: API は 503 + ユーザー向け「本日の無料枠を超えました」メッセージ（実装は follow-up）

## フォールバック（ADR-0008）

- Workers AI 失敗時: **Gemini Developer API 無料枠**（`gemini-2.5-flash-lite`）へ 1 回フォールバック
- 詳細: [ADR-0008](./0008-gemini-ai-fallback.md)

## 将来オプション（ADR 変更時に検討）

- 開発環境のみ `OLLAMA_BASE_URL` を向けた `OllamaScoringService` アダプタ
- キャッシュ（同一お題+回答のハッシュ）で Neuron 節約

## 結果

- Cloudflare だけで「サーバー代ほぼゼロ」の MVP が可能
- ローカル LLM 願望は **開発マシン上の Ollama** に限定し、本番は Workers AI と明確化

## 参照

- [Workers AI Pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/)
