import { describe, expect, it } from "vitest";
import { buildTranscriptionPrompt } from "../src/llm-prompts/transcription.js";

describe("buildTranscriptionPrompt", () => {
  it("英語指定ではラテン文字のみを促す", () => {
    const prompt = buildTranscriptionPrompt("en");
    expect(prompt).toContain("English");
    expect(prompt).toContain("Latin letters");
    expect(prompt).toContain("Do not output");
  });
});
