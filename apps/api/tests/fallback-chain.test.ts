import { describe, expect, it } from "vitest";
import { withAiFallback } from "../src/adapters/fallback-chain.js";
import { FallbackScoringService } from "../src/adapters/fallback-scoring-service.js";
import type { Question, ScoreFeedback, ScoringService } from "@english-adlib/domain";

const question: Question = {
  id: "beginner-1",
  stageKey: "beginner",
  title: "カフェ",
  titleEn: "Cafe",
  situation: "Order",
  role: "customer",
  counterpart: "staff",
  icon: "☕",
  hints: [],
  modelAnswer: "latte please",
};

const feedback: ScoreFeedback = {
  total: 80,
  fluency: 80,
  grammar: 80,
  vocabulary: 80,
  relevance: 80,
  sceneUpdateJa: "店員が注文を受け取りました。",
  goodPoints: ["良い"],
  improvements: ["改善"],
  modelAnswer: "latte please",
};

describe("withAiFallback", () => {
  it("primary が成功したら secondary は呼ばない", async () => {
    let secondaryCalls = 0;
    const result = await withAiFallback(
      async () => "ok",
      async () => {
        secondaryCalls += 1;
        return "fallback";
      },
    );
    expect(result).toBe("ok");
    expect(secondaryCalls).toBe(0);
  });

  it("primary 失敗時は secondary を呼ぶ", async () => {
    const result = await withAiFallback(
      async () => {
        throw new Error("workers down");
      },
      async () => "fallback",
    );
    expect(result).toBe("fallback");
  });

  it("両方失敗時は secondary のエラーを throw", async () => {
    await expect(
      withAiFallback(
        async () => {
          throw new Error("workers down");
        },
        async () => {
          throw new Error("gemini down");
        },
      ),
    ).rejects.toThrow("gemini down");
  });
});

describe("FallbackScoringService", () => {
  class StubScoring implements ScoringService {
    constructor(
      private readonly fn: () => Promise<ScoreFeedback>,
    ) {}

    scoreAnswer(): Promise<ScoreFeedback> {
      return this.fn();
    }
  }

  it("Workers 失敗後に Gemini で採点できる", async () => {
    let primaryCalls = 0;
    const service = new FallbackScoringService(
      new StubScoring(async () => {
        primaryCalls += 1;
        throw new Error("Daily neuron limit exceeded");
      }),
      new StubScoring(async () => feedback),
    );

    const result = await service.scoreAnswer({
      question,
      answerText: "hello",
    });

    expect(primaryCalls).toBe(1);
    expect(result.total).toBe(80);
  });
});
