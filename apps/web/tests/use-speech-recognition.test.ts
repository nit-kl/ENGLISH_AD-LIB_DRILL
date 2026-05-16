import { describe, expect, it } from "vitest";
import { getSpeechRecognitionCtor } from "../src/presentation/hooks/speech-recognition-support";

describe("speech recognition support", () => {
  it("jsdom環境では未サポート（null）", () => {
    expect(getSpeechRecognitionCtor()).toBeNull();
  });
});
