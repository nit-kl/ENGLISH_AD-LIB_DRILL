import type { Question, StageKey } from "@english-adlib/domain";

export const advancedStageMeta = {
  key: "advanced" as StageKey,
  label: "上級",
  sublabel: "Advanced",
  desc: "ビジネス&議論レベル",
};

export const advancedQuestions: Question[] = [
  {
    id: "advanced-1",
    stageKey: "advanced",
    title: "プレゼン冒頭",
    titleEn: "Presentation Opening",
    situation:
      "国際カンファレンスで「日本の働き方改革」について発表します。聴衆を引き込む60秒のオープニングを話してください。",
    role: "登壇者",
    counterpart: "司会",
    icon: "🎤",
    hints: ["Imagine a world where ~", "Today I want to talk about", "But first, let me ask you"],
    modelAnswer:
      "Imagine a world where every employee leaves work on time, feeling energized. Today I want to talk about Japan's work-style reform—and why it matters not just for Japan, but for all of us in this room.",
  },
  {
    id: "advanced-2",
    stageKey: "advanced",
    title: "上司に反論する",
    titleEn: "Pushing Back",
    situation:
      '外国人上司が "I\'m proposing we cut the entire training budget for the Japanese market." と提案してきました。失礼にならない範囲で反対意見を述べてください。',
    role: "マネージャー",
    counterpart: "上司",
    icon: "⚖️",
    hints: ["I understand your point, however", "With all due respect", "May I suggest an alternative"],
    modelAnswer:
      "I understand your point about the budget. However, with all due respect, cutting all training for the Japanese market could hurt our growth. May I suggest we keep a smaller pilot program instead?",
  },
  {
    id: "advanced-3",
    stageKey: "advanced",
    title: "クレーム対応（英語）",
    titleEn: "Handling a Complaint",
    situation:
      '怒っている海外のお客様 "This is the worst service I have ever received!" 丁寧に謝罪し、解決策を提示してください。',
    role: "カスタマーサポート",
    counterpart: "お客様",
    icon: "🔥",
    hints: ["I sincerely apologize", "Let me make this right", "I completely understand your frustration"],
    modelAnswer:
      "I sincerely apologize for the experience you've had. I completely understand your frustration. Let me make this right—I'd like to offer you a full refund and priority support going forward.",
  },
];
