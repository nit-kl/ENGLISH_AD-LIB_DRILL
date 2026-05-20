import type { Question, ScoreFeedback, ScoringService } from "@english-adlib/domain";
import {
  applyScoreFloor,
  coerceScoreFeedbackRaw,
  extractJsonFromLlmText,
  normalizeSceneReply,
  parseScoreFeedback,
} from "@english-adlib/domain";

export type AiBinding = {
  run(model: string, input: Record<string, unknown>): Promise<unknown>;
};

const MAX_ATTEMPTS = 3;

const JSON_SCHEMA = `{
  "total": number 0-100,
  "fluency": number 0-100,
  "grammar": number 0-100,
  "vocabulary": number 0-100,
  "relevance": number 0-100,
  "reply": string (see REPLY RULES below),
  "goodPoints": string[] (1-3 items, Japanese, for scoring only—not shown as reply),
  "improvements": string[] (1-3 items, Japanese, for scoring only),
  "modelAnswer": string (English example of what the LEARNER could say)
}`;

function buildSystemPrompt(question: Question): string {
  return `You score English role-play answers for Japanese learners.

LEARNER plays: ${question.role}
REPLY CHARACTER (write "reply" as this person only): ${question.counterpart}

REPLY RULES for "reply":
- MUST be ENGLISH ONLY (no Japanese characters in "reply")
- 1-2 short sentences from ${question.counterpart} continuing the scene AFTER the learner spoke
- Confirm what you understood, then one brief follow-up if natural (e.g. for here or to go)
- Interpret intent even if grammar is wrong; fix their wording silently—do NOT echo mistakes
- Do NOT speak as the learner (${question.role})
- Do NOT coach, grade, or use Japanese in "reply"
- goodPoints/improvements are Japanese for internal scoring only—never put them in "reply"

SCORING: Never give total 0 if the learner attempted on-topic English. Minor grammar mistakes should still score roughly 40-70. Reserve below 20 for empty or completely off-topic answers.

${sceneReplyExample(question)}

Respond with ONLY valid JSON (no markdown, no text before or after) using this schema:
${JSON_SCHEMA}`;
}

function sceneReplyExample(question: Question): string {
  if (question.id === "beginner-1") {
    return `EXAMPLE:
Learner said: "I'd like to tall latte"
reply: "Sure, one tall iced latte. Would you like that for here or to go?"`;
  }
  return `EXAMPLE reply style: short English from ${question.counterpart}, not Japanese.`;
}

function buildUserPrompt(question: Question, answerText: string): string {
  return [
    `Title: ${question.title} (${question.titleEn})`,
    `Learner role: ${question.role}`,
    `Reply as: ${question.counterpart}`,
    `Situation: ${question.situation}`,
    `Hints (optional expressions): ${question.hints.join(", ")}`,
    `Learner said: ${answerText}`,
  ].join("\n");
}

function isRetryableScoringFailure(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes("json") ||
    lower.includes("parse") ||
    lower.includes("syntax") ||
    lower.includes("empty response") ||
    lower.includes("reply must") ||
    lower.includes("must be") ||
    lower.includes("incomplete")
  );
}

function parseWorkersAiResponse(
  result: unknown,
  question: Question,
  answerText: string,
): ScoreFeedback {
  const payload = result as { response?: unknown };
  const response = payload.response;

  if (response == null || response === "") {
    throw new Error("Empty response from Workers AI");
  }

  const raw =
    typeof response === "object"
      ? response
      : typeof response === "string"
        ? extractJsonFromLlmText(response)
        : null;

  if (raw == null) {
    throw new Error("Unexpected Workers AI response shape");
  }

  const parsed = parseScoreFeedback(coerceScoreFeedbackRaw(raw));
  const adjusted = applyScoreFloor(parsed, answerText);
  return {
    ...adjusted,
    reply: normalizeSceneReply(adjusted.reply, question),
  };
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
    const messages = [
      { role: "system", content: buildSystemPrompt(input.question) },
      {
        role: "user",
        content: buildUserPrompt(input.question, input.answerText),
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
        return parseWorkersAiResponse(result, input.question, input.answerText);
      } catch (error) {
        lastError = error;
        const message = error instanceof Error ? error.message : "Scoring failed";
        if (attempt >= MAX_ATTEMPTS || !isRetryableScoringFailure(message)) {
          throw error;
        }
      }
    }

    throw lastError instanceof Error ? lastError : new Error("Scoring failed");
  }
}
