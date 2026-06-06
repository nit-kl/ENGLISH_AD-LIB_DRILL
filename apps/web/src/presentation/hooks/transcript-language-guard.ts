const JAPANESE_SCRIPT_RE = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF\uFF66-\uFF9F]/g;

/** ひらがな・カタカナ・漢字（CJK）が含まれるか */
export function containsJapaneseScript(text: string): boolean {
  return /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF\uFF66-\uFF9F]/.test(text);
}

/** 日本語文字を除去し、英語として使える部分だけ残す */
export function sanitizeEnglishTranscript(text: string): string {
  return text.replace(JAPANESE_SCRIPT_RE, " ").replace(/\s+/g, " ").trim();
}

/** 英語モード向けに認識テキストを正規化。使える英語がなければ null */
export function normalizeEnglishTranscript(text: string): string | null {
  const sanitized = sanitizeEnglishTranscript(text);
  if (!sanitized || !/[a-zA-Z]/.test(sanitized)) {
    return null;
  }
  return sanitized;
}

export const ENGLISH_TRANSCRIPT_REJECTED_MESSAGE =
  "英語として認識できませんでした。英語で話すか、キーボードの言語を英語に切り替えてから、もう一度マイクで話してください。";
