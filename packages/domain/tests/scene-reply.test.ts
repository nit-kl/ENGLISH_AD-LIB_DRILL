import { describe, expect, it } from "vitest";
import type { Question } from "../src/entities/question.js";
import {
  isValidSceneReply,
  normalizeSceneReply,
} from "../src/lib/scene-reply.js";

const cafeQuestion: Question = {
  id: "beginner-1",
  stageKey: "beginner",
  title: "カフェで注文する",
  titleEn: "Order at a Café",
  situation: "Order a latte.",
  role: "お客さん",
  counterpart: "店員さん",
  icon: "☕",
  hints: [],
  modelAnswer: "I'd like a tall iced latte, please.",
};

describe("scene-reply", () => {
  it("日本語のみの reply は無効", () => {
    expect(isValidSceneReply("そういえ、水でいいですか？")).toBe(false);
  });

  it("英語の場面返答は有効", () => {
    expect(
      isValidSceneReply("Sure, one tall iced latte. For here or to go?"),
    ).toBe(true);
  });

  it("無効な reply はお題別フォールバックに差し替える", () => {
    const result = normalizeSceneReply("そういえ、水でいいですか？", cafeQuestion);
    expect(result).toContain("iced latte");
    expect(isValidSceneReply(result)).toBe(true);
  });
});
