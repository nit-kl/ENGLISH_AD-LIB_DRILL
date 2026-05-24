import {
  applyScoreFloor,
  resolveSceneUpdateJa,
  type Question,
  type ScoreFeedback,
  type ScoringService,
} from "@english-adlib/domain";
import { EmptyAnswerError } from "../errors/empty-answer-error.js";

export type SubmitAnswerInput = {
  question: Question;
  answerText: string;
};

/** 回答送信: 空チェック → 採点 → スコア floor → sceneUpdate 整形 */
export class SubmitAnswerUseCase {
  constructor(private readonly scoringService: ScoringService) {}

  async execute(input: SubmitAnswerInput): Promise<ScoreFeedback> {
    const trimmed = input.answerText.trim();
    if (!trimmed) {
      throw new EmptyAnswerError();
    }

    const raw = await this.scoringService.scoreAnswer({
      question: input.question,
      answerText: trimmed,
    });

    const adjusted = applyScoreFloor(raw, trimmed);
    return {
      ...adjusted,
      sceneUpdateJa: resolveSceneUpdateJa(adjusted.sceneUpdateJa),
    };
  }
}
