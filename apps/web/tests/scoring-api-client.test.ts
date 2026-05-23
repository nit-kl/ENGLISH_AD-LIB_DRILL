import { describe, expect, it, vi, afterEach } from "vitest";
import { ApiClientError } from "../src/infrastructure/api-error.js";
import { scoreAnswer } from "../src/infrastructure/scoring-api-client.js";

/** 責務: HTTP 通信とレスポンスの型検証のみ */
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

  it("HTTP エラーは ApiClientError に変換する", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 503,
        json: async () => ({ error: "Service unavailable", code: "SCORING_FAILED", retryable: true }),
      }),
    );

    await expect(scoreAnswer("beginner-1", "test")).rejects.toBeInstanceOf(ApiClientError);
  });
});
