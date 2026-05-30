import { useCallback, useRef, useState } from "react";
import { useSpeechRecognition } from "./useSpeechRecognition";
import { useWhisperRecording } from "./useWhisperRecording";
import { getSpeechRecognitionCtor } from "./speech-recognition-support";
import {
  containsJapaneseScript,
  ENGLISH_TRANSCRIPT_REJECTED_MESSAGE,
} from "./transcript-language-guard";
import {
  createTranscriptDeduper,
  shouldPreferWhisperOnMobile,
} from "./voice-input-platform";

export type VoiceInputLanguage = "en" | "ja";

export type UseVoiceInputOptions = {
  /** 既定は英語（en-US / Whisper language=en） */
  language?: VoiceInputLanguage;
  /**
   * true: 常に Whisper（日本語入力向けなど）。
   * false: ADR-0006 どおり Web Speech 優先（英語・Chrome/Edge）
   */
  preferWhisper?: boolean;
};

function isWhisperVoiceSupported(): boolean {
  return (
    typeof navigator !== "undefined" &&
    !!navigator.mediaDevices?.getUserMedia &&
    typeof MediaRecorder !== "undefined"
  );
}

/**
 * マイク入力: Web Speech API（英語・対応ブラウザ）または Whisper（多言語・フォールバック）
 */
export function useVoiceInput(
  onTranscript: (text: string) => void,
  options: UseVoiceInputOptions = {},
) {
  const language = options.language ?? "en";
  const preferWhisper = options.preferWhisper ?? language === "ja";
  const speechLang = language === "ja" ? "ja-JP" : "en-US";

  const [validationError, setValidationError] = useState<string | null>(null);
  const dedupeRef = useRef(createTranscriptDeduper());
  const onFinalTranscript = useCallback(
    (text: string) => {
      const deduped = dedupeRef.current(text);
      if (!deduped) return;
      if (language === "en" && containsJapaneseScript(deduped)) {
        setValidationError(ENGLISH_TRANSCRIPT_REJECTED_MESSAGE);
        return;
      }
      setValidationError(null);
      onTranscript(deduped);
    },
    [onTranscript, language],
  );

  const speech = useSpeechRecognition({
    lang: speechLang,
    onFinalTranscript,
  });

  const whisper = useWhisperRecording(onFinalTranscript, {
    language: language === "en" ? "en" : undefined,
  });

  const useWhisper =
    preferWhisper ||
    (typeof navigator !== "undefined" &&
      shouldPreferWhisperOnMobile(navigator.userAgent)) ||
    getSpeechRecognitionCtor() === null ||
    !isWhisperVoiceSupported();

  const clearValidationError = useCallback(() => setValidationError(null), []);
  const wrapToggle = useCallback(
    (toggle: () => void) => () => {
      clearValidationError();
      toggle();
    },
    [clearValidationError],
  );

  if (useWhisper) {
    return {
      useWhisper: true as const,
      isSupported: isWhisperVoiceSupported(),
      isListening: whisper.isRecording,
      isBusy: whisper.isTranscribing,
      error: validationError ?? whisper.error,
      toggle: wrapToggle(whisper.toggle),
      stop: whisper.stop,
      micLabel: whisper.isTranscribing
        ? "認識中…"
        : whisper.isRecording
          ? "録音停止"
          : "マイクで話す",
    };
  }

  return {
    useWhisper: false as const,
    isSupported: speech.isSupported,
    isListening: speech.isListening,
    isBusy: false,
    error: validationError ?? speech.error,
    toggle: wrapToggle(speech.toggle),
    stop: speech.stop,
    micLabel: speech.isListening ? "録音中…" : "マイクで話す",
  };
}
