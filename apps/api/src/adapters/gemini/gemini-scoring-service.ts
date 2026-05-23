import type { Question, ScoreFeedback, ScoringService } from "@english-adlib/domain";
import { buildScoringSystemPrompt, buildScoringUserPrompt } from "../../llm-prompts/scoring.js";
import { parseScoreLlmResponse } from "../../lib/llm/parse-score-response.js";
import type { GeminiClient } from "./gemini-client.js";

const PROVIDER_LABEL = "Gemini";

/** Workers AI 失敗時の採点フォールバック（Gemini 無料枠・1 回） */
export class GeminiScoringService implements ScoringService {
  constructor(private readonly client: GeminiClient) {}

  async scoreAnswer(input: {
    question: Question;
    answerText: string;
  }): Promise<ScoreFeedback> {
    const text = await this.client.generateText({
      systemInstruction: buildScoringSystemPrompt(input.question),
      userText: buildScoringUserPrompt(input.question, input.answerText),
      maxOutputTokens: 700,
      temperature: 0.35,
      jsonMode: true,
    });

    return parseScoreLlmResponse(text, input.question, PROVIDER_LABEL);
  }
}
