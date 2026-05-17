import { describe, expect, it } from "vitest";
import type { ScoreFeedback } from "../src/entities/score-feedback.js";
import { applyScoreFloor } from "../src/lib/score-adjustment.js";

const zeroFeedback: ScoreFeedback = {
  total: 0,
  fluency: 0,
  grammar: 0,
  vocabulary: 0,
  relevance: 0,
  reply: "Sure, one tall iced latte.",
  goodPoints: ["意図は伝わる"],
  improvements: ["冠詞"],
  modelAnswer: "I'd like a tall iced latte, please.",
};

describe("applyScoreFloor", () => {
  it("LLM が全部 0 でも英語で挑戦していればヒューリスティックで再採点", () => {
    const result = applyScoreFloor(zeroFeedback, "I'd like to tall latte");
    expect(result.total).toBeGreaterThanOrEqual(30);
    expect(result.total).toBeLessThanOrEqual(85);
  });

  it("空回答は 0 のまま", () => {
    const result = applyScoreFloor(zeroFeedback, "   ");
    expect(result.total).toBe(0);
  });
});
