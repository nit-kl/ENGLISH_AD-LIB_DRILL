/** モバイルブラウザでは Web Speech の final 二重発火が起きやすいため Whisper を優先する */
export function shouldPreferWhisperOnMobile(userAgent: string): boolean {
  return /Android|iPhone|iPad|iPod/i.test(userAgent);
}

/** 連続同一テキストを除外（Web Speech の二重 final 対策） */
export function createTranscriptDeduper(windowMs = 3000) {
  let last: { text: string; at: number } | null = null;

  return (text: string, now = Date.now()): string | null => {
    const trimmed = text.trim();
    if (!trimmed) return null;
    if (last && last.text === trimmed && now - last.at < windowMs) {
      return null;
    }
    last = { text: trimmed, at: now };
    return trimmed;
  };
}
