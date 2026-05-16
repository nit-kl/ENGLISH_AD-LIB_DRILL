import type { Question, ScoreFeedback, ScoringService } from "@english-adlib/domain";

export type SubmitAnswerInput = {
  question: Question;
  answerText: string;
};

export class SubmitAnswerUseCase {
  constructor(private readonly scoringService: ScoringService) {}

  async execute(input: SubmitAnswerInput): Promise<ScoreFeedback> {
    const trimmed = input.answerText.trim();
    if (!trimmed) {
      throw new Error("Answer text must not be empty");
    }

    return this.scoringService.scoreAnswer({
      question: input.question,
      answerText: trimmed,
    });
  }
}
