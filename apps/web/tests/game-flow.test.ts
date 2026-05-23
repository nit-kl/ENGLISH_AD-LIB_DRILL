import { describe, expect, it } from "vitest";
import {
  createPlayStateReset,
  getConversationTurnsForStage,
  getQuestionsForStage,
  initialSetupComplete,
  isOnFinalTurn,
  markQuestionComplete,
} from "../src/application/game-flow.js";

/** 責務: 画面遷移に使う純関数ロジック */
describe("game-flow", () => {
  describe("getQuestionsForStage", () => {
    it("ステージキーから問題一覧を返す", () => {
      const questions = getQuestionsForStage("beginner");
      expect(questions.length).toBe(3);
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
      expect(reset.conversationExchanges).toEqual([]);
    });

    it("中級お題は即回答可能", () => {
      const q = getQuestionsForStage("intermediate")[0];
      const reset = createPlayStateReset(q);
      expect(reset.setupComplete).toBe(true);
      expect(reset.answerTimerActive).toBe(true);
    });
  });

  describe("conversation turns", () => {
    it("ステージごとの必要ターン数", () => {
      expect(getConversationTurnsForStage("beginner")).toBe(1);
      expect(getConversationTurnsForStage("intermediate")).toBe(2);
      expect(getConversationTurnsForStage("advanced")).toBe(3);
      expect(getConversationTurnsForStage("legendary")).toBe(4);
    });

    it("中級は1回目は中間ターン", () => {
      expect(isOnFinalTurn([], "intermediate")).toBe(false);
    });

    it("中級は2回目が最終ターン", () => {
      expect(
        isOnFinalTurn(
          [
            {
              userText: "Hi",
              counterpartLineEn: "Hello",
              sceneUpdateJa: "挨拶が交わされました。",
            },
          ],
          "intermediate",
        ),
      ).toBe(true);
    });
  });
});
