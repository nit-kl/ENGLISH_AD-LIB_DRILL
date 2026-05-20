export type ScoreFeedback = {
  total: number;
  fluency: number;
  grammar: number;
  vocabulary: number;
  relevance: number;
  /** 学習者の回答によって場面がどう変わったか（日本語） */
  sceneUpdateJa: string;
  /** @deprecated UI 非表示。互換用にパースのみ残す */
  reply?: string;
  goodPoints: string[];
  improvements: string[];
  modelAnswer: string;
};

function assertScoreInRange(value: unknown, field: string): asserts value is number {
  if (typeof value !== "number" || Number.isNaN(value) || value < 0 || value > 100) {
    throw new Error(`${field} must be a number between 0 and 100`);
  }
}

function resolveSceneUpdateJa(data: Record<string, unknown>): string {
  if (typeof data.sceneUpdateJa === "string" && data.sceneUpdateJa.trim().length > 0) {
    return data.sceneUpdateJa.trim();
  }
  throw new Error("sceneUpdateJa must be a non-empty string");
}

function resolveOptionalReply(data: Record<string, unknown>): string | undefined {
  if (typeof data.reply === "string" && data.reply.trim().length > 0) {
    return data.reply.trim();
  }
  return undefined;
}

function assertStringArray(value: unknown, field: string): asserts value is string[] {
  if (
    !Array.isArray(value) ||
    !value.every((item) => typeof item === "string" && item.length > 0)
  ) {
    throw new Error(`${field} must be a non-empty string array`);
  }
}

export function parseScoreFeedback(raw: unknown): ScoreFeedback {
  if (typeof raw !== "object" || raw === null) {
    throw new Error("ScoreFeedback must be an object");
  }

  const data = raw as Record<string, unknown>;

  assertScoreInRange(data.total, "total");
  assertScoreInRange(data.fluency, "fluency");
  assertScoreInRange(data.grammar, "grammar");
  assertScoreInRange(data.vocabulary, "vocabulary");
  assertScoreInRange(data.relevance, "relevance");
  assertStringArray(data.goodPoints, "goodPoints");
  assertStringArray(data.improvements, "improvements");

  const sceneUpdateJa = resolveSceneUpdateJa(data);
  const reply = resolveOptionalReply(data);

  if (typeof data.modelAnswer !== "string" || data.modelAnswer.trim().length === 0) {
    throw new Error("modelAnswer must be a non-empty string");
  }

  return {
    total: data.total,
    fluency: data.fluency,
    grammar: data.grammar,
    vocabulary: data.vocabulary,
    relevance: data.relevance,
    sceneUpdateJa,
    ...(reply !== undefined ? { reply } : {}),
    goodPoints: data.goodPoints,
    improvements: data.improvements,
    modelAnswer: data.modelAnswer.trim(),
  };
}
