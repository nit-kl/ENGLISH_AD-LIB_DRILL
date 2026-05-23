import { describe, expect, it } from "vitest";
import type { Question } from "../src/entities/question.js";
import {
  buildSceneUpdateFallback,
  resolveSceneUpdateJa,
} from "../src/lib/scene-update-fallback.js";
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

const intermediate1: Question = {
  id: "intermediate-1",
  stageKey: "intermediate",
  title: "ホテルでトラブル",
  titleEn: "Hotel Trouble",
  situation: "予約記録がないと言われました。",
  role: "宿泊客",
  counterpart: "フロント係",
  icon: "🏨",
  hints: ["I have a reservation"],
  modelAnswer: "I have a reservation under Tanaka.",
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
});

describe("resolveSceneUpdateJa", () => {
  it("お題再掲の LLM 出力を回答反映のフォールバックに差し替える", () => {
    const bad =
      '隣に座った人が "Hi!" と話しかけてきました。自己紹介してください。';
    const result = resolveSceneUpdateJa(
      bad,
      beginner2,
      "Nice to meet you Sara. I'm Leo, I'm from Japan.",
    );
    expect(looksLikeSetupRepeat(result, beginner2)).toBe(false);
    expect(result).toContain("Leo");
    expect(result).toContain("日本");
  });

  it("JSON 会話ログはフォールバックに差し替える", () => {
    const bad =
      '{"Learner said": "hello", "フロント係 said": "予約記録がないと言われました", "Learner said": "This is unacceptable"}';
    const result = resolveSceneUpdateJa(
      bad,
      intermediate1,
      "Turn 1 (Learner): hello\nTurn 2 (Learner): This is unacceptable",
    );
    expect(result).not.toContain("Learner said");
    expect(result).toContain("フロント");
  });
});

describe("buildSceneUpdateFallback", () => {
  it("beginner-2 は名前と出身を拾う", () => {
    const text = buildSceneUpdateFallback(
      beginner2,
      "Nice to meet you. I'm Leo, I'm from Japan.",
    );
    expect(text).toContain("Leo");
    expect(text).toContain("日本");
    expect(text).not.toContain("自己紹介してください");
  });
});
