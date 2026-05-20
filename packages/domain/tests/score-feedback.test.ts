import { describe, expect, it } from "vitest";
import { parseScoreFeedback } from "../src/entities/score-feedback.js";

describe("parseScoreFeedback", () => {
  const valid = {
    total: 78,
    fluency: 80,
    grammar: 75,
    vocabulary: 70,
    relevance: 85,
    sceneUpdateJa:
      "トールのアイスラテを注文したと受け止められ、店員が次の質問に進もうとしています。",
    goodPoints: ["流れが自然"],
    improvements: ["冠詞に注意"],
    modelAnswer: "I'd like a tall iced latte, please.",
  };

  it("有効なオブジェクトを ScoreFeedback に変換する", () => {
    const result = parseScoreFeedback(valid);
    expect(result.total).toBe(78);
    expect(result.sceneUpdateJa).toContain("ラテ");
    expect(result.goodPoints).toHaveLength(1);
  });

  it("スコアが0-100の範囲外ならエラー", () => {
    expect(() => parseScoreFeedback({ ...valid, total: 101 })).toThrow();
  });

  it("必須フィールド欠落ならエラー", () => {
    expect(() => parseScoreFeedback({ total: 50 })).toThrow();
  });

  it("sceneUpdateJa 欠落時はエラー", () => {
    const { sceneUpdateJa, ...withoutScene } = valid;
    void sceneUpdateJa;
    expect(() => parseScoreFeedback(withoutScene)).toThrow(/sceneUpdateJa/);
  });
});
