import { describe, expect, it } from "vitest";
import { parseScoreFeedback } from "@english-adlib/domain";
import { coerceScoreFeedbackRaw } from "../src/lib/llm/coerce-score-feedback.js";

const base = {
  total: "72",
  fluency: "70",
  grammar: "65",
  vocabulary: "68",
  relevance: "75",
  sceneUpdateJa: "注文を受け取り、次の確認に進みます。",
  goodPoints: [],
  improvements: [],
  modelAnswer: "I'd like a tall iced latte, please.",
};

/** 責務: LLM 出力の型ゆれを正規化して domain パース可能にする */
describe("coerceScoreFeedbackRaw", () => {
  it("文字列の点数と空配列を補正して parse できる", () => {
    const coerced = coerceScoreFeedbackRaw(base);
    const result = parseScoreFeedback(coerced);
    expect(result.total).toBe(72);
    expect(result.goodPoints.length).toBeGreaterThan(0);
    expect(result.improvements.length).toBeGreaterThan(0);
  });
});
