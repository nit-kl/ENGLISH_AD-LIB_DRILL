import type { Question, ScoreFeedback, ScoringService } from "@english-adlib/domain";
import { parseScoreFeedback } from "@english-adlib/domain";

export type AiBinding = {
  run(model: string, input: Record<string, unknown>): Promise<unknown>;
};

const SYSTEM_PROMPT = `You are an English conversation coach for Japanese learners.
Score the user's spoken/written answer for the given role-play situation.
Respond with ONLY valid JSON (no markdown) using this schema:
{
  "total": number 0-100,
  "fluency": number 0-100,
  "grammar": number 0-100,
  "vocabulary": number 0-100,
  "relevance": number 0-100,
  "goodPoints": string[] (1-3 items, Japanese),
  "improvements": string[] (1-3 items, Japanese),
  "modelAnswer": string (English example answer)
}`;

function buildUserPrompt(question: Question, answerText: string): string {
  return [
    `Title: ${question.title} (${question.titleEn})`,
    `Role: ${question.role}`,
    `Situation: ${question.situation}`,
    `Hints (optional expressions): ${question.hints.join(", ")}`,
    `User answer: ${answerText}`,
  ].join("\n");
}

function extractJson(text: string): unknown {
  const trimmed = text.trim();
  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenceMatch ? fenceMatch[1].trim() : trimmed;
  return JSON.parse(candidate);
}

export class WorkersAiScoringService implements ScoringService {
  constructor(
    private readonly ai: AiBinding,
    private readonly model: string,
  ) {}

  async scoreAnswer(input: {
    question: Question;
    answerText: string;
  }): Promise<ScoreFeedback> {
    const result = (await this.ai.run(this.model, {
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: buildUserPrompt(input.question, input.answerText),
        },
      ],
      max_tokens: 700,
    })) as { response?: string };

    const rawText = result.response ?? "";
    if (!rawText) {
      throw new Error("Empty response from Workers AI");
    }

    return parseScoreFeedback(extractJson(rawText));
  }
}
