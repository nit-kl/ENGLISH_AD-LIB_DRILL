import type { Question, ScoreFeedback, ScoringService } from "@english-adlib/domain";
import {
  applyScoreFloor,
  coerceScoreFeedbackRaw,
  extractJsonFromLlmText,
  looksLikeSetupRepeat,
  parseScoreFeedback,
  resolveSceneUpdateJa,
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
  "sceneUpdateJa": string (REQUIRED: Japanese only, 2-4 sentences),
  "goodPoints": string[] (1-3 items, Japanese),
  "improvements": string[] (1-3 items, Japanese),
  "modelAnswer": string (English example of what the LEARNER could say)
}`;

function buildSystemPrompt(question: Question): string {
  return `You score English role-play answers for Japanese learners.

LEARNER plays: ${question.role}
Scene counterpart: ${question.counterpart}

sceneUpdateJa RULES (most important for the learner):
- Write ONLY in Japanese (no English in sceneUpdateJa)
- Describe ONLY what happened AFTER "Learner said" — the NEW state of the scene
- MUST mention something from the learner's answer (name, country, order, direction, etc.)
- Describe ${question.counterpart}'s reaction and the NEXT step in the conversation
- FORBIDDEN: copying "Situation (before learner spoke)" text, quoting the opening line, or ending with "〜してください" (that is the task instruction, not the update)
- FORBIDDEN: narrating how ${question.counterpart} first approached the learner if the learner already replied
- Do NOT list grammar scores or coaching in sceneUpdateJa

SCORING: Never give total 0 if the learner attempted on-topic English. Minor grammar mistakes should still score roughly 40-70. Reserve below 20 for empty or completely off-topic answers.

${sceneUpdateExample(question)}

Respond with ONLY valid JSON (no markdown, no text before or after) using this schema:
${JSON_SCHEMA}`;
}

function sceneUpdateExample(question: Question): string {
  if (question.id === "beginner-1") {
    return `GOOD sceneUpdateJa for "I'd like a small hot coffee":
「スモールのホットコーヒー」を注文したと受け止められ、店員は受け取りました。次は店内かテイクアウトかを聞かれる段階です。
BAD (never): restating the café greeting or "注文してください".`;
  }
  if (question.id === "beginner-2") {
    return `GOOD for "Nice to meet you. I'm Leo, I'm from Japan.":
レオさんが日本から来て留学中だと自己紹介したので、サラは笑顔でうなずき、学校や英語学習の話を続ける場面に進みました。
BAD (never): 「サラが Hi と話しかけてきました。自己紹介してください。」— that is BEFORE the learner spoke.`;
  }
  return `GOOD sceneUpdateJa must change when the learner's line changes. BAD: repeating the situation field.`;
}

function buildUserPrompt(question: Question, answerText: string): string {
  return [
    `Title: ${question.title} (${question.titleEn})`,
    `Learner role: ${question.role}`,
    `Counterpart: ${question.counterpart}`,
    `Situation (before learner spoke): ${question.situation}`,
    `Hints (optional expressions): ${question.hints.join(", ")}`,
    `Learner said: ${answerText}`,
    `Write sceneUpdateJa describing the situation AFTER this line.`,
  ].join("\n");
}

function isRetryableScoringFailure(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes("json") ||
    lower.includes("parse") ||
    lower.includes("syntax") ||
    lower.includes("empty response") ||
    lower.includes("sceneupdateja") ||
    lower.includes("must be") ||
    lower.includes("incomplete") ||
    lower.includes("setup repeat")
  );
}

function applySceneUpdateJa(
  feedback: ScoreFeedback,
  question: Question,
  answerText: string,
): ScoreFeedback {
  return {
    ...feedback,
    sceneUpdateJa: resolveSceneUpdateJa(
      feedback.sceneUpdateJa,
      question,
      answerText,
    ),
  };
}

function parseWorkersAiResponse(
  result: unknown,
  question: Question,
  answerText: string,
  attempt: number,
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
  if (
    looksLikeSetupRepeat(adjusted.sceneUpdateJa, question) &&
    attempt < MAX_ATTEMPTS
  ) {
    throw new Error("sceneUpdateJa looks like setup repeat");
  }
  return applySceneUpdateJa(adjusted, question, answerText);
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
        return parseWorkersAiResponse(
          result,
          input.question,
          input.answerText,
          attempt,
        );
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
