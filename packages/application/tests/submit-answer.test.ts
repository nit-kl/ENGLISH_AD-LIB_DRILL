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
  modelAnswer: "I'd like a tall iced latte, please.",
};

const beginner2: Question = {
  id: "beginner-2",
  stageKey: "beginner",
  title: "初対面の挨拶",
  titleEn: "First Meeting",
  situation:
    '語学学校。Sarah が Hi と話しかけてきました。自己紹介してください。',
  role: "留学生",
  counterpart: "Sarah",
  icon: "🎒",
  hints: ["Nice to meet you"],
  modelAnswer:
    "Nice to meet you, Sarah. I'm Yuki. I'm from Japan. I'm here to study English.",
};

class FakeScoringService implements ScoringService {
  constructor(private readonly feedback: ScoreFeedback) {}

  async scoreAnswer(): Promise<ScoreFeedback> {
    return this.feedback;
  }
}

/** 責務: 回答送信ユースケース（空拒否・採点委譲・後処理） */
describe("SubmitAnswerUseCase", () => {
  it("空の回答はバリデーションエラー", async () => {
    const useCase = new SubmitAnswerUseCase(
      new FakeScoringService({
        total: 82,
        fluency: 80,
        grammar: 85,
        vocabulary: 78,
        relevance: 85,
        sceneUpdateJa: "店員が注文を受け取り、次の質問に進みます。",
        goodPoints: ["良いテンポ"],
        improvements: ["冠詞を意識"],
        modelAnswer: "I'd like a tall iced latte, please.",
      }),
    );
    await expect(
      useCase.execute({ question: sampleQuestion, userTurns: ["   "] }),
    ).rejects.toThrow(/empty/i);
  });

  it("採点サービスを呼び出し結果を返す", async () => {
    const useCase = new SubmitAnswerUseCase(
      new FakeScoringService({
        total: 82,
        fluency: 80,
        grammar: 85,
        vocabulary: 78,
        relevance: 85,
        sceneUpdateJa: "店員が注文を受け取り、次の質問に進みます。",
        goodPoints: ["良いテンポ"],
        improvements: ["冠詞を意識"],
        modelAnswer: "I'd like a tall iced latte, please.",
      }),
    );
    const result = await useCase.execute({
      question: sampleQuestion,
      userTurns: ["I'd like a tall iced latte please"],
    });
    expect(result.total).toBe(82);
    expect(result.goodPoints[0]).toBe("良いテンポ");
  });

  it("お題の再掲は差し替えて返す", async () => {
    const useCase = new SubmitAnswerUseCase(
      new FakeScoringService({
        total: 90,
        fluency: 90,
        grammar: 90,
        vocabulary: 90,
        relevance: 90,
        sceneUpdateJa:
          '隣に座った人が "Hi!" と話しかけてきました。自己紹介してください。',
        goodPoints: ["良い"],
        improvements: ["改善"],
        modelAnswer: beginner2.modelAnswer,
      }),
    );
    const result = await useCase.execute({
      question: beginner2,
      userTurns: ["Nice to meet you. I'm Leo, I'm from Japan."],
    });
    expect(result.sceneUpdateJa).not.toContain("自己紹介してください");
    expect(result.sceneUpdateJa).toMatch(/Leo|レオ|日本|サラ|Sarah/i);
  });

  it("sceneUpdateJa が短いときフォールバックする", async () => {
    const useCase = new SubmitAnswerUseCase(
      new FakeScoringService({
        total: 70,
        fluency: 70,
        grammar: 70,
        vocabulary: 70,
        relevance: 70,
        sceneUpdateJa: "短い",
        goodPoints: ["良い"],
        improvements: ["改善"],
        modelAnswer: sampleQuestion.modelAnswer,
      }),
    );
    const result = await useCase.execute({
      question: sampleQuestion,
      userTurns: ["I'd like to tall latte"],
    });
    expect(result.sceneUpdateJa).toContain("店員");
    expect(result.sceneUpdateJa.length).toBeGreaterThan(12);
  });

  it("LLM が total 0 でも英語回答なら点数を付ける", async () => {
    const useCase = new SubmitAnswerUseCase(
      new FakeScoringService({
        total: 0,
        fluency: 0,
        grammar: 0,
        vocabulary: 0,
        relevance: 0,
        sceneUpdateJa: "店員が注文を受け取り、次の確認に進みます。",
        goodPoints: ["良い"],
        improvements: ["改善"],
        modelAnswer: sampleQuestion.modelAnswer,
      }),
    );
    const result = await useCase.execute({
      question: sampleQuestion,
      userTurns: ["I'd like to tall latte"],
    });
    expect(result.total).toBeGreaterThanOrEqual(30);
  });
});
