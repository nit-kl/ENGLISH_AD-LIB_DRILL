import type { ConversationExchange } from "@english-adlib/domain";
import { parseScoreFeedback, type ScoreFeedback } from "@english-adlib/domain";
import { ApiClientError, parseApiError } from "./api-error.js";

export { ApiClientError, type ApiErrorCode } from "./api-error.js";

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

/** POST /api/score — サーバー側で後処理済みの feedback を返す */
export async function scoreAnswer(
  questionId: string,
  userTurns: string | string[],
): Promise<ScoreFeedback> {
  const turns = (Array.isArray(userTurns) ? userTurns : [userTurns]).map((t) =>
    t.trim(),
  ).filter(Boolean);

  const res = await fetch(`${baseUrl}/api/score`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ questionId, userTurns: turns }),
  });
  if (!res.ok) throw await parseApiError(res);
  const data = (await res.json()) as { feedback?: unknown };
  if (data.feedback == null) {
    throw new ApiClientError("Invalid scoring response", "SCORING_FAILED", 502, true);
  }
  try {
    return parseScoreFeedback(data.feedback);
  } catch {
    throw new ApiClientError(
      "採点結果の形式が正しくありません",
      "SCORING_FAILED",
      502,
      true,
    );
  }
}

export async function transcribeAudio(
  blob: Blob,
  language?: "en" | "ja",
): Promise<string> {
  const form = new FormData();
  const ext = blob.type.includes("mp4") ? "m4a" : "webm";
  form.append("audio", blob, `recording.${ext}`);
  if (language) {
    form.append("language", language);
  }
  const res = await fetch(`${baseUrl}/api/transcribe`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) throw await parseApiError(res);
  const data = (await res.json()) as { text?: string };
  if (!data.text?.trim()) {
    throw new ApiClientError("Empty transcription", "TRANSCRIPTION_FAILED", 502, true);
  }
  return data.text.trim();
}

/** POST /api/conversation/turn — 中間ターンの相手返答 */
export async function submitConversationTurn(input: {
  questionId: string;
  userText: string;
  priorExchanges: readonly ConversationExchange[];
  turnIndex: number;
  totalTurns: number;
}): Promise<ConversationExchange> {
  const res = await fetch(`${baseUrl}/api/conversation/turn`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw await parseApiError(res);
  const data = (await res.json()) as { exchange?: ConversationExchange };
  if (!data.exchange?.userText || !data.exchange.counterpartLineEn) {
    throw new ApiClientError("Invalid conversation response", "SCORING_FAILED", 502, true);
  }
  return data.exchange;
}
