const SCORE_FIELDS = ["total", "fluency", "grammar", "vocabulary", "relevance"] as const;

const DEFAULT_GOOD_POINTS = ["英語で返答できています"];
const DEFAULT_IMPROVEMENTS = ["表現を確認してみましょう"];

function toScore(value: unknown): number | undefined {
  if (typeof value === "number" && !Number.isNaN(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value);
    if (!Number.isNaN(n)) return n;
  }
  return undefined;
}

function toStringArray(value: unknown, fallback: string[]): string[] {
  if (typeof value === "string" && value.trim()) {
    return [value.trim()];
  }
  if (!Array.isArray(value)) return fallback;
  const items = value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter((item) => item.length > 0);
  return items.length > 0 ? items : fallback;
}

/**
 * 小さい LLM が返しがちな型ゆれ（文字列の点数・空配列など）を吸収する。
 */
export function coerceScoreFeedbackRaw(raw: unknown): unknown {
  if (typeof raw !== "object" || raw === null) return raw;

  const data = { ...(raw as Record<string, unknown>) };

  for (const field of SCORE_FIELDS) {
    const n = toScore(data[field]);
    if (n !== undefined) data[field] = n;
  }

  data.goodPoints = toStringArray(data.goodPoints, DEFAULT_GOOD_POINTS);
  data.improvements = toStringArray(data.improvements, DEFAULT_IMPROVEMENTS);

  if (typeof data.reply === "string") {
    data.reply = data.reply.trim();
  }
  if (typeof data.modelAnswer === "string") {
    data.modelAnswer = data.modelAnswer.trim();
  }

  return data;
}
