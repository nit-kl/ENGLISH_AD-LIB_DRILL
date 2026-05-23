import { useCallback, useRef, useState } from "react";
import { ApiClientError, transcribeAudio } from "../../infrastructure/scoring-api-client";
import type { VoiceInputLanguage } from "./useVoiceInput";

export type UseWhisperRecordingOptions = {
  /** 未指定時は Whisper が言語を自動判定（日本語入力向け） */
  language?: VoiceInputLanguage;
};

export function useWhisperRecording(
  onTranscript: (text: string) => void,
  options: UseWhisperRecordingOptions = {},
) {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const stop = useCallback(() => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  }, []);

  const start = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          channelCount: 1,
        },
      });
      const mimeType = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/mp4";
      const recorder = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: mimeType });
        if (blob.size === 0) {
          setError("録音データがありません。");
          return;
        }
        setIsTranscribing(true);
        try {
          const text = await transcribeAudio(blob, options.language);
          onTranscript(text);
        } catch (e) {
          const msg =
            e instanceof ApiClientError
              ? e.message
              : "音声の認識に失敗しました。";
          setError(msg);
        } finally {
          setIsTranscribing(false);
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch {
      setError("マイクへのアクセスが拒否されました。ブラウザの設定を確認してください。");
    }
  }, [onTranscript, options.language]);

  const toggle = useCallback(() => {
    if (isRecording) {
      stop();
    } else {
      void start();
    }
  }, [isRecording, start, stop]);

  return { isRecording, isTranscribing, error, toggle, stop };
}
