import { describe, expect, it } from "vitest";
import type { Question, ScoreFeedback, ScoringService } from "@english-adlib/domain";
import { SubmitAnswerUseCase } from "../src/use-cases/submit-answer.js";

const sampleQuestion: Question = {
  id: "beginner-1",
  stageKey: "beginner",
  title: "カフェで注文する",
  titleEn: "Order at a Café",
  situation: "Order an iced latte.",
  role: "お客さん",
  counterpart: "店員さん",
  icon: "☕",
  hints: ["I'd like ~"],
};

class FakeScoringService implements ScoringService {
  async scoreAnswer(): Promise<ScoreFeedback> {
    return {
      total: 82,
      fluency: 80,
      grammar: 85,
      vocabulary: 78,
      relevance: 85,
      reply: "Sure, one tall iced latte. Anything else for you today?",
      goodPoints: ["良いテンポ"],
      improvements: ["冠詞を意識"],
      modelAnswer: "I'd like a tall iced latte, please.",
    };
  }
}

describe("SubmitAnswerUseCase", () => {
  it("空の回答はバリデーションエラー", async () => {
    const useCase = new SubmitAnswerUseCase(new FakeScoringService());
    await expect(
      useCase.execute({ question: sampleQuestion, answerText: "   " }),
    ).rejects.toThrow(/empty/i);
  });

  it("採点サービスを呼び出し結果を返す", async () => {
    const useCase = new SubmitAnswerUseCase(new FakeScoringService());
    const result = await useCase.execute({
      question: sampleQuestion,
      answerText: "I'd like a tall iced latte please",
    });
    expect(result.total).toBe(82);
    expect(result.goodPoints[0]).toBe("良いテンポ");
  });
});
