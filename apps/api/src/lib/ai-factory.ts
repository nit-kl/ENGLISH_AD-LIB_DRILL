import type { ScoringService, TranscriptionService } from "@english-adlib/domain";
import { FallbackScoringService } from "../adapters/fallback-scoring-service.js";
import { FallbackTranscriptionService } from "../adapters/fallback-transcription-service.js";
import { GeminiClient } from "../adapters/gemini/gemini-client.js";
import { GeminiScoringService } from "../adapters/gemini/gemini-scoring-service.js";
import { GeminiTranscriptionService } from "../adapters/gemini/gemini-transcription-service.js";
import { WhisperTranscriptionService } from "../adapters/whisper-transcription-service.js";
import {
  WorkersAiScoringService,
  type AiBinding,
} from "../adapters/workers-ai-scoring-service.js";

export type ApiBindings = {
  AI: AiBinding;
  SCORING_MODEL: string;
  ALLOWED_ORIGIN?: string;
  GEMINI_API_KEY?: string;
  GEMINI_MODEL?: string;
  GEMINI_FALLBACK_ENABLED?: string;
};

function isGeminiFallbackEnabled(env: ApiBindings): boolean {
  return (
    env.GEMINI_FALLBACK_ENABLED === "true" &&
    Boolean(env.GEMINI_API_KEY?.trim())
  );
}

function createGeminiClient(env: ApiBindings): GeminiClient {
  const apiKey = env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }
  return new GeminiClient({
    apiKey,
    model: env.GEMINI_MODEL?.trim() || "gemini-2.5-flash-lite",
  });
}

function logGeminiFallback(feature: string): void {
  console.log(`[ai-fallback] ${feature}: using Gemini (Workers AI failed)`);
}

export function createScoringService(env: ApiBindings): ScoringService {
  const workers = new WorkersAiScoringService(env.AI, env.SCORING_MODEL);
  if (!isGeminiFallbackEnabled(env)) {
    return workers;
  }
  const gemini = new GeminiScoringService(createGeminiClient(env));
  return new FallbackScoringService(workers, gemini, () =>
    logGeminiFallback("scoring"),
  );
}

export function createTranscriptionService(env: ApiBindings): TranscriptionService {
  const whisper = new WhisperTranscriptionService(env.AI);
  if (!isGeminiFallbackEnabled(env)) {
    return whisper;
  }
  const gemini = new GeminiTranscriptionService(createGeminiClient(env));
  return new FallbackTranscriptionService(whisper, gemini, () =>
    logGeminiFallback("transcription"),
  );
}
