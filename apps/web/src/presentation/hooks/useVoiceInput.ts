import { useWhisperRecording } from "./useWhisperRecording";

function isWhisperVoiceSupported(): boolean {
  return (
    typeof navigator !== "undefined" &&
    !!navigator.mediaDevices?.getUserMedia &&
    typeof MediaRecorder !== "undefined"
  );
}

/** マイク入力は常に MediaRecorder → Workers AI Whisper（英語） */
export function useVoiceInput(onTranscript: (text: string) => void) {
  const whisper = useWhisperRecording(onTranscript);

  return {
    useWhisper: true as const,
    isSupported: isWhisperVoiceSupported(),
    isListening: whisper.isRecording,
    isBusy: whisper.isTranscribing,
    error: whisper.error,
    toggle: whisper.toggle,
    stop: whisper.stop,
    micLabel: whisper.isTranscribing
      ? "認識中…"
      : whisper.isRecording
        ? "録音停止"
        : "マイクで話す",
  };
}
