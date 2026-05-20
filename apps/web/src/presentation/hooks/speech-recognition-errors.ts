/** Web Speech API の recognition.onerror で渡る error 値 */
export type SpeechRecognitionErrorCode =
  | "no-speech"
  | "aborted"
  | "audio-capture"
  | "network"
  | "not-allowed"
  | "service-not-allowed"
  | "bad-grammar"
  | "language-not-supported"
  | (string & {});

/** ユーザーに表示する文言。null は表示しない（正常系・軽微） */
export function getSpeechRecognitionErrorMessage(
  code: SpeechRecognitionErrorCode,
): string | null {
  switch (code) {
    case "aborted":
    case "no-speech":
      return null;
    case "not-allowed":
      return "マイクの使用が許可されていません。ブラウザのアドレスバーからマイクを許可してください。";
    case "network":
      return "音声認識サービスに接続できません。ネットワークやVPNを確認して、もう一度お試しください。";
    case "audio-capture":
      return "マイクを取得できません。他のアプリがマイクを使っていないか確認してください。";
    case "service-not-allowed":
      return "この環境では音声認識が使えません。HTTPSで開いているか確認し、キーボード入力をご利用ください。";
    case "language-not-supported":
      return "英語の音声認識に対応していません。キーボードで入力してください。";
    default:
      return "音声認識でエラーが発生しました。もう一度お試しください。";
  }
}

/** エラー後も聞き取りを続けたいときに自動再開する code */
export function shouldAutoRestartAfterError(code: SpeechRecognitionErrorCode): boolean {
  return code === "no-speech";
}
