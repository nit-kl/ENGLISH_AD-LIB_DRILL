import {
  formatConversationTranscript,
  hasQuestionMedia,
  isFinalConversationTurn,
  type ConversationExchange,
  type Question,
  type StageKey,
} from "@english-adlib/domain";
import { STAGES } from "@english-adlib/content";

export type Screen =
  | "title"
  | "stageSelect"
  | "questionList"
  | "playing"
  | "reveal";

/** 動画お題なし、またはお題未選択なら即回答可能 */
export function initialSetupComplete(question: Question | undefined): boolean {
  return question == null || !hasQuestionMedia(question);
}

export function getQuestionsForStage(stageKey: StageKey | null): Question[] {
  if (!stageKey) return [];
  return STAGES[stageKey].questions;
}

export function getConversationTurnsForStage(stageKey: StageKey | null): number {
  if (!stageKey) return 1;
  return STAGES[stageKey].conversationTurns;
}

export function getCurrentTurnIndex(exchanges: readonly ConversationExchange[]): number {
  return exchanges.length;
}

export function isOnFinalTurn(
  exchanges: readonly ConversationExchange[],
  stageKey: StageKey | null,
): boolean {
  const totalTurns = getConversationTurnsForStage(stageKey);
  return isFinalConversationTurn(getCurrentTurnIndex(exchanges), totalTurns);
}

export function formatUserAnswerForDisplay(
  exchanges: readonly ConversationExchange[],
  currentInput: string,
): string {
  const turns = [...exchanges.map((e) => e.userText), currentInput.trim()].filter(Boolean);
  return formatConversationTranscript(turns);
}

export function markQuestionComplete(
  completedIds: ReadonlySet<string>,
  questionId: string,
): Set<string> {
  return new Set(completedIds).add(questionId);
}

export type PlayStateReset = {
  userInput: string;
  timeLeft: number;
  score: null;
  feedback: null;
  showScoring: false;
  submitError: null;
  setupComplete: boolean;
  answerTimerActive: boolean;
  conversationExchanges: ConversationExchange[];
};

/** お題切替・一覧戻り時のプレイ状態リセット値 */
export function createPlayStateReset(question?: Question): PlayStateReset {
  const ready = initialSetupComplete(question);
  return {
    userInput: "",
    timeLeft: 60,
    score: null,
    feedback: null,
    showScoring: false,
    submitError: null,
    setupComplete: ready,
    answerTimerActive: ready,
    conversationExchanges: [],
  };
}

/** 中間ターン完了後: 入力クリア・タイマーリセット */
export function createMidTurnReset(): Pick<
  PlayStateReset,
  "userInput" | "timeLeft" | "submitError"
> {
  return {
    userInput: "",
    timeLeft: 60,
    submitError: null,
  };
}
