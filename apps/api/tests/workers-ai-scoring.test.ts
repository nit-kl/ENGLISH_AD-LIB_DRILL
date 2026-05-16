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
    expect(result.modelAnswer).toContain("latte");
  });
});
