import type { Question, Stage, StageRepository } from "@english-adlib/domain";
import { STAGES } from "./stages-data.js";

/** 静的ステージデータを domain ポートとして提供する */
export class StaticStageRepository implements StageRepository {
  getAllStages(): Stage[] {
    return Object.values(STAGES);
  }

  getQuestionById(id: string): Question | undefined {
    for (const stage of Object.values(STAGES)) {
      const found = stage.questions.find((q) => q.id === id);
      if (found) return found;
    }
    return undefined;
  }
}

export const staticStageRepository = new StaticStageRepository();
