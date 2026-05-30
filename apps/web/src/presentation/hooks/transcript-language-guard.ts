/** ひらがな・カタカナ・漢字（CJK）が含まれるか */
export function containsJapaneseScript(text: string): boolean {
  return /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF\uFF66-\uFF9F]/.test(text);
}

export const ENGLISH_TRANSCRIPT_REJECTED_MESSAGE =
  "英語として認識できませんでした（日本語の文字が含まれています）。英語で話すか、キーボードの言語を英語に切り替えてから、もう一度マイクで話してください。";
