import { describe, expect, it } from "vitest";
import { coerceScoreFeedbackRaw } from "../src/lib/coerce-score-feedback.js";
import { parseScoreFeedback } from "../src/entities/score-feedback.js";

const base = {
  total: "72",
  fluency: "70",
  grammar: "65",
  vocabulary: "68",
  relevance: "75",
  reply: "Sure, one tall iced latte.",
  goodPoints: [],
  improvements: [],
  modelAnswer: "I'd like a tall iced latte, please.",
};

describe("coerceScoreFeedbackRaw", () => {
  it("文字列の点数と空配列を補正して parse できる", () => {
    const coerced = coerceScoreFeedbackRaw(base);
    const result = parseScoreFeedback(coerced);
    expect(result.total).toBe(72);
    expect(result.goodPoints.length).toBeGreaterThan(0);
    expect(result.improvements.length).toBeGreaterThan(0);
  });
});
