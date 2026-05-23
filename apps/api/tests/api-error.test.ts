import { describe, expect, it } from "vitest";
import { classifyScoringError } from "../src/lib/api-error.js";

describe("classifyScoringError", () => {
  it("Neuron 超過を QUOTA_EXCEEDED 503 に分類", () => {
    const result = classifyScoringError(new Error("Daily neuron limit exceeded"));
    expect(result.code).toBe("QUOTA_EXCEEDED");
    expect(result.status).toBe(503);
    expect(result.retryable).toBe(false);
  });

  it("JSON パース失敗をリトライ可能な SCORING_FAILED に分類", () => {
    const result = classifyScoringError(new Error("Unexpected token in JSON"));
    expect(result.code).toBe("SCORING_FAILED");
    expect(result.retryable).toBe(true);
  });

  it("Gemini 429 を QUOTA_EXCEEDED に分類", () => {
    const result = classifyScoringError(
      new Error("Gemini API error 429: Resource exhausted"),
    );
    expect(result.code).toBe("QUOTA_EXCEEDED");
    expect(result.status).toBe(503);
  });
});
