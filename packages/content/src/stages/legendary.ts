import type { Question, StageKey } from "@english-adlib/domain";

export const legendaryStageMeta = {
  key: "legendary" as StageKey,
  label: "レジェンド",
  sublabel: "Legendary",
  desc: "ネイティブ級の言葉力",
};

export const legendaryQuestions: Question[] = [
  {
    id: "legendary-1",
    stageKey: "legendary",
    title: "徳川家康にSNSを説明",
    titleEn: "Explain SNS to Ieyasu",
    situation:
      "タイムスリップしてきた徳川家康に、英語でTwitter（X）とは何かを説明してください。家康にも分かるように。",
    role: "タイムトラベル案内人",
    counterpart: "徳川家康",
    icon: "⚔️",
    hints: ["It's like a town square where ~", "Imagine a messenger that ~", "Everyone can hear what you say"],
    modelAnswer:
      "Think of it like a town square in Edo, but everyone in Japan can hear you at once. You send short messages, and a messenger carries them to thousands of people instantly.",
    media: {
      setup: {
        youtubeVideoId: "U0vpMY-zTmo",
        endSeconds: 54.3,
      },
      reveal: {
        youtubeVideoId: "U0vpMY-zTmo",
        startSeconds: 54.3,
      },
    },
  },
  {
    id: "legendary-2",
    stageKey: "legendary",
    title: "国連でスピーチ",
    titleEn: "UN Speech",
    situation:
      "国連気候変動会議で日本代表として60秒スピーチ。各国の即時行動を訴えてください。",
    role: "日本代表",
    counterpart: "議長",
    icon: "🌏",
    hints: ["Distinguished delegates", "The time for action is now", "We owe it to future generations"],
    modelAnswer:
      "Distinguished delegates, the time for action is now. Japan commits to bolder emissions cuts this decade. We owe it to future generations to act together—not tomorrow, but today.",
    media: {
      setup: {
        youtubeVideoId: "InwJE-7j3JY",
        endSeconds: 55.8,
      },
      reveal: {
        youtubeVideoId: "InwJE-7j3JY",
        startSeconds: 55.8,
      },
    },
  },
  {
    id: "legendary-3",
    stageKey: "legendary",
    title: "砂漠で砂を売る",
    titleEn: "Sell Sand in the Desert",
    situation:
      "砂漠の遊牧民に「プレミアム砂」を買わせてください。英語で説得力ある営業トークを。",
    role: "訪問販売員",
    counterpart: "遊牧民",
    icon: "🏜️",
    hints: ["This isn't just any sand", "What makes this special is", "You'd be the first in your tribe to"],
    modelAnswer:
      "This isn't just any sand—it's premium desert sand, filtered for the finest grain. What makes it special is the mineral blend. You'd be the first in your tribe to own sand this pure.",
    media: {
      setup: {
        youtubeVideoId: "u40ccJLhs2k",
        endSeconds: 57,
      },
      reveal: {
        youtubeVideoId: "u40ccJLhs2k",
        startSeconds: 57,
      },
    },
  },
];
