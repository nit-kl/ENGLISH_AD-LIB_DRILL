import { describe, expect, it, vi, afterEach } from "vitest";
import type { Question } from "@english-adlib/domain";
import { GeminiClient } from "../src/adapters/gemini/gemini-client.js";
import { GeminiScoringService } from "../src/adapters/gemini/gemini-scoring-service.js";

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
  modelAnswer: "I'd like a tall iced latte, please.",
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
};

describe("GeminiScoringService", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("Gemini の JSON テキストを ScoreFeedback にパースする", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => ({
          candidates: [
            {
              content: {
                parts: [{ text: JSON.stringify(validPayload) }],
              },
            },
          ],
        }),
      })),
    );

    const client = new GeminiClient({
      apiKey: "test-key",
      model: "gemini-2.5-flash-lite",
    });
    const service = new GeminiScoringService(client);
    const result = await service.scoreAnswer({
      question,
      answerText: "I'd like a latte please",
    });

    expect(result.total).toBe(75);
    expect(result.modelAnswer).toBe(question.modelAnswer);
  });
});
