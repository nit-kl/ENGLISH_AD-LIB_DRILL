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
      reply: "Sure, one tall iced latte. Anything else?",
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
    expect(result.reply).toContain("latte");
    expect(result.total).toBe(80);
  });

  it("日本語の reply はフォールバック英語に差し替える", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          feedback: {
            total: 0,
            fluency: 0,
            grammar: 0,
            vocabulary: 0,
            relevance: 0,
            reply: "そういえ、水でいいですか？",
            goodPoints: ["意図は伝わる"],
            improvements: ["冠詞"],
            modelAnswer: "I'd like a tall iced latte, please.",
          },
        }),
      }),
    );

    const result = await scoreAnswer("beginner-1", "I'd like to tall latte");
    expect(result.reply).toContain("iced latte");
  });

  it("reply 欠落の feedback は SCORING_FAILED になる", async () => {
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
            goodPoints: [],
            improvements: [],
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
