import type { Question } from "./question.js";

export type StageKey = "beginner" | "intermediate" | "advanced" | "legendary";

export type Stage = {
  key: StageKey;
  label: string;
  sublabel: string;
  desc: string;
  /** 採点までに必要な学習者の発話回数 */
  conversationTurns: number;
  questions: Question[];
};
