# ADR-0006: 採点エラー UX と Whisper フォールバック

## ステータス

Accepted

## コンテキスト

- Workers AI は日次 Neuron 上限があり、失敗時の UX が必要
- Safari 等は Web Speech API 非対応のため、マイク MVP を満たす別経路が必要

## 決定

### API エラー形式

```json
{ "error": "メッセージ", "code": "QUOTA_EXCEEDED", "retryable": false }
```

| code | HTTP | retryable |
|------|------|-----------|
| QUOTA_EXCEEDED | 503 | false |
| SCORING_FAILED | 502 | true |
| TRANSCRIPTION_FAILED | 502 | true |

### フロント

- `ApiClientError` で code / retryable を保持
- `SubmitErrorBanner` でリトライボタン（retryable 時のみ）

### 音声

- 第一選択: Web Speech API（Chrome / Edge）
- フォールバック: MediaRecorder → `POST /api/transcribe` → Workers AI Whisper

## 結果

- Safari でもマイク入力が可能（録音→送信型）
- 無料枠超過時にユーザーへ明確なメッセージ
