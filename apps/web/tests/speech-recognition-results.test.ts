import { describe, expect, it } from "vitest";
import { parseSpeechRecognitionResults } from "../src/presentation/hooks/speech-recognition-results";

function mockResults(
  items: Array<{ transcript: string; isFinal: boolean }>,
): SpeechRecognitionResultList {
  const list = items.map(
    (item) =>
      ({
        isFinal: item.isFinal,
        0: { transcript: item.transcript },
        length: 1,
      }) as SpeechRecognitionResult,
  );
  return list as unknown as SpeechRecognitionResultList;
}

describe("parseSpeechRecognitionResults", () => {
  it("interim のみを返す", () => {
    const results = mockResults([{ transcript: "hello wor", isFinal: false }]);
    expect(parseSpeechRecognitionResults(results, 0)).toEqual({
      finalText: "",
      interimText: "hello wor",
    });
  });

  it("final のみを返す", () => {
    const results = mockResults([{ transcript: "hello world", isFinal: true }]);
    expect(parseSpeechRecognitionResults(results, 0)).toEqual({
      finalText: "hello world",
      interimText: "",
    });
  });

  it("resultIndex 以降だけを処理する", () => {
    const results = mockResults([
      { transcript: "done", isFinal: true },
      { transcript: "next ph", isFinal: false },
    ]);
    expect(parseSpeechRecognitionResults(results, 1)).toEqual({
      finalText: "",
      interimText: "next ph",
    });
  });

  it("同一イベント内の final と interim を分離する", () => {
    const results = mockResults([
      { transcript: "first phrase", isFinal: true },
      { transcript: "second", isFinal: false },
    ]);
    expect(parseSpeechRecognitionResults(results, 0)).toEqual({
      finalText: "first phrase",
      interimText: "second",
    });
  });
});
