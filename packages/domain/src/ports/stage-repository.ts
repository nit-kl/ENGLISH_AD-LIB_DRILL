import type { Question } from "../entities/question.js";
import type { Stage } from "../entities/stage.js";

export interface StageRepository {
  getAllStages(): Stage[];
  getQuestionById(id: string): Question | undefined;
}
