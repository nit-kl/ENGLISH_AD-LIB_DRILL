import { describe, expect, it } from "vitest";
import type { Question } from "@english-adlib/domain";
import { WorkersAiScoringService } from "../src/adapters/workers-ai-scoring-service.js";

const question: Question = {
  id: "beginner-1",
  stageKey: "beginner",
  title: "カフェで注文する",
  titleEn: "Order at a Café",
  situation: "Order a tall iced latte.",
  role: "お客さん",
  counterpart: "店員さん",
  icon: "☕",
  hints: ["I'd like ~"],
};

describe("WorkersAiScoringService", () => {
  it("LLMのJSONレスポンスをScoreFeedbackにパースする", async () => {
    const fakeAi = {
      async run() {
        return {
          response: JSON.stringify({
            total: 75,
            fluency: 70,
            grammar: 80,
            vocabulary: 72,
            relevance: 78,
            reply: "Sure, one tall iced latte. Would you like that for here or to go?",
            goodPoints: ["良い"],
            improvements: ["改善"],
            modelAnswer: "I'd like a tall iced latte, please.",
          }),
        };
      },
    };

    const service = new WorkersAiScoringService(fakeAi, "@cf/meta/llama-3.2-1b-instruct");
    const result = await service.scoreAnswer({
      question,
      answerText: "I'd like a latte please",
    });

    expect(result.total).toBe(75);
    expect(result.reply).toContain("latte");
    expect(result.modelAnswer).toContain("latte");
  });

  it("JSON 末尾に余計なテキストがあってもパースできる", async () => {
    const payload = {
      total: 75,
      fluency: 70,
      grammar: 80,
      vocabulary: 72,
      relevance: 78,
      reply: "Sure, one tall iced latte. For here or to go?",
      goodPoints: ["良い"],
      improvements: ["改善"],
      modelAnswer: "I'd like a tall iced latte, please.",
    };
    const fakeAi = {
      async run() {
        return {
          response: `${JSON.stringify(payload)}\n\nHere is your feedback summary.`,
        };
      },
    };

    const service = new WorkersAiScoringService(fakeAi, "@cf/meta/llama-3.2-1b-instruct");
    const result = await service.scoreAnswer({
      question,
      answerText: "I'd like a latte please",
    });

    expect(result.reply).toContain("latte");
  });

  it("reply が日本語でも英語フォールバックに差し替える", async () => {
    const fakeAi = {
      async run() {
        return {
          response: JSON.stringify({
            total: 0,
            fluency: 0,
            grammar: 0,
            vocabulary: 0,
            relevance: 0,
            reply: "そういえ、水でいいですか？",
            goodPoints: ["意図は伝わる"],
            improvements: ["冠詞"],
            modelAnswer: "I'd like a tall iced latte, please.",
          }),
        };
      },
    };

    const service = new WorkersAiScoringService(fakeAi, "@cf/meta/llama-3.2-1b-instruct");
    const result = await service.scoreAnswer({
      question,
      answerText: "I'd like to tall latte",
    });

    expect(result.reply).toContain("iced latte");
    expect(result.reply).not.toMatch(/[\u3040-\u309F]/);
  });

  it("LLM が total 0 でも英語回答なら点数を付ける", async () => {
    const fakeAi = {
      async run() {
        return {
          response: JSON.stringify({
            total: 0,
            fluency: 0,
            grammar: 0,
            vocabulary: 0,
            relevance: 0,
            reply: "Sure, one tall iced latte. For here or to go?",
            goodPoints: ["意図は伝わる"],
            improvements: ["a と to の使い分け"],
            modelAnswer: "I'd like a tall iced latte, please.",
          }),
        };
      },
    };

    const service = new WorkersAiScoringService(fakeAi, "@cf/meta/llama-3.2-1b-instruct");
    const result = await service.scoreAnswer({
      question,
      answerText: "I'd like to tall latte",
    });

    expect(result.total).toBeGreaterThanOrEqual(30);
  });
});
