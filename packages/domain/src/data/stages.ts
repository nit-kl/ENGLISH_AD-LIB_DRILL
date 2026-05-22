import type { Question } from "../entities/question.js";

export type StageKey = "beginner" | "intermediate" | "advanced" | "legendary";

export type Stage = {
  key: StageKey;
  label: string;
  sublabel: string;
  desc: string;
  colorClass: string;
  questions: Question[];
};

export const STAGES: Record<StageKey, Stage> = {
  beginner: {
    key: "beginner",
    label: "初級",
    sublabel: "Beginner",
    desc: "海外旅行レベル",
    colorClass: "from-emerald-400 to-teal-500",
    questions: [
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
        // https://youtu.be/ii50mPdVdhk — Part2 開始 15s（YouTube 実測）
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
        // https://youtu.be/IurgHMDUExE — Part2 開始 26s（Hook なし・マニフェスト実測）
        media: {
          setup: {
            youtubeVideoId: "IurgHMDUExE",
            endSeconds: 26,
          },
          reveal: {
            youtubeVideoId: "IurgHMDUExE",
            startSeconds: 26,
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
        // https://youtu.be/BmESAC8gpf0 — Part2 開始 31s（Hook なし・メタデータ推定 0:32 から -1s）
        media: {
          setup: {
            youtubeVideoId: "BmESAC8gpf0",
            endSeconds: 23,
          },
          reveal: {
            youtubeVideoId: "BmESAC8gpf0",
            startSeconds: 23,
          },
        },
      },
    ],
  },
  intermediate: {
    key: "intermediate",
    label: "中級",
    sublabel: "Intermediate",
    desc: "日常会話レベル",
    colorClass: "from-sky-400 to-blue-500",
    questions: [
      {
        id: "intermediate-1",
        stageKey: "intermediate",
        title: "ホテルでトラブル",
        titleEn: "Hotel Trouble",
        situation:
          "ハワイのホテルでチェックインしようとしたら、予約記録がないと言われました。冷静に状況を説明し、対応を求めてください。",
        role: "困っている宿泊客",
        counterpart: "フロント係",
        icon: "🏨",
        hints: ["I have a reservation", "Could you check again", "This is unacceptable"],
        modelAnswer:
          "I have a reservation under the name Tanaka. Could you please check again? I also have a confirmation email on my phone.",
      },
      {
        id: "intermediate-2",
        stageKey: "intermediate",
        title: "英語面接",
        titleEn: "Job Interview",
        situation:
          '外資系企業の面接で "Tell me about a time you overcame a difficult challenge at work." と聞かれました。1分以内に答えてください。',
        role: "転職志望者",
        counterpart: "面接官",
        icon: "💼",
        hints: ["In my previous role", "I was responsible for", "As a result"],
        modelAnswer:
          "In my previous role, I was responsible for a major product launch. We faced a tight deadline, but I coordinated the team and we delivered on time. As a result, sales exceeded our target by fifteen percent.",
      },
      {
        id: "intermediate-3",
        stageKey: "intermediate",
        title: "海外の同僚と雑談",
        titleEn: "Small Talk with Coworker",
        situation:
          'リモート会議の前、海外支社の同僚が "How was your weekend?" と話しかけてきました。週末の出来事を話してください。',
        role: "会社員",
        counterpart: "同僚",
        icon: "💬",
        hints: ["It was pretty good", "I ended up ~ing", "How about you?"],
        modelAnswer:
          "It was pretty good, thanks! I ended up going hiking with some friends on Saturday. The weather was perfect. How about you?",
      },
    ],
  },
  advanced: {
    key: "advanced",
    label: "上級",
    sublabel: "Advanced",
    desc: "ビジネス&議論レベル",
    colorClass: "from-fuchsia-400 to-purple-600",
    questions: [
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
          "外国人上司が「日本市場での研修予算を全額カットする」と提案。失礼にならない範囲で反対意見を述べてください。",
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
    ],
  },
  legendary: {
    key: "legendary",
    label: "超人級",
    sublabel: "Legendary",
    desc: "ネイティブ級の言葉力",
    colorClass: "from-amber-400 via-rose-500 to-red-600",
    questions: [
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
      },
    ],
  },
};

export function getQuestionById(id: string): Question | undefined {
  for (const stage of Object.values(STAGES)) {
    const found = stage.questions.find((q) => q.id === id);
    if (found) return found;
  }
  return undefined;
}
