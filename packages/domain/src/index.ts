export {
  type ConversationExchange,
  type CounterpartReply,
} from "./entities/conversation.js";
export { countWords, type Question } from "./entities/question.js";
export {
  hasQuestionMedia,
  type QuestionMedia,
  type QuestionVideoSegment,
} from "./entities/question-media.js";
export { type Stage, type StageKey } from "./entities/stage.js";
export { parseScoreFeedback, type ScoreFeedback } from "./entities/score-feedback.js";
export {
  buildSceneUpdateFallback,
  getSceneUpdateFallback,
  resolveSceneUpdateJa,
} from "./lib/scene-update-fallback.js";
export { looksLikeMalformedSceneUpdate, looksLikeSetupRepeat, isLowQualitySceneUpdateJa } from "./lib/scene-update-quality.js";
export {
  formatConversationTranscript,
  isFinalConversationTurn,
} from "./lib/conversation-transcript.js";
export { applyScoreFloor } from "./lib/score-adjustment.js";
export {
  type CounterpartReplyInput,
  type CounterpartReplyService,
} from "./ports/counterpart-reply-service.js";
export {
  type ScoreAnswerInput,
  type ScoringService,
} from "./ports/scoring-service.js";
export { type StageRepository } from "./ports/stage-repository.js";
export {
  type TranscribeOptions,
  type TranscriptionService,
} from "./ports/transcription-service.js";
