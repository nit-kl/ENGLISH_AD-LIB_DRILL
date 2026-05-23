import type { Question, ScoreFeedback } from "@english-adlib/domain";
import { isLowQualitySceneUpdateJa, parseScoreFeedback } from "@english-adlib/domain";
import { coerceScoreFeedbackRaw } from "./coerce-score-feedback.js";
import { extractJsonFromLlmText } from "./extract-llm-json.js";

function unwrapLlmPayload(result: unknown): unknown {
  if (typeof result === "object" && result !== null) {
    const record = result as Record<string, unknown>;
    if ("response" in record) return record.response;
    if (
      "total" in record &&
      "sceneUpdateJa" in record &&
      typeof record.sceneUpdateJa === "string"
    ) {
      return record;
    }
  }
  if (typeof result === "string" && result.trim()) {
    return result;
  }
  return null;
}

export function parseScoreLlmResponse(
  result: unknown,
  question: Question,
  providerLabel: string,
): ScoreFeedback {
  const response = unwrapLlmPayload(result);

  if (response == null || response === "") {
    throw new Error(`Empty response from ${providerLabel}`);
  }

  const raw =
    typeof response === "object"
      ? response
      : typeof response === "string"
        ? extractJsonFromLlmText(response)
        : null;

  if (raw == null) {
    throw new Error(`Unexpected ${providerLabel} response shape`);
  }

  const parsed = parseScoreFeedback(
    coerceScoreFeedbackRaw({
      ...(typeof raw === "object" && raw !== null ? raw : {}),
      modelAnswer: question.modelAnswer,
    }),
  );

  if (isLowQualitySceneUpdateJa(parsed.sceneUpdateJa, question)) {
    throw new Error("sceneUpdateJa must be Japanese prose, not a conversation log");
  }

  return parsed;
}
