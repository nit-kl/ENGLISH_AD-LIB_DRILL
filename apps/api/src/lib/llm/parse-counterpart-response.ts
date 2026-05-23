import type { CounterpartReply } from "@english-adlib/domain";
import { looksLikeMalformedSceneUpdate } from "@english-adlib/domain";
import { extractJsonFromLlmText } from "./extract-llm-json.js";

export function parseCounterpartLlmResponse(
  result: unknown,
  providerLabel: string,
): CounterpartReply {
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
    throw new Error(`Unexpected ${providerLabel} response shape`);
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
  if (looksLikeMalformedSceneUpdate(sceneUpdateJa)) {
    throw new Error("sceneUpdateJa must be Japanese prose, not a conversation log");
  }

  return { counterpartLineEn, sceneUpdateJa };
}
