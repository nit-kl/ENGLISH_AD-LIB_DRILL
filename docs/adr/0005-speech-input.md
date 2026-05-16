# ADR-0005: 音声入力（マイク）MVP

## ステータス

Accepted

## コンテキスト

- MVP からマイク入力を必須とする
- Cloudflare だけで STT も可能（Workers AI Whisper: 約 41 Neurons/分）だが、無料枠を採点と共有する

## 決定

### 第1段階（MVP・採用）

**ブラウザ Web Speech API**（`SpeechRecognition` / `webkitSpeechRecognition`）

| 利点 | 制約 |
|------|------|
| サーバー費用ゼロ | Chrome / Edge 中心（Safari は限定的） |
| 低レイテンシ | 要 HTTPS（localhost は可） |
| Neuron を消費しない | 英語認識精度はブラウザ依存 |

- UI: プロトタイプ同様「マイクで話す」トグル、認識テキストを `textarea` に追記
- 非対応ブラウザ: ボタン無効 + キーボード入力のみ案内

### 第2段階（フォローアップ）

- **Workers AI `@cf/openai/whisper`** へ音声 Blob を POST するフォールバック
- 採点 Neuron と合算して 10,000/日 を監視

## 結果

- MVP でマイク体験を提供しつつ、運用コストを抑える
- 採点 API とは独立し、クリーンアーキテクチャ上は `apps/web` のプレゼンテーション concern

## 参照

- [MDN: SpeechRecognition](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition)
