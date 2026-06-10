import { describe, expect, it } from "vitest";
import { hasQuestionMedia } from "@english-adlib/domain";
import { findDuplicateQuestionTopics, QUESTION_TOPICS } from "../src/question-topics.js";
import { STAGES } from "../src/stages-data.js";
import { staticStageRepository } from "../src/static-stage-repository.js";

const QUESTION_MEDIA_EXPECTATIONS = [
  { id: "beginner-1", youtubeVideoId: "ii50mPdVdhk", splitSeconds: 15 },
  { id: "beginner-2", youtubeVideoId: "IurgHMDUExE", splitSeconds: 25.5 },
  { id: "beginner-3", youtubeVideoId: "BmESAC8gpf0", splitSeconds: 23.5 },
  { id: "beginner-4", youtubeVideoId: "c4yakFGsaV8", splitSeconds: 30.3 },
  { id: "beginner-5", youtubeVideoId: "uVlqeeHH1q0", splitSeconds: 24.5 },
  { id: "beginner-6", youtubeVideoId: "Fb5U_zYLusw", splitSeconds: 27 },
  { id: "intermediate-1", youtubeVideoId: "vpl3bvpg2Ck", splitSeconds: 34.3 },
  { id: "intermediate-2", youtubeVideoId: "DISMBVDzWgM", splitSeconds: 33.4 },
  { id: "intermediate-3", youtubeVideoId: "QcqDlY0GEmc", splitSeconds: 33.2 },
  { id: "advanced-1", youtubeVideoId: "qDyAvRzFG2o", splitSeconds: 49.3 },
  { id: "advanced-2", youtubeVideoId: "iTdwCbAlQaw", splitSeconds: 41.3 },
  { id: "advanced-3", youtubeVideoId: "TZ4wWiZnwtk", splitSeconds: 33.8 },
  { id: "legendary-1", youtubeVideoId: "U0vpMY-zTmo", splitSeconds: 54.3 },
  { id: "legendary-2", youtubeVideoId: "InwJE-7j3JY", splitSeconds: 55.8 },
  { id: "legendary-3", youtubeVideoId: "u40ccJLhs2k", splitSeconds: 57 },
] as const;

function findQuestion(id: string) {
  for (const stage of Object.values(STAGES)) {
    const q = stage.questions.find((item) => item.id === id);
    if (q) return q;
  }
  return undefined;
}

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

  it("全お題に YouTube 動画が紐づいている", () => {
    for (const stage of Object.values(STAGES)) {
      for (const q of stage.questions) {
        expect(hasQuestionMedia(q), q.id).toBe(true);
      }
    }
  });

  it.each(QUESTION_MEDIA_EXPECTATIONS)(
    "$id に YouTube 動画が正しく紐づいている",
    ({ id, youtubeVideoId, splitSeconds }) => {
      const q = findQuestion(id);
      expect(q).toBeDefined();
      expect(hasQuestionMedia(q!)).toBe(true);
      expect(q!.media?.setup.youtubeVideoId).toBe(youtubeVideoId);
      expect(q!.media?.reveal.youtubeVideoId).toBe(youtubeVideoId);
      expect(q!.media?.setup.endSeconds).toBe(splitSeconds);
      expect(q!.media?.reveal.startSeconds).toBe(splitSeconds);
    },
  );

  it("全お題が question-topics に登録されている", () => {
    const questionIds = Object.values(STAGES).flatMap((stage) =>
      stage.questions.map((q) => q.id),
    );
    const topicIds = QUESTION_TOPICS.map((t) => t.id);
    expect(topicIds.sort()).toEqual([...questionIds].sort());
  });

  it("お題の場所＋会話の目的が重複しない", () => {
    const duplicates = findDuplicateQuestionTopics(QUESTION_TOPICS);
    const message = duplicates
      .map((d) => `${d.setting}／${d.goal}: ${d.ids.join(", ")}`)
      .join("; ");
    expect(duplicates, message).toEqual([]);
  });
});
