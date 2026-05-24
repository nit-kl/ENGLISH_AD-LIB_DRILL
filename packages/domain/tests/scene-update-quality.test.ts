import { describe, expect, it } from "vitest";
import type { Question } from "../src/entities/question.js";
import { resolveSceneUpdateJa } from "../src/lib/scene-update-fallback.js";
import {
  looksLikeMalformedSceneUpdate,
  looksLikeSetupRepeat,
} from "../src/lib/scene-update-quality.js";

const beginner2: Question = {
  id: "beginner-2",
  stageKey: "beginner",
  title: "初対面の挨拶",
  titleEn: "First Meeting",
  situation:
    '語学学校の初日。隣に座った人が "Hi! I don\'t think we\'ve met. I\'m Sarah." と話しかけてきました。自己紹介してください。',
  role: "留学生",
  counterpart: "Sarah",
  icon: "🎒",
  hints: ["Nice to meet you"],
  modelAnswer:
    "Nice to meet you, Sarah. I'm Yuki. I'm from Japan. I'm here to study English.",
};

describe("looksLikeSetupRepeat", () => {
  it("お題文の再掲を検出する", () => {
    const bad =
      '隣に座った人が "Hi! I don\'t think we\'ve met. I\'m Sarah." と話しかけてきました。自己紹介してください。';
    expect(looksLikeSetupRepeat(bad, beginner2)).toBe(true);
  });

  it("回答後の変化なら false", () => {
    const good =
      "レオさんが日本から来て留学中だと自己紹介したので、サラは笑顔でうなずき、英語学習の話を続ける場面に進みました。";
    expect(looksLikeSetupRepeat(good, beginner2)).toBe(false);
  });
});

describe("looksLikeMalformedSceneUpdate", () => {
  it("JSON 形式の会話ログを検出する", () => {
    const bad =
      '{"Learner said": "hello", "フロント係 said": "予約記録がないと言われました", "Learner said": "This is unacceptable"}';
    expect(looksLikeMalformedSceneUpdate(bad)).toBe(true);
  });

  it("自然な日本語の場面描写は false", () => {
    const good =
      "フロント係が予約名を確認し、システムを再度検索する場面に進みました。";
    expect(looksLikeMalformedSceneUpdate(good)).toBe(false);
  });

  it("日本語に英単語が混ざっても false", () => {
    const good =
      "面接官は product launch の説明をうなずき受け止め、sales target について深掘りする質問に移りました。";
    expect(looksLikeMalformedSceneUpdate(good)).toBe(false);
  });
});

describe("resolveSceneUpdateJa", () => {
  it("お題再掲の LLM 出力はそのまま返す", () => {
    const bad =
      '隣に座った人が "Hi!" と話しかけてきました。自己紹介してください。';
    const result = resolveSceneUpdateJa(bad);
    expect(result).toBe(bad);
  });

  it("JSON 会話ログだけ差し替える", () => {
    const bad =
      '{"Learner said": "hello", "フロント係 said": "予約記録がないと言われました"}';
    const result = resolveSceneUpdateJa(bad);
    expect(result).not.toContain("Learner said");
    expect(result).toBe("場面の描写を取得できませんでした。");
  });

  it("自然な日本語はそのまま返す", () => {
    const good =
      "面接官は回答をうなずき受け止め、チーム規模について深掘りする質問に移りました。";
    expect(resolveSceneUpdateJa(good)).toBe(good);
  });

  it("空や JSON ログのときだけ conversationFallback を使う", () => {
    const fallback =
      "面接官は回答をうなずき、具体的な成果について深掘りする質問に移りました。";
    expect(resolveSceneUpdateJa("", fallback)).toBe(fallback);
    expect(
      resolveSceneUpdateJa('{"Learner said": "hello"}', fallback),
    ).toBe(fallback);
  });
});
