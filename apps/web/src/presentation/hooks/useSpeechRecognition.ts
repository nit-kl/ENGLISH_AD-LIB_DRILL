import { useCallback, useEffect, useRef, useState } from "react";
import { getSpeechRecognitionCtor } from "./speech-recognition-support.js";
import {
  getSpeechRecognitionErrorMessage,
  shouldAutoRestartAfterError,
} from "./speech-recognition-errors.js";

export type UseSpeechRecognitionOptions = {
  lang?: string;
  onFinalTranscript?: (text: string) => void;
};

const RESTART_DELAY_MS = 250;

export function useSpeechRecognition(options: UseSpeechRecognitionOptions = {}) {
  const { lang = "en-US", onFinalTranscript } = options;
  const [isSupported, setIsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const wantsListeningRef = useRef(false);
  const restartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onFinalTranscriptRef = useRef(onFinalTranscript);
  onFinalTranscriptRef.current = onFinalTranscript;

  useEffect(() => {
    setIsSupported(getSpeechRecognitionCtor() !== null);
    return () => {
      wantsListeningRef.current = false;
      if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
      const r = recognitionRef.current;
      if (r) {
        r.onresult = null;
        r.onerror = null;
        r.onend = null;
        try {
          r.abort();
        } catch {
          /* ignore */
        }
      }
      recognitionRef.current = null;
    };
  }, []);

  const clearRestartTimer = useCallback(() => {
    if (restartTimerRef.current) {
      clearTimeout(restartTimerRef.current);
      restartTimerRef.current = null;
    }
  }, []);

  const detachRecognition = useCallback(() => {
    const r = recognitionRef.current;
    if (!r) return;
    r.onresult = null;
    r.onerror = null;
    r.onend = null;
    try {
      r.abort();
    } catch {
      try {
        r.stop();
      } catch {
        /* ignore */
      }
    }
    recognitionRef.current = null;
  }, []);

  const stop = useCallback(() => {
    wantsListeningRef.current = false;
    clearRestartTimer();
    detachRecognition();
    setIsListening(false);
    setError(null);
  }, [clearRestartTimer, detachRecognition]);

  const beginSession = useCallback(() => {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) {
      setError("このブラウザでは音声認識に対応していません。キーボードで入力してください。");
      wantsListeningRef.current = false;
      setIsListening(false);
      return;
    }

    detachRecognition();
    setError(null);

    const recognition = new Ctor();
    recognition.lang = lang;
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalText = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        if (result.isFinal) {
          finalText += result[0]?.transcript ?? "";
        }
      }
      if (finalText.trim()) {
        onFinalTranscriptRef.current?.(finalText.trim());
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      const code = event.error ?? "";
      if (code === "aborted" || !wantsListeningRef.current) return;

      if (shouldAutoRestartAfterError(code)) {
        scheduleRestart();
        return;
      }

      const message = getSpeechRecognitionErrorMessage(code);
      if (message) setError(message);
      wantsListeningRef.current = false;
      clearRestartTimer();
      detachRecognition();
      setIsListening(false);
    };

    recognition.onend = () => {
      if (!wantsListeningRef.current) {
        setIsListening(false);
        return;
      }
      scheduleRestart();
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
      setIsListening(true);
    } catch {
      wantsListeningRef.current = false;
      setIsListening(false);
      setError("音声認識を開始できませんでした。少し待ってからもう一度お試しください。");
      detachRecognition();
    }

    function scheduleRestart() {
      if (!wantsListeningRef.current) return;
      clearRestartTimer();
      restartTimerRef.current = setTimeout(() => {
        restartTimerRef.current = null;
        if (!wantsListeningRef.current) return;
        const current = recognitionRef.current;
        if (current) {
          try {
            current.start();
            setIsListening(true);
            return;
          } catch {
            /* fall through: new session */
          }
        }
        beginSession();
      }, RESTART_DELAY_MS);
    }
  }, [lang, clearRestartTimer, detachRecognition]);

  const start = useCallback(() => {
    wantsListeningRef.current = true;
    beginSession();
  }, [beginSession]);

  const toggle = useCallback(() => {
    if (isListening || wantsListeningRef.current) {
      stop();
    } else {
      start();
    }
  }, [isListening, start, stop]);

  return { isSupported, isListening, error, toggle, stop };
}
