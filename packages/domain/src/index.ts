export { countWords, type Question } from "./entities/question.js";
export {
  hasQuestionMedia,
  type QuestionMedia,
  type QuestionVideoSegment,
} from "./entities/question-media.js";
export { parseScoreFeedback, type ScoreFeedback } from "./entities/score-feedback.js";
export {
  type ScoreAnswerInput,
  type ScoringService,
} from "./ports/scoring-service.js";
export {
  STAGES,
  getQuestionById,
  type Stage,
  type StageKey,
} from "./data/stages.js";
