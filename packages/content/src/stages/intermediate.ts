import type { Question, StageKey } from "@english-adlib/domain";

export const intermediateStageMeta = {
  key: "intermediate" as StageKey,
  label: "中級",
  sublabel: "Intermediate",
  desc: "日常会話レベル",
};

export const intermediateQuestions: Question[] = [
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
];
