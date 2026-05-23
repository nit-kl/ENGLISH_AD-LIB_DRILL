import { describe, expect, it } from "vitest";
import {
  createCounterpartReplyService,
  createScoringService,
  createTranscriptionService,
  type ApiBindings,
} from "../src/lib/ai-factory.js";
import { FallbackScoringService } from "../src/adapters/fallback-scoring-service.js";
import { WorkersAiScoringService } from "../src/adapters/workers-ai-scoring-service.js";

const baseEnv: ApiBindings = {
  AI: { async run() { return {}; } },
  SCORING_MODEL: "@cf/meta/llama-3.2-1b-instruct",
  GEMINI_FALLBACK_ENABLED: "false",
};

describe("ai-factory", () => {
  it("GEMINI_FALLBACK_ENABLED=false のとき Workers のみ", () => {
    const service = createScoringService(baseEnv);
    expect(service).toBeInstanceOf(WorkersAiScoringService);
  });

  it("GEMINI_FALLBACK_ENABLED=true かつ API キーありのとき Fallback", () => {
    const service = createScoringService({
      ...baseEnv,
      GEMINI_FALLBACK_ENABLED: "true",
      GEMINI_API_KEY: "test-key",
    });
    expect(service).toBeInstanceOf(FallbackScoringService);
  });

  it("API キーなしのとき Fallback にならない", () => {
    const service = createScoringService({
      ...baseEnv,
      GEMINI_FALLBACK_ENABLED: "true",
    });
    expect(service).toBeInstanceOf(WorkersAiScoringService);
  });

  it("createTranscriptionService / createCounterpartReplyService が生成できる", () => {
    expect(createTranscriptionService(baseEnv)).toBeDefined();
    expect(createCounterpartReplyService(baseEnv)).toBeDefined();
  });
});
