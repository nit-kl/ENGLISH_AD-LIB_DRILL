import type { Question, StageKey } from "@english-adlib/domain";

export const beginnerStageMeta = {
  key: "beginner" as StageKey,
  label: "初級",
  sublabel: "Beginner",
  desc: "海外旅行レベル",
};

export const beginnerQuestions: Question[] = [
  {
    id: "beginner-1",
    stageKey: "beginner",
    title: "カフェで注文する",
    titleEn: "Order at a Café",
    situation:
      'ニューヨークのスターバックスにいます。店員さんに "What can I get for you today?" と聞かれました。アイスラテをトールサイズで注文してください。',
    role: "お客さん",
    counterpart: "店員さん",
    icon: "☕",
    hints: ["I'd like ~", "Can I have ~", "a tall iced latte"],
    modelAnswer: "I'd like a tall iced latte, please.",
    media: {
      setup: {
        youtubeVideoId: "ii50mPdVdhk",
        endSeconds: 15,
      },
      reveal: {
        youtubeVideoId: "ii50mPdVdhk",
        startSeconds: 15,
      },
    },
  },
  {
    id: "beginner-2",
    stageKey: "beginner",
    title: "初対面の挨拶",
    titleEn: "First Meeting",
    situation:
      '語学学校の初日。隣に座った人が "Hi! I don\'t think we\'ve met. I\'m Sarah." と話しかけてきました。自己紹介してください。',
    role: "留学生",
    counterpart: "Sarah",
    icon: "🎒",
    hints: ["Nice to meet you", "I'm from ~", "I'm here to ~"],
    modelAnswer:
      "Nice to meet you, Sarah. I'm Yuki. I'm from Japan. I'm here to study English.",
    media: {
      setup: {
        youtubeVideoId: "IurgHMDUExE",
        endSeconds: 25.5,
      },
      reveal: {
        youtubeVideoId: "IurgHMDUExE",
        startSeconds: 25.5,
      },
    },
  },
  {
    id: "beginner-3",
    stageKey: "beginner",
    title: "道を尋ねられた",
    titleEn: "Giving Directions",
    situation:
      '渋谷駅前で外国人観光客に "Excuse me, how can I get to Shibuya Crossing?" と聞かれました。教えてあげてください。',
    role: "親切な日本人",
    counterpart: "観光客",
    icon: "🗺️",
    hints: ["Go straight", "Turn left/right", "It's right over there"],
    modelAnswer:
      "Sure! Go straight down this street. Shibuya Crossing is right over there.",
    media: {
      setup: {
        youtubeVideoId: "BmESAC8gpf0",
        endSeconds: 23.5,
      },
      reveal: {
        youtubeVideoId: "BmESAC8gpf0",
        startSeconds: 23.5,
      },
    },
  },
  {
    id: "beginner-4",
    stageKey: "beginner",
    title: "空港の入国審査",
    titleEn: "Airport Immigration",
    situation:
      'ロサンゼルスの空港で入国審査に並んでいます。入国審査官に "What\'s the purpose of your visit?" と聞かれました。観光目的と滞在期間を伝えてください。',
    role: "旅行者",
    counterpart: "入国審査官",
    icon: "✈️",
    hints: ["I'm here for tourism", "I'll stay for ~", "I'm visiting ~"],
    modelAnswer:
      "I'm here for tourism. I'll stay for two weeks. I'm visiting Los Angeles and San Francisco.",
    media: {
      setup: {
        youtubeVideoId: "c4yakFGsaV8",
        endSeconds: 30.3,
      },
      reveal: {
        youtubeVideoId: "c4yakFGsaV8",
        startSeconds: 30.3,
      },
    },
  },
];
