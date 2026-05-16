import type { Question } from "../entities/question.js";
import type { ScoreFeedback } from "../entities/score-feedback.js";

export type ScoreAnswerInput = {
  question: Question;
  answerText: string;
};

export interface ScoringService {
  scoreAnswer(input: ScoreAnswerInput): Promise<ScoreFeedback>;
}
