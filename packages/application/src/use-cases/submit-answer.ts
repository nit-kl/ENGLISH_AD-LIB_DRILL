import {
  applyScoreFloor,
  formatConversationTranscript,
  resolveSceneUpdateJa,
  type Question,
  type ScoreFeedback,
  type ScoringService,
} from "@english-adlib/domain";
import { EmptyAnswerError } from "../errors/empty-answer-error.js";

export type SubmitAnswerInput = {
  question: Question;
  /** 学習者の全発話（1往復=初級、複数往復=中級以上） */
  userTurns: string[];
};

/** 回答送信: 空チェック → 採点 → スコア floor → sceneUpdate 品質保証 */
export class SubmitAnswerUseCase {
  constructor(private readonly scoringService: ScoringService) {}

  async execute(input: SubmitAnswerInput): Promise<ScoreFeedback> {
    const trimmedTurns = input.userTurns.map((t) => t.trim()).filter(Boolean);
    if (trimmedTurns.length === 0) {
      throw new EmptyAnswerError();
    }

    const transcript = formatConversationTranscript(trimmedTurns);
    const lastTurn = trimmedTurns[trimmedTurns.length - 1]!;

    const raw = await this.scoringService.scoreAnswer({
      question: input.question,
      answerText: transcript,
    });

    const adjusted = applyScoreFloor(raw, lastTurn);
    return {
      ...adjusted,
      sceneUpdateJa: resolveSceneUpdateJa(
        adjusted.sceneUpdateJa,
        input.question,
        lastTurn,
      ),
    };
  }
}
