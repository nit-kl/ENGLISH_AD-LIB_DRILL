import {
  applyScoreFloor,
  formatConversationTranscript,
  formatFullConversationForScoring,
  resolveSceneUpdateJa,
  type ConversationExchange,
  type Question,
  type ScoreFeedback,
  type ScoringService,
} from "@english-adlib/domain";
import { EmptyAnswerError } from "../errors/empty-answer-error.js";

export type SubmitAnswerInput = {
  question: Question;
  /** 学習者の全発話（1往復=初級、複数往復=中級以上） */
  userTurns: string[];
  /** 中級以上: 最終ターンより前のやり取り（相手の返答を含む） */
  priorExchanges?: readonly ConversationExchange[];
};

function buildScoringTranscript(
  question: Question,
  trimmedTurns: string[],
  priorExchanges: readonly ConversationExchange[],
): string {
  const lastTurn = trimmedTurns[trimmedTurns.length - 1]!;

  if (priorExchanges.length > 0) {
    return formatFullConversationForScoring(
      priorExchanges,
      lastTurn,
      question.counterpart,
    );
  }

  if (trimmedTurns.length > 1) {
    return formatConversationTranscript(trimmedTurns);
  }

  return lastTurn;
}

function pickConversationSceneFallback(
  priorExchanges: readonly ConversationExchange[],
): string | undefined {
  for (let i = priorExchanges.length - 1; i >= 0; i -= 1) {
    const scene = priorExchanges[i]?.sceneUpdateJa.trim();
    if (scene) return scene;
  }
  return undefined;
}

/** 回答送信: 空チェック → 採点 → スコア floor → sceneUpdate 整形 */
export class SubmitAnswerUseCase {
  constructor(private readonly scoringService: ScoringService) {}

  async execute(input: SubmitAnswerInput): Promise<ScoreFeedback> {
    const trimmedTurns = input.userTurns.map((t) => t.trim()).filter(Boolean);
    if (trimmedTurns.length === 0) {
      throw new EmptyAnswerError();
    }

    const lastTurn = trimmedTurns[trimmedTurns.length - 1]!;
    const priorExchanges = input.priorExchanges ?? [];
    const transcript = buildScoringTranscript(
      input.question,
      trimmedTurns,
      priorExchanges,
    );

    const raw = await this.scoringService.scoreAnswer({
      question: input.question,
      answerText: transcript,
    });

    const adjusted = applyScoreFloor(raw, lastTurn);
    return {
      ...adjusted,
      sceneUpdateJa: resolveSceneUpdateJa(
        adjusted.sceneUpdateJa,
        pickConversationSceneFallback(priorExchanges),
      ),
    };
  }
}
