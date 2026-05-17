import { describe, expect, it } from "vitest";
import { STAGES, getQuestionById } from "../src/data/stages.js";

describe("stages data", () => {
  it("各ステージに問題が定義されている", () => {
    for (const stage of Object.values(STAGES)) {
      expect(stage.questions.length).toBeGreaterThan(0);
    }
  });

  it("getQuestionById で既存の問題を取得できる", () => {
    const id = STAGES.beginner.questions[0].id;
    expect(getQuestionById(id)?.id).toBe(id);
  });
});
