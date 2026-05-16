import { useCallback, useEffect, useRef, useState } from "react";
import { getSpeechRecognitionCtor } from "./speech-recognition-support.js";

export type UseSpeechRecognitionOptions = {
  lang?: string;
  onFinalTranscript?: (text: string) => void;
};

export function useSpeechRecognition(options: UseSpeechRecognitionOptions = {}) {
  const { lang = "en-US", onFinalTranscript } = options;
  const [isSupported, setIsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    setIsSupported(getSpeechRecognitionCtor() !== null);
  }, []);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const start = useCallback(() => {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) {
      setError("このブラウザでは音声認識に対応していません。キーボードで入力してください。");
      return;
    }

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
        onFinalTranscript?.(finalText.trim());
      }
    };

    recognition.onerror = () => {
      setError("音声認識でエラーが発生しました。");
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [lang, onFinalTranscript]);

  const toggle = useCallback(() => {
    if (isListening) {
      stop();
    } else {
      start();
    }
  }, [isListening, start, stop]);

  return { isSupported, isListening, error, toggle, stop };
}
