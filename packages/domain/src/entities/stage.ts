import type { Question } from "./question.js";

export type StageKey = "beginner" | "intermediate" | "advanced" | "legendary";

export type Stage = {
  key: StageKey;
  label: string;
  sublabel: string;
  desc: string;
  questions: Question[];
};
