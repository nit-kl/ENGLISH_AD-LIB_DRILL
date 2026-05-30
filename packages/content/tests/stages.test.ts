import { describe, expect, it } from "vitest";
import { hasQuestionMedia } from "@english-adlib/domain";
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

  it("intermediate-1 に YouTube 動画が紐づいている", () => {
    const q = STAGES.intermediate.questions.find((item) => item.id === "intermediate-1");
    expect(q).toBeDefined();
    expect(hasQuestionMedia(q!)).toBe(true);
    expect(q!.media?.setup.youtubeVideoId).toBe("vpl3bvpg2Ck");
    expect(q!.media?.setup.endSeconds).toBe(34);
    expect(q!.media?.reveal.startSeconds).toBe(34);
  });

  it("intermediate-3 に YouTube 動画が紐づいている", () => {
    const q = STAGES.intermediate.questions.find((item) => item.id === "intermediate-3");
    expect(q).toBeDefined();
    expect(hasQuestionMedia(q!)).toBe(true);
    expect(q!.media?.setup.youtubeVideoId).toBe("QcqDlY0GEmc");
    expect(q!.media?.setup.endSeconds).toBe(33);
    expect(q!.media?.reveal.startSeconds).toBe(33);
  });
});
