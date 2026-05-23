import { describe, expect, it } from "vitest";
import { STAGES } from "../src/stages-data.js";
import { staticStageRepository } from "../src/static-stage-repository.js";

/** 責務: ステージ・問題データの整合性を保証する */
describe("stages data", () => {
  it("各ステージに問題が定義されている", () => {
    for (const stage of Object.values(STAGES)) {
      expect(stage.questions.length).toBeGreaterThan(0);
    }
  });

  it("getQuestionById で既存の問題を取得できる", () => {
    const id = STAGES.beginner.questions[0].id;
    expect(staticStageRepository.getQuestionById(id)?.id).toBe(id);
  });

  it("全お題に模範解答が定義されている", () => {
    for (const stage of Object.values(STAGES)) {
      for (const q of stage.questions) {
        expect(q.modelAnswer.trim().length, q.id).toBeGreaterThan(0);
      }
    }
  });
});
