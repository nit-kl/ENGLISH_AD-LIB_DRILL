import type { Stage, StageKey } from "@english-adlib/domain";
import { advancedQuestions, advancedStageMeta } from "./stages/advanced.js";
import { beginnerQuestions, beginnerStageMeta } from "./stages/beginner.js";
import { intermediateQuestions, intermediateStageMeta } from "./stages/intermediate.js";
import { legendaryQuestions, legendaryStageMeta } from "./stages/legendary.js";

export const STAGES: Record<StageKey, Stage> = {
  beginner: { ...beginnerStageMeta, questions: beginnerQuestions },
  intermediate: { ...intermediateStageMeta, questions: intermediateQuestions },
  advanced: { ...advancedStageMeta, questions: advancedQuestions },
  legendary: { ...legendaryStageMeta, questions: legendaryQuestions },
};

export { beginnerQuestions, intermediateQuestions, advancedQuestions, legendaryQuestions };
