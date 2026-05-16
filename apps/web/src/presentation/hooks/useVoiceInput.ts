import { useSpeechRecognition } from "./useSpeechRecognition";
import { useWhisperRecording } from "./useWhisperRecording";
import { getSpeechRecognitionCtor } from "./speech-recognition-support";

export function useVoiceInput(onTranscript: (text: string) => void) {
  const useWhisper = getSpeechRecognitionCtor() === null;

  const speech = useSpeechRecognition({
    lang: "en-US",
    onFinalTranscript: onTranscript,
  });

  const whisper = useWhisperRecording(onTranscript);

  if (useWhisper) {
    return {
      useWhisper: true as const,
      isSupported: true,
      isListening: whisper.isRecording,
      isBusy: whisper.isTranscribing,
      error: whisper.error,
      toggle: whisper.toggle,
      stop: whisper.stop,
      micLabel: whisper.isTranscribing
        ? "認識中…"
        : whisper.isRecording
          ? "録音停止"
          : "マイクで録音（Whisper）",
    };
  }

  return {
    useWhisper: false as const,
    isSupported: speech.isSupported,
    isListening: speech.isListening,
    isBusy: false,
    error: speech.error,
    toggle: speech.toggle,
    stop: speech.stop,
    micLabel: speech.isListening ? "録音中…" : "マイクで話す",
  };
}
