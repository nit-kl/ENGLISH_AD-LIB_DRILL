import type { Question, ScoreFeedback, ScoringService } from "@english-adlib/domain";
import { buildScoringSystemPrompt, buildScoringUserPrompt } from "../llm-prompts/scoring.js";
import { parseScoreLlmResponse } from "../lib/llm/parse-score-response.js";

export type AiBinding = {
  run(model: string, input: Record<string, unknown>): Promise<unknown>;
};

/** JSON 失敗時の再試行上限（Neuron は呼び出しごとに消費。Gemini フォールバック前に最小化） */
const MAX_ATTEMPTS = 2;

const PROVIDER_LABEL = "Workers AI";

function scoringErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null) {
    const record = error as Record<string, unknown>;
    if (typeof record.message === "string") return record.message;
    if (typeof record.error === "string") return record.error;
  }
  return "Scoring failed";
}

function isNonRetryableScoringFailure(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes("neuron") ||
    lower.includes("quota") ||
    lower.includes("rate limit") ||
    lower.includes("429") ||
    lower.includes("unauthorized") ||
    lower.includes("forbidden")
  );
}

function isRetryableScoringFailure(message: string): boolean {
  if (isNonRetryableScoringFailure(message)) return false;
  const lower = message.toLowerCase();
  return (
    lower.includes("json") ||
    lower.includes("parse") ||
    lower.includes("syntax") ||
    lower.includes("empty response") ||
    lower.includes("sceneupdateja") ||
    lower.includes("must be") ||
    lower.includes("incomplete") ||
    lower.includes("setup repeat") ||
    lower.includes("unexpected workers ai") ||
    lower.includes("timeout") ||
    lower.includes("unavailable") ||
    lower.includes("couldn't") ||
    lower.includes("internal") ||
    lower.includes("500") ||
    lower.includes("502") ||
    lower.includes("503")
  );
}

/** LLM 呼び出しと生 ScoreFeedback パースのみ（後処理は application 層） */
export class WorkersAiScoringService implements ScoringService {
  constructor(
    private readonly ai: AiBinding,
    private readonly model: string,
  ) {}

  async scoreAnswer(input: {
    question: Question;
    answerText: string;
  }): Promise<ScoreFeedback> {
    const messages = [
      { role: "system", content: buildScoringSystemPrompt(input.question) },
      {
        role: "user",
        content: buildScoringUserPrompt(input.question, input.answerText),
      },
    ];

    let lastError: unknown;

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
      try {
        const result = await this.ai.run(this.model, {
          messages,
          max_tokens: 700,
          temperature: attempt === 1 ? 0.35 : 0.15,
        });
        return parseScoreLlmResponse(result, input.question, PROVIDER_LABEL);
      } catch (error) {
        lastError = error;
        const message = scoringErrorMessage(error);
        if (attempt >= MAX_ATTEMPTS || !isRetryableScoringFailure(message)) {
          throw error;
        }
      }
    }

    throw lastError instanceof Error ? lastError : new Error("Scoring failed");
  }
}
