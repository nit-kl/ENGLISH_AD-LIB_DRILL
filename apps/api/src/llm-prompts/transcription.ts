export function buildTranscriptionPrompt(language?: string): string {
  const langHint =
    language === "ja"
      ? "The speech is in Japanese."
      : language === "en"
        ? "The speech is in English. Use Latin letters (a-z) only. Do not output hiragana, katakana, or kanji."
        : "Transcribe in the language spoken.";

  return `Transcribe the attached audio accurately. ${langHint}
Return ONLY the transcript text with no quotes, labels, or explanation.`;
}
