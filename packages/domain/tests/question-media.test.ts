import { describe, expect, it } from "vitest";
import { hasQuestionMedia } from "../src/entities/question-media.js";

describe("hasQuestionMedia", () => {
  it("media が揃っていれば true", () => {
    expect(
      hasQuestionMedia({
        media: {
          setup: { youtubeVideoId: "abc", endSeconds: 10 },
          reveal: { youtubeVideoId: "def" },
        },
      }),
    ).toBe(true);
  });

  it("setup.endSeconds が無いと false", () => {
    expect(
      hasQuestionMedia({
        media: {
          setup: { youtubeVideoId: "abc" },
          reveal: { youtubeVideoId: "def" },
        },
      }),
    ).toBe(false);
  });
});
