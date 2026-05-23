import type {
  CounterpartReply,
  CounterpartReplyInput,
  CounterpartReplyService,
  Question,
} from "@english-adlib/domain";
import { extractJsonFromLlmText } from "../lib/llm/extract-llm-json.js";
import type { AiBinding } from "./workers-ai-scoring-service.js";

const JSON_SCHEMA_PROMPT = `{
  "counterpartLineEn": string (REQUIRED: English only, 1-3 sentences as the counterpart),
  "sceneUpdateJa": string (REQUIRED: Japanese only, 2-3 sentences describing the NEW scene state)
}`;

function buildSystemPrompt(question: Question): string {
  return `You are ${question.counterpart} in an English role-play for Japanese learners.

The learner plays: ${question.role}
You play: ${question.counterpart}

Generate YOUR next spoken line in English and a Japanese scene update.

RULES for counterpartLineEn:
- Reply naturally in English as ${question.counterpart}
- Keep it conversational (1-3 sentences)
- React to what the learner just said and move the conversation forward
- Do NOT score or coach the learner

RULES for sceneUpdateJa:
- Japanese only
- Describe what happened AFTER the learner's latest line
- Mention something from the learner's answer
- Do NOT repeat the situation setup or say "〜してください"

Respond with ONLY valid JSON:
${JSON_SCHEMA_PROMPT}`;
}

function buildUserPrompt(input: CounterpartReplyInput): string {
  const history =
    input.priorExchanges.length === 0
      ? ""
      : input.priorExchanges
          .map(
            (ex, i) =>
              `Turn ${i + 1}\nLearner: ${ex.userText}\n${input.question.counterpart}: ${ex.counterpartLineEn}`,
          )
          .join("\n\n") + "\n\n";

  return [
    `Title: ${input.question.title} (${input.question.titleEn})`,
    `Situation: ${input.question.situation}`,
    `Learner role: ${input.question.role}`,
    `Counterpart: ${input.question.counterpart}`,
    `Conversation progress: turn ${input.turnIndex + 1} of ${input.totalTurns} (NOT the final scoring turn)`,
    history,
    `Learner just said: ${input.userText}`,
    `Write ${input.question.counterpart}'s next English line and sceneUpdateJa.`,
  ].join("\n");
}

function parseCounterpartReply(result: unknown): CounterpartReply {
  const response =
    typeof result === "object" &&
    result !== null &&
    "response" in result
      ? (result as { response: unknown }).response
      : result;

  const raw =
    typeof response === "object" && response !== null
      ? response
      : typeof response === "string"
        ? extractJsonFromLlmText(response)
        : null;

  if (raw == null || typeof raw !== "object") {
    throw new Error("Unexpected Workers AI response shape");
  }

  const data = raw as Record<string, unknown>;
  const counterpartLineEn =
    typeof data.counterpartLineEn === "string" ? data.counterpartLineEn.trim() : "";
  const sceneUpdateJa =
    typeof data.sceneUpdateJa === "string" ? data.sceneUpdateJa.trim() : "";

  if (counterpartLineEn.length < 3) {
    throw new Error("counterpartLineEn is missing or too short");
  }
  if (sceneUpdateJa.length < 8) {
    throw new Error("sceneUpdateJa is missing or too short");
  }

  return { counterpartLineEn, sceneUpdateJa };
}

/** LLM で相手役の中間返答を生成（採点なし） */
export class WorkersAiCounterpartReplyService implements CounterpartReplyService {
  constructor(
    private readonly ai: AiBinding,
    private readonly model: string,
  ) {}

  async generateReply(input: CounterpartReplyInput): Promise<CounterpartReply> {
    const messages = [
      { role: "system", content: buildSystemPrompt(input.question) },
      { role: "user", content: buildUserPrompt(input) },
    ];

    const result = await this.ai.run(this.model, {
      messages,
      max_tokens: 400,
      temperature: 0.4,
    });

    return parseCounterpartReply(result);
  }
}
