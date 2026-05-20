import { describe, expect, it } from "vitest";
import {
  getSpeechRecognitionErrorMessage,
  shouldAutoRestartAfterError,
} from "../src/presentation/hooks/speech-recognition-errors";

describe("speech recognition errors", () => {
  it("aborted と no-speech はユーザー向けメッセージなし", () => {
    expect(getSpeechRecognitionErrorMessage("aborted")).toBeNull();
    expect(getSpeechRecognitionErrorMessage("no-speech")).toBeNull();
  });

  it("権限・ネットワーク系は具体的なメッセージ", () => {
    expect(getSpeechRecognitionErrorMessage("not-allowed")).toContain("マイク");
    expect(getSpeechRecognitionErrorMessage("network")).toContain("ネットワーク");
  });

  it("no-speech のみ自動再開", () => {
    expect(shouldAutoRestartAfterError("no-speech")).toBe(true);
    expect(shouldAutoRestartAfterError("network")).toBe(false);
    expect(shouldAutoRestartAfterError("aborted")).toBe(false);
  });
});
