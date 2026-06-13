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
  {
    id: "beginner-5",
    stageKey: "beginner",
    title: "タクシーに乗る",
    titleEn: "Taking a Taxi",
    situation:
      'ニューヨークの街角でタクシーに乗りました。運転手に "Where to?" と聞かれました。タイムズスクエアまで行きたいと伝えてください。',
    role: "乗客",
    counterpart: "運転手",
    icon: "🚕",
    hints: ["Could you take me to ~", "I'd like to go to ~", "please"],
    modelAnswer: "Could you take me to Times Square, please?",
    media: {
      setup: {
        youtubeVideoId: "uVlqeeHH1q0",
        endSeconds: 24.5,
      },
      reveal: {
        youtubeVideoId: "uVlqeeHH1q0",
        startSeconds: 24.5,
      },
    },
  },
  {
    id: "beginner-6",
    stageKey: "beginner",
    title: "レストランで席を聞く",
    titleEn: "Restaurant Seating",
    situation:
      'ロンドンのレストランに予約なしで入店しました。ホストに "Do you have a reservation?" と聞かれました。予約がないことと2人分の席を伝えてください。',
    role: "お客さん",
    counterpart: "ホスト",
    icon: "🍽️",
    hints: ["No, we don't", "Table for ~", "please"],
    modelAnswer: "No, we don't. Table for two, please.",
    media: {
      setup: {
        youtubeVideoId: "Fb5U_zYLusw",
        endSeconds: 27,
      },
      reveal: {
        youtubeVideoId: "Fb5U_zYLusw",
        startSeconds: 27,
      },
    },
  },
  {
    id: "beginner-7",
    stageKey: "beginner",
    title: "お土産店で買い物",
    titleEn: "Souvenir Shopping",
    situation:
      'ロンドンのお土産店でTシャツを手に取りました。店員に "Can I help you?" と声をかけられました。値段とサイズを聞いてください。',
    role: "お客さん",
    counterpart: "店員",
    icon: "🎁",
    hints: ["How much is this", "Do you have it in ~", "medium / large"],
    modelAnswer: "Yes. How much is this T-shirt? Do you have it in medium?",
    media: {
      setup: {
        youtubeVideoId: "ub8VU_RXzJs",
        endSeconds: 27,
      },
      reveal: {
        youtubeVideoId: "ub8VU_RXzJs",
        startSeconds: 27,
      },
    },
  },
  {
    id: "beginner-8",
    stageKey: "beginner",
    title: "薬局で体調を説明",
    titleEn: "At the Pharmacy",
    situation:
      '海外旅行中、頭が痛くなって薬局に入りました。薬剤師に "How can I help you?" と聞かれました。症状と欲しい薬を伝えてください。',
    role: "お客さん",
    counterpart: "薬剤師",
    icon: "💊",
    hints: ["I have a ~", "Do you have something for ~", "headache"],
    modelAnswer: "I have a headache. Do you have something for headaches?",
    media: {
      setup: {
        youtubeVideoId: "LrmJDzZ00K4",
        endSeconds: 29,
      },
      reveal: {
        youtubeVideoId: "LrmJDzZ00K4",
        startSeconds: 29,
      },
    },
  },
];
