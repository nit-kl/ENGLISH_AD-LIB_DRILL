export { countWords, type Question } from "./entities/question.js";
export { parseScoreFeedback, type ScoreFeedback } from "./entities/score-feedback.js";
export { Grade, type GradeData } from "./value-objects/grade.js";
export {
  type ScoreAnswerInput,
  type ScoringService,
} from "./ports/scoring-service.js";
export {
  CERT_QUESTION_IDS,
  STAGES,
  getCertQuestions,
  getQuestionById,
  type Stage,
  type StageKey,
} from "./data/stages.js";
