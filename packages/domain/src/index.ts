export { countWords, type Question } from "./entities/question.js";
export {
  hasQuestionMedia,
  type QuestionMedia,
  type QuestionVideoSegment,
} from "./entities/question-media.js";
export { type Stage, type StageKey } from "./entities/stage.js";
export { parseScoreFeedback, type ScoreFeedback } from "./entities/score-feedback.js";
export { resolveSceneUpdateJa } from "./lib/scene-update-fallback.js";
export { looksLikeMalformedSceneUpdate, looksLikeSetupRepeat } from "./lib/scene-update-quality.js";
export { applyScoreFloor } from "./lib/score-adjustment.js";
export {
  type ScoreAnswerInput,
  type ScoringService,
} from "./ports/scoring-service.js";
export { type StageRepository } from "./ports/stage-repository.js";
export {
  type TranscribeOptions,
  type TranscriptionService,
} from "./ports/transcription-service.js";
