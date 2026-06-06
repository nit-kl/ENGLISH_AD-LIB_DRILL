/** Web Speech API の onresult イベントから final / interim を取り出す */
export function parseSpeechRecognitionResults(
  results: SpeechRecognitionResultList,
  resultIndex: number,
): { finalText: string; interimText: string } {
  let finalText = "";
  let interimText = "";
  for (let i = resultIndex; i < results.length; i += 1) {
    const result = results[i];
    const transcript = result[0]?.transcript ?? "";
    if (result.isFinal) {
      finalText += transcript;
    } else {
      interimText += transcript;
    }
  }
  return { finalText: finalText.trim(), interimText: interimText.trim() };
}
