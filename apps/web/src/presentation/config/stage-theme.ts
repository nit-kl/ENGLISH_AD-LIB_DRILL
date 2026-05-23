import type { StageKey } from "@english-adlib/domain";

export const STAGE_THEMES: Record<StageKey, { colorClass: string }> = {
  beginner: { colorClass: "from-emerald-400 to-teal-500" },
  intermediate: { colorClass: "from-sky-400 to-blue-500" },
  advanced: { colorClass: "from-fuchsia-400 to-purple-600" },
  legendary: { colorClass: "from-amber-400 via-rose-500 to-red-600" },
};

export function getStageColorClass(stageKey: StageKey): string {
  return STAGE_THEMES[stageKey].colorClass;
}
