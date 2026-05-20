import { describe, expect, it, vi, afterEach } from "vitest";
import { ApiClientError, scoreAnswer } from "../src/infrastructure/api-client.js";

describe("scoreAnswer", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("API の feedback を parseScoreFeedback で検証して返す", async () => {
    const feedback = {
      total: 80,
      fluency: 78,
      grammar: 82,
      vocabulary: 75,
      relevance: 85,
      sceneUpdateJa: "ラテの注文を受け取り、店員が次の質問に進みます。",
      goodPoints: ["自然な流れ"],
      improvements: ["冠詞に注意"],
      modelAnswer: "I'd like a tall iced latte, please.",
    };

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ feedback }),
      }),
    );

    const result = await scoreAnswer("beginner-1", "I'd like a latte");
    expect(result.sceneUpdateJa).toContain("ラテ");
    expect(result.total).toBe(80);
  });

  it("お題の再掲はクライアントで差し替える", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          feedback: {
            total: 90,
            fluency: 90,
            grammar: 90,
            vocabulary: 90,
            relevance: 90,
            sceneUpdateJa:
              "隣に座った人が話しかけてきました。自己紹介してください。",
            goodPoints: ["良い"],
            improvements: ["改善"],
            modelAnswer: "Nice to meet you. I'm Leo.",
          },
        }),
      }),
    );

    const result = await scoreAnswer(
      "beginner-2",
      "Nice to meet you. I'm Leo, I'm from Japan.",
    );
    expect(result.sceneUpdateJa).not.toContain("自己紹介してください");
    expect(result.sceneUpdateJa).toMatch(/Leo|日本|サラ/i);
  });

  it("sceneUpdateJa が短いときクライアントでフォールバックする", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          feedback: {
            total: 70,
            fluency: 70,
            grammar: 70,
            vocabulary: 70,
            relevance: 70,
            sceneUpdateJa: "短",
            goodPoints: ["良い"],
            improvements: ["改善"],
            modelAnswer: "I'd like a tall iced latte, please.",
          },
        }),
      }),
    );

    const result = await scoreAnswer("beginner-1", "I'd like to tall latte");
    expect(result.sceneUpdateJa).toContain("店員");
  });

  it("sceneUpdateJa 欠落の feedback は SCORING_FAILED になる", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          feedback: {
            total: 80,
            fluency: 78,
            grammar: 82,
            vocabulary: 75,
            relevance: 85,
            goodPoints: ["良い"],
            improvements: ["改善"],
            modelAnswer: "Hi",
          },
        }),
      }),
    );

    await expect(scoreAnswer("beginner-1", "test")).rejects.toMatchObject({
      code: "SCORING_FAILED",
    } satisfies Partial<ApiClientError>);
  });
});
