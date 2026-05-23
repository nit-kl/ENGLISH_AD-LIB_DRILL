# ADR-0008: Workers AI 失敗時の Gemini API フォールバック

## ステータス

Accepted

## コンテキスト

- 本番 LLM は [ADR-0004](./0004-llm-and-scoring.md) のとおり Cloudflare Workers AI（Neuron 無料枠 10,000/日）を第一選択とする
- Neuron 枯渇・障害・JSON パース失敗などで採点・会話・文字起こしが止まると学習体験が途切れる
- Gemini Developer API は無料枠で Flash-Lite 系モデルの入出力トークン $0 が利用可能（[料金](https://ai.google.dev/gemini-api/docs/pricing?hl=ja)）だが、RPM/RPD 制限とデータ利用ポリシーが Workers AI と異なる

## 決定

1. **第一エンジン**: Workers AI（変更なし）
2. **第二エンジン**: Gemini Developer API **無料枠**（`gemini-2.5-flash-lite`）
3. **切り替え**: Workers が throw したら **1 回** Gemini を試行（採点・相手役返答・Whisper 文字起こしの 3 経路）
4. **有効化**: `GEMINI_FALLBACK_ENABLED=true` かつ Worker Secret `GEMINI_API_KEY` が設定されているときのみ
5. **請求**: Google AI Studio で **Billing を有効にしない**運用を前提（意図しない従量課金を避ける）
6. **ポート**: 既存 `ScoringService` / `CounterpartReplyService` に加え `TranscriptionService` を domain に追加し、`Fallback*Service` でチェーン
7. **エラー**: Gemini 429 / quota 系は既存 `QUOTA_EXCEEDED`（503）に分類

## データ・コンプライアンス

- 学習者の英語テキスト・音声が Google に送信される
- 無料枠はプロダクト改善にコンテンツが利用される場合がある（[利用規約](https://ai.google.dev/gemini-api/terms?hl=ja)）
- API キーは Worker Secret のみ。ブラウザに露出しない

## 結果

- Neuron 枯渇時も MVP 規模では学習を継続しやすい
- フォールバックが頻発すると Gemini 無料の RPD が先に枯渇し得る（二重の無料枠ボトルネック）
- プロンプトは `apps/api/src/llm-prompts/` で Workers / Gemini 共有し、出力品質の差を抑える

## 代替案

- Workers Paid の Neuron 超過のみ課金（ベンダー単一）
- 採点のみ Gemini フォールバック（実装・コスト最小）

## 参照

- [Gemini API レート制限](https://ai.google.dev/gemini-api/docs/rate-limits)
- [deployment.md](../deployment.md) — シークレット手順
