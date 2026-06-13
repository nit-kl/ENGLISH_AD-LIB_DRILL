import type { Question } from "@english-adlib/domain";
import { STAGES } from "@english-adlib/content";
import { describe, expect, it } from "vitest";
import {
  createPlayStateReset,
  getQuestionsForStage,
  initialSetupComplete,
  markQuestionComplete,
} from "../src/application/game-flow.js";

const questionWithoutMedia: Question = {
  id: "test-no-media",
  stageKey: "intermediate",
  title: "動画なしテスト",
  titleEn: "No Media Test",
  situation: "Test situation.",
  role: "学習者",
  counterpart: "相手",
  icon: "📝",
  hints: [],
  modelAnswer: "Test answer.",
};

/** 責務: 画面遷移に使う純関数ロジック */
describe("game-flow", () => {
  describe("getQuestionsForStage", () => {
    it("ステージキーから問題一覧を返す", () => {
      const questions = getQuestionsForStage("beginner");
      expect(questions).toEqual(STAGES.beginner.questions);
      expect(questions.length).toBeGreaterThan(0);
      expect(questions[0]?.id).toBe("beginner-1");
    });

    it("null のとき空配列", () => {
      expect(getQuestionsForStage(null)).toEqual([]);
    });
  });

  describe("initialSetupComplete", () => {
    it("動画お題は setup 完了前は false", () => {
      const q = getQuestionsForStage("beginner")[0];
      expect(initialSetupComplete(q)).toBe(false);
    });

    it("お題なしは true", () => {
      expect(initialSetupComplete(undefined)).toBe(true);
    });
  });

  describe("markQuestionComplete", () => {
    it("ID を Set に追加する", () => {
      const next = markQuestionComplete(new Set(["a"]), "b");
      expect(next.has("a")).toBe(true);
      expect(next.has("b")).toBe(true);
    });
  });

  describe("createPlayStateReset", () => {
    it("動画お題は setup 未完了でリセット", () => {
      const q = getQuestionsForStage("beginner")[0];
      const reset = createPlayStateReset(q);
      expect(reset.setupComplete).toBe(false);
      expect(reset.timeLeft).toBe(60);
    });

    it("中級の動画お題も setup 未完了でリセット", () => {
      const q = getQuestionsForStage("intermediate")[0];
      const reset = createPlayStateReset(q);
      expect(reset.setupComplete).toBe(false);
      expect(reset.answerTimerActive).toBe(false);
    });

    it("動画なしのお題は即回答可能", () => {
      const reset = createPlayStateReset(questionWithoutMedia);
      expect(reset.setupComplete).toBe(true);
      expect(reset.answerTimerActive).toBe(true);
    });
  });
});
