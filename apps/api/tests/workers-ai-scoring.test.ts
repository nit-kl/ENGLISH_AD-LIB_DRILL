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

const validPayload = {
  total: 75,
  fluency: 70,
  grammar: 80,
  vocabulary: 72,
  relevance: 78,
  sceneUpdateJa:
    "「トールのラテ」と伝えたので、店員は注文を受け取り、これから for here or to go を聞く段階です。",
  goodPoints: ["良い"],
  improvements: ["改善"],
  modelAnswer: "I'd like a tall iced latte, please.",
};

describe("WorkersAiScoringService", () => {
  it("LLMのJSONレスポンスをScoreFeedbackにパースする", async () => {
    const fakeAi = {
      async run() {
        return { response: JSON.stringify(validPayload) };
      },
    };

    const service = new WorkersAiScoringService(fakeAi, "@cf/meta/llama-3.2-1b-instruct");
    const result = await service.scoreAnswer({
      question,
      answerText: "I'd like a latte please",
    });

    expect(result.total).toBe(75);
    expect(result.sceneUpdateJa).toContain("店員");
    expect(result.modelAnswer).toContain("latte");
  });

  it("JSON 末尾に余計なテキストがあってもパースできる", async () => {
    const fakeAi = {
      async run() {
        return {
          response: `${JSON.stringify(validPayload)}\n\nHere is your feedback summary.`,
        };
      },
    };

    const service = new WorkersAiScoringService(fakeAi, "@cf/meta/llama-3.2-1b-instruct");
    const result = await service.scoreAnswer({
      question,
      answerText: "I'd like a latte please",
    });

    expect(result.sceneUpdateJa.length).toBeGreaterThan(10);
  });

  it("お題の再掲は差し替えて返す", async () => {
    const fakeAi = {
      async run() {
        return {
          response: JSON.stringify({
            ...validPayload,
            sceneUpdateJa:
              '隣に座った人が "Hi!" と話しかけてきました。自己紹介してください。',
          }),
        };
      },
    };

    const service = new WorkersAiScoringService(fakeAi, "@cf/meta/llama-3.2-1b-instruct");
    const result = await service.scoreAnswer({
      question: {
        ...question,
        id: "beginner-2",
        title: "初対面の挨拶",
        situation:
          '語学学校。Sarah が Hi と話しかけてきました。自己紹介してください。',
        counterpart: "Sarah",
      },
      answerText: "Nice to meet you. I'm Leo, I'm from Japan.",
    });

    expect(result.sceneUpdateJa).not.toContain("自己紹介してください");
    expect(result.sceneUpdateJa).toMatch(/Leo|レオ|日本|サラ|Sarah/i);
  });

  it("sceneUpdateJa が短すぎるときフォールバックする", async () => {
    const fakeAi = {
      async run() {
        return {
          response: JSON.stringify({ ...validPayload, sceneUpdateJa: "短い" }),
        };
      },
    };

    const service = new WorkersAiScoringService(fakeAi, "@cf/meta/llama-3.2-1b-instruct");
    const result = await service.scoreAnswer({
      question,
      answerText: "I'd like to tall latte",
    });

    expect(result.sceneUpdateJa).toContain("店員");
    expect(result.sceneUpdateJa.length).toBeGreaterThan(12);
  });

  it("LLM が total 0 でも英語回答なら点数を付ける", async () => {
    const fakeAi = {
      async run() {
        return {
          response: JSON.stringify({
            ...validPayload,
            total: 0,
            fluency: 0,
            grammar: 0,
            vocabulary: 0,
            relevance: 0,
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

  it("1回目が不正JSONでも再試行して成功する", async () => {
    let calls = 0;
    const fakeAi = {
      async run() {
        calls += 1;
        if (calls === 1) {
          return { response: "not json at all" };
        }
        return { response: JSON.stringify(validPayload) };
      },
    };

    const service = new WorkersAiScoringService(fakeAi, "@cf/meta/llama-3.2-1b-instruct");
    const result = await service.scoreAnswer({
      question,
      answerText: "I'd like to tall latte",
    });

    expect(calls).toBe(2);
    expect(result.total).toBe(75);
  });
});
